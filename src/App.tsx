import React, { useState, useEffect } from 'react';
import { usePersistentState } from './hooks/usePersistentState';
import { useSupabaseSync } from './hooks/useSupabaseSync';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { toSnakeCase, toCamelCase } from './lib/utils';
import { initialClients, initialCases, initialEvents, initialTasks, initialInvoices, initialAvocats, initialPersonnels, initialFournisseurs, initialProcedures } from './data/mockData';
import toast from 'react-hot-toast';
import NotificationProvider from './components/NotificationProvider';

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
import { Client, Case, Event, Task, Invoice, Avocat, Personnel, Fournisseur, Procedure } from './types';

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
    const [procedures, setProcedures] = useSupabaseSync<Procedure>('procedures', 'kbb_procedures', initialProcedures);

    // Generic CRUD operations with notifications
    const createItem = async <T extends { id?: string }>(item: Omit<T, 'id'>, tableName: string): Promise<T | null> => {
        const promise = createItemLogic(item, tableName);
        toast.promise(promise, { loading: 'Enregistrement...', success: 'Enregistré!', error: 'Échec.' });
        return promise;
    };
    const updateItem = async <T extends { id: string }>(item: T, tableName: string): Promise<T | null> => {
        const promise = updateItemLogic(item, tableName);
        toast.promise(promise, { loading: 'Mise à jour...', success: 'Mis à jour!', error: 'Échec.' });
        return promise;
    };
    const deleteItem = async (id: string, tableName: string): Promise<boolean> => {
        const promise = deleteItemLogic(id, tableName);
        toast.promise(promise, { loading: 'Suppression...', success: 'Supprimé!', error: 'Échec.' });
        return promise;
    };

    // Raw CRUD logic
    const createItemLogic = async <T extends { id?: string }>(item: Omit<T, 'id'>, tableName: string): Promise<T | null> => {
        const newItem = { ...item, id: generateUUID() } as T;
        if (isSupabaseConfigured) {
            const { data, error } = await supabase.from(tableName).insert(toSnakeCase(newItem)).select();
            if (error) { console.error(error); return null; }
            return data ? toCamelCase(data[0]) as T : null;
        }
        return newItem;
    };
    const updateItemLogic = async <T extends { id: string }>(item: T, tableName: string): Promise<T | null> => {
        if (isSupabaseConfigured) {
            const { data, error } = await supabase.from(tableName).update(toSnakeCase(item)).eq('id', item.id).select();
            if (error) { console.error(error); return null; }
            return data ? toCamelCase(data[0]) as T : null;
        }
        return item;
    };
    const deleteItemLogic = async (id: string, tableName: string): Promise<boolean> => {
        if (isSupabaseConfigured) {
            const { error } = await supabase.from(tableName).delete().eq('id', id);
            if (error) { console.error(error); return false; }
        }
        return true;
    };

    // Specific handlers for each data type
    const handleAddClient = (item: Omit<Client, 'id'>) => createItem(item, 'clients');
    const handleUpdateClient = (item: Client) => updateItem(item, 'clients');
    const handleDeleteClient = (id: string) => deleteItem(id, 'clients');

    const handleAddCase = async (caseData: Omit<Case, 'id'>, proceduresData: Omit<Procedure, 'id'>[]) => {
        const newCase = await createItemLogic(caseData, 'cases');
        if (newCase && proceduresData.length > 0) {
            const proceduresToInsert = proceduresData.map(p => ({ ...p, caseId: newCase.id, id: generateUUID() }));
            await supabase.from('procedures').insert(toSnakeCase(proceduresToInsert));
        }
    };
    const handleUpdateCase = async (caseData: Case, proceduresData: Omit<Procedure, 'id'>[]) => {
        await updateItemLogic(caseData, 'cases');
        await supabase.from('procedures').delete().eq('case_id', caseData.id);
        if (proceduresData.length > 0) {
            const proceduresToInsert = proceduresData.map(p => ({ ...p, caseId: caseData.id, id: generateUUID() }));
            await supabase.from('procedures').insert(toSnakeCase(proceduresToInsert));
        }
    };
    const handleDeleteCase = async (id: string) => {
        await supabase.from('procedures').delete().eq('case_id', id);
        return deleteItem(id, 'cases');
    };

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
    const handleUpdateFournisseur = (item: Fournisseur) => updateItem(item, 'fournisseurs');
    const handleDeleteFournisseur = (id: string) => deleteItem(id, 'fournisseurs');

    const casesWithProcedures = cases.map(c => ({...c, procedures: procedures.filter(p => p.caseId === c.id)}));

    const renderPage = () => {
        const pageProps = {
            clients,
            cases: casesWithProcedures,
            events,
            tasks,
            invoices,
            avocats,
            personnels,
            fournisseurs,
            lawyerNames: avocats.map((a) => a.fullName),
            onAddClient: handleAddClient,
            onUpdateClient: handleUpdateClient,
            onDeleteClient: handleDeleteClient,
            onAddCase: handleAddCase,
            onUpdateCase: handleUpdateCase,
            onDeleteCase: handleDeleteCase,
            onAddEvent: handleAddEvent,
            onUpdateEvent: handleUpdateEvent,
            onDeleteEvent: handleDeleteEvent,
            onAddAvocat: handleAddAvocat,
            onUpdateAvocat: handleUpdateAvocat,
            onDeleteAvocat: handleDeleteAvocat,
            onAddPersonnel: handleAddPersonnel,
            onUpdatePersonnel: handleUpdatePersonnel,
            onDeletePersonnel: handleDeletePersonnel,
            onAddFournisseur: handleAddFournisseur,
            onUpdateFournisseur: handleUpdateFournisseur,
            onDeleteFournisseur: handleDeleteFournisseur,
        };

        switch (currentPage) {
            case 'Dashboard': return <DashboardPage {...pageProps} />;
            case 'Clients': return <ClientsPage {...pageProps} />;
            case 'Cases': return <CasesPage {...pageProps} />;
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
        return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

    return (
        <NotificationProvider>
            <div className="flex h-screen bg-gray-100">
                <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={() => setIsAuthenticated(false)} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
                        {renderPage()}
                    </main>
                </div>
            </div>
        </NotificationProvider>
    );
}

export default App;
