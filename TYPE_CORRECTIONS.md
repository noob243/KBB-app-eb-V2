# 🔧 Guide de Correction TypeScript

## Changements à apporter aux types TypeScript

### 1. **CLIENT** - Ajouter et corriger les champs

**AVANT:**
```typescript
export interface Client {
  id: number;
  cases: number;  // ❌ N'existe pas en SQL
  ref1_nom?: string;
  ref1_phone?: string;
  ref1_email?: string;
  ref2_nom?: string;
  ref2_phone?: string;
  ref2_email?: string;
}
```

**APRÈS:**
```typescript
export interface Client {
  id: number;
  name: string;
  contact: string;
  email?: string;
  phone?: string;
  secteur?: string;
  siege?: string;
  dirigeant?: string;
  typeFacturation?: string;
  // Cases = SELECT COUNT(*) FROM cases WHERE client_id = id
  // Référents = SELECT * FROM client_referents WHERE client_id = id
  created_at?: string;
  updated_at?: string;
}
```

---

### 2. **AVOCAT** - Corriger les types

**AVANT:**
```typescript
hasChildren?: 'Oui' | 'Non';  // ❌ SQL: BOOLEAN
```

**APRÈS:**
```typescript
hasChildren?: boolean;
```

---

### 3. **INVOICE** - Ajouter le champ `reference`

**AVANT:**
```typescript
export interface Invoice {
  id: string;
  caseId: string;
  // ❌ Pas de reference
}
```

**APRÈS:**
```typescript
export interface Invoice {
  id: string;
  reference: string;  // ✅ AJOUTÉ
  caseId: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: 'Réglée' | 'Non réglée' | 'En cours';
  created_at?: string;
  updated_at?: string;
}
```

---

### 4. **CASE** - Corriger le type de client

**AVANT:**
```typescript
export interface Case {
  client: string;  // ❌ Stocke le NOM, pas l'ID
}
```

**APRÈS:**
```typescript
export interface Case {
  id: string;
  reference: string;
  name: string;
  clientId: number;  // ✅ CORRIGÉ (ID numérique)
  client?: string;   // ✅ AJOUTÉ (À charger depuis clients table)
  status: string;
  nextHearing: string | null;
  notes?: string;
  procedures?: CaseProcedure[];
  created_at?: string;
  updated_at?: string;
}
```

---

### 5. **EVENT** - Corriger les types numériques

**AVANT:**
```typescript
budgetPrevisionnel?: string;  // ❌ SQL: DECIMAL(12,2)
budgetRealise?: string;        // ❌ SQL: DECIMAL(12,2)
```

**APRÈS:**
```typescript
budgetPrevisionnel?: number;  // ✅ CORRIGÉ
budgetRealise?: number;        // ✅ CORRIGÉ
financements?: Array<{ label: string; amount: number }>;  // ✅ CORRIGÉ
reports?: EventReport[];       // ✅ AJOUTÉ
created_at?: string;
updated_at?: string;
```

---

### 6. **PERSONNEL** - Corriger les types

**AVANT:**
```typescript
hasChildren: 'Oui' | 'Non';  // ❌ SQL: BOOLEAN
serviceStatus: 'Actif' | 'Inactif' | 'Mise en disponibilité';  // ⚠️ Check SQL defaults
```

**APRÈS:**
```typescript
hasChildren: boolean;  // ✅ CORRIGÉ
serviceStatus: 'Actif' | 'Inactif' | 'Mise en disponibilité' | 'Omis';  // ✅ Standardisé
photo?: string;  // ✅ CORRIGÉ (stocke l'URL, pas File)
bankAccounts?: BankAccount[];  // ✅ AJOUTÉ
created_at?: string;
updated_at?: string;
```

---

### 7. **AVOCAT** - Ajouter bankAccounts

**AVANT:**
```typescript
export interface Avocat {
  // ❌ Pas de bankAccounts
}
```

**APRÈS:**
```typescript
export interface Avocat {
  id: string;
  fullName: string;
  // ... autres champs ...
  bankAccounts?: BankAccount[];  // ✅ AJOUTÉ
  created_at?: string;
  updated_at?: string;
}
```

---

### 8. **EVENTREPORT** - Ajouter les champs manquants

**AVANT:**
```typescript
export interface EventReport {
  id: string;
  title: string;
  content: string;
  dateCreated: string;
  author?: string;
  files?: Array<{ name: string; size: string; content?: string }>;
}
```

**APRÈS:**
```typescript
export interface EventReport {
  id: string;
  eventId: string;  // ✅ AJOUTÉ
  title: string;
  content?: string;
  author?: string;
  dateCreated: string;
  files?: EventReportFile[];  // ✅ Ajouter interface séparé
}

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
```

---

## 🚀 Commandes de Correction

### Option 1: Correction Progressive
Mettez à jour les interfaces une par une dans `src/types/index.ts`

### Option 2: Remplacement en masse
Utilisez find/replace dans VSCode:
- `hasChildren?: 'Oui' | 'Non'` → `hasChildren?: boolean`
- `budgetPrevisionnel?: string` → `budgetPrevisionnel?: number`
- `budgetRealise?: string` → `budgetRealise?: number`

### Option 3: Recréer le fichier
Remplacez complètement `src/types/index.ts` avec la version corrigée

---

## 📋 Checklist de Correction

- [ ] CLIENTS: Supprimer `cases` et `ref1/2_*` fields
- [ ] AVOCAT: Changer `hasChildren` à boolean
- [ ] INVOICE: Ajouter `reference` field
- [ ] CASE: Changer `client` en `clientId` (number)
- [ ] EVENT: Changer budgets à number
- [ ] PERSONNEL: Changer `hasChildren` à boolean
- [ ] AVOCAT & PERSONNEL: Ajouter `bankAccounts?`
- [ ] EVENT: Ajouter `financements?` et `reports?`
- [ ] EVENTREPORT: Ajouter table séparé pour les files
- [ ] Ajouter tous les `created_at` et `updated_at` optionnels

