
export interface Client {
  id: number;
  name: string;
  contact: string;
  cases: number;
  email?: string;
  phone?: string;
  secteur?: string;
  siege?: string;
  sieges?: string[];
  dirigeant?: string;
  ref1_nom?: string;
  ref1_phone?: string;
  ref1_email?: string;
  ref2_nom?: string;
  ref2_phone?: string;
  ref2_email?: string;
  typeFacturation?: string;
}

export interface Case {
  id: string;
  name: string;
  client: string;
  status: 'Nouveau' | 'En cours' | 'En attente' | 'Clôturé';
  nextHearing: string | null;
  procedure?: string;
  procedureInstance?: string;
  procedureObjet?: string;
  procedureDateDebut?: string;
  procedureDateFin?: string;
  procedureStatus?: string;
  notes?: string;
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
  budgetPrevisionnel?: string;
  budgetRealise?: string;
  financement?: string;
  financements?: Array<{ label: string; amount: string }>;
  sponsors?: string;
  reports?: EventReport[];
}

export interface Avocat {
  id: string;
  fullName: string;
  photo: File | null;
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
  startDate?: string;
  endDate?: string;
  associatedLawyers?: string[];
  rapport?: string;
}

export interface Invoice {
  id: string;
  caseId: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: 'Réglée' | 'Non réglée' | 'En cours';
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
  hasChildren: 'Oui' | 'Non';
  childrenCount?: number;
  address: string;
  photo?: string;
  disciplinaryMeasure?: string;
  disciplinaryStatus?: string;
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

