#!/bin/bash
# ============================================================
# Script de déploiement KBB App sur VPS Hostinger (Debian/Ubuntu)
# ============================================================
set -e

echo "🚀 Déploiement KBB App sur VPS Hostinger"
echo "----------------------------------------"

# Vérifier qu'on est en root ou sudo
if [ "$EUID" -ne 0 ]; then
  echo "❌ Exécutez ce script avec sudo"
  exit 1
fi

DOMAIN="${1:-kbb.cabinet}"
APP_DIR="/var/www/kbb-app"

# --- 1. Mise à jour système ---
echo "📦 Mise à jour des paquets..."
apt-get update -qq && apt-get upgrade -y -qq

# --- 2. Installer Nginx + Node.js 18 ---
echo "🔧 Installation Nginx + Node.js..."
apt-get install -y -qq nginx curl git

if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
  apt-get install -y -qq nodejs
fi

echo "Node.js $(node -v) • npm $(npm -v)"

# --- 3. Préparer le dossier de l'application ---
echo "📁 Création $APP_DIR..."
mkdir -p $APP_DIR

# --- 4. Copier les fichiers du build (à exécuter depuis la machine locale) ---
echo ""
echo "⚠️  IMPORTANT : exécutez d'abord CELLE-CI sur votre machine :"
echo ""
echo "   npm run build"
echo "   rsync -avz --delete dist/ root@VOTRE_IP:$APP_DIR/"
echo ""
echo "   Puis relancez ce script pour configurer Nginx"

# --- 5. Config Nginx ---
NGINX_CONF="/etc/nginx/sites-available/kbb-app"
if [ ! -f "$NGINX_CONF" ]; then
  echo "📝 Création configuration Nginx..."

  cat > $NGINX_CONF << 'EOF'
server {
    listen 80;
    server_name _;

    root /var/www/kbb-app;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 1000;
    gzip_comp_level 6;

    # Fichiers statiques avec cache
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA : toutes les routes → index.html
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, must-revalidate";
    }

    # Sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Logs
    access_log /var/log/nginx/kbb-app.access.log;
    error_log /var/log/nginx/kbb-app.error.log;
}
EOF

  ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
  rm -f /etc/nginx/sites-enabled/default

  # Tester et recharger
  nginx -t && systemctl reload nginx
  echo "✅ Nginx configuré et rechargé"
else
  echo "✅ Nginx déjà configuré"
fi

# --- 6. Certificat SSL avec Let's Encrypt ---
echo ""
echo "🔐 Pour activer HTTPS (recommandé) :"
echo ""
echo "   sudo apt install -y certbot python3-certbot-nginx"
echo "   sudo certbot --nginx -d $DOMAIN"
echo ""

# --- 7. Firewall ---
if command -v ufw &> /dev/null; then
  ufw allow 'Nginx Full'
  ufw reload
  echo "✅ Firewall UFW : Nginx autorisé"
fi

# --- 8. Statut ---
echo ""
echo "✅ Déploiement terminé !"
echo "📡 Application : http://$(curl -4 -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')"
echo ""
echo "📋 Prochaines étapes :"
echo "   1. sudo certbot --nginx (pour HTTPS)"
echo "   2. Configurer le nom de domaine dans /etc/nginx/sites-available/kbb-app"
echo "   3. sudo systemctl reload nginx"
