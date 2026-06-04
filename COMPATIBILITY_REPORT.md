# 📋 Rapport de Compatibilité Frontend ↔ Supabase

## 🔍 Analyse des Types TypeScript vs Schéma SQL

Date: 2026-06-04

---

## ✅ TABLES COMPATIBLES (Sans problèmes)

### 1. **TASKS** ✅
| TypeScript | SQL | Match |
|-----------|-----|-------|
| id: number | BIGSERIAL | ✅ |
| name | TEXT | ✅ |
| caseId | case_id (TEXT) | ✅ |
| lawyer | lawyer_id (TEXT) | ✅ |
| dueDate | due_date (DATE) | ✅ |
| status | TEXT | ✅ |
| notes | TEXT | ✅ |
| rapport | TEXT | ✅ |
| startDate | start_date (DATE) | ✅ |
| endDate | end_date (DATE) | ✅ |

---

## ⚠️ TABLES AVEC DIVERGENCES

### 2. **CLIENTS** ⚠️ 3 DIVERGENCES

| TypeScript | SQL | Statut |
|-----------|-----|--------|
| id | BIGSERIAL | ✅ |
| name | TEXT | ✅ |
| contact | TEXT | ✅ |
| cases | ❌ **N'EXISTE PAS** | ⚠️ |
| email | TEXT | ✅ |
| phone | TEXT | ✅ |
| secteur | TEXT | ✅ |
| siege | TEXT | ✅ |
| sieges[] | ⚠️ Voir table `client_sieges` | ✅ (relation) |
| dirigeant | TEXT | ✅ |
| ref1_nom | ❌ **N'EXISTE PAS** | ⚠️ |
| ref1_phone | ❌ **N'EXISTE PAS** | ⚠️ |
| ref1_email | ❌ **N'EXISTE PAS** | ⚠️ |
| ref2_nom | ❌ **N'EXISTE PAS** | ⚠️ |
| ref2_phone | ❌ **N'EXISTE PAS** | ⚠️ |
| ref2_email | ❌ **N'EXISTE PAS** | ⚠️ |
| typeFacturation | type_facturation | ✅ |

**DIVERGENCES:**
- ❌ `cases` (nombre de dossiers) - À CALCULER depuis la table `cases`
- ❌ `ref1_nom`, `ref1_phone`, `ref1_email` - À STOCKER dans `client_referents`
- ❌ `ref2_nom`, `ref2_phone`, `ref2_email` - À STOCKER dans `client_referents`

---

### 3. **AVOCATS** ⚠️ 5 DIVERGENCES

| TypeScript | SQL | Statut |
|-----------|-----|--------|
| id | TEXT (UUID) | ✅ |
| fullName | full_name | ✅ |
| photo | ❌ **File object** | ⚠️ |
| photoUrl | photo_url | ✅ |
| firstOathDate | first_oath_date | ✅ |
| secondOathDate | second_oath_date | ✅ |
| onaNumber | ona_number | ✅ |
| cabinetStatus | cabinet_status | ✅ |
| serviceStartDate | service_start_date | ✅ |
| serviceStatus | service_status | ✅ |
| cabinetRole | cabinet_role | ✅ |
| phone | TEXT | ✅ |
| emails[] | ⚠️ Voir `avocat_emails` | ✅ (relation) |
| disciplinaryMeasures | disciplinary_measures | ✅ |
| mainBar | main_bar | ✅ |
| secondaryBar | secondary_bar | ✅ |
| barreaux[] | ⚠️ Voir `avocat_barreaux` | ✅ (relation) |
| maritalStatus | marital_status | ✅ |
| physicalAddress | physical_address | ✅ |
| hasChildren | has_children (BOOLEAN) | ⚠️ Type mismatch |
| childrenCount | children_count | ✅ |
| bankAccounts[] | ❌ **N'EXISTE PAS** | ❌ |

**DIVERGENCES:**
- ⚠️ `photo` (File object) - Stocker uniquement `photo_url` (string)
- ⚠️ `hasChildren` - SQL: BOOLEAN, TS: 'Oui'|'Non' (enum string) → À STANDARDISER
- ❌ `bankAccounts[]` - À CRÉER table `bank_accounts`

---

### 4. **CASES** ⚠️ 2 DIVERGENCES

| TypeScript | SQL | Statut |
|-----------|-----|--------|
| id | TEXT (UUID) | ✅ |
| name | TEXT | ✅ |
| client | ❌ **client_id (BIGINT)** | ⚠️ Type mismatch |
| status | TEXT | ✅ |
| nextHearing | next_hearing (DATE) | ✅ |
| procedure | ❌ **N'EXISTE PAS** | ⚠️ |
| procedureInstance | ❌ **N'EXISTE PAS** | ⚠️ |
| procedureObjet | ❌ **N'EXISTE PAS** | ⚠️ |
| procedureDateDebut | ❌ **N'EXISTE PAS** | ⚠️ |
| procedureDateFin | ❌ **N'EXISTE PAS** | ⚠️ |
| procedureStatus | ❌ **N'EXISTE PAS** | ⚠️ |
| notes | TEXT | ✅ |
| procedures[] | ⚠️ Voir `procedures` table | ✅ (relation) |

**DIVERGENCES:**
- ⚠️ `client` - SQL: client_id (BIGINT), TS: string (nom) → À CORRIGER
- ⚠️ `procedure*` fields - À RÉCUPÉRER depuis `procedures` table
- ❌ Missing fields en SQL: `reference` (TEXT NOT NULL) - À AJOUTER au TS

---

### 5. **INVOICES** ⚠️ 1 DIVERGENCE

| TypeScript | SQL | Statut |
|-----------|-----|--------|
| id | TEXT (UUID) | ✅ |
| caseId | case_id (TEXT) | ✅ |
| dueDate | due_date (DATE) | ✅ |
| totalAmount | total_amount (DECIMAL) | ✅ |
| paidAmount | paid_amount (DECIMAL) | ✅ |
| status | TEXT | ✅ |
| ❌ reference | TEXT NOT NULL (SQL) | ⚠️ |

**DIVERGENCES:**
- ⚠️ `reference` (SQL) - À AJOUTER au TS

---

### 6. **PERSONNEL** ⚠️ 2 DIVERGENCES

| TypeScript | SQL | Statut |
|-----------|-----|--------|
| id | TEXT (UUID) | ✅ |
| fullName | full_name | ✅ |
| role | TEXT | ✅ |
| email | TEXT | ✅ |
| phone | TEXT | ✅ |
| serviceStartDate | service_start_date (DATE) | ✅ |
| serviceStatus | service_status (TEXT) | ⚠️ Enum mismatch |
| salary | DECIMAL(12,2) | ✅ |
| maritalStatus | marital_status | ✅ |
| hasChildren | has_children (BOOLEAN) | ⚠️ Type mismatch |
| childrenCount | children_count | ✅ |
| address | TEXT | ✅ |
| photo | photo_url (TEXT) | ✅ |
| disciplinaryMeasure | disciplinary_measure | ✅ |
| disciplinaryStatus | disciplinary_status | ✅ |
| bankAccounts[] | ❌ **N'EXISTE PAS** | ❌ |

**DIVERGENCES:**
- ⚠️ `hasChildren` - SQL: BOOLEAN, TS: 'Oui'|'Non' → À STANDARDISER
- ⚠️ `serviceStatus` - SQL: 'Actif' par défaut, TS: 'Actif'|'Inactif'|'Mise en disponibilité' 
- ❌ `bankAccounts[]` - À CRÉER table `bank_accounts`

---

### 7. **EVENTS** ⚠️ 1 DIVERGENCE

| TypeScript | SQL | Statut |
|-----------|-----|--------|
| id | TEXT (UUID) | ✅ |
| name | TEXT | ✅ |
| type | TEXT | ✅ |
| date | TIMESTAMPTZ | ✅ |
| lieu | TEXT | ✅ |
| partenaires | TEXT | ✅ |
| publicCible | public_cible | ✅ |
| membresKBB | membres_kbb | ✅ |
| membresExternes | membres_externes | ✅ |
| budgetPrevisionnel | budget_previsionnel (DECIMAL) | ⚠️ Type mismatch |
| budgetRealise | budget_realise (DECIMAL) | ⚠️ Type mismatch |
| financement | ❌ **N'EXISTE PAS** | ⚠️ |
| financements[] | ⚠️ Voir `event_financements` | ⚠️ Table manquante |
| sponsors | TEXT | ✅ |
| reports[] | ⚠️ Voir `event_reports` | ⚠️ Table manquante |

**DIVERGENCES:**
- ⚠️ `budgetPrevisionnel` - SQL: DECIMAL(12,2), TS: string → À STANDARDISER
- ⚠️ `budgetRealise` - SQL: DECIMAL(12,2), TS: string → À STANDARDISER
- ❌ `event_financements` table - MANQUANTE dans schema-adapted.sql
- ❌ `event_reports` table - MANQUANTE dans schema-adapted.sql
- ❌ `event_report_files` table - MANQUANTE dans schema-adapted.sql

---

### 8. **FOURNISSEURS** ✅

| TypeScript | SQL | Statut |
|-----------|-----|--------|
| id | TEXT (UUID) | ✅ |
| nomComplet | nom_complet | ✅ |
| naturePrestation | nature_prestation | ✅ |
| designationPrestation | designation_prestation | ✅ |
| typeFacturation | type_facturation | ✅ |
| periode | TEXT | ✅ |
| montant | DECIMAL(12,2) | ✅ |
| adressePhysique | adresse_physique | ✅ |
| adresseMail | adresse_mail | ✅ |
| dirigeantPrincipal | dirigeant_principal | ✅ |
| referents[] | ⚠️ Voir `fournisseur_referents` | ✅ (relation) |

---

## 📊 RÉSUMÉ DES PROBLÈMES

### 🔴 CRITIQUES (À corriger immédiatement)

1. **CLIENTS.cases** - Champ TS n'existe pas en SQL
   - Correction: Calculer depuis COUNT(*) de la table `cases`

2. **CLIENTS.ref1_*, ref2_*** - Champs TS n'existent pas en SQL
   - Correction: Stocker dans `client_referents` (1 à N relations)

3. **AVOCATS.bankAccounts** - Table manquante
   - Correction: Créer table `bank_accounts` si nécessaire

4. **AVOCAT.hasChildren** - Type mismatch (TS: enum, SQL: boolean)
   - Correction: Standardiser à BOOLEAN dans TS

5. **CASES.client** - Type mismatch (TS: string, SQL: BIGINT)
   - Correction: Utiliser `client_id` et join avec `clients`

6. **CASES.reference** - Champ SQL n'existe pas en TS
   - Correction: Ajouter au TS

7. **EVENTS.financements** - Tables manquantes
   - Correction: Ajouter `event_financements` et `event_reports`

8. **PERSONNEL.serviceStatus** - Énums différents
   - Correction: Standardiser les valeurs

---

## 🛠️ ACTIONS RECOMMANDÉES

### Priority 1: Types TypeScript
- [ ] Ajouter `reference` à `Invoice`
- [ ] Changer `hasChildren` de 'Oui'|'Non' à boolean
- [ ] Changer `cases` (nombre) en calculé
- [ ] Changer `client` (string) en `clientId` (number)

### Priority 2: Tables SQL manquantes
- [ ] Ajouter `bank_accounts`
- [ ] Ajouter `event_financements`
- [ ] Ajouter `event_reports`
- [ ] Ajouter `event_report_files`

### Priority 3: Normalisation
- [ ] Standardiser les enums d'état
- [ ] Standardiser les types numériques (string vs number)
- [ ] Ajouter migrations pour données existantes

