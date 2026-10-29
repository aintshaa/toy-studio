import React, { useState, useRef } from 'react';
import { ToyItem, DescribingWord, ToyLabel, LabelTheme } from '../types/toy';
import { ToyCardGraphic } from './ToyCardGraphic';
import { BONUS_SENTENCES } from '../data/toyData';
import { Volume2, Printer, Pin, ArrowLeft, RefreshCw, PenTool, Sparkles, Heart, Award, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playFanfare, playPop, speakWord } from '../utils/audio';

interface Stage4CreateLabelProps {
  selectedToy: ToyItem;
  selectedWord: DescribingWord;
  builtSentence: string;
  onSaveLabel: (label: ToyLabel) => void;
  onRestart: () => void;
  onPrevStage: () => void;
  onViewGallery: () => void;
}

const POSITIVE_REINFORCEMENTS = [
  'Congratulations, you did it. You are amazing! 🌟',
  'Superstar work! Your toy label looks fantastic! 🌸',
  'Wonderful job! Teacher Nurulain is so proud of you! 💖',
  'You did it! What a brilliant Year 1 toy designer! 🎈',
  'Hooray! That is a super sentence and a lovely label! 🥳',
  'Incredible effort! Your label will shine in our Toy Corner! ✨',
  'Bravo! You are a master toy creator! 🧸',
  'Keep shining! You worked so hard and made something wonderful! 🌈',
  'High five! You created a fabulous toy label! ✋⭐',
  'You are a writing champion! Fantastic job! 🏆',
  'Terrific work! Your toy looks so happy on the shelf! 🎨',
  'Outstanding! You are learning and creating like a star! 🚀',
];

export const Stage4CreateLabel: React.FC<Stage4CreateLabelProps> = ({
  selectedToy,
  selectedWord,
  builtSentence,
  onSaveLabel,
  onRestart,
  onPrevStage,
  onViewGallery,
}) => {
  const [studentName, setStudentName] = useState('My Name');
  const [studentClass, setStudentClass] = useState('Year 1');
  const [selectedTheme, setSelectedTheme] = useState<LabelTheme>('pastelPink');
  const [extraSentence, setExtraSentence] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [reinforcementMessage, setReinforcementMessage] = useState<string | null>(null);
  const lastReinforcementIndex = useRef<number>(-1);

  const themes: { id: LabelTheme; name: string; bgClass: string; borderClass: string; badge: string }[] = [
    {
      id: 'pastelPink',
      name: 'Pastel Pink',
      bgClass: 'bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100',
      borderClass: 'border-pink-300',
      badge: '🌸 Blossom Pink',
    },
    {
      id: 'pastelLavender',
      name: 'Pastel Lavender',
      bgClass: 'bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100',
      borderClass: 'border-purple-300',
      badge: '💜 Soft Lavender',
    },
    {
      id: 'pastelMint',
      name: 'Pastel Mint',
      bgClass: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100',
      borderClass: 'border-emerald-300',
      badge: '🍃 Sweet Mint',
    },
    {
      id: 'pastelButter',
      name: 'Pastel Butter',
      bgClass: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100',
      borderClass: 'border-amber-300',
      badge: '☀️ Butter Sunshine',
    },
    {
      id: 'pastelPeach',
      name: 'Pastel Peach',
      bgClass: 'bg-gradient-to-br from-orange-50 via-rose-50 to-orange-100',
      borderClass: 'border-orange-300',
      badge: '🍑 Juicy Peach',
    },
  ];

  const currentThemeConfig = themes.find((t) => t.id === selectedTheme) || themes[0];

  const handleReadLabel = () => {
    playPop(650);
    const fullSpeech = `Toy: ${selectedToy.name}. Description: ${builtSentence}. ${extraSentence}`;
    speakWord(fullSpeech);
  };

  const handlePrint = () => {
    playPop(600);
    window.print();
  };

  const getRandomDifferentReinforcement = () => {
    let nextIndex = Math.floor(Math.random() * POSITIVE_REINFORCEMENTS.length);
    if (nextIndex === lastReinforcementIndex.current && POSITIVE_REINFORCEMENTS.length > 1) {
      nextIndex = (nextIndex + 1) % POSITIVE_REINFORCEMENTS.length;
    }
    lastReinforcementIndex.current = nextIndex;
    return POSITIVE_REINFORCEMENTS[nextIndex];
  };

  const handleSave = () => {
    playFanfare();
    confetti({
      particleCount: 90,
      spread: 95,
      origin: { y: 0.55 },
    });

    const newLabel: ToyLabel = {
      id: `label-${Date.now()}`,
      studentName: studentName.trim() || 'Pupil',
      studentClass: studentClass.trim() || 'Year 1',
      toyId: selectedToy.id,
      describingWordId: selectedWord.id,
      sentence: builtSentence,
      extraSentence: extraSentence.trim() ? extraSentence.trim() : undefined,
      theme: selectedTheme,
      createdAt: 'Just now',
      likes: 1,
    };

    onSaveLabel(newLabel);
    setIsSaved(true);

    // Pick a DIFFERENT positive reinforcement every time button is pressed
    const nextPraise = getRandomDifferentReinforcement();
    setReinforcementMessage(nextPraise);

    // Speak the encouraging positive reinforcement in Teacher's slow gentle voice!
    speakWord(nextPraise.replace(/[\u{1F300}-\u{1F9FF}]/gu, ''), { rate: 0.72, pitch: 1.18 });
  };

  const handleReplayPraise = () => {
    if (!reinforcementMessage) return;
    playPop(620);
    speakWord(reinforcementMessage.replace(/[\u{1F300}-\u{1F9FF}]/gu, ''), { rate: 0.72, pitch: 1.18 });
  };

  return (
    <div className="space-y-6">
      {/* Pastel Header Banner */}
      <div className="no-print bg-gradient-to-r from-emerald-100 via-pink-100 to-purple-100 rounded-3xl p-5 sm:p-6 border-3 border-emerald-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-200 text-emerald-950 font-extrabold text-xs uppercase tracking-wider">
            <span>Stage 4</span>
            <span>•</span>
            <span>Create My Toy Label</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-800">
            My Toy Label is Ready! 🏷️🌸
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl font-medium">
            Personalize your cute pastel label, add your name, and display it on our class Toy Corner!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevStage}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 font-bold text-sm shadow-xs active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Edit Sentence</span>
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-900 border-2 border-pink-200 font-bold text-sm shadow-xs active:scale-95 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>New Toy</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Label Display Card (Printable) on Left + Customization Studio on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Printable Cute Pastel Toy Label */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div
            id="printable-toy-label"
            className={`w-full max-w-md p-6 sm:p-7 rounded-3xl border-3 shadow-md ${currentThemeConfig.bgClass} ${currentThemeConfig.borderClass} relative transition-all duration-300`}
          >
            {/* Corner Decorative Ribbon */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-300/60 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧸</span>
                <div>
                  <h3 className="font-display font-black text-lg text-slate-800 tracking-wide uppercase leading-tight">
                    Class Toy Corner
                  </h3>
                  <span className="text-[11px] font-bold text-purple-700">Official Toy Label</span>
                </div>
              </div>
              <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-white/95 border border-slate-200 text-slate-700 shadow-xs">
                {currentThemeConfig.badge}
              </span>
            </div>

            {/* Toy Flashcard Visual Showcase */}
            <div className="flex justify-center my-3">
              <ToyCardGraphic
                toy={selectedToy}
                describingWord={selectedWord}
                size="md"
                showSoundButton={false}
                showBadge={false}
              />
            </div>

            {/* Official Label Details */}
            <div className="space-y-3 bg-white/95 backdrop-blur-xs p-4 rounded-3xl border-2 border-slate-200/80 shadow-xs mt-4">
              {/* TOY Line */}
              <div className="flex items-baseline gap-2">
                <span className="font-display font-extrabold text-xs uppercase tracking-wider text-slate-400 w-24 shrink-0">
                  TOY:
                </span>
                <span className="font-display font-black text-xl text-slate-900 uppercase tracking-wide">
                  {selectedToy.name}
                </span>
              </div>

              {/* DESCRIPTION Line */}
              <div className="flex items-start gap-2 pt-1.5 border-t border-slate-100">
                <span className="font-display font-extrabold text-xs uppercase tracking-wider text-slate-400 w-24 shrink-0 pt-0.5">
                  DESCRIPTION:
                </span>
                <span className="font-display font-extrabold text-lg text-purple-700 leading-snug">
                  "{builtSentence}"
                </span>
              </div>

              {/* Optional Extra Sentence for More Proficient Pupils */}
              {extraSentence.trim() && (
                <div className="flex items-start gap-2 pt-1.5 border-t border-slate-100">
                  <span className="font-display font-extrabold text-xs uppercase tracking-wider text-pink-600 w-24 shrink-0 pt-0.5">
                    FAVOURITE:
                  </span>
                  <span className="font-medium text-sm text-slate-700 italic">
                    "{extraSentence.trim()}"
                  </span>
                </div>
              )}

              {/* Pupil Credit Footer */}
              <div className="flex items-center justify-between pt-2.5 border-t-2 border-dashed border-slate-200 text-xs text-slate-600 font-bold">
                <div>
                  <span>Designer: </span>
                  <span className="text-slate-900 font-extrabold underline">{studentName || 'Pupil'}</span>
                </div>
                <div>
                  <span>Class: </span>
                  <span className="text-slate-900 font-extrabold">{studentClass || 'Year 1'}</span>
                </div>
              </div>
            </div>

            {/* Teacher Attribution tag on label */}
            <div className="mt-3 text-center">
              <span className="text-[10px] text-purple-600 font-semibold">
                Classroom Resource by Teacher Nurulain Natasha binti Zakaria
              </span>
            </div>

            {/* Listen button for this label */}
            <div className="no-print mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={handleReadLabel}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white text-purple-800 font-bold text-xs border border-purple-200 hover:bg-purple-50 shadow-xs"
              >
                <Volume2 className="w-4 h-4 text-purple-600" />
                <span>Hear Teacher Read Label</span>
              </button>

              <span className="text-[11px] text-slate-400 font-semibold">
                Ready for display!
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Customization & Teacher / Student Actions */}
        <div className="no-print lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border-3 border-emerald-200 shadow-sm space-y-5">
          {/* Pupil Info Inputs */}
          <div className="space-y-3">
            <h4 className="font-display font-extrabold text-base text-slate-800 flex items-center gap-1.5">
              <span>✏️</span> Pupil Information
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Pupil Name:
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Leo"
                  maxLength={25}
                  className="w-full px-3 py-2 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none font-bold text-sm bg-pink-50/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Class Room:
                </label>
                <input
                  type="text"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  placeholder="e.g. 1 Blue"
                  maxLength={20}
                  className="w-full px-3 py-2 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none font-bold text-sm bg-purple-50/20"
                />
              </div>
            </div>
          </div>

          {/* Cute Pastel Label Theme Picker */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Pick Pastel Theme:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {themes.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => {
                    playPop();
                    setSelectedTheme(th.id);
                  }}
                  className={`p-2 rounded-2xl text-center text-xs font-bold border-2 transition-all ${
                    selectedTheme === th.id
                      ? 'border-purple-400 bg-purple-100 text-purple-950 font-black scale-105 shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {th.name.replace('Pastel ', '')}
                </button>
              ))}
            </div>
          </div>

          {/* More Proficient Pupils: Additional Sentence */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-purple-700 flex items-center gap-1">
                <PenTool className="w-3.5 h-3.5" />
                <span>Bonus Sentence (Proficient Pupils)</span>
              </label>
              <span className="text-[10px] text-slate-400 font-bold">Optional</span>
            </div>

            <p className="text-xs text-slate-500">
              Can you write another sentence about why you like this toy?
            </p>

            <div className="flex flex-wrap gap-1.5 py-1">
              {BONUS_SENTENCES.slice(0, 3).map((sent, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    playPop();
                    setExtraSentence(sent);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-semibold transition-all text-left"
                >
                  + "{sent}"
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              value={extraSentence}
              onChange={(e) => setExtraSentence(e.target.value)}
              placeholder="e.g. It is my favourite toy because it is soft and cuddly!"
              className="w-full px-3 py-2 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none text-xs sm:text-sm font-medium bg-purple-50/20"
            />
          </div>

          {/* Action Buttons & Dynamic Positive Reinforcement */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            {/* Main Pin Button */}
            <button
              type="button"
              onClick={handleSave}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-display font-black text-base shadow-sm transition-all active:scale-98 ${
                isSaved
                  ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 text-white shadow-emerald-200'
                  : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 hover:from-emerald-500 hover:to-teal-500 text-white hover:shadow-md'
              }`}
            >
              <Pin className="w-5 h-5" />
              <span>{isSaved ? 'Pinned! Tap for More Praise ⭐' : 'Pin to Class Toy Corner 📌'}</span>
            </button>

            {/* Positive Reinforcement Banner (Appears after student taps the Pinned button) */}
            {reinforcementMessage && (
              <div
                key={reinforcementMessage}
                className="p-4 rounded-3xl bg-gradient-to-r from-pink-100 via-purple-100 to-amber-100 border-3 border-pink-300 shadow-sm flex items-start gap-3 animate-float-slow transition-all"
              >
                <div className="w-10 h-10 rounded-2xl bg-white shadow-xs border-2 border-pink-200 flex items-center justify-center shrink-0 text-xl">
                  💖
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 bg-white/80 px-2 py-0.5 rounded-full border border-purple-200">
                      Teacher's Praise 🌟
                    </span>
                    <button
                      type="button"
                      onClick={handleReplayPraise}
                      className="flex items-center gap-1 text-[11px] font-bold text-pink-700 hover:text-pink-900 bg-white px-2 py-0.5 rounded-xl border border-pink-200 shadow-2xs hover:bg-pink-50"
                      title="Hear teacher say it again"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Hear Praise</span>
                    </button>
                  </div>
                  <p className="font-display font-extrabold text-base sm:text-lg text-slate-800 leading-snug">
                    "{reinforcementMessage}"
                  </p>
                  <p className="text-[11px] text-purple-600 font-semibold">
                    ✨ Tap the pin button above again anytime for another message!
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 transition-all active:scale-95"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Label</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playPop();
                  onViewGallery();
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-pink-50 hover:bg-pink-100 text-pink-800 font-bold text-xs sm:text-sm border border-pink-200 transition-all active:scale-95"
              >
                <span>View Toy Corner 🏫</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
