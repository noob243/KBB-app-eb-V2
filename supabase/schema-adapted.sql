-- ============================================================
-- KBB App v2 — Schéma PostgreSQL pour Supabase (Adapté)
-- Cabinet d'avocats — Gestion complète
-- ============================================================

-- Extension pour générer des UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. CLIENTS (IDs numériques, auto-incrément)
-- ============================================================
CREATE TABLE IF NOT EXISTS clients (
    id              BIGSERIAL PRIMARY KEY,
    name            TEXT NOT NULL,
    contact         TEXT NOT NULL,
    email           TEXT,
    phone           TEXT,
    secteur         TEXT,
    siege           TEXT,
    dirigeant       TEXT,
    type_facturation TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. AVOCATS (IDs texte/UUID)
-- ============================================================
CREATE TABLE IF NOT EXISTS avocats (
    id                    TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    full_name             TEXT NOT NULL,
    photo_url             TEXT,
    first_oath_date       DATE,
    second_oath_date      DATE,
    ona_number            TEXT UNIQUE,
    cabinet_status        TEXT NOT NULL DEFAULT 'Junior',
    service_start_date    DATE,
    service_status        TEXT NOT NULL DEFAULT 'Actif',
    cabinet_role          TEXT,
    phone                 TEXT,
    disciplinary_measures TEXT,
    main_bar              TEXT,
    secondary_bar         TEXT,
    marital_status        TEXT,
    physical_address      TEXT,
    has_children          BOOLEAN DEFAULT FALSE,
    children_count        INTEGER DEFAULT 0,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. CASES (Dossiers - IDs texte/UUID)
-- ============================================================
CREATE TABLE IF NOT EXISTS cases (
    id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    reference    TEXT NOT NULL UNIQUE,
    name         TEXT NOT NULL,
    client_id    BIGINT NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    status       TEXT NOT NULL DEFAULT 'Nouveau',
    next_hearing DATE,
    notes        TEXT,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. TASKS (Tâches - IDs numériques)
-- ============================================================
CREATE TABLE IF NOT EXISTS tasks (
    id             BIGSERIAL PRIMARY KEY,
    name           TEXT NOT NULL,
    case_id        TEXT REFERENCES cases(id) ON DELETE SET NULL,
    lawyer_id      TEXT REFERENCES avocats(id) ON DELETE SET NULL,
    due_date       DATE,
    start_date     DATE,
    end_date       DATE,
    status         TEXT NOT NULL DEFAULT 'Non effectué',
    notes          TEXT,
    rapport        TEXT,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. EVENTS (Événements - IDs texte/UUID)
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
    id                    TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name                  TEXT NOT NULL,
    type                  TEXT NOT NULL DEFAULT 'Autre',
    date                  TIMESTAMPTZ NOT NULL,
    lieu                  TEXT,
    partenaires           TEXT,
    public_cible          TEXT,
    membres_kbb           TEXT,
    membres_externes      TEXT,
    budget_previsionnel   DECIMAL(12,2),
    budget_realise        DECIMAL(12,2),
    sponsors              TEXT,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. INVOICES (Factures - IDs texte/UUID)
-- ============================================================
CREATE TABLE IF NOT EXISTS invoices (
    id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    reference    TEXT NOT NULL UNIQUE,
    case_id      TEXT REFERENCES cases(id) ON DELETE SET NULL,
    due_date     DATE,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    paid_amount  DECIMAL(12,2) NOT NULL DEFAULT 0,
    status       TEXT NOT NULL DEFAULT 'Non réglée',
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. PERSONNEL (non-avocats - IDs texte/UUID)
-- ============================================================
CREATE TABLE IF NOT EXISTS personnels (
    id                   TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    full_name            TEXT NOT NULL,
    role                 TEXT NOT NULL,
    email                TEXT,
    phone                TEXT,
    service_start_date   DATE,
    service_status       TEXT NOT NULL DEFAULT 'Actif',
    salary               DECIMAL(12,2) DEFAULT 0,
    marital_status       TEXT,
    has_children         BOOLEAN DEFAULT FALSE,
    children_count       INTEGER DEFAULT 0,
    address              TEXT,
    photo_url            TEXT,
    disciplinary_measure TEXT,
    disciplinary_status  TEXT,
    created_at           TIMESTAMPTZ DEFAULT NOW(),
    updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. FOURNISSEURS (IDs texte/UUID)
-- ============================================================
CREATE TABLE IF NOT EXISTS fournisseurs (
    id                      TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    nom_complet             TEXT NOT NULL,
    nature_prestation       TEXT NOT NULL,
    designation_prestation  TEXT,
    type_facturation        TEXT NOT NULL,
    periode                 TEXT,
    montant                 DECIMAL(12,2) DEFAULT 0,
    adresse_physique        TEXT,
    adresse_mail            TEXT,
    dirigeant_principal     TEXT,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. PROCEDURES (liées aux dossiers - IDs texte/UUID)
-- ============================================================
CREATE TABLE IF NOT EXISTS procedures (
    id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    case_id    TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    name       TEXT NOT NULL,
    instance   TEXT,
    objet      TEXT,
    date_debut DATE,
    date_fin   DATE,
    status     TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. AUXILIARY TABLES (Sièges, Référents, Emails, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS client_sieges (
    id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    client_id  BIGINT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    adresse    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS client_referents (
    id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    client_id  BIGINT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    nom        TEXT NOT NULL,
    phone      TEXT,
    email      TEXT
);

CREATE TABLE IF NOT EXISTS avocat_emails (
    id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    avocat_id  TEXT NOT NULL REFERENCES avocats(id) ON DELETE CASCADE,
    email      TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS avocat_barreaux (
    id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    avocat_id  TEXT NOT NULL REFERENCES avocats(id) ON DELETE CASCADE,
    barreau    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS fournisseur_referents (
    id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    fournisseur_id  TEXT NOT NULL REFERENCES fournisseurs(id) ON DELETE CASCADE,
    nom             TEXT NOT NULL,
    phone           TEXT,
    email           TEXT
);

CREATE TABLE IF NOT EXISTS task_associated_lawyers (
    task_id    BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    avocat_id  TEXT NOT NULL REFERENCES avocats(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, avocat_id)
);

CREATE TABLE IF NOT EXISTS procedure_linked_cases (
    procedure_id TEXT NOT NULL REFERENCES procedures(id) ON DELETE CASCADE,
    case_id      TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    PRIMARY KEY (procedure_id, case_id)
);

CREATE TABLE IF NOT EXISTS task_linked_procedures (
    task_id      BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    procedure_id TEXT NOT NULL REFERENCES procedures(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, procedure_id)
);

-- ============================================================
-- 11. MESSAGES / CHAT
-- ============================================================
CREATE TABLE IF NOT EXISTS conversations (
    id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    participant1 TEXT NOT NULL,
    participant2 TEXT NOT NULL,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
    id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender          TEXT NOT NULL,
    text            TEXT NOT NULL,
    sent_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 11b. BANK ACCOUNTS (Avocats + Personnels)
-- ============================================================
CREATE TABLE IF NOT EXISTS bank_accounts (
    id             TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    avocat_id      TEXT REFERENCES avocats(id) ON DELETE CASCADE,
    personnel_id   TEXT REFERENCES personnels(id) ON DELETE CASCADE,
    bank_name      TEXT NOT NULL,
    account_number TEXT,
    iban           TEXT,
    swift          TEXT,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_owner CHECK (
        (avocat_id IS NOT NULL AND personnel_id IS NULL) OR
        (avocat_id IS NULL AND personnel_id IS NOT NULL)
    )
);

-- ============================================================
-- 11c. EVENT REPORTS & FINANCEMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS event_financements (
    id        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    event_id  TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    label     TEXT NOT NULL,
    amount    DECIMAL(12,2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS event_reports (
    id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    event_id     TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    title        TEXT NOT NULL,
    content      TEXT,
    author       TEXT,
    date_created TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_report_files (
    id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    report_id     TEXT NOT NULL REFERENCES event_reports(id) ON DELETE CASCADE,
    name          TEXT NOT NULL,
    size          TEXT,
    storage_path  TEXT
);

-- ============================================================
-- 12. INDEX POUR LES PERFORMANCES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_cases_client       ON cases(client_id);
CREATE INDEX IF NOT EXISTS idx_cases_status       ON cases(status);
CREATE INDEX IF NOT EXISTS idx_tasks_case         ON tasks(case_id);
CREATE INDEX IF NOT EXISTS idx_tasks_lawyer       ON tasks(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status       ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date     ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_case      ON invoices(case_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status    ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_procedures_case    ON procedures(case_id);
CREATE INDEX IF NOT EXISTS idx_events_date        ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_type        ON events(type);
CREATE INDEX IF NOT EXISTS idx_messages_conv      ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_client_sieges      ON client_sieges(client_id);
CREATE INDEX IF NOT EXISTS idx_bank_avocat        ON bank_accounts(avocat_id);
CREATE INDEX IF NOT EXISTS idx_bank_personnel     ON bank_accounts(personnel_id);
CREATE INDEX IF NOT EXISTS idx_event_financements ON event_financements(event_id);
CREATE INDEX IF NOT EXISTS idx_event_reports      ON event_reports(event_id);
CREATE INDEX IF NOT EXISTS idx_event_files        ON event_report_files(report_id);

-- ============================================================
-- 13. TRIGGERS updated_at AUTOMATIQUE
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS trg_clients_updated    BEFORE UPDATE ON clients      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER IF NOT EXISTS trg_avocats_updated    BEFORE UPDATE ON avocats      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER IF NOT EXISTS trg_cases_updated      BEFORE UPDATE ON cases        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER IF NOT EXISTS trg_tasks_updated      BEFORE UPDATE ON tasks        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER IF NOT EXISTS trg_events_updated     BEFORE UPDATE ON events       FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER IF NOT EXISTS trg_invoices_updated   BEFORE UPDATE ON invoices     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER IF NOT EXISTS trg_personnels_updated BEFORE UPDATE ON personnels   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER IF NOT EXISTS trg_fournisseurs_updated BEFORE UPDATE ON fournisseurs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER IF NOT EXISTS trg_bank_accounts_updated BEFORE UPDATE ON bank_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER IF NOT EXISTS trg_event_reports_updated BEFORE UPDATE ON event_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 14. ROW LEVEL SECURITY (prêt pour Supabase Auth)
-- ============================================================
ALTER TABLE IF EXISTS clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS avocats ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS personnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS fournisseurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS messages ENABLE ROW LEVEL SECURITY;

-- Politique par défaut : accès total pour les utilisateurs authentifiés
CREATE POLICY IF NOT EXISTS "Authenticated full access" ON clients      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated full access" ON avocats      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated full access" ON cases        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated full access" ON tasks        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated full access" ON events       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated full access" ON invoices     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated full access" ON personnels   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated full access" ON fournisseurs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated full access" ON messages     FOR ALL USING (auth.role() = 'authenticated');
