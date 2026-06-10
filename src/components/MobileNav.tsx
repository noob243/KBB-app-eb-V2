import React, { FC } from 'react';
import { DashboardIcon, ClientsIcon, CasesIcon, EventsIcon, AgendaIcon, ChatIcon, BillingIcon, AvocatsIcon, PersonnelsIcon, SuppliersIcon, StaffIcon, AIIcon } from './Icons';

interface MobileNavProps {
    currentPage: string;
    onNavigate: (page: string) => void;
}

const navItems = [
    { name: 'Dashboard', icon: <DashboardIcon />, label: 'Accueil' },
    { name: 'Clients', icon: <ClientsIcon />, label: 'Clients' },
    { name: 'Cases', icon: <CasesIcon />, label: 'Dossiers' },
    { name: 'Events', icon: <EventsIcon />, label: 'Événements' },
    { name: 'Agenda', icon: <AgendaIcon />, label: 'Agenda' },
    { name: 'Chat', icon: <ChatIcon />, label: 'Chat' },
    { name: 'Billing', icon: <BillingIcon />, label: 'Factures' },
    { name: 'Avocats', icon: <AvocatsIcon />, label: 'Avocats' },
    { name: 'AIAssistant', icon: <AIIcon />, label: 'AI' },
];

const MobileNav: FC<MobileNavProps> = ({ currentPage, onNavigate }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex items-center justify-around shadow-lg md:hidden safe-area-bottom">
            {navItems.map((item) => (
                <button
                    key={item.name}
                    onClick={() => onNavigate(item.name)}
                    className={`flex flex-col items-center justify-center py-2 px-1 min-w-0 transition-colors duration-200 ${
                        currentPage === item.name
                            ? 'text-[#15447c]'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <span className="w-5 h-5 mb-0.5">{item.icon}</span>
                    <span className="text-[10px] leading-tight truncate max-w-full">{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default MobileNav;
