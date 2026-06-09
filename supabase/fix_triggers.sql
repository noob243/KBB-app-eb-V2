-- Script de correction des triggers
-- Supprimer les anciens triggers
DROP TRIGGER IF EXISTS trg_clients_updated      ON clients;
DROP TRIGGER IF EXISTS trg_avocats_updated      ON avocats;
DROP TRIGGER IF EXISTS trg_cases_updated        ON cases;
DROP TRIGGER IF EXISTS trg_tasks_updated        ON tasks;
DROP TRIGGER IF EXISTS trg_events_updated       ON events;
DROP TRIGGER IF EXISTS trg_invoices_updated     ON invoices;
DROP TRIGGER IF EXISTS trg_personnels_updated   ON personnels;
DROP TRIGGER IF EXISTS trg_fournisseurs_updated ON fournisseurs;

-- Recréer la fonction
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recréer les triggers
CREATE TRIGGER trg_clients_updated      BEFORE UPDATE ON clients       FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_avocats_updated      BEFORE UPDATE ON avocats       FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_cases_updated        BEFORE UPDATE ON cases         FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_tasks_updated        BEFORE UPDATE ON tasks         FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_events_updated       BEFORE UPDATE ON events        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_invoices_updated     BEFORE UPDATE ON invoices      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_personnels_updated   BEFORE UPDATE ON personnels    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_fournisseurs_updated BEFORE UPDATE ON fournisseurs  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
