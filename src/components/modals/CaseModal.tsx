import React, { FC, useState, useEffect, useRef } from 'react';
import { Case, Client, Avocat, Task, CaseProcedure } from '../../types';

interface CaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dossier: Case, tasks?: Omit<Task, 'id'>[]) => void;
  clients: Client[];
  avocats?: Avocat[];
  cases?: Case[];
}

const CaseModal: FC<CaseModalProps> = ({ 
    isOpen, 
    onClose, 
    onSave, 
    clients, 
    avocats = [],
    cases = []
}) => {
    const today = new Date().toISOString().split('T')[0];
    
    const createNewProcedureState = () => ({
        id: `PROC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        name: '',
        instance: '',
        objet: '',
        dateDebut: today,
        dateFin: '',
        status: 'En cours'
    });

    const initialFormState = {
        name: '',
        dossierId: '',
        dateCreation: today,
        client: '',
        adversaire: '',
        objet: '',
        procedures: [] as CaseProcedure[],
        avocatTitulaire: '',
        avocatsSurDossier: '',
        notes: '',
        tasks: [] as {
            name: string;
            startDate: string;
            endDate: string;
            lawyer: string;
            status: 'Non effectué' | 'Effectué' | 'Effectué à moitié';
            associatedLawyers: string[];
            notes: string;
            rapport: string;
            procedureLinkedIds: string[];
        }[],
        status: 'Nouveau' as Case['status'],
        attachments: [] as File[],
    };

    const [formData, setFormData] = useState(initialFormState);
    const [isLawyersDropdownOpen, setIsLawyersDropdownOpen] = useState(false);
    const [openTaskLawyersDropdownIndex, setOpenTaskLawyersDropdownIndex] = useState<number | null>(null);
    const [isProcedureSelectOpen, setIsProcedureSelectOpen] = useState(false);
    const lawyersDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (formData.name) {
            const generatedId = formData.name.trim().toUpperCase().replace(/\s+/g, '-').replace(/[^A-Z0-9-]/g, '');
            setFormData(prev => ({ ...prev, dossierId: generatedId }));
        } else {
             setFormData(prev => ({ ...prev, dossierId: '' }));
        }
    }, [formData.name]);

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

    // Ensure we start with at least one procedure
    useEffect(() => {
        if (isOpen && formData.procedures.length === 0) {
            setFormData(prev => ({
                ...prev,
                procedures: [createNewProcedureState()]
            }));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Sub-handlers for multiple procedures
    const handleAddProcedure = () => {
        setFormData(prev => ({
            ...prev,
            procedures: [...prev.procedures, createNewProcedureState()]
        }));
    };

    const handleRemoveProcedure = (id: string) => {
        setFormData(prev => ({
            ...prev,
            procedures: prev.procedures.filter(p => p.id !== id),
            // Clean up any tasks linked to this procedure
            tasks: prev.tasks.map(t => ({
                ...t,
                procedureLinkedIds: t.procedureLinkedIds.filter(pid => pid !== id)
            }))
        }));
    };

    const handleProcedureValueChange = (id: string, field: keyof CaseProcedure, value: string) => {
        setFormData(prev => ({
            ...prev,
            procedures: prev.procedures.map(p => p.id === id ? { ...p, [field]: value } : p)
        }));
    };

    const handleLinkExistingProcedure = (existingProc: CaseProcedure) => {
        if (formData.procedures.some(p => p.name.trim().toLowerCase() === existingProc.name.trim().toLowerCase())) {
            alert("Une procédure avec ce nom est déjà ajoutée !");
            return;
        }
        setFormData(prev => ({
            ...prev,
            procedures: [
                ...prev.procedures,
                {
                    id: existingProc.id || `PROC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                    name: existingProc.name,
                    instance: existingProc.instance || '',
                    objet: existingProc.objet || '',
                    dateDebut: existingProc.dateDebut || today,
                    dateFin: existingProc.dateFin || '',
                    status: existingProc.status || 'En cours'
                }
            ]
        }));
        setIsProcedureSelectOpen(false);
    };
    
    const handleTaskChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newTasks = [...formData.tasks];
        (newTasks[index] as any)[name] = value;
        setFormData(prev => ({ ...prev, tasks: newTasks }));
    };

    const handleAddTask = () => {
        setFormData(prev => ({ 
            ...prev, 
            tasks: [
                ...prev.tasks, 
                { 
                    name: '', 
                    startDate: today, 
                    endDate: today, 
                    lawyer: prev.avocatTitulaire || '', 
                    status: 'Non effectué' as Task['status'], 
                    associatedLawyers: [] as string[], 
                    notes: '', 
                    rapport: '', 
                    procedureLinkedIds: prev.procedures[0] ? [prev.procedures[0].id] : [] 
                }
            ] 
        }));
    };

    const handleTaskToggleLawyer = (taskIndex: number, lawyerName: string) => {
        const newTasks = [...formData.tasks];
        const task = newTasks[taskIndex];
        const currentList = task.associatedLawyers || [];
        if (currentList.includes(lawyerName)) {
            task.associatedLawyers = currentList.filter(l => l !== lawyerName);
        } else {
            task.associatedLawyers = [...currentList, lawyerName];
        }
        setFormData(prev => ({ ...prev, tasks: newTasks }));
    };

    const handleTaskToggleProcedure = (taskIndex: number, procedureId: string) => {
        const newTasks = [...formData.tasks];
        const task = newTasks[taskIndex];
        const list = task.procedureLinkedIds || [];
        if (list.includes(procedureId)) {
            task.procedureLinkedIds = list.filter(id => id !== procedureId);
        } else {
            task.procedureLinkedIds = [...list, procedureId];
        }
        setFormData(prev => ({ ...prev, tasks: newTasks }));
    };

    const handleRemoveTask = (index: number) => {
        const newTasks = formData.tasks.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, tasks: newTasks }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...Array.from(e.target.files!)] }));
            e.target.value = ''; 
        }
    };

    const handleRemoveAttachment = (indexToRemove: number) => {
        setFormData(prev => ({ ...prev, attachments: prev.attachments.filter((_, index) => index !== indexToRemove) }));
    };

    const handleToggleLawyer = (name: string) => {
        const selectedLawyers = formData.avocatsSurDossier 
            ? formData.avocatsSurDossier.split(',').map(item => item.trim()).filter(Boolean) 
            : [];
        let newSelected;
        if (selectedLawyers.includes(name)) {
            newSelected = selectedLawyers.filter(item => item !== name);
        } else {
            newSelected = [...selectedLawyers, name];
        }
        setFormData(prev => ({ ...prev, avocatsSurDossier: newSelected.join(', ') }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedClient = clients.find(c => c.id.toString() === formData.client);
        
        const createdTasks: Omit<Task, 'id'>[] = formData.tasks.map(t => {
            const linkedProcNames = t.procedureLinkedIds
                .map(id => formData.procedures.find(p => p.id === id)?.name)
                .filter(Boolean) as string[];

            return {
                name: t.name || 'Tâche sans nom',
                caseId: formData.dossierId,
                lawyer: t.lawyer,
                dueDate: t.endDate || today,
                status: t.status,
                notes: t.notes,
                procedureLinked: linkedProcNames.join(', '),
                procedureLinkedIds: t.procedureLinkedIds,
                startDate: t.startDate,
                endDate: t.endDate,
                associatedLawyers: t.associatedLawyers,
                rapport: t.rapport,
            };
        });

        // Backward compatibility properties using the first procedure
        const primaryProc = formData.procedures[0];

        onSave({
            id: formData.dossierId,
            reference: formData.dossierId,
            name: formData.name,
            clientId: selectedClient ? selectedClient.id.toString() : 'N/A',
            client: selectedClient ? selectedClient.name : 'N/A',
            status: formData.status,
            nextHearing: null,
            procedures: formData.procedures,
            procedure: primaryProc?.name || '',
            procedureInstance: primaryProc?.instance || '',
            procedureObjet: primaryProc?.objet || '',
            procedureDateDebut: primaryProc?.dateDebut || '',
            procedureDateFin: primaryProc?.dateFin || '',
            procedureStatus: primaryProc?.status || '',
            notes: formData.notes,
        }, createdTasks);

        setFormData(initialFormState);
        onClose();
    };

    const selectedLawyersList = formData.avocatsSurDossier 
        ? formData.avocatsSurDossier.split(',').map(item => item.trim()).filter(Boolean) 
        : [];

    // Extract other procedures from existing cases
    const systemProcedures = cases
        .flatMap(c => c.procedures || [])
        .filter((p, idx, self) => p && p.name && self.findIndex(x => x.name.trim().toLowerCase() === p.name.trim().toLowerCase()) === idx);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-gray-800">Créer un nouveau dossier</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-650 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <input type="text" name="name" placeholder="Nom du dossier" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" required />
                        <input type="text" name="dossierId" placeholder="ID Dossier (auto)" value={formData.dossierId} className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100" readOnly />
                        <input type="date" name="dateCreation" value={formData.dateCreation} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                        <select name="client" value={formData.client} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white" required>
                            <option value="" disabled>-- Sélectionner un client --</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <input type="text" name="adversaire" placeholder="Adversaire" value={formData.adversaire} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                        <input type="text" name="objet" placeholder="Objet principal" value={formData.objet} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                        
                        {/* MULTIPLE PROCEDURES SECTION */}
                        <div className="md:col-span-2 border border-gray-200 bg-slate-50/50 rounded-xl p-5 mt-2 shadow-sm space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-gray-100 pb-2">
                                <h3 className="text-xs font-black uppercase tracking-wider text-[#15447c] flex items-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                                    Procédures Ratachées (plusieurs possibles)
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {/* Link Existing Procedure Trigger */}
                                    {systemProcedures.length > 0 && (
                                        <div className="relative">
                                            <button 
                                                type="button" 
                                                onClick={() => setIsProcedureSelectOpen(!isProcedureSelectOpen)}
                                                className="py-1 px-2 text-[10px] uppercase tracking-wider font-extrabold text-[#15447c] bg-white border border-[#15447c]/30 rounded-lg hover:bg-slate-50 transition"
                                            >
                                                🔗 Lier existante
                                            </button>
                                            {isProcedureSelectOpen && (
                                                <div className="absolute z-40 right-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl p-3 space-y-1.5 max-h-48 overflow-y-auto">
                                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1">Associer une procédure existante :</p>
                                                    {systemProcedures.map(p => (
                                                        <button
                                                            key={p.id}
                                                            type="button"
                                                            onClick={() => handleLinkExistingProcedure(p)}
                                                            className="w-full text-left p-1.5 hover:bg-slate-50 font-semibold text-xs text-gray-700 rounded-md block truncate"
                                                            title={p.name}
                                                        >
                                                            ⚖️ {p.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <button 
                                        type="button" 
                                        onClick={handleAddProcedure}
                                        className="py-1 px-2 text-[10px] uppercase tracking-wider font-extrabold text-white bg-[#15447c] rounded-lg hover:bg-[#15447c]/90 transition"
                                    >
                                        + Ajouter Nouvelle
                                    </button>
                                </div>
                            </div>

                            {/* Procedure List */}
                            <div className="space-y-4">
                                {formData.procedures.map((proc, index) => (
                                    <div key={proc.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3 relative">
                                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">Procédure #{index + 1} ({proc.id})</span>
                                            {formData.procedures.length > 1 && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleRemoveProcedure(proc.id)}
                                                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg text-xs font-bold transition"
                                                >
                                                    Supprimer
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-3xs font-extrabold uppercase tracking-widest text-gray-500 mb-0.5">Nom de la procédure</label>
                                                <input type="text" placeholder="Ex: Référé-provision, Divorce contentieux..." value={proc.name} onChange={e => handleProcedureValueChange(proc.id, 'name', e.target.value)} className="w-full p-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-indigo-500" required />
                                            </div>
                                            <div>
                                                <label className="block text-3xs font-extrabold uppercase tracking-widest text-gray-500 mb-0.5">Instance (Tribunal)</label>
                                                <input type="text" placeholder="Ex: Tribunal de Grande Instance" value={proc.instance || ''} onChange={e => handleProcedureValueChange(proc.id, 'instance', e.target.value)} className="w-full p-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs" />
                                            </div>
                                            <div>
                                                <label className="block text-3xs font-extrabold uppercase tracking-widest text-gray-500 mb-0.5">Objet de la procédure</label>
                                                <input type="text" placeholder="Ex: Recouvrement" value={proc.objet || ''} onChange={e => handleProcedureValueChange(proc.id, 'objet', e.target.value)} className="w-full p-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs" />
                                            </div>
                                            <div>
                                                <label className="block text-3xs font-extrabold uppercase tracking-widest text-gray-500 mb-0.5">Date début</label>
                                                <input type="date" value={proc.dateDebut || ''} onChange={e => handleProcedureValueChange(proc.id, 'dateDebut', e.target.value)} className="w-full p-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs" />
                                            </div>
                                            <div>
                                                <label className="block text-3xs font-extrabold uppercase tracking-widest text-gray-500 mb-0.5">Date fin</label>
                                                <input type="date" value={proc.dateFin || ''} onChange={e => handleProcedureValueChange(proc.id, 'dateFin', e.target.value)} className="w-full p-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-3xs font-extrabold uppercase tracking-widest text-gray-500 mb-0.5">Statut de la Procédure</label>
                                                <select value={proc.status || 'En cours'} onChange={e => handleProcedureValueChange(proc.id, 'status', e.target.value)} className="w-full p-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs bg-white">
                                                    <option value="En cours">En cours</option>
                                                    <option value="En attente">En attente / Suspendu</option>
                                                    <option value="Clôturé">Clôturé / Terminé</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Statut du dossier</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white" required>
                                <option value="Nouveau">Nouveau</option>
                                <option value="En cours">En cours</option>
                                <option value="En attente">En attente</option>
                                <option value="Clôturé">Clôturé</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Avocat titulaire</label>
                            <select name="avocatTitulaire" value={formData.avocatTitulaire} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white">
                                <option value="">-- Aucun avocat titulaire --</option>
                                {avocats.map(a => <option key={a.id} value={a.fullName}>{a.fullName}</option>)}
                            </select>
                        </div>

                        <div className="md:col-span-2 relative" ref={lawyersDropdownRef}>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Avocats sur le dossier</label>
                             <div 
                                onClick={() => setIsLawyersDropdownOpen(!isLawyersDropdownOpen)}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer min-h-[42px] flex flex-wrap gap-1.5 items-center justify-between"
                             >
                                 {selectedLawyersList.length === 0 ? (
                                     <span className="text-gray-400 text-sm">Cliquer pour choisir les avocats rattachés...</span>
                                 ) : (
                                     <div className="flex flex-wrap gap-1.5">
                                         {selectedLawyersList.map(name => (
                                             <span 
                                                 key={name}
                                                 className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100"
                                                 onClick={(e) => {
                                                     e.stopPropagation();
                                                     handleToggleLawyer(name);
                                                 }}
                                             >
                                                 {name}
                                                 <span className="text-red-500 font-bold text-xs hover:text-red-700 cursor-pointer">×</span>
                                             </span>
                                         ))}
                                     </div>
                                 )}
                                 <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                 </svg>
                             </div>

                             {isLawyersDropdownOpen && (
                                 <div className="absolute z-30 mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 space-y-2 max-h-48 overflow-y-auto">
                                     <div className="text-2xs font-bold uppercase tracking-wider text-slate-400 border-b border-gray-100 pb-1.5 mb-2 flex justify-between items-center">
                                         <span>Choisir parmi les avocats KBB</span>
                                         <button 
                                             type="button" 
                                             onClick={(e) => {
                                                 e.stopPropagation();
                                                 setIsLawyersDropdownOpen(false);
                                             }}
                                             className="text-[#15447c] hover:text-indigo-800 text-[10px] font-black uppercase"
                                         >
                                             Fermer
                                         </button>
                                     </div>
                                     {avocats.map(a => {
                                         const isChecked = selectedLawyersList.includes(a.fullName);
                                         return (
                                             <label 
                                                 key={a.id}
                                                 className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-sm font-semibold text-gray-700 select-none transition"
                                                 onClick={(e) => e.stopPropagation()}
                                             >
                                                 <input 
                                                     type="checkbox"
                                                     checked={isChecked}
                                                     onChange={() => handleToggleLawyer(a.fullName)}
                                                     className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                 />
                                                 <div className="flex flex-col">
                                                     <span>{a.fullName}</span>
                                                     <span className="text-3xs text-gray-400 font-bold uppercase">{a.cabinetStatus} • {a.cabinetRole}</span>
                                                 </div>
                                             </label>
                                         );
                                     })}
                                 </div>
                             )}
                        </div>

                        <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-gray-750 mb-1">Notes / Détails supplémentaires</label>
                             <textarea 
                                 name="notes" 
                                 value={formData.notes} 
                                 onChange={handleChange} 
                                 placeholder="Rédigez ici des notes, commentaires ou précisions rattachées à ce dossier..." 
                                 className="w-full p-2.5 border border-gray-300 rounded-lg shadow-inner text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all min-h-[95px]"
                             />
                        </div>
                    </div>

                    <div className="mt-6 border-t pt-4">
                        <h3 className="text-lg font-black text-gray-800 mb-2">Pièces jointes</h3>
                        <div className="mt-2">
                            <label htmlFor="file-upload" className="cursor-pointer bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 inline-flex items-center text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                <span>Ajouter des fichiers</span>
                            </label>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
                        </div>
                        {formData.attachments.length > 0 && (
                            <ul className="mt-4 space-y-2">
                                {formData.attachments.map((file, index) => (
                                    <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md text-sm">
                                        <div className="flex items-center truncate">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            <span className="text-gray-800 truncate border-b border-dashed" title={file.name}>{file.name}</span>
                                        </div>
                                        <button type="button" onClick={() => handleRemoveAttachment(index)} className="ml-4 text-red-500 hover:text-red-700 h-6 w-6 flex items-center justify-center rounded-full hover:bg-red-100 flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* TASKS WITH NEW MULTIPLE PROCEDURES ASSOCIATION CHECKBOXES */}
                    <div className="mt-6 border-t pt-4">
                         <h3 className="text-lg font-black text-gray-800 mb-4">Création de Tâches</h3>
                         <div className="space-y-4">
                         {formData.tasks.map((task, index) => (
                             <div key={index} className="bg-slate-50/70 border border-gray-200 rounded-xl p-4 space-y-3 relative shadow-sm">
                                 <div className="flex justify-between items-center pb-2 border-b border-gray-150">
                                     <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tâche #{index + 1}</span>
                                     <button 
                                         type="button" 
                                         onClick={() => handleRemoveTask(index)} 
                                         className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 flex items-center justify-center h-7 w-7 rounded-lg text-sm font-bold transition duration-200"
                                     >
                                         &times;
                                     </button>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div className="md:col-span-2">
                                         <label className="block text-3xs font-black uppercase tracking-widest text-[#15447c] mb-0.5">Nom de la Tâche <span className="text-red-500">*</span></label>
                                         <input 
                                             type="text" 
                                             placeholder="Ex: Rédiger conclusions, Assister audience..." 
                                             value={task.name} 
                                             onChange={e => handleTaskChange(index, e)} 
                                             className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-indigo-500"
                                             required 
                                         />
                                     </div>

                                     {/* MULTISELECT PROCEDURES FOR EACH TASK */}
                                     <div className="md:col-span-2 bg-indigo-50/20 border border-indigo-100/40 p-3 rounded-lg">
                                         <label className="block text-3xs font-black uppercase tracking-widest text-indigo-900 mb-1.5">Procédure(s) associée(s) à cette tâche</label>
                                         {formData.procedures.length === 0 ? (
                                             <p className="text-3xs text-gray-400 italic">Veuillez d'abord remplir une procédure ci-dessus.</p>
                                         ) : (
                                             <div className="flex flex-wrap gap-2">
                                                 {formData.procedures.map(p => {
                                                     const isLinked = (task.procedureLinkedIds || []).includes(p.id);
                                                     return (
                                                         <label 
                                                             key={p.id}
                                                             className={`inline-flex items-center gap-1.5 px-2 bg-white hover:bg-slate-50 rounded-lg py-1 text-xs border cursor-pointer select-none font-medium transition ${
                                                                 isLinked 
                                                                 ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold' 
                                                                 : 'text-gray-600 border-gray-200 hover:border-gray-300'
                                                             }`}
                                                         >
                                                             <input 
                                                                 type="checkbox"
                                                                 checked={isLinked}
                                                                 onChange={() => handleTaskToggleProcedure(index, p.id)}
                                                                 className="h-3 w-3 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                             />
                                                             <span>{p.name || `[Sans Nom] ${p.id.slice(-4)}`}</span>
                                                         </label>
                                                     );
                                                 })}
                                             </div>
                                         )}
                                     </div>

                                     <div>
                                         <label className="block text-3xs font-black uppercase tracking-widest text-gray-400 mb-0.5">Responsable principal</label>
                                         <select 
                                             name="lawyer" 
                                             value={task.lawyer} 
                                             onChange={e => handleTaskChange(index, e)} 
                                             className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-700 font-medium font-semibold"
                                         >
                                             <option value="">-- Aucun avocat responsable --</option>
                                             {avocats.map(a => <option key={a.id} value={a.fullName}>{a.fullName}</option>)}
                                         </select>
                                     </div>

                                     <div>
                                         <label className="block text-3xs font-black uppercase tracking-widest text-gray-400 mb-0.5 text-xs font-semibold">Statut de la Tâche</label>
                                         <select 
                                             name="status" 
                                             value={task.status} 
                                             onChange={e => handleTaskChange(index, e)} 
                                             className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-700 font-semibold"
                                         >
                                             <option value="Non effectué">Non effectué</option>
                                             <option value="Effectué à moitié">Effectué à moitié</option>
                                             <option value="Effectué">Effectué</option>
                                         </select>
                                     </div>

                                     <div>
                                         <label className="block text-3xs font-black uppercase tracking-widest text-gray-400 mb-0.5">Date début</label>
                                         <input type="date" name="startDate" value={task.startDate} onChange={e => handleTaskChange(index, e)} className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs" />
                                     </div>
                                     <div>
                                         <label className="block text-3xs font-black uppercase tracking-widest text-gray-400 mb-0.5">Date fin (Échéance)</label>
                                         <input type="date" name="endDate" value={task.endDate} onChange={e => handleTaskChange(index, e)} className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs" />
                                     </div>

                                     <div className="relative">
                                         <label className="block text-3xs font-black uppercase tracking-widest text-gray-400 mb-0.5">Avocats associés</label>
                                         <div 
                                             onClick={() => setOpenTaskLawyersDropdownIndex(openTaskLawyersDropdownIndex === index ? null : index)}
                                             className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs cursor-pointer min-h-[34px] flex flex-wrap gap-1 items-center justify-between"
                                         >
                                             {task.associatedLawyers.length === 0 ? (
                                                 <span className="text-gray-400">Choisir...</span>
                                             ) : (
                                                 <div className="flex flex-wrap gap-1">
                                                     {task.associatedLawyers.map(name => (
                                                         <span 
                                                             key={name}
                                                             className="inline-flex items-center gap-1 px-1.5 py-0.2 bg-indigo-50 text-indigo-700 font-bold text-[10px] rounded-md border border-indigo-100"
                                                         >
                                                             {name}
                                                         </span>
                                                     ))}
                                                 </div>
                                             )}
                                             <svg className="w-3.5 h-3.5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                             </svg>
                                         </div>

                                         {openTaskLawyersDropdownIndex === index && (
                                             <div className="absolute z-30 mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl p-3 space-y-1.5 max-h-40 overflow-y-auto">
                                                 <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-gray-100 pb-1 mb-1.5 flex justify-between items-center">
                                                     <span>Avocats associés</span>
                                                     <button 
                                                         type="button" 
                                                         onClick={(e) => {
                                                             e.stopPropagation();
                                                             setOpenTaskLawyersDropdownIndex(null);
                                                         }}
                                                         className="text-indigo-650 hover:text-indigo-800 text-[9px] font-extrabold"
                                                     >
                                                         Fermer
                                                     </button>
                                                 </div>
                                                 {avocats.map(a => {
                                                     const isChecked = task.associatedLawyers.includes(a.fullName);
                                                     return (
                                                         <label 
                                                             key={a.id}
                                                             className="flex items-center gap-2 p-1 rounded hover:bg-slate-50 cursor-pointer text-xs font-semibold text-gray-700 select-none transition"
                                                             onClick={(e) => e.stopPropagation()}
                                                         >
                                                             <input 
                                                                 type="checkbox"
                                                                 checked={isChecked}
                                                                 onChange={() => handleTaskToggleLawyer(index, a.fullName)}
                                                                 className="h-3.5 w-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                             />
                                                             <span>{a.fullName}</span>
                                                         </label>
                                                     );
                                                 })}
                                             </div>
                                         )}
                                     </div>

                                     <div>
                                         <label className="block text-3xs font-black uppercase tracking-widest text-gray-400 mb-0.5">Rapport / Compte-rendu</label>
                                         <textarea 
                                             name="rapport" 
                                             rows={1}
                                             placeholder="Contenu..."
                                             value={task.rapport} 
                                             onChange={e => handleTaskChange(index, e)} 
                                             className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs"
                                         />
                                     </div>

                                     <div className="md:col-span-2">
                                         <label className="block text-3xs font-black uppercase tracking-widest text-gray-400 mb-0.5">Notes privées / Détails</label>
                                         <textarea 
                                             name="notes" 
                                             rows={1}
                                             placeholder="Notes intimes..."
                                             value={task.notes} 
                                             onChange={e => handleTaskChange(index, e)} 
                                             className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs"
                                         />
                                     </div>
                                 </div>
                             </div>
                         ))}
                         </div>
                         <button type="button" onClick={handleAddTask} className="mt-4 inline-flex items-center gap-1 py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-[#15447c] border border-indigo-200 hover:border-indigo-300 rounded-xl text-xs font-bold transition duration-200">+ Ajouter une tâche</button>
                    </div>

                    <div className="mt-8 flex justify-end space-x-4 border-t border-slate-100 pt-5">
                        <button type="button" onClick={onClose} className="bg-slate-150 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-6 rounded-xl transition duration-300">Annuler</button>
                        <button type="submit" className="bg-indigo-650 text-white font-bold py-2.5 px-8 rounded-xl hover:bg-indigo-700 transition duration-300 shadow-sm">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CaseModal;
