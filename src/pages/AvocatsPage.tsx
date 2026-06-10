import React, { FC, useState } from 'react';
import PageContainer from '../components/PageContainer';
import AvocatModal from '../components/modals/AvocatModal';
import { Avocat, Task } from '../types';

interface AvocatsPageProps {
  avocats: Avocat[];
  tasks?: Task[];
  onAddAvocat: (avocat: Avocat) => void;
  onDeleteAvocat?: (id: string) => void;
}

const AvocatsPage: FC<AvocatsPageProps> = ({ avocats, tasks = [], onAddAvocat, onDeleteAvocat }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedAvocat, setSelectedAvocat] = useState<Avocat | null>(null);
    
    const getServiceStatusClass = (status: string) => {
        switch (status) {
            case 'Actif': return 'bg-green-100 text-green-800 border-green-200';
            case 'Omi':
            case 'Omis': return 'bg-amber-50 text-amber-800 border-amber-200';
            case 'Mise en disponibilité': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <>
            <PageContainer title="Avocats" buttonLabel="Ajouter un Avocat" onButtonClick={() => setIsAddModalOpen(true)}>
                {/* Mobile: cards */}
                <div className="sm:hidden space-y-3">
                    {avocats.map(avocat => (
                        <div key={avocat.id} className="p-4 bg-white border border-gray-200 rounded-xl">
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-[#15447c] flex-shrink-0">
                                            {avocat.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-gray-800 text-sm truncate">{avocat.fullName}</h3>
                                            <p className="text-[11px] text-gray-500 truncate">{avocat.cabinetRole} · {avocat.cabinetStatus}</p>
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getServiceStatusClass(avocat.serviceStatus)}`}>
                                    {avocat.serviceStatus}
                                </span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
                                <span className="bg-gray-50 px-2 py-1 rounded">📧 {avocat.emails[0]}</span>
                                <span className="bg-gray-50 px-2 py-1 rounded">📞 {avocat.phone}</span>
                            </div>
                            <div className="mt-3 flex gap-2">
                                <button 
                                    onClick={() => setSelectedAvocat(avocat)}
                                    className="flex-1 text-indigo-600 font-bold text-xs bg-indigo-50 hover:bg-indigo-100 py-2 rounded-xl transition"
                                >
                                    Voir Profil
                                </button>
                                {onDeleteAvocat && (
                                    <button 
                                        onClick={() => onDeleteAvocat(avocat.id)}
                                        className="px-3 text-red-500 font-bold text-xs bg-red-50 hover:bg-red-100 py-2 rounded-xl transition"
                                    >
                                        Suppr.
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {avocats.length === 0 && (
                        <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed">
                            <p className="font-semibold">Aucun avocat enregistré</p>
                        </div>
                    )}
                </div>

                {/* Desktop: table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-xs sm:text-sm text-gray-600">
                                <th className="p-3 sm:p-4 font-semibold">Nom</th>
                                <th className="p-3 sm:p-4 font-semibold">Statut Cabinet</th>
                                <th className="p-3 sm:p-4 font-semibold">Service</th>
                                <th className="p-3 sm:p-4 font-semibold">E-mail</th>
                                <th className="p-3 sm:p-4 font-semibold">Téléphone</th>
                                <th className="p-3 sm:p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {avocats.map(avocat => (
                                <tr key={avocat.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-3 sm:p-4 font-medium text-gray-800 text-sm">{avocat.fullName}</td>
                                    <td className="p-3 sm:p-4 text-gray-600 text-sm">{avocat.cabinetStatus}</td>
                                    <td className="p-3 sm:p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getServiceStatusClass(avocat.serviceStatus)}`}>
                                            {avocat.serviceStatus}
                                        </span>
                                    </td>
                                    <td className="p-3 sm:p-4 text-gray-600 text-sm truncate max-w-[150px]">{avocat.emails[0]}</td>
                                    <td className="p-3 sm:p-4 text-gray-600 text-sm">{avocat.phone}</td>
                                    <td className="p-3 sm:p-4">
                                        <button 
                                            onClick={() => setSelectedAvocat(avocat)}
                                            className="text-indigo-600 font-bold text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition"
                                        >
                                            Voir
                                        </button>
                                        {onDeleteAvocat && (
                                            <button 
                                                onClick={() => onDeleteAvocat(avocat.id)}
                                                className="ml-2 text-red-500 font-bold text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition"
                                            >
                                                Suppr.
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </PageContainer>
            
            <AvocatModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={onAddAvocat} />

            {/* Avocat details modal */}
            {selectedAvocat && (() => {
                const lawyerTasks = tasks.filter(t => t.lawyer && t.lawyer.toLowerCase() === selectedAvocat.fullName.toLowerCase());
                
                return (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-center items-center p-3 sm:p-4">
                        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto animate-fadeIn">
                            <div className="flex justify-between items-start mb-4 sm:mb-6 border-b border-gray-100 pb-3 sm:pb-4">
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 pr-2">
                                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-indigo-100 rounded-full flex items-center justify-center text-base sm:text-xl font-extrabold text-[#15447c] flex-shrink-0">
                                        {selectedAvocat.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-2xs font-bold text-indigo-600 uppercase tracking-wider block mb-0.5 truncate">{selectedAvocat.cabinetRole} ({selectedAvocat.cabinetStatus})</span>
                                        <h2 className="text-base sm:text-2xl font-extrabold text-gray-850 truncate">{selectedAvocat.fullName}</h2>
                                        <p className="text-2xs font-mono text-gray-400 mt-1">ONA : <strong>{selectedAvocat.onaNumber || 'N/A'}</strong></p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedAvocat(null)} className="p-1 hover:bg-slate-100 rounded-xl text-gray-400 hover:text-gray-600 transition flex-shrink-0">
                                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Contact</span>
                                        <p className="text-xs text-gray-700 font-medium">📞 {selectedAvocat.phone}</p>
                                        <p className="text-xs text-gray-700 font-medium mt-1 break-all">✉️ {selectedAvocat.emails.join(', ')}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Serments</span>
                                        <p className="text-xs text-gray-700">📅 1er : {selectedAvocat.firstOathDate || 'N/A'}</p>
                                        {selectedAvocat.secondOathDate && <p className="text-xs text-gray-700 mt-1">📅 2nd : {selectedAvocat.secondOathDate}</p>}
                                    </div>
                                </div>
                                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Barreaux</span>
                                        <p className="text-xs text-gray-700 font-semibold">🏛️ Principal : {selectedAvocat.mainBar || 'N/A'}</p>
                                        {selectedAvocat.secondaryBar && <p className="text-xs text-gray-700 mt-1">🏛️ Secondaire : {selectedAvocat.secondaryBar}</p>}
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Service</span>
                                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${getServiceStatusClass(selectedAvocat.serviceStatus)}`}>
                                            {selectedAvocat.serviceStatus} (depuis {selectedAvocat.serviceStartDate})
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 sm:pt-5">
                                <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest mb-3">Tâches ({lawyerTasks.length})</h3>
                                {lawyerTasks.length === 0 ? (
                                    <div className="p-4 sm:p-5 text-center bg-gray-50 border border-dashed border-gray-200 rounded-xl text-gray-400 text-xs">
                                        Aucune tâche assignée.
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-40 sm:max-h-48 overflow-y-auto pr-1">
                                        {lawyerTasks.map(t => (
                                            <div key={t.id} className="p-2.5 sm:p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{t.name}</p>
                                                    <p className="text-[10px] text-gray-400">📜 {t.caseId} · {t.dueDate}</p>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap flex-shrink-0 ${
                                                    t.status === 'Effectué' ? 'bg-green-50 text-green-700 border-green-100' : 
                                                    t.status === 'Effectué à moitié' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                    'bg-rose-50 text-rose-700 border-rose-100'
                                                }`}>{t.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-100 flex justify-end">
                                <button onClick={() => setSelectedAvocat(null)} className="bg-slate-100 hover:bg-slate-200 text-gray-800 font-bold py-2 px-4 sm:px-6 rounded-xl transition text-xs sm:text-sm">
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

export default AvocatsPage;
