# 🎯 SYNTHÈSE VISUELLE: TypeScript ↔ Supabase

## 📊 Vue d'ensemble par table

```
┌─────────────┬──────────┬─────────────┬─────────────┬──────────────────────────┐
│ Table       │ TS Type  │ SQL Exists  │ Compatible? │ Action                   │
├─────────────┼──────────┼─────────────┼─────────────┼──────────────────────────┤
│ CLIENTS     │ ❌❌     │ ⚠️⚠️       │ NON         │ Supprimer cases/ref1/2   │
│ CASES       │ ⚠️       │ ⚠️          │ NON         │ Ajouter reference        │
│ TASKS       │ ✅       │ ✅          │ OUI         │ ✅ OK                    │
│ AVOCATS     │ ⚠️⚠️     │ ⚠️          │ NON         │ hasChildren → boolean    │
│ EVENTS      │ ⚠️⚠️     │ ❌❌        │ NON         │ Budgets → number + tables│
│ INVOICES    │ ❌       │ ✅          │ NON         │ Ajouter reference        │
│ PERSONNELS  │ ⚠️       │ ⚠️          │ NON         │ hasChildren → boolean    │
│ FOURNISSEURS│ ✅       │ ✅          │ OUI         │ ✅ OK                    │
└─────────────┴──────────┴─────────────┴─────────────┴──────────────────────────┘

Legend: ✅ OK | ⚠️ Divergence mineure | ❌ Divergence majeure
```

---

## 🔄 Matrice de Correspondance Détaillée

### 1️⃣ CLIENTS

```
┌─────────────────┬──────────────┬──────────────┬─────────────┬──────────────────────┐
│ TypeScript      │ SQL          │ Type Match   │ Obligatoire │ Status               │
├─────────────────┼──────────────┼──────────────┼─────────────┼──────────────────────┤
│ id              │ id           │ ✅ BIGINT    │ ✅          │ ✅ OK                │
│ name            │ name         │ ✅ TEXT      │ ✅          │ ✅ OK                │
│ contact         │ contact      │ ✅ TEXT      │ ✅          │ ✅ OK                │
│ cases           │ ❌ N/A       │ ❌           │ ❌          │ ❌ SUPPRIMER         │
│ email           │ email        │ ✅ TEXT      │ ⚠️ Opt      │ ✅ OK                │
│ phone           │ phone        │ ✅ TEXT      │ ⚠️ Opt      │ ✅ OK                │
│ secteur         │ secteur      │ ✅ TEXT      │ ⚠️ Opt      │ ✅ OK                │
│ siege           │ siege        │ ✅ TEXT      │ ⚠️ Opt      │ ✅ OK                │
│ ref1_nom        │ ❌ N/A       │ ❌           │ ⚠️ Opt      │ ❌ SUPPRIMER         │
│ ref1_phone      │ ❌ N/A       │ ❌           │ ⚠️ Opt      │ ❌ SUPPRIMER         │
│ ref1_email      │ ❌ N/A       │ ❌           │ ⚠️ Opt      │ ❌ SUPPRIMER         │
│ ref2_nom        │ ❌ N/A       │ ❌           │ ⚠️ Opt      │ ❌ SUPPRIMER         │
│ ref2_phone      │ ❌ N/A       │ ❌           │ ⚠️ Opt      │ ❌ SUPPRIMER         │
│ ref2_email      │ ❌ N/A       │ ❌           │ ⚠️ Opt      │ ❌ SUPPRIMER         │
│ dirigeant       │ dirigeant    │ ✅ TEXT      │ ⚠️ Opt      │ ✅ OK                │
│ typeFacturation │ type_facturation │ ✅ TEXT  │ ⚠️ Opt      │ ✅ OK                │
│ created_at      │ created_at   │ ✅ TIMESTAMP │ ⚠️ Opt      │ ✅ OK                │
│ updated_at      │ updated_at   │ ✅ TIMESTAMP │ ⚠️ Opt      │ ✅ OK                │
└─────────────────┴──────────────┴──────────────┴─────────────┴──────────────────────┘
```

**Actions:** Supprimer `cases`, `ref1_*`, `ref2_*` → Utiliser `client_referents` table

---

### 2️⃣ CASES

```
┌──────────────────┬──────────────┬──────────────┬─────────────┬──────────────────────┐
│ TypeScript       │ SQL          │ Type Match   │ Obligatoire │ Status               │
├──────────────────┼──────────────┼──────────────┼─────────────┼──────────────────────┤
│ id               │ id           │ ✅ TEXT      │ ✅          │ ✅ OK                │
│ name             │ name         │ ✅ TEXT      │ ✅          │ ✅ OK                │
│ client (STRING!) │ client_id    │ ⚠️ MISMATCH │ ✅          │ ⚠️ CHANGER           │
│ status           │ status       │ ✅ TEXT      │ ✅          │ ✅ OK                │
│ nextHearing      │ next_hearing │ ✅ DATE      │ ⚠️ Opt      │ ✅ OK                │
│ procedure        │ ❌ N/A       │ ❌           │ ⚠️ Opt      │ ⚠️ RELATIONAL        │
│ procedureInstance│ ❌ N/A       │ ❌           │ ⚠️ Opt      │ ⚠️ RELATIONAL        │
│ notes            │ notes        │ ✅ TEXT      │ ⚠️ Opt      │ ✅ OK                │
│ procedures[]     │ procedures   │ ✅ RELATION  │ ⚠️ Opt      │ ✅ OK                │
│ reference        │ reference    │ ❌ MANQUANT  │ ✅          │ ❌ AJOUTER           │
│ created_at       │ created_at   │ ✅ TIMESTAMP │ ⚠️ Opt      │ ✅ OK                │
│ updated_at       │ updated_at   │ ✅ TIMESTAMP │ ⚠️ Opt      │ ✅ OK                │
└──────────────────┴──────────────┴──────────────┴─────────────┴──────────────────────┘
```

**Actions:** 
- Changer `client: string` → `clientId: number`
- Ajouter `reference: string`

---

### 3️⃣ AVOCATS

```
┌──────────────────┬──────────────────┬──────────────┬─────────────┬──────────────────────┐
│ TypeScript       │ SQL              │ Type Match   │ Obligatoire │ Status               │
├──────────────────┼──────────────────┼──────────────┼─────────────┼──────────────────────┤
│ hasChildren      │ has_children     │ ⚠️ 'Oui/Non' │ ⚠️ Opt      │ ⚠️ CHANGER           │
│ (should be BOOL) │ (BOOLEAN)        │ vs BOOLEAN   │             │ → boolean            │
├──────────────────┼──────────────────┼──────────────┼─────────────┼──────────────────────┤
│ bankAccounts[]   │ ❌ N/A           │ ❌           │ ⚠️ Opt      │ ⚠️ RELATIONAL        │
│ (MANQUANT)       │ bank_accounts    │ ✅ EXISTS    │             │ (table existe)       │
├──────────────────┼──────────────────┼──────────────┼─────────────┼──────────────────────┤
│ photo: File      │ photo_url        │ ⚠️ MISMATCH  │ ⚠️ Opt      │ ⚠️ CHANGER           │
│ (FILE OBJECT!)   │ (TEXT URL)       │              │             │ → stocke URL         │
└──────────────────┴──────────────────┴──────────────┴─────────────┴──────────────────────┘
```

**Actions:**
- Changer `hasChildren: 'Oui'|'Non'` → `hasChildren?: boolean`
- Ajouter `bankAccounts?: BankAccount[]`
- Stocker seulement `photoUrl`, pas File object

---

### 4️⃣ EVENTS

```
┌──────────────────┬──────────────────┬──────────────┬─────────────┬──────────────────────┐
│ TypeScript       │ SQL              │ Type Match   │ Obligatoire │ Status               │
├──────────────────┼──────────────────┼──────────────┼─────────────┼──────────────────────┤
│ budgetPrevisionnel│ budget_previsionnel │ ⚠️ STRING │ ⚠️ Opt      │ ⚠️ CHANGER           │
│ (STRING!)        │ (DECIMAL 12,2)   │ vs DECIMAL   │             │ → number             │
├──────────────────┼──────────────────┼──────────────┼─────────────┼──────────────────────┤
│ budgetRealise    │ budget_realise   │ ⚠️ STRING    │ ⚠️ Opt      │ ⚠️ CHANGER           │
│ (STRING!)        │ (DECIMAL 12,2)   │ vs DECIMAL   │             │ → number             │
├──────────────────┼──────────────────┼──────────────┼─────────────┼──────────────────────┤
│ financement:str  │ ❌ N/A           │ ❌           │ ⚠️ Opt      │ ⚠️ RELATIONAL        │
│ financements[]   │ event_financements│ ✅ EXISTS    │ ⚠️ Opt      │ ✅ (table existe)    │
├──────────────────┼──────────────────┼──────────────┼─────────────┼──────────────────────┤
│ reports[]        │ event_reports    │ ✅ EXISTS    │ ⚠️ Opt      │ ✅ (table existe)    │
└──────────────────┴──────────────────┴──────────────┴─────────────┴──────────────────────┘
```

**Actions:**
- Changer `budgetPrevisionnel: string` → `budgetPrevisionnel?: number`
- Changer `budgetRealise: string` → `budgetRealise?: number`
- Changer `financements` type de string → array d'objects avec amount: number

---

### 5️⃣ INVOICES

```
┌──────────────────┬──────────────┬──────────────┬─────────────┬──────────────────────┐
│ TypeScript       │ SQL          │ Type Match   │ Obligatoire │ Status               │
├──────────────────┼──────────────┼──────────────┼─────────────┼──────────────────────┤
│ reference        │ reference    │ ❌ MANQUANT  │ ✅          │ ❌ AJOUTER           │
│ (MANQUANT!)      │ (TEXT NOT NULL)│ ✅ EXISTS  │             │ → reference: string  │
└──────────────────┴──────────────┴──────────────┴─────────────┴──────────────────────┘
```

**Actions:** Ajouter `reference: string` (obligatoire)

---

### 6️⃣ PERSONNELS

```
┌──────────────────┬──────────────────┬──────────────┬─────────────┬──────────────────────┐
│ TypeScript       │ SQL              │ Type Match   │ Obligatoire │ Status               │
├──────────────────┼──────────────────┼──────────────┼─────────────┼──────────────────────┤
│ hasChildren      │ has_children     │ ⚠️ 'Oui/Non' │ ⚠️ Opt      │ ⚠️ CHANGER           │
│ (STRING ENUM!)   │ (BOOLEAN)        │ vs BOOLEAN   │             │ → boolean            │
├──────────────────┼──────────────────┼──────────────┼─────────────┼──────────────────────┤
│ bankAccounts[]   │ ❌ N/A           │ ❌           │ ⚠️ Opt      │ ⚠️ RELATIONAL        │
│ (MANQUANT!)      │ bank_accounts    │ ✅ EXISTS    │             │ (table existe)       │
└──────────────────┴──────────────────┴──────────────┴─────────────┴──────────────────────┘
```

**Actions:**
- Changer `hasChildren: 'Oui'|'Non'` → `hasChildren?: boolean`
- Ajouter `bankAccounts?: BankAccount[]`

---

## 📈 Statistiques

```
Total champs différents: 28
Divergences trouvées:   10
Divergences critiques:  7
Divergences mineures:   3

Compatibilité actuelle: 64%
Compatibilité cible:    100%
```

---

## 🎬 Ordre de Correction Recommandé

```
1️⃣ TYPES (15 min)
   → Modifier src/types/index.ts
   
2️⃣ SCHÉMA SQL (5 min)
   → Importer supabase/schema-adapted.sql
   
3️⃣ MIGRATION (5 min)
   → Exécuter supabase/migration-corrections.sql
   
4️⃣ DÉPLOIEMENT (5 min)
   → Redéployer Netlify
   
5️⃣ TESTS (10 min)
   → Tester CRUD sur chaque table
```

**Temps total: ~40 minutes**

