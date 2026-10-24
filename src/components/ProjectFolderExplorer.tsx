import React, { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  FileCode2,
  FolderTree,
  RefreshCw,
} from 'lucide-react';
import { ProjectFileEntry } from '../types/depot';
import { formatNumberFr } from '../data/initialDepotData';

export function ProjectFolderExplorer({
  initialSelectedPath,
  onDownloadZip,
}: {
  initialSelectedPath: string | null;
  onDownloadZip: () => void;
}) {
  const [files, setFiles] = useState<ProjectFileEntry[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>('README.md');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/mobile-project/files');
      if (!res.ok) {
        throw new Error(`Erreur HTTP ${res.status}`);
      }
      const data = await res.json();
      const loadedFiles: ProjectFileEntry[] = data.files ?? [];
      setFiles(loadedFiles);
      if (initialSelectedPath && loadedFiles.some((f) => f.relativePath === initialSelectedPath)) {
        setSelectedPath(initialSelectedPath);
      } else if (loadedFiles.length > 0 && !loadedFiles.some((f) => f.relativePath === selectedPath)) {
        setSelectedPath(loadedFiles[0].relativePath);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de charger les fichiers du dossier mobile.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (initialSelectedPath && files.some((f) => f.relativePath === initialSelectedPath)) {
      setSelectedPath(initialSelectedPath);
    }
  }, [initialSelectedPath, files]);

  const activeFile = files.find((f) => f.relativePath === selectedPath) ?? files[0];

  const handleCopyCode = () => {
    if (!activeFile) return;
    navigator.clipboard?.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const totalBytes = files.reduce((sum, f) => sum + f.sizeBytes, 0);

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-[#005CBD]">
            Arborescence Physique Générée dans le Workspace
          </p>
          <h1 className="text-2xl font-bold text-[#0B1C30] tracking-tight">
            Dossier <span className="font-mono text-[#00254B]">depot-manager-mobile/</span>
          </h1>
          <p className="text-sm text-[#43474F]">
            {files.length} fichiers sources React Native + Expo SDK 52 (TypeScript) ·{' '}
            <span className="tabular-nums">{formatNumberFr(Math.round(totalBytes / 1024))} Ko</span>{' '}
            au total · Prêt pour iOS & Android.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={fetchFiles}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#0B1C30] flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Actualiser</span>
          </button>
          <button
            type="button"
            onClick={onDownloadZip}
            className="px-4 py-2.5 rounded-xl bg-[#00254B] hover:bg-[#173B67] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger le dossier complet (.zip)</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-sm text-[#43474F]">
          Chargement de l’arborescence <span className="font-mono">/depot-manager-mobile/</span>...
        </div>
      ) : error ? (
        <div className="bg-[#FFDAD6] text-[#93000A] rounded-2xl p-6 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={fetchFiles}
            className="px-3 py-1.5 rounded-lg bg-white text-xs font-bold text-[#93000A] cursor-pointer"
          >
            Réessayer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Colonne Arborescence */}
          <aside className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B1C30]">
                <FolderTree className="w-4 h-4 text-[#005CBD]" />
                <span>depot-manager-mobile/</span>
              </div>
              <span className="text-[11px] text-[#737780] tabular-nums">
                {files.length} fichiers
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
              {files.map((file) => {
                const active = file.relativePath === activeFile?.relativePath;
                return (
                  <button
                    key={file.relativePath}
                    type="button"
                    onClick={() => setSelectedPath(file.relativePath)}
                    className={`w-full px-4 py-2.5 text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#EFF4FF] text-[#00254B] font-semibold'
                        : 'hover:bg-slate-50 text-[#0B1C30]'
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <FileCode2
                        className={`w-4 h-4 shrink-0 ${
                          active ? 'text-[#005CBD]' : 'text-[#737780]'
                        }`}
                      />
                      <span className="text-xs font-mono truncate">{file.relativePath}</span>
                    </span>
                    <span className="text-[11px] text-[#737780] tabular-nums shrink-0">
                      {(file.sizeBytes / 1024).toFixed(1)} Ko
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Colonne Lecteur de Code */}
          <section className="lg:col-span-8 bg-[#0B1C30] text-slate-100 rounded-2xl overflow-hidden border border-slate-800">
            <div className="px-5 py-3 bg-[#00254B] border-b border-white/10 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-mono font-semibold text-white truncate">
                  depot-manager-mobile/{activeFile?.relativePath}
                </p>
                <p className="text-[11px] text-[#86A6D8]">
                  Langage : {activeFile?.language} · Compatible iOS & Android
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#7FFC97]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié' : 'Copier le fichier'}</span>
              </button>
            </div>

            <pre className="p-5 text-xs font-mono leading-relaxed overflow-x-auto max-h-[640px] overflow-y-auto text-slate-200">
              <code>{activeFile?.content}</code>
            </pre>
          </section>
        </div>
      )}
    </div>
  );
}
