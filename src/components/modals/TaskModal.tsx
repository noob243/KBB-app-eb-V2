import React, { FC, useState, useRef, useEffect } from 'react';
import { Task, Case, Avocat } from '../../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
  cases: Case[];
  lawyers: string[];
  avocats?: Avocat[];
}

const TaskModal: FC<TaskModalProps> = ({ isOpen, onClose, onSave, cases, lawyers, avocats = [] }) => {
    const today = new Date().toISOString().split('T')[0];
    const initialFormState = {
        name: '',
        caseId: '',
        lawyer: lawyers[0] || '',
        dueDate: today,
        startDate: today,
        endDate: today,
        status: 'Non effectué' as Task['status'],
        notes: '',
        procedureLinked: '',
        associatedLawyers: [] as string[],
        rapport: '',
    };
    const [formData, setFormData] = useState(initialFormState);
    const [isLawyersDropdownOpen, setIsLawyersDropdownOpen] = useState(false);
    const lawyersDropdownRef = useRef<HTMLDivElement>(null);

    // Synchronize default lawyers and case setup when opening/changing case
    useEffect(() => {
        if (isOpen) {
            // Find recommended procedure for selected case if any
            const foundCase = cases.find(c => c.id === formData.caseId);
            if (foundCase && foundCase.procedure && !formData.procedureLinked) {
                setFormData(prev => ({ ...prev, procedureLinked: foundCase.procedure || '' }));
            }
        }
    }, [formData.caseId, isOpen]);

    // Close lawyers custom dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (lawyersDropdownRef.current && !lawyersDropdownRef.current.contains(e.target as Node)) {
                setIsLawyersDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const next = { ...prev, [name]: value };
            // If endDate changes, synchronize with dueDate
            if (name === 'endDate') {
                next.dueDate = value;
            } else if (name === 'dueDate') {
                next.endDate = value;
            }
            return next;
        });
    };

    const handleToggleLawyer = (name: string) => {
        setFormData(prev => {
            const list = prev.associatedLawyers || [];
            if (list.includes(name)) {
                return { ...prev, associatedLawyers: list.filter(item => item !== name) };
            } else {
                return { ...prev, associatedLawyers: [...list, name] };
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.caseId) {
            alert("Veuillez sélectionner un dossier.");
            return;
        }
        onSave({
            name: formData.name,
            caseId: formData.caseId,
            lawyer: formData.lawyer,
            dueDate: formData.endDate || formData.dueDate,
            status: formData.status as Task['status'],
            notes: formData.notes,
            procedureLinked: formData.procedureLinked,
            startDate: formData.startDate,
            endDate: formData.endDate,
            associatedLawyers: formData.associatedLawyers,
            rapport: formData.rapport,
        });
        setFormData(initialFormState);
        onClose();
    };

    const uniqueProcedures = Array.from(new Set(cases.map(c => c.procedure).filter((p): p is string => !!p)));
    const selectedCaseProcedure = formData.caseId ? cases.find(c => c.id === formData.caseId)?.procedure : '';

    // We can list all registered lawyers from the avocats array (by name) or fallback to lawyers list.
    const allLawyersList = avocats.length > 0 ? avocats.map(a => a.fullName) : lawyers;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Créer une nouvelle tâche
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-650 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Nom de la Tâche <span className="text-red-500">*</span></label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm" required />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Dossier Associé <span className="text-red-500">*</span></label>
                                <select name="caseId" value={formData.caseId} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm bg-white" required>
                                    <option value="" disabled>-- Sélectionner un dossier --</option>
                                    {cases.map(c => <option key={c.id} value={c.id}>{c.name} ({c.client})</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Procédure liée</label>
                                <select name="procedureLinked" value={formData.procedureLinked} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm bg-white">
                                    <option value="">-- Aucune procédure liée --</option>
                                    {selectedCaseProcedure && (
                                        <option value={selectedCaseProcedure}>
                                            [Recommandé] {selectedCaseProcedure}
                                        </option>
                                    )}
                                    {uniqueProcedures.map(p => (
                                        p !== selectedCaseProcedure && <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-gray-100">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Date de début</label>
                                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Date de fin</label>
                                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Responsable principal</label>
                                <select name="lawyer" value={formData.lawyer} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm bg-white">
                                    <option value="">-- Aucun avocat responsable --</option>
                                    {allLawyersList.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Statut de la Tâche</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm">
                                    <option value="Non effectué">Non effectué</option>
                                    <option value="Effectué à moitié">Effectué à moitié</option>
                                    <option value="Effectué">Effectué</option>
                                </select>
                            </div>
                        </div>

                        {/* Custom multi-select component for Associated Lawyers / Avocats associés */}
                        <div className="relative" ref={lawyersDropdownRef}>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Avocats associés à la tâche (Optionnel)</label>
                            <div 
                                onClick={() => setIsLawyersDropdownOpen(!isLawyersDropdownOpen)}
                                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm bg-white cursor-pointer min-h-[42px] flex flex-wrap gap-1.5 items-center justify-between"
                            >
                                {formData.associatedLawyers.length === 0 ? (
                                    <span className="text-gray-400 text-sm">Cliquer pour choisir des avocats associés...</span>
                                ) : (
                                    <div className="flex flex-wrap gap-1.5">
                                        {formData.associatedLawyers.map(name => (
                                            <span 
                                                key={name}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleLawyer(name);
                                                }}
                                            >
                                                {name}
                                                <span className="text-red-500 font-bold ml-1 hover:text-red-700 cursor-pointer">×</span>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <svg className="w-4 h-4 text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {isLawyersDropdownOpen && (
                                <div className="absolute z-30 mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 space-y-2 max-h-48 overflow-y-auto">
                                    <div className="text-2xs font-bold uppercase tracking-wider text-slate-400 border-b border-gray-100 pb-1.5 mb-2 flex justify-between items-center">
                                        <span>Sélectionner les avocats rattachés</span>
                                        <button 
                                            type="button" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsLawyersDropdownOpen(false);
                                            }}
                                            className="text-indigo-600 hover:text-indigo-800 text-[10px] font-black uppercase"
                                        >
                                            Fermer
                                        </button>
                                    </div>
                                    {allLawyersList.length === 0 ? (
                                        <p className="text-xs text-gray-400 italic">Aucun avocat disponible</p>
                                    ) : (
                                        allLawyersList.map(name => {
                                            const isChecked = formData.associatedLawyers.includes(name);
                                            return (
                                                <label 
                                                    key={name}
                                                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-sm font-semibold text-gray-700 select-none transition"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <input 
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => handleToggleLawyer(name)}
                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                    />
                                                    <span>{name}</span>
                                                </label>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Rapport & Compte-rendu de la Tâche</label>
                            <textarea 
                                name="rapport" 
                                value={formData.rapport} 
                                onChange={handleChange} 
                                rows={3} 
                                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" 
                                placeholder="Rédigez le rapport officiel pour cette tâche, les conclusions ou compte-rendu d'audience..."
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Notes / Détails supplémentaires</label>
                            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="Ajoutez des détails sur la tâche..."></textarea>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-4 border-t pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-250 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition duration-300 border border-gray-200">Annuler</button>
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-sm">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
