import React, { FC, useState, useEffect } from 'react';
import { Case, Client } from '../../types';

interface CaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dossier: Omit<Case, 'id' | 'reference'>) => void;
  clients: Client[];
}

const CaseModal: FC<CaseModalProps> = ({ isOpen, onClose, onSave, clients }) => {
    const initialFormState = {
        name: '',
        clientId: '',
        status: 'Nouveau' as Case['status'],
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialFormState);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-6">Créer un nouveau dossier</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <input type="text" name="name" placeholder="Nom du dossier" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                        <select name="clientId" value={formData.clientId} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white" required>
                            <option value="" disabled>-- Sélectionner un client --</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                            <option value="Nouveau">Nouveau</option>
                            <option value="En cours">En cours</option>
                            <option value="En attente">En attente</option>
                            <option value="Clôturé">Clôturé</option>
                        </select>
                    </div>
                    <div className="mt-8 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-md">Annuler</button>
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CaseModal;
