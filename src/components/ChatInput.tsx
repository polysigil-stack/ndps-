import React, { useRef, useEffect, useState } from 'react';
import {
  Plus,
  Mic,
  ArrowUp,
  Sparkles,
  SlidersHorizontal,
  ChevronUp,
  X,
  ShieldAlert,
  FileCheck2,
  Scale,
  FlaskConical,
  BookOpen
} from 'lucide-react';
import { VoiceLanguageMode } from '../utils/speechUtils';
import { VoiceLanguageSelector } from './VoiceLanguageSelector';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: (text?: string) => void;
  loading: boolean;
  isThinkingMode?: boolean;
  setIsThinkingMode?: (val: boolean) => void;
  placeholder?: string;
  attachedCaseTitle?: string | null;
  onDetachCase?: () => void;
  onOpenCaseModal?: () => void;
  onAnalyzeFIR?: () => void;
  voiceLanguageMode?: VoiceLanguageMode;
  setVoiceLanguageMode?: (mode: VoiceLanguageMode) => void;
}

const CONTEXT_CATEGORIES = [
  { id: 'search_seizure', label: 'Search & Seizure', icon: ShieldAlert, prompt: 'In the context of search and seizure under NDPS:' },
  { id: 'arrest', label: 'Arrest', icon: Scale, prompt: 'Regarding arrest procedures and Section 52 safeguards under NDPS:' },
  { id: 'sampling', label: 'Sampling', icon: FlaskConical, prompt: 'Regarding sampling, inventory, and Section 52A Magistrate procedures:' },
  { id: 'documentation', label: 'Documentation', icon: FileCheck2, prompt: 'Regarding panchnama, case diaries, and mandatory documentation:' },
  { id: 'procedure', label: 'Procedure', icon: BookOpen, prompt: 'Regarding statutory investigation workflows and procedural timelines:' },
  { id: 'case_law', label: 'Case Law', icon: Scale, prompt: 'Regarding Supreme Court landmark precedents and interpretation of NDPS provisions:' },
  { id: 'investigation', label: 'Investigation', icon: SlidersHorizontal, prompt: 'Regarding financial investigation and forfeiture under Chapter V-A:' },
];

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSend,
  loading,
  isThinkingMode = false,
  setIsThinkingMode,
  placeholder = 'Ask NDPS Intelligence about investigation, procedure, or legal reference...',
  attachedCaseTitle,
  onDetachCase,
  onOpenCaseModal,
  onAnalyzeFIR,
  voiceLanguageMode = 'auto',
  setVoiceLanguageMode
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showContextPopover, setShowContextPopover] = useState(false);
  const [activeContext, setActiveContext] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [localVoiceLang, setLocalVoiceLang] = useState<VoiceLanguageMode>(voiceLanguageMode);
  const recognitionRef = useRef<any>(null);

  const activeVoiceMode = voiceLanguageMode || localVoiceLang;
  const handleLanguageChange = (mode: VoiceLanguageMode) => {
    setLocalVoiceLang(mode);
    if (setVoiceLanguageMode) {
      setVoiceLanguageMode(mode);
    }
  };

  // Auto-resize textarea smoothly
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowAttachMenu(false);
        setShowContextPopover(false);
      }
    };
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showAttachMenu || showContextPopover) {
          setShowAttachMenu(false);
          setShowContextPopover(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [showAttachMenu, showContextPopover]);

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !loading) {
        if (recognitionRef.current && isListening) {
          try { recognitionRef.current.stop(); } catch {}
          setIsListening(false);
        }
        onSend();
      }
    }
  };

  const handleVoiceToggle = () => {
    if (loading) return;
    if (!isListening) {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        try {
          const recognition = new SpeechRecognitionClass();
          // Set recognition language (hi-IN default, en-IN if explicitly English)
          recognition.lang = activeVoiceMode === 'en-IN' ? 'en-IN' : 'hi-IN';
          recognition.continuous = false;
          recognition.interimResults = true;

          let finalTranscript = '';

          recognition.onstart = () => {
            setIsListening(true);
          };
          recognition.onresult = (event: any) => {
            let currentInterim = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
              } else {
                currentInterim += event.results[i][0].transcript;
              }
            }
            const recognizedText = finalTranscript || currentInterim;
            if (recognizedText) {
              setInput(input ? `${input.trim()} ${recognizedText}` : recognizedText);
            }
          };
          recognition.onerror = (err: any) => {
            console.warn('Speech recognition notice:', err);
            setIsListening(false);
          };
          recognition.onend = () => {
            setIsListening(false);
          };

          recognitionRef.current = recognition;
          recognition.start();
        } catch (err) {
          console.warn('Speech recognition not started:', err);
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
    }
  };

  const handleSelectContext = (cat: typeof CONTEXT_CATEGORIES[0]) => {
    setActiveContext(cat.label);
    setShowContextPopover(false);
    if (!input.includes(cat.prompt)) {
      setInput(input ? `${cat.prompt} ${input}` : `${cat.prompt} `);
    }
    textareaRef.current?.focus();
  };

  const hasText = input.trim().length > 0;

  return (
    <div ref={containerRef} className="w-full relative select-none max-w-[750px] mx-auto">
      {/* Investigation Context Popover */}
      {showContextPopover && (
        <div className="absolute bottom-full mb-2 left-10 z-40 w-64 p-2 bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl shadow-xl animate-in fade-in duration-150">
          <div className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider border-b border-[#3A3A3A] mb-1">
            <span>Investigation Context</span>
            <button
              onClick={() => setShowContextPopover(false)}
              className="p-0.5 text-[#8E8E8E] hover:text-[#ECECEC]"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-0.5">
            {CONTEXT_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectContext(cat)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left text-xs text-[#B4B4B4] hover:text-[#ECECEC] hover:bg-[#3A3A3A] transition-colors cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5 text-[#8E8E8E] shrink-0" aria-hidden="true" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Prompt Menu Popup */}
      {showAttachMenu && (
        <div className="absolute bottom-full mb-2 left-2 z-40 w-80 p-2 bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl shadow-xl animate-in fade-in duration-150 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider border-b border-[#3A3A3A] mb-1">
            <span>Investigation Quick Queries</span>
            <button
              onClick={() => setShowAttachMenu(false)}
              className="p-0.5 text-[#8E8E8E] hover:text-[#ECECEC]"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {attachedCaseTitle && (
            <div className="mb-2 pb-2 border-b border-[#3A3A3A]">
              <div className="text-[10.5px] font-medium text-[#8E8E8E] px-2 py-0.5 uppercase tracking-wider">
                Case Queries ({attachedCaseTitle})
              </div>
              <div className="space-y-0.5 mt-1">
                {[
                  { label: 'What was seized in this FIR?', query: 'What was seized in this FIR?' },
                  { label: 'Was sampling mentioned?', query: 'Was sampling mentioned in this FIR?' },
                  { label: 'Was personal search conducted?', query: 'Was personal search conducted in this case?' },
                  { label: 'Was FSL dispatch completed?', query: 'Was FSL dispatch completed in this case?' },
                  { label: 'What sections are mentioned in the FIR?', query: 'What sections are mentioned in the FIR?' },
                  { label: 'Analyze FIR procedural steps', query: 'Analyze FIR and document procedural steps' },
                  { label: 'Which procedures are not established?', query: 'Which procedures are not established from this FIR?' },
                  { label: 'Explain Section 50 in this case', query: 'Explain Section 50 in this case.' },
                ].map((opt, i) => (
                  <button
                    key={`case-${i}`}
                    onClick={() => {
                      setInput(opt.query);
                      setShowAttachMenu(false);
                      textareaRef.current?.focus();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-[#ECECEC] hover:bg-[#3A3A3A] transition-colors cursor-pointer"
                  >
                    <div>{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="text-[10.5px] font-medium text-[#8E8E8E] px-2 py-0.5 uppercase tracking-wider">
              NDPS Statutory Reference
            </div>
            <div className="space-y-0.5 mt-1">
              {[
                { label: 'Section 50 Personal Search Safeguards', query: 'What are the procedural safeguards under Section 50 of the NDPS Act for search of a person?' },
                { label: 'Section 42 Search & Seizure & Karnail Singh', query: 'Explain Section 42 search requirements and Karnail Singh compliance.' },
                { label: 'Section 52A Sampling Before Magistrate', query: 'Explain the mandatory sampling and inventory procedure before a Magistrate under Section 52A.' },
                { label: 'Chapter V-A Property Forfeiture', query: 'Explain the statutory procedure and timeline for property forfeiture under Chapter V-A.' },
              ].map((opt, i) => (
                <button
                  key={`ndps-${i}`}
                  onClick={() => {
                    setInput(opt.query);
                    setShowAttachMenu(false);
                    textareaRef.current?.focus();
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-[#B4B4B4] hover:text-[#ECECEC] hover:bg-[#3A3A3A] transition-colors cursor-pointer"
                >
                  <div>{opt.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Composer Box Container */}
      <div className="relative rounded-2xl bg-[#2F2F2F] border border-[#3A3A3A] focus-within:border-[#8E8E8E] shadow-sm transition-colors duration-150">
        {/* Attached Case or Active Context Tag */}
        {(attachedCaseTitle || activeContext) && (
          <div className="px-3 pt-2.5 flex flex-wrap items-center gap-1.5">
            {attachedCaseTitle && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#242424] border border-[#3A3A3A] text-[11px] font-medium text-[#ECECEC]">
                <button
                  onClick={onOpenCaseModal}
                  className="hover:underline cursor-pointer flex items-center gap-1"
                  title="View case details"
                >
                  <span className="text-[#8E8E8E]">📎</span>
                  <span>FIR: {attachedCaseTitle}</span>
                </button>
                {onAnalyzeFIR && (
                  <button
                    type="button"
                    onClick={onAnalyzeFIR}
                    className="ml-1 text-[10px] text-[#B4B4B4] hover:text-[#ECECEC] bg-[#333333] px-1.5 py-0.2 rounded hover:bg-[#404040] cursor-pointer"
                    title="Analyze procedural steps in FIR"
                  >
                    Analyze
                  </button>
                )}
                {onDetachCase && (
                  <button
                    onClick={onDetachCase}
                    className="text-[#8E8E8E] hover:text-[#ECECEC] cursor-pointer ml-0.5"
                    title="Detach FIR from chat"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </span>
            )}

            {activeContext && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] text-[11px] font-medium text-[#B4B4B4]">
                <span>Context: {activeContext}</span>
                <button
                  onClick={() => setActiveContext(null)}
                  className="hover:text-[#ECECEC] cursor-pointer"
                  title="Remove context"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Textarea Input */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="w-full bg-transparent text-[#ECECEC] placeholder-[#8E8E8E] text-sm sm:text-[14.5px] px-3.5 pt-3 pb-2 focus:outline-none resize-none max-h-[180px] leading-relaxed select-text"
          aria-label="NDPS query input"
        />

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between px-3 pb-2.5 pt-0.5">
          {/* Left Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Quick Prompts (+) */}
            <button
              type="button"
              onClick={() => {
                setShowAttachMenu(!showAttachMenu);
                setShowContextPopover(false);
              }}
              className="p-1.5 rounded-lg text-[#8E8E8E] hover:text-[#ECECEC] hover:bg-[#3A3A3A] transition-colors cursor-pointer"
              title="Quick query templates"
              aria-label="Insert quick query template"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Investigation Context Popover Toggle */}
            <button
              type="button"
              onClick={() => {
                setShowContextPopover(!showContextPopover);
                setShowAttachMenu(false);
              }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium text-[#B4B4B4] hover:text-[#ECECEC] hover:bg-[#3A3A3A] transition-colors cursor-pointer"
              title="Select investigation domain context"
            >
              <SlidersHorizontal className="w-3 h-3 text-[#8E8E8E]" aria-hidden="true" />
              <span className="hidden sm:inline">Investigation Context</span>
            </button>

            {/* Deep Analysis Toggle */}
            {setIsThinkingMode && (
              <button
                type="button"
                onClick={() => setIsThinkingMode(!isThinkingMode)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isThinkingMode
                    ? 'bg-[#3A3A3A] text-[#ECECEC] border border-[#8E8E8E] shadow-xs'
                    : 'text-[#B4B4B4] hover:text-[#ECECEC] hover:bg-[#3A3A3A]'
                }`}
                title="Enable deep statutory analysis and multi-record synthesis"
              >
                <Sparkles className="w-3 h-3 text-[#8E8E8E]" aria-hidden="true" />
                <span className="hidden sm:inline">Deep Analysis</span>
              </button>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Voice Language Mode Selector */}
            <VoiceLanguageSelector
              value={activeVoiceMode}
              onChange={handleLanguageChange}
            />

            {/* Voice Dictation */}
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isListening
                  ? 'text-rose-400 bg-rose-950/40 border border-rose-800/40 animate-pulse'
                  : 'text-[#8E8E8E] hover:text-[#ECECEC] hover:bg-[#3A3A3A]'
              }`}
              title={
                isListening
                  ? activeVoiceMode === 'hi-IN'
                    ? 'Stop Hindi voice input'
                    : 'Stop voice input'
                  : activeVoiceMode === 'hi-IN'
                  ? 'Start Hindi voice input'
                  : 'Start voice input'
              }
              aria-label={
                isListening
                  ? activeVoiceMode === 'hi-IN'
                    ? 'Stop Hindi voice input'
                    : 'Stop voice input'
                  : activeVoiceMode === 'hi-IN'
                  ? 'Start Hindi voice input'
                  : 'Start voice input'
              }
            >
              <Mic className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Send Button */}
            <button
              type="button"
              onClick={() => hasText && !loading && onSend()}
              disabled={!hasText || loading}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer ${
                hasText && !loading
                  ? 'bg-[#ECECEC] text-[#212121] hover:bg-white shadow-xs'
                  : 'bg-[#3A3A3A] text-[#8E8E8E] cursor-not-allowed opacity-60'
              }`}
              title="Send query (Enter)"
              aria-label="Send query"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
