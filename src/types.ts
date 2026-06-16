
// This file defines the core data structures used throughout the application.

export interface Client {
  id: string;
  name: string;
  contact: string;
  email?: string;
  address?: string;
  cases?: number; // Optional: To be calculated or aggregated
}

export interface Procedure {
  id: string;
  caseId: string; 
  name: string;
  instance: string;
  objet: string;
  dateDebut?: string;
  dateFin?: string;
  status: 'En cours' | 'Clôturé' | 'En attente';
}

export interface Case {
  id: string;
  reference: string;
  name: string;
  clientId: string;
  client?: string; // Denormalized for display, should be clientId
  date: string;
  status: 'Nouveau' | 'En cours' | 'En attente' | 'Clôturé';
  type: 'Contentieux' | 'Conseil' | 'Autre';
  description?: string;
  lawyer: string;
  conclusion?: string;
  fee: number;
  archived: boolean;
  nextHearing?: string;
  procedures?: Procedure[]; // This will be populated from the 'procedures' table
}

export interface Event {
  id: string;
  name: string;
  date: string;
  type: 'Audience' | 'Réunion' | 'Tâche' | 'Autre';
  description?: string;
  caseId?: string;
}

export interface Task {
  id: string;
  name: string;
  dueDate: string;
  status: 'En retard' | 'Effectué' | 'Effectué à moitié';
  lawyer: string;
  caseId: string;
}

export interface Invoice {
  id: string;
  caseId: string;
  amount: number;
  status: 'Payé' | 'Non payé' | 'En retard';
  issueDate: string;
  dueDate: string;
}

export interface BankAccount {
    bankName: string;
    accountNumber: string;
}

export interface Avocat {
    id: string;
    fullName: string;
    photo?: string | null;
    firstOathDate?: string;
    secondOathDate?: string;
    onaNumber?: string;
    cabinetStatus?: string;
    serviceStartDate?: string;
    serviceStatus?: string;
    cabinetRole?: string;
    phone?: string;
    emails?: string[];
    disciplinaryMeasures?: string;
    mainBar?: string;
    secondaryBar?: string;
    maritalStatus?: string;
    physicalAddress?: string;
    hasChildren?: string;
    childrenCount?: number;
    bankAccounts?: BankAccount[];
}


export interface Personnel {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string; // e.g., 'Secrétaire', 'Assistant juridique'
}

export interface Referent {
    id?: string;
    nom: string;
    email: string;
    telephone: string;
}

export interface Fournisseur {
    id: string;
    nomComplet: string;
    designationPrestation: string;
    naturePrestation: 'Services' | 'Bien';
    montant: number;
    typeFacturation: 'Périodique' | 'Ponctuelle';
    adresseMail: string;
    telephone: string;
    dateDebut: string;
    referents: Referent[];
}
