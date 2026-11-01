import React, { useState, useRef, useEffect } from 'react';
import { Languages, ChevronDown, Check } from 'lucide-react';
import { VoiceLanguageMode } from '../utils/speechUtils';

interface VoiceLanguageSelectorProps {
  value: VoiceLanguageMode;
  onChange: (mode: VoiceLanguageMode) => void;
  compact?: boolean;
}

const LANGUAGE_OPTIONS: { id: VoiceLanguageMode; label: string; sublabel: string; badge: string }[] = [
  { id: 'auto', label: 'Auto Detect', sublabel: 'Auto Hindi/English voice', badge: 'Auto' },
  { id: 'hi-IN', label: 'Hindi (हिन्दी)', sublabel: 'hi-IN Voice Input & TTS', badge: 'हिन्दी' },
  { id: 'en-IN', label: 'English (Indian)', sublabel: 'en-IN Voice Input & TTS', badge: 'EN' },
];

export const VoiceLanguageSelector: React.FC<VoiceLanguageSelectorProps> = ({
  value,
  onChange,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const activeOption = LANGUAGE_OPTIONS.find((o) => o.id === value) || LANGUAGE_OPTIONS[0];

  return (
    <div ref={containerRef} className="relative inline-block text-left select-none">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium text-[#B4B4B4] hover:text-[#ECECEC] hover:bg-[#3A3A3A] transition-colors cursor-pointer border border-transparent focus:outline-hidden ${
          isOpen ? 'bg-[#3A3A3A] text-[#ECECEC]' : ''
        }`}
        title={`Voice Language Mode: ${activeOption.label}`}
        aria-label={`Voice language selector. Current: ${activeOption.label}`}
        aria-expanded={isOpen}
      >
        <Languages className="w-3.5 h-3.5 text-[#8E8E8E]" aria-hidden="true" />
        <span className="font-mono text-[11px] font-semibold text-[#ECECEC]">{activeOption.badge}</span>
        <ChevronDown className="w-3 h-3 text-[#8E8E8E]" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-1.5 left-0 z-50 w-52 p-1.5 bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl shadow-xl animate-in fade-in duration-150">
          <div className="px-2 py-1 text-[10.5px] font-semibold text-[#8E8E8E] uppercase tracking-wider border-b border-[#3A3A3A] mb-1">
            Voice Language Mode
          </div>
          <div className="space-y-0.5">
            {LANGUAGE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onChange(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                  value === opt.id
                    ? 'bg-[#3A3A3A] text-[#ECECEC] font-medium'
                    : 'text-[#B4B4B4] hover:text-[#ECECEC] hover:bg-[#3A3A3A]/60'
                }`}
              >
                <div>
                  <div className="leading-snug">{opt.label}</div>
                  <div className="text-[10px] text-[#8E8E8E]">{opt.sublabel}</div>
                </div>
                {value === opt.id && <Check className="w-3.5 h-3.5 text-[#ECECEC] shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
