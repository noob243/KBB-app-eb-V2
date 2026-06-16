
import React, { FC, useState, useEffect } from 'react';
import { Avocat } from '../../types';

interface AvocatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (avocat: Omit<Avocat, 'id'>) => void;
  avocatToEdit?: Avocat | null;
}

const AvocatModal: FC<AvocatModalProps> = ({ isOpen, onClose, onSave, avocatToEdit }) => {
    const initialFormState: Omit<Avocat, 'id'> = {
        fullName: '',
        emails: ['', '', ''],
        phone: '',
        address: '',
        cabinetStatus: 'Junior',
        serviceStatus: 'Actif',
        specialization: '',
        barreau: '',
        caseCount: 0,
    };

    const [formData, setFormData] = useState<Omit<Avocat, 'id'>>(initialFormState);

    useEffect(() => {
        if (isOpen) {
            if (avocatToEdit) {
                // Pre-fill form for editing
                setFormData({
                    ...initialFormState,
                    ...avocatToEdit,
                    emails: [
                        avocatToEdit.emails?.[0] || '',
                        avocatToEdit.emails?.[1] || '',
                        avocatToEdit.emails?.[2] || '',
                    ],
                });
            } else {
                // Reset to blank form for new entry
                setFormData(initialFormState);
            }
        }
    }, [isOpen, avocatToEdit]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEmailChange = (index: number, value: string) => {
        const newEmails = [...formData.emails];
        newEmails[index] = value;
        setFormData(prev => ({ ...prev, emails: newEmails as [string, string, string] }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            emails: formData.emails.filter(email => email.trim() !== '') as [string, string, string],
        };
        onSave(dataToSave);
        onClose(); // The important fix
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl w-full max-h-[95vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{avocatToEdit ? 'Modifier l\'avocat' : 'Ajouter un nouvel avocat'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Nom complet <span className="text-red-500">*</span></label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm" required />
                        </div>

                        {/* Email 1 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email principal <span className="text-red-500">*</span></label>
                            <input type="email" value={formData.emails[0]} onChange={e => handleEmailChange(0, e.target.value)} className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm" required />
                        </div>
                        
                        {/* Email 2 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email secondaire</label>
                            <input type="email" value={formData.emails[1]} onChange={e => handleEmailChange(1, e.target.value)} className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm" />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm" />
                        </div>

                        {/* Barreau */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Barreau</label>
                            <input type="text" name="barreau" value={formData.barreau} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm" />
                        </div>
                        
                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Adresse</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm"></textarea>
                        </div>
                        
                        {/* Cabinet Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Statut au cabinet</label>
                            <select name="cabinetStatus" value={formData.cabinetStatus} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm bg-white">
                                <option value="Senior of counsel">Senior of counsel</option>
                                <option value="Senior">Senior</option>
                                <option value="Associé">Associé</option>
                                <option value="Junior">Junior</option>
                            </select>
                        </div>

                        {/* Service Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Statut de service</label>
                            <select name="serviceStatus" value={formData.serviceStatus} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm bg-white">
                                <option value="Actif">Actif</option>
                                <option value="Omis">Omis</option>
                                <option value="Mise en disponibilité">Mise en disponibilité</option>
                            </select>
                        </div>
                        
                        {/* Specialization */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Domaine de spécialisation</label>
                            <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm" />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition duration-300">Annuler</button>
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-sm">{avocatToEdit ? 'Mettre à jour' : 'Enregistrer'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AvocatModal;
