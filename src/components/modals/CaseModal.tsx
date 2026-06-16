
import React, { FC, useState, useEffect } from 'react';
import { Case, Client, Avocat, Procedure } from '../../types';

interface CaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dossier: Omit<Case, 'id' | 'reference'>, procedures: Omit<Procedure, 'id'>[]) => void;
  clients: Client[];
  avocats: Avocat[];
  caseToEdit?: Case | null;
}

const CaseModal: FC<CaseModalProps> = ({ isOpen, onClose, onSave, clients, avocats, caseToEdit }) => {
    const today = new Date().toISOString().split('T')[0];

    const initialFormState: Omit<Case, 'id' | 'reference' | 'client' | 'procedures' | 'tasks'> = {
        name: '',
        clientId: '',
        date: today,
        status: 'Nouveau',
        type: 'Contentieux',
        description: '',
        lawyer: '',
        conclusion: '',
        fee: 0,
        archived: false,
        nextHearing: '',
    };

    const [formData, setFormData] = useState(initialFormState);
    const [procedures, setProcedures] = useState<Omit<Procedure, 'id'>[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (caseToEdit) {
                setFormData({
                    ...initialFormState,
                    ...caseToEdit,
                    date: caseToEdit.date ? new Date(caseToEdit.date).toISOString().split('T')[0] : today,
                    nextHearing: caseToEdit.nextHearing ? new Date(caseToEdit.nextHearing).toISOString().split('T')[0] : '',
                });
                setProcedures(caseToEdit.procedures || []);
            } else {
                setFormData(initialFormState);
                setProcedures([]);
            }
        }
    }, [isOpen, caseToEdit]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                    type === 'number' ? parseFloat(value) : 
                    value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleProcedureChange = (index: number, field: keyof Omit<Procedure, 'id'>, value: string) => {
        const newProcedures = [...procedures];
        newProcedures[index] = { ...newProcedures[index], [field]: value };
        setProcedures(newProcedures);
    };

    const addProcedure = () => {
        setProcedures([...procedures, { name: '', instance: '', objet: '', dateDebut: today, status: 'En cours' }]);
    };

    const removeProcedure = (index: number) => {
        setProcedures(procedures.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, procedures);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl w-full max-h-[95vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">{caseToEdit ? 'Modifier le dossier' : 'Créer un nouveau dossier'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom du dossier</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" required />
                        </div>

                        <div>
                            <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">Client</label>
                            <select name="clientId" id="clientId" value={formData.clientId} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white" required>
                                <option value="" disabled>-- Sélectionner un client --</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="lawyer" className="block text-sm font-medium text-gray-700">Avocat en charge</label>
                             <select name="lawyer" id="lawyer" value={formData.lawyer} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white">
                                <option value="">Non assigné</option>
                                {avocats.map(a => <option key={a.id} value={a.fullName}>{a.fullName}</option>)}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date de création</label>
                            <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Statut</label>
                            <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white">
                                <option value="Nouveau">Nouveau</option>
                                <option value="En cours">En cours</option>
                                <option value="En attente">En attente</option>
                                <option value="Clôturé">Clôturé</option>
                            </select>
                        </div>

                         <div>
                            <label htmlFor="nextHearing" className="block text-sm font-medium text-gray-700">Prochaine Audience</label>
                            <input type="date" name="nextHearing" id="nextHearing" value={formData.nextHearing} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        
                        <div>
                            <label htmlFor="fee" className="block text-sm font-medium text-gray-700">Honoraires (€)</label>
                            <input type="number" name="fee" id="fee" value={formData.fee} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 w-full p-2 border border-gray-300 rounded-md"></textarea>
                        </div>

                        {/* Procedures Section */}
                        <div className="md:col-span-2 mt-4">
                             <h3 className="text-lg font-semibold mb-3 border-t pt-4">Procédures Associées</h3>
                             {procedures.map((proc, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 mb-4 border rounded-lg bg-gray-50">
                                    <input type="text" placeholder="Nom de la procédure" value={proc.name} onChange={(e) => handleProcedureChange(index, 'name', e.target.value)} className="p-2 border rounded" />
                                    <input type="text" placeholder="Instance (ex: TPI)" value={proc.instance} onChange={(e) => handleProcedureChange(index, 'instance', e.target.value)} className="p-2 border rounded" />
                                    <input type="text" placeholder="Objet de la procédure" value={proc.objet} onChange={(e) => handleProcedureChange(index, 'objet', e.target.value)} className="p-2 border rounded" />
                                    <input type="date" value={proc.dateDebut} onChange={(e) => handleProcedureChange(index, 'dateDebut', e.target.value)} className="p-2 border rounded" />
                                     <select value={proc.status} onChange={(e) => handleProcedureChange(index, 'status', e.target.value)} className="p-2 border rounded bg-white">
                                        <option value="En cours">En cours</option>
                                        <option value="Clôturé">Clôturé</option>
                                        <option value="En attente">En attente</option>
                                    </select>
                                    <button type="button" onClick={() => removeProcedure(index)} className="text-red-500 hover:text-red-700 font-semibold self-center justify-self-end">Supprimer</button>
                                </div>
                            ))}
                            <button type="button" onClick={addProcedure} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-200 mt-2">+ Ajouter une procédure</button>
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="conclusion" className="block text-sm font-medium text-gray-700">Conclusion</label>
                            <textarea name="conclusion" id="conclusion" value={formData.conclusion} onChange={handleChange} rows={3} className="mt-1 w-full p-2 border border-gray-300 rounded-md"></textarea>
                        </div>

                    </div>
                    
                    <div className="mt-8 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300">Annuler</button>
                        <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">{caseToEdit ? 'Mettre à jour' : 'Enregistrer'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CaseModal;
