import React, { FC, useState, useEffect } from 'react';
import { Personnel } from '../../types';

interface PersonnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (personnel: Omit<Personnel, 'id'>) => void;
}

const PersonnelModal: FC<PersonnelModalProps> = ({ isOpen, onClose, onSave }) => {
    const initialFormState = {
        fullName: '',
        email: '',
        phone: '',
        role: 'Secrétaire',
        serviceStatus: 'Actif' as const,
        salary: 0,
        address: '',
        // Add other necessary fields, keeping it simple
    };

    const [formData, setFormData] = useState<Omit<Personnel, 'id'>>(initialFormState);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialFormState);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newValue = name === 'salary' ? parseFloat(value) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-8 max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-6">Ajouter un Personnel</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="fullName" placeholder="Nom complet" value={formData.fullName} onChange={handleChange} className="w-full p-2 border rounded" required />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
                    <input type="tel" name="phone" placeholder="Téléphone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" />
                    <input type="text" name="role" placeholder="Rôle" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded" required />
                    <input type="number" name="salary" placeholder="Salaire" value={formData.salary} onChange={handleChange} className="w-full p-2 border rounded" />
                    <textarea name="address" placeholder="Adresse" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded" />
                    <select name="serviceStatus" value={formData.serviceStatus} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                        <option value="Actif">Actif</option>
                        <option value="Inactif">Inactif</option>
                        <option value="Mise en disponibilité">Mise en disponibilité</option>
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

export default PersonnelModal;
