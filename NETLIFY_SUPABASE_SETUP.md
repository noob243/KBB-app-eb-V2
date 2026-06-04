# 🔧 Guide de Configuration Netlify + Supabase

## ✅ Checklist de Vérification

### 1. Vérifier les variables d'environnement sur Netlify

**Allez sur :** https://app.netlify.com → Votre site → **Site settings** → **Build & deploy** → **Environment**

Assurez-vous que ces variables sont présentes :

| Variable | Exemple |
|----------|---------|
| `VITE_SUPABASE_URL` | `https://vepwlofchkjkeebsamvs.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_KJ3Onb3rO7yzBJpYHmzbKw_obvhp9ZF` |
| `VITE_GOOGLE_API_KEY` | Votre clé Gemini |

> ⚠️ **Important** : Les variables doivent commencer par `VITE_` pour être accessibles au côté client (Vite les expose automatiquement)

---

## 🚀 Étapes pour Corriger la Connexion

### Étape 1 : Confirmer les credentials Supabase

1. Allez sur **Supabase Dashboard** → **Settings** → **API**
2. Vérifiez que vous avez :
   - ✅ **Project URL** (commence par `https://`)
   - ✅ **anon public key** (commence par `sb_publishable_`)
   - ✅ Ces deux valeurs sont exactes et sans espaces

**Exemple correct :**
```
VITE_SUPABASE_URL=https://vepwlofchkjkeebsamvs.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_KJ3Onb3rO7yzBJpYHmzbKw_obvhp9ZF
```

---

### Étape 2 : Ajouter les variables sur Netlify

**Sur Netlify :**

1. Allez à **Site settings** → **Build & deploy** → **Environment variables**
2. Cliquez sur **"Edit variables"**
3. Collez exactement :
   ```
   VITE_SUPABASE_URL=https://vepwlofchkjkeebsamvs.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_KJ3Onb3rO7yzBJpYHmzbKw_obvhp9ZF
   ```
4. Cliquez sur **"Save"**

---

### Étape 3 : Redéployer sur Netlify

Après avoir ajouté les variables d'environnement, vous DEVEZ redéployer :

1. Allez dans l'onglet **"Deploys"**
2. Cliquez sur **"Trigger deploy"** → **"Deploy site"**
3. Attendez la fin du déploiement (vous verrez un ✓)

**⚠️ Important** : Les variables d'environnement ne s'appliquent qu'au prochain déploiement !

---

### Étape 4 : Vérifier la Connexion

Après le déploiement :

1. Allez sur votre site Netlify
2. Ouvrez la console du navigateur : **F12** → **Console**
3. Cherchez ces messages :
   - ✅ **Pas d'erreur** : La connexion fonctionne
   - ❌ **"Variables Supabase manquantes"** : Les variables ne sont pas configurées
   - ❌ **Erreur de connexion** : Vérifiez les credentials

---

## 🐛 Dépannage - Erreurs Courantes

### Erreur : "Variables Supabase manquantes"

**Cause** : Les variables d'environnement ne sont pas définies sur Netlify

**Solution** :
```
1. Allez sur Netlify Site settings → Environment variables
2. Vérifiez que VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont présentes
3. Cliquez sur "Trigger deploy" pour redéployer
4. Attendez la fin du déploiement
```

---

### Erreur : "401 Unauthorized" ou "Invalid API key"

**Cause** : La clé API est incorrecte ou expirée

**Solution** :
```
1. Allez sur Supabase Dashboard → Settings → API
2. Régénérez une nouvelle clé "anon" publique
3. Mettez à jour VITE_SUPABASE_ANON_KEY sur Netlify
4. Redéployez
```

---

### Erreur : "Network Error" ou "Cannot reach database"

**Cause** : L'URL Supabase est incorrecte

**Solution** :
```
1. Vérifiez que l'URL commence par https://
2. Vérifiez qu'il n'y a pas d'espaces ou de caractères supplémentaires
3. Copiez-collez directement depuis Supabase Dashboard
4. Redéployez
```

---

## 📝 Procédure Complète (Depuis le Début)

Si rien ne fonctionne, suivez cette procédure complète :

### 1. Supabase
```
1. Allez sur https://supabase.com/dashboard
2. Cliquez sur votre projet
3. Settings → API
4. Notez exactement :
   - Project URL (complet)
   - anon public key (complet)
```

### 2. Netlify
```
1. Allez sur https://app.netlify.com
2. Cliquez sur votre site
3. Site settings → Build & deploy → Environment
4. Ajoutez les variables (copier-coller exactement) :
   
   VITE_SUPABASE_URL=(votre URL Supabase)
   VITE_SUPABASE_ANON_KEY=(votre clé anon)
   VITE_GOOGLE_API_KEY=(votre clé Gemini)
   
5. Cliquez sur Save
```

### 3. Redéployer
```
1. Allez dans Deploys
2. Cliquez sur "Trigger deploy" → "Deploy site"
3. Attendez le ✓
4. Visitez votre site et vérifiez la console (F12)
```

---

## 🔍 Vérification Avancée

### Vérifier les variables dans le build Netlify

Sur Netlify, dans les logs de déploiement :

1. Allez dans **Deploys** → Cliquez sur un déploiement → **Deploy log**
2. Cherchez les lignes avec `VITE_` pour voir si les variables sont lues
3. Si vous voyez `undefined`, les variables ne sont pas définies

---

## ✨ Tester Localement (Optionnel)

Pour tester localement avant de déployer :

```bash
# Créez un fichier .env.local
echo 'VITE_SUPABASE_URL=https://vepwlofchkjkeebsamvs.supabase.co' > .env.local
echo 'VITE_SUPABASE_ANON_KEY=sb_publishable_KJ3Onb3rO7yzBJpYHmzbKw_obvhp9ZF' >> .env.local

# Lancez le serveur de développement
npm run dev

# Ouvrez http://localhost:3000 et vérifiez la console
```

---

## 📞 Support Supplémentaire

- **Netlify Docs** : https://docs.netlify.com/configure-builds/environment-variables/
- **Supabase Docs** : https://supabase.com/docs/
- **Vite Docs** : https://vitejs.dev/guide/env-and-mode.html

---

**Dernière mise à jour** : 4 juin 2026
