import { Client, Case, Event, Avocat, Task, Invoice, Personnel, Fournisseur } from '../types';

// Données mockées vidées — l'application utilise Supabase comme source de vérité
// Les données initiales vides permettent de démarrer avec une base propre
export const initialClients: Client[] = [];
export const initialCases: Case[] = [];
export const initialEvents: Event[] = [];
export const initialAvocats: Avocat[] = [];
export const initialTasks: Task[] = [];
export const initialInvoices: Invoice[] = [];
export const initialPersonnels: Personnel[] = [];
export const initialFournisseurs: Fournisseur[] = [];

export const mockPersonnel = [];
export const initialConversations = {};
