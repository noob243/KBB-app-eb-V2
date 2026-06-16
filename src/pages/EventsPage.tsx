import React, { FC, useState } from 'react';
import PageContainer from '../components/PageContainer';
import EventModal from '../components/modals/EventModal';
import { Event, EventReport } from '../types';

interface EventsPageProps {
  events: Event[];
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onDeleteEvent?: (id: string) => void;
  onUpdateEvent?: (event: Event) => void;
}

const EventsPage: FC<EventsPageProps> = ({ events, onAddEvent, onDeleteEvent, onUpdateEvent }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const handleSaveEvent = (event: Omit<Event, 'id'>) => {
        onAddEvent(event);
    };

    return (
        <>
            <PageContainer title="Événements" buttonLabel="Créer un Événement" onButtonClick={() => setIsAddModalOpen(true)}>
                {/* Cards for mobile */}
                <div className="sm:hidden space-y-3">
                    {events.map(event => (
                        <div key={event.id} className="p-4 bg-white border border-gray-200 rounded-xl" onClick={() => setSelectedEvent(event)}>
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-gray-800">{event.name}</p>
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{event.type}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{event.date} • {event.lieu}</p>
                        </div>
                    ))}
                     {events.length === 0 && (
                        <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed">
                            <p className="font-semibold">Aucun événement</p>
                        </div>
                    )}
                </div>

                {/* Table for desktop */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-sm text-gray-600">
                                <th className="p-4 font-semibold">Nom</th>
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
                                    <td className="p-4"><span className="px-2 py-1 text-xs font-semibold text-indigo-800 bg-indigo-100 rounded-full">{event.type}</span></td>
                                    <td className="p-4 text-gray-600">{event.date}</td>
                                    <td className="p-4 text-gray-600">{event.lieu}</td>
                                    <td className="p-4">
                                        <button onClick={() => setSelectedEvent(event)} className="text-indigo-600 font-bold text-sm bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition">
                                            Détails
                                        </button>
                                        {onDeleteEvent && (
                                            <button onClick={() => onDeleteEvent(event.id)} className="ml-2 text-red-500 font-bold text-sm bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition">
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
            
            <EventModal 
                isOpen={isAddModalOpen || selectedEvent !== null} 
                onClose={() => { setIsAddModalOpen(false); setSelectedEvent(null); }} 
                onSave={(e) => {
                    if(onUpdateEvent && selectedEvent) onUpdateEvent(e as Event)
                    else handleSaveEvent(e)
                }} 
                eventData={selectedEvent}
            />
        </>
    );
};

export default EventsPage;
