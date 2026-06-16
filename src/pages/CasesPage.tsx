import React, { FC, useState } from 'react';
import PageContainer from '../components/PageContainer';
import CaseModal from '../components/modals/CaseModal';
import { Case, Client, Avocat, Task } from '../types';

interface CasesPageProps {
  cases: Case[];
  clients: Client[];
  tasks?: Task[];
  onAddCase: (dossier: Omit<Case, 'id' | 'reference'>) => Promise<Case | null>;
  onExport: () => void;
  avocats: Avocat[];
  onDeleteCase: (id: string) => Promise<boolean>;
  onUpdateCase: (c: Case) => Promise<Case | null>;
}

const CasesPage: FC<CasesPageProps> = ({ cases, clients, tasks = [], onAddCase, onExport, avocats, onDeleteCase, onUpdateCase }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);

    const handleSave = async (caseData: Omit<Case, 'id'>) => {
        const client = clients.find(c => c.id === caseData.clientId);
        if (!client) {
            console.error("Client not found!");
            return;
        }
        const reference = `${client.name.substring(0, 3).toUpperCase()}-${Date.now()}`;
        const newCase = { ...caseData, reference };
        
        const result = await onAddCase(newCase);
        if (result) {
            setIsAddModalOpen(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce dossier ?")) {
            await onDeleteCase(id);
        }
    };

    return (
        <>
            <PageContainer 
                title="Dossiers" 
                buttonLabel="Créer un Dossier" 
                onButtonClick={() => setIsAddModalOpen(true)} 
                exportButtonLabel="Exporter en PDF" 
                onExportClick={onExport}
            >
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
                                        <button onClick={() => setSelectedCase(c)} className="text-indigo-600 hover:underline font-bold text-sm">Gérer</button>
                                        <button onClick={() => handleDelete(c.id)} className="ml-2 text-red-500 hover:underline font-bold text-sm">Suppr.</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </PageContainer>
            
            <CaseModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onSave={handleSave} 
                clients={clients} 
            />

            {/* View/Edit Modal can be a separate component or implemented here */}
            {selectedCase && (
                 <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                        <h2 className="text-xl font-bold mb-4">Gérer le dossier</h2>
                        <p><strong>Nom:</strong> {selectedCase.name}</p>
                        <p><strong>Client:</strong> {clients.find(client => client.id === selectedCase.clientId)?.name || 'Inconnu'}</p>
                        <p><strong>Statut:</strong> {selectedCase.status}</p>
                        {/* Add form here to update case details */}
                        <button onClick={() => setSelectedCase(null)} className="mt-4 bg-gray-200 px-4 py-2 rounded">Fermer</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default CasesPage;
