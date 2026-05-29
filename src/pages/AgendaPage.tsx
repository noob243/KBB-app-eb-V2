import React, { FC, useState } from 'react';
import PageContainer from '../components/PageContainer';
import TaskModal from '../components/modals/TaskModal';
import { Task, Case, Avocat } from '../types';

interface AgendaPageProps {
  tasks: Task[];
  cases: Case[];
  lawyers: string[];
  avocats?: Avocat[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

const FRENCH_MONTHS = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];
const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const AgendaPage: FC<AgendaPageProps> = ({ tasks, cases, lawyers, avocats = [], onAddTask }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showOnlyOverdue, setShowOnlyOverdue] = useState(false);
    const [activeView, setActiveView] = useState<'calendar' | 'list'>('calendar');
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [selectedFilterDate, setSelectedFilterDate] = useState<string | null>(null);
    const [selectedTaskForModal, setSelectedTaskForModal] = useState<Task | null>(null);
    const [prefilledStartDate, setPrefilledStartDate] = useState<string | null>(null);
    const [expandedTaskIds, setExpandedTaskIds] = useState<string[]>([]);

    const toggleRow = (taskId: string) => {
        setExpandedTaskIds(prev => 
            prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
        );
    };

    const today = new Date().toISOString().split('T')[0];

    const isOverdue = (task: Task) => {
        return task.status !== 'Effectué' && task.dueDate < today;
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Effectué': return 'bg-green-100 text-green-800';
            case 'Non effectué': return 'bg-red-100 text-red-800';
            case 'Effectué à moitié': return 'bg-yellow-101 text-yellow-801';
            default: return 'bg-gray-101 text-gray-801';
        }
    };

    // Calendar indicators and navigation logic
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y: number, m: number) => {
        const day = new Date(y, m, 1).getDay();
        return day === 0 ? 6 : day - 1; // Monday to Sunday French index conversion
    };

    const daysInCurrMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);

    const cells: { dateStr: string; day: number; isCurrentMonth: boolean; isToday: boolean }[] = [];

    // Prior month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        const d = daysInPrevMonth - i;
        const m = month === 0 ? 11 : month - 1;
        const y = month === 0 ? year - 1 : year;
        const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        cells.push({
            dateStr,
            day: d,
            isCurrentMonth: false,
            isToday: dateStr === today
        });
    }

    // This month days
    for (let d = 1; d <= daysInCurrMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        cells.push({
            dateStr,
            day: d,
            isCurrentMonth: true,
            isToday: dateStr === today
        });
    }

    // Post month days
    const totalCells = 42;
    const remaining = totalCells - cells.length;
    for (let n = 1; n <= remaining; n++) {
        const m = month === 11 ? 0 : month + 1;
        const y = month === 11 ? year + 1 : year;
        const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(n).padStart(2, '0')}`;
        cells.push({
            dateStr,
            day: n,
            isCurrentMonth: false,
            isToday: dateStr === today
        });
    }

    const getTasksForDate = (dateStr: string) => {
        return tasks.filter(task => {
            const start = task.startDate || task.dueDate;
            const end = task.endDate || task.dueDate;
            return dateStr >= start && dateStr <= end;
        });
    };

    const isTaskActiveOnDate = (task: Task, dateStr: string) => {
        const start = task.startDate || task.dueDate;
        const end = task.endDate || task.dueDate;
        return dateStr >= start && dateStr <= end;
    };

    const baseTasks = showOnlyOverdue 
        ? tasks.filter(task => isOverdue(task))
        : tasks;

    const finalTasks = selectedFilterDate
        ? baseTasks.filter(task => isTaskActiveOnDate(task, selectedFilterDate))
        : baseTasks;

    const handlePrevMonth = () => {
        setCalendarDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCalendarDate(new Date(year, month + 1, 1));
    };

    const handleToday = () => {
        setCalendarDate(new Date());
    };

    const handleOpenWithPrefilled = (dateStr: string) => {
        setPrefilledStartDate(dateStr);
        setIsModalOpen(true);
    };

    const completedTasksCount = tasks.filter(t => t.status === 'Effectué').length;
    const overdueTasksCount = tasks.filter(t => isOverdue(t)).length;
    const upcomingTasksCount = tasks.filter(t => t.status !== 'Effectué' && !isOverdue(t)).length;

    return (
        <>
            <PageContainer 
                title="Agenda & Calendrier" 
                buttonLabel="Ajouter une Tâche" 
                onButtonClick={() => {
                    setPrefilledStartDate(null);
                    setIsModalOpen(true);
                }}
            >
                {/* Cartes récapitulatives de volume de travail */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Tâches terminées */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-[11px] font-bold text-slate-450 uppercase tracking-wider block">Tâches Terminées</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-extrabold text-slate-800">{completedTasksCount}</span>
                                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                    {tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0}% du total
                                </span>
                            </div>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl border border-green-100/50">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Tâches en retard */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-[11px] font-bold text-slate-450 uppercase tracking-wider block">Tâches en Retard</span>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-2xl font-extrabold ${overdueTasksCount > 0 ? 'text-red-650' : 'text-slate-800'}`}>{overdueTasksCount}</span>
                                {overdueTasksCount > 0 && (
                                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 animate-pulse">
                                        À traiter
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className={`p-3 rounded-xl border ${overdueTasksCount > 0 ? 'bg-red-50 text-red-600 border-red-100/50' : 'bg-slate-50 text-slate-400 border-gray-200/50'}`}>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Tâches à venir */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-[11px] font-bold text-slate-450 uppercase tracking-wider block">Tâches à Venir</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-extrabold text-slate-800">{upcomingTasksCount}</span>
                                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                                    En attente
                                </span>
                            </div>
                        </div>
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100/50">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* View switcher and metadata */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit">
                        <button 
                            type="button"
                            onClick={() => setActiveView('calendar')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${activeView === 'calendar' ? 'bg-white shadow-sm text-indigo-750' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Vue Calendrier
                        </button>
                        <button 
                            type="button"
                            onClick={() => setActiveView('list')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${activeView === 'list' ? 'bg-white shadow-sm text-indigo-750' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            Vue Liste ({tasks.length})
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center space-x-1 bg-gray-50 p-1 rounded-xl border border-gray-200 w-fit text-xs">
                            <button 
                                type="button"
                                onClick={() => setShowOnlyOverdue(false)}
                                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${!showOnlyOverdue ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-gray-500'}`}
                            >
                                Toutes
                            </button>
                            <button 
                                type="button"
                                onClick={() => setShowOnlyOverdue(true)}
                                className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${showOnlyOverdue ? 'bg-red-50 shadow-sm text-red-600 border border-red-100 font-bold' : 'text-gray-500'}`}
                            >
                                Retards ({tasks.filter(t => isOverdue(t)).length})
                            </button>
                        </div>
                        
                        <div className="text-xs text-gray-500 font-medium">
                            Aujourd'hui : <span className="font-bold text-gray-700">{new Date().toLocaleDateString('fr-FR')}</span>
                        </div>
                    </div>
                </div>

                {/* Selected Date Notification banner */}
                {selectedFilterDate && (
                    <div className="mb-4 bg-indigo-50 border border-indigo-150 rounded-xl p-3 flex justify-between items-center text-sm text-indigo-900">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 8.293A1 1 0 013 7.586V4z" />
                            </svg>
                            <span>
                                Filtre appliqué : Tâches planifiées le <strong>{new Date(selectedFilterDate).toLocaleDateString('fr-FR')}</strong>
                            </span>
                        </div>
                        <button 
                            type="button"
                            onClick={() => setSelectedFilterDate(null)}
                            className="text-xs font-bold text-indigo-650 bg-white hover:bg-slate-50 border border-indigo-200 rounded-lg px-2.5 py-1 transition shadow-2xs"
                        >
                            Désactiver le filtre
                        </button>
                    </div>
                )}

                {/* Conditional Switch render */}
                {activeView === 'calendar' ? (
                    <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm">
                        {/* Month bar */}
                        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 border-b border-gray-150">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-650" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {FRENCH_MONTHS[month]} {year}
                            </h3>
                            <div className="flex items-center space-x-2">
                                <button 
                                    type="button"
                                    onClick={handleToday}
                                    className="bg-white hover:bg-gray-100 text-gray-800 font-bold px-3 py-1.5 rounded-lg border border-gray-250 text-xs transition duration-200"
                                >
                                    Aujourd'hui
                                </button>
                                <div className="inline-flex rounded-lg border border-gray-255 bg-white shadow-2xs">
                                    <button 
                                        type="button"
                                        onClick={handlePrevMonth}
                                        className="p-1.5 hover:bg-gray-50 border-r border-gray-255 rounded-l-lg text-gray-600 hover:text-gray-900 transition"
                                        title="Mois précédent"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={handleNextMonth}
                                        className="p-1.5 hover:bg-gray-50 rounded-r-lg text-gray-600 hover:text-gray-900 transition"
                                        title="Mois suivant"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Weekday indicator labels */}
                        <div className="grid grid-cols-7 bg-slate-100 text-center border-b border-gray-150">
                            {WEEKDAYS.map(day => (
                                <div key={day} className="py-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* 42 grid blocks */}
                        <div className="grid grid-cols-7 bg-gray-200 gap-px">
                            {cells.map(cell => {
                                const dayTasks = getTasksForDate(cell.dateStr);
                                const isFocused = selectedFilterDate === cell.dateStr;

                                return (
                                    <div 
                                        key={cell.dateStr}
                                        onClick={() => {
                                            setSelectedFilterDate(cell.dateStr);
                                            setActiveView('list');
                                        }}
                                        className={`min-h-[105px] md:min-h-[125px] p-2 bg-white flex flex-col justify-between hover:bg-indigo-50/20 cursor-pointer transition group relative ${
                                            !cell.isCurrentMonth ? 'bg-slate-50/50 text-gray-300' : 'text-gray-800'
                                        } ${cell.isToday ? 'bg-indigo-50/30' : ''} ${isFocused ? 'ring-2 ring-indigo-500 ring-inset bg-indigo-50/25' : ''}`}
                                    >
                                        {/* Day number metadata */}
                                        <div className="flex justify-between items-start">
                                            <span className={`text-[11px] font-bold w-5.5 h-5.5 flex items-center justify-center rounded-full ${
                                                cell.isToday 
                                                    ? 'bg-indigo-650 text-white font-extrabold shadow-sm' 
                                                    : !cell.isCurrentMonth ? 'text-gray-400 font-medium' : 'text-gray-700'
                                            }`}>
                                                {cell.day}
                                            </span>
                                            
                                            {dayTasks.length > 0 && (
                                                <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-1 py-0.2 rounded border border-gray-100">
                                                    {dayTasks.length}
                                                </span>
                                            )}
                                        </div>

                                        {/* Tasks List for the cell */}
                                        <div className="flex-1 mt-2 space-y-1.5 overflow-hidden">
                                            {dayTasks.slice(0, 3).map(task => {
                                                let badgeColor = 'bg-red-50 text-red-700 border-red-150 hover:bg-red-100';
                                                if (task.status === 'Effectué') {
                                                    badgeColor = 'bg-green-50 text-green-700 border-green-150 hover:bg-green-100';
                                                } else if (task.status === 'Effectué à moitié') {
                                                    badgeColor = 'bg-yellow-50 text-yellow-750 border-yellow-150 hover:bg-yellow-100';
                                                }
                                                return (
                                                    <div 
                                                        key={task.id}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedTaskForModal(task);
                                                        }}
                                                        className={`text-[9.5px] font-bold leading-tight px-1.5 py-0.6 rounded-md border truncate transition-all shadow-3xs hover:scale-[1.02] ${badgeColor}`}
                                                        title={`${task.name} - Ouvrir et voir`}
                                                    >
                                                        {task.name}
                                                    </div>
                                                );
                                            })}
                                            {dayTasks.length > 3 && (
                                                <div className="text-[8.5px] font-black text-indigo-650 text-center uppercase tracking-wide pt-0.5">
                                                    + {dayTasks.length - 3} de plus
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr className="text-xs text-gray-500 uppercase tracking-wider">
                                    <th className="p-4 w-12 text-center"></th>
                                    <th className="p-4 font-bold">Tâche</th>
                                    <th className="p-4 font-bold">Dossier</th>
                                    <th className="p-4 font-bold">Échéance</th>
                                    <th className="p-4 font-bold">Responsable</th>
                                    <th className="p-4 font-bold">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {finalTasks.length > 0 ? (
                                    finalTasks.map(task => {
                                        const relatedCase = cases.find(c => c.id === task.caseId);
                                        const late = isOverdue(task);
                                        const isHighlighted = selectedFilterDate && isTaskActiveOnDate(task, selectedFilterDate);
                                        const isExpanded = expandedTaskIds.includes(task.id);

                                        return (
                                            <React.Fragment key={task.id}>
                                                <tr className={`transition-colors border-b border-gray-100 ${
                                                    isHighlighted 
                                                        ? 'bg-indigo-50/50 hover:bg-indigo-50' 
                                                        : late 
                                                            ? 'bg-red-50/40 hover:bg-red-50' 
                                                            : 'hover:bg-gray-50'
                                                } ${isExpanded ? 'bg-indigo-50/10' : ''}`}>
                                                    <td className="p-4 align-middle text-center w-12">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleRow(task.id);
                                                            }}
                                                            className="p-1.5 hover:bg-slate-200/60 rounded-lg text-gray-600 hover:text-indigo-650 transition flex items-center justify-center mx-auto"
                                                            title={isExpanded ? "Masquer les détails" : "Afficher les détails"}
                                                        >
                                                            <svg 
                                                                className={`w-4.5 h-4.5 transform transition-transform duration-200 ${isExpanded ? 'rotate-90 text-indigo-650' : 'text-gray-400'}`} 
                                                                fill="none" 
                                                                viewBox="0 0 24 24" 
                                                                stroke="currentColor"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-gray-850 flex items-center">
                                                                {task.name}
                                                                {late && (
                                                                    <span className="ml-2 px-1.5 py-0.5 bg-red-650 text-[10px] text-white rounded-md font-extrabold uppercase tracking-tighter shadow-3xs">
                                                                        Retard
                                                                    </span>
                                                                )}
                                                                {isHighlighted && (
                                                                    <span className="ml-2 px-1.5 py-0.5 bg-indigo-600 text-[10px] text-white rounded-md font-extrabold uppercase tracking-tighter shadow-3xs">
                                                                        Filtré
                                                                    </span>
                                                                )}
                                                            </span>
                                                            <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-gray-400 font-medium">
                                                                {task.procedureLinked && (
                                                                    <span className="flex items-center gap-0.5" title={`Procédure : ${task.procedureLinked}`}>
                                                                        📁 Procédure : <strong className="text-gray-600 font-semibold">{task.procedureLinked}</strong>
                                                                    </span>
                                                                )}
                                                                {task.notes && (
                                                                    <span className="flex items-center gap-0.5 text-slate-500" title="Contient des notes">
                                                                        📝 Notes
                                                                    </span>
                                                                )}
                                                                {task.rapport && (
                                                                    <span className="flex items-center gap-0.5 text-indigo-550" title="Contient un rapport">
                                                                        📊 Rapport
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-sm text-gray-600 align-middle">
                                                        {relatedCase ? (
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-gray-800">{relatedCase.name}</span>
                                                                <span className="text-xs text-gray-400 font-medium">{relatedCase.client}</span>
                                                            </div>
                                                        ) : 'Aucun dossier'}
                                                    </td>
                                                    <td className="p-4 text-sm align-middle">
                                                        <div className="flex flex-col text-xs space-y-0.5">
                                                            {task.startDate && (
                                                                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                                                                    du {new Date(task.startDate).toLocaleDateString('fr-FR')}
                                                                </span>
                                                            )}
                                                            <span className={`font-semibold text-sm ${late ? 'text-red-600 font-bold' : 'text-gray-750'}`}>
                                                                au {new Date(task.endDate || task.dueDate).toLocaleDateString('fr-FR')}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-sm text-gray-650 align-middle">
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-gray-800">{task.lawyer || 'S/A'}</span>
                                                            {task.associatedLawyers && task.associatedLawyers.length > 0 && (
                                                                <span className="text-[10px] text-indigo-600 font-bold">
                                                                    +{task.associatedLawyers.length} collaborateur{task.associatedLawyers.length > 1 ? 's' : ''}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusClass(task.status)}`}>
                                                            {task.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                                {isExpanded && (
                                                    <tr key={`${task.id}-expanded`} className="bg-slate-50/60 shadow-inner">
                                                        <td colSpan={6} className="p-0 border-b border-gray-150">
                                                            <div className="p-5 bg-slate-50 border-l-4 border-indigo-600 flex flex-col gap-5 text-gray-800">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                    {/* Section 1: Informations Générales */}
                                                                    <div className="space-y-3">
                                                                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block border-b border-gray-200 pb-1">
                                                                            Informations Générales
                                                                        </span>
                                                                        <div className="space-y-2 text-xs">
                                                                            <div className="flex justify-between items-center py-0.5">
                                                                                <span className="text-gray-500 font-medium">Tâche :</span>
                                                                                <span className="font-bold text-gray-805">{task.name}</span>
                                                                            </div>
                                                                            {task.procedureLinked && (
                                                                                <div className="flex justify-between items-start py-0.5">
                                                                                    <span className="text-gray-500 font-medium shrink-0">Procédure :</span>
                                                                                    <span className="font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 text-right max-w-[200px] truncate">
                                                                                        {task.procedureLinked}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                            <div className="flex justify-between items-center py-0.5">
                                                                                <span className="text-gray-500 font-medium">Statut de la tâche :</span>
                                                                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusClass(task.status)}`}>
                                                                                    {task.status}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Section 2: Planification & Dates */}
                                                                    <div className="space-y-3">
                                                                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block border-b border-gray-200 pb-1">
                                                                            Dates & Échéances
                                                                        </span>
                                                                        <div className="space-y-2 text-xs">
                                                                            <div className="flex justify-between items-center py-0.5">
                                                                                <span className="text-gray-500 font-medium">Début programmé :</span>
                                                                                <span className="font-semibold text-gray-800">
                                                                                    {task.startDate ? new Date(task.startDate).toLocaleDateString('fr-FR') : 'Non défini'}
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex justify-between items-center py-0.5">
                                                                                <span className="text-gray-500 font-medium">Échéance finale :</span>
                                                                                <span className={`font-bold ${late ? 'text-red-600' : 'text-gray-800'}`}>
                                                                                    {new Date(task.endDate || task.dueDate).toLocaleDateString('fr-FR')}
                                                                                </span>
                                                                            </div>
                                                                            {late && (
                                                                                <div className="flex justify-between items-center py-0.5">
                                                                                    <span className="text-gray-500 font-medium">Alerte :</span>
                                                                                    <span className="text-[10px] font-extrabold text-red-650 bg-red-50 px-2 py-0.5 rounded border border-red-105">
                                                                                        En retard
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* Section 3: Responsables & Collaborateurs */}
                                                                    <div className="space-y-3">
                                                                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block border-b border-gray-200 pb-1">
                                                                            Responsabilités
                                                                        </span>
                                                                        <div className="space-y-2 text-xs">
                                                                            <div className="flex justify-between items-center py-0.5">
                                                                                <span className="text-gray-500 font-medium">Responsable principal :</span>
                                                                                <span className="font-bold text-gray-800">{task.lawyer || 'S/A'}</span>
                                                                            </div>
                                                                            {task.associatedLawyers && task.associatedLawyers.length > 0 && (
                                                                                <div>
                                                                                    <span className="text-gray-500 font-medium block mb-1">Collaborateurs associés :</span>
                                                                                    <div className="flex flex-wrap gap-1">
                                                                                        {task.associatedLawyers.map(lawyer => (
                                                                                            <span key={lawyer} className="px-1.5 py-0.5 bg-indigo-50 text-indigo-705 border border-indigo-150 font-bold rounded-lg text-[10px]">
                                                                                                {lawyer}
                                                                                            </span>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Row 2: Notes et Rapports (S'ils existent) */}
                                                                {(task.notes || task.rapport) && (
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-150 pt-4">
                                                                        {task.notes && (
                                                                            <div className="space-y-1.5">
                                                                                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                                                                                    Notes & Remarques
                                                                                </span>
                                                                                <div className="p-3 bg-white border border-gray-150 rounded-xl text-xs text-gray-700 font-medium italic leading-relaxed">
                                                                                    {task.notes}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {task.rapport && (
                                                                            <div className="space-y-1.5">
                                                                                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                                                                                    Rapport / Compte-rendu
                                                                                </span>
                                                                                <div className="p-3 bg-white border border-gray-150 rounded-xl text-xs text-gray-800 leading-relaxed font-normal whitespace-pre-line bg-indigo-50/10">
                                                                                    {task.rapport}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="bg-gray-50 p-4 rounded-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-305" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-400 font-medium">
                                                    {selectedFilterDate 
                                                        ? "Aucune tâche programmée pour ce jour spécifique." 
                                                        : showOnlyOverdue 
                                                            ? "Félicitations ! Aucune tâche n'est en retard." 
                                                            : "Aucune tâche enregistrée."
                                                    }
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </PageContainer>

            {/* Creation Modal */}
            <TaskModal 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                    setPrefilledStartDate(null);
                }} 
                onSave={onAddTask} 
                cases={cases} 
                lawyers={lawyers} 
                avocats={avocats} 
            />

            {/* Task Detail overlay modal for direct interactive calendars click */}
            {selectedTaskForModal && (() => {
                const relatedCase = cases.find(c => c.id === selectedTaskForModal.caseId);
                return (
                    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-3xs">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-100 animate-scaleIn">
                            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
                                <h3 className="text-md font-bold text-gray-800 flex items-center gap-2">
                                    <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                    </span>
                                    Détails de la Tâche
                                </h3>
                                <button 
                                    onClick={() => setSelectedTaskForModal(null)} 
                                    className="text-gray-400 hover:text-gray-650 font-bold text-xl transition"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="space-y-4 text-sm">
                                <div>
                                    <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-widest block mb-0.5">Nom de la Tâche :</span>
                                    <p className="font-bold text-gray-900 text-base leading-tight">{selectedTaskForModal.name}</p>
                                </div>

                                {relatedCase && (
                                    <div>
                                        <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Dossier lié :</span>
                                        <div className="p-2.5 bg-slate-50 border border-gray-150 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                            <span className="font-semibold text-gray-800 text-xs">{relatedCase.name}</span>
                                            <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-lg border border-indigo-100">
                                                Client: {relatedCase.client}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 border border-gray-150 p-3 rounded-xl">
                                    <div>
                                        <span className="text-3xs font-black text-slate-400 uppercase tracking-wider block mb-0.5">Début :</span>
                                        <p className="font-bold text-gray-800 text-xs">{selectedTaskForModal.startDate ? new Date(selectedTaskForModal.startDate).toLocaleDateString('fr-FR') : 'Non configuré'}</p>
                                    </div>
                                    <div>
                                        <span className="text-3xs font-black text-slate-400 uppercase tracking-wider block mb-0.5">Date fin (Échéance) :</span>
                                        <p className={`font-bold text-xs ${isOverdue(selectedTaskForModal) ? 'text-red-750' : 'text-gray-800'}`}>{new Date(selectedTaskForModal.endDate || selectedTaskForModal.dueDate).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-widest block mb-0.5">Responsable principal :</span>
                                        <p className="font-bold text-gray-800">{selectedTaskForModal.lawyer || 'S/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-widest block mb-0.5">Statut :</span>
                                        <span className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusClass(selectedTaskForModal.status)}`}>
                                            {selectedTaskForModal.status}
                                        </span>
                                    </div>
                                </div>

                                {selectedTaskForModal.associatedLawyers && selectedTaskForModal.associatedLawyers.length > 0 && (
                                    <div>
                                        <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Collaborateurs associés :</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedTaskForModal.associatedLawyers.map(l => (
                                                <span key={l} className="px-2 py-0.5 bg-indigo-50 text-indigo-755 text-xs font-bold rounded-lg border border-indigo-100">
                                                    {l}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedTaskForModal.procedureLinked && (
                                    <div>
                                        <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-widest block mb-0.5">Procédure rattachée :</span>
                                        <span className="inline-block px-2.5 py-0.5 bg-[#15447c]/5 text-[#15447c] font-bold text-xs rounded-lg border border-[#15447c]/15">
                                            {selectedTaskForModal.procedureLinked}
                                        </span>
                                    </div>
                                )}

                                {selectedTaskForModal.notes && (
                                    <div>
                                        <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-widest block mb-0.5">Notes :</span>
                                        <p className="text-gray-600 bg-slate-50 p-2.5 rounded border border-gray-100 italic text-xs leading-relaxed">{selectedTaskForModal.notes}</p>
                                    </div>
                                )}

                                {selectedTaskForModal.rapport && (
                                    <div>
                                        <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-widest block mb-0.5">Rapport d'audience / Compte-rendu :</span>
                                        <div className="text-gray-800 bg-indigo-50/20 border border-indigo-150 p-3 rounded-xl font-medium whitespace-pre-wrap text-xs max-h-40 overflow-y-auto leading-relaxed">
                                            {selectedTaskForModal.rapport}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between gap-4">
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setSelectedFilterDate(selectedTaskForModal.startDate || selectedTaskForModal.dueDate);
                                        setActiveView('list');
                                        setSelectedTaskForModal(null);
                                    }}
                                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 transition shadow-2xs"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Voir dans la liste détaillée
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setSelectedTaskForModal(null)} 
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-4 py-2 rounded-lg text-xs transition"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </>
    );
};

export default AgendaPage;
