import React, { FC } from 'react';
import { DownloadIcon } from './Icons';

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
  buttonLabel?: string;
  onButtonClick?: () => void;
  exportButtonLabel?: string;
  onExportClick?: () => void;
  extraHeaderActions?: React.ReactNode;
}

const PageContainer: FC<PageContainerProps> = ({ title, children, buttonLabel, onButtonClick, exportButtonLabel, onExportClick, extraHeaderActions }) => (
    <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">{title}</h1>
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                {extraHeaderActions}
                {exportButtonLabel && onExportClick && (
                    <button onClick={onExportClick} className="bg-gray-700 text-white font-bold py-2 px-3 sm:px-4 rounded-lg hover:bg-gray-800 transition duration-300 shadow-sm flex items-center text-xs sm:text-sm">
                        <DownloadIcon />
                        <span className="ml-1.5 hidden sm:inline">{exportButtonLabel}</span>
                        <span className="ml-1.5 sm:hidden">PDF</span>
                    </button>
                )}
                {buttonLabel && onButtonClick && (
                    <button onClick={onButtonClick} className="bg-indigo-600 text-white font-bold py-2 px-3 sm:px-4 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-sm flex items-center text-xs sm:text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        <span className="hidden sm:inline">{buttonLabel}</span>
                        <span className="sm:hidden">Ajouter</span>
                    </button>
                )}
            </div>
        </div>
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-md overflow-hidden">
            {children}
        </div>
    </div>
);

export default PageContainer;
