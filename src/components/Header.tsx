import React, { FC, useState, useEffect, useRef } from 'react';
import { Client, Case, Event } from '../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clients: Client[];
  cases: Case[];
  events: Event[];
  setCurrentPage: (page: string) => void;
}

const highlightText = (text: string, query: string) => {
  if (!query.trim()) return <>{text}</>;
  const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <strong key={i} className="font-extrabold text-indigo-750 bg-indigo-50 px-0.5 rounded-sm">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

const Header: FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  clients,
  cases,
  events,
  setCurrentPage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K / ⌘K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter lists based on input query for the dropdown autocomplete
  const isQueryEmpty = searchQuery.trim() === '';
  
  const matchedClients = isQueryEmpty
    ? []
    : clients.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.contact.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const matchedCases = isQueryEmpty
    ? []
    : cases.filter(
        (c) =>
          c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.client.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const matchedEvents = isQueryEmpty
    ? []
    : events.filter(
        (e) =>
          e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.lieu.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const hasResults =
    matchedClients.length > 0 || matchedCases.length > 0 || matchedEvents.length > 0;

  const handleResultClick = (targetPage: string, filterValue: string) => {
    setSearchQuery(filterValue);
    setCurrentPage(targetPage);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 px-8 flex items-center justify-between shadow-sm relative z-40">
      {/* Global Search Bar */}
      <div ref={containerRef} className="w-full max-w-xl relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            className="block w-full pl-10 pr-24 py-2 border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm text-gray-800 placeholder-gray-400"
            placeholder="Rechercher clients, dossiers, événements... (⌘K)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-100 rounded border border-gray-200">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Search Results Dropdown Popover */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[85vh] flex flex-col z-50 animate-fade-in">
            {isQueryEmpty ? (
              <div className="p-5 text-center text-sm text-gray-400 bg-gray-50/40">
                <p className="font-semibold text-gray-500 mb-1">Recherche globale intelligente</p>
                <p className="text-xs">Saisissez un mot-clé pour lancer une recherche instantanée dans toute l'application.</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <span className="px-2 py-1 bg-white border border-gray-100 rounded-md text-[10px] text-gray-500 font-medium">Clients par Nom/Contact</span>
                  <span className="px-2 py-1 bg-white border border-gray-100 rounded-md text-[10px] text-gray-500 font-medium">Dossiers par Réf./Titre</span>
                  <span className="px-2 py-1 bg-white border border-gray-100 rounded-md text-[10px] text-gray-500 font-medium">Événements par Nom/Lieu</span>
                </div>
              </div>
            ) : !hasResults ? (
              <div className="p-8 text-center text-sm text-gray-500 bg-gray-50/40">
                <svg
                  className="mx-auto h-8 w-8 text-gray-300 mb-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="font-medium">Aucun résultat trouvé pour « {searchQuery} »</p>
                <p className="text-xs text-gray-400 mt-1">Vérifiez l'orthographe ou essayez un autre mot-clé.</p>
              </div>
            ) : (
              <div className="overflow-y-auto divide-y divide-gray-100 custom-scrollbar max-h-96">
                {/* MATCHED CLIENTS */}
                {matchedClients.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-2xs font-bold uppercase tracking-widest text-[#15447c] mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1.5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.684v-.005z" />
                      </svg>
                      Clients ({matchedClients.length})
                    </h3>
                    <div className="space-y-1">
                      {matchedClients.map((client) => (
                        <button
                          key={client.id}
                          onClick={() => handleResultClick('Clients', client.name)}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-50/50 transition duration-150 flex items-center justify-between group"
                        >
                          <div>
                            <div className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600">
                              {highlightText(client.name, searchQuery)}
                            </div>
                            <div className="text-xs text-gray-400">
                              Contact : {highlightText(client.contact, searchQuery)}
                            </div>
                          </div>
                          <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg group-hover:bg-indigo-100 group-hover:text-indigo-700 transition">
                            Voir Client
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* MATCHED CASES */}
                {matchedCases.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-2xs font-bold uppercase tracking-widest text-[#15447c] mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1.5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                      Dossiers ({matchedCases.length})
                    </h3>
                    <div className="space-y-1">
                      {matchedCases.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleResultClick('Dossiers', c.id)}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-50/50 transition duration-150 flex items-center justify-between group"
                        >
                          <div>
                            <div className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 flex items-center gap-2">
                              {highlightText(c.name, searchQuery)}
                              <span className="font-mono text-xs text-gray-400 font-normal">({highlightText(c.id, searchQuery)})</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Client : {highlightText(c.client, searchQuery)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-2xs font-semibold ${
                              c.status === 'En cours' ? 'bg-blue-50 text-blue-700 border border-blue-150' : 
                              c.status === 'Clôturé' ? 'bg-green-50 text-green-700 border border-green-150' : 
                              c.status === 'Nouveau' ? 'bg-purple-50 text-purple-700 border border-purple-150' :
                              'bg-yellow-50 text-yellow-700 border border-yellow-150'
                            }`}>
                              {c.status}
                            </span>
                            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg group-hover:bg-indigo-100 group-hover:text-indigo-700 transition">
                              Gérer
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* MATCHED EVENTS */}
                {matchedEvents.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-2xs font-bold uppercase tracking-widest text-[#15447c] mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1.5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75" />
                      </svg>
                      Événements ({matchedEvents.length})
                    </h3>
                    <div className="space-y-1">
                      {matchedEvents.map((event) => (
                        <button
                          key={event.id}
                          onClick={() => handleResultClick('Evenements', event.name)}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-50/50 transition duration-150 flex items-center justify-between group"
                        >
                          <div>
                            <div className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600">
                              {highlightText(event.name, searchQuery)}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-3">
                              <span>📅 {event.date}</span>
                              <span>📍 {highlightText(event.lieu, searchQuery)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-2xs font-medium">
                              {highlightText(event.type, searchQuery)}
                            </span>
                            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg group-hover:bg-indigo-100 group-hover:text-indigo-700 transition">
                              Voir Détails
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="bg-slate-50 border-t border-slate-100 p-2.5 px-4 text-center text-3xs text-gray-400 font-bold uppercase tracking-wider flex justify-between items-center">
              <span>Résultats de recherche rapides</span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1 bg-white border border-gray-150 rounded text-4xs">Esc</kbd> pour fermer
              </span>
            </div>
          </div>
        )}
      </div>

      {/* User Context Info (Right Side of Header) */}
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex flex-col text-right">
          <span className="text-sm font-bold text-slate-800 font-outfit">Jean-Luc Tshisekedi</span>
          <span className="text-3xs font-black tracking-widest text-slate-500 uppercase">Avocat Associé KBB</span>
        </div>
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-md border border-slate-700 relative font-outfit">
          JT
          <span className="absolute -bottom-1 -right-1 block h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"></span>
        </div>
      </div>
    </header>
  );
};

export default Header;
