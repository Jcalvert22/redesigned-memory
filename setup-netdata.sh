#!/usr/bin/env bash
# ==============================================================
# Netdata Monitoring Setup
# Ubuntu + PM2 + Nginx integration
#
# Usage: sudo bash setup-netdata.sh
# Safe to run more than once (idempotent).
# ==============================================================
set -euo pipefail

# ── 0. Root check ──────────────────────────────────────────────
[[ $EUID -eq 0 ]] || { echo "ERROR: run as root — sudo bash $0"; exit 1; }

# ── 1. Generate secure random password ────────────────────────
# openssl gives a base64 string; we strip to alphanumeric for
# shell safety inside htpasswd/curl commands.
MONITOR_PASS=$(openssl rand -base64 32 | tr -dc 'A-Za-z0-9' | head -c 24)

echo ""
echo "============================================================"
echo "  CREDENTIALS — save these now, not shown again"
echo "  Username : monitor"
echo "  Password : ${MONITOR_PASS}"
echo "============================================================"
echo ""

# ── 2. Install system packages ─────────────────────────────────
echo "[+] Installing packages..."
apt-get update -y -qq
apt-get install -y -qq curl apache2-utils nginx ufw

# ── 3. Install Netdata (stable channel, no auto-update) ────────
echo "[+] Installing Netdata..."
if ! command -v netdata &>/dev/null; then
  curl -sSL https://get.netdata.cloud/kickstart.sh -o /tmp/netdata-kickstart.sh
  bash /tmp/netdata-kickstart.sh \
    --stable-channel \
    --disable-telemetry \
    --non-interactive \
    --no-updates \
    < /dev/null
  rm -f /tmp/netdata-kickstart.sh
else
  echo "    Netdata already installed — skipping."
fi

# ── 4. Bind Netdata to localhost on port 19998 ─────────────────
# Nginx will sit in front on port 19999 and add basic auth.
# Both cannot share the same port, so Netdata moves to 19998.
echo "[+] Binding Netdata to 127.0.0.1:19998..."
NETDATA_CONF="/etc/netdata/netdata.conf"

# Back up once
[[ -f "${NETDATA_CONF}.bak" ]] || cp "$NETDATA_CONF" "${NETDATA_CONF}.bak"

if grep -qE '^\s*#?\s*bind to\s*=' "$NETDATA_CONF"; then
  # Line exists (commented or not) — overwrite it
  sed -i 's|^\s*#\?\s*bind to\s*=.*|    bind to = 127.0.0.1:19998|' "$NETDATA_CONF"
elif grep -q '^\[web\]' "$NETDATA_CONF"; then
  # [web] section exists but no bind to line — insert after section header
  sed -i '/^\[web\]/a\\    bind to = 127.0.0.1:19998' "$NETDATA_CONF"
else
  # No [web] section at all — append it
  printf '\n[web]\n    bind to = 127.0.0.1:19998\n' >> "$NETDATA_CONF"
fi

# ── 5. PM2 process group for apps.plugin ──────────────────────
# apps.plugin groups processes shown in the "Applications" chart.
# The PM2 daemon shows as "PM2 v*"; managed Node apps show as "node".
echo "[+] Configuring PM2 process group..."
APPS_GROUPS="/etc/netdata/apps_groups.conf"

if [[ -f "$APPS_GROUPS" ]] && ! grep -q '^pm2' "$APPS_GROUPS"; then
  cat >> "$APPS_GROUPS" <<'EOF'

# PM2 process manager and its managed Node.js apps
pm2: PM2* pm2*
node_apps: node nodejs
EOF
fi

# ── 6. Nginx log monitoring via go.d web_log ──────────────────
# Netdata's go.d web_log plugin parses Nginx access logs and
# charts requests/sec, response codes, bandwidth, etc.
echo "[+] Configuring Nginx log monitoring..."

# Add netdata user to the 'adm' group so it can read /var/log/nginx/
usermod -aG adm netdata 2>/dev/null || true

# Write go.d web_log config (idempotent — overwrites on re-run)
GO_D_DIR="/etc/netdata/go.d"
mkdir -p "$GO_D_DIR"

cat > "$GO_D_DIR/web_log.conf" <<'EOF'
jobs:
  - name: nginx_access
    path: /var/log/nginx/access.log
EOF

# ── 7. Nginx reverse proxy with HTTP Basic Auth on port 19999 ──
echo "[+] Configuring Nginx proxy on port 19999..."

# Create / update htpasswd file
HTPASSWD="/etc/nginx/.netdata_htpasswd"
htpasswd -bc "$HTPASSWD" monitor "$MONITOR_PASS"
chmod 640 "$HTPASSWD"
chown root:www-data "$HTPASSWD"

# Write the Nginx server block
cat > /etc/nginx/sites-available/netdata <<'NGINXEOF'
server {
    listen 19999;
    server_name _;

    # HTTP Basic Auth
    auth_basic           "Netdata Monitoring";
    auth_basic_user_file /etc/nginx/.netdata_htpasswd;

    location / {
        proxy_pass         http://127.0.0.1:19998;
        proxy_http_version 1.1;

        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;

        # Required for Netdata's streaming WebSocket
        proxy_set_header   Upgrade           $http_upgrade;
        proxy_set_header   Connection        "upgrade";

        proxy_read_timeout 60s;
        proxy_buffering    off;
    }
}
NGINXEOF

# Enable the site
ln -sf /etc/nginx/sites-available/netdata /etc/nginx/sites-enabled/netdata

# Validate config before reloading
nginx -t

# ── 8. UFW firewall ────────────────────────────────────────────
echo "[+] Configuring UFW..."

# Allow SSH first so we don't lock ourselves out
ufw allow OpenSSH

# Allow the Netdata dashboard port
ufw allow 19999/tcp comment 'Netdata dashboard'

# Enable UFW non-interactively (no-op if already enabled)
ufw --force enable

# ── 9. Enable and (re)start services ──────────────────────────
echo "[+] Starting services..."

systemctl enable netdata
systemctl restart netdata

systemctl enable nginx
systemctl reload nginx

# ── 10. Wait for Netdata to come up then verify ────────────────
echo "[+] Waiting for Netdata to start..."
for i in {1..15}; do
  if curl -sf http://127.0.0.1:19998/api/v1/info &>/dev/null; then
    echo "    Netdata is up."
    break
  fi
  sleep 2
done

# ── 11. Print final summary ────────────────────────────────────
SERVER_IP=$(hostname -I | awk '{print $1}')

echo ""
echo "============================================================"
echo "  NETDATA SETUP COMPLETE"
echo "============================================================"
echo ""
echo "  Dashboard : http://${SERVER_IP}:19999"
echo "  Username  : monitor"
echo "  Password  : ${MONITOR_PASS}"
echo ""
echo "  VERIFICATION CHECKLIST"
echo "  ──────────────────────"
echo "  [ ] Netdata service     systemctl status netdata"
echo "  [ ] Nginx service       systemctl status nginx"
echo "  [ ] Port 19999 open     ss -tlnp | grep 19999"
echo "  [ ] Netdata internal    curl -sf http://127.0.0.1:19998/api/v1/info"
echo "  [ ] Auth works          curl -u monitor:${MONITOR_PASS} http://localhost:19999/api/v1/info"
echo "  [ ] PM2 processes       Dashboard → Applications tab"
echo "  [ ] Nginx logs          Dashboard → Go.d / Web Log section"
echo ""
echo "  WHAT WAS INSTALLED"
echo "  ──────────────────"
echo "  Netdata    → internal on 127.0.0.1:19998"
echo "  Nginx      → public proxy on 0.0.0.0:19999 (basic auth)"
echo "  UFW        → port 19999 open, SSH preserved"
echo "  apps.plugin→ PM2 + Node process groups added"
echo "  go.d       → Nginx access log monitoring enabled"
echo ""
echo "  To change the password later:"
echo "    sudo htpasswd /etc/nginx/.netdata_htpasswd monitor"
echo "    sudo systemctl reload nginx"
echo ""
echo "============================================================"
