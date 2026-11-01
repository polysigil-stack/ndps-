import React, { useState, useEffect } from 'react';
import { Message, SourceCitation } from '../types';
import {
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCw,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Clock,
  CheckCircle2,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Square
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { CitationCard } from './CitationCard';
import { Logo } from './Logo';
import { globalSpeechController, VoiceLanguageMode } from '../utils/speechUtils';

interface MessageItemProps {
  message: Message;
  showSources?: boolean;
  showProceduralGuidance?: boolean;
  voiceLanguageMode?: VoiceLanguageMode;
  previousUserLanguage?: 'hi-IN' | 'en-IN';
  onRegenerate?: (content: string) => void;
  onViewSource?: (citation: SourceCitation) => void;
  onSelectQuery?: (query: string) => void;
}

// Generate contextual related questions based on message content
function getContextualRelatedQuestions(content: string, citations: SourceCitation[]): string[] {
  const lower = content.toLowerCase();
  
  // Guard against suggestions during initial patrolling guidance, workflow pending, or clarification questions
  if (
    lower.includes('clarifying question') ||
    lower.includes('did the patrolling team') ||
    lower.includes('workflow') ||
    lower.includes('patrolling')
  ) {
    return [];
  }

  const suggestions: string[] = [];

  if (lower.includes('section 50') || lower.includes('personal search')) {
    suggestions.push('Does Section 50 apply to search of bags, luggage, or vehicles?');
    suggestions.push('What is the consequence of non-compliance with Section 50?');
    suggestions.push('What are the strict requirements for searching a female suspect under Section 50(4)?');
  } else if ((lower.includes('section 42') || lower.includes('sec 42') || lower.includes('sec. 42')) && !lower.includes('patrol')) {
    suggestions.push('What are the exceptions to recording information in writing under the Section 42 proviso?');
    suggestions.push('Explain compliance with sending copy to official superior within 72 hours under Section 42(2).');
    suggestions.push('How does Karnail Singh Constitution Bench clarify Section 42 compliance?');
  } else if (lower.includes('section 52a') || lower.includes('52a') || (lower.includes('sample') && lower.includes('magistrate'))) {
    suggestions.push('What is the evidentiary status of samples drawn without Magistrate certification under 52A?');
    suggestions.push('Explain Union of India v. Mohanlal guidelines for Section 52A.');
    suggestions.push('What is the mandatory timeline for presenting inventory to the Magistrate?');
  } else if (lower.includes('chapter v-a') || lower.includes('68f') || lower.includes('freezing order')) {
    suggestions.push('What is the 48-hour confirmation requirement for freezing orders under Section 68F?');
    suggestions.push('Who is the Competent Authority for property forfeiture under Chapter V-A?');
    suggestions.push('What is the burden of proof on the accused under Section 68J?');
  } else if (lower.includes('section 67') || lower.includes('confession under 67')) {
    suggestions.push('Is a statement recorded under Section 67 admissible as a confession after Tofan Singh?');
    suggestions.push('Can an officer summon and examine any person under Section 67 during inquiry?');
  } else if (lower.includes('section 37') || lower.includes('bail under 37')) {
    suggestions.push('What are the twin conditions for grant of bail under Section 37?');
    suggestions.push('How is commercial quantity calculated for mixtures and preparations?');
  } else {
    return [];
  }

  return suggestions.slice(0, 3);
}

// Extract contextual procedural checklist/statutory timeline guidance
function getProceduralTimelineGuidance(content: string): { title: string; steps: string[] } | null {
  const lower = content.toLowerCase();

  // Do NOT display procedural checklists for initial patrolling inquiries, clarification questions, or unresolved workflows
  if (
    lower.includes('clarifying question') ||
    lower.includes('did the patrolling team') ||
    lower.includes('patrolling') ||
    lower.includes('workflow')
  ) {
    return null;
  }

  // Section 42 statutory checklist only when Section 42 is the affirmative subject of guidance
  if (
    (lower.includes('section 42 statutory') || lower.includes('guidance (section 42') || lower.includes('section 42 compliance') || lower.includes('section 42 ndps act')) &&
    !lower.includes('patrol')
  ) {
    return {
      title: 'Section 42 Statutory Timelines & Safeguards',
      steps: [
        'Record secret information in writing or record grounds of belief prior to search/entry (proviso).',
        'Send copy of information / grounds to immediate official superior within 72 hours under Section 42(2).',
        'Total non-compliance vitiates trial; substantial compliance permitted in emergent cases (Karnail Singh).'
      ]
    };
  }
  if (lower.includes('section 50 mandatory') || lower.includes('section 50 safeguards') || lower.includes('personal search procedure')) {
    return {
      title: 'Section 50 Mandatory Personal Search Procedure',
      steps: [
        'Inform the person of statutory right to be searched before a Gazetted Officer or Magistrate (Section 50(1)).',
        'If suspect requests, take suspect to nearest Gazetted Officer or Magistrate without unnecessary delay.',
        'Search of a female suspect must be strictly conducted by a female officer (Section 50(4)).'
      ]
    };
  }
  if (lower.includes('section 52a statutory') || lower.includes('52a protocol') || (lower.includes('52a') && lower.includes('sampling protocol'))) {
    return {
      title: 'Section 52A Statutory Disposal & Sampling Protocol',
      steps: [
        'Prepare detailed inventory of seized contraband with markings, batches, weights and photographs.',
        'Apply to the Judicial Magistrate for certifying inventory correctness and certifying seizure photographs.',
        'Draw representative samples strictly in presence of Magistrate; certified inventory is primary evidence (Mohanlal).'
      ]
    };
  }
  if (lower.includes('section 57 reporting') || lower.includes('section 57 mandate') || (lower.includes('section 57') && lower.includes('48 hours'))) {
    return {
      title: 'Section 57 Reporting Mandate',
      steps: [
        'Make a full report of all particulars of arrest or seizure to immediate official superior within 48 hours.'
      ]
    };
  }
  if (lower.includes('chapter v-a') && (lower.includes('freezing order') || lower.includes('forfeiture safeguards'))) {
    return {
      title: 'Chapter V-A Forfeiture & Freezing Safeguards',
      steps: [
        'Pass reasoned freezing order for illegally acquired property under Section 68F(1).',
        'Send copy of freezing order to Competent Authority within 48 hours for confirmation under Section 68F(2).'
      ]
    };
  }
  return null;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  showSources = true,
  showProceduralGuidance = true,
  voiceLanguageMode = 'auto',
  previousUserLanguage,
  onRegenerate,
  onViewSource,
  onSelectQuery
}) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'helpful' | 'unhelpful' | null>(null);
  const [playbackState, setPlaybackState] = useState<'idle' | 'playing' | 'paused'>('idle');

  useEffect(() => {
    const unsubscribe = globalSpeechController.subscribe((state) => {
      if (state.messageId === message.id) {
        setPlaybackState(state.status);
      } else {
        setPlaybackState('idle');
      }
    });
    return () => {
      unsubscribe();
    };
  }, [message.id]);

  const handlePlaySpeech = () => {
    globalSpeechController.speak(message.id, message.content, {
      userInput: message.userQuery,
      assistantResponse: message.content,
      responseLanguage: message.responseLanguage,
      selectedVoiceLanguage: voiceLanguageMode,
      previousUserLanguage
    });
  };

  const handlePauseSpeech = () => {
    globalSpeechController.pause();
  };

  const handleResumeSpeech = () => {
    globalSpeechController.resume();
  };

  const handleStopSpeech = () => {
    globalSpeechController.stop();
  };

  const isAssistant = message.role === 'assistant';
  const isUnavailable =
    message.content.includes('not available in the provided NDPS reference material') ||
    message.content.includes('not available in the provided reference');

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(message.content);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = message.content;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // User Message: Unobtrusive, clean bubble with high-contrast text
  if (!isAssistant) {
    return (
      <div id={`message-${message.id}`} className="py-2.5 px-4 max-w-[780px] mx-auto w-full flex justify-end">
        <div className="max-w-[85%] sm:max-w-[75%] bg-[#2F2F2F] border border-[#3A3A3A] text-[#ECECEC] rounded-2xl px-4 py-2.5 text-[15px] sm:text-[15.5px] font-normal leading-[1.5] select-text shadow-xs">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  // Assistant Message: Clean legal research document presentation
  const citationsList: SourceCitation[] = message.citations || message.sources || [];
  const hasCitations = citationsList.length > 0;
  const relatedQuestions = message.related_questions !== undefined
    ? message.related_questions
    : getContextualRelatedQuestions(message.content, citationsList);
  const proceduralGuidance = getProceduralTimelineGuidance(message.content);

  return (
    <div
      id={`message-${message.id}`}
      className="py-4 px-4 max-w-[780px] mx-auto w-full group select-text"
    >
      <div className="flex items-start gap-3.5">
        {/* Subtle Assistant Brand Mark */}
        <div className="shrink-0 mt-1">
          <Logo size="xs" collapsed={true} showSubtitle={false} />
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0 space-y-3.5">
          {/* Subtle Identity Label */}
          <div className="flex items-center gap-2 select-none">
            <span className="font-semibold text-[13.5px] text-[#ECECEC]">NDPS Intelligence</span>
          </div>

          {/* Off-domain Refusal notice if applicable */}
          {isUnavailable && (
            <div className="p-3.5 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] text-[#ECECEC] text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#8E8E8E] shrink-0 mt-0.5" aria-hidden="true" />
              <p className="leading-relaxed">
                This inquiry falls outside authorized NDPS statutory provisions, procedural manuals, and precedent knowledge base.
              </p>
            </div>
          )}

          {/* Pathway Selector UI */}
          {message.pathway_selector && onSelectQuery && (
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => onSelectQuery('Information-based recovery')}
                className="w-full text-left p-3 rounded-xl bg-[#2A2A2A] border border-[#3A3A3A] hover:bg-[#353535] hover:border-[#4A4A4A] transition-all cursor-pointer group/path"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold group-hover/path:bg-blue-500/20">A</div>
                  <div>
                    <div className="text-[14.5px] font-semibold text-[#ECECEC]">Information-based recovery</div>
                    <div className="text-xs text-[#8E8E8E]">Information or intelligence was received before the search.</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => onSelectQuery('Chance recovery')}
                className="w-full text-left p-3 rounded-xl bg-[#2A2A2A] border border-[#3A3A3A] hover:bg-[#353535] hover:border-[#4A4A4A] transition-all cursor-pointer group/path"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold group-hover/path:bg-emerald-500/20">B</div>
                  <div>
                    <div className="text-[14.5px] font-semibold text-[#ECECEC]">Chance recovery</div>
                    <div className="text-xs text-[#8E8E8E]">Suspected substance was unexpectedly discovered during routine activity.</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => onSelectQuery('Other situation')}
                className="w-full text-left p-3 rounded-xl bg-[#2A2A2A] border border-[#3A3A3A] hover:bg-[#353535] hover:border-[#4A4A4A] transition-all cursor-pointer group/path"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 font-bold group-hover/path:bg-orange-500/20">C</div>
                  <div>
                    <div className="text-[14.5px] font-semibold text-[#ECECEC]">Other / Not sure</div>
                    <div className="text-xs text-[#8E8E8E]">Circumstances are unclear or the case does not fit either description.</div>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Markdown Content */}
          <div className="text-[15px] sm:text-[15.5px] leading-[1.65] text-[#ECECEC] font-normal">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-[17px] sm:text-[18px] font-semibold text-[#ECECEC] mt-5 mb-2.5 leading-[1.35] tracking-tight border-b border-[#3A3A3A] pb-1.5">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-[15.5px] sm:text-[16.5px] font-semibold text-[#ECECEC] mt-4 mb-2 leading-[1.35] tracking-tight">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-[14.5px] sm:text-[15px] font-semibold text-[#ECECEC] mt-3.5 mb-1.5 leading-[1.35] tracking-tight">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-3.5 leading-[1.65] text-[#ECECEC] last:mb-0">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-outside ml-4 mb-3.5 space-y-1.5 text-[#ECECEC] marker:text-[#8E8E8E]">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-outside ml-4 mb-3.5 space-y-1.5 text-[#ECECEC] marker:text-[#8E8E8E]">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-[1.65] pl-0.5">
                    {children}
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-[#ECECEC]">
                    {children}
                  </strong>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-[#8E8E8E] pl-3.5 my-3 text-[#B4B4B4] italic text-[13.5px] bg-[#2A2A2A] py-1 rounded-r-md">
                    {children}
                  </blockquote>
                ),
                pre: ({ children }) => (
                  <pre className="template-code my-3.5 p-3.5 sm:p-4 rounded-xl bg-[#1E1E1E] border border-[#3A3A3A] text-[#ECECEC] text-[13.5px] sm:text-[14px] shadow-xs">
                    {children}
                  </pre>
                ),
                code: ({ children, className }: any) => {
                  const isBlock = Boolean(className) || (typeof children === 'string' && children.includes('\n'));
                  if (isBlock) {
                    return (
                      <code className="template-code text-inherit bg-transparent p-0 border-0 text-[13.5px] sm:text-[14px]">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="px-1.5 py-0.5 rounded bg-[#2F2F2F] text-[#ECECEC] font-mono text-[12.5px] border border-[#3A3A3A]">
                      {children}
                    </code>
                  );
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Optional Sources Button (Only visible on explicit user action) */}
          {showSources && hasCitations && onViewSource && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => onViewSource(citationsList[0])}
                className="inline-flex items-center gap-1.5 text-xs text-[#B4B4B4] hover:text-[#ECECEC] hover:underline cursor-pointer py-1 px-1 transition-colors group/src"
              >
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                <span>View sources →</span>
              </button>
            </div>
          )}

          {/* Procedural Checklists & Timelines Section (Optional Setting) */}
          {showProceduralGuidance && proceduralGuidance && !isUnavailable && (
            <div className="pt-3 border-t border-[#3A3A3A] space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#B4B4B4] uppercase tracking-wider select-none">
                <Clock className="w-3.5 h-3.5 text-[#8E8E8E]" aria-hidden="true" />
                <span>{proceduralGuidance.title}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] space-y-2">
                <ul className="space-y-1.5 text-xs text-[#B4B4B4]">
                  {proceduralGuidance.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8E8E8E] shrink-0 mt-0.5" />
                      <span className="text-[#ECECEC]">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Related Questions Section */}
          {!isUnavailable && relatedQuestions.length > 0 && onSelectQuery && (
            <div className="pt-3 border-t border-[#3A3A3A] space-y-1.5">
              <div className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider select-none">
                Related Inquiries
              </div>
              <div className="flex flex-col space-y-1">
                {relatedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectQuery(q)}
                    className="flex items-center gap-2 text-left text-xs text-[#B4B4B4] hover:text-[#ECECEC] py-1 px-2 rounded-md hover:bg-[#2A2A2A] transition-colors cursor-pointer group/btn"
                  >
                    <ArrowRight className="w-3 h-3 text-[#8E8E8E] group-hover/btn:text-[#ECECEC] shrink-0" aria-hidden="true" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action Controls */}
          <div className="flex items-center justify-between pt-1 select-none">
            <div className="flex items-center gap-1 text-[#8E8E8E]">
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 rounded text-[#8E8E8E] hover:text-[#ECECEC] hover:bg-[#2A2A2A] transition-colors cursor-pointer"
                title={copied ? 'Copied to clipboard' : 'Copy answer'}
                aria-label="Copy response"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#ECECEC]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              {/* Read Aloud Play / Pause / Resume / Stop Controls */}
              {playbackState === 'playing' && (
                <>
                  <button
                    type="button"
                    onClick={handlePauseSpeech}
                    className="p-1 rounded text-[#ECECEC] bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors cursor-pointer"
                    title="Pause reading"
                    aria-label="Pause response speech"
                  >
                    <Pause className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                  <button
                    type="button"
                    onClick={handleStopSpeech}
                    className="p-1 rounded text-[#8E8E8E] hover:text-[#ECECEC] hover:bg-[#2A2A2A] transition-colors cursor-pointer"
                    title="Stop reading"
                    aria-label="Stop response speech"
                  >
                    <Square className="w-3.5 h-3.5 text-rose-400" />
                  </button>
                </>
              )}

              {playbackState === 'paused' && (
                <>
                  <button
                    type="button"
                    onClick={handleResumeSpeech}
                    className="p-1 rounded text-[#ECECEC] bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors cursor-pointer"
                    title="Resume reading"
                    aria-label="Resume response speech"
                  >
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                  <button
                    type="button"
                    onClick={handleStopSpeech}
                    className="p-1 rounded text-[#8E8E8E] hover:text-[#ECECEC] hover:bg-[#2A2A2A] transition-colors cursor-pointer"
                    title="Stop reading"
                    aria-label="Stop response speech"
                  >
                    <Square className="w-3.5 h-3.5 text-rose-400" />
                  </button>
                </>
              )}

              {playbackState === 'idle' && (
                <button
                  type="button"
                  onClick={handlePlaySpeech}
                  className="p-1 rounded text-[#8E8E8E] hover:text-[#ECECEC] hover:bg-[#2A2A2A] transition-colors cursor-pointer"
                  title="Read aloud (Hindi/English Text-to-Speech)"
                  aria-label="Read response aloud"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setFeedback(feedback === 'helpful' ? null : 'helpful')}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  feedback === 'helpful' ? 'text-[#ECECEC] bg-[#2A2A2A]' : 'text-[#8E8E8E] hover:text-[#ECECEC] hover:bg-[#2A2A2A]'
                }`}
                title="Helpful response"
                aria-label="Thumbs up"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setFeedback(feedback === 'unhelpful' ? null : 'unhelpful')}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  feedback === 'unhelpful' ? 'text-rose-400 bg-rose-950/40' : 'text-[#8E8E8E] hover:text-[#ECECEC] hover:bg-[#2A2A2A]'
                }`}
                title="Not helpful"
                aria-label="Thumbs down"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>

              {onRegenerate && (
                <button
                  type="button"
                  onClick={() => onRegenerate(message.content)}
                  className="p-1 rounded text-[#8E8E8E] hover:text-[#ECECEC] hover:bg-[#2A2A2A] transition-colors cursor-pointer"
                  title="Regenerate answer"
                  aria-label="Regenerate"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <span className="text-[11px] text-[#8E8E8E] font-mono">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
