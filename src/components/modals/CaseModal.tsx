
import React, { FC, useState, useEffect } from 'react';
import { Case, Client } from '../../types';

interface CaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dossier: Omit<Case, 'id' | 'reference'>) => void;
  clients: Client[];
}

const CaseModal: FC<CaseModalProps> = ({ isOpen, onClose, onSave, clients }) => {
    const today = new Date().toISOString().split('T')[0];

    const initialFormState: Omit<Case, 'id' | 'reference' | 'client' | 'procedures' | 'tasks'> = {
        name: '',
        clientId: '',
        date: today,
        status: 'Nouveau',
        type: 'Contentieux',
        description: '',
        procedure: '',
        lawyer: '',
        conclusion: '',
        fee: 0,
        archived: false,
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialFormState);
        }
    }, [isOpen, initialFormState]);


    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        // Handle different input types
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                    type === 'number' ? parseFloat(value) : 
                    value;

        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose(); // <-- The fix is here and preserved
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl w-full max-h-[95vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">Créer un nouveau dossier</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        
                        {/* Name */}
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom du dossier</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" required />
                        </div>

                        {/* Client */}
                        <div>
                            <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">Client</label>
                            <select name="clientId" id="clientId" value={formData.clientId} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white" required>
                                <option value="" disabled>-- Sélectionner un client --</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        {/* Lawyer */}
                        <div>
                            <label htmlFor="lawyer" className="block text-sm font-medium text-gray-700">Avocat en charge</label>
                            <input type="text" name="lawyer" id="lawyer" value={formData.lawyer} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                        </div>

                        {/* Date */}
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date de création</label>
                            <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        
                        {/* Status */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Statut</label>
                            <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white">
                                <option value="Nouveau">Nouveau</option>
                                <option value="En cours">En cours</option>
                                <option value="En attente">En attente</option>
                                <option value="Clôturé">Clôturé</option>
                            </select>
                        </div>
                        
                        {/* Type */}
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type de dossier</label>
                            <select name="type" id="type" value={formData.type} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white">
                                <option value="Contentieux">Contentieux</option>
                                <option value="Conseil">Conseil</option>
                                <option value="Autre">Autre</option>
                            </select>
                        </div>
                        
                        {/* Fee */}
                        <div>
                            <label htmlFor="fee" className="block text-sm font-medium text-gray-700">Honoraires (€)</label>
                            <input type="number" name="fee" id="fee" value={formData.fee} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 w-full p-2 border border-gray-300 rounded-md"></textarea>
                        </div>

                        {/* Procedure */}
                        <div className="md:col-span-2">
                            <label htmlFor="procedure" className="block text-sm font-medium text-gray-700">Procédure</label>
                            <textarea name="procedure" id="procedure" value={formData.procedure} onChange={handleChange} rows={3} className="mt-1 w-full p-2 border border-gray-300 rounded-md"></textarea>
                        </div>

                        {/* Conclusion */}
                        <div className="md:col-span-2">
                            <label htmlFor="conclusion" className="block text-sm font-medium text-gray-700">Conclusion</label>
                            <textarea name="conclusion" id="conclusion" value={formData.conclusion} onChange={handleChange} rows={3} className="mt-1 w-full p-2 border border-gray-300 rounded-md"></textarea>
                        </div>

                    </div>
                    
                    <div className="mt-8 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300">Annuler</button>
                        <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CaseModal;
