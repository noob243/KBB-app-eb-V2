import React, { useState } from 'react';
import { usePersistentState } from './hooks/usePersistentState';
import { useSupabaseSync } from './hooks/useSupabaseSync';
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

function App() {
    const [isAuthenticated, setIsAuthenticated] = usePersistentState('kbb_auth', false);
    const [currentPage, setCurrentPage] = useState('Dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
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
        setMobileMenuOpen(false);
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

    const handleNavigate = (page: string) => {
        setCurrentPage(page);
        setMobileMenuOpen(false);
    };

    const renderPage = () => {
        const pageProps = {
            clients: filteredClients, 
            cases: filteredCases, 
            events: filteredEvents, 
            tasks, invoices, avocats, lawyerNames, personnels, fournisseurs,
            onAddClient: handleAddClient,
            onAddCase: handleAddCase,
            onAddEvent: handleAddEvent,
            onUpdateEvent: handleUpdateEvent,
            onDeleteEvent: handleDeleteEvent,
            onAddTask: handleAddTask,
            onUpdateTaskStatus: handleUpdateTaskStatus,
            onDeleteTask: handleDeleteTask,
            onAddInvoice: handleAddInvoice,
            onDeleteInvoice: handleDeleteInvoice,
            onAddAvocat: handleAddAvocat,
            onDeleteAvocat: handleDeleteAvocat,
            onAddPersonnel: handleAddPersonnel,
            onDeletePersonnel: handleDeletePersonnel,
            onAddFournisseur: handleAddFournisseur,
            onDeleteFournisseur: handleDeleteFournisseur,
            onDeleteClient: handleDeleteClient,
            onUpdateClient: handleUpdateClient,
            onDeleteCase: handleDeleteCase,
            onUpdateCase: handleUpdateCase,
            onUpdateAvocat: handleUpdateAvocat,
            onUpdatePersonnel: handleUpdatePersonnel,
            onExportClients: handleExportClients,
            onExportCases: handleExportCases,
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
            {/* Desktop Sidebar */}
            <div className="hidden md:block fixed top-0 left-0 bottom-0 z-40">
                <Sidebar currentPage={currentPage} setCurrentPage={handleNavigate} onLogout={handleLogout} />
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }} className="md:ml-64">
                <Header
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    clients={clients}
                    cases={cases}
                    events={events}
                    setCurrentPage={handleNavigate}
                />
                <div style={{ flex: 1, overflow: 'auto', padding: '12px', paddingBottom: '80px', WebkitOverflowScrolling: 'touch' }}>
                    {renderPage()}
                </div>
            </div>

            {/* Mobile Navigation - fixed at bottom, outside overflow container */}
            <MobileNav currentPage={currentPage} onNavigate={handleNavigate} />
        </>
    );
}

export default App;
