#!/usr/bin/env bash

# ==============================================================================
# Pinhas Ratzon — server-side deployment (runs on root@vee-app.co.il)
#
# Pulls the repository, rebuilds the static site from source, verifies it, and
# publishes it to https://lawebs.co.il/PinhasRatzon/ behind Nginx.
# Invoked by deploy.ps1; safe to run by hand from the checkout.
# ==============================================================================

set -euo pipefail

APP_NAME="PinhasRatzon"
ROUTE_BASE="/PinhasRatzon"
LOWER_ROUTE_BASE="/pinhasratzon"
DOMAIN="lawebs.co.il"
SITE_DIR="site"
WEB_ROOT="/var/www/${APP_NAME}"
STAGE_ROOT="/var/www/.${APP_NAME}.next"
OLD_ROOT="/var/www/.${APP_NAME}.old"
NGINX_SITE="/etc/nginx/sites-available/${DOMAIN}.conf"
NGINX_SNIPPET="/etc/nginx/snippets/${APP_NAME}-locations.conf"

echo "[INFO] Starting ${APP_NAME} deployment..."

if [ ! -f "${SITE_DIR}/build.mjs" ]; then
  echo "[ERROR] ${SITE_DIR}/build.mjs was not found in $(pwd)" >&2
  exit 1
fi

echo "[INFO] Pulling latest code..."
git fetch origin main
git reset --hard origin/main

# The reset above may have just rewritten THIS file. Bash reads a script
# incrementally by byte offset, so continuing here would execute the new file
# from a stale offset and silently skip or garble the rest of the deploy.
# Re-exec once so the remainder runs from stable source.
if [ -z "${DEPLOY_REEXEC:-}" ]; then
  echo "[INFO] Re-executing with the updated deploy script..."
  export DEPLOY_REEXEC=1
  exec bash "$0" "$@"
fi

if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] node is not installed on this server; the site cannot be built." >&2
  exit 1
fi
echo "[INFO] node $(node -v)"

echo "[INFO] Building the site..."
( cd "${SITE_DIR}" && node build.mjs )

# Everything below runs before the live web root is touched, so a failure here
# leaves the currently published site exactly as it was.
echo "[INFO] Verifying the build..."
( cd "${SITE_DIR}" && node check.mjs )
for gate in verify-build verify-contrast verify-restraint verify-typography; do
  echo "[INFO] gate: ${gate}"
  ( cd "${SITE_DIR}" && node "gates/${gate}.mjs" )
done

if [ ! -f "${SITE_DIR}/dist/index.html" ]; then
  echo "[ERROR] ${SITE_DIR}/dist/index.html is missing after the build." >&2
  exit 1
fi

# Sanity: every internal link in the output must carry the route prefix, or the
# site would 404 against itself once it is served from a sub-path.
if grep -rqP "(href|src)=\"/(?!${APP_NAME})" --include='*.html' "${SITE_DIR}/dist"; then
  echo "[ERROR] Built pages contain root-relative links without the ${ROUTE_BASE} prefix." >&2
  echo "        Check SITE_URL / BASE_PATH in ${SITE_DIR}/src/site.mjs." >&2
  exit 1
fi

echo "[INFO] Staging the new web root..."
rm -rf "${STAGE_ROOT}"
mkdir -p "${STAGE_ROOT}"
cp -a "${SITE_DIR}/dist/." "${STAGE_ROOT}/"

chown -R www-data:www-data "${STAGE_ROOT}"
find "${STAGE_ROOT}" -type d -exec chmod 755 {} +
find "${STAGE_ROOT}" -type f -exec chmod 644 {} +

echo "[INFO] Swapping the new build into ${WEB_ROOT}..."
rm -rf "${OLD_ROOT}"
if [ -d "${WEB_ROOT}" ]; then
  mv "${WEB_ROOT}" "${OLD_ROOT}"
fi
mv "${STAGE_ROOT}" "${WEB_ROOT}"
rm -rf "${OLD_ROOT}"

echo "[INFO] Writing the Nginx route snippet..."
cat > "${NGINX_SNIPPET}" <<EOF
# Managed by deploy_linux.sh in the ${APP_NAME} repository — edits are overwritten.

location = ${ROUTE_BASE} {
    return 301 ${ROUTE_BASE}/;
}

location = ${LOWER_ROUTE_BASE} {
    return 301 ${ROUTE_BASE}/;
}

location ^~ ${LOWER_ROUTE_BASE}/ {
    return 301 ${ROUTE_BASE}/;
}

# Asset filenames are stamped with a content hash (?v=), so they cache forever.
location ^~ ${ROUTE_BASE}/assets/ {
    root /var/www;
    access_log off;

    add_header Cache-Control "public, max-age=31536000, immutable" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}

location ^~ ${ROUTE_BASE}/ {
    root /var/www;
    index index.html;
    try_files \$uri \$uri/ \$uri/index.html =404;
    error_page 404 ${ROUTE_BASE}/404.html;

    # HTML must revalidate, or edits never reach returning visitors.
    add_header Cache-Control "public, max-age=0, must-revalidate" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
EOF

if ! grep -q "include ${NGINX_SNIPPET};" "${NGINX_SITE}"; then
  echo "[INFO] Registering the route snippet in ${NGINX_SITE}..."
  cp "${NGINX_SITE}" "${NGINX_SITE}.bak.$(date +%Y%m%d%H%M%S)"
  # Only the canonical apex server block gets the include; the www block is a
  # redirect and the :80 block carries both names, so the anchor is the line
  # that holds the apex name on its own.
  sed -i "/^[[:space:]]*server_name ${DOMAIN};[[:space:]]*$/a\\    include ${NGINX_SNIPPET};" "${NGINX_SITE}"
fi

if ! grep -q "include ${NGINX_SNIPPET};" "${NGINX_SITE}"; then
  echo "[ERROR] Could not register ${NGINX_SNIPPET} in ${NGINX_SITE}." >&2
  echo "        Add 'include ${NGINX_SNIPPET};' to the 'server_name ${DOMAIN};' block by hand." >&2
  exit 1
fi

echo "[INFO] Testing the Nginx configuration..."
nginx -t

echo "[INFO] Reloading Nginx..."
systemctl reload nginx

echo "[SUCCESS] ${APP_NAME} deployed: https://${DOMAIN}${ROUTE_BASE}/"
