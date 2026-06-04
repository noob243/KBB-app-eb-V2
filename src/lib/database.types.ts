// Types générés à partir du schéma PostgreSQL Supabase
// Ces types assurent la cohérence entre le frontend et la base de données

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          name: string;
          contact: string;
          email: string | null;
          phone: string | null;
          secteur: string | null;
          siege: string | null;
          dirigeant: string | null;
          type_facturation: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['clients']['Insert']>;
      };

      client_sieges: {
        Row: { id: string; client_id: string; adresse: string };
        Insert: Omit<Database['public']['Tables']['client_sieges']['Row'], 'id'> & { id?: string };
        Update: Partial<Database['public']['Tables']['client_sieges']['Insert']>;
      };

      client_referents: {
        Row: { id: string; client_id: string; nom: string; phone: string | null; email: string | null };
        Insert: Omit<Database['public']['Tables']['client_referents']['Row'], 'id'> & { id?: string };
        Update: Partial<Database['public']['Tables']['client_referents']['Insert']>;
      };

      avocats: {
        Row: {
          id: string;
          full_name: string;
          photo_url: string | null;
          first_oath_date: string | null;
          second_oath_date: string | null;
          ona_number: string | null;
          cabinet_status: 'Senior of counsel' | 'Senior' | 'Associé' | 'Junior';
          service_start_date: string | null;
          service_status: 'Actif' | 'Inactif' | 'Omis' | 'Mise en disponibilité';
          cabinet_role: string | null;
          phone: string | null;
          disciplinary_measures: string | null;
          main_bar: 'Kinshasa-Gombe' | 'Kinshasa-Matete' | 'Lualaba' | 'Haut Katanga' | 'Kwilu' | null;
          secondary_bar: string | null;
          marital_status: 'Célibataire' | 'Marié(e)' | 'Divorcé(e)' | 'Veuf(ve)' | null;
          physical_address: string | null;
          has_children: boolean;
          children_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['avocats']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string; created_at?: string; updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['avocats']['Insert']>;
      };

      avocat_emails: {
        Row: { id: string; avocat_id: string; email: string };
        Insert: Omit<Database['public']['Tables']['avocat_emails']['Row'], 'id'> & { id?: string };
        Update: Partial<Database['public']['Tables']['avocat_emails']['Insert']>;
      };

      avocat_barreaux: {
        Row: { id: string; avocat_id: string; barreau: string };
        Insert: Omit<Database['public']['Tables']['avocat_barreaux']['Row'], 'id'> & { id?: string };
        Update: Partial<Database['public']['Tables']['avocat_barreaux']['Insert']>;
      };

      cases: {
        Row: {
          id: string;
          reference: string;
          name: string;
          client_id: string;
          status: 'Nouveau' | 'En cours' | 'En attente' | 'Clôturé';
          next_hearing: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['cases']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string; created_at?: string; updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['cases']['Insert']>;
      };

      procedures: {
        Row: {
          id: string;
          case_id: string;
          name: string;
          instance: string | null;
          objet: string | null;
          date_debut: string | null;
          date_fin: string | null;
          status: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['procedures']['Row'], 'id' | 'created_at'> & {
          id?: string; created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['procedures']['Insert']>;
      };

      tasks: {
        Row: {
          id: string;
          name: string;
          case_id: string | null;
          lawyer_id: string | null;
          due_date: string | null;
          start_date: string | null;
          end_date: string | null;
          status: 'Effectué' | 'Non effectué' | 'Effectué à moitié';
          notes: string | null;
          rapport: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tasks']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string; created_at?: string; updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['tasks']['Insert']>;
      };

      events: {
        Row: {
          id: string;
          name: string;
          type: 'Audience' | 'Conférence' | 'Colloque' | 'Séminaire' | 'Autre';
          date: string;
          lieu: string | null;
          partenaires: string | null;
          public_cible: string | null;
          membres_kbb: string | null;
          membres_externes: string | null;
          budget_previsionnel: number | null;
          budget_realise: number | null;
          sponsors: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string; created_at?: string; updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['events']['Insert']>;
      };

      event_financements: {
        Row: { id: string; event_id: string; label: string; amount: number };
        Insert: Omit<Database['public']['Tables']['event_financements']['Row'], 'id'> & { id?: string };
        Update: Partial<Database['public']['Tables']['event_financements']['Insert']>;
      };

      event_reports: {
        Row: { id: string; event_id: string; title: string; content: string | null; author: string | null; date_created: string };
        Insert: Omit<Database['public']['Tables']['event_reports']['Row'], 'id' | 'date_created'> & { id?: string; date_created?: string };
        Update: Partial<Database['public']['Tables']['event_reports']['Insert']>;
      };

      invoices: {
        Row: {
          id: string;
          reference: string;
          case_id: string | null;
          due_date: string | null;
          total_amount: number;
          paid_amount: number;
          status: 'Réglée' | 'Non réglée' | 'En cours';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['invoices']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string; created_at?: string; updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['invoices']['Insert']>;
      };

      personnels: {
        Row: {
          id: string;
          full_name: string;
          role: string;
          email: string | null;
          phone: string | null;
          service_start_date: string | null;
          service_status: 'Actif' | 'Inactif' | 'Mise en disponibilité';
          salary: number;
          marital_status: 'Célibataire' | 'Marié(e)' | 'Divorcé(e)' | 'Veuf(ve)' | null;
          has_children: boolean;
          children_count: number;
          address: string | null;
          photo_url: string | null;
          disciplinary_measure: string | null;
          disciplinary_status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['personnels']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string; created_at?: string; updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['personnels']['Insert']>;
      };

      bank_accounts: {
        Row: {
          id: string;
          avocat_id: string | null;
          personnel_id: string | null;
          bank_name: string;
          account_number: string | null;
          iban: string | null;
          swift: string | null;
        };
        Insert: Omit<Database['public']['Tables']['bank_accounts']['Row'], 'id'> & { id?: string };
        Update: Partial<Database['public']['Tables']['bank_accounts']['Insert']>;
      };

      fournisseurs: {
        Row: {
          id: string;
          nom_complet: string;
          nature_prestation: 'Bien' | 'Services';
          designation_prestation: string | null;
          type_facturation: 'Périodique' | 'Ponctuelle';
          periode: 'mensuel' | 'trimestriel' | 'Annuel' | null;
          montant: number;
          adresse_physique: string | null;
          adresse_mail: string | null;
          dirigeant_principal: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['fournisseurs']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string; created_at?: string; updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['fournisseurs']['Insert']>;
      };

      fournisseur_referents: {
        Row: { id: string; fournisseur_id: string; nom: string; phone: string | null; email: string | null };
        Insert: Omit<Database['public']['Tables']['fournisseur_referents']['Row'], 'id'> & { id?: string };
        Update: Partial<Database['public']['Tables']['fournisseur_referents']['Insert']>;
      };

      conversations: {
        Row: { id: string; participant1: string; participant2: string; created_at: string };
        Insert: Omit<Database['public']['Tables']['conversations']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>;
      };

      messages: {
        Row: { id: string; conversation_id: string; sender: string; text: string; sent_at: string };
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'sent_at'> & { id?: string; sent_at?: string };
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
    };
  };
}
