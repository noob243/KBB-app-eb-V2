
import React, { useState } from 'react';
import { usePersistentState } from './hooks/usePersistentState';
import { useSupabaseSync } from './hooks/useSupabaseSync';
import { initialClients, initialCases, initialEvents, initialTasks, initialInvoices, initialAvocats, initialPersonnels, initialFournisseurs } from './data/mockData';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
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

function App() {
    const [isAuthenticated, setIsAuthenticated] = usePersistentState('kbb_auth', false);
    const [currentPage, setCurrentPage] = useState('Dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Utiliser useSupabaseSync pour synchroniser les données avec Supabase
    const [clients, setClients] = useSupabaseSync<Client>('clients', 'kbb_clients', initialClients);
    const [cases, setCases] = useSupabaseSync<Case>('cases', 'kbb_cases', initialCases);
    const [events, setEvents] = useSupabaseSync<Event>('events', 'kbb_events', initialEvents);
    const [tasks, setTasks] = useSupabaseSync<Task>('tasks', 'kbb_tasks', initialTasks);
    const [invoices, setInvoices] = useSupabaseSync<Invoice>('invoices', 'kbb_invoices', initialInvoices);
    const [avocats, setAvocats] = useSupabaseSync<Avocat>('avocats', 'kbb_avocats', initialAvocats);
    const [personnels, setPersonnels] = useSupabaseSync<Personnel>('personnels', 'kbb_personnels', initialPersonnels);
    const [fournisseurs, setFournisseurs] = useSupabaseSync<Fournisseur>('fournisseurs', 'kbb_fournisseurs', initialFournisseurs);

    const lawyerNames = avocats.map((a) => a.fullName);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentPage('Dashboard');
    };
    
    // --- PDF Export Logic ---
    const handleExportPDF = (title: string, headers: string[], data: any[][]) => {
        const { jsPDF } = jspdf;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(`${title} - KBB App`, 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

        (doc as any).autoTable({
            head: [headers],
            body: data,
            startY: 35,
            theme: 'striped',
            headStyles: { fillColor: [21, 68, 124] },
        });

        const safeTitle = title.toLowerCase().replace(/\s+/g, '-');
        doc.save(`liste-${safeTitle}-kbb-app.pdf`);
    };

    const handleExportClients = () => {
        const headers = ["Nom du Client", "Contact Principal", "Dossiers Actifs"];
        const data = clients.map((c) => [c.name, c.contact, c.cases]);
        handleExportPDF("Clients", headers, data);
    };

    const handleExportCases = () => {
        const headers = ["Référence", "Nom du Dossier", "Client", "Statut"];
        const data = cases.map((c) => [c.id, c.name, c.client, c.status]);
        handleExportPDF("Dossiers", headers, data);
    };

    // --- Data Handlers ---
    const handleAddClient = (newClient: Omit<Client, 'id'>) => {
        setClients(prev => [...prev, { ...newClient, id: crypto.randomUUID() }]);
    };
    const handleAddCase = (newCase: Omit<Case, 'id'>) => {
        setCases(prev => [...prev, { ...newCase, id: crypto.randomUUID() }]);
    };
    const handleAddEvent = (newEvent: Omit<Event, 'id'>) => setEvents(prev => [...prev, { ...newEvent, id: crypto.randomUUID() }]);
    const handleUpdateEvent = (updatedEvent: Event) => {
        setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    };
    const handleAddTask = (newTask: Omit<Task, 'id'>) => {
        setTasks(prev => [...prev, { ...newTask, id: crypto.randomUUID() }]);
    };
    const handleUpdateTaskStatus = (id: string, status: 'Effectué' | 'Non effectué' | 'Effectué à moitié') => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    };
    const handleAddInvoice = (newInvoice: Omit<Invoice, 'id'>) => setInvoices(prev => [...prev, { ...newInvoice, id: crypto.randomUUID() }]);
    const handleAddAvocat = (newAvocat: Omit<Avocat, 'id'>) => setAvocats(prev => [...prev, { ...newAvocat, id: crypto.randomUUID() }]);
    const handleAddPersonnel = (newPersonnel: Omit<Personnel, 'id'>) => setPersonnels(prev => [...prev, { ...newPersonnel, id: crypto.randomUUID() }]);
    const handleAddFournisseur = (newFournisseur: Omit<Fournisseur, 'id'>) => setFournisseurs(prev => [...prev, { ...newFournisseur, id: crypto.randomUUID() }]);

    const handleDeleteClient = (id: string) => setClients(clients.filter(c => c.id !== id));
    const handleDeleteCase = (id: string) => setCases(cases.filter(c => c.id !== id));
    const handleDeleteAvocat = (id: string) => setAvocats(avocats.filter(a => a.id !== id));
    const handleDeletePersonnel = (id: string) => setPersonnels(personnels.filter(p => p.id !== id));
    const handleDeleteFournisseur = (id: string) => setFournisseurs(fournisseurs.filter(f => f.id !== id));
    const handleDeleteEvent = (id: string) => setEvents(events.filter(e => e.id !== id));
    const handleDeleteTask = (id: string) => setTasks(tasks.filter(t => t.id !== id));
    const handleDeleteInvoice = (id: string) => setInvoices(invoices.filter(i => i.id !== id));

    const handleUpdateClient = (updated: Client) => setClients(prev => prev.map(c => c.id === updated.id ? updated : c));
    const handleUpdateCase = (updated: Case) => setCases(prev => prev.map(c => c.id === updated.id ? updated : c));
    const handleUpdateAvocat = (updated: Avocat) => setAvocats(prev => prev.map(a => a.id === updated.id ? updated : a));
    const handleUpdatePersonnel = (updated: Personnel) => setPersonnels(prev => prev.map(p => p.id === updated.id ? updated : p));

    const filteredClients = clients.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.contact.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredCases = cases.filter(c => 
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (c.client && c.client.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const filteredEvents = events.filter(e => 
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        e.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
        e.lieu.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderPage = () => {
        const pageProps = {
            clients: filteredClients, 
            cases: filteredCases, 
            events: filteredEvents, 
            tasks, invoices, avocats, lawyerNames, personnels, fournisseurs,
            onAddClient: handleAddClient, onAddCase: handleAddCase, onAddEvent: handleAddEvent,
            onAddTask: handleAddTask, onAddInvoice: handleAddInvoice, onAddAvocat: handleAddAvocat, onAddPersonnel: handleAddPersonnel, onAddFournisseur: handleAddFournisseur,
            onDeleteClient: handleDeleteClient, onDeleteCase: handleDeleteCase, onDeleteAvocat: handleDeleteAvocat, onDeletePersonnel: handleDeletePersonnel, onDeleteFournisseur: handleDeleteFournisseur,
            onDeleteEvent: handleDeleteEvent, onDeleteTask: handleDeleteTask, onDeleteInvoice: handleDeleteInvoice,
            onExportClients: handleExportClients, onExportCases: handleExportCases,
            onUpdateClient: handleUpdateClient, onUpdateCase: handleUpdateCase, onUpdateAvocat: handleUpdateAvocat, onUpdatePersonnel: handleUpdatePersonnel,
        };

        switch (currentPage) {
            case 'Dashboard': return <DashboardPage clients={filteredClients} cases={filteredCases} events={filteredEvents} tasks={tasks} invoices={invoices} avocats={avocats} onUpdateTaskStatus={handleUpdateTaskStatus} onAddTask={handleAddTask} />;
            case 'AIAssistant': return <AIAssistantPage clients={filteredClients} cases={filteredCases} tasks={tasks} invoices={invoices} />;
            case 'Clients': return <ClientsPage clients={filteredClients} cases={cases} onAddClient={handleAddClient} onExport={handleExportClients} />;
            case 'Dossiers': return <CasesPage cases={filteredCases} clients={filteredClients} tasks={tasks} onAddCase={handleAddCase} onExport={handleExportCases} avocats={avocats} />;
            case 'Evenements': return <EventsPage events={filteredEvents} onAddEvent={handleAddEvent} onUpdateEvent={handleUpdateEvent} avocats={avocats} />;
            case 'Agenda': return <AgendaPage tasks={tasks} cases={filteredCases} lawyers={lawyerNames} avocats={avocats} onAddTask={handleAddTask} />;
            case 'Chat': return <ChatPage />;
            case 'Facturation': return <BillingPage invoices={invoices} cases={filteredCases} onAddInvoice={handleAddInvoice} />;
            case 'Avocats': return <AvocatsPage avocats={avocats} tasks={tasks} onAddAvocat={handleAddAvocat} />;
            case 'Personnels': return <PersonnelsPage personnels={personnels} onAddPersonnel={handleAddPersonnel} onDeletePersonnel={handleDeletePersonnel} />;
            case 'Fournisseurs': return <FournisseursPage fournisseurs={fournisseurs} onAddFournisseur={handleAddFournisseur} onDeleteFournisseur={handleDeleteFournisseur} />;
            case 'Gestion': return <GestionPage {...pageProps} />;
            case 'All': return <AllInterfacesPage {...pageProps} />;
            default: return <DashboardPage clients={filteredClients} cases={filteredCases} events={filteredEvents} tasks={tasks} invoices={invoices} avocats={avocats} onUpdateTaskStatus={handleUpdateTaskStatus} onAddTask={handleAddTask} />;
        }
    };

    if (!isAuthenticated) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery} 
                    clients={clients} 
                    cases={cases} 
                    events={events} 
                    setCurrentPage={setCurrentPage} 
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-8 custom-scrollbar">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
}

export default App;
