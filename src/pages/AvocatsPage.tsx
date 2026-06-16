import React, { FC, useState } from 'react';
import PageContainer from '../components/PageContainer';
import AvocatModal from '../components/modals/AvocatModal';
import { Avocat } from '../types';

interface AvocatsPageProps {
  avocats: Avocat[];
  onAddAvocat: (avocat: Omit<Avocat, 'id'>) => Promise<void>;
  onUpdateAvocat: (avocat: Avocat) => Promise<void>;
  onDeleteAvocat: (id: string) => Promise<boolean>;
}

const AvocatsPage: FC<AvocatsPageProps> = ({ avocats, onAddAvocat, onUpdateAvocat, onDeleteAvocat }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [avocatToEdit, setAvocatToEdit] = useState<Avocat | null>(null);

    const openCreateModal = () => {
        setAvocatToEdit(null);
        setIsModalOpen(true);
    };

    const openEditModal = (avocat: Avocat) => {
        setAvocatToEdit(avocat);
        setIsModalOpen(true);
    };

    const handleSave = async (avocatData: Omit<Avocat, 'id'>) => {
        if (avocatToEdit) {
            await onUpdateAvocat({ ...avocatToEdit, ...avocatData });
        } else {
            await onAddAvocat(avocatData);
        }
        setIsModalOpen(false);
        setAvocatToEdit(null);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet avocat ?")) {
            await onDeleteAvocat(id);
        }
    };
    
    const getServiceStatusClass = (status?: string) => {
        switch (status) {
            case 'Actif': return 'bg-green-100 text-green-800 border-green-200';
            case 'Omis': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'En disponibilité': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <>
            <PageContainer title="Avocats" buttonLabel="Ajouter un Avocat" onButtonClick={openCreateModal}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-sm text-gray-600">
                                <th className="p-4 font-semibold">Nom</th>
                                <th className="p-4 font-semibold">Statut Cabinet</th>
                                <th className="p-4 font-semibold">Service</th>
                                <th className="p-4 font-semibold">Barreau Principal</th>
                                <th className="p-4 font-semibold">Téléphone</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {avocats.map(avocat => (
                                <tr key={avocat.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-800">{avocat.fullName}</td>
                                    <td className="p-4 text-gray-600">{avocat.cabinetStatus}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getServiceStatusClass(avocat.serviceStatus)}`}>
                                            {avocat.serviceStatus || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600">{avocat.mainBar || 'N/A'}</td>
                                    <td className="p-4 text-gray-600">{avocat.phone || 'N/A'}</td>
                                    <td className="p-4">
                                        <button onClick={() => openEditModal(avocat)} className="text-indigo-600 hover:underline font-bold text-sm">Gérer</button>
                                        <button onClick={() => handleDelete(avocat.id)} className="ml-4 text-red-500 hover:underline font-bold text-sm">Suppr.</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </PageContainer>
            
            <AvocatModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSave} 
                avocatToEdit={avocatToEdit}
            />
        </>
    );
};

export default AvocatsPage;
