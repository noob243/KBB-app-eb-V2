# ✅ CHECKLIST D'ACTIONS

## 📋 Actions Recommandées (Par Priorité)

---

## 🔴 PRIORITÉ 1: CORRECTION CRITIQUE (Jour 1)

### ✏️ Modifier `src/types/index.ts`

#### 1.1 CLIENTS Interface
```typescript
// ❌ AVANT
export interface Client {
  id: number;
  name: string;
  contact: string;
  cases: number;           // ❌ SUPPRIMER
  email?: string;
  phone?: string;
  secteur?: string;
  siege?: string;
  sieges?: string[];
  dirigeant?: string;
  ref1_nom?: string;       // ❌ SUPPRIMER
  ref1_phone?: string;     // ❌ SUPPRIMER
  ref1_email?: string;     // ❌ SUPPRIMER
  ref2_nom?: string;       // ❌ SUPPRIMER
  ref2_phone?: string;     // ❌ SUPPRIMER
  ref2_email?: string;     // ❌ SUPPRIMER
  typeFacturation?: string;
}

// ✅ APRÈS
export interface Client {
  id: number;
  name: string;
  contact: string;
  // cases: A calculer via COUNT FROM cases WHERE client_id
  // referents: A charger via client_referents table
  email?: string;
  phone?: string;
  secteur?: string;
  siege?: string;
  dirigeant?: string;
  typeFacturation?: string;
  created_at?: string;
  updated_at?: string;
}
```

**Checklist:**
- [ ] Supprimer `cases: number`
- [ ] Supprimer `ref1_nom`, `ref1_phone`, `ref1_email`
- [ ] Supprimer `ref2_nom`, `ref2_phone`, `ref2_email`
- [ ] Ajouter `created_at?: string`
- [ ] Ajouter `updated_at?: string`

#### 1.2 CASE Interface
```typescript
// ❌ AVANT
export interface Case {
  id: string;
  name: string;
  client: string;          // ❌ STRING → Devrait être ID
  status: 'Nouveau' | 'En cours' | 'En attente' | 'Clôturé';
  nextHearing: string | null;
  procedure?: string;
  procedureInstance?: string;
  procedureObjet?: string;
  // ... autres
}

// ✅ APRÈS
export interface Case {
  id: string;
  reference: string;       // ✅ AJOUTER
  name: string;
  clientId: number;        // ✅ CHANGER (était 'client: string')
  client?: string;         // ✅ AJOUTER (pour afficher nom)
  status: 'Nouveau' | 'En cours' | 'En attente' | 'Clôturé';
  nextHearing: string | null;
  procedure?: string;
  procedureInstance?: string;
  procedureObjet?: string;
  procedureStatus?: string;
  procedureDateDebut?: string;
  procedureDateFin?: string;
  notes?: string;
  procedures?: CaseProcedure[];
  created_at?: string;
  updated_at?: string;
}
```

**Checklist:**
- [ ] Ajouter `reference: string` (obligatoire)
- [ ] Renommer `client: string` → `clientId: number`
- [ ] Ajouter `client?: string` (optional, pour affichage)
- [ ] Ajouter `created_at?` et `updated_at?`

#### 1.3 AVOCAT Interface
```typescript
// ❌ AVANT
export interface Avocat {
  hasChildren?: 'Oui' | 'Non';  // ❌ ENUM STRING
  photo: File | null;            // ❌ FILE OBJECT
  // bankAccounts?: BankAccount[];  // ❌ MANQUANT
}

// ✅ APRÈS
export interface Avocat {
  hasChildren?: boolean;         // ✅ BOOLEAN
  photoUrl?: string;             // ✅ URL ONLY
  bankAccounts?: BankAccount[];  // ✅ AJOUTER
  created_at?: string;
  updated_at?: string;
}
```

**Checklist:**
- [ ] Changer `hasChildren: 'Oui'|'Non'` → `hasChildren?: boolean`
- [ ] Supprimer `photo: File`, garder `photoUrl: string`
- [ ] Ajouter `bankAccounts?: BankAccount[]`
- [ ] Ajouter `created_at?` et `updated_at?`

#### 1.4 EVENT Interface
```typescript
// ❌ AVANT
export interface Event {
  budgetPrevisionnel?: string;   // ❌ STRING
  budgetRealise?: string;         // ❌ STRING
  financement?: string;
  financements?: Array<{ label: string; amount: string }>;  // ❌ amount: STRING
}

// ✅ APRÈS
export interface Event {
  budgetPrevisionnel?: number;   // ✅ NUMBER
  budgetRealise?: number;         // ✅ NUMBER
  financements?: Array<{ label: string; amount: number }>;  // ✅ amount: NUMBER
  reports?: EventReport[];        // ✅ AJOUTER
  created_at?: string;
  updated_at?: string;
}
```

**Checklist:**
- [ ] Changer `budgetPrevisionnel: string` → `budgetPrevisionnel?: number`
- [ ] Changer `budgetRealise: string` → `budgetRealise?: number`
- [ ] Changer `financements[].amount: string` → `number`
- [ ] Ajouter `reports?: EventReport[]`
- [ ] Ajouter `created_at?` et `updated_at?`

#### 1.5 INVOICE Interface
```typescript
// ❌ AVANT
export interface Invoice {
  id: string;
  caseId: string;
  // ❌ Pas de reference
}

// ✅ APRÈS
export interface Invoice {
  id: string;
  reference: string;  // ✅ AJOUTER (obligatoire)
  caseId: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: 'Réglée' | 'Non réglée' | 'En cours';
  created_at?: string;
  updated_at?: string;
}
```

**Checklist:**
- [ ] Ajouter `reference: string` (obligatoire)
- [ ] Ajouter `created_at?` et `updated_at?`

#### 1.6 PERSONNEL Interface
```typescript
// ❌ AVANT
export interface Personnel {
  hasChildren: 'Oui' | 'Non';      // ❌ ENUM STRING
  // bankAccounts?: BankAccount[];  // ❌ MANQUANT
}

// ✅ APRÈS
export interface Personnel {
  hasChildren: boolean;             // ✅ BOOLEAN
  bankAccounts?: BankAccount[];    // ✅ AJOUTER
  created_at?: string;
  updated_at?: string;
}
```

**Checklist:**
- [ ] Changer `hasChildren: 'Oui'|'Non'` → `hasChildren?: boolean`
- [ ] Ajouter `bankAccounts?: BankAccount[]`
- [ ] Ajouter `created_at?` et `updated_at?`

#### 1.7 EVENTREPORT Interface
```typescript
// ✅ AJOUTER nouveau type
export interface EventReportFile {
  id: string;
  reportId: string;
  name: string;
  size?: string;
  storagePath?: string;
}

export interface EventFinancement {
  id: string;
  eventId: string;
  label: string;
  amount: number;
}

// ✅ METTRE À JOUR
export interface EventReport {
  id: string;
  eventId: string;        // ✅ AJOUTER
  title: string;
  content?: string;
  author?: string;
  dateCreated: string;
  files?: EventReportFile[];  // ✅ Type séparé
}
```

**Checklist:**
- [ ] Créer `EventReportFile` interface
- [ ] Créer `EventFinancement` interface
- [ ] Mettre à jour `EventReport` avec `eventId`
- [ ] Mettre à jour type des files

---

### ✔️ Vérifier la compilation
```bash
npm run build
```

**Checklist:**
- [ ] Aucune erreur TypeScript
- [ ] Aucun warning

---

## 🟡 PRIORITÉ 2: SCHÉMA SQL (Jour 1)

### 1️⃣ Importer le schéma complet

**Étapes:**
```
1. Allez sur: https://supabase.com/dashboard
2. Sélectionnez votre projet
3. SQL Editor → New Query
4. Copiez le contenu de: supabase/schema-adapted.sql
5. Collez dans l'éditeur
6. Cliquez "Run" (Ctrl+Enter)
```

**Checklist:**
- [ ] Pas d'erreurs SQL
- [ ] Toutes les tables créées (9 principales)
- [ ] Toutes les tables de liaison créées (8)
- [ ] Nouvelles tables créées (bank_accounts, event_*)
- [ ] Indexes créés
- [ ] Triggers créés

### 2️⃣ Vérifier les tables créées

**Dans Supabase Table Editor:**
```
- [ ] clients (BIGSERIAL IDs)
- [ ] cases (UUID, avec reference)
- [ ] tasks (BIGSERIAL IDs)
- [ ] avocats (UUID)
- [ ] events (UUID)
- [ ] invoices (UUID, avec reference)
- [ ] personnels (UUID)
- [ ] fournisseurs (UUID)
- [ ] procedures (UUID)
- [ ] bank_accounts (UUID) ✅ NEW
- [ ] event_financements (UUID) ✅ NEW
- [ ] event_reports (UUID) ✅ NEW
- [ ] event_report_files (UUID) ✅ NEW
- [ ] + 8 tables de liaison
```

---

## 🟠 PRIORITÉ 3: MIGRATION SQL (Jour 1)

### Exécuter les corrections

**Étapes:**
```
1. SQL Editor → New Query
2. Copiez le contenu de: supabase/migration-corrections.sql
3. Collez dans l'éditeur
4. Cliquez "Run"
```

**Checklist:**
- [ ] Migration exécutée sans erreurs
- [ ] Fonction `convert_text_to_bool` créée
- [ ] Toutes les foreign keys existantes
- [ ] RLS activé sur nouvelles tables
- [ ] Compteurs OK (SELECT COUNT(*))

---

## 🟢 PRIORITÉ 4: DÉPLOIEMENT (Jour 1)

### Redéployer Netlify

**Étapes:**
```
1. Allez sur: https://app.netlify.com/projects/kbb-app-web-v2
2. Onglet "Deploys"
3. Cliquez "Trigger deploy" → "Deploy site"
4. Attendez "Published" ✅
```

**Checklist:**
- [ ] Redéploiement réussi
- [ ] Site accessible
- [ ] Console sans erreurs (F12)

---

## 🔵 PRIORITÉ 5: TESTS (Jour 2)

### Tests de Compatibilité

#### Test 1: CLIENTS
```
1. Ouvrir: http://kbb-app-web-v2.netlify.app
2. Clients → Ajouter un Client
3. Remplir le formulaire
4. Cliquer "Enregistrer"
5. Vérifier dans Supabase Table Editor → clients
   ✅ Nouveau client visible
6. Modifier le client
   ✅ Changements visibles en Supabase
7. Supprimer le client
   ✅ Client supprimé de Supabase
```

#### Test 2: CASES
```
1. Dossiers → Ajouter un Dossier
2. Remplir avec un client existant
3. Vérifier `clientId` = numérique
4. Vérifier `reference` auto-générée
5. Vérifier dans Supabase
```

#### Test 3: INVOICES
```
1. Facturation → Ajouter une Facture
2. Vérifier `reference` visible
3. Vérifier `totalAmount` en nombre
4. Vérifier dans Supabase
```

#### Test 4: EVENTS
```
1. Événements → Ajouter un Événement
2. Remplir budgets (doivent être nombres)
3. Vérifier financements créés
4. Vérifier dans Supabase: event_financements
```

**Checklist:**
- [ ] CREATE (ajout) fonctionne
- [ ] READ (affichage) fonctionne
- [ ] UPDATE (modification) fonctionne
- [ ] DELETE (suppression) fonctionne
- [ ] Données visibles en Supabase
- [ ] Pas d'erreurs en console (F12)

---

## 📊 RÉSUMÉ DE PROGRESSION

```
Phase 1: Types TypeScript      [ ] 0% [ ] 25% [ ] 50% [✅] 100%
Phase 2: Schéma SQL            [ ] 0% [ ] 25% [ ] 50% [ ] 100%
Phase 3: Migration SQL         [ ] 0% [ ] 25% [ ] 50% [ ] 100%
Phase 4: Déploiement Netlify   [ ] 0% [ ] 25% [ ] 50% [ ] 100%
Phase 5: Tests                 [ ] 0% [ ] 25% [ ] 50% [ ] 100%

TOTAL PROGRESSION:            [████████░░░░░░░░░░] 25%
```

---

## ⏱️ TEMPS ESTIMÉ

| Phase | Durée | Cumul |
|-------|-------|-------|
| 1. Types | 15 min | 15 min |
| 2. Schéma | 5 min | 20 min |
| 3. Migration | 5 min | 25 min |
| 4. Déploiement | 5 min | 30 min |
| 5. Tests | 10 min | **40 min** |

---

## 🎯 RÉSULTAT FINAL

Une fois complété, vous aurez:
- ✅ Compatibilité 100% TypeScript ↔ Supabase
- ✅ Toutes les tables correctement créées
- ✅ Synchronisation automatique des données
- ✅ CRUD complètement fonctionnel
- ✅ Pas d'erreurs de type

---

**Prêt à commencer? Allez à la Phase 1!** 🚀

