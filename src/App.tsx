import React, { useState, useEffect } from 'react';
import { usePersistentState } from './hooks/usePersistentState';
import { useSupabaseSync } from './hooks/useSupabaseSync';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { toSnakeCase, toCamelCase } from './lib/utils';
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

    useEffect(() => {
      const handleDbChanges = async (payload: any) => {
        console.log("DB change received:", payload);
        const { table, eventType, new: newRecord, old: oldRecord } = payload;

        const stateSetterMap: any = {
            clients: setClients,
            cases: setCases,
            events: setEvents,
            tasks: setTasks,
            invoices: setInvoices,
            avocats: setAvocats,
            personnels: setPersonnels,
            fournisseurs: setFournisseurs
        };

        const setter = stateSetterMap[table];
        if (!setter) return;

        const recordId = newRecord?.id || oldRecord?.id;
        
        setter((prev: any[]) => {
            const existingIndex = prev.findIndex(item => item.id === recordId);
            let newState = [...prev];

            if (eventType === 'INSERT') {
                if (existingIndex === -1) {
                    newState.push(toCamelCase(newRecord));
                }
            } else if (eventType === 'UPDATE') {
                if (existingIndex !== -1) {
                    newState[existingIndex] = toCamelCase(newRecord);
                }
            } else if (eventType === 'DELETE') {
                newState = newState.filter(item => item.id !== recordId);
            }
            return newState;
        });
    };

    if (isSupabaseConfigured) {
        const subscription = supabase
            .channel('public:*')
            .on('postgres_changes', { event: '*', schema: 'public' }, handleDbChanges)
            .subscribe();
        
        // Cleanup subscription on component unmount
        return () => {
            supabase.removeChannel(subscription);
        };
    }
}, []);

    const lawyerNames = avocats.map((a) => a.fullName);

    const handleLoginSuccess = () => setIsAuthenticated(true);
    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentPage('Dashboard');
        setMobileMenuOpen(false);
    };

    const createItem = async <T extends { id?: string }>(
        item: Omit<T, 'id'>,
        tableName: string,
    ): Promise<T | null> => {
        const newItem = { ...item, id: generateUUID() } as T;
        if (isSupabaseConfigured) {
            const snakeItem = toSnakeCase(newItem);
            const { data, error } = await supabase!.from(tableName).insert(snakeItem).select();
            if (error) {
                console.error(`Error creating ${tableName}:`, error.message);
                return null;
            }
            return data ? toCamelCase(data[0]) as T : null;
        }
        return newItem;
    };

    const updateItem = async <T extends { id: string }>(
        updatedItem: T,
        tableName: string,
    ): Promise<T | null> => {
        if (isSupabaseConfigured) {
            const snakeItem = toSnakeCase(updatedItem);
            const { data, error } = await supabase!.from(tableName).update(snakeItem).eq('id', updatedItem.id).select();
            if (error) {
                console.error(`Error updating ${tableName}:`, error.message);
                return null;
            }
            return data ? toCamelCase(data[0]) as T : null;
        }
        return updatedItem;
    };

    const deleteItem = async (id: string, tableName: string): Promise<boolean> => {
        if (isSupabaseConfigured) {
            const { error } = await supabase!.from(tableName).delete().eq('id', id);
            if (error) {
                console.error(`Error deleting ${tableName}:`, error.message);
                return false;
            }
        }
        return true;
    };

    const handleAddClient = (item: Omit<Client, 'id'>) => createItem(item, 'clients');
    const handleUpdateClient = (item: Client) => updateItem(item, 'clients');
    const handleDeleteClient = (id: string) => deleteItem(id, 'clients');

    const handleAddCase = (item: Omit<Case, 'id'>) => createItem(item, 'cases');
    const handleUpdateCase = (item: Case) => updateItem(item, 'cases');
    const handleDeleteCase = (id: string) => deleteItem(id, 'cases');

    const handleAddEvent = (item: Omit<Event, 'id'>) => createItem(item, 'events');
    const handleUpdateEvent = (item: Event) => updateItem(item, 'events');
    const handleDeleteEvent = (id: string) => deleteItem(id, 'events');
    
    const handleAddAvocat = (item: Omit<Avocat, 'id'>) => createItem(item, 'avocats');
    const handleUpdateAvocat = (item: Avocat) => updateItem(item, 'avocats');
    const handleDeleteAvocat = (id: string) => deleteItem(id, 'avocats');

    const handleAddPersonnel = (item: Omit<Personnel, 'id'>) => createItem(item, 'personnels');
    const handleUpdatePersonnel = (item: Personnel) => updateItem(item, 'personnels');
    const handleDeletePersonnel = (id: string) => deleteItem(id, 'personnels');

    const handleAddFournisseur = (item: Omit<Fournisseur, 'id'>) => createItem(item, 'fournisseurs');
    const handleDeleteFournisseur = (id: string) => deleteItem(id, 'fournisseurs');

    const handleAddTask = (item: Omit<Task, 'id'>) => createItem(item, 'tasks');
    const handleDeleteTask = (id: string) => deleteItem(id, 'tasks');
    const handleUpdateTaskStatus = async (id: string, status: Task['status']) => {
        const taskToUpdate = tasks.find(t => t.id === id);
        if (taskToUpdate) {
            await updateItem({ ...taskToUpdate, status }, 'tasks');
        }
    };

    const handleAddInvoice = (item: Omit<Invoice, 'id'>) => createItem(item, 'invoices');
    const handleDeleteInvoice = (id: string) => deleteItem(id, 'invoices');

    // ... (rest of the component, including renderPage)

    const renderPage = () => {
        const pageProps = {
            clients: clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())),
            cases: cases.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())),
            events: events.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase())),
            tasks,
            invoices,
            avocats,
            personnels,
            fournisseurs,
            lawyerNames,
            onAddClient: handleAddClient,
            onUpdateClient: handleUpdateClient,
            onDeleteClient: handleDeleteClient,
            onAddCase: handleAddCase,
            onUpdateCase: handleUpdateCase,
            onDeleteCase: handleDeleteCase,
            onAddEvent: handleAddEvent,
            onUpdateEvent: handleUpdateEvent,
            onDeleteEvent: handleDeleteEvent,
            onAddTask: handleAddTask,
            onDeleteTask: handleDeleteTask,
            onUpdateTaskStatus: handleUpdateTaskStatus,
            onAddInvoice: handleAddInvoice,
            onDeleteInvoice: handleDeleteInvoice,
            onAddAvocat: handleAddAvocat,
            onUpdateAvocat: handleUpdateAvocat,
            onDeleteAvocat: handleDeleteAvocat,
            onAddPersonnel: handleAddPersonnel,
            onUpdatePersonnel: handleUpdatePersonnel,
            onDeletePersonnel: handleDeletePersonnel,
            onAddFournisseur: handleAddFournisseur,
            onDeleteFournisseur: handleDeleteFournisseur,
            onExportClients: () => handleExportPDF("Clients", ["Nom", "Contact", "Dossiers"], clients.map(c => [c.name, c.contact, c.cases])),
            onExportCases: () => handleExportPDF("Dossiers", ["Référence", "Nom", "Client", "Statut"], cases.map(c => [c.reference, c.name, clients.find(cl => cl.id === c.clientId)?.name || 'N/A', c.status])),
        };

        switch (currentPage) {
            case 'Dashboard': return <DashboardPage {...pageProps} />;
            case 'Clients': return <ClientsPage {...pageProps} />;
            case 'Cases': return <CasesPage {...pageProps} onExport={pageProps.onExportCases} />;
            case 'Events': return <EventsPage {...pageProps} />;
            case 'Agenda': return <AgendaPage {...pageProps} />;
            case 'Chat': return <ChatPage />;
            case 'Billing': return <BillingPage {...page.props} />;
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

    function handleNavigate(page: string): void {
        setCurrentPage(page);
        setMobileMenuOpen(false);
    }

    function handleExportPDF(title: string, headers: string[], data: any[][]): void {
        const { jsPDF } = jspdf;
        const doc = new jsPDF();
        doc.autoTable({ head: [headers], body: data });
        doc.save(`${title.toLowerCase()}.pdf`);
    }
}

export default App;
