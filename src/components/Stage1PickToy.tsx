import React from 'react';
import { ToyItem } from '../types/toy';
import { ToyCardGraphic } from './ToyCardGraphic';
import { Volume2, Sparkles, ArrowRight, Shuffle, Lightbulb, Music } from 'lucide-react';
import { playPop, playSparkle, speakWord } from '../utils/audio';

interface Stage1PickToyProps {
  toys: ToyItem[];
  selectedToy: ToyItem;
  onSelectToy: (toy: ToyItem) => void;
  onNextStage: () => void;
}

export const Stage1PickToy: React.FC<Stage1PickToyProps> = ({
  toys,
  selectedToy,
  onSelectToy,
  onNextStage,
}) => {
  const handleToyClick = (toy: ToyItem) => {
    playSparkle();
    speakWord(toy.name);
    onSelectToy(toy);
  };

  const handlePickRandom = () => {
    const randomIndex = Math.floor(Math.random() * toys.length);
    const chosen = toys[randomIndex];
    playSparkle();
    speakWord(chosen.name);
    onSelectToy(chosen);
  };

  const handlePhonics = () => {
    playPop(600);
    speakWord(selectedToy.phonics, { rate: 0.65 });
  };

  const handleSoundEffect = () => {
    playPop(700);
    speakWord(selectedToy.soundCue, { rate: 0.75, pitch: 1.2 });
  };

  return (
    <div className="space-y-6">
      {/* Pastel Header Banner */}
      <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-sky-100 rounded-3xl p-5 sm:p-6 border-3 border-pink-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-200 text-pink-900 font-extrabold text-xs uppercase tracking-wider">
            <span>Stage 1</span>
            <span>•</span>
            <span>Digital Toy Shelf</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-800">
            Pick a Toy from the Shelf! 🧸✨
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl font-medium">
            Explore our Year 1 classroom toys. Tap any card to hear Teacher's clear voice. Which toy would you like to describe?
          </p>
        </div>

        <button
          type="button"
          onClick={handlePickRandom}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-pink-50 text-purple-800 border-2 border-purple-200 font-extrabold text-sm shadow-xs active:scale-95 transition-all"
        >
          <Shuffle className="w-4 h-4 text-purple-500" />
          <span>Surprise Me! 🎲</span>
        </button>
      </div>

      {/* Main Layout: Digital Toy Shelf + Selected Toy Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Pastel Toy Shelf (8 Core Curriculum Toys) */}
        <div className="lg:col-span-8 bg-gradient-to-b from-purple-50/80 via-pink-50/60 to-purple-100/70 rounded-3xl p-4 sm:p-6 shadow-sm border-3 border-purple-200 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-purple-200/60 text-purple-900">
              <span className="font-display font-extrabold text-base flex items-center gap-2">
                <span>🧺</span> Classroom Toy Collection (8 Toys)
              </span>
              <span className="text-xs bg-white/90 px-3 py-1 rounded-full border border-purple-200 text-purple-700 font-bold shadow-xs">
                Tap a toy to choose
              </span>
            </div>

            {/* Shelf Grid with 8 flashcards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {toys.map((toy) => {
                const isSelected = selectedToy.id === toy.id;
                return (
                  <div key={toy.id} className="flex flex-col items-center">
                    <ToyCardGraphic
                      toy={toy}
                      size="md"
                      selected={isSelected}
                      interactive={true}
                      onClick={() => handleToyClick(toy)}
                    />
                    {/* Pastel Shelf Ledge */}
                    <div className="w-full h-2.5 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 rounded-full mt-2 shadow-xs border border-purple-200/70" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Selected Toy Inspector & Decision Station */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border-3 border-pink-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b-2 border-pink-100 mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-pink-700 bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
                My Chosen Toy
              </span>
              <span className="text-xs font-bold text-slate-400">Step 1 of 4</span>
            </div>

            {/* Interactive Card Preview */}
            <div className="flex justify-center mb-4">
              <ToyCardGraphic
                toy={selectedToy}
                size="lg"
                selected={true}
                showSoundButton={true}
              />
            </div>

            {/* Toy Details and Phonics */}
            <div className="space-y-3 bg-purple-50/50 p-4 rounded-3xl border border-purple-100 mb-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-2xl text-slate-800">
                    {selectedToy.name}
                  </h3>
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-widest">
                    Spelling & Sound:
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => speakWord(selectedToy.name)}
                  className="p-2.5 rounded-2xl bg-pink-400 hover:bg-pink-500 text-white shadow-xs transition-all active:scale-95"
                  title="Listen to teacher's pronunciation"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Phonics buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={handlePhonics}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-extrabold border border-amber-200 transition-all shadow-xs"
                >
                  <span>🔤 Phonics:</span>
                  <span className="tracking-wider">{selectedToy.phonics}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSoundEffect}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-900 text-xs font-bold border border-sky-200 transition-all shadow-xs"
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Toy Sound</span>
                </button>
              </div>

              {/* Fun Fact / Teacher prompt */}
              <div className="flex items-start gap-2 pt-2 text-xs text-slate-600">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p>{selectedToy.funFact}</p>
              </div>
            </div>
          </div>

          {/* Confirm & Next Button */}
          <button
            type="button"
            onClick={() => {
              playPop(700);
              onNextStage();
            }}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-display font-black text-lg shadow-sm hover:shadow-md transform active:scale-98 transition-all"
          >
            <span>I Pick This Toy!</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
