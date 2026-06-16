import React, { FC, useState } from 'react';
import PageContainer from '../components/PageContainer';
import AvocatModal from '../components/modals/AvocatModal';
import { Avocat, Task } from '../types';

interface AvocatsPageProps {
  avocats: Avocat[];
  tasks?: Task[];
  onAddAvocat: (avocat: Omit<Avocat, 'id'>) => Promise<Avocat | null>;
  onDeleteAvocat: (id: string) => Promise<boolean>;
  onUpdateAvocat: (avocat: Avocat) => Promise<Avocat | null>;

}

const AvocatsPage: FC<AvocatsPageProps> = ({ avocats, tasks = [], onAddAvocat, onDeleteAvocat, onUpdateAvocat }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedAvocat, setSelectedAvocat] = useState<Avocat | null>(null);
    
    const handleSave = async (avocatData: Omit<Avocat, 'id'>) => {
        const result = await onAddAvocat(avocatData);
        if (result) {
            setIsAddModalOpen(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet avocat ?")) {
            await onDeleteAvocat(id);
        }
    };

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
                                        <button onClick={() => setSelectedAvocat(avocat)} className="text-indigo-600 font-bold text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition">Voir</button>
                                        <button onClick={() => handleDelete(avocat.id)} className="ml-2 text-red-500 font-bold text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition">Suppr.</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </PageContainer>
            
            <AvocatModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleSave} />

            {selectedAvocat && (
                // Details Modal JSX remains the same
                 <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                        <h2 className="text-xl font-bold mb-4">Détails de l'avocat</h2>
                        <p><strong>Nom:</strong> {selectedAvocat.fullName}</p>
                        <p><strong>Email:</strong> {selectedAvocat.emails.join(', ')}</p>
                        <p><strong>Téléphone:</strong> {selectedAvocat.phone}</p>
                        <button onClick={() => setSelectedAvocat(null)} className="mt-4 bg-gray-200 px-4 py-2 rounded">Fermer</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AvocatsPage;
