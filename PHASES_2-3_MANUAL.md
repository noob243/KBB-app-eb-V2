# 🚀 PHASES 2-3: Instructions Manuelles Supabase

## ⚙️ Phase 2: Importer le Schéma SQL

### Étape 1: Accéder à Supabase
```
https://supabase.com/dashboard
```

### Étape 2: Ouvrir SQL Editor
1. Sélectionnez votre projet KBB
2. Allez dans: **SQL Editor**
3. Cliquez: **+ New Query**

### Étape 3: Copier le Schéma
Copiez **tout** le contenu du fichier:
```
supabase/schema-adapted.sql
```

### Étape 4: Exécuter la Requête
1. Collez le contenu dans SQL Editor
2. Cliquez: **Run** (ou Ctrl+Enter)
3. Attendez la confirmation

### ✅ Vérification
Dans **Table Editor**, vous devez voir les 17 tables:
- ✅ clients
- ✅ cases
- ✅ tasks
- ✅ avocats
- ✅ events
- ✅ invoices
- ✅ personnels
- ✅ fournisseurs
- ✅ procedures
- ✅ bank_accounts (NEW)
- ✅ event_financements (NEW)
- ✅ event_reports (NEW)
- ✅ event_report_files (NEW)
- + 4 tables de liaison

---

## ⚙️ Phase 3: Migration de Correction

### Étape 1: Nouvelle Requête SQL
```
SQL Editor → + New Query
```

### Étape 2: Copier la Migration
Copiez **tout** le contenu du fichier:
```
supabase/migration-corrections.sql
```

### Étape 3: Exécuter
1. Collez le contenu dans SQL Editor
2. Cliquez: **Run**
3. Attendez la confirmation

### ✅ Vérification
Aucune erreur SQL ne doit apparaître.

---

## 📝 Fichiers à Utiliser

### Fichier pour Phase 2:
👉 [supabase/schema-adapted.sql](./supabase/schema-adapted.sql)

### Fichier pour Phase 3:
👉 [supabase/migration-corrections.sql](./supabase/migration-corrections.sql)

---

## ⏱️ Durée Estimée
- Phase 2: 5 min
- Phase 3: 5 min
- **Total: 10 min**

---

**Une fois terminé, consultez: PHASES_4-5_STATUS.md**

