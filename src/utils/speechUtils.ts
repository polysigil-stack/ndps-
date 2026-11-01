/**
 * NDPS Intelligence Speech & Voice Utilities
 * Speech Recognition (STT) and Speech Synthesis (TTS) with Hindi (hi-IN), English (en-IN), and Auto detection.
 */

export type VoiceLanguageMode = 'auto' | 'hi-IN' | 'en-IN';

export interface TTSPlaybackState {
  messageId: string | null;
  status: 'idle' | 'playing' | 'paused';
}

export interface SelectTTSLanguageOptions {
  userInput?: string;
  assistantResponse?: string;
  responseLanguage?: 'auto' | 'hi' | 'en';
  selectedVoiceLanguage?: VoiceLanguageMode; // 'auto' | 'hi-IN' | 'en-IN'
  previousUserLanguage?: 'hi-IN' | 'en-IN';
}

// Deterministic Hinglish signals (distinctive Hindi postpositions, connectives, verbs, questions)
const HINGLISH_SIGNALS = new Set([
  'kya', 'kaise', 'kaun', 'konsa', 'kis', 'kab', 'kahan', 'kyun', 'kyu', 'kyunki',
  'agar', 'fir', 'phir', 'jab', 'tab', 'mujhe', 'batao', 'samjhao', 'chahiye', 'karna',
  'hota', 'hoga', 'hai', 'tha', 'thi', 'thee', 'hain', 'iska', 'isme', 'usme',
  'wala', 'wali', 'wale', 'mein', 'ke', 'ki', 'ka', 'ko', 'se', 'par', 'liye',
  'kitna', 'kitne', 'aur', 'ya', 'bhi', 'nahi', 'nahin', 'karni', 'karne', 'kare',
  'hua', 'hui', 'huye', 'ho', 'raha', 'rahi', 'rahe', 'hoti', 'hote', 'hotā',
  'tak', 'toh', 'jaise', 'apna', 'apne', 'apni', 'hogi', 'hoge', 'bataiye', 'karo',
  'samjhaao', 'sath', 'saath', 'paas', 'baad', 'pehle', 'andar', 'undar', 'dhara', 'dharā',
  'talashi', 'talaashi', 'panchnama', 'zabt', 'giraftari', 'aaropi', 'gawah', 'milega',
  'dena', 'tahat', 'dauran', 'kabza', 'hefazat', 'namuna', 'nakal', 'mauke'
]);

/**
 * Detects whether a text is Hindi (Devanagari script or Hinglish) vs pure English.
 * Returns 'hi-IN' for Hindi/Hinglish, and 'en-IN' for pure English.
 */
export function detectLanguage(text: string): 'hi-IN' | 'en-IN' {
  if (!text || !text.trim()) return 'hi-IN';

  // 1. Devanagari script check
  const devanagariRegex = /[\u0900-\u097F]/;
  if (devanagariRegex.test(text)) {
    return 'hi-IN';
  }

  const lowerText = text.toLowerCase();

  const hinglishPhrases = [
    'kya hota hai', 'kaise kare', 'kya documents chahiye', 'hindi me batao', 'hinglish me batao',
    'hinglish mein', 'hindi mein', 'batao', 'samjhao', 'chahiye', 'kaun kaun', 'kya details',
    'kya hai', 'kya hota', 'kaise hota'
  ];
  if (hinglishPhrases.some(phrase => lowerText.includes(phrase))) {
    return 'hi-IN';
  }

  // 2. Tokenize and count distinct Hinglish signals
  const words = lowerText
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  let hinglishCount = 0;
  for (const word of words) {
    if (HINGLISH_SIGNALS.has(word)) {
      hinglishCount++;
    }
  }

  // If at least 1 distinct Hinglish signal is present, classify as hi-IN
  if (hinglishCount >= 1) {
    return 'hi-IN';
  }

  return 'en-IN';
}

/**
 * Selects the TTS speech language prioritizing:
 * 1. Explicit user selection (VoiceLanguageSelector: 'hi-IN' or 'en-IN')
 * 2. Effective response language from backend ('hi' -> 'hi-IN', 'en' -> 'en-IN')
 * 3. Assistant response language content
 * 4. User input language
 * 5. Default fallback ('en-IN')
 */
export function selectTTSLanguage(options: SelectTTSLanguageOptions): 'hi-IN' | 'en-IN' {
  const { userInput, assistantResponse, responseLanguage, selectedVoiceLanguage, previousUserLanguage } = options;

  // 1. Explicit voice language selector override
  if (selectedVoiceLanguage === 'hi-IN') return 'hi-IN';
  if (selectedVoiceLanguage === 'en-IN') return 'en-IN';

  // 2. Effective response language from server (source of truth)
  if (responseLanguage === 'hi') return 'hi-IN';
  if (responseLanguage === 'en') return 'en-IN';

  // 3. Fallback to Assistant Response content language
  if (assistantResponse && assistantResponse.trim().length > 0) {
    if (detectLanguage(assistantResponse) === 'hi-IN') {
      return 'hi-IN';
    }
  }

  // 4. Fallback to User Input language if present
  if (userInput && userInput.trim().length > 0) {
    const inputLang = detectLanguage(userInput);
    if (inputLang === 'hi-IN') return 'hi-IN';

    const words = userInput.trim().toLowerCase().split(/\s+/);
    if (words.length <= 4 && previousUserLanguage === 'hi-IN') {
      return 'hi-IN';
    }

    return 'en-IN';
  }

  return previousUserLanguage || 'en-IN';
}

/**
 * Clean text for Speech Synthesis read-aloud (strips markdown, links, citations, tables).
 * Preserves legal section names, document names, Devanagari text, and numbers.
 */
export function cleanTextForTTS(text: string): string {
  if (!text) return '';

  return text
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code ticks
    .replace(/`([^`]+)`/g, '$1')
    // Remove markdown headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove raw citation brackets [Source...], [Record...], [1], [2]
    .replace(/\[(?:Source|Record|\d+)[^\]]*\]/gi, '')
    // Remove markdown table formatting lines
    .replace(/^\|.*\|$/gm, (match) => {
      // Extract text inside cells
      return match.split('|').filter(Boolean).join('. ');
    })
    .replace(/[-|:]{3,}/g, '')
    // Remove bold and italic markers
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    .replace(/_{1,3}([^_]+)_{1,3}/g, '$1')
    .replace(/~{2}([^~]+)~{2}/g, '$1')
    // Remove blockquote markers
    .replace(/^>\s+/gm, '')
    // Remove list bullet points (- , * , 1. , a) )
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+[\.\)]\s+/gm, '')
    // Normalize multiple newlines to clause breaks
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ' ')
    // Normalize multiple spaces
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Finds the preferred SpeechSynthesis voice for Hindi (hi-IN) or English (en-IN).
 * Safely falls back if specific locale voice is unavailable.
 */
export function getPreferredSpeechVoice(
  modeOptions: SelectTTSLanguageOptions
): { voice: SpeechSynthesisVoice | null; lang: 'hi-IN' | 'en-IN' } {
  const resolvedLang = selectTTSLanguage(modeOptions);

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { voice: null, lang: resolvedLang };
  }

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    return { voice: null, lang: resolvedLang };
  }

  if (resolvedLang === 'hi-IN') {
    // 1. Exact hi-IN match
    let matched = voices.find(
      (v) => v.lang === 'hi-IN' || v.lang === 'hi_IN'
    );
    // 2. Starts with hi
    if (!matched) {
      matched = voices.find((v) => v.lang.toLowerCase().startsWith('hi'));
    }
    // 3. Name contains Hindi or hi
    if (!matched) {
      matched = voices.find(
        (v) =>
          v.name.toLowerCase().includes('hindi') ||
          v.name.toLowerCase().includes('hi-in')
      );
    }
    // 4. Graceful fallback if no Hindi voice installed
    return { voice: matched || null, lang: 'hi-IN' };
  } else {
    // English preference (en-IN first, then any en)
    let matched = voices.find(
      (v) => v.lang === 'en-IN' || v.lang === 'en_IN'
    );
    if (!matched) {
      matched = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
    }
    return { voice: matched || null, lang: 'en-IN' };
  }
}

/**
 * Global Speech Synthesis Controller Singleton
 * Enforces single-message speech playback across the entire app.
 */
type PlaybackListener = (state: TTSPlaybackState) => void;

class GlobalSpeechController {
  private currentMessageId: string | null = null;
  private currentStatus: 'idle' | 'playing' | 'paused' = 'idle';
  private listeners: Set<PlaybackListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Warm up voices load
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }

  public subscribe(listener: PlaybackListener): () => void {
    this.listeners.add(listener);
    listener({ messageId: this.currentMessageId, status: this.currentStatus });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const state: TTSPlaybackState = {
      messageId: this.currentMessageId,
      status: this.currentStatus,
    };
    this.listeners.forEach((fn) => fn(state));
  }

  public speak(
    messageId: string,
    rawText: string,
    ttsOptions: SelectTTSLanguageOptions
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    // Stop ongoing speech
    window.speechSynthesis.cancel();

    const cleanText = cleanTextForTTS(rawText);
    if (!cleanText) return;

    const { voice, lang } = getPreferredSpeechVoice(ttsOptions);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang;
    utterance.rate = 0.98; // Natural pace for legal dictation
    utterance.pitch = 1.0;

    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      this.currentMessageId = messageId;
      this.currentStatus = 'playing';
      this.notify();
    };

    utterance.onend = () => {
      if (this.currentMessageId === messageId) {
        this.currentMessageId = null;
        this.currentStatus = 'idle';
        this.notify();
      }
    };

    utterance.onerror = (err) => {
      console.warn('Speech synthesis notice:', err);
      if (this.currentMessageId === messageId) {
        this.currentMessageId = null;
        this.currentStatus = 'idle';
        this.notify();
      }
    };

    this.currentMessageId = messageId;
    this.currentStatus = 'playing';
    this.notify();

    window.speechSynthesis.speak(utterance);
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      this.currentStatus = 'paused';
      this.notify();
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      this.currentStatus = 'playing';
      this.notify();
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentMessageId = null;
      this.currentStatus = 'idle';
      this.notify();
    }
  }

  public getStatus(): TTSPlaybackState {
    return { messageId: this.currentMessageId, status: this.currentStatus };
  }
}

export const globalSpeechController = new GlobalSpeechController();
