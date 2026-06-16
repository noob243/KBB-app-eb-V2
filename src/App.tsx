import React, { useState } from 'react';
import { usePersistentState } from './hooks/usePersistentState';
import { useSupabaseSync } from './hooks/useSupabaseSync';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { toSnakeCase } from './lib/utils';
import { initialClients, initialCases, initialEvents, initialTasks, initialInvoices, initialAvocats, initialPersonnels, initialFournisseurs } from './data/mockData';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import CasesPage from './pages/CasesPage';
import EventsPage from './pages/EventsPage';
import AgendaPage from './pages/AgendaPage';
import ChatPage from './pages/ChatPage';
import BillingPage from './pages/BillingPage';
import AvocatsPage from './pages/AvocatsPage';
import PersonnelsPage from './pages/PersonnelsPage';
import FournisseursPage from './pages/FournisseursPage';
import GestionPage from './pages/GestionPage';
import AllInterfacesPage from './pages/AllInterfacesPage';
import AIAssistantPage from './pages/AIAssistantPage';
import { Client, Case, Event, Task, Invoice, Avocat, Personnel, Fournisseur } from './types';

declare const jspdf: any;

const generateUUID = (): string => {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
        return window.crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

function App() {
    const [isAuthenticated, setIsAuthenticated] = usePersistentState('kbb_auth', false);
    const [currentPage, setCurrentPage] = useState('Dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const [clients, setClients] = useSupabaseSync<Client>('clients', 'kbb_clients', initialClients);
    const [cases, setCases] = useSupabaseSync<Case>('cases', 'kbb_cases', initialCases);
    const [events, setEvents] = useSupabaseSync<Event>('events', 'kbb_events', initialEvents);
    const [tasks, setTasks] = useSupabaseSync<Task>('tasks', 'kbb_tasks', initialTasks);
    const [invoices, setInvoices] = useSupabaseSync<Invoice>('invoices', 'kbb_invoices', initialInvoices);
    const [avocats, setAvocats] = useSupabaseSync<Avocat>('avocats', 'kbb_avocats', initialAvocats);
    const [personnels, setPersonnels] = useSupabaseSync<Personnel>('personnels', 'kbb_personnels', initialPersonnels);
    const [fournisseurs, setFournisseurs] = useSupabaseSync<Fournisseur>('fournisseurs', 'kbb_fournisseurs', initialFournisseurs);

    const lawyerNames = avocats.map((a) => a.fullName);

    const handleLoginSuccess = () => setIsAuthenticated(true);
    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentPage('Dashboard');
        setMobileMenuOpen(false);
    };

    // --- Generic Supabase Handlers ---
    const createItem = async <T extends { id: string }>(
        item: Omit<T, 'id'>,
        tableName: string,
        setter: React.Dispatch<React.SetStateAction<T[]>>
    ) => {
        const newItem = { ...item, id: generateUUID() } as T;
        if (isSupabaseConfigured) {
            const snakeItem = toSnakeCase(newItem);
            const { error } = await supabase!.from(tableName).insert(snakeItem);
            if (error) {
                console.error(`Error creating ${tableName}:`, error.message);
                return; // Stop if Supabase fails
            }
        }
        setter(prev => [...prev, newItem]);
    };

    const updateItem = async <T extends { id: string }>(
        updatedItem: T,
        tableName: string,
        setter: React.Dispatch<React.SetStateAction<T[]>>
    ) => {
        if (isSupabaseConfigured) {
            const snakeItem = toSnakeCase(updatedItem);
            const { error } = await supabase!.from(tableName).update(snakeItem).eq('id', updatedItem.id);
            if (error) {
                console.error(`Error updating ${tableName}:`, error.message);
                return;
            }
        }
        setter(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    };

    const deleteItem = async <T extends { id: string }>(
        id: string,
        tableName: string,
        setter: React.Dispatch<React.SetStateAction<T[]>>
    ) => {
        if (isSupabaseConfigured) {
            const { error } = await supabase!.from(tableName).delete().eq('id', id);
            if (error) {
                console.error(`Error deleting ${tableName}:`, error.message);
                return;
            }
        }
        setter(prev => prev.filter(item => item.id !== id));
    };

    // --- Data Handlers utilizing generic functions ---
    const handleAddClient = (item: Omit<Client, 'id'>) => createItem(item, 'clients', setClients);
    const handleUpdateClient = (item: Client) => updateItem(item, 'clients', setClients);
    const handleDeleteClient = (id: string) => deleteItem(id, 'clients', setClients);

    const handleAddCase = (item: Omit<Case, 'id'>) => createItem(item, 'cases', setCases);
    const handleUpdateCase = (item: Case) => updateItem(item, 'cases', setCases);
    const handleDeleteCase = (id: string) => deleteItem(id, 'cases', setCases);

    const handleAddEvent = (item: Omit<Event, 'id'>) => createItem(item, 'events', setEvents);
    const handleUpdateEvent = (item: Event) => updateItem(item, 'events', setEvents);
    const handleDeleteEvent = (id: string) => deleteItem(id, 'events', setEvents);
    
    const handleAddAvocat = (item: Omit<Avocat, 'id'>) => createItem(item, 'avocats', setAvocats);
    const handleUpdateAvocat = (item: Avocat) => updateItem(item, 'avocats', setAvocats);
    const handleDeleteAvocat = (id: string) => deleteItem(id, 'avocats', setAvocats);

    const handleAddPersonnel = (item: Omit<Personnel, 'id'>) => createItem(item, 'personnels', setPersonnels);
    const handleUpdatePersonnel = (item: Personnel) => updateItem(item, 'personnels', setPersonnels);
    const handleDeletePersonnel = (id: string) => deleteItem(id, 'personnels', setPersonnels);

    const handleAddFournisseur = (item: Omit<Fournisseur, 'id'>) => createItem(item, 'fournisseurs', setFournisseurs);
    const handleDeleteFournisseur = (id: string) => deleteItem(id, 'fournisseurs', setFournisseurs);

    const handleAddTask = (item: Omit<Task, 'id'>) => createItem(item, 'tasks', setTasks);
    const handleDeleteTask = (id: string) => deleteItem(id, 'tasks', setTasks);
    const handleUpdateTaskStatus = (id: string, status: Task['status']) => {
        const taskToUpdate = tasks.find(t => t.id === id);
        if (taskToUpdate) {
            updateItem({ ...taskToUpdate, status }, 'tasks', setTasks);
        }
    };

    const handleAddInvoice = (item: Omit<Invoice, 'id'>) => createItem(item, 'invoices', setInvoices);
    const handleDeleteInvoice = (id: string) => deleteItem(id, 'invoices', setInvoices);
    
    // --- PDF Export Logic ---
    const handleExportPDF = (title: string, headers: string[], data: any[][]) => {
        const { jsPDF } = jspdf;
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`${title} - KBB App`, 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);
        (doc as any).autoTable({ head: [headers], body: data, startY: 35, theme: 'striped', headStyles: { fillColor: [21, 68, 124] } });
        doc.save(`liste-${title.toLowerCase().replace(/\s+/g, '-')}-kbb-app.pdf`);
    };

    const handleExportClients = () => handleExportPDF("Clients", ["Nom du Client", "Contact Principal", "Dossiers Actifs"], clients.map((c) => [c.name, c.contact, c.cases]));
    const handleExportCases = () => handleExportPDF("Dossiers", ["Référence", "Nom du Dossier", "Client", "Statut"], cases.map((c) => [c.reference, c.name, clients.find(cl => cl.id === c.clientId)?.name || 'N/A', c.status]));

    // Filtering logic remains the same
    const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.contact.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredCases = cases.filter(c => c.reference.toLowerCase().includes(searchQuery.toLowerCase()) || c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredEvents = events.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.type.toLowerCase().includes(searchQuery.toLowerCase()) || (e.lieu || '').toLowerCase().includes(searchQuery.toLowerCase()));

    const handleNavigate = (page: string) => {
        setCurrentPage(page);
        setMobileMenuOpen(false);
    };

    const renderPage = () => {
        const pageProps = {
            clients: filteredClients, cases: filteredCases, events: filteredEvents, tasks, invoices, avocats, lawyerNames, personnels, fournisseurs,
            onAddClient: handleAddClient, onAddCase: handleAddCase, onAddEvent: handleAddEvent, onUpdateEvent: handleUpdateEvent,
            onDeleteEvent: handleDeleteEvent, onAddTask: handleAddTask, onUpdateTaskStatus: handleUpdateTaskStatus, onDeleteTask: handleDeleteTask,
            onAddInvoice: handleAddInvoice, onDeleteInvoice: handleDeleteInvoice, onAddAvocat: handleAddAvocat, onDeleteAvocat: handleDeleteAvocat,
            onAddPersonnel: handleAddPersonnel, onDeletePersonnel: handleDeletePersonnel, onAddFournisseur: handleAddFournisseur, onDeleteFournisseur: handleDeleteFournisseur,
            onDeleteClient: handleDeleteClient, onUpdateClient: handleUpdateClient, onDeleteCase: handleDeleteCase, onUpdateCase: handleUpdateCase,
            onUpdateAvocat: handleUpdateAvocat, onUpdatePersonnel: handleUpdatePersonnel, onExportClients: handleExportClients, onExportCases: handleExportCases,
        };

        switch (currentPage) {
            case 'Dashboard': return <DashboardPage {...pageProps} />;
            case 'Clients': return <ClientsPage {...pageProps} />;
            case 'Cases': return <CasesPage {...pageProps} onExport={pageProps.onExportCases} />;
            case 'Events': return <EventsPage {...pageProps} />;
            case 'Agenda': return <AgendaPage {...pageProps} />;
            case 'Chat': return <ChatPage />;
            case 'Billing': return <BillingPage {...pageProps} />;
            case 'Avocats': return <AvocatsPage {...pageProps} />;
            case 'Personnels': return <PersonnelsPage {...pageProps} />;
            case 'Fournisseurs': return <FournisseursPage {...pageProps} />;
            case 'Gestion': return <GestionPage {...pageProps} />;
            case 'AllInterfaces': return <AllInterfacesPage {...pageProps} />;
            case 'AIAssistant': return <AIAssistantPage {...pageProps} />;
            default: return <DashboardPage {...pageProps} />;
        }
    };

    if (!isAuthenticated) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <>
            <div className="hidden md:block fixed top-0 left-0 bottom-0 z-40">
                <Sidebar currentPage={currentPage} setCurrentPage={handleNavigate} onLogout={handleLogout} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }} className="md:ml-64">
                <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} clients={clients} cases={cases} events={events} setCurrentPage={handleNavigate} />
                <div style={{ flex: 1, overflow: 'auto', padding: '12px', paddingBottom: '80px', WebkitOverflowScrolling: 'touch' }}>
                    {renderPage()}
                </div>
            </div>
            <MobileNav currentPage={currentPage} onNavigate={handleNavigate} />
        </>
    );
}

export default App;
