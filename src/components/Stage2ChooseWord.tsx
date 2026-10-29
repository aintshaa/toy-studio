import React, { useState } from 'react';
import { ToyItem, DescribingWord, WordCategory } from '../types/toy';
import { ToyCardGraphic } from './ToyCardGraphic';
import { Volume2, Sparkles, ArrowRight, ArrowLeft, Check, Info } from 'lucide-react';
import { playPop, playSparkle, speakWord } from '../utils/audio';

interface Stage2ChooseWordProps {
  selectedToy: ToyItem;
  describingWords: DescribingWord[];
  selectedWord: DescribingWord | null;
  onSelectWord: (word: DescribingWord) => void;
  onNextStage: () => void;
  onPrevStage: () => void;
}

export const Stage2ChooseWord: React.FC<Stage2ChooseWordProps> = ({
  selectedToy,
  describingWords,
  selectedWord,
  onSelectWord,
  onNextStage,
  onPrevStage,
}) => {
  const [activeCategory, setActiveCategory] = useState<WordCategory | 'all'>('all');

  const categories: { key: WordCategory | 'all'; label: string; icon: string }[] = [
    { key: 'all', label: 'All Words', icon: '🌟' },
    { key: 'size', label: 'Size & Length', icon: '📏' },
    { key: 'age_speed', label: 'Speed & Age', icon: '⚡' },
    { key: 'colours', label: 'Pastel Colours', icon: '🎨' },
  ];

  const filteredWords = describingWords.filter((w) => {
    if (activeCategory === 'all') return true;
    return w.category === activeCategory;
  });

  const handleWordClick = (word: DescribingWord) => {
    playSparkle();
    speakWord(word.word);
    onSelectWord(word);
  };

  const handlePhraseSpeech = () => {
    if (!selectedWord) return;
    const phrase = `${selectedWord.article} ${selectedWord.word} ${selectedToy.name.toLowerCase()}`;
    playPop(650);
    speakWord(phrase);
  };

  return (
    <div className="space-y-6">
      {/* Pastel Header Banner */}
      <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-amber-100 rounded-3xl p-5 sm:p-6 border-3 border-purple-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-200 text-purple-950 font-extrabold text-xs uppercase tracking-wider">
            <span>Stage 2</span>
            <span>•</span>
            <span>Describing Words</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-800">
            How would you describe your {selectedToy.name}? 🌸
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl font-medium">
            Choose a describing word (adjective) that matches your toy. Tap any word to hear Teacher say it!
          </p>
        </div>

        <button
          type="button"
          onClick={onPrevStage}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border-2 border-purple-200 font-bold text-sm shadow-xs active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Toy</span>
        </button>
      </div>

      {/* Main Grid: Word Banks on Left + Dynamic Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Visual Word Bank with Picture Cues */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border-3 border-purple-200 shadow-sm space-y-5">
          {/* Category Filter Pills in Pastel styling */}
          <div className="flex flex-wrap items-center gap-2 border-b-2 border-purple-100 pb-4">
            <span className="text-xs font-black uppercase tracking-wider text-purple-400 mr-1">
              Word Bank:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => {
                  playPop();
                  setActiveCategory(cat.key);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all border-2 ${
                  activeCategory === cat.key
                    ? 'bg-purple-300 text-purple-950 border-purple-400 shadow-xs scale-102'
                    : 'bg-purple-50/60 text-purple-800 border-purple-100 hover:bg-purple-100'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Word Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {filteredWords.map((word) => {
              const isSelected = selectedWord?.id === word.id;
              return (
                <div
                  key={word.id}
                  onClick={() => handleWordClick(word)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleWordClick(word);
                    }
                  }}
                  className={`relative p-3.5 rounded-3xl border-3 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-pink-50 border-pink-400 ring-4 ring-pink-200/80 shadow-md scale-102'
                      : 'bg-slate-50/80 border-purple-100 hover:border-pink-200 hover:bg-pink-50/40 hover:shadow-xs'
                  }`}
                >
                  {/* Top: Word + Sound Button */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-display font-black text-xl sm:text-2xl text-slate-800 capitalize">
                      {word.word}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playPop(550);
                        speakWord(word.word);
                      }}
                      className="p-1.5 rounded-full bg-white text-purple-600 border border-purple-200 hover:bg-purple-100"
                      title="Hear teacher's voice"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Picture Cue Visual */}
                  <div className="flex items-center gap-2 my-1">
                    {word.colorSwatch ? (
                      <span
                        className="w-5 h-5 rounded-full border-2 border-white shadow-xs shrink-0"
                        style={{ backgroundColor: word.colorSwatch }}
                      />
                    ) : null}
                    <span className="text-xs text-slate-600 font-semibold leading-tight">
                      {word.visualCue}
                    </span>
                  </div>

                  {/* Grammar Helper Hint: 'a' vs 'an' */}
                  <div className="mt-2 pt-1 border-t border-purple-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">
                      e.g. {word.article} {word.word}
                    </span>
                    {word.article === 'an' && (
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full font-black border border-amber-200">
                        uses 'an'
                      </span>
                    )}
                  </div>

                  {/* Selected Tick */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-pink-400 text-white flex items-center justify-center font-bold text-xs shadow-md">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grammar Tip for Teacher / Pupil */}
          <div className="bg-pink-50/80 rounded-2xl p-3.5 border border-pink-200 flex items-start gap-2.5 text-xs text-purple-950">
            <Info className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold">Grammar Fun Tip:</span> We say{' '}
              <strong className="underline text-purple-700">a</strong> new kite,{' '}
              <strong className="underline text-purple-700">a</strong> fast car, but{' '}
              <strong className="underline text-purple-700">an</strong> old teddy bear or{' '}
              <strong className="underline text-purple-700">an</strong> orange ball because "old" and "orange" begin with vowel sounds!
            </div>
          </div>
        </div>

        {/* Right Side: Dynamic Preview Station in Pastel */}
        <div className="lg:col-span-4 bg-gradient-to-b from-white via-pink-50/40 to-purple-50/50 rounded-3xl p-5 sm:p-6 border-3 border-pink-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-pink-100">
              <span className="text-xs font-black uppercase tracking-wider text-pink-700 bg-pink-100 px-3 py-1 rounded-full">
                Interactive Preview
              </span>
              <span className="text-xs font-semibold text-slate-400">Step 2 of 4</span>
            </div>

            {/* Toy Graphic reflecting chosen adjective */}
            <div className="flex justify-center">
              <ToyCardGraphic
                toy={selectedToy}
                describingWord={selectedWord}
                size="lg"
                selected={true}
              />
            </div>

            {/* Phrase Display Box */}
            <div className="bg-white p-4 rounded-3xl border-2 border-pink-200 shadow-xs text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pupil Phrase
              </span>

              {selectedWord ? (
                <div className="flex items-center justify-center gap-2">
                  <h3 className="font-display font-extrabold text-xl sm:text-2xl text-purple-900">
                    <span className="text-slate-500 font-bold">{selectedWord.article}</span>{' '}
                    <span className="text-pink-600 underline decoration-pink-300">
                      {selectedWord.word}
                    </span>{' '}
                    <span>{selectedToy.name.toLowerCase()}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handlePhraseSpeech}
                    className="p-2 rounded-2xl bg-pink-100 text-pink-700 hover:bg-pink-200 active:scale-95 transition-all"
                    title="Read phrase in teacher's voice"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">
                  Tap any describing word on the left to see the magic happen!
                </p>
              )}
            </div>
          </div>

          {/* Confirm & Go to Sentence Builder Button */}
          <div className="pt-4">
            <button
              type="button"
              disabled={!selectedWord}
              onClick={() => {
                playPop(750);
                onNextStage();
              }}
              className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-display font-black text-lg shadow-sm transition-all ${
                selectedWord
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white cursor-pointer active:scale-98 shadow-pink-200'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>Build My Sentence!</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
