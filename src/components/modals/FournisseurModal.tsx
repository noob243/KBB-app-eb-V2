import React, { FC, useState, useEffect } from 'react';
import { Fournisseur, Referent } from '../../types';

interface FournisseurModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fournisseur: Omit<Fournisseur, 'id'>) => void;
}

const FournisseurModal: FC<FournisseurModalProps> = ({ isOpen, onClose, onSave }) => {
    const initialFormState = {
        nomComplet: '',
        designationPrestation: '',
        montant: 0,
        adresseMail: '',
        naturePrestation: 'Services' as 'Bien' | 'Services',
        typeFacturation: 'Périodique' as 'Périodique' | 'Ponctuelle',
    };

    const [formData, setFormData] = useState<Omit<Fournisseur, 'id'>>(initialFormState);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialFormState);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newValue = name === 'montant' ? parseFloat(value) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-8 max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-6">Ajouter un Fournisseur</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="nomComplet" placeholder="Nom complet" value={formData.nomComplet} onChange={handleChange} className="w-full p-2 border rounded" required />
                    <input type="text" name="designationPrestation" placeholder="Désignation de la prestation" value={formData.designationPrestation} onChange={handleChange} className="w-full p-2 border rounded" required />
                    <input type="number" name="montant" placeholder="Montant" value={formData.montant} onChange={handleChange} className="w-full p-2 border rounded" />
                    <input type="email" name="adresseMail" placeholder="Adresse mail" value={formData.adresseMail} onChange={handleChange} className="w-full p-2 border rounded" />
                     <select name="naturePrestation" value={formData.naturePrestation} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                        <option value="Services">Services</option>
                        <option value="Bien">Bien</option>
                    </select>
                    <select name="typeFacturation" value={formData.typeFacturation} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                        <option value="Périodique">Périodique</option>
                        <option value="Ponctuelle">Ponctuelle</option>
                    </select>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Annuler</button>
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FournisseurModal;
