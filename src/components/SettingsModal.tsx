import React, { useState, useEffect } from 'react';
import { X, Trash2, CheckCircle2, Shield, BookOpen, Layers, Check, AlertTriangle } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearHistory: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  recordCount?: number;
  embeddingCount?: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onClearHistory,
  settings,
  onUpdateSettings
}) => {
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [clearedNotification, setClearedNotification] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showConfirmClear) {
          setShowConfirmClear(false);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, showConfirmClear]);

  if (!isOpen) return null;

  const handleToggleSources = () => {
    onUpdateSettings({
      ...settings,
      showSources: !settings.showSources
    });
  };

  const handleToggleProcedural = () => {
    onUpdateSettings({
      ...settings,
      showProceduralGuidance: !settings.showProceduralGuidance
    });
  };

  const handleConfirmClear = () => {
    onClearHistory();
    setShowConfirmClear(false);
    setClearedNotification(true);
    setTimeout(() => {
      setClearedNotification(false);
    }, 2500);
  };

  return (
    <div
      id="settings-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        id="settings-modal-container"
        className="relative w-full max-w-md bg-[#212121] border border-[#3A3A3A] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#ECECEC]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#3A3A3A] flex items-center justify-between bg-[#171717]">
          <div>
            <h2 id="settings-modal-title" className="text-sm font-semibold text-[#ECECEC]">
              Settings & Preferences
            </h2>
            <p className="text-[11px] text-[#8E8E8E]">
              Configure assistant display and local preferences
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8E8E8E] hover:text-[#ECECEC] hover:bg-[#3A3A3A] transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4.5 space-y-4 text-xs text-[#B4B4B4] max-h-[70vh] overflow-y-auto">
          {/* Appearance Section */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider">
              Appearance
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A]">
              <div>
                <div className="font-medium text-[#ECECEC]">Interface Theme</div>
                <div className="text-[11px] text-[#8E8E8E]">ChatGPT-style neutral dark workspace</div>
              </div>
              <div
                role="status"
                aria-label="Interface Theme: Dark Mode Active"
                className="text-[11.5px] text-[#B4B4B4] font-medium px-2.5 py-1 rounded bg-[#171717] border border-[#3A3A3A] flex items-center gap-1.5 select-none"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#8E8E8E]" />
                <span>Dark Mode (Active)</span>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="space-y-2.5 pt-2 border-t border-[#3A3A3A]">
            <div className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider">
              Chat & Citations
            </div>
            
            {/* Show Authoritative Sources Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A]">
              <div>
                <div className="font-medium text-[#ECECEC]">Show Authoritative Sources</div>
                <div className="text-[11px] text-[#8E8E8E]">Display statutory citations and case precedents</div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.showSources}
                aria-label="Toggle display of authoritative sources and citations"
                onClick={handleToggleSources}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    handleToggleSources();
                  }
                }}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-[#8E8E8E] ${
                  settings.showSources ? 'bg-[#8E8E8E]' : 'bg-[#3A3A3A]'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-[#212121] transition-transform absolute top-0.5 ${
                    settings.showSources ? 'left-5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Procedural Checklists & Timelines Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A]">
              <div>
                <div className="font-medium text-[#ECECEC]">Procedural Checklists & Timelines</div>
                <div className="text-[11px] text-[#8E8E8E]">Highlight mandatory steps (48h, 72h, Karnail Singh)</div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.showProceduralGuidance}
                aria-label="Toggle procedural checklists and statutory timelines"
                onClick={handleToggleProcedural}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    handleToggleProcedural();
                  }
                }}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-[#8E8E8E] ${
                  settings.showProceduralGuidance ? 'bg-[#8E8E8E]' : 'bg-[#3A3A3A]'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-[#212121] transition-transform absolute top-0.5 ${
                    settings.showProceduralGuidance ? 'left-5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Knowledge Base Section */}
          <div className="space-y-2.5 pt-2 border-t border-[#3A3A3A]">
            <div className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider">
              Knowledge Base
            </div>
            <div className="p-3 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#ECECEC] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8E8E8E]" />
                  Department NDPS Training Corpus
                </span>
                <span className="text-[11px] text-[#8E8E8E]">Connected</span>
              </div>
              <div className="text-[11.5px] text-[#8E8E8E] leading-relaxed">
                Indexed reference material covering NDPS statutory provisions (Sections 41, 42, 43, 50, 52, 52A, 57, Chapter V-A), procedural manuals, and Supreme Court rulings.
              </div>
            </div>
          </div>

          {/* Session Data / Local Storage */}
          <div className="space-y-2.5 pt-2 border-t border-[#3A3A3A]">
            <div className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider">
              Local Storage
            </div>

            {showConfirmClear ? (
              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-800/40 space-y-2.5 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 text-rose-300 font-semibold text-[12.5px]">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Clear conversation history?</span>
                </div>
                <p className="text-[11.5px] text-[#B4B4B4] leading-relaxed">
                  This will permanently remove your stored local conversations. NDPS reference databases and statutory knowledge base are unaffected.
                </p>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowConfirmClear(false)}
                    className="px-2.5 py-1.5 rounded-md bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#B4B4B4] hover:text-[#ECECEC] border border-[#3A3A3A] text-xs font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmClear}
                    className="px-3 py-1.5 rounded-md bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800/60 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Clear history</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A]">
                <div>
                  <div className="font-medium text-[#ECECEC]">Clear Conversation History</div>
                  <div className="text-[11px] text-[#8E8E8E]">
                    {clearedNotification ? (
                      <span className="text-[#ECECEC] flex items-center gap-1">
                        <Check className="w-3 h-3 text-[#8E8E8E]" /> History successfully cleared
                      </span>
                    ) : (
                      'Permanently delete stored local inquiries'
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmClear(true)}
                  aria-label="Clear conversation history"
                  className="px-2.5 py-1 rounded-md bg-[#171717] hover:bg-rose-950/40 text-rose-300 border border-[#3A3A3A] hover:border-rose-800/50 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Clear</span>
                </button>
              </div>
            )}
          </div>

          {/* About Section */}
          <div className="pt-2 border-t border-[#3A3A3A] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#ECECEC]">NDPS Intelligence</span>
              <span className="text-[11px] font-mono text-[#8E8E8E]">Version 1.0</span>
            </div>
            <p className="text-[11.5px] text-[#8E8E8E] leading-relaxed">
              Investigation & Legal Reference Assistant. All generated responses are grounded strictly in official reference material.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#3A3A3A] bg-[#171717] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#ECECEC] text-xs font-medium border border-[#3A3A3A] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
