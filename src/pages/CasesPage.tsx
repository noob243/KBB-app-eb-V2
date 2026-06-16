import React, { FC, useState } from 'react';
import PageContainer from '../components/PageContainer';
import CaseModal from '../components/modals/CaseModal';
import { Case, Client, Avocat, Task } from '../types';

interface CasesPageProps {
  cases: Case[];
  clients: Client[];
  tasks?: Task[];
  onAddCase: (dossier: Omit<Case, 'id'>) => void;
  onExport: () => void;
  avocats: Avocat[];
  onDeleteCase?: (id: string) => void;
  onUpdateCase?: (c: Case) => void;
}

const CasesPage: FC<CasesPageProps> = ({ cases, clients, tasks = [], onAddCase, onExport, avocats, onDeleteCase, onUpdateCase }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);

    const handleSaveCase = (newCase: Omit<Case, 'id' | 'reference'>, tasks?: Omit<Task, 'id'>[]) => {
      const client = clients.find(c => c.id === newCase.clientId);
      if (!client) {
        console.error("Client non trouvé !");
        return;
      }

      // Générer une référence unique
      const clientPrefix = client.name.substring(0, 3).toUpperCase();
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3); // YYYYMMDDHHMMSSsss
      const reference = `${clientPrefix}-${timestamp}`;
      
      const caseWithRef: Omit<Case, 'id'> = {
        ...newCase,
        reference,
      };

      onAddCase(caseWithRef);
    };

    return (
        <>
            <PageContainer title="Dossiers" buttonLabel="Créer un Dossier" onButtonClick={() => setIsAddModalOpen(true)} exportButtonLabel="Exporter en PDF" onExportClick={onExport}>
                {/* Mobile: cards */}
                <div className="sm:hidden space-y-3">
                    {cases.map(c => (
                        <div key={c.id} className="p-4 bg-white border border-gray-200 rounded-xl">
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-gray-800 truncate">{c.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5 truncate">👤 {clients.find(client => client.id === c.clientId)?.name || 'Client inconnu'}</p>
                                    <p className="text-[10px] font-mono text-gray-400 mt-0.5">{c.reference}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap flex-shrink-0 ${
                                    c.status === 'En cours' ? 'bg-blue-50 text-blue-800 border border-blue-150' : 
                                    c.status === 'Clôturé' ? 'bg-green-50 text-green-800 border border-green-150' : 
                                    c.status === 'Nouveau' ? 'bg-purple-50 text-purple-800 border border-purple-150' :
                                    'bg-yellow-50 text-yellow-800 border-yellow-150'}`}>{c.status}</span>
                            </div>
                            <div className="mt-3 flex gap-2">
                                <button 
                                    onClick={() => setSelectedCase(c)}
                                    className="flex-1 text-indigo-600 font-bold text-xs bg-indigo-50 hover:bg-indigo-100 py-2 rounded-xl transition"
                                >
                                    Gérer
                                </button>
                                {onDeleteCase && (
                                    <button 
                                        onClick={() => onDeleteCase(c.id)}
                                        className="px-3 text-red-500 font-bold text-xs bg-red-50 hover:bg-red-100 py-2 rounded-xl transition"
                                    >
                                        Suppr.
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {cases.length === 0 && (
                        <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="font-semibold">Aucun dossier</p>
                        </div>
                    )}
                </div>

                {/* Desktop: table */}
                <div className="hidden sm:block overflow-x-auto">
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
                                    <td className="p-4 font-mono text-xs text-indigo-900 font-bold whitespace-nowrap">{c.reference}</td>
                                    <td className="p-4 font-medium text-gray-800">{c.name}</td>
                                    <td className="p-4 text-gray-600">{clients.find(client => client.id === c.clientId)?.name || 'Client inconnu'}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${
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
                                        {onDeleteCase && (
                                            <button 
                                                onClick={() => onDeleteCase(c.id)}
                                                className="ml-2 text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition"
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
            
            <CaseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleSaveCase} clients={clients} avocats={avocats} cases={cases} />

            {selectedCase && (() => {
                const caseClient = clients.find(client => client.id === selectedCase.clientId);
                const caseTasks = tasks.filter(t => t.caseId && t.caseId.toLowerCase() === selectedCase.id.toLowerCase());
                
                return (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-center items-center p-3 sm:p-4">
                        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto animate-fadeIn m-3 sm:m-0">
                            <div className="flex justify-between items-start mb-4 sm:mb-6 border-b border-gray-100 pb-3 sm:pb-4">
                                <div className="min-w-0 flex-1 pr-2">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="text-2xs font-bold text-indigo-600 font-mono uppercase tracking-widest">{selectedCase.reference}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                                            selectedCase.status === 'En cours' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
                                            selectedCase.status === 'Clôturé' ? 'bg-green-50 text-green-700 border border-green-100' : 
                                            selectedCase.status === 'Nouveau' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 
                                            'bg-amber-50 text-amber-700 border-amber-100'
                                        }`}>
                                            {selectedCase.status}
                                        </span>
                                    </div>
                                    <h2 className="text-lg sm:text-2xl font-extrabold text-gray-850 truncate">{selectedCase.name}</h2>
                                    <p className="text-xs text-gray-500 mt-1">Client : <strong className="font-semibold text-gray-700">{caseClient?.name || 'Client inconnu'}</strong></p>
                                </div>
                                <button 
                                    onClick={() => setSelectedCase(null)} 
                                    className="p-1.5 hover:bg-slate-100 rounded-xl text-gray-400 hover:text-gray-650 transition flex-shrink-0"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4 sm:space-y-6 mb-4 sm:mb-6">
                                <div className="p-3 sm:p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                    <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Prochaine Audience</span>
                                    {selectedCase.nextHearing ? (
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm">📆</span>
                                            <span className="text-sm font-bold text-rose-750">{new Date(selectedCase.nextHearing).toLocaleDateString('fr-FR')}</span>
                                        </div>
                                    ) : (
                                        <p className="text-xs font-semibold text-gray-400 mt-1">Aucune audience programmée</p>
                                    )}
                                </div>

                                <div className="bg-indigo-50/15 border border-indigo-100/50 p-3 sm:p-4 rounded-xl">
                                    <span className="text-[10px] font-black text-[#15447c] uppercase tracking-wider block mb-2">⚖️ Procédures</span>
                                    {/* ... existing procedure rendering ... */}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 sm:pt-5">
                                <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest mb-3">
                                    Tâches ({caseTasks.length})
                                </h3>

                                {caseTasks.length === 0 ? (
                                    <div className="p-4 sm:p-5 text-center bg-gray-50 border border-dashed border-gray-200 rounded-xl text-gray-400 text-xs">
                                        Aucune tâche pour ce dossier.
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-48 sm:max-h-52 overflow-y-auto pr-1">
                                        {caseTasks.map(t => (
                                            <div key={t.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <div>
                                                    <span className="text-xs sm:text-sm font-semibold text-gray-800 block leading-tight">{t.name}</span>
                                                    <span className="text-[10px] text-gray-400 font-medium">👤 {t.lawyerId} • {t.dueDate}</span>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap self-start sm:self-auto ${
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

                            <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-100 flex justify-end">
                                <button 
                                    onClick={() => setSelectedCase(null)} 
                                    className="bg-slate-100 hover:bg-slate-200 text-gray-800 font-bold py-2 px-4 sm:px-6 rounded-xl transition duration-150 text-xs sm:text-sm"
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

export default CasesPage;
