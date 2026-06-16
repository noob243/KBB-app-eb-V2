#!/bin/bash
set -e

VPS_IP="31.97.56.102"
VPS_USER="root"
VPS_PASS="SAJ-Design2525"
VPS_DIR="/var/www/kbb-app"

echo "╔════════════════════════════════════════╗"
echo "║   🚀 KBB App - Déploiement VPS        ║"
echo "╚════════════════════════════════════════╝"

# 1. Build
echo ""
echo "📦 [1/4] Build du projet..."
npm run build --silent 2>/dev/null || npm run build

# 2. Vérifier dist
if [ ! -d "dist" ]; then
  echo "❌ Build échoué — dossier dist/ absent"
  exit 1
fi
echo "✅ Build terminé (dist/)"

# 3. Installer sshpass si besoin
if ! command -v sshpass &> /dev/null; then
  echo "🔧 Installation sshpass..."
  sudo apt-get install -y -qq sshpass 2>/dev/null || brew install hudochenkov/sshpass/sshpass 2>/dev/null || true
fi

# 4. Préparer le VPS
echo ""
echo "🔧 [2/4] Configuration du VPS..."
sshpass -p "$VPS_PASS" ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP << 'EOF'
set -e
echo "   → Mise à jour paquets..."
apt-get update -qq && apt-get install -y -qq nginx curl git
echo "   → Nginx OK"
echo "   → Création dossier /var/www/kbb-app..."
mkdir -p /var/www/kbb-app
EOF

# 5. Transférer le build
echo ""
echo "📤 [3/4] Transfert des fichiers vers le VPS..."
sshpass -p "$VPS_PASS" rsync -avz --delete dist/ $VPS_USER@$VPS_IP:$VPS_DIR/ --quiet
echo "✅ Transfert terminé"

# 6. Configurer Nginx
echo ""
echo "🔧 [4/4] Configuration Nginx..."
sshpass -p "$VPS_PASS" ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP << 'EOF'
set -e

NGINX_CONF="/etc/nginx/sites-available/kbb-app"

cat > $NGINX_CONF << 'NGINX_EOF'
server {
    listen 80;
    server_name _;

    root /var/www/kbb-app;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 1000;
    gzip_comp_level 6;

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, must-revalidate";
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    access_log /var/log/nginx/kbb-app.access.log;
    error_log /var/log/nginx/kbb-app.error.log;
}
NGINX_EOF

ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx

# Firewall
if command -v ufw &> /dev/null; then
  ufw allow 'Nginx Full' 2>/dev/null || true
fi

echo "✅ Nginx configuré et rechargé"
EOF

# 7. Résultat
echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   ✅ DÉPLOIEMENT TERMINÉ !                  ║"
echo "║                                              ║"
echo "║   📡 Application accessible sur :            ║"
echo "║   http://31.97.56.102                        ║"
echo "║                                              ║"
echo "║   📋 Pour activer HTTPS (recommandé) :       ║"
echo "║   ssh root@31.97.56.102                      ║"
echo "║   sudo apt install -y certbot                ║"
echo "║   sudo certbot --nginx                       ║"
echo "╚══════════════════════════════════════════════╝"
