# Guide de Déploiement - KBB App

## 🎯 Vue d'ensemble

Ce guide couvre le déploiement complet de l'application KBB App sur Netlify avec Supabase comme backend de base de données.

---

## 📋 Prérequis

- Un compte [GitHub](https://github.com)
- Un compte [Netlify](https://netlify.com)
- Un compte [Supabase](https://supabase.com)
- Une clé API [Google Gemini](https://aistudio.google.com/app/apikey)

---

## 🔧 Étape 1 : Configuration de Supabase

### 1.1 Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Cliquez sur **"New Project"**
3. Remplissez les informations :
   - **Project Name** : `kbb-app` (ou votre nom préféré)
   - **Database Password** : Générateur ou mot de passe fort
   - **Region** : Choisissez le plus proche de votre localisation
4. Cliquez sur **"Create new project"** et attendez l'initialisation

### 1.2 Récupérer les identifiants API

1. Allez dans **Settings** → **API**
2. Notez ces valeurs pour plus tard :
   - **Project URL** (copié dans `VITE_SUPABASE_URL`)
   - **anon public key** (copié dans `VITE_SUPABASE_ANON_KEY`)
   - **service_role secret** (à garder secret, non utilisé côté client)

### 1.3 Importer le schéma de base de données

1. Allez dans **SQL Editor**
2. Cliquez sur **"New Query"**
3. Copiez le contenu de `supabase/schema.sql` du projet
4. Collez-le dans l'éditeur SQL
5. Cliquez sur **"Run"** ou utilisez le raccourci `Ctrl+Enter`

### 1.4 Configurer les politiques Row Level Security (RLS)

RLS est recommandé pour sécuriser les données. Exemple de politique pour la table `clients` :

```sql
-- Permettre à l'utilisateur authentifié de voir ses propres données
CREATE POLICY "Users can view their own data"
ON clients FOR SELECT
USING (auth.uid()::text = user_id);

-- Permettre à l'utilisateur d'insérer ses propres données
CREATE POLICY "Users can insert their own data"
ON clients FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

-- Permettre à l'utilisateur de mettre à jour ses propres données
CREATE POLICY "Users can update their own data"
ON clients FOR UPDATE
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);
```

---

## 🌐 Étape 2 : Configuration de Netlify

### 2.1 Connecter votre dépôt GitHub à Netlify

1. Allez sur [netlify.com](https://netlify.com) et connectez-vous
2. Cliquez sur **"New site from Git"**
3. Sélectionnez **GitHub** comme provider
4. Autorisez Netlify à accéder à vos dépôts
5. Recherchez et sélectionnez `KBB-app-eb-V2`

### 2.2 Configurer les paramètres de build

Les paramètres de build sont définis dans `netlify.toml` et seront appliqués automatiquement :
- **Build command** : `npm run build`
- **Publish directory** : `dist`
- **Node version** : 18

### 2.3 Ajouter les variables d'environnement

Sur le tableau de bord Netlify de votre site :

1. Allez dans **Site settings** → **Build & deploy** → **Environment**
2. Cliquez sur **"Edit variables"**
3. Ajoutez les variables suivantes :

| Variable | Valeur |
|----------|--------|
| `VITE_SUPABASE_URL` | `https://your-project-id.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Votre clé publique Supabase |
| `VITE_GOOGLE_API_KEY` | Votre clé API Google Gemini |

> **⚠️ Important** : N'incluez JAMAIS ces variables dans votre code source. Utilisez uniquement les variables d'environnement Netlify.

### 2.4 Déclencher le premier déploiement

1. Allez dans l'onglet **"Deploys"**
2. Cliquez sur **"Trigger deploy"** → **"Deploy site"**
3. Attendez la fin du déploiement (vous verrez un statut ✓)
4. Cliquez sur le lien de prévisualisation pour accéder à votre site

---

## 📱 Étape 3 : Configuration du domaine personnalisé (optionnel)

### 3.1 Ajouter un domaine Netlify

1. Allez dans **Site settings** → **Domain management**
2. Cliquez sur **"Add custom domain"**
3. Entrez votre domaine (ex: `kbb-app.com`)
4. Suivez les instructions pour configurer les DNS

### 3.2 Certificat SSL

Netlify configure automatiquement un certificat SSL Let's Encrypt gratuit pour votre domaine.

---

## 🔐 Étape 4 : Sécurité et Bonnes Pratiques

### 4.1 Authentification

- Les utilisateurs s'authentifient via Supabase Auth
- Les tokens JWT sont stockés localement dans le navigateur
- Les données sensibles ne doivent jamais être exposées côté client

### 4.2 Secrets et API Keys

- ✅ Stockez les secrets dans les variables d'environnement Netlify
- ❌ Ne committez JAMAIS `.env` ou `secrets` dans Git
- ✅ Utilisez `.env.example` comme modèle de configuration

### 4.3 Mises à jour et maintenance

- Les mises à jour sont automatiquement déployées via Git (branche `main`)
- Utilisez des branches de feature pour les développements
- Testez en environnement de préproduction avant de merger sur `main`

---

## 🐛 Dépannage

### Le site ne se déploie pas ?

1. Vérifiez les logs de build sur Netlify : **Deploys** → Cliquez sur le déploiement → **Deploy log**
2. Assurez-vous que `npm run build` fonctionne localement
3. Vérifiez que les variables d'environnement sont correctement configurées

### Les données ne se synchronisent pas ?

1. Vérifiez les credentials Supabase (`VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`)
2. Ouvrez la console du navigateur (F12) et cherchez les erreurs
3. Assurez-vous que le schéma de base de données a été importé correctement

### Erreur d'authentification ?

1. Vérifiez que vous avez configuré Supabase Auth
2. Assurez-vous que `src/lib/supabase.ts` utilise les bonnes variables d'environnement
3. Vérifiez les politiques RLS sur Supabase

---

## 📊 Monitoring et Logs

### Logs Netlify

- Tableau de bord Netlify → **Deploys** → Sélectionnez un déploiement
- Cherchez les avertissements ou erreurs dans les logs

### Logs Supabase

- Dashboard Supabase → **Logs** pour voir les requêtes de base de données
- **Auth** → **Logs** pour l'authentification

### Logs du navigateur

- F12 (DevTools) → **Console** pour les erreurs JavaScript
- **Network** pour inspecter les requêtes API

---

## 🔄 Workflow de déploiement continu

```
Local Development
    ↓
Git Push (branche feature)
    ↓
GitHub Pull Request
    ↓
Code Review
    ↓
Merge sur main
    ↓
Netlify Build Automatique
    ↓
Déploiement en Production
    ↓
Tests en Production
```

---

## ✅ Checklist de déploiement

- [ ] Supabase configuré et schéma importé
- [ ] Variables d'environnement configurées sur Netlify
- [ ] `netlify.toml` présent dans le dépôt
- [ ] `.env.example` à jour avec toutes les variables
- [ ] `.gitignore` ignore les fichiers `.env`
- [ ] Build local fonctionne (`npm run build`)
- [ ] Premier déploiement Netlify réussi
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] SSL certificat configuré
- [ ] Tests en production effectués

---

## 📞 Support

Pour toute question ou problème :
- Documentation Netlify : https://docs.netlify.com
- Documentation Supabase : https://supabase.com/docs
- Documentation Vite : https://vitejs.dev

---

**Dernière mise à jour** : 4 juin 2026
