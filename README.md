# ⚖️ KBB App

Application de gestion complète pour cabinet d'avocats.  
Built with React + TypeScript + Vite + Supabase.

## 🚀 Déploiement sur VPS Hostinger

### Depuis GitHub → VPS (méthode officielle)

#### 1. Mise à jour GitHub

```bash
# Depuis votre machine locale
git add .
git commit -m "Corrections bugs + preparation deploiement VPS"
git push origin main
```

#### 2. Connexion au VPS

```bash
ssh root@31.97.56.102
# Mot de passe : SAJ-Design2525
```

#### 3. Installation du serveur (une seule fois)

```bash
apt-get update && apt-get install -y nginx git
```

#### 4. Cloner le projet et build

```bash
cd /root
git clone https://github.com/noob243/KBB-app-eb-V2.git
cd KBB-app-eb-V2
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
npm install
npm run build
```

#### 5. Copier le build vers Nginx

```bash
rm -rf /var/www/kbb-app
cp -r dist /var/www/kbb-app
```

#### 6. Configurer Nginx

```bash
cat > /etc/nginx/sites-available/kbb-app << 'EOF'
server {
    listen 80;
    server_name _;
    root /var/www/kbb-app;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml text/javascript image/svg+xml;
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
}
EOF

ln -sf /etc/nginx/sites-available/kbb-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

#### 7. Activer HTTPS (recommandé)

```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx
```

#### 8. Vérifier

Ouvrez **http://31.97.56.102** dans un navigateur.

---

### Rebuild Android APK (après chaque mise à jour)

```bash
# Assurez-vous que les variables d'environnement sont définies dans .env
cat .env

# Build web
npm run build

# Sync Capacitor (copie les fichiers web vers Android)
npx cap sync android

# Build APK (sur la machine avec Android Studio ou CLI)
cd android
./gradlew assembleDebug
# L'APK se trouve dans android/app/build/outputs/apk/debug/app-debug.apk
```

### Rebuild iOS

```bash
npm run build
npx cap sync ios
# Ouvrir ios/App/App.xcworkspace dans Xcode et build
```

## 📦 Base de données

Le schéma est dans `supabase/schema.sql`.  
Exécutez-le dans l'éditeur SQL de Supabase (l'instance au DDL à l'URL configurée dans `.env`).

## 🔑 Variables d'environnement

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | URL de votre projet Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clé publique Supabase (anonyme) |
| `GEMINI_API_KEY` | Clé API pour l'assistant IA Gemini |
