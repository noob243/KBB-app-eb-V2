-- ============================================================
-- KBB App v2 — Schéma PostgreSQL pour Supabase
-- Cabinet d'avocats — Gestion complète
-- ============================================================

-- Extension pour générer des UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. CLIENTS
-- ============================================================
CREATE TABLE clients (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Sièges multiples d'un client
CREATE TABLE client_sieges (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id  UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    adresse    TEXT NOT NULL
);

-- Référents d'un client (max 2 dans l'UI, mais flexible ici)
CREATE TABLE client_referents (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id  UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    nom        TEXT NOT NULL,
    phone      TEXT,
    email      TEXT
);

-- ============================================================
-- 2. AVOCATS
-- ============================================================
CREATE TYPE cabinet_status AS ENUM ('Senior of counsel', 'Senior', 'Associé', 'Junior');
CREATE TYPE service_status AS ENUM ('Actif', 'Inactif', 'Omis', 'Mise en disponibilité');
CREATE TYPE barreau_principal AS ENUM ('Kinshasa-Gombe', 'Kinshasa-Matete', 'Lualaba', 'Haut Katanga', 'Kwilu');
CREATE TYPE marital_status AS ENUM ('Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf(ve)');

CREATE TABLE avocats (
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name             TEXT NOT NULL,
    photo_url             TEXT,
    first_oath_date       DATE,
    second_oath_date      DATE,
    ona_number            TEXT UNIQUE,
    cabinet_status        cabinet_status NOT NULL DEFAULT 'Junior',
    service_start_date    DATE,
    service_status        service_status NOT NULL DEFAULT 'Actif',
    cabinet_role          TEXT,
    phone                 TEXT,
    disciplinary_measures TEXT,
    main_bar              barreau_principal,
    secondary_bar         TEXT,
    marital_status        marital_status,
    physical_address      TEXT,
    has_children          BOOLEAN DEFAULT FALSE,
    children_count        INTEGER DEFAULT 0,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE avocat_emails (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    avocat_id  UUID NOT NULL REFERENCES avocats(id) ON DELETE CASCADE,
    email      TEXT NOT NULL
);

CREATE TABLE avocat_barreaux (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    avocat_id  UUID NOT NULL REFERENCES avocats(id) ON DELETE CASCADE,
    barreau    TEXT NOT NULL
);

-- ============================================================
-- 3. DOSSIERS (CASES)
-- ============================================================
CREATE TYPE case_status AS ENUM ('Nouveau', 'En cours', 'En attente', 'Clôturé');

CREATE TABLE cases (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference    TEXT NOT NULL UNIQUE,
    name         TEXT NOT NULL,
    client_id    UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    status       case_status NOT NULL DEFAULT 'Nouveau',
    next_hearing DATE,
    notes        TEXT,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. PROCÉDURES (liées aux dossiers)
-- ============================================================
CREATE TABLE procedures (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id    UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    name       TEXT NOT NULL,
    instance   TEXT,
    objet      TEXT,
    date_debut DATE,
    date_fin   DATE,
    status     TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Liaison procédure ↔ dossiers liés (many-to-many)
CREATE TABLE procedure_linked_cases (
    procedure_id UUID NOT NULL REFERENCES procedures(id) ON DELETE CASCADE,
    case_id      UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    PRIMARY KEY (procedure_id, case_id)
);

-- ============================================================
-- 5. TÂCHES
-- ============================================================
CREATE TYPE task_status AS ENUM ('Effectué', 'Non effectué', 'Effectué à moitié');

CREATE TABLE tasks (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name           TEXT NOT NULL,
    case_id        UUID REFERENCES cases(id) ON DELETE SET NULL,
    lawyer_id      UUID REFERENCES avocats(id) ON DELETE SET NULL,
    due_date       DATE,
    start_date     DATE,
    end_date       DATE,
    status         task_status NOT NULL DEFAULT 'Non effectué',
    notes          TEXT,
    rapport        TEXT,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Avocats associés à une tâche (many-to-many)
CREATE TABLE task_associated_lawyers (
    task_id    UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    avocat_id  UUID NOT NULL REFERENCES avocats(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, avocat_id)
);

-- Procédures liées à une tâche (many-to-many)
CREATE TABLE task_linked_procedures (
    task_id      UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    procedure_id UUID NOT NULL REFERENCES procedures(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, procedure_id)
);

-- ============================================================
-- 6. ÉVÉNEMENTS
-- ============================================================
CREATE TYPE event_type AS ENUM ('Audience', 'Conférence', 'Colloque', 'Séminaire', 'Autre');

CREATE TABLE events (
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                  TEXT NOT NULL,
    type                  event_type NOT NULL DEFAULT 'Autre',
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

CREATE TABLE event_financements (
    id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id  UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    label     TEXT NOT NULL,
    amount    DECIMAL(12,2) NOT NULL DEFAULT 0
);

CREATE TABLE event_reports (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id     UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    title        TEXT NOT NULL,
    content      TEXT,
    author       TEXT,
    date_created TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE event_report_files (
    id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES event_reports(id) ON DELETE CASCADE,
    name      TEXT NOT NULL,
    size      TEXT,
    storage_path TEXT  -- chemin dans Supabase Storage
);

-- ============================================================
-- 7. FACTURATION
-- ============================================================
CREATE TYPE invoice_status AS ENUM ('Réglée', 'Non réglée', 'En cours');

CREATE TABLE invoices (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference    TEXT NOT NULL UNIQUE,
    case_id      UUID REFERENCES cases(id) ON DELETE SET NULL,
    due_date     DATE,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    paid_amount  DECIMAL(12,2) NOT NULL DEFAULT 0,
    status       invoice_status NOT NULL DEFAULT 'Non réglée',
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. PERSONNEL (non-avocats)
-- ============================================================
CREATE TABLE personnels (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name            TEXT NOT NULL,
    role                 TEXT NOT NULL,
    email                TEXT,
    phone                TEXT,
    service_start_date   DATE,
    service_status       service_status NOT NULL DEFAULT 'Actif',
    salary               DECIMAL(12,2) DEFAULT 0,
    marital_status       marital_status,
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
-- 9. COMPTES BANCAIRES (avocats + personnel)
-- ============================================================
CREATE TABLE bank_accounts (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    avocat_id      UUID REFERENCES avocats(id) ON DELETE CASCADE,
    personnel_id   UUID REFERENCES personnels(id) ON DELETE CASCADE,
    bank_name      TEXT NOT NULL,
    account_number TEXT,
    iban           TEXT,
    swift          TEXT,
    CONSTRAINT chk_owner CHECK (
        (avocat_id IS NOT NULL AND personnel_id IS NULL) OR
        (avocat_id IS NULL AND personnel_id IS NOT NULL)
    )
);

-- ============================================================
-- 10. FOURNISSEURS
-- ============================================================
CREATE TYPE nature_prestation AS ENUM ('Bien', 'Services');
CREATE TYPE type_facturation AS ENUM ('Périodique', 'Ponctuelle');
CREATE TYPE periode_facturation AS ENUM ('mensuel', 'trimestriel', 'Annuel');

CREATE TABLE fournisseurs (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom_complet             TEXT NOT NULL,
    nature_prestation       nature_prestation NOT NULL,
    designation_prestation  TEXT,
    type_facturation        type_facturation NOT NULL,
    periode                 periode_facturation,
    montant                 DECIMAL(12,2) DEFAULT 0,
    adresse_physique        TEXT,
    adresse_mail            TEXT,
    dirigeant_principal     TEXT,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE fournisseur_referents (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fournisseur_id  UUID NOT NULL REFERENCES fournisseurs(id) ON DELETE CASCADE,
    nom             TEXT NOT NULL,
    phone           TEXT,
    email           TEXT
);

-- ============================================================
-- 11. MESSAGES / CHAT
-- ============================================================
CREATE TABLE conversations (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant1 TEXT NOT NULL,
    participant2 TEXT NOT NULL,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender          TEXT NOT NULL,
    text            TEXT NOT NULL,
    sent_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 12. INDEX POUR LES PERFORMANCES
-- ============================================================
CREATE INDEX idx_cases_client       ON cases(client_id);
CREATE INDEX idx_cases_status       ON cases(status);
CREATE INDEX idx_tasks_case         ON tasks(case_id);
CREATE INDEX idx_tasks_lawyer       ON tasks(lawyer_id);
CREATE INDEX idx_tasks_status       ON tasks(status);
CREATE INDEX idx_tasks_due_date     ON tasks(due_date);
CREATE INDEX idx_invoices_case      ON invoices(case_id);
CREATE INDEX idx_invoices_status    ON invoices(status);
CREATE INDEX idx_procedures_case    ON procedures(case_id);
CREATE INDEX idx_events_date        ON events(date);
CREATE INDEX idx_events_type        ON events(type);
CREATE INDEX idx_messages_conv      ON messages(conversation_id);
CREATE INDEX idx_bank_avocat        ON bank_accounts(avocat_id);
CREATE INDEX idx_bank_personnel     ON bank_accounts(personnel_id);

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

DROP TRIGGER IF EXISTS trg_clients_updated     ON clients;
DROP TRIGGER IF EXISTS trg_avocats_updated     ON avocats;
DROP TRIGGER IF EXISTS trg_cases_updated       ON cases;
DROP TRIGGER IF EXISTS trg_tasks_updated       ON tasks;
DROP TRIGGER IF EXISTS trg_events_updated      ON events;
DROP TRIGGER IF EXISTS trg_invoices_updated    ON invoices;
DROP TRIGGER IF EXISTS trg_personnels_updated  ON personnels;
DROP TRIGGER IF EXISTS trg_fournisseurs_updated ON fournisseurs;

CREATE TRIGGER trg_clients_updated      BEFORE UPDATE ON clients       FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_avocats_updated      BEFORE UPDATE ON avocats       FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_cases_updated        BEFORE UPDATE ON cases         FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_tasks_updated        BEFORE UPDATE ON tasks         FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_events_updated       BEFORE UPDATE ON events        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_invoices_updated     BEFORE UPDATE ON invoices      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_personnels_updated   BEFORE UPDATE ON personnels    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_fournisseurs_updated BEFORE UPDATE ON fournisseurs  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 14. ROW LEVEL SECURITY (prêt pour Supabase Auth)
-- ============================================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE avocats ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE personnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE fournisseurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Politique par défaut : accès total pour les utilisateurs authentifiés
-- À affiner selon les rôles (admin, avocat, secrétaire, etc.)
CREATE POLICY "Public full access" ON clients      FOR ALL USING (true);
CREATE POLICY "Public full access" ON avocats      FOR ALL USING (true);
CREATE POLICY "Public full access" ON cases        FOR ALL USING (true);
CREATE POLICY "Public full access" ON tasks        FOR ALL USING (true);
CREATE POLICY "Public full access" ON events       FOR ALL USING (true);
CREATE POLICY "Public full access" ON invoices     FOR ALL USING (true);
CREATE POLICY "Public full access" ON personnels   FOR ALL USING (true);
CREATE POLICY "Public full access" ON fournisseurs FOR ALL USING (true);
CREATE POLICY "Public full access" ON messages     FOR ALL USING (true);
