import React, { FC, useState } from 'react';
import PageContainer from '../components/PageContainer';
import CaseModal from '../components/modals/CaseModal';
import { Case, Client, Avocat, Procedure, Task } from '../types';

interface CasesPageProps {
  cases: Case[];
  clients: Client[];
  tasks?: Task[]; 
  onAddCase: (caseData: Omit<Case, 'id'>, procedures: Omit<Procedure, 'id'>[]) => Promise<void>;
  onUpdateCase: (caseData: Case, procedures: Omit<Procedure, 'id'>[]) => Promise<void>;
  onDeleteCase: (id: string) => Promise<boolean>;
  onExport: () => void;
  avocats: Avocat[];
}

const CasesPage: FC<CasesPageProps> = ({ cases, clients, tasks = [], onAddCase, onUpdateCase, onDeleteCase, onExport, avocats }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [caseToEdit, setCaseToEdit] = useState<Case | null>(null);

    const openCreateModal = () => {
        setCaseToEdit(null);
        setIsModalOpen(true);
    };

    const openEditModal = (c: Case) => {
        setCaseToEdit(c);
        setIsModalOpen(true);
    };

    const handleSave = async (caseData: Omit<Case, 'id'>, procedures: Omit<Procedure, 'id'>[]) => {
        if (caseToEdit) {
            await onUpdateCase({ ...caseToEdit, ...caseData }, procedures);
        } else {
            await onAddCase(caseData, procedures);
        }
        setIsModalOpen(false);
        setCaseToEdit(null);
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
                onButtonClick={openCreateModal} 
                exportButtonLabel="Exporter en PDF" 
                onExportClick={onExport}
            >
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
                                        <button onClick={() => openEditModal(c)} className="text-indigo-600 hover:underline font-bold text-sm">Gérer</button>
                                        <button onClick={() => handleDelete(c.id)} className="ml-2 text-red-500 hover:underline font-bold text-sm">Suppr.</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </PageContainer>
            
            <CaseModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSave} 
                clients={clients} 
                avocats={avocats}
                caseToEdit={caseToEdit}
            />
        </>
    );
};

export default CasesPage;
