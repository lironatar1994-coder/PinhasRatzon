#!/usr/bin/env bash

# ==============================================================================
# Pinhas Ratzon — production deployment (root@vee-app.co.il)
#
# Publishes the site at https://pinhasratzon.co.il/, keeps the contact service
# online, provisions/renews TLS, and turns the former LaWebs path into
# path-preserving permanent redirects.
# ==============================================================================

set -euo pipefail

APP_NAME="PinhasRatzon"
DOMAIN="pinhasratzon.co.il"
WWW_DOMAIN="www.pinhasratzon.co.il"
OLD_DOMAIN="lawebs.co.il"
OLD_ROUTE_BASE="/PinhasRatzon"
OLD_LOWER_ROUTE_BASE="/pinhasratzon"

SITE_DIR="site"
# Keep the official-domain web root separate from the former sub-path root.
# That separation makes the cut-over reversible until the redirects go live.
WEB_ROOT="/var/www/${APP_NAME}-domain"
STAGE_ROOT="/var/www/.${APP_NAME}-domain.next"
OLD_ROOT="/var/www/.${APP_NAME}-domain.old"

NGINX_SITE="/etc/nginx/sites-available/${DOMAIN}.conf"
NGINX_ENABLED="/etc/nginx/sites-enabled/${DOMAIN}.conf"
NGINX_APP_SNIPPET="/etc/nginx/snippets/${APP_NAME}-root-locations.conf"
OLD_NGINX_SITE="/etc/nginx/sites-available/${OLD_DOMAIN}.conf"
OLD_NGINX_SNIPPET="/etc/nginx/snippets/${APP_NAME}-locations.conf"
CERT_DIR="/etc/letsencrypt/live/${DOMAIN}"

FORM_APP="pinhas-ratzon-form"
FORM_PORT="3108"
FORM_ENV="/etc/pinhas-ratzon-form.env"
LEADS_DIR="/var/lib/pinhas-ratzon"
MANAGER_SITE_CONFIG="/root/Manager_Site/data/clients/pinhas_ratzon/client.config.json"

echo "[INFO] Starting ${APP_NAME} deployment..."

if [ ! -f "${SITE_DIR}/build.mjs" ]; then
  echo "[ERROR] ${SITE_DIR}/build.mjs was not found in $(pwd)" >&2
  exit 1
fi

echo "[INFO] Pulling latest code..."
git fetch origin main
git reset --hard origin/main

# The reset above may rewrite this running file. Re-exec once so bash reads the
# new script from byte zero instead of continuing at a stale offset.
if [ -z "${DEPLOY_REEXEC:-}" ]; then
  export DEPLOY_REEXEC=1
  exec bash "$0" "$@"
fi

if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] node is not installed." >&2
  exit 1
fi
echo "[INFO] node $(node -v)"

echo "[INFO] Building and verifying the site..."
( cd "${SITE_DIR}" && node build.mjs && node check.mjs )
for gate in verify-build verify-contrast verify-restraint verify-typography; do
  echo "[INFO] gate: ${gate}"
  ( cd "${SITE_DIR}" && node "gates/${gate}.mjs" )
done

if [ ! -f "${SITE_DIR}/dist/index.html" ]; then
  echo "[ERROR] ${SITE_DIR}/dist/index.html is missing after the build." >&2
  exit 1
fi

if grep -rq "https://lawebs.co.il/PinhasRatzon" --include='*.html' --include='*.xml' --include='robots.txt' "${SITE_DIR}/dist"; then
  echo "[ERROR] The build still contains the former canonical site URL." >&2
  exit 1
fi

echo "[INFO] Staging the new web root..."
rm -rf "${STAGE_ROOT}"
mkdir -p "${STAGE_ROOT}"
cp -a "${SITE_DIR}/dist/." "${STAGE_ROOT}/"
node "${SITE_DIR}/apply-manager-content.mjs" "${STAGE_ROOT}" "${WEB_ROOT}" "${MANAGER_SITE_CONFIG}"
node "${SITE_DIR}/check-manager-content.mjs" "${STAGE_ROOT}" "${MANAGER_SITE_CONFIG}"
chown -R www-data:www-data "${STAGE_ROOT}"
find "${STAGE_ROOT}" -type d -exec chmod 755 {} +
find "${STAGE_ROOT}" -type f -exec chmod 644 {} +

echo "[INFO] Swapping the verified build into ${WEB_ROOT}..."
rm -rf "${OLD_ROOT}"
if [ -d "${WEB_ROOT}" ]; then mv "${WEB_ROOT}" "${OLD_ROOT}"; fi
mv "${STAGE_ROOT}" "${WEB_ROOT}"
rm -rf "${OLD_ROOT}"

echo "[INFO] Writing the root-domain application routes..."
cat > "${NGINX_APP_SNIPPET}" <<EOF
# Managed by deploy_linux.sh in the ${APP_NAME} repository.

location ^~ /.well-known/acme-challenge/ {
    root ${WEB_ROOT};
    default_type text/plain;
}

location = /contact/submit {
    proxy_pass http://127.0.0.1:${FORM_PORT}/submit;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    client_max_body_size 32k;

    add_header Cache-Control "no-store" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}

location ^~ /assets/ {
    root ${WEB_ROOT};
    try_files \$uri =404;
    access_log off;

    add_header Cache-Control "public, max-age=31536000, immutable" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}

location / {
    root ${WEB_ROOT};
    index index.html;
    try_files \$uri \$uri/ \$uri/index.html =404;
    error_page 404 /404.html;

    add_header Cache-Control "public, max-age=0, must-revalidate" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Content-Security-Policy "frame-ancestors 'self' https://vee-app.co.il" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
EOF

write_domain_site() {
  if [ -f "${CERT_DIR}/fullchain.pem" ] && [ -f "${CERT_DIR}/privkey.pem" ]; then
    cat > "${NGINX_SITE}" <<EOF
# Managed by deploy_linux.sh in the ${APP_NAME} repository.
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} ${WWW_DOMAIN};
    location ^~ /.well-known/acme-challenge/ { root ${WEB_ROOT}; }
    location / { return 301 https://${DOMAIN}\$request_uri; }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${WWW_DOMAIN};
    ssl_certificate ${CERT_DIR}/fullchain.pem;
    ssl_certificate_key ${CERT_DIR}/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    return 301 https://${DOMAIN}\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN};
    ssl_certificate ${CERT_DIR}/fullchain.pem;
    ssl_certificate_key ${CERT_DIR}/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    include ${NGINX_APP_SNIPPET};
}
EOF
  else
    cat > "${NGINX_SITE}" <<EOF
# Temporary HTTP configuration used until the first TLS certificate is issued.
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} ${WWW_DOMAIN};
    include ${NGINX_APP_SNIPPET};
}
EOF
  fi
}

write_domain_site
ln -sfn "${NGINX_SITE}" "${NGINX_ENABLED}"
nginx -t
systemctl reload nginx

if [ ! -f "${CERT_DIR}/fullchain.pem" ]; then
  if ! command -v certbot >/dev/null 2>&1; then
    echo "[ERROR] certbot is not installed." >&2
    exit 1
  fi
  echo "[INFO] Requesting the first TLS certificate..."
  certbot certonly --webroot -w "${WEB_ROOT}" \
    -d "${DOMAIN}" -d "${WWW_DOMAIN}" \
    --non-interactive --agree-tos --register-unsafely-without-email
fi

if [ ! -f "${CERT_DIR}/fullchain.pem" ]; then
  echo "[ERROR] TLS certificate was not created for ${DOMAIN}." >&2
  exit 1
fi

write_domain_site
nginx -t
systemctl reload nginx

echo "[INFO] Starting the contact-form service for the official domain..."
mkdir -p "${LEADS_DIR}"
chmod 750 "${LEADS_DIR}"

if [ ! -f "${FORM_ENV}" ]; then
  echo "[WARN] ${FORM_ENV} is missing; submissions will be stored but not mailed."
fi
if ! command -v pm2 >/dev/null 2>&1; then
  echo "[ERROR] pm2 is not installed." >&2
  exit 1
fi
if pm2 describe "${FORM_APP}" >/dev/null 2>&1; then
  pm2 restart "${FORM_APP}" --update-env >/dev/null
else
  pm2 start "$(pwd)/form-service/server.mjs" --name "${FORM_APP}" --time >/dev/null
fi
pm2 save >/dev/null

form_up=""
for _ in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fsS "http://127.0.0.1:${FORM_PORT}/health" >/dev/null 2>&1; then
    form_up=1
    break
  fi
  sleep 1
done
if [ -z "${form_up}" ]; then
  echo "[ERROR] ${FORM_APP} did not answer on 127.0.0.1:${FORM_PORT}." >&2
  pm2 logs "${FORM_APP}" --lines 20 --nostream || true
  exit 1
fi
echo "[INFO] ${FORM_APP} healthy: $(curl -fsS "http://127.0.0.1:${FORM_PORT}/health")"

echo "[INFO] Replacing the former LaWebs path with permanent redirects..."
cat > "${OLD_NGINX_SNIPPET}" <<EOF
# Managed by deploy_linux.sh in the ${APP_NAME} repository.

# Cached copies of the former form remain functional during the migration.
location = ${OLD_ROUTE_BASE}/contact/submit {
    proxy_pass http://127.0.0.1:${FORM_PORT}/submit;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    client_max_body_size 32k;
}

location = ${OLD_LOWER_ROUTE_BASE}/contact/submit {
    proxy_pass http://127.0.0.1:${FORM_PORT}/submit;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    client_max_body_size 32k;
}

location = ${OLD_ROUTE_BASE} { return 301 https://${DOMAIN}/; }
location ^~ ${OLD_ROUTE_BASE}/ {
    rewrite ^${OLD_ROUTE_BASE}/(.*)\$ https://${DOMAIN}/\$1 permanent;
}

location = ${OLD_LOWER_ROUTE_BASE} { return 301 https://${DOMAIN}/; }
location ^~ ${OLD_LOWER_ROUTE_BASE}/ {
    rewrite ^${OLD_LOWER_ROUTE_BASE}/(.*)\$ https://${DOMAIN}/\$1 permanent;
}
EOF

if ! grep -q "include ${OLD_NGINX_SNIPPET};" "${OLD_NGINX_SITE}"; then
  echo "[ERROR] ${OLD_NGINX_SITE} does not include ${OLD_NGINX_SNIPPET}." >&2
  exit 1
fi

nginx -t
systemctl reload nginx

echo "[SUCCESS] ${APP_NAME} deployed: https://${DOMAIN}/"
