
import React, { FC, useState } from 'react';
import PageContainer from '../components/PageContainer';
import CaseModal from '../components/modals/CaseModal';
import { Case, Client, Avocat, Task } from '../types';

interface CasesPageProps {
  cases: Case[];
  clients: Client[];
  tasks?: Task[]; // Made optional for compatibility
  onAddCase: (dossier: Case, tasks?: Omit<Task, 'id'>[]) => void;
  onExport: () => void;
  avocats: Avocat[];
}

const CasesPage: FC<CasesPageProps> = ({ cases, clients, tasks = [], onAddCase, onExport, avocats }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);

    return (
        <>
            <PageContainer title="Dossiers" buttonLabel="Créer un Dossier" onButtonClick={() => setIsAddModalOpen(true)} exportButtonLabel="Exporter en PDF" onExportClick={onExport}>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-sm text-gray-600">
                                <th className="p-4 font-semibold">Référence</th>
                                <th className="p-4 font-semibold">Nom du Dossier</th>
                                <th className="p-4 font-semibold">Client</th>
                                <th className="p-4 font-semibold">Statut</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cases.map(c => (
                                <tr key={c.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-4 font-mono text-xs text-indigo-900 font-bold">{c.id}</td>
                                    <td className="p-4 font-medium text-gray-800">{c.name}</td>
                                    <td className="p-4 text-gray-600">{c.client}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                            c.status === 'En cours' ? 'bg-blue-50 text-blue-800 border-blue-150' : 
                                            c.status === 'Clôturé' ? 'bg-green-50 text-green-800 border-green-150' : 
                                            c.status === 'Nouveau' ? 'bg-purple-50 text-purple-800 border-purple-150' :
                                            'bg-yellow-50 text-yellow-800 border-yellow-150'}`}>{c.status}</span>
                                    </td>
                                    <td className="p-4">
                                        <button 
                                            onClick={() => setSelectedCase(c)}
                                            className="text-indigo-600 hover:text-indigo-850 hover:underline font-bold text-sm bg-indigo-50 hover:bg-indigo-100/60 px-3 py-1.5 rounded-xl transition duration-150"
                                        >
                                            Gérer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </PageContainer>
            
            <CaseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={onAddCase} clients={clients} avocats={avocats} cases={cases} />

            {/* Case Details / Management Modal */}
            {selectedCase && (() => {
                const caseTasks = tasks.filter(t => t.caseId.toLowerCase() === selectedCase.id.toLowerCase());
                
                return (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-center items-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-2xs font-bold text-indigo-600 font-mono uppercase tracking-widest">{selectedCase.id}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                            selectedCase.status === 'En cours' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
                                            selectedCase.status === 'Clôturé' ? 'bg-green-50 text-green-700 border border-green-100' : 
                                            selectedCase.status === 'Nouveau' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 
                                            'bg-amber-50 text-amber-700 border border-amber-100'
                                        }`}>
                                            {selectedCase.status}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-extrabold text-gray-850">{selectedCase.name}</h2>
                                    <p className="text-xs text-gray-500 mt-1">Client : <strong className="font-semibold text-gray-700">{selectedCase.client}</strong></p>
                                </div>
                                <button 
                                    onClick={() => setSelectedCase(null)} 
                                    className="p-1.5 hover:bg-slate-100 rounded-xl text-gray-400 hover:text-gray-650 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Procedure / Hearing Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl md:col-span-2">
                                    <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Prochaine Audience d'étape</span>
                                    {selectedCase.nextHearing ? (
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm">📆</span>
                                            <span className="text-sm font-bold text-rose-750">{selectedCase.nextHearing}</span>
                                        </div>
                                    ) : (
                                        <p className="text-xs font-semibold text-gray-400 mt-1">Aucune audience programmée</p>
                                    )}
                                </div>

                                <div className="md:col-span-2 space-y-3 bg-indigo-50/15 border border-indigo-100/50 p-4 rounded-xl">
                                    <span className="text-[10px] font-black text-[#15447c] uppercase tracking-wider block mb-2">⚖️ Procédures du Dossier</span>
                                    {!selectedCase.procedures || selectedCase.procedures.length === 0 ? (
                                        <div className="p-3 bg-white border border-slate-150 rounded-lg text-xs">
                                            <p className="font-bold text-gray-800">{selectedCase.procedure || "Procédure d'Arbitrage Standard"}</p>
                                            <p className="text-3xs text-gray-500 font-bold uppercase mt-1">
                                                Instance: {selectedCase.procedureInstance || "Tribunal"} • Objet: {selectedCase.procedureObjet || "N/A"}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                            {selectedCase.procedures.map(p => (
                                                <div key={p.id} className="p-3 bg-white border border-slate-150 rounded-xl flex items-start justify-between gap-4 shadow-3xs">
                                                    <div>
                                                        <p className="text-xs font-black text-slate-800 leading-tight">{p.name}</p>
                                                        <p className="text-[10px] text-gray-500 font-semibold mt-1">
                                                            Instance : <strong className="text-gray-700">{p.instance || 'Non précisée'}</strong> • Objet : <strong className="text-gray-700">{p.objet || 'Non défini'}</strong>
                                                        </p>
                                                        <p className="text-3xs text-slate-400 font-bold uppercase mt-0.5">Introduit le : {p.dateDebut || 'Non défini'} • Fin le : {p.dateFin || 'Non défini'}</p>
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded text-3xs font-bold uppercase tracking-wider border shrink-0 ${
                                                        p.status === 'En cours' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                        p.status === 'Clôturé' ? 'bg-green-50 text-green-700 border-green-100' :
                                                        'bg-amber-50 text-amber-700 border-amber-100'
                                                    }`}>
                                                        {p.status || 'En cours'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Associated Tasks */}
                            <div className="border-t border-gray-100 pt-5">
                                <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest mb-3">
                                    Tâches et Délais associés ({caseTasks.length})
                                </h3>

                                {caseTasks.length === 0 ? (
                                    <div className="p-5 text-center bg-gray-50 border border-dashed border-gray-200 rounded-xl text-gray-400 text-xs">
                                        Aucune tâche ouverte ou en retard signalée pour ce dossier.
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                                        {caseTasks.map(t => (
                                            <div key={t.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-100/50 transition">
                                                <div>
                                                    <span className="text-sm font-semibold text-gray-800 block leading-tight">{t.name}</span>
                                                    <span className="text-[10px] text-gray-400 font-medium">Responsable : {t.lawyer} • Échéance : {t.dueDate}</span>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                                    t.status === 'Effectué' ? 'bg-green-50 text-green-700 border-green-100' : 
                                                    t.status === 'Effectué à moitié' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                    'bg-rose-50 text-rose-700 border-rose-100'
                                                }`}>
                                                    {t.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Action Operations */}
                            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
                                <div className="text-2xs text-gray-400">
                                    Propriété exclusive de Cabinet KBB SARL
                                </div>
                                <button 
                                    onClick={() => setSelectedCase(null)} 
                                    className="bg-slate-100 hover:bg-slate-200 text-gray-800 font-bold py-2 px-6 rounded-xl transition duration-150 text-sm"
                                >
                                    Fermer le dossier
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </>
    );
};

export default CasesPage;
