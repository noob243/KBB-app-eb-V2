-- ============================================================
-- MIGRATION: Corrections pour synchronisation TypeScript/Supabase
-- Date: 2026-06-04
-- ============================================================

-- IMPORTANT: À exécuter APRÈS le schéma de base (schema-adapted.sql)

-- ============================================================
-- 1. CORRECTION: Ajouter colonne `cases` à CLIENTS (calculée)
-- ============================================================
-- Note: `cases` ne doit pas être stocké, mais calculé via:
-- SELECT COUNT(*) FROM cases WHERE client_id = clients.id
-- Donc pas besoin d'ajouter une colonne

-- ============================================================
-- 2. CORRECTION: Ajouter colonne `reference` à CASES
-- ============================================================
ALTER TABLE IF EXISTS cases ADD COLUMN reference TEXT UNIQUE;

-- Générer les références manquantes (si nécessaire)
UPDATE cases SET reference = 'CASE-' || id WHERE reference IS NULL;

-- Rendre la colonne NOT NULL après correction
ALTER TABLE IF EXISTS cases ALTER COLUMN reference SET NOT NULL;

-- ============================================================
-- 3. CORRECTION: Standardiser les énums
-- ============================================================

-- Personnel: Ajouter 'Omis' au statut service_status
-- (Si le champ accepte déjà TEXT, c'est OK)

-- ============================================================
-- 4. NORMALISATION: Ajouter colonnes created_at et updated_at
-- ============================================================

-- Si manquantes (vérifier d'abord):
-- ALTER TABLE clients ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
-- ALTER TABLE clients ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================================
-- 5. CORRECTION: Convertir les booléens TEXT → BOOLEAN
-- ============================================================

-- Fonction helper pour converter 'Oui'/'Non' → BOOLEAN
CREATE OR REPLACE FUNCTION convert_text_to_bool(p_value TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  CASE 
    WHEN p_value = 'Oui' THEN RETURN TRUE;
    WHEN p_value = 'Non' THEN RETURN FALSE;
    WHEN p_value IS NULL THEN RETURN FALSE;
    ELSE RETURN FALSE;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Note: Si les colonnes ont_children sont en TEXT (stockant 'Oui'/'Non')
-- Il faudra créer une nouvelle colonne BOOLEAN, copier/convertir les données, 
-- puis supprimer l'ancienne et la renommer

-- ============================================================
-- 6. ASSURER LES FOREIGN KEYS
-- ============================================================

-- Cas 1: cases.client_id doit référencer clients.id
ALTER TABLE IF EXISTS cases ADD CONSTRAINT IF NOT EXISTS fk_cases_client_id
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE RESTRICT;

-- Cas 2: tasks.case_id doit référencer cases.id
ALTER TABLE IF EXISTS tasks ADD CONSTRAINT IF NOT EXISTS fk_tasks_case_id
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE SET NULL;

-- Cas 3: invoices.case_id doit référencer cases.id
ALTER TABLE IF EXISTS invoices ADD CONSTRAINT IF NOT EXISTS fk_invoices_case_id
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE SET NULL;

-- ============================================================
-- 7. AJOUTER ROW LEVEL SECURITY AUX NOUVELLES TABLES
-- ============================================================

ALTER TABLE IF EXISTS bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS event_financements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS event_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS event_report_files ENABLE ROW LEVEL SECURITY;

-- Politiques par défaut
CREATE POLICY IF NOT EXISTS "Authenticated full access" ON bank_accounts 
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated full access" ON event_financements 
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated full access" ON event_reports 
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated full access" ON event_report_files 
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- 8. VÉRIFICATION: Lister les divergences restantes
-- ============================================================

-- Vérifier que tous les IDs existent
SELECT 'clients' as table_name, COUNT(*) as count FROM clients
UNION ALL
SELECT 'cases', COUNT(*) FROM cases
UNION ALL
SELECT 'tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'avocats', COUNT(*) FROM avocats
UNION ALL
SELECT 'events', COUNT(*) FROM events
UNION ALL
SELECT 'invoices', COUNT(*) FROM invoices
UNION ALL
SELECT 'personnels', COUNT(*) FROM personnels
UNION ALL
SELECT 'fournisseurs', COUNT(*) FROM fournisseurs;

-- ============================================================
-- 9. COMMANDES DE VÉRIFICATION
-- ============================================================

-- Vérifier les colonnes de chaque table:
-- \d clients;
-- \d cases;
-- \d tasks;
-- etc.

-- Vérifier les references:
-- SELECT * FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY';

-- Vérifier les policies RLS:
-- SELECT * FROM pg_policies;

-- ============================================================
-- FIN MIGRATION
-- ============================================================
