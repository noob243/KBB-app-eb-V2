import React, { FC, useState, useEffect } from 'react';
import { Avocat } from '../../types';

interface AvocatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (avocat: Omit<Avocat, 'id'>) => void;
}

const AvocatModal: FC<AvocatModalProps> = ({ isOpen, onClose, onSave }) => {
    const initialFormState = {
        fullName: '',
        emails: [],
        phone: '',
        cabinetStatus: 'Junior' as Avocat['cabinetStatus'],
        serviceStatus: 'Actif' as Avocat['serviceStatus'],
        // Add other simple fields as necessary
    };

    const [formData, setFormData] = useState<Omit<Avocat, 'id'>>(initialFormState);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialFormState);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "email1") {
            const newEmails = [value, formData.emails[1] || '', formData.emails[2] || ''].filter(Boolean);
            setFormData(prev => ({ ...prev, emails: newEmails }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-8 max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-6">Ajouter un Avocat</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="fullName" placeholder="Nom complet" value={formData.fullName} onChange={handleChange} className="w-full p-2 border rounded" required />
                    <input type="email" name="email1" placeholder="Email principal" value={formData.emails[0] || ''} onChange={handleChange} className="w-full p-2 border rounded" required />
                    <input type="tel" name="phone" placeholder="Téléphone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" />
                     <select name="cabinetStatus" value={formData.cabinetStatus} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                        <option value="Senior of counsel">Senior of counsel</option>
                        <option value="Senior">Senior</option>
                        <option value="Associé">Associé</option>
                        <option value="Junior">Junior</option>
                    </select>
                    <select name="serviceStatus" value={formData.serviceStatus} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                        <option value="Actif">Actif</option>
                        <option value="Omis">Omis</option>
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

export default AvocatModal;
