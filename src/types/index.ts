
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
  created_at?: string;
  updated_at?: string;
  // cases: Calculer via COUNT(*) FROM cases WHERE client_id
  // referents: Charger via client_referents table
}

export interface CaseProcedure {
  id: string;
  name: string;
  instance?: string;
  objet?: string;
  dateDebut?: string;
  dateFin?: string;
  status?: string;
  linkedCases?: string[]; // dossier IDs linked to this procedure
}

export interface Case {
  id: string;
  reference: string;
  name: string;
  clientId: number;
  client?: string;
  status: 'Nouveau' | 'En cours' | 'En attente' | 'Clôturé';
  nextHearing: string | null;
  procedure?: string;
  procedureInstance?: string;
  procedureObjet?: string;
  procedureDateDebut?: string;
  procedureDateFin?: string;
  procedureStatus?: string;
  notes?: string;
  procedures?: CaseProcedure[];
  created_at?: string;
  updated_at?: string;
}

export interface EventReport {
  id: string;
  title: string;
  content: string;
  dateCreated: string;
  author?: string;
  files?: Array<{ name: string; size: string; content?: string }>;
}

export interface Event {
  id: string;
  name: string;
  type: 'Audience' | 'Conférence' | 'Colloque' | 'Séminaire' | 'Autre';
  date: string;
  lieu: string;
  partenaires?: string;
  publicCible?: string;
  membresKBB?: string;
  membresExternes?: string;
  budgetPrevisionnel?: number;
  budgetRealise?: number;
  financements?: Array<{ label: string; amount: number }>;
  sponsors?: string;
  reports?: EventReport[];
  created_at?: string;
  updated_at?: string;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  iban?: string;
  swift?: string;
}

export interface Avocat {
  id: string;
  fullName: string;
  photo: File | null;
  photoUrl?: string;
  firstOathDate: string;
  secondOathDate: string;
  onaNumber: string;
  cabinetStatus: 'Senior of counsel' | 'Senior' | 'Associé' | 'Junior';
  serviceStartDate: string;
  serviceStatus: 'Actif' | 'Omis' | 'Mise en disponibilité';
  cabinetRole: string;
  phone: string;
  emails: string[];
  disciplinaryMeasures: string;
  mainBar?: 'Kinshasa-Gombe' | 'Kinshasa-Matete' | 'Lualaba' | 'Haut Katanga' | 'Kwilu';
  secondaryBar?: string;
  barreaux?: string[];
  maritalStatus?: 'Célibataire' | 'Marié(e)' | 'Divorcé(e)' | 'Veuf(ve)';
  physicalAddress?: string;
  hasChildren?: boolean;
  childrenCount?: number;
  bankAccounts?: BankAccount[];
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id: number;
  name: string;
  caseId: string;
  lawyer: string;
  dueDate: string;
  status: 'Effectué' | 'Non effectué' | 'Effectué à moitié';
  notes?: string;
  procedureLinked?: string;
  procedureLinkedIds?: string[];
  startDate?: string;
  endDate?: string;
  associatedLawyers?: string[];
  rapport?: string;
}

export interface Invoice {
  id: string;
  reference: string;
  caseId: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: 'Réglée' | 'Non réglée' | 'En cours';
  created_at?: string;
  updated_at?: string;
}

export interface Personnel {
  id: string;
  fullName: string;
  role: string;
  email: string;
  phone: string;
  serviceStartDate: string;
  serviceStatus: 'Actif' | 'Inactif' | 'Mise en disponibilité';
  salary: number;
  maritalStatus: 'Célibataire' | 'Marié(e)' | 'Divorcé(e)' | 'Veuf(ve)';
  hasChildren?: boolean;
  childrenCount?: number;
  address: string;
  photo?: string;
  disciplinaryMeasure?: string;
  disciplinaryStatus?: string;
  bankAccounts?: BankAccount[];
  created_at?: string;
  updated_at?: string;
}

export interface Referent {
  nom: string;
  phone: string;
  email: string;
}

export interface Fournisseur {
  id: string;
  nomComplet: string;
  naturePrestation: 'Bien' | 'Services';
  designationPrestation: string;
  typeFacturation: 'Périodique' | 'Ponctuelle';
  periode?: 'mensuel' | 'trimestriel' | 'Annuel';
  montant: number;
  adressePhysique: string;
  adresseMail: string;
  dirigeantPrincipal: string;
  referents: Referent[];
}

