import React, { FC, useState } from 'react';
import StatCard from '../components/StatCard';
import { CasesIcon, ClientsIcon, EventsIcon } from '../components/Icons';
import { Client, Case, Event, Task, Invoice, Avocat } from '../types';

interface DashboardPageProps {
  clients: Client[];
  cases: Case[];
  events: Event[];
  tasks: Task[];
  invoices?: Invoice[];
  avocats?: Avocat[];
  onUpdateTaskStatus?: (id: string | number, status: 'Effectué' | 'Non effectué' | 'Effectué à moitié') => void;
  onAddTask?: (newTask: Omit<Task, 'id'>) => void;
}

const DashboardPage: FC<DashboardPageProps> = ({ clients, cases, events, tasks = [], invoices = [], avocats = [], onUpdateTaskStatus, onAddTask }) => {
    const activeCases = cases.filter(c => c.status === 'En cours' || c.status === 'Nouveau');
    const upcomingEvents = events.filter(e => new Date(e.date) >= new Date());
    const pendingTasks = tasks.filter(t => t.status !== 'Effectué');

    const [financeTab, setFinanceTab] = useState<'cases' | 'clients'>('cases');

    const [quickAddOpen, setQuickAddOpen] = useState(false);
    const [qTaskName, setQTaskName] = useState('');
    const [qCaseId, setQCaseId] = useState(cases[0]?.id || '');
    const [qLawyer, setQLawyer] = useState('');
    const [qDueDate, setQDueDate] = useState(new Date().toISOString().substring(0, 10));

    const lawyersList = Array.from(new Set(tasks.map(t => t.lawyer).filter(Boolean)));
    if (lawyersList.length === 0) {
        lawyersList.push('Me. Katako', 'Me. Badjoko', 'Me. Bakenda', 'Me. Shusu');
    }

    const todayStr = new Date().toISOString().substring(0, 10);

    const activeAvocats = (avocats && avocats.length > 0) 
        ? avocats 
        : lawyersList.map((name, i) => ({
            id: `AV-${i + 1}`,
            fullName: name,
            cabinetRole: 'Avocat Collaborateur',
            serviceStatus: 'Actif' as const,
            cabinetStatus: 'Junior' as const
        }));

    const lawyersStats = activeAvocats.map(av => {
        const lawyerTasks = tasks.filter(t => {
            if (!t.lawyer) return false;
            const lName = t.lawyer.toLowerCase().replace('me.', '').trim();
            const avName = av.fullName.toLowerCase().replace('me.', '').trim();
            return avName.includes(lName) || lName.includes(avName);
        });
        const total = lawyerTasks.length;
        const completed = lawyerTasks.filter(t => t.status === 'Effectué').length;
        const inProgress = lawyerTasks.filter(t => t.status === 'Effectué à moitié').length;
        const overdue = lawyerTasks.filter(t => t.status !== 'Effectué' && t.dueDate < todayStr).length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { ...av, total, completed, overdue, inProgress, completionRate };
    });

    const casesStats = cases.map(c => {
        const caseInvoices = (invoices || []).filter(inv => inv.caseId === c.id);
        const totalBilled = caseInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
        const totalPaid = caseInvoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
        const outstanding = totalBilled - totalPaid;
        const recoveryRate = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0;
        const normalizedRecoveryRate = recoveryRate > 100 ? 100 : recoveryRate;

        const caseTasks = tasks.filter(t => t.caseId === c.id);
        const totalTasks = caseTasks.length;
        const completedTasks = caseTasks.filter(t => t.status === 'Effectué').length;
        const overdueTasks = caseTasks.filter(t => t.status !== 'Effectué' && t.dueDate < todayStr).length;

        return { ...c, totalBilled, totalPaid, outstanding, recoveryRate: normalizedRecoveryRate, totalTasks, completedTasks, overdueTasks };
    });

    const clientsStats = clients.map(cl => {
        const clientCases = cases.filter(c => c.client === cl.name);
        const clientInvoices = (invoices || []).filter(inv => clientCases.some(c => c.id === inv.caseId));
        const totalBilled = clientInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
        const totalPaid = clientInvoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
        const outstanding = totalBilled - totalPaid;
        const rawRate = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0;
        const recoveryRate = rawRate > 100 ? 100 : rawRate;
        const activeCount = clientCases.filter(c => c.status === 'En cours' || c.status === 'Nouveau').length;

        return { ...cl, totalCases: clientCases.length, activeCount, totalBilled, totalPaid, outstanding, recoveryRate };
    });

    const handleQuickAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!qTaskName.trim() || !onAddTask) return;
        onAddTask({
            name: qTaskName.trim(),
            caseId: qCaseId,
            lawyer: qLawyer || lawyersList[0],
            dueDate: qDueDate,
            status: 'Non effectué'
        });
        setQTaskName('');
        setQuickAddOpen(false);
    };

    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.status !== 'Effectué' && b.status === 'Effectué') return -1;
        if (a.status === 'Effectué' && b.status !== 'Effectué') return 1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    return (
        <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-full overflow-hidden">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Tableau de Bord</h1>
                <p className="text-xs sm:text-sm text-gray-500">Vue d'ensemble en temps réel de l'activité du cabinet KBB.</p>
            </div>

            {/* Metrics Grid - responsive */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <StatCard title="Dossiers Actifs" value={activeCases.length.toString()} icon={<CasesIcon />} />
                <StatCard title="Clients" value={clients.length.toString()} icon={<ClientsIcon />} />
                <StatCard title="Événements" value={upcomingEvents.length.toString()} icon={<EventsIcon />} />
                <StatCard 
                    title="Tâches en Attente" 
                    value={pendingTasks.length.toString()} 
                    icon={
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    } 
                />
            </div>

            {/* Performance & Financial Summary Panel - responsive */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                
                {/* Lawyer Performance Card */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xs border border-gray-150 flex flex-col">
                    <div>
                        <div className="flex items-center justify-between mb-4 sm:mb-5">
                            <div className="min-w-0">
                                <h3 className="text-sm sm:text-base font-black text-gray-800 tracking-tight flex items-center gap-2">
                                    <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg flex-shrink-0">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </span>
                                    <span className="truncate">Performance</span>
                                </h3>
                            </div>
                            <span className="text-2xs font-extrabold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg flex-shrink-0">
                                {lawyersStats.length} Avocats
                            </span>
                        </div>

                        <div className="space-y-3 sm:space-y-4 max-h-[300px] sm:max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                            {lawyersStats.map(lawyer => {
                                const hasOverdue = lawyer.overdue > 0;
                                return (
                                    <div key={lawyer.id} className={`p-3 sm:p-4 rounded-xl border transition ${hasOverdue ? 'bg-rose-50/10 border-rose-100' : 'bg-slate-50/40 border-slate-100'}`}>
                                        <div className="flex items-start justify-between gap-2 sm:gap-4">
                                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-2xs flex-shrink-0 ${hasOverdue ? 'bg-rose-100 text-rose-800' : 'bg-indigo-100 text-indigo-800'}`}>
                                                    {lawyer.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-xs sm:text-sm font-black text-gray-800 truncate">{lawyer.fullName}</h4>
                                                    <p className="text-[10px] text-gray-455 font-bold truncate">{lawyer.cabinetRole || 'Collaborateur'}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col items-end gap-1 text-right flex-shrink-0">
                                                {hasOverdue ? (
                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] bg-rose-100 border border-rose-250 text-rose-800 font-black uppercase whitespace-nowrap">
                                                        ⚠️ {lawyer.overdue}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] bg-green-100 border border-green-250 text-green-800 font-bold uppercase whitespace-nowrap">
                                                        ✓ Ok
                                                    </span>
                                                )}
                                                <span className="text-[10px] font-bold text-gray-400 font-mono">
                                                    {lawyer.completed}/{lawyer.total}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-2 sm:mt-3">
                                            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-1">
                                                <span>Complétion</span>
                                                <span className="font-mono text-gray-600">{lawyer.completionRate}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200/50 rounded-full h-1.5 overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-500 ${hasOverdue ? 'bg-amber-500' : 'bg-indigo-650'}`} 
                                                    style={{ width: `${lawyer.completionRate}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Financial Summary Card */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xs border border-gray-150 flex flex-col">
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-4 sm:mb-5">
                            <div>
                                <h3 className="text-sm sm:text-base font-black text-gray-800 tracking-tight flex items-center gap-2">
                                    <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg flex-shrink-0">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </span>
                                    <span className="truncate">Finances</span>
                                </h3>
                            </div>

                            <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-center">
                                <button
                                    onClick={() => setFinanceTab('cases')}
                                    className={`px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-3xs font-black uppercase tracking-wider transition whitespace-nowrap ${financeTab === 'cases' ? 'bg-white text-gray-800 shadow-3xs' : 'text-gray-450 hover:text-gray-750'}`}
                                >
                                    Dossier
                                </button>
                                <button
                                    onClick={() => setFinanceTab('clients')}
                                    className={`px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-3xs font-black uppercase tracking-wider transition whitespace-nowrap ${financeTab === 'clients' ? 'bg-white text-gray-800 shadow-3xs' : 'text-gray-450 hover:text-gray-750'}`}
                                >
                                    Client
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3 max-h-[300px] sm:max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                            {financeTab === 'cases' ? (
                                casesStats.map(c => {
                                    const hasOutstanding = c.outstanding > 0;
                                    return (
                                        <div key={c.id} className="p-3 sm:p-3.5 bg-slate-50/40 border border-slate-100 rounded-xl">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="text-xs sm:text-sm font-black text-gray-800 leading-tight truncate">{c.name}</h4>
                                                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                                                        <span className="text-[10px] font-bold text-gray-403 truncate">{c.client}</span>
                                                        <span className="text-gray-300 hidden sm:inline">•</span>
                                                        <span className="text-[9px] font-mono text-gray-400 font-bold hidden sm:inline">{c.id}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right whitespace-nowrap flex-shrink-0">
                                                    <span className="block text-xs font-bold font-mono text-emerald-800">
                                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(c.totalBilled)}
                                                    </span>
                                                    {hasOutstanding ? (
                                                        <span className="inline-block text-[9px] font-black font-mono text-rose-600 mt-1 bg-rose-50 rounded border border-rose-100 px-1.5 py-0.5 uppercase tracking-wide">
                                                            -{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(c.outstanding)}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-block text-[9px] font-extrabold font-mono text-emerald-700 mt-1 bg-emerald-50 rounded border border-emerald-100 px-1.5 py-0.5 uppercase tracking-wide whitespace-nowrap">
                                                            Soldé
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-3 flex items-center gap-2 sm:gap-3">
                                                <div className="flex-1 bg-slate-200/50 rounded-full h-1.5 overflow-hidden">
                                                    <div 
                                                        className="h-full rounded-full bg-emerald-600 transition-all duration-500" 
                                                        style={{ width: `${c.recoveryRate}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-black font-mono text-emerald-800 flex-shrink-0">
                                                    {c.recoveryRate}%
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                clientsStats.map(cl => {
                                    const hasOutstanding = cl.outstanding > 0;
                                    return (
                                        <div key={cl.id} className="p-3 sm:p-3.5 bg-slate-50/40 border border-slate-100 rounded-xl">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="text-xs sm:text-sm font-black text-gray-800 leading-tight truncate">{cl.name}</h4>
                                                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                                        <span className="text-[9px] font-black uppercase text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded whitespace-nowrap">
                                                            {cl.totalCases} {cl.totalCases === 1 ? 'affaire' : 'affaires'}
                                                        </span>
                                                        {cl.activeCount > 0 && (
                                                            <span className="text-[9px] font-black uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded whitespace-nowrap">
                                                                {cl.activeCount} active(s)
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right whitespace-nowrap flex-shrink-0">
                                                    <span className="block text-xs font-bold font-mono text-emerald-800">
                                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cl.totalBilled)}
                                                    </span>
                                                    {hasOutstanding ? (
                                                        <span className="inline-block text-[9px] font-black font-mono text-rose-600 mt-1 bg-rose-50 rounded border border-rose-100 px-1.5 py-0.5 uppercase tracking-wide whitespace-nowrap">
                                                            Dû : {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cl.outstanding)}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-block text-[9px] font-extrabold font-mono text-emerald-700 mt-1 bg-emerald-50 rounded border border-emerald-100 px-1.5 py-0.5 uppercase tracking-wide whitespace-nowrap">
                                                            100%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-3 flex items-center gap-2 sm:gap-3">
                                                <div className="flex-1 bg-slate-200/50 rounded-full h-1.5 overflow-hidden">
                                                    <div 
                                                        className="h-full rounded-full bg-emerald-600 transition-all duration-500" 
                                                        style={{ width: `${cl.recoveryRate}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-black font-mono text-emerald-800 flex-shrink-0">
                                                    {cl.recoveryRate}%
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Dashboard Modules - responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                
                {/* Module 1: Upcoming Events */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-auto sm:h-[400px]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                            <span className="p-1.5 bg-rose-50 rounded-lg text-rose-600 flex-shrink-0">
                                <EventsIcon />
                            </span>
                            <span className="truncate">Événements</span>
                        </h2>
                        <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full flex-shrink-0">
                            {upcomingEvents.length}
                        </span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 max-h-[250px] sm:max-h-none">
                        {upcomingEvents.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-6 bg-slate-50/50 rounded-xl border border-dashed border-gray-250">
                                <span className="text-2xl mb-1">📅</span>
                                <p className="text-xs sm:text-sm font-semibold text-gray-500">Aucun événement</p>
                            </div>
                        ) : (
                            <ul className="space-y-2 sm:space-y-3.5">
                                {upcomingEvents.slice(0, 5).map(h => (
                                    <li key={h.id} className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-100">
                                         <p className="font-semibold text-xs sm:text-sm text-gray-800 truncate">{h.name}</p>
                                         <div className="flex items-center justify-between mt-1.5">
                                             <span className="text-[10px] sm:text-xs text-gray-400 font-medium truncate">📍 {h.lieu}</span>
                                             <span className="text-[10px] bg-slate-200/60 text-slate-700 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider flex-shrink-0">{h.type}</span>
                                         </div>
                                         <p className="text-[10px] font-extrabold text-[#15447c] mt-1">
                                             📅 {h.date}
                                         </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Module 2: Recent Tasks */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-auto sm:h-[400px]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                            <span className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 flex-shrink-0">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </span>
                            <span className="truncate">Tâches</span>
                        </h2>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {!quickAddOpen && (
                                <button 
                                    onClick={() => {
                                        setQuickAddOpen(true);
                                        if (cases.length > 0 && !qCaseId) setQCaseId(cases[0].id);
                                    }}
                                    className="text-[10px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition"
                                >
                                    + Ajouter
                                </button>
                            )}
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                                {tasks.length}
                            </span>
                        </div>
                    </div>

                    {quickAddOpen ? (
                        <form onSubmit={handleQuickAddSubmit} className="flex-1 flex flex-col overflow-y-auto custom-scrollbar pr-1 bg-slate-50/50 p-3 sm:p-4 rounded-xl border border-slate-100 animate-fadeIn">
                            <div className="space-y-2.5">
                                <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider border-b border-indigo-100 pb-1 mb-2">
                                    Nouvelle Tâche
                                </div>
                                
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nom</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="Intitulé..."
                                        value={qTaskName}
                                        onChange={(e) => setQTaskName(e.target.value)}
                                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-gray-850"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Dossier</label>
                                        <select 
                                            value={qCaseId}
                                            onChange={(e) => setQCaseId(e.target.value)}
                                            className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-bold text-gray-700"
                                        >
                                            {cases.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Avocat</label>
                                        <select 
                                            value={qLawyer}
                                            onChange={(e) => setQLawyer(e.target.value)}
                                            className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-bold text-gray-700"
                                        >
                                            {lawyersList.map(lawyer => (
                                                <option key={lawyer} value={lawyer}>{lawyer}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Échéance</label>
                                    <input 
                                        type="date" 
                                        required
                                        value={qDueDate}
                                        onChange={(e) => setQDueDate(e.target.value)}
                                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-bold text-gray-700"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4 pt-2 border-t border-slate-200/50">
                                <button 
                                    type="button"
                                    onClick={() => setQuickAddOpen(false)}
                                    className="flex-1 bg-white hover:bg-slate-100 text-gray-600 font-bold py-1.5 rounded-lg text-xs border border-gray-250 transition"
                                >
                                    Annuler
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 rounded-lg text-xs shadow-md shadow-indigo-500/10 transition"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 max-h-[250px] sm:max-h-none">
                            {tasks.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-6 bg-slate-50/50 rounded-xl border border-dashed border-gray-250">
                                    <span className="text-2xl mb-1">📋</span>
                                    <p className="text-xs sm:text-sm font-semibold text-gray-500">Aucune tâche</p>
                                </div>
                            ) : (
                                <ul className="space-y-2 sm:space-y-3.5">
                                    {sortedTasks.slice(0, 5).map(t => (
                                        <li key={t.id} className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-start gap-2 min-w-0 flex-1">
                                                    <button
                                                        onClick={() => {
                                                            if (onUpdateTaskStatus) {
                                                                const nextStatus = t.status === 'Effectué' ? 'Non effectué' : 'Effectué';
                                                                onUpdateTaskStatus(t.id, nextStatus);
                                                            }
                                                        }}
                                                        className="mt-0.5 flex-shrink-0"
                                                    >
                                                        {t.status === 'Effectué' ? (
                                                            <div className="w-4 h-4 rounded-md bg-green-600 text-white flex items-center justify-center shadow-xs">
                                                                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        ) : (
                                                            <div className="w-4 h-4 rounded-md border-2 border-gray-300" />
                                                        )}
                                                    </button>
                                                    
                                                    <div className="min-w-0 flex-1">
                                                        <p className={`font-semibold text-xs sm:text-sm truncate ${t.status === 'Effectué' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{t.name}</p>
                                                        <p className="text-[10px] text-gray-400 truncate mt-0.5">📜 {t.caseId}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-0.5 flex-shrink-0 rounded text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                                                    t.status === 'Effectué' ? 'bg-green-50 text-green-700 border border-green-100' : 
                                                    t.status === 'Effectué à moitié' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                    'bg-rose-50 text-rose-700 border border-rose-100'
                                                }`}>
                                                    {t.status === 'Effectué' ? 'Fait' : 'À faire'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50">
                                                <span className="text-[10px] font-black uppercase tracking-wider text-[#15447c] truncate">👤 {t.lawyer}</span>
                                                <span className={`text-[10px] font-semibold flex-shrink-0 ${t.status !== 'Effectué' && new Date(t.dueDate) < new Date() ? 'text-rose-600 font-bold' : 'text-gray-500'}`}>
                                                    {t.dueDate}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                {/* Module 3: Recent Cases - responsive card layout on mobile */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-auto sm:h-[400px]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                            <span className="p-1.5 bg-teal-50 rounded-lg text-teal-600 flex-shrink-0">
                                <CasesIcon />
                            </span>
                            <span className="truncate">Dossiers</span>
                        </h2>
                        <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full flex-shrink-0">
                            {cases.length}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 max-h-[250px] sm:max-h-none">
                        {cases.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-6 bg-slate-50/50 rounded-xl border border-dashed border-gray-250">
                                <span className="text-2xl mb-1">💼</span>
                                <p className="text-xs sm:text-sm font-semibold text-gray-500">Aucun dossier</p>
                            </div>
                        ) : (
                            <div className="space-y-2 sm:hidden">
                                {/* Mobile: cards instead of table */}
                                {cases.slice(0, 5).map(c => (
                                    <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-gray-800 truncate">{c.name}</p>
                                                <p className="text-[10px] text-gray-400 truncate mt-0.5">👤 {c.client}</p>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 whitespace-nowrap ${
                                                c.status === 'En cours' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
                                                c.status === 'Clôturé' ? 'bg-green-50 text-green-700 border border-green-100' : 
                                                c.status === 'Nouveau' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 
                                                'bg-amber-50 text-amber-700 border border-amber-100'
                                            }`}>
                                                {c.status}
                                            </span>
                                        </div>
                                        <p className="text-[10px] font-mono text-gray-400 mt-1">{c.id}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Desktop: table (hidden on mobile) */}
                        {cases.length > 0 && (
                            <div className="hidden sm:block overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                                            <th className="pb-3">Dossier</th>
                                            <th className="pb-3 text-right">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {cases.slice(0, 5).map(c => (
                                            <tr key={c.id} className="hover:bg-indigo-50/10 transition">
                                                <td className="py-2.5 pr-2">
                                                    <div className="text-sm font-semibold text-gray-800 truncate max-w-[200px]">{c.name}</div>
                                                    <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5 flex-wrap">
                                                        <span className="truncate">👤 {c.client}</span>
                                                        <span className="text-gray-300 hidden lg:inline">•</span>
                                                        <span className="font-mono text-[10px]">{c.id}</span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 text-right">
                                                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                                                        c.status === 'En cours' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
                                                        c.status === 'Clôturé' ? 'bg-green-50 text-green-700 border border-green-100' : 
                                                        c.status === 'Nouveau' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 
                                                        'bg-amber-50 text-amber-700 border border-amber-100'
                                                    }`}>
                                                        {c.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
