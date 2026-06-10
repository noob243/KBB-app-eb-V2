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
    <header className="bg-white border-b border-gray-100 h-14 sm:h-16 px-3 sm:px-4 md:px-8 flex items-center justify-between shadow-sm relative z-50">
      {/* Global Search Bar */}
      <div ref={containerRef} className="w-full max-w-xl relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
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
            className="block w-full pl-8 sm:pl-10 pr-16 sm:pr-24 py-1.5 sm:py-2 border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs sm:text-sm text-gray-800 placeholder-gray-400"
            placeholder="Rechercher... (⌘K)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 space-x-1">
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 focus:outline-none p-1"
              >
                <svg
                  className="h-3 w-3 sm:h-4 sm:w-4"
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

        {/* Search Results Dropdown Popover - responsive */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 sm:mt-2 bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[80vh] sm:max-h-[85vh] flex flex-col z-50 animate-fade-in">
            {isQueryEmpty ? (
              <div className="p-3 sm:p-5 text-center text-xs sm:text-sm text-gray-400 bg-gray-50/40">
                <p className="font-semibold text-gray-500 mb-1">Recherche globale</p>
                <p className="text-2xs sm:text-xs">Saisissez un mot-clé pour une recherche instantanée.</p>
              </div>
            ) : !hasResults ? (
              <div className="p-4 sm:p-8 text-center text-xs sm:text-sm text-gray-500 bg-gray-50/40">
                <p className="font-medium">Aucun résultat pour « {searchQuery} »</p>
              </div>
            ) : (
              <div className="overflow-y-auto divide-y divide-gray-100 custom-scrollbar max-h-72 sm:max-h-96">
                {/* MATCHED CLIENTS */}
                {matchedClients.length > 0 && (
                  <div className="p-2 sm:p-4">
                    <h3 className="text-2xs font-bold uppercase tracking-widest text-[#15447c] mb-1 sm:mb-2 flex items-center">
                      Clts ({matchedClients.length})
                    </h3>
                    <div className="space-y-0.5 sm:space-y-1">
                      {matchedClients.map((client) => (
                        <button
                          key={client.id}
                          onClick={() => handleResultClick('Clients', client.name)}
                          className="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:bg-indigo-50/50 transition duration-150 flex items-center justify-between group"
                        >
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-indigo-600 truncate">
                              {highlightText(client.name, searchQuery)}
                            </div>
                            <div className="text-2xs sm:text-xs text-gray-400 truncate">
                              {highlightText(client.contact, searchQuery)}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* MATCHED CASES */}
                {matchedCases.length > 0 && (
                  <div className="p-2 sm:p-4">
                    <h3 className="text-2xs font-bold uppercase tracking-widest text-[#15447c] mb-1 sm:mb-2 flex items-center">
                      Dossiers ({matchedCases.length})
                    </h3>
                    <div className="space-y-0.5 sm:space-y-1">
                      {matchedCases.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleResultClick('Cases', c.id)}
                          className="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:bg-indigo-50/50 transition duration-150 flex items-center justify-between group"
                        >
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-indigo-600 truncate">
                              {highlightText(c.name, searchQuery)}
                            </div>
                            <div className="text-2xs sm:text-xs text-gray-400 truncate">
                              {c.client} — <span className="font-mono">{c.id}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* MATCHED EVENTS */}
                {matchedEvents.length > 0 && (
                  <div className="p-2 sm:p-4">
                    <h3 className="text-2xs font-bold uppercase tracking-widest text-[#15447c] mb-1 sm:mb-2 flex items-center">
                      Événements ({matchedEvents.length})
                    </h3>
                    <div className="space-y-0.5 sm:space-y-1">
                      {matchedEvents.map((event) => (
                        <button
                          key={event.id}
                          onClick={() => handleResultClick('Events', event.name)}
                          className="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:bg-indigo-50/50 transition duration-150 flex items-center justify-between group"
                        >
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-indigo-600 truncate">
                              {highlightText(event.name, searchQuery)}
                            </div>
                            <div className="text-2xs sm:text-xs text-gray-400 truncate">
                              {event.date} — {highlightText(event.lieu, searchQuery)}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Context Info - hidden on very small screens */}
      <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0 ml-2">
        <div className="hidden sm:flex sm:flex-col text-right">
          <span className="text-xs font-bold text-gray-800">Jean-Luc Tshisekedi</span>
          <span className="text-3xs font-black tracking-widest text-[#15447c] uppercase">Avocat KBB</span>
        </div>
        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-[#15447c] to-indigo-800 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-md border border-indigo-100 relative flex-shrink-0">
          JT
          <span className="absolute bottom-0 right-0 block h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
        </div>
      </div>
    </header>
  );
};

export default Header;
