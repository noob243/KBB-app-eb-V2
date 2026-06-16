import React, { FC, useState } from 'react';
import PageContainer from '../components/PageContainer';
import FournisseurModal from '../components/modals/FournisseurModal';
import { Fournisseur } from '../types';

interface FournisseursPageProps {
  fournisseurs: Fournisseur[];
  onAddFournisseur: (fournisseur: Omit<Fournisseur, 'id'>) => Promise<void>;
  onUpdateFournisseur: (fournisseur: Fournisseur) => Promise<void>;
  onDeleteFournisseur: (id: string) => Promise<boolean>;
}

const FournisseursPage: FC<FournisseursPageProps> = ({ fournisseurs, onAddFournisseur, onUpdateFournisseur, onDeleteFournisseur }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fournisseurToEdit, setFournisseurToEdit] = useState<Fournisseur | null>(null);
    const [selectedFournisseur, setSelectedFournisseur] = useState<Fournisseur | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const openCreateModal = () => {
        setFournisseurToEdit(null);
        setIsModalOpen(true);
    };

    const openEditModal = (fournisseur: Fournisseur) => {
        setFournisseurToEdit(fournisseur);
        setIsModalOpen(true);
    };

    const handleSave = async (fournisseurData: Omit<Fournisseur, 'id'>) => {
        if (fournisseurToEdit) {
            await onUpdateFournisseur({ ...fournisseurToEdit, ...fournisseurData });
        } else {
            await onAddFournisseur(fournisseurData);
        }
        setIsModalOpen(false);
        setFournisseurToEdit(null);
        // Keep the selected item in the detail view if it was an edit
        if (fournisseurToEdit) {
          const updatedFournisseur = fournisseurs.find(f => f.id === fournisseurToEdit.id);
          if(updatedFournisseur) setSelectedFournisseur(updatedFournisseur);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fournisseur ?")) {
            await onDeleteFournisseur(id);
            if (selectedFournisseur?.id === id) {
                setSelectedFournisseur(null);
            }
        }
    };

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    const getNatureClass = (nature: 'Bien' | 'Services') => nature === 'Services' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-cyan-100 text-cyan-800 border-cyan-200';
    const getBillingTypeClass = (type: 'Périodique' | 'Ponctuelle') => type === 'Périodique' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800';

    const filtered = (fournisseurs || []).filter(f => 
        f.nomComplet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.designationPrestation.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Close detail panel if the selected item is no longer in the list
    if (selectedFournisseur && !filtered.find(f => f.id === selectedFournisseur.id)) {
        setSelectedFournisseur(null);
    }

    return (
        <>
            <PageContainer title="Fournisseurs du Cabinet" buttonLabel="+ Ajouter" onButtonClick={openCreateModal}>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                    <div className="xl:col-span-2 bg-white rounded-lg border shadow-sm p-4">
                      <input 
                          type="text" 
                          placeholder="Rechercher un fournisseur..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full text-sm focus:outline-none bg-transparent mb-4"
                      />
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-y">
                                    <tr className="text-xs text-gray-500 uppercase">
                                        <th className="p-3 font-semibold">Prestataire</th>
                                        <th className="p-3 font-semibold">Prestation</th>
                                        <th className="p-3 font-semibold">Tarif</th>
                                        <th className="p-3 text-right font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(f => (
                                        <tr 
                                            key={f.id} 
                                            className={`border-b hover:bg-gray-50 transition cursor-pointer ${selectedFournisseur?.id === f.id ? 'bg-indigo-50' : ''}`}
                                            onClick={() => setSelectedFournisseur(f)}
                                        >
                                            <td className="p-3 text-sm font-medium">{f.nomComplet}</td>
                                            <td className="p-3 text-sm text-gray-600 truncate max-w-xs">{f.designationPrestation}</td>
                                            <td className="p-3 text-sm font-mono">{formatCurrency(f.montant)}</td>
                                            <td className="p-3 text-right" onClick={e => e.stopPropagation()}>
                                                <button onClick={() => openEditModal(f)} className="text-indigo-600 text-xs font-bold">Éditer</button>
                                                <button onClick={() => handleDelete(f.id)} className="ml-3 text-red-500 text-xs font-bold">Suppr.</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border shadow-sm p-5 min-h-[450px]">
                        {selectedFournisseur ? (
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{selectedFournisseur.nomComplet}</h3>
                                <p className="text-sm text-gray-500 mb-4">{selectedFournisseur.designationPrestation}</p>
                                {/* More details here */}
                                <button 
                                  onClick={() => openEditModal(selectedFournisseur)} 
                                  className="w-full mt-4 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition">
                                    Modifier le Fournisseur
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-gray-500">Sélectionnez un fournisseur pour voir les détails.</p>
                            </div>
                        )}
                    </div>
                </div>
            </PageContainer>

            <FournisseurModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSave} 
                fournisseurToEdit={fournisseurToEdit}
            />
        </>
    );
};

export default FournisseursPage;
