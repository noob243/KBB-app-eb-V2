
import React, { FC, useState, useEffect } from 'react';
import { Avocat } from '../../types';

interface AvocatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (avocat: Avocat) => void;
}

const AvocatModal: FC<AvocatModalProps> = ({ isOpen, onClose, onSave }) => {
    const today = new Date().toISOString().split('T')[0];
    const initialFormState = {
        fullName: '', avocatId: '', photo: null, firstOathDate: '', secondOathDate: '',
        onaNumber: '', cabinetStatus: 'Junior', serviceStartDate: today,
        serviceStatus: 'Actif', cabinetRole: '', phone: '', email1: '', email2: '', email3: '',
        disciplinaryMeasures: '',
        mainBar: 'Kinshasa-Gombe',
        secondaryBar: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (formData.fullName) {
            const initials = formData.fullName.split(' ').map(n => n[0]).join('');
            const generatedId = `${initials.toUpperCase()}-${Date.now().toString().slice(-4)}`;
            setFormData(prev => ({ ...prev, avocatId: generatedId }));
        } else {
            setFormData(prev => ({ ...prev, avocatId: '' }));
        }
    }, [formData.fullName]);
    
    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData(prev => ({ ...prev, photo: e.target.files[0] }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const emails = [formData.email1, formData.email2, formData.email3].filter(Boolean);
        const newAvocat: Avocat = {
          id: formData.avocatId,
          fullName: formData.fullName,
          photo: formData.photo,
          firstOathDate: formData.firstOathDate,
          secondOathDate: formData.secondOathDate,
          onaNumber: formData.onaNumber,
          cabinetStatus: formData.cabinetStatus as 'Senior of counsel' | 'Senior' | 'Associé' | 'Junior',
          serviceStartDate: formData.serviceStartDate,
          serviceStatus: formData.serviceStatus as 'Actif' | 'Omis' | 'Mise en disponibilité',
          cabinetRole: formData.cabinetRole,
          phone: formData.phone,
          emails: emails,
          disciplinaryMeasures: formData.disciplinaryMeasures,
          mainBar: formData.mainBar as any,
          secondaryBar: formData.secondaryBar
        };
        onSave(newAvocat);
        setFormData(initialFormState);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Ajouter un nouvel avocat</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Column 1 */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Noms complets <span className="text-red-500">*</span></label>
                                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ID Avocat (auto)</label>
                                <input type="text" name="avocatId" value={formData.avocatId} className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100" readOnly />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                                <input type="file" name="photo" onChange={handleFileChange} accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date de la première prestation serment</label>
                                <input type="date" name="firstOathDate" value={formData.firstOathDate} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date de la deuxième prestation serment</label>
                                <input type="date" name="secondOathDate" value={formData.secondOathDate} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro ONA</label>
                                <input type="text" name="onaNumber" value={formData.onaNumber} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Barreau principal</label>
                                <select name="mainBar" value={formData.mainBar} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white">
                                    <option value="Kinshasa-Gombe">Kinshasa-Gombe</option>
                                    <option value="Kinshasa-Matete">Kinshasa-Matete</option>
                                    <option value="Lualaba">Lualaba</option>
                                    <option value="Haut Katanga">Haut Katanga</option>
                                    <option value="Kwilu">Kwilu</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Barreau secondaire</label>
                                <input type="text" name="secondaryBar" value={formData.secondaryBar} onChange={handleChange} placeholder="Zone de texte libre" className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white" />
                            </div>
                        </div>
                        {/* Column 2 */}
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Statut au cabinet</label>
                                <select name="cabinetStatus" value={formData.cabinetStatus} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white">
                                    <option value="Senior of counsel">Senior of counsel</option>
                                    <option value="Senior">Senior</option>
                                    <option value="Associé">Associé</option>
                                    <option value="Junior">Junior</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date de début de service au cabinet</label>
                                <input type="date" name="serviceStartDate" value={formData.serviceStartDate} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Statut de service</label>
                                 <select name="serviceStatus" value={formData.serviceStatus} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white">
                                    <option value="Actif">Actif</option>
                                    <option value="Omis">Omis</option>
                                    <option value="Mise en disponibilité">Mise en disponibilité</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fonction au cabinet</label>
                                <input type="text" name="cabinetRole" value={formData.cabinetRole} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">E-mails</label>
                                <input type="email" name="email1" placeholder="E-mail principal" value={formData.email1} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-2" />
                                <input type="email" name="email2" placeholder="E-mail secondaire (optionnel)" value={formData.email2} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-2" />
                                <input type="email" name="email3" placeholder="Autre e-mail (optionnel)" value={formData.email3} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                        </div>
                         {/* Full-width field */}
                        <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-gray-700 mb-1">Mesures disciplinaires à l'actif de l'avocat</label>
                             <textarea name="disciplinaryMeasures" value={formData.disciplinaryMeasures} onChange={handleChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition duration-300">Annuler</button>
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-sm">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AvocatModal;
