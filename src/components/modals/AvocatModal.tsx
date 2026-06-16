
import React, { FC, useState, useEffect } from 'react';
import { Avocat, BankAccount } from '../../types';

interface AvocatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (avocat: Omit<Avocat, 'id'>) => void;
  avocatToEdit?: Avocat | null;
}

const AvocatModal: FC<AvocatModalProps> = ({ isOpen, onClose, onSave, avocatToEdit }) => {
    const initialFormState: Omit<Avocat, 'id'> = {
        fullName: '',
        photo: null,
        firstOathDate: '',
        secondOathDate: '',
        onaNumber: '',
        cabinetStatus: 'Junior',
        serviceStartDate: '',
        serviceStatus: 'Actif',
        cabinetRole: '',
        phone: '',
        emails: [''],
        disciplinaryMeasures: '',
        mainBar: '',
        secondaryBar: '',
        maritalStatus: 'Célibataire',
        physicalAddress: '',
        hasChildren: 'Non',
        childrenCount: 0,
        bankAccounts: [],
    };

    const [formData, setFormData] = useState<Omit<Avocat, 'id'>>(initialFormState);

    useEffect(() => {
        if (isOpen) {
            if (avocatToEdit) {
                setFormData({
                    ...initialFormState, // Important to start from a full model
                    ...avocatToEdit,
                    emails: avocatToEdit.emails?.length ? avocatToEdit.emails : [''],
                    bankAccounts: avocatToEdit.bankAccounts || [],
                });
            } else {
                setFormData(initialFormState);
            }
        }
    }, [isOpen, avocatToEdit]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? parseInt(value, 10) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleEmailChange = (index: number, value: string) => {
        const newEmails = [...(formData.emails || [])];
        newEmails[index] = value;
        setFormData(prev => ({ ...prev, emails: newEmails }));
    };

    const addEmail = () => setFormData(prev => ({ ...prev, emails: [...(prev.emails || []), ''] }));
    const removeEmail = (index: number) => setFormData(prev => ({ ...prev, emails: (prev.emails || []).filter((_, i) => i !== index) }));

    const handleBankAccountChange = (index: number, field: keyof BankAccount, value: string) => {
        const newBankAccounts = [...(formData.bankAccounts || [])];
        newBankAccounts[index] = { ...newBankAccounts[index], [field]: value };
        setFormData(prev => ({ ...prev, bankAccounts: newBankAccounts }));
    };

    const addBankAccount = () => setFormData(prev => ({ ...prev, bankAccounts: [...(prev.bankAccounts || []), { bankName: '', accountNumber: '' }] }));
    const removeBankAccount = (index: number) => setFormData(prev => ({ ...prev, bankAccounts: (prev.bankAccounts || []).filter((_, i) => i !== index) }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            emails: (formData.emails || []).filter(email => email && email.trim() !== ''),
            bankAccounts: (formData.bankAccounts || []).filter(acc => acc.bankName && acc.accountNumber),
        };
        onSave(finalData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl w-full max-h-[95vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">{avocatToEdit ? 'Modifier l\'avocat' : 'Ajouter un avocat'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                        
                        {/* Personal Info */}
                        <h3 class="md:col-span-3 text-lg font-semibold border-b pb-2 mb-2">Informations Personnelles</h3>
                        <div class="md:col-span-2"><label>Nom complet</label><input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-2 mt-1 border rounded" required /></div>
                        <div><label>Téléphone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 mt-1 border rounded" /></div>
                        <div class="md:col-span-3"><label>Adresse Physique</label><textarea name="physicalAddress" value={formData.physicalAddress} onChange={handleChange} className="w-full p-2 mt-1 border rounded" rows={2}></textarea></div>
                        <div><label>État Civil</label><select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full p-2 mt-1 border rounded bg-white"><option>Célibataire</option><option>Marié(e)</option><option>Divorcé(e)</option><option>Veuf(ve)</option></select></div>
                        <div><label>A des enfants ?</label><select name="hasChildren" value={formData.hasChildren} onChange={handleChange} className="w-full p-2 mt-1 border rounded bg-white"><option value="Non">Non</option><option value="Oui">Oui</option></select></div>
                        {formData.hasChildren === 'Oui' && <div><label>Nombre d'enfants</label><input type="number" name="childrenCount" value={formData.childrenCount} onChange={handleChange} className="w-full p-2 mt-1 border rounded" /></div>}

                        {/* Cabinet Info */}
                        <h3 class="md:col-span-3 text-lg font-semibold border-b pb-2 mb-2 mt-4">Informations du Cabinet</h3>
                        <div><label>Date de début</label><input type="date" name="serviceStartDate" value={formData.serviceStartDate} onChange={handleChange} className="w-full p-2 mt-1 border rounded" /></div>
                        <div><label>Statut au cabinet</label><select name="cabinetStatus" value={formData.cabinetStatus} onChange={handleChange} className="w-full p-2 mt-1 border rounded bg-white"><option>Senior of counsel</option><option>Senior</option><option>Associé</option><option>Junior</option></select></div>
                        <div><label>Statut de service</label><select name="serviceStatus" value={formData.serviceStatus} onChange={handleChange} className="w-full p-2 mt-1 border rounded bg-white"><option>Actif</option><option>Omis</option><option>En disponibilité</option></select></div>
                        <div class="md:col-span-3"><label>Rôle au cabinet</label><input type="text" name="cabinetRole" value={formData.cabinetRole} onChange={handleChange} className="w-full p-2 mt-1 border rounded" /></div>
                        
                        {/* Bar Info */}
                        <h3 class="md:col-span-3 text-lg font-semibold border-b pb-2 mb-2 mt-4">Informations du Barreau</h3>
                        <div><label>Date 1ère prestation de serment</label><input type="date" name="firstOathDate" value={formData.firstOathDate} onChange={handleChange} className="w-full p-2 mt-1 border rounded" /></div>
                        <div><label>Date 2ème prestation de serment</label><input type="date" name="secondOathDate" value={formData.secondOathDate} onChange={handleChange} className="w-full p-2 mt-1 border rounded" /></div>
                        <div><label>Numéro ONA</label><input type="text" name="onaNumber" value={formData.onaNumber} onChange={handleChange} className="w-full p-2 mt-1 border rounded" /></div>
                        <div><label>Barreau principal</label><input type="text" name="mainBar" value={formData.mainBar} onChange={handleChange} className="w-full p-2 mt-1 border rounded" /></div>
                        <div><label>Barreau secondaire</label><input type="text" name="secondaryBar" value={formData.secondaryBar} onChange={handleChange} className="w-full p-2 mt-1 border rounded" /></div>
                        <div class="md:col-span-3"><label>Mesures disciplinaires</label><input type="text" name="disciplinaryMeasures" value={formData.disciplinaryMeasures} onChange={handleChange} className="w-full p-2 mt-1 border rounded" /></div>

                        {/* Emails */}
                        <div class="md:col-span-3 mt-4">
                            <h4 class="font-semibold">Adresses Email</h4>
                            {(formData.emails || []).map((email, index) => (
                                <div key={index} class="flex items-center gap-2 mt-2">
                                    <input type="email" value={email} onChange={e => handleEmailChange(index, e.target.value)} className="w-full p-2 border rounded" placeholder={`Email ${index + 1}`} />
                                    {(formData.emails || []).length > 1 && <button type="button" onClick={() => removeEmail(index)} className="text-red-500">X</button>}
                                </div>
                            ))}
                            <button type="button" onClick={addEmail} className="mt-2 text-sm text-blue-600">+ Ajouter email</button>
                        </div>

                        {/* Bank Accounts */}
                        <div class="md:col-span-3 mt-4">
                            <h4 class="font-semibold">Comptes Bancaires</h4>
                            {(formData.bankAccounts || []).map((account, index) => (
                                <div key={index} class="grid grid-cols-2 gap-2 mt-2 items-center">
                                    <input type="text" value={account.bankName} onChange={e => handleBankAccountChange(index, 'bankName', e.target.value)} className="w-full p-2 border rounded" placeholder="Nom de la banque" />
                                    <div class="flex items-center gap-2">
                                        <input type="text" value={account.accountNumber} onChange={e => handleBankAccountChange(index, 'accountNumber', e.target.value)} className="w-full p-2 border rounded" placeholder="Numéro de compte" />
                                        <button type="button" onClick={() => removeBankAccount(index)} className="text-red-500">X</button>
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={addBankAccount} className="mt-2 text-sm text-blue-600">+ Ajouter compte</button>
                        </div>

                    </div>
                    
                    <div className="mt-8 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300">Annuler</button>
                        <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">{avocatToEdit ? 'Mettre à jour' : 'Enregistrer'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AvocatModal;
