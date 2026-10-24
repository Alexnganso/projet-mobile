import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { StudioTabId } from './types/depot';
import { MobileSimulatorWorkspace } from './components/MobileSimulatorWorkspace';
import { ProjectFolderExplorer } from './components/ProjectFolderExplorer';
import {
  DeploymentGuideView,
  TechChoiceView,
} from './components/TechChoiceAndDeployViews';

export default function App() {
  const [activeTab, setActiveTab] = useState<StudioTabId>('simulator');
  const [selectedMobileFile, setSelectedMobileFile] = useState<string | null>(
    'README.md'
  );

  const handleDownloadZip = () => {
    const link = document.createElement('a');
    link.href = '/api/mobile-project/download-zip';
    link.download = 'depot-manager-mobile-ios-android.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInspectFile = (relativePath: string) => {
    setSelectedMobileFile(relativePath);
    setActiveTab('folder');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF] text-[#0B1C30]">
      {/* Top Bar Contract : 3 zones strictes séparées par gap-8 */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1 : Brand wordmark (1 seul élément texte) */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('simulator');
            }}
            className="text-base sm:text-lg font-extrabold tracking-tight text-[#00254B] whitespace-nowrap shrink-0"
          >
            DepotManager Mobile
          </a>

          {/* Zone 2 : 4 liens de navigation concis sur 1 ligne */}
          <nav className="flex items-center gap-5 sm:gap-7 overflow-x-auto no-scrollbar text-xs sm:text-sm font-medium text-[#43474F]">
            {(
              [
                { id: 'simulator', label: 'Simulateur Mobile' },
                { id: 'folder', label: 'Dossier Projet' },
                { id: 'comparison', label: 'Choix du Langage' },
                { id: 'deploy', label: 'Déploiement iOS/Android' },
              ] as const
            ).map((nav) => {
              const active = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  type="button"
                  onClick={() => setActiveTab(nav.id)}
                  className={`py-5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'border-[#005CBD] text-[#00254B] font-bold'
                      : 'border-transparent hover:text-[#0B1C30]'
                  }`}
                >
                  {nav.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3 : 1 action primaire */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={handleDownloadZip}
              className="px-3.5 sm:px-4 py-2 rounded-lg bg-[#00254B] hover:bg-[#173B67] text-white text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger .zip</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1">
        {activeTab === 'simulator' && (
          <MobileSimulatorWorkspace
            onInspectMobileFile={handleInspectFile}
            onDownloadZip={handleDownloadZip}
          />
        )}

        {activeTab === 'folder' && (
          <ProjectFolderExplorer
            initialSelectedPath={selectedMobileFile}
            onDownloadZip={handleDownloadZip}
          />
        )}

        {activeTab === 'comparison' && (
          <TechChoiceView
            onOpenFolderTab={() => setActiveTab('folder')}
            onDownloadZip={handleDownloadZip}
          />
        )}

        {activeTab === 'deploy' && (
          <DeploymentGuideView onDownloadZip={handleDownloadZip} />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-5 px-4 sm:px-6">
        <div className="max-w-[1380px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#737780]">
          <span>DepotManager Mobile · Architecture React Native & Expo (iOS / Android)</span>
          <button
            type="button"
            onClick={() => setActiveTab('folder')}
            className="text-[#005CBD] hover:underline font-medium cursor-pointer"
          >
            Parcourir /depot-manager-mobile/
          </button>
        </div>
      </footer>
    </div>
  );
}
