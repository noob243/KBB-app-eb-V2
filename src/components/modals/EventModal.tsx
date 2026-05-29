
import React, { FC, useState, useEffect } from 'react';
import { Event, Avocat } from '../../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
  avocats?: Avocat[];
}

const EventModal: FC<EventModalProps> = ({ isOpen, onClose, onSave, avocats = [] }) => {
    const today = new Date().toISOString().split('T')[0];
    const initialFormState = {
        name: '', eventId: '', type: 'Audience', partenaires: '', date: today, lieu: '',
        publicCible: '', membresKBB: '', membresExternes: '', budgetPrevisionnel: '',
        budgetRealise: '', financement: 'Interne', sponsors: '',
    };
    const [formData, setFormData] = useState(initialFormState);

    const initialFundingSources = [
        { id: 'KBB', label: 'Cabinet KBB', checked: true, amount: '' },
        { id: 'Sponsors', label: 'Sponsors externe', checked: false, amount: '' },
        { id: 'Autre', label: 'Autres', checked: false, amount: '' },
    ];
    const [fundingSources, setFundingSources] = useState(initialFundingSources);

    const [selectedKbbMembers, setSelectedKbbMembers] = useState<string[]>([]);
    const [customKbbMembers, setCustomKbbMembers] = useState<string>('');
    const [isKbbDropdownOpen, setIsKbbDropdownOpen] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            setSelectedKbbMembers([]);
            setCustomKbbMembers('');
            setIsKbbDropdownOpen(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (formData.name) {
            const generatedId = `EVT-${formData.name.trim().toUpperCase().replace(/\s+/g, '-').replace(/[^A-Z0-9-]/g, '')}`;
            setFormData(prev => ({ ...prev, eventId: generatedId }));
        } else {
            setFormData(prev => ({ ...prev, eventId: '' }));
        }
    }, [formData.name]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggleKbbMember = (name: string) => {
        setSelectedKbbMembers(prev => 
            prev.includes(name) 
                ? prev.filter(m => m !== name) 
                : [...prev, name]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedFundings = fundingSources
            .filter(src => src.checked)
            .map(src => ({ label: src.label, amount: src.amount.trim() || '0' }));

        const fundingString = selectedFundings
            .map(src => `${src.label} (${src.amount} €)`)
            .join(', ') || 'Aucun financement';

        const combinedKBB = [
            ...selectedKbbMembers,
            ...(customKbbMembers.trim() ? [customKbbMembers.trim()] : [])
        ].join(', ');

        onSave({ 
          ...formData, 
          id: formData.eventId,
          type: formData.type as Event['type'],
          membresKBB: combinedKBB,
          financement: fundingString,
          financements: selectedFundings
        });
        setFormData(initialFormState);
        setFundingSources(initialFundingSources);
        setSelectedKbbMembers([]);
        setCustomKbbMembers('');
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Créer un nouvel événement</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Column 1 */}
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'évènement <span className="text-red-500">*</span></label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ID Event (auto)</label>
                                <input type="text" name="eventId" value={formData.eventId} className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100" readOnly />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type de l'évènement</label>
                                <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm">
                                    <option>Audience</option>
                                    <option>Colloque</option>
                                    <option>Conférence</option>
                                    <option>Séminaire</option>
                                    <option>Autre</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date prévue</label>
                                <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                                <input type="text" name="lieu" value={formData.lieu} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Public cible</label>
                                <input type="text" name="publicCible" value={formData.publicCible} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                        </div>
                        {/* Column 2 */}
                         <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Sources de financement</label>
                                <div className="space-y-1.5 border border-gray-250 rounded-xl p-3 bg-slate-50/50 max-h-[220px] overflow-y-auto custom-scrollbar shadow-inner">
                                    {fundingSources.map((source, index) => (
                                        <div key={source.id} className={`flex items-center justify-between p-2 rounded-xl border transition-all duration-200 ${source.checked ? 'bg-indigo-50/20 border-indigo-200/50 shadow-xs' : 'bg-white border-gray-200'}`}>
                                            <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={source.checked}
                                                    onChange={(e) => {
                                                        const updated = [...fundingSources];
                                                        updated[index].checked = e.target.checked;
                                                        setFundingSources(updated);
                                                    }}
                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/20 h-4 w-4 transition-all"
                                                />
                                                <span className={`text-xs ${source.checked ? 'text-[#15447c] font-bold' : 'text-gray-600 font-medium'}`}>{source.label}</span>
                                            </label>
                                            {source.checked && (
                                                <div className="flex items-center space-x-1.5 animate-fadeIn">
                                                    <input
                                                        type="number"
                                                        placeholder="Montant"
                                                        value={source.amount}
                                                        onChange={(e) => {
                                                            const updated = [...fundingSources];
                                                            updated[index].amount = e.target.value;
                                                            setFundingSources(updated);
                                                        }}
                                                        className="w-24 px-2 py-1 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                    />
                                                    <span className="text-2xs font-bold text-indigo-700">€</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Budget prévisionnel</label>
                                <input type="number" name="budgetPrevisionnel" placeholder="€" value={formData.budgetPrevisionnel} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Budget réalisé</label>
                                <input type="number" name="budgetRealise" placeholder="€" value={formData.budgetRealise} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Partenaires</label>
                                <textarea name="partenaires" value={formData.partenaires} onChange={handleChange} rows={2} className="w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sponsors</label>
                                <textarea name="sponsors" value={formData.sponsors} onChange={handleChange} rows={2} className="w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                            </div>
                        </div>
                        {/* Full-width fields */}
                        <div className="md:col-span-2 space-y-3 bg-indigo-50/20 p-4 rounded-xl border border-indigo-100/40 relative">
                             <div className="flex justify-between items-center pb-1">
                                 <span className="text-xs font-black text-[#15447c] uppercase tracking-wider block">👥 Membres du Cabinet KBB</span>
                                 <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                                     {selectedKbbMembers.length} sélectionné{selectedKbbMembers.length > 1 ? 's' : ''}
                                 </span>
                             </div>

                             {/* Multi-select trigger */}
                             <div className="relative">
                                 <div 
                                     onClick={() => setIsKbbDropdownOpen(!isKbbDropdownOpen)}
                                     className="w-full min-h-[42px] px-3 py-2 bg-white border border-gray-300 rounded-xl shadow-xs cursor-pointer flex flex-wrap gap-1.5 items-center justify-between text-xs font-semibold hover:border-indigo-400 transition"
                                 >
                                     {selectedKbbMembers.length === 0 ? (
                                         <span className="text-gray-450 font-medium select-none text-2xs sm:text-xs">Cliquez pour voir et sélectionner des membres du cabinet...</span>
                                     ) : (
                                         <div className="flex flex-wrap gap-1.5">
                                             {selectedKbbMembers.map((member) => (
                                                 <span 
                                                     key={member}
                                                     className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-indigo-100/60"
                                                     onClick={(e) => {
                                                         e.stopPropagation(); // prevent opening dropdown when deleting
                                                         handleToggleKbbMember(member);
                                                     }}
                                                 >
                                                     {member}
                                                     <span className="text-red-500 hover:text-red-700 font-black ml-0.5">✕</span>
                                                 </span>
                                             ))}
                                         </div>
                                     )}
                                     <span className="text-gray-400 text-[10px] ml-auto select-none pl-2">
                                         {isKbbDropdownOpen ? '▲' : '▼'}
                                     </span>
                                 </div>

                                 {/* Floating proposals dropdown */}
                                 {isKbbDropdownOpen && (
                                     <div className="absolute z-30 left-0 right-0 mt-1.5 p-3.5 bg-white border border-gray-250 rounded-2xl shadow-xl space-y-2.5 animate-fadeIn max-h-[220px] overflow-y-auto custom-scrollbar">
                                         <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                             <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Choisir des Avocats ({avocats.length})</span>
                                             <button 
                                                 type="button" 
                                                 onClick={(e) => {
                                                     e.stopPropagation();
                                                     setIsKbbDropdownOpen(false);
                                                 }}
                                                 className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-wider"
                                             >
                                                 Fermer ✕
                                             </button>
                                         </div>

                                         {avocats.length === 0 ? (
                                             <p className="text-3xs font-semibold text-gray-450 italic py-2">Aucun avocat enregistré. Créez des avocats dans l'onglet dédié.</p>
                                         ) : (
                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                                 {avocats.map((avocat) => {
                                                     const isSelected = selectedKbbMembers.includes(avocat.fullName);
                                                     return (
                                                         <div 
                                                             key={avocat.id} 
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 handleToggleKbbMember(avocat.fullName);
                                                             }}
                                                             className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer select-none transition-all duration-150 ${
                                                                 isSelected 
                                                                     ? 'bg-indigo-50/40 border-indigo-300 shadow-xs ring-2 ring-indigo-500/5' 
                                                                     : 'bg-white border-gray-200 hover:bg-slate-50'
                                                             }`}
                                                         >
                                                             <input
                                                                 type="checkbox"
                                                                 checked={isSelected}
                                                                 readOnly
                                                                 className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/25 h-3.5 w-3.5 cursor-pointer"
                                                             />
                                                             <div className="min-w-0 pr-1">
                                                                 <p className="text-[11px] font-bold text-gray-800 truncate leading-tight">{avocat.fullName}</p>
                                                                 <p className="text-[8px] font-extrabold text-indigo-600 uppercase tracking-tight">{avocat.cabinetStatus}</p>
                                                             </div>
                                                         </div>
                                                     );
                                                 })}
                                             </div>
                                         )}
                                     </div>
                                 )}
                             </div>

                             <div>
                                 <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Autres membres ou collaborateurs (KBB)</label>
                                 <input 
                                     type="text" 
                                     placeholder="Ex: Stagiaires, assistants, paralégaux (séparés par des virgules)..." 
                                     value={customKbbMembers} 
                                     onChange={(e) => setCustomKbbMembers(e.target.value)} 
                                     className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition" 
                                 />
                             </div>
                        </div>
                        <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-gray-700 mb-1">Membres de l'organisation (Externe)</label>
                             <textarea name="membresExternes" value={formData.membresExternes} onChange={handleChange} rows={2} className="w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
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

export default EventModal;
