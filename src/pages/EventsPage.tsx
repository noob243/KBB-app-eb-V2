import React, { FC, useState } from 'react';
import PageContainer from '../components/PageContainer';
import EventModal from '../components/modals/EventModal';
import { Event, Avocat, EventReport } from '../types';

interface EventsPageProps {
  events: Event[];
  onAddEvent: (event: Event) => void;
  onUpdateEvent?: (event: Event) => void;
  avocats?: Avocat[];
}

const EventsPage: FC<EventsPageProps> = ({ events, onAddEvent, onUpdateEvent, avocats = [] }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    return (
        <>
            <PageContainer 
                title="Événements" 
                buttonLabel="Créer un Événement" 
                onButtonClick={() => setIsAddModalOpen(true)}
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-sm text-gray-600">
                                <th className="p-4 font-semibold">Nom de l'événement</th>
                                <th className="p-4 font-semibold">Type</th>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Lieu</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(event => (
                                <tr key={event.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-800">{event.name}</td>
                                    <td className="p-4 text-gray-600">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                                            event.type === 'Audience' ? 'bg-red-55/70 text-red-800 border-red-200' :
                                            event.type === 'Conférence' ? 'bg-indigo-55/70 text-indigo-800 border border-indigo-200' :
                                            event.type === 'Colloque' ? 'bg-teal-55/70 text-teal-800 border border-teal-200' :
                                            'bg-gray-200 text-gray-750 border border-gray-300'
                                        }`}>
                                            {event.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600 font-medium">{event.date}</td>
                                    <td className="p-4 text-gray-600">{event.lieu}</td>
                                    <td className="p-4">
                                        <button 
                                            onClick={() => setSelectedEvent(event)}
                                            className="text-indigo-600 hover:text-indigo-850 hover:underline font-bold text-sm bg-indigo-50 hover:bg-indigo-100/60 px-3 py-1.5 rounded-xl transition duration-150"
                                        >
                                            Détails
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </PageContainer>
            
            <EventModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={onAddEvent} avocats={avocats} />

            {selectedEvent && (
                 <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-center items-center p-3 sm:p-4">
                 <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-xl w-full animate-fadeIn flex flex-col max-h-[95vh] sm:max-h-[90vh]">
                     <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-3 shrink-0">
                         <div>
                             <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                                 selectedEvent.type === 'Audience' ? 'bg-red-50 text-red-700 border border-red-100' :
                                 selectedEvent.type === 'Conférence' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                 'bg-teal-50 text-teal-700 border border-teal-100'
                             }`}>
                                 {selectedEvent.type}
                             </span>
                             <h2 className="text-xl font-extrabold text-gray-850 leading-tight">{selectedEvent.name}</h2>
                             <p className="text-2xs font-mono text-gray-400 mt-1">ID : {selectedEvent.id}</p>
                         </div>
                         <button 
                             onClick={() => setSelectedEvent(null)} 
                             className="p-1 hover:bg-slate-100 rounded-xl text-gray-400 hover:text-gray-600 transition"
                         >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                             </svg>
                         </button>
                     </div>
                     <div className="space-y-4 overflow-y-auto pr-1 flex-1 custom-scrollbar pb-4">
                        <p>Details de l'evenement...</p>
                     </div>
                     <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 shrink-0">
                         <button 
                             onClick={() => setSelectedEvent(null)} 
                             className="bg-slate-105 hover:bg-slate-200 text-gray-700 font-bold py-2 px-5 rounded-xl transition text-xs border border-gray-200"
                         >
                             Fermer
                         </button>
                     </div>
                 </div>
             </div>
            )}
        </>
    );
};

export default EventsPage;