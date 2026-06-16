
import React, { FC, useState, useEffect } from 'react';
import { Fournisseur, Referent } from '../../types';

interface FournisseurModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fournisseur: Omit<Fournisseur, 'id'>) => void;
  fournisseurToEdit?: Fournisseur | null;
}

const FournisseurModal: FC<FournisseurModalProps> = ({ isOpen, onClose, onSave, fournisseurToEdit }) => {
    const initialFormState: Omit<Fournisseur, 'id'> = {
        nomComplet: '',
        designationPrestation: '',
        naturePrestation: 'Services',
        montant: 0,
        typeFacturation: 'Périodique',
        adresseMail: '',
        telephone: '',
        dateDebut: new Date().toISOString().split('T')[0],
        referents: [],
    };

    const [formData, setFormData] = useState<Omit<Fournisseur, 'id'>>(initialFormState);
    const [referents, setReferents] = useState<Omit<Referent, 'id'>[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (fournisseurToEdit) {
                setFormData({
                    ...initialFormState, // Ensure all fields are defined
                    ...fournisseurToEdit,
                    dateDebut: fournisseurToEdit.dateDebut ? new Date(fournisseurToEdit.dateDebut).toISOString().split('T')[0] : initialFormState.dateDebut,
                    referents: fournisseurToEdit.referents || [],
                });
                setReferents(fournisseurToEdit.referents || []);
            } else {
                setFormData(initialFormState);
                setReferents([]);
            }
        }
    }, [isOpen, fournisseurToEdit]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const newValue = type === 'number' ? parseFloat(value) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleReferentChange = (index: number, field: keyof Omit<Referent, 'id'>, value: string) => {
        const newReferents = [...referents];
        newReferents[index] = { ...newReferents[index], [field]: value };
        setReferents(newReferents);
    };

    const addReferent = () => {
        setReferents([...referents, { nom: '', email: '', telephone: '' }]);
    };

    const removeReferent = (index: number) => {
        setReferents(referents.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, referents });
        onClose(); // <-- The fix is here
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[95vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">{fournisseurToEdit ? 'Modifier le fournisseur' : 'Ajouter un nouveau fournisseur'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="text" name="nomComplet" placeholder="Nom complet" value={formData.nomComplet} onChange={handleChange} className="w-full p-2 border rounded" required />
                        <input type="text" name="designationPrestation" placeholder="Désignation de la prestation" value={formData.designationPrestation} onChange={handleChange} className="w-full p-2 border rounded" required />
                        <select name="naturePrestation" value={formData.naturePrestation} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                            <option value="Services">Services</option>
                            <option value="Bien">Bien</option>
                        </select>
                        <input type="number" name="montant" placeholder="Montant (€)" value={formData.montant} onChange={handleChange} className="w-full p-2 border rounded" />
                        <select name="typeFacturation" value={formData.typeFacturation} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                            <option value="Périodique">Périodique</option>
                            <option value="Ponctuelle">Ponctuelle</option>
                        </select>
                        <input type="email" name="adresseMail" placeholder="Adresse mail" value={formData.adresseMail} onChange={handleChange} className="w-full p-2 border rounded" />
                        <input type="tel" name="telephone" placeholder="Téléphone" value={formData.telephone} onChange={handleChange} className="w-full p-2 border rounded" />
                        <input type="date" name="dateDebut" value={formData.dateDebut} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>

                    {/* Referents Section */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-3">Référents</h3>
                        {referents.map((referent, index) => (
                            <div key={index} className="grid grid-cols-3 gap-3 p-3 mb-3 border rounded-md">
                                <input type="text" placeholder="Nom du référent" value={referent.nom} onChange={(e) => handleReferentChange(index, 'nom', e.target.value)} className="p-2 border rounded" />
                                <input type="email" placeholder="Email du référent" value={referent.email} onChange={(e) => handleReferentChange(index, 'email', e.target.value)} className="p-2 border rounded" />
                                <div className="flex items-center">
                                    <input type="tel" placeholder="Téléphone du référent" value={referent.telephone} onChange={(e) => handleReferentChange(index, 'telephone', e.target.value)} className="p-2 border rounded flex-grow" />
                                    <button type="button" onClick={() => removeReferent(index)} className="ml-2 text-red-500 hover:text-red-700 font-semibold">X</button>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addReferent} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-200">+ Ajouter un référent</button>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Annuler</button>
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">{fournisseurToEdit ? 'Mettre à jour' : 'Enregistrer'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FournisseurModal;
