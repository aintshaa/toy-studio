/**
 * Audio synthesis for Year 1 pupils:
 * 1. Web Audio API for playful, gentle sound effects (pops, chimes, celebration).
 * 2. Web Speech API configured with a woman's clear, warm, slow-paced English voice tailored for Year 1 pupils.
 */

let audioCtx: AudioContext | null = null;
let isMuted = false;
let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setMuted(muted: boolean) {
  isMuted = muted;
  if (muted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function getIsMuted(): boolean {
  return isMuted;
}

export function playPop(freq = 440) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}

export function playChime() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + idx * 0.08;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.16, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.35);
  });
}

export function playGentleOops() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.linearRampToValueAtTime(240, now + 0.22);

  gain.gain.setValueAtTime(0.14, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.25);
}

export function playFanfare() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [
    { freq: 523.25, time: 0.0, dur: 0.12 },
    { freq: 659.25, time: 0.12, dur: 0.12 },
    { freq: 783.99, time: 0.24, dur: 0.16 },
    { freq: 1046.5, time: 0.40, dur: 0.45 },
  ];

  notes.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + time;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + dur);
  });
}

export function playSparkle() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const arpeggio = [800, 1100, 1400, 1800];

  arpeggio.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + idx * 0.05;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.1, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + 0.18);
  });
}

/**
 * Find a gentle female English voice suitable for Year 1 pupils.
 */
function findFemaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  if (!voices || voices.length === 0) return undefined;

  // List of known high-quality female English voice names across OS/browsers
  const femaleVoicePatterns = [
    'female',
    'samantha',
    'victoria',
    'karen',
    'moira',
    'fiona',
    'tessa',
    'zira',
    'jenny',
    'hazel',
    'susan',
    'catherine',
    'serena',
    'ava',
    'allison',
    'google uk english female',
    'google us english female',
    'natural',
  ];

  const englishVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));

  // 1. First priority: English voice matching female keywords
  for (const pattern of femaleVoicePatterns) {
    const found = englishVoices.find((v) => v.name.toLowerCase().includes(pattern));
    if (found) return found;
  }

  // 2. Second priority: UK English voice
  const ukVoice = englishVoices.find((v) => v.lang.toLowerCase() === 'en-gb');
  if (ukVoice) return ukVoice;

  // 3. Any English voice
  return englishVoices[0];
}

/**
 * Text-to-Speech using a slow-paced woman's voice tailored for Year 1 pupils.
 */
export function speakWord(
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    onEnd?: () => void;
  }
) {
  if (isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (options?.onEnd) options.onEnd();
    return;
  }

  // Cancel any previous speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-GB';
  // Slow paced for Year 1 early learners (0.72 speed is clear, patient and easy to follow)
  utterance.rate = options?.rate ?? 0.72;
  // Warm, friendly female pitch
  utterance.pitch = options?.pitch ?? 1.15;

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  const femaleVoice = findFemaleVoice(voices);
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  if (options?.onEnd) {
    utterance.onend = () => options.onEnd?.();
    utterance.onerror = () => options.onEnd?.();
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
