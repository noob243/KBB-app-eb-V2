
import React, { FC } from 'react';
import { Icon, DashboardIcon, ClientsIcon, CasesIcon, EventsIcon, AgendaIcon, ChatIcon, BillingIcon, AvocatsIcon, StaffIcon, PersonnelsIcon, SuppliersIcon, LogoutIcon, EyeIcon, AIIcon } from './Icons';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onLogout: () => void;
}

const Sidebar: FC<SidebarProps> = ({ currentPage, setCurrentPage, onLogout }) => {
    const navItems = [
        { name: 'All', icon: <EyeIcon />, label: "Toutes les interfaces" },
        { name: 'Dashboard', icon: <DashboardIcon />, label: "Tableau de bord" },
        { name: 'AIAssistant', icon: <AIIcon />, label: "Otshudi AI" },
        { name: 'Clients', icon: <ClientsIcon />, label: "Clients" },
        { name: 'Cases', icon: <CasesIcon />, label: "Dossiers" },
        { name: 'Events', icon: <EventsIcon />, label: "Événements" },
        { name: 'Agenda', icon: <AgendaIcon />, label: "Agenda" },
        { name: 'Chat', icon: <ChatIcon />, label: "Chat" },
        { name: 'Billing', icon: <BillingIcon />, label: "Facturation" },
        { name: 'Avocats', icon: <AvocatsIcon />, label: "Avocats" },
        { name: 'Personnels', icon: <PersonnelsIcon />, label: "Personnels" },
        { name: 'Fournisseurs', icon: <SuppliersIcon />, label: "Fournisseurs" },
        { name: 'Gestion', icon: <StaffIcon />, label: "Gestion" },
    ];

    return (
        <aside className="bg-[#15447c] text-slate-100 w-64 space-y-2 p-4 flex flex-col">
            <div className="text-2xl font-bold mb-6 flex items-center p-2">
                <svg className="w-8 h-8 mr-2 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>
                <span>KBB App</span>
            </div>
            <nav className="flex-1 overflow-y-auto custom-scrollbar">
                {navItems.map(item => (
                    <a
                        key={item.name}
                        href="#"
                        onClick={(e) => { e.preventDefault(); setCurrentPage(item.name); }}
                        className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === item.name ? 'bg-black/20 text-white' : 'text-slate-300 hover:bg-black/20 hover:text-white'}`}
                    >
                        <Icon>{item.icon}</Icon>
                        <span>{item.label}</span>
                    </a>
                ))}
            </nav>
            <div className="mt-auto pt-4 border-t border-white/10">
                 <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-black/20 hover:text-white transition-colors duration-200">
                    <Icon><LogoutIcon /></Icon>
                    <span>Déconnexion</span>
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;
