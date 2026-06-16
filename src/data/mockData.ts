import { Client, Case, Event, Avocat, Task, Invoice, Personnel, Fournisseur, Procedure } from '../types';

// Données mockées vidées — l'application utilise Supabase comme source de vérité
// Les données initiales vides permettent de démarrer avec une base propre
export const initialClients: Client[] = [];
export const initialCases: Case[] = [];
export const initialEvents: Event[] = [];
export const initialProcedures: Procedure[] = [];
export const initialTasks: Task[] = [];
export const initialInvoices: Invoice[] = [];
export const initialPersonnels: Personnel[] = [];
export const initialFournisseurs: Fournisseur[] = [];

// Mock data for Avocats as an example, can be cleared if starting from a fresh DB
export const initialAvocats: Avocat[] = [
  {
    id: "1",
    fullName: "Dupont Jean",
    photo: undefined,
    firstOathDate: "2010-05-20",
    secondOathDate: "2012-05-20",
    onaNumber: "12345",
    cabinetStatus: "Associé",
    serviceStartDate: "2010-06-01",
    serviceStatus: "Actif",
    cabinetRole: "Avocat à la cour",
    phone: "0123456789",
    emails: ["jean.dupont@example.com"],
    disciplinaryMeasures: "N/A",
    mainBar: "Kinshasa-Gombe",
    secondaryBar: "Lualaba",
    maritalStatus: "Marié(e)",
    physicalAddress: "123, avenue de la Justice, Kinshasa",
    hasChildren: "Oui",
    childrenCount: 2,
    bankAccounts: [{ bankName: "Rawbank", accountNumber: "1234567890" }],
  },
  {
    id: "2",
    fullName: "Marie Claire",
    photo: undefined,
    firstOathDate: "2015-09-15",
    secondOathDate: "2017-09-15",
    onaNumber: "67890",
    cabinetStatus: "Senior",
    serviceStartDate: "2015-10-01",
    serviceStatus: "Actif",
    cabinetRole: "Avocat",
    phone: "0987654321",
    emails: ["marie.claire@example.com"],
    disciplinaryMeasures: "N/A",
    mainBar: "Kinshasa-Matete",
    maritalStatus: "Célibataire",
    physicalAddress: "456, avenue du Commerce, Kinshasa",
    hasChildren: "Non",
  },
];
