# ==============================================================================
# Pinhas Ratzon — deployment (local Windows side)
#
# Builds and verifies the site locally, pushes to GitHub, then hands over to
# deploy_linux.sh on the server, which rebuilds from source and publishes to
# https://pinhasratzon.co.il/
# ==============================================================================

param (
    [string]$CommitMessage = "",
    [string]$RepoUrl = "https://github.com/lironatar1994-coder/PinhasRatzon.git",
    [string]$Branch = "main",
    [string]$SSHHost = "root@vee-app.co.il",
    [string]$SSHHostName = "vee-app.co.il",
    [string]$RemoteDir = "/root/PinhasRatzon",
    [string]$SiteUrl = "https://pinhasratzon.co.il/",
    [switch]$SkipVerify
)

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectRoot
$SiteDir = Join-Path $ProjectRoot "site"

function Assert-LastExitCode([string]$Action) {
    if ($LASTEXITCODE -ne 0) { throw "$Action failed with exit code $LASTEXITCODE." }
}

Write-Host "--- Deploying the Pinhas Ratzon site ---" -ForegroundColor Cyan

foreach ($required in @("site\build.mjs", "site\check.mjs", "site\src\site.mjs", "deploy_linux.sh")) {
    if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot $required))) {
        throw "Missing required path: $required"
    }
}

# The whole site is derived from SITE_URL — canonicals, Open Graph, the sitemap,
# the JSON-LD and the path prefix on every internal link. A mismatch here ships
# a site that links to the wrong host, so it is checked before anything else.
$siteConfig = Get-Content -LiteralPath (Join-Path $SiteDir "src\site.mjs") -Raw -Encoding UTF8
$expectedSiteUrl = $SiteUrl.TrimEnd('/')
if ($siteConfig -notmatch [regex]::Escape("export const SITE_URL = '$expectedSiteUrl'")) {
    throw "SITE_URL in site\src\site.mjs is not '$expectedSiteUrl'. Fix it before deploying."
}

if (-not $SkipVerify) {
    Write-Host "Building the site..." -ForegroundColor Gray
    Push-Location $SiteDir
    try {
        & node build.mjs
        Assert-LastExitCode "node build.mjs"

        Write-Host "Verifying the build..." -ForegroundColor Gray
        & node check.mjs
        Assert-LastExitCode "node check.mjs"

        foreach ($gate in @("verify-build", "verify-contrast", "verify-restraint", "verify-typography")) {
            Write-Host "  gate: $gate" -ForegroundColor DarkGray
            & node "gates/$gate.mjs"
            Assert-LastExitCode "gate $gate"
        }
    }
    finally {
        Pop-Location
    }

    # A sub-path deployment needs every internal URL to carry that prefix. At a
    # domain root, root-relative URLs are exactly what we want.
    $routePath = ([uri]$expectedSiteUrl).AbsolutePath.TrimEnd('/')
    if ($routePath) {
        $pages = Get-ChildItem -LiteralPath (Join-Path $SiteDir "dist") -Recurse -Filter *.html
        $bad = $pages | Select-String -Pattern ('(href|src)="/(?!' + [regex]::Escape($routePath.TrimStart('/')) + ')')
        if ($bad) {
            $bad | Select-Object -First 5 | ForEach-Object { Write-Host "  $($_.Filename): $($_.Matches[0].Value)" -ForegroundColor Red }
            throw "Built pages contain root-relative links without the $routePath prefix."
        }
    }
}
else {
    Write-Host "Skipping the local build and verification (-SkipVerify)." -ForegroundColor Yellow
}

Write-Host "Checking server connectivity..." -ForegroundColor Gray
if (-not (Test-Connection -ComputerName $SSHHostName -Count 1 -Quiet)) {
    throw "Could not reach $SSHHostName"
}

if (-not (Test-Path ".\.git")) {
    Write-Host "Initializing the local git repository..." -ForegroundColor Gray
    git init
    Assert-LastExitCode "git init"
}

git branch -M $Branch
Assert-LastExitCode "git branch -M $Branch"

$hasOrigin = (git remote) -contains "origin"
if (-not $hasOrigin) {
    git remote add origin $RepoUrl
    Assert-LastExitCode "git remote add origin"
}
else {
    $origin = git remote get-url origin
    if ($origin -ne $RepoUrl) { git remote set-url origin $RepoUrl }
}

$status = git status --porcelain
$branchStatus = git status --short --branch
$hasCommit = -not (($branchStatus -join "`n") -match "No commits yet")

if ($status -or -not $hasCommit) {
    $Message = $CommitMessage
    if (-not $Message) { $Message = Read-Host "Changes detected. Enter a commit message" }
    if (-not $Message) { $Message = "Deploy the Pinhas Ratzon site" }

    Write-Host "Staging and committing changes..." -ForegroundColor Gray
    git add -A
    Assert-LastExitCode "git add"

    # bash on the server runs deploy_linux.sh directly; Windows has no execute
    # bit, so it is set on the index entry instead.
    git update-index --chmod=+x deploy_linux.sh
    Assert-LastExitCode "git update-index --chmod=+x deploy_linux.sh"

    git commit -m "$Message"
    Assert-LastExitCode "git commit"
}
else {
    Write-Host "No local changes to commit." -ForegroundColor Gray
}

Write-Host "Pushing to GitHub..." -ForegroundColor Gray
git push -u origin $Branch
if ($LASTEXITCODE -ne 0) { throw "git push failed. The remote deployment was not started." }

Write-Host "Ensuring the remote checkout exists..." -ForegroundColor Blue
$cloneCmd = "if [ ! -d '$RemoteDir/.git' ]; then rm -rf '$RemoteDir' && git clone '$RepoUrl' '$RemoteDir'; fi"
ssh $SSHHost $cloneCmd
Assert-LastExitCode "Remote clone/setup"

Write-Host "Running the remote deployment..." -ForegroundColor Blue
$remoteCmd = "cd '$RemoteDir' && chmod +x deploy_linux.sh && ./deploy_linux.sh"
ssh $SSHHost $remoteCmd

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n[!] DEPLOYMENT FAILED" -ForegroundColor Red
    exit $LASTEXITCODE
}

# Nginx finishes its reload a moment after systemctl returns, so the first
# request can still land on the old configuration.
Write-Host "`nVerifying the live site..." -ForegroundColor Gray
$verified = $false
foreach ($attempt in 1..5) {
    try {
        $response = Invoke-WebRequest -Uri $SiteUrl -UseBasicParsing -TimeoutSec 25
        if ($response.StatusCode -eq 200) {
            Write-Host "  $SiteUrl -> HTTP 200" -ForegroundColor Gray
            $verified = $true
            break
        }
        $lastError = "HTTP $($response.StatusCode)"
    }
    catch {
        $lastError = $_.Exception.Message
    }
    Start-Sleep -Seconds 3
}
if (-not $verified) {
    Write-Host "  Could not verify $SiteUrl after 5 attempts: $lastError" -ForegroundColor Yellow
}

Write-Host "`n================================================" -ForegroundColor Green
Write-Host "      DEPLOYMENT COMPLETE" -ForegroundColor Green
Write-Host "      $SiteUrl" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
