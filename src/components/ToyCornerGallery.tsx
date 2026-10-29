import React, { useState } from 'react';
import { ToyLabel, ToyItem, DescribingWord } from '../types/toy';
import { ToyCardGraphic } from './ToyCardGraphic';
import { Volume2, Printer, Plus, Heart, Filter, Sparkles } from 'lucide-react';
import { playPop, speakWord } from '../utils/audio';

interface ToyCornerGalleryProps {
  labels: ToyLabel[];
  toys: ToyItem[];
  describingWords: DescribingWord[];
  onNewToy: () => void;
  onLikeLabel: (labelId: string) => void;
}

export const ToyCornerGallery: React.FC<ToyCornerGalleryProps> = ({
  labels,
  toys,
  describingWords,
  onNewToy,
  onLikeLabel,
}) => {
  const [filterToyId, setFilterToyId] = useState<string>('all');

  const filteredLabels = labels.filter((lbl) => {
    if (filterToyId === 'all') return true;
    return lbl.toyId === filterToyId;
  });

  const handleRead = (lbl: ToyLabel, toy: ToyItem) => {
    playPop(650);
    const text = `${lbl.studentName}'s label. Toy: ${toy.name}. Description: ${lbl.sentence}. ${lbl.extraSentence || ''}`;
    speakWord(text);
  };

  const handlePrintAll = () => {
    playPop(600);
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Pastel Header Banner */}
      <div className="no-print bg-gradient-to-r from-pink-100 via-purple-100 to-amber-100 rounded-3xl p-5 sm:p-6 border-3 border-pink-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-200 text-pink-950 font-extrabold text-xs uppercase tracking-wider">
            <span>Classroom Display</span>
            <span>•</span>
            <span>Toy Corner</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-800">
            Our Class Toy Corner 🏫🧸🌸
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl font-medium">
            Look at the sweet toy labels created by our Year 1 designers! Tap any card to listen to Teacher reading it out loud.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrintAll}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-purple-200 font-bold text-sm shadow-xs active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4 text-purple-600" />
            <span>Print All Labels</span>
          </button>

          <button
            type="button"
            onClick={onNewToy}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xs active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Design Another Toy</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs by Toy Type (Pastel pills) */}
      <div className="no-print flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-black uppercase tracking-wider text-purple-400 mr-1 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>
        <button
          type="button"
          onClick={() => {
            playPop();
            setFilterToyId('all');
          }}
          className={`px-3.5 py-1.5 rounded-2xl text-xs font-extrabold shrink-0 transition-all border-2 ${
            filterToyId === 'all'
              ? 'bg-purple-300 text-purple-950 border-purple-400 shadow-xs'
              : 'bg-white text-slate-600 hover:bg-purple-50 border-purple-100'
          }`}
        >
          All Toys ({labels.length})
        </button>
        {toys.map((t) => {
          const count = labels.filter((l) => l.toyId === t.id).length;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                playPop();
                setFilterToyId(t.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold shrink-0 transition-all border-2 ${
                filterToyId === t.id
                  ? 'bg-pink-300 text-pink-950 border-pink-400 shadow-xs font-extrabold'
                  : 'bg-white text-slate-600 hover:bg-pink-50 border-pink-100'
              }`}
            >
              <span>{t.emoji}</span>
              <span>{t.name}</span>
              {count > 0 && (
                <span className="text-[10px] bg-pink-100 text-pink-700 px-1.5 py-0.2 rounded-full font-bold">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Classroom Pastel Display Board */}
      <div className="bg-gradient-to-b from-purple-50/50 via-pink-50/40 to-sky-50/50 border-3 border-purple-200 rounded-3xl p-4 sm:p-6 shadow-xs min-h-96">
        {filteredLabels.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <span className="text-4xl">🧸</span>
            <h4 className="font-display font-extrabold text-xl text-slate-700">
              No toy labels found for this toy yet!
            </h4>
            <p className="text-sm text-slate-500">
              Be the first pupil to design a label for this toy!
            </p>
            <button
              type="button"
              onClick={onNewToy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-pink-400 text-white font-bold text-sm shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Make One Now</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLabels.map((lbl) => {
              const toy = toys.find((t) => t.id === lbl.toyId) || toys[0];
              const descWord = describingWords.find((w) => w.id === lbl.describingWordId);

              // Background styling based on pastel label theme
              const themeBg =
                lbl.theme === 'pastelMint'
                  ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 border-emerald-300'
                  : lbl.theme === 'pastelLavender'
                  ? 'bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 border-purple-300'
                  : lbl.theme === 'pastelButter'
                  ? 'bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border-amber-300'
                  : lbl.theme === 'pastelPeach'
                  ? 'bg-gradient-to-br from-orange-50 via-rose-50 to-orange-100 border-orange-300'
                  : 'bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 border-pink-300';

              return (
                <div
                  key={lbl.id}
                  className={`p-5 rounded-3xl border-3 shadow-xs hover:shadow-md transition-all relative flex flex-col justify-between ${themeBg}`}
                >
                  {/* Cute pastel flower pin on card */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-pink-300 border-2 border-white shadow-xs flex items-center justify-center text-xs">
                    🌸
                  </div>

                  <div>
                    {/* Header: Class & Designer */}
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-300/60 pt-1">
                      <div>
                        <span className="font-display font-extrabold text-sm text-slate-800">
                          {lbl.studentName}
                        </span>
                        <span className="text-[11px] text-purple-700 ml-1.5 font-bold">
                          ({lbl.studentClass})
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {lbl.createdAt}
                      </span>
                    </div>

                    {/* Toy Card Graphic preview */}
                    <div className="flex justify-center mb-3">
                      <ToyCardGraphic
                        toy={toy}
                        describingWord={descWord}
                        size="sm"
                        showSoundButton={false}
                        showBadge={false}
                      />
                    </div>

                    {/* Content Box */}
                    <div className="bg-white/95 p-3 rounded-2xl border border-slate-200/80 space-y-2 shadow-xs">
                      <div className="text-xs">
                        <span className="font-extrabold text-slate-400 uppercase tracking-wider">
                          TOY:{' '}
                        </span>
                        <strong className="text-slate-900 font-display font-black text-sm">
                          {toy.name}
                        </strong>
                      </div>

                      <div className="text-xs border-t border-slate-100 pt-1">
                        <span className="font-extrabold text-slate-400 uppercase tracking-wider">
                          DESCRIPTION:{' '}
                        </span>
                        <strong className="text-purple-700 font-display font-black text-sm">
                          "{lbl.sentence}"
                        </strong>
                      </div>

                      {lbl.extraSentence && (
                        <div className="text-xs border-t border-slate-100 pt-1">
                          <span className="font-extrabold text-pink-500 uppercase tracking-wider">
                            EXTRA:{' '}
                          </span>
                          <span className="text-slate-700 font-medium italic">
                            "{lbl.extraSentence}"
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="no-print mt-3 pt-2 border-t border-slate-300/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleRead(lbl, toy)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-2xl bg-white/90 hover:bg-white text-purple-800 font-bold text-xs border border-purple-200 shadow-xs"
                      title="Read aloud in teacher's voice"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-purple-500" />
                      <span>Listen</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playPop(650);
                        onLikeLabel(lbl.id);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-700 font-extrabold text-xs border border-pink-200 transition-all active:scale-95"
                    >
                      <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                      <span>{lbl.likes}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
