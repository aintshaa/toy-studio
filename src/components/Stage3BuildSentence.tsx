import React, { useState, useEffect } from 'react';
import { ToyItem, DescribingWord } from '../types/toy';
import { ToyCardGraphic } from './ToyCardGraphic';
import { Volume2, ArrowRight, ArrowLeft, RotateCcw, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playChime, playGentleOops, playPop, speakWord } from '../utils/audio';

interface Stage3BuildSentenceProps {
  selectedToy: ToyItem;
  selectedWord: DescribingWord;
  onSentenceComplete: (sentence: string) => void;
  onNextStage: () => void;
  onPrevStage: () => void;
}

export const Stage3BuildSentence: React.FC<Stage3BuildSentenceProps> = ({
  selectedToy,
  selectedWord,
  onSentenceComplete,
  onNextStage,
  onPrevStage,
}) => {
  const targetArticle = selectedWord.article; // 'a' or 'an'
  const fullTargetSentence = `It's ${targetArticle} ${selectedWord.word} ${selectedToy.name.toLowerCase()}.`;

  // Bank of available tiles
  const initialBank = [
    { id: 'tile-its', word: "It's" },
    { id: 'tile-a', word: 'a' },
    { id: 'tile-an', word: 'an' },
    { id: 'tile-adj', word: selectedWord.word },
    { id: 'tile-toy', word: selectedToy.name.toLowerCase() },
    { id: 'tile-dot', word: '.' },
  ];

  const [placedTiles, setPlacedTiles] = useState<{ id: string; word: string }[]>([]);
  const [availableBank, setAvailableBank] = useState<{ id: string; word: string }[]>(initialBank);
  const [feedback, setFeedback] = useState<{ type: 'neutral' | 'success' | 'hint' | 'error'; message: string }>({
    type: 'neutral',
    message: 'Tap the words below in order to build your sentence!',
  });
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    setPlacedTiles([]);
    setAvailableBank(initialBank);
    setIsCorrect(false);
    setFeedback({
      type: 'neutral',
      message: 'Tap the words below in order to build your sentence!',
    });
  }, [selectedToy.id, selectedWord.id]);

  const handlePlaceWord = (tile: { id: string; word: string }) => {
    playPop(520);
    speakWord(tile.word);

    const nextPlaced = [...placedTiles, tile];
    const nextBank = availableBank.filter((t) => t.id !== tile.id);

    setPlacedTiles(nextPlaced);
    setAvailableBank(nextBank);

    checkCurrentSentence(nextPlaced);
  };

  const handleRemoveWord = (tile: { id: string; word: string }) => {
    playPop(420);
    const nextPlaced = placedTiles.filter((t) => t.id !== tile.id);
    const nextBank = [...availableBank, tile];

    setPlacedTiles(nextPlaced);
    setAvailableBank(nextBank);

    setIsCorrect(false);
    checkCurrentSentence(nextPlaced);
  };

  const handleReset = () => {
    playPop(400);
    setPlacedTiles([]);
    setAvailableBank(initialBank);
    setIsCorrect(false);
    setFeedback({
      type: 'neutral',
      message: 'Try again! Start with "It\'s".',
    });
  };

  const checkCurrentSentence = (currentPlaced: { id: string; word: string }[]) => {
    const words = currentPlaced.map((t) => t.word);

    if (words.length === 0) {
      setFeedback({
        type: 'neutral',
        message: 'Tap the words below in order to build your sentence!',
      });
      return;
    }

    if (words[0] !== "It's") {
      playGentleOops();
      setFeedback({
        type: 'error',
        message: 'Remember: In Year 1, our toy sentence begins with "It\'s"!',
      });
      return;
    }

    if (words.length >= 2) {
      const second = words[1];
      if (second !== 'a' && second !== 'an') {
        playGentleOops();
        setFeedback({
          type: 'error',
          message: 'After "It\'s", do we need "a" or "an"? Tap one to choose!',
        });
        return;
      }

      if (second !== targetArticle) {
        playGentleOops();
        setFeedback({
          type: 'error',
          message:
            targetArticle === 'an'
              ? `Watch out! "${selectedWord.word}" starts with a vowel sound, so we use "an" instead of "a"!`
              : `Watch out! "${selectedWord.word}" starts with a consonant sound, so we use "a" instead of "an"!`,
        });
        return;
      }
    }

    if (words.length >= 3) {
      const third = words[2];
      if (third === selectedToy.name.toLowerCase()) {
        playGentleOops();
        setFeedback({
          type: 'error',
          message: `In English, the describing word comes first! Say "${selectedWord.word} ${selectedToy.name.toLowerCase()}", not "${selectedToy.name.toLowerCase()} ${selectedWord.word}".`,
        });
        return;
      }
      if (third !== selectedWord.word) {
        playGentleOops();
        setFeedback({
          type: 'hint',
          message: `Now place your describing word: "${selectedWord.word}".`,
        });
        return;
      }
    }

    if (words.length >= 4) {
      const fourth = words[3];
      if (fourth !== selectedToy.name.toLowerCase()) {
        playGentleOops();
        setFeedback({
          type: 'hint',
          message: `Almost there! Now add your toy: "${selectedToy.name.toLowerCase()}".`,
        });
        return;
      }
    }

    if (words.length === 5) {
      const fifth = words[4];
      if (fifth === '.') {
        setIsCorrect(true);
        playChime();
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
        });
        onSentenceComplete(fullTargetSentence);
        setFeedback({
          type: 'success',
          message: `Brilliant! You made: "${fullTargetSentence}" 🌸`,
        });
        // Teacher's gentle slow voice reads the sentence
        speakWord(fullTargetSentence, { rate: 0.72 });
        return;
      }
    }

    if (words.length < 5) {
      setFeedback({
        type: 'neutral',
        message: 'Looking great! Keep going...',
      });
    }
  };

  const handleReadFullSentence = () => {
    if (placedTiles.length === 0) return;
    const text = placedTiles
      .map((t) => t.word)
      .join(' ')
      .replace(' .', '.');
    playPop(650);
    speakWord(text);
  };

  return (
    <div className="space-y-6">
      {/* Pastel Header Banner */}
      <div className="bg-gradient-to-r from-sky-100 via-purple-100 to-pink-100 rounded-3xl p-5 sm:p-6 border-3 border-sky-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-200 text-sky-950 font-extrabold text-xs uppercase tracking-wider">
            <span>Stage 3</span>
            <span>•</span>
            <span>Sentence Builder</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-800">
            Build the Sentence! 🧩✨
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl font-medium">
            Arrange the word tiles in order to make a complete sentence. Tap any word to hear Teacher pronounce it!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevStage}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 font-bold text-sm shadow-xs active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border-2 border-amber-200 font-bold text-sm shadow-xs active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Builder Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Sentence Dropzone & Word Bank */}
        <div className="lg:col-span-8 space-y-6">
          {/* Sentence Track */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-3 border-sky-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                Sentence Track:
              </span>
              {placedTiles.length > 0 && (
                <button
                  type="button"
                  onClick={handleReadFullSentence}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-bold transition-all shadow-xs"
                >
                  <Volume2 className="w-4 h-4 text-sky-600" />
                  <span>Teacher's Voice</span>
                </button>
              )}
            </div>

            {/* Placed Tiles Track (Interactive Slots with cute pastel accents) */}
            <div className="min-h-24 p-4 rounded-3xl bg-sky-50/40 border-3 border-dashed border-sky-300 flex flex-wrap items-center gap-2.5 sm:gap-3 transition-colors">
              {placedTiles.length === 0 ? (
                <div className="w-full text-center py-4 text-slate-400 font-medium text-sm sm:text-base">
                  Tap words from the Word Tray below to line them up here!
                </div>
              ) : (
                placedTiles.map((tile, idx) => (
                  <button
                    key={`${tile.id}-${idx}`}
                    type="button"
                    onClick={() => handleRemoveWord(tile)}
                    className="group relative flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-sky-400 hover:bg-pink-400 text-white font-display font-extrabold text-lg sm:text-xl shadow-xs hover:scale-105 active:scale-95 transition-all"
                    title="Tap to remove"
                  >
                    <span>{tile.word}</span>
                    <span className="text-xs text-sky-100 group-hover:text-white font-normal ml-0.5">
                      ✕
                    </span>
                  </button>
                ))
              )}
            </div>

            {/* Immediate Guidance Message */}
            <div
              className={`p-4 rounded-2xl border-2 flex items-start gap-3 transition-all ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs'
                  : feedback.type === 'error'
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : feedback.type === 'hint'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-sky-50 border-sky-200 text-sky-950'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              ) : feedback.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              ) : (
                <HelpCircle className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
              )}
              <div className="text-sm sm:text-base font-bold leading-snug">
                {feedback.message}
              </div>
            </div>
          </div>

          {/* Word Tray (Available Tiles to Pick in Pastel Theme) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-3 border-purple-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                Word Tray (Tap to add):
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {availableBank.length} words left
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {availableBank.map((tile) => (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => handlePlaceWord(tile)}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-b from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-950 font-display font-extrabold text-lg sm:text-xl border-2 border-purple-200 shadow-xs hover:shadow-sm hover:scale-105 active:scale-95 transition-all"
                >
                  <span>{tile.word}</span>
                  <Volume2 className="w-4 h-4 text-purple-400" />
                </button>
              ))}

              {availableBank.length === 0 && !isCorrect && (
                <div className="text-sm text-slate-500 italic">
                  All words placed. Check the teacher's guidance above!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Toy Card & Advance Station */}
        <div className="lg:col-span-4 bg-gradient-to-b from-white via-sky-50/40 to-purple-50/50 rounded-3xl p-5 sm:p-6 border-3 border-sky-200 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-sky-100">
              <span className="text-xs font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
                Target Pattern
              </span>
              <span className="text-xs font-semibold text-slate-400">Step 3 of 4</span>
            </div>

            {/* Toy Graphic */}
            <div className="flex justify-center">
              <ToyCardGraphic
                toy={selectedToy}
                describingWord={selectedWord}
                size="md"
                selected={true}
              />
            </div>

            {/* Pattern Formula for Early Readers */}
            <div className="bg-white p-3.5 rounded-3xl border border-sky-200 text-center space-y-1 text-xs shadow-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider">
                Grammar Pattern:
              </span>
              <div className="font-extrabold text-slate-800 text-sm">
                <span className="text-sky-600">It's</span> +{' '}
                <span className="text-pink-600">{selectedWord.article}</span> +{' '}
                <span className="text-purple-600">{selectedWord.word}</span> +{' '}
                <span className="text-emerald-600">{selectedToy.name.toLowerCase()}</span> +{' '}
                <span className="text-slate-600">.</span>
              </div>
            </div>
          </div>

          {/* Advance Button (Enabled when sentence is completed correctly) */}
          <div className="pt-2">
            <button
              type="button"
              disabled={!isCorrect}
              onClick={() => {
                playPop(800);
                onNextStage();
              }}
              className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-display font-black text-lg shadow-sm transition-all ${
                isCorrect
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white cursor-pointer active:scale-98 shadow-emerald-200 animate-pulse'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>Create My Toy Label!</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
