import React, { FC, useState } from 'react';
import PageContainer from '../components/PageContainer';
import TaskModal from '../components/modals/TaskModal';
import { Task, Case, Avocat } from '../types';

interface AgendaPageProps {
  tasks: Task[];
  cases: Case[];
  lawyerNames: string[];
  avocats?: Avocat[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

const FRENCH_MONTHS = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];
const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const WEEKDAYS_SHORT = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const AgendaPage: FC<AgendaPageProps> = ({ tasks, cases, lawyerNames, avocats = [], onAddTask }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showOnlyOverdue, setShowOnlyOverdue] = useState(false);
    const [activeView, setActiveView] = useState<'calendar' | 'list'>('calendar');
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [selectedFilterDate, setSelectedFilterDate] = useState<string | null>(null);
    const [selectedTaskForModal, setSelectedTaskForModal] = useState<Task | null>(null);
    const [prefilledStartDate, setPrefilledStartDate] = useState<string | null>(null);
    const [expandedTaskIds, setExpandedTaskIds] = useState<string[]>([]);

    const toggleRow = (taskId: string) => {
        setExpandedTaskIds(prev => prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]);
    };

    const today = new Date().toISOString().split('T')[0];

    const isOverdue = (task: Task) => task.status !== 'Effectué' && task.dueDate < today;

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Effectué': return 'bg-green-100 text-green-800 border-green-200';
            case 'Non effectué': return 'bg-red-100 text-red-800 border-red-200';
            case 'Effectué à moitié': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y: number, m: number) => { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; };
    const daysInCurrMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);
    const cells: { dateStr: string; day: number; isCurrentMonth: boolean; isToday: boolean }[] = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
        const d = daysInPrevMonth - i;
        const m = month === 0 ? 11 : month - 1;
        const y = month === 0 ? year - 1 : year;
        const dateStr = y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
        cells.push({ dateStr, day: d, isCurrentMonth: false, isToday: dateStr === today });
    }
    for (let d = 1; d <= daysInCurrMonth; d++) {
        const dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
        cells.push({ dateStr, day: d, isCurrentMonth: true, isToday: dateStr === today });
    }
    const totalCells = 42;
    const remaining = totalCells - cells.length;
    for (let n = 1; n <= remaining; n++) {
        const m = month === 11 ? 0 : month + 1;
        const y = month === 11 ? year + 1 : year;
        const dateStr = y + '-' + String(m + 1).padStart(2, '0') + '-' + String(n).padStart(2, '0');
        cells.push({ dateStr, day: n, isCurrentMonth: false, isToday: dateStr === today });
    }

    const getTasksForDate = (dateStr: string) => tasks.filter(task => {
        const start = task.startDate || task.dueDate;
        const end = task.endDate || task.dueDate;
        return dateStr >= start && dateStr <= end;
    });
    const isTaskActiveOnDate = (task: Task, dateStr: string) => {
        const start = task.startDate || task.dueDate;
        const end = task.endDate || task.dueDate;
        return dateStr >= start && dateStr <= end;
    };
    const baseTasks = showOnlyOverdue ? tasks.filter(task => isOverdue(task)) : tasks;
    const finalTasks = selectedFilterDate ? baseTasks.filter(task => isTaskActiveOnDate(task, selectedFilterDate)) : baseTasks;
    const handlePrevMonth = () => setCalendarDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCalendarDate(new Date(year, month + 1, 1));
    const handleToday = () => setCalendarDate(new Date());
    const completedTasksCount = tasks.filter(t => t.status === 'Effectué').length;
    const overdueTasksCount = tasks.filter(t => isOverdue(t)).length;
    const upcomingTasksCount = tasks.filter(t => t.status !== 'Effectué' && !isOverdue(t)).length;

    return (
        <>
            <PageContainer title="Agenda" buttonLabel="Ajouter une Tâche" onButtonClick={() => { setPrefilledStartDate(null); setIsModalOpen(true); }}>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-150 shadow-xs">
                        <span className="text-[9px] sm:text-[11px] font-bold text-slate-450 uppercase tracking-wider block">Faites</span>
                        <span className="text-lg sm:text-2xl font-extrabold text-slate-800 block mt-1">{completedTasksCount}</span>
                        <span className="text-[9px] sm:text-xs font-semibold text-green-600 bg-green-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-green-100 inline-block mt-1">{tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0}%</span>
                    </div>
                    <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-150 shadow-xs">
                        <span className="text-[9px] sm:text-[11px] font-bold text-slate-450 uppercase tracking-wider block">Retard</span>
                        <span className={'text-lg sm:text-2xl font-extrabold block mt-1 ' + (overdueTasksCount > 0 ? 'text-red-600' : 'text-slate-800')}>{overdueTasksCount}</span>
                        {overdueTasksCount > 0 && <span className="text-[9px] sm:text-xs font-bold text-red-600 bg-red-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-red-100 inline-block mt-1">Urgent</span>}
                    </div>
                    <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-150 shadow-xs">
                        <span className="text-[9px] sm:text-[11px] font-bold text-slate-450 uppercase tracking-wider block">À venir</span>
                        <span className="text-lg sm:text-2xl font-extrabold text-slate-800 block mt-1">{upcomingTasksCount}</span>
                        <span className="text-[9px] sm:text-xs font-semibold text-indigo-600 bg-indigo-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-indigo-100 inline-block mt-1">En attente</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                    <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit">
                        <button onClick={() => setActiveView('calendar')} className={'px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1 ' + (activeView === 'calendar' ? 'bg-white shadow-sm text-indigo-700' : 'text-gray-500')}>
                            <svg className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <span className="hidden sm:inline">Calendrier</span>
                        </button>
                        <button onClick={() => setActiveView('list')} className={'px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1 ' + (activeView === 'list' ? 'bg-white shadow-sm text-indigo-700' : 'text-gray-500')}>
                            <svg className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                            <span className="hidden sm:inline">Liste ({tasks.length})</span>
                        </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center space-x-1 bg-gray-50 p-1 rounded-xl border border-gray-200 w-fit">
                            <button onClick={() => setShowOnlyOverdue(false)} className={'px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all ' + (!showOnlyOverdue ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-gray-500')}>Toutes</button>
                            <button onClick={() => setShowOnlyOverdue(true)} className={'px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all flex items-center gap-1 ' + (showOnlyOverdue ? 'bg-red-50 shadow-sm text-red-600 border border-red-100 font-bold' : 'text-gray-500')}>Retards ({overdueTasksCount})</button>
                        </div>
                    </div>
                </div>

                {selectedFilterDate && (
                    <div className="mb-3 sm:mb-4 bg-indigo-50 border border-indigo-150 rounded-xl p-2 sm:p-3 flex justify-between items-center text-xs sm:text-sm text-indigo-900">
                        <span className="truncate">📅 <strong>{new Date(selectedFilterDate).toLocaleDateString('fr-FR')}</strong></span>
                        <button onClick={() => setSelectedFilterDate(null)} className="text-xs font-bold text-indigo-600 bg-white border border-indigo-200 rounded-lg px-2 py-1 transition flex-shrink-0 ml-2">✕</button>
                    </div>
                )}

                {activeView === 'calendar' ? (
                    <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm">
                        <div className="p-2 sm:p-4 flex justify-between items-center gap-2 bg-slate-50 border-b border-gray-150">
                            <h3 className="text-sm sm:text-lg font-bold text-gray-800">{FRENCH_MONTHS[month]} {year}</h3>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <button onClick={handleToday} className="bg-white hover:bg-gray-100 text-gray-800 font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-250 text-[10px] sm:text-xs">Auj.</button>
                                <div className="inline-flex rounded-lg border border-gray-250 bg-white">
                                    <button onClick={handlePrevMonth} className="p-1 sm:p-1.5 hover:bg-gray-50 border-r border-gray-250 rounded-l-lg text-gray-600"><svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg></button>
                                    <button onClick={handleNextMonth} className="p-1 sm:p-1.5 hover:bg-gray-50 rounded-r-lg text-gray-600"><svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg></button>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 bg-slate-100 text-center border-b border-gray-150">
                            {WEEKDAYS.map((day, i) => (
                                <div key={day} className="py-1 sm:py-2 text-[9px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                                    <span className="sm:hidden">{WEEKDAYS_SHORT[i]}</span>
                                    <span className="hidden sm:inline">{day}</span>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 bg-gray-200 gap-px">
                            {cells.map(cell => {
                                const dayTasks = getTasksForDate(cell.dateStr);
                                return (
                                    <div key={cell.dateStr} onClick={() => { setSelectedFilterDate(cell.dateStr); setActiveView('list'); }}
                                        className={'p-1 sm:p-2 bg-white flex flex-col hover:bg-indigo-50/20 cursor-pointer transition relative ' + (!cell.isCurrentMonth ? 'bg-slate-50/50 text-gray-300' : 'text-gray-800') + (cell.isToday ? ' bg-indigo-50/30' : '') + (selectedFilterDate === cell.dateStr ? ' ring-2 ring-indigo-500 ring-inset' : '')}>
                                        <div className="flex justify-between items-start">
                                            <span className={'text-[10px] sm:text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full ' + (cell.isToday ? 'bg-indigo-700 text-white' : !cell.isCurrentMonth ? 'text-gray-400' : 'text-gray-700')}>
                                                {cell.day}
                                            </span>
                                            {dayTasks.length > 0 && <span className="text-[8px] sm:text-[9px] font-black bg-slate-100 text-slate-500 px-1 rounded border border-gray-100">{dayTasks.length}</span>}
                                        </div>
                                        <div className="mt-1 space-y-0.5 sm:space-y-1 overflow-hidden">
                                            {dayTasks.slice(0, 2).map(task => (
                                                <div key={task.id} onClick={(e) => { e.stopPropagation(); setSelectedTaskForModal(task); }}
                                                    className={'text-[7px] sm:text-[9px] font-bold leading-tight px-1 py-0.5 rounded border truncate ' + (task.status === 'Effectué' ? 'bg-green-50 text-green-700 border-green-150' : task.status === 'Effectué à moitié' ? 'bg-yellow-50 text-yellow-700 border-yellow-150' : 'bg-red-50 text-red-700 border-red-150')}>
                                                    {task.name}
                                                </div>
                                            ))}
                                            {dayTasks.length > 2 && <div className="text-[7px] sm:text-[8px] font-black text-indigo-600 text-center">+{dayTasks.length - 2}</div>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="sm:hidden space-y-3">
                            {finalTasks.length === 0 ? (
                                <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed">
                                    <p className="font-semibold text-sm">{selectedFilterDate ? "Aucune tâche ce jour" : showOnlyOverdue ? "Aucun retard" : "Aucune tâche"}</p>
                                </div>
                            ) : (
                                finalTasks.map(task => {
                                    const relatedCase = cases.find(c => c.id === task.caseId);
                                    const late = isOverdue(task);
                                    return (
                                        <div key={task.id} className="p-3 bg-white border border-gray-200 rounded-xl">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-semibold text-gray-800 text-sm truncate">{task.name}</h4>
                                                    {relatedCase && <p className="text-xs text-gray-500 truncate mt-0.5">📁 {relatedCase.name}</p>}
                                                </div>
                                                <span className={'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap flex-shrink-0 ' + getStatusClass(task.status)}>
                                                    {task.status === 'Effectué' ? 'Fait' : task.status === 'Non effectué' ? 'À faire' : 'En cours'}
                                                </span>
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500">
                                                <span>📅 {task.endDate || task.dueDate}</span>
                                                <span>👤 {task.lawyer || 'S/A'}</span>
                                                {late && <span className="text-red-600 font-bold">⚠️ Retard</span>}
                                            </div>
                                            <button onClick={() => setSelectedTaskForModal(task)} className="mt-2 w-full text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-1.5 rounded-xl transition">Voir détails</button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr className="text-xs text-gray-500 uppercase tracking-wider">
                                        <th className="p-4 w-8"></th>
                                        <th className="p-4 font-bold">Tâche</th>
                                        <th className="p-4 font-bold">Dossier</th>
                                        <th className="p-4 font-bold">Échéance</th>
                                        <th className="p-4 font-bold">Responsable</th>
                                        <th className="p-4 font-bold">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {finalTasks.map(task => {
                                        const relatedCase = cases.find(c => c.id === task.caseId);
                                        const late = isOverdue(task);
                                        return (
                                            <tr key={task.id} className={late ? 'bg-red-50/40 hover:bg-red-50' : 'hover:bg-gray-50'}>
                                                <td className="p-4"></td>
                                                <td className="p-4"><span className="font-semibold text-gray-800">{task.name}</span>{late && <span className="ml-2 px-1.5 py-0.5 bg-red-600 text-[10px] text-white rounded-md font-bold">Retard</span>}</td>
                                                <td className="p-4 text-sm text-gray-600">{relatedCase?.name || 'N/A'}</td>
                                                <td className="p-4 text-sm"><span className={late ? 'text-red-600 font-bold' : 'text-gray-600'}>{task.endDate || task.dueDate}</span></td>
                                                <td className="p-4 text-sm text-gray-600">{task.lawyer || 'S/A'}</td>
                                                <td className="p-4"><span className={'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ' + getStatusClass(task.status)}>{task.status}</span></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </PageContainer>

            <TaskModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setPrefilledStartDate(null); }} onSave={onAddTask} cases={cases} lawyers={lawyerNames} avocats={avocats} />

            {selectedTaskForModal && (() => {
                const relatedCase = cases.find(c => c.id === selectedTaskForModal.caseId);
                const late = isOverdue(selectedTaskForModal);
                return (
                    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-3 sm:p-4">
                        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-100 animate-scaleIn">
                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                                <h3 className="text-sm sm:text-md font-bold text-gray-800 flex items-center gap-2">Détails</h3>
                                <button onClick={() => setSelectedTaskForModal(null)} className="text-gray-400 hover:text-gray-600 font-bold text-lg p-1">&times;</button>
                            </div>
                            <div className="space-y-3 text-xs sm:text-sm">
                                <p className="font-bold text-gray-900 text-sm">{selectedTaskForModal.name}</p>
                                {relatedCase && <div className="p-2 bg-slate-50 border border-gray-150 rounded-xl"><span className="font-semibold text-gray-800">{relatedCase.name}</span></div>}
                                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-xl">
                                    <div><span className="text-3xs font-black text-slate-400 uppercase block">Début</span><p className="font-bold text-xs">{selectedTaskForModal.startDate ? new Date(selectedTaskForModal.startDate).toLocaleDateString('fr-FR') : 'N/A'}</p></div>
                                    <div><span className="text-3xs font-black text-slate-400 uppercase block">Échéance</span><p className={'font-bold text-xs ' + (late ? 'text-red-600' : 'text-gray-800')}>{new Date(selectedTaskForModal.endDate || selectedTaskForModal.dueDate).toLocaleDateString('fr-FR')}</p></div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><span className="text-2xs font-extrabold text-slate-400 uppercase block">Responsable</span><p className="font-bold text-xs">{selectedTaskForModal.lawyer || 'S/A'}</p></div>
                                    <div><span className="text-2xs font-extrabold text-slate-400 uppercase block">Statut</span><span className={'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ' + getStatusClass(selectedTaskForModal.status)}>{selectedTaskForModal.status}</span></div>
                                </div>
                                {selectedTaskForModal.notes && <div><p className="text-gray-600 bg-slate-50 p-2 rounded border text-xs italic">{selectedTaskForModal.notes}</p></div>}
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                                <button onClick={() => setSelectedTaskForModal(null)} className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-4 py-2 rounded-lg text-xs transition">Fermer</button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </>
    );
};

export default AgendaPage;
