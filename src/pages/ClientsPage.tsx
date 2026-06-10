import React, { FC, useState } from 'react';
import PageContainer from '../components/PageContainer';
import ClientModal from '../components/modals/ClientModal';
import { Client, Case } from '../types';

interface ClientsPageProps {
  clients: Client[];
  cases?: Case[];
  onAddClient: (client: Omit<Client, 'id'>) => void;
  onExport?: () => void;
  onExportClients?: () => void;
  onDeleteClient?: (id: string) => void;
  onUpdateClient?: (client: Client) => void;
}

const ClientsPage: FC<ClientsPageProps> = ({ clients, cases = [], onAddClient, onExport, onExportClients, onDeleteClient, onUpdateClient }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const getClientDetails = (client: Client) => {
        let sector = client.secteur || "Services Professionnels";
        let localAddress = client.siege || "Bvd du 30 Juin, Gombe, Kinshasa, RDC";
        
        if (!client.secteur) {
            if (client.name.includes("Invest")) sector = "Investissements & Services Financiers";
            else if (client.name.includes("Digital")) sector = "Infrastructures Numériques & Logiciels";
            else if (client.name.includes("Bâtir") || client.name.includes("Construction")) sector = "Bâtiment & Travaux Publics (BTP)";
            else if (client.name.includes("Saveurs")) sector = "Restauration & Agro-alimentaire";
        }

        const email = client.email || `${client.contact.toLowerCase().replace(/\s+/g, '.')}@${client.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
        const phone = client.phone || `+243 81 234 ${100 + parseInt(String(client.id), 36) % 1000}`;

        return { sector, localAddress, email, phone };
    };

    return (
        <>
            <PageContainer title="Clients" buttonLabel="Ajouter un Client" onButtonClick={() => setIsAddModalOpen(true)} exportButtonLabel="Exporter en PDF" onExportClick={onExport || onExportClients}>
                {/* Mobile: card layout */}
                <div className="sm:hidden space-y-3">
                    {clients.map(client => (
                        <div key={client.id} className="p-4 bg-white border border-gray-200 rounded-xl">
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-gray-800 truncate">{client.name}</h3>
                                    <p className="text-xs text-gray-500 mt-0.5 truncate">{client.contact}</p>
                                </div>
                                <span className="inline-flex font-semibold text-xs px-2 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg flex-shrink-0">
                                    {client.cases} dossier{client.cases > 1 ? 's' : ''}
                                </span>
                            </div>
                            <div className="mt-3 flex gap-2">
                                <button 
                                    onClick={() => setSelectedClient(client)}
                                    className="flex-1 text-indigo-600 font-bold text-xs bg-indigo-50 hover:bg-indigo-100 py-2 rounded-xl transition"
                                >
                                    Voir
                                </button>
                                {onDeleteClient && (
                                    <button 
                                        onClick={() => onDeleteClient(client.id)}
                                        className="px-3 text-red-500 font-bold text-xs bg-red-50 hover:bg-red-100 py-2 rounded-xl transition"
                                    >
                                        Suppr.
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {clients.length === 0 && (
                        <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="font-semibold">Aucun client</p>
                        </div>
                    )}
                </div>

                {/* Desktop: table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-sm text-gray-600">
                                <th className="p-4 font-semibold">Nom du Client</th>
                                <th className="p-4 font-semibold">Contact Principal</th>
                                <th className="p-4 font-semibold">Dossiers Actifs</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map(client => (
                                <tr key={client.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-800">{client.name}</td>
                                    <td className="p-4 text-gray-600">{client.contact}</td>
                                    <td className="p-4 text-gray-600">
                                        <span className="inline-flex font-semibold text-xs px-2.5 py-1 bg-indigo-50 text-indigo-750 border border-indigo-100 rounded-lg">
                                            {client.cases} dossier{client.cases > 1 ? 's' : ''}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button 
                                            onClick={() => setSelectedClient(client)}
                                            className="text-indigo-600 hover:text-indigo-850 hover:underline font-bold text-sm bg-indigo-50 hover:bg-indigo-100/60 px-3 py-1.5 rounded-xl transition duration-150"
                                        >
                                            Voir
                                        </button>
                                        {onDeleteClient && (
                                            <button 
                                                onClick={() => onDeleteClient(client.id)}
                                                className="ml-2 text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition"
                                            >
                                                Suppr.
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </PageContainer>
            
            <ClientModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={onAddClient} />

            {selectedClient && (() => {
                const details = getClientDetails(selectedClient);
                const clientCases = cases.filter(c => c.client && c.client.toLowerCase() === selectedClient.name.toLowerCase());
                
                return (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-center items-center p-3 sm:p-4">
                        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto m-3 sm:m-0">
                            <div className="flex justify-between items-start mb-4 sm:mb-6 border-b border-gray-100 pb-3 sm:pb-4">
                                <div className="min-w-0 flex-1 pr-2">
                                    <span className="text-2xs font-bold text-indigo-600 uppercase tracking-widest block mb-1">Fiche Client</span>
                                    <h2 className="text-lg sm:text-2xl font-extrabold text-gray-850 truncate">{selectedClient.name}</h2>
                                </div>
                                <button 
                                    onClick={() => setSelectedClient(null)} 
                                    className="p-1.5 hover:bg-slate-100 rounded-xl text-gray-400 hover:text-gray-600 transition flex-shrink-0"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                                <div className="space-y-3 sm:space-y-4">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Secteur</span>
                                        <p className="text-xs sm:text-sm font-semibold text-gray-850">{details.sector}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Siège Social</span>
                                        <p className="text-xs sm:text-sm font-semibold text-gray-850 bg-slate-50 border border-slate-100 p-2 sm:p-2.5 rounded-xl">{details.localAddress}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 sm:space-y-4">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Dirigeant</span>
                                        <p className="text-xs sm:text-sm font-semibold text-indigo-950 flex items-center gap-1.5">
                                            👤 {selectedClient.contact}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Coordonnées</span>
                                        <p className="text-xs text-gray-750 font-medium">📞 {details.phone}</p>
                                        <p className="text-xs text-gray-750 font-medium mt-1 break-all">✉️ {details.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 sm:pt-5">
                                <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest mb-3">
                                    Dossiers liés ({clientCases.length})
                                </h3>

                                {clientCases.length === 0 ? (
                                    <div className="p-4 sm:p-5 text-center bg-gray-50 border border-dashed border-gray-200 rounded-xl text-gray-400 text-xs">
                                        Aucun dossier lié.
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-48 sm:max-h-56 overflow-y-auto pr-1">
                                        {clientCases.map(c => (
                                            <div key={c.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <div>
                                                    <span className="text-2xs font-bold text-slate-450 font-mono tracking-wider block">{c.id}</span>
                                                    <span className="text-xs sm:text-sm font-bold text-gray-800">{c.name}</span>
                                                </div>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide whitespace-nowrap self-start sm:self-auto ${
                                                    c.status === 'En cours' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 
                                                    c.status === 'Clôturé' ? 'bg-green-100 text-green-800 border border-green-200' : 
                                                    c.status === 'Nouveau' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                                                    'bg-yellow-100 text-yellow-800 border border-yellow-250'
                                                }`}>
                                                    {c.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-100 flex justify-end">
                                <button 
                                    onClick={() => setSelectedClient(null)} 
                                    className="bg-slate-100 hover:bg-slate-200 text-gray-800 font-bold py-2 px-4 sm:px-6 rounded-xl transition duration-150 text-xs sm:text-sm"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </>
    );
};

export default ClientsPage;
