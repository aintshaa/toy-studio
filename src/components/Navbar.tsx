import React from 'react';
import { Volume2, VolumeX, BookOpen, Layers, Heart, Sparkles } from 'lucide-react';
import { setMuted, getIsMuted, playPop } from '../utils/audio';

interface NavbarProps {
  currentStage: number; // 1: Pick, 2: Word, 3: Sentence, 4: Label, 5: Gallery
  onSelectStage: (stage: number) => void;
  onOpenTeacherGuide: () => void;
  totalLabelsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStage,
  onSelectStage,
  onOpenTeacherGuide,
  totalLabelsCount,
}) => {
  const [muted, setMutedState] = React.useState(getIsMuted());

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) playPop(600);
  };

  const stages = [
    { num: 1, label: '1. Pick Toy', icon: '🧸', activeColor: 'bg-pink-300 text-pink-950 border-pink-400' },
    { num: 2, label: '2. Describing Word', icon: '✨', activeColor: 'bg-purple-300 text-purple-950 border-purple-400' },
    { num: 3, label: '3. Build Sentence', icon: '🧩', activeColor: 'bg-sky-300 text-sky-950 border-sky-400' },
    { num: 4, label: '4. My Toy Label', icon: '🏷️', activeColor: 'bg-emerald-300 text-emerald-950 border-emerald-400' },
  ];

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-3 border-pink-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3">
        {/* App Title / Logo */}
        <div
          onClick={() => {
            playPop();
            onSelectStage(1);
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-3xl bg-gradient-to-br from-pink-200 via-purple-200 to-sky-200 p-0.5 shadow-sm border-2 border-pink-300 flex items-center justify-center transform group-hover:scale-105 transition-transform">
            <span className="text-2xl animate-float-slow">🧸</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-xl sm:text-2xl text-slate-800 tracking-tight leading-none group-hover:text-pink-600 transition-colors">
                Toy Designer <span className="text-pink-500">Studio</span>
              </h1>
              <span className="bg-pink-100 text-pink-700 text-[11px] font-extrabold px-2 py-0.5 rounded-full border border-pink-200">
                Year 1
              </span>
            </div>
            {/* Teacher Attribution under Toy Designer Studio */}
            <p className="text-xs text-purple-700 font-bold tracking-tight mt-0.5 flex items-center gap-1">
              <span>🌸</span>
              <span>By Teacher Nurulain Natasha binti Zakaria</span>
            </p>
          </div>
        </div>

        {/* Learning Stages Stepper (Pastel pills) */}
        <nav aria-label="Learning Stages" className="hidden md:flex items-center gap-1.5 bg-pink-50/70 p-1.5 rounded-3xl border-2 border-pink-200/70">
          {stages.map((st) => {
            const isActive = currentStage === st.num;
            return (
              <button
                key={st.num}
                type="button"
                onClick={() => {
                  playPop();
                  onSelectStage(st.num);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-bold text-xs sm:text-sm border-2 transition-all ${
                  isActive
                    ? `${st.activeColor} shadow-sm font-extrabold scale-102`
                    : 'border-transparent text-slate-600 hover:bg-white hover:text-pink-700'
                }`}
              >
                <span>{st.icon}</span>
                <span>{st.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Toy Corner Gallery Button */}
          <button
            type="button"
            onClick={() => {
              playPop();
              onSelectStage(5);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-extrabold border-2 transition-all shadow-xs ${
              currentStage === 5
                ? 'bg-mint-300 bg-emerald-200 text-emerald-950 border-emerald-400 ring-2 ring-emerald-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Toy Corner</span>
            <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {totalLabelsCount}
            </span>
          </button>

          {/* Sound Toggle (Woman's voice indicator) */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={muted ? 'Unmute Voice' : 'Mute Voice'}
            title={muted ? "Turn voice on (Teacher's voice)" : "Turn voice off"}
            className={`p-2 rounded-2xl border-2 transition-all ${
              muted
                ? 'bg-slate-100 text-slate-400 border-slate-200'
                : 'bg-pink-100 text-pink-700 border-pink-300 hover:bg-pink-200'
            }`}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Teacher / Curriculum Guide */}
          <button
            type="button"
            onClick={() => {
              playPop();
              onOpenTeacherGuide();
            }}
            title="Teacher Guide & Curriculum"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-purple-50 text-purple-700 border-2 border-purple-200 hover:bg-purple-100 text-xs font-bold transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Teacher Guide</span>
          </button>
        </div>
      </div>

      {/* Mobile Stage Selector Bar */}
      <div className="md:hidden flex items-center justify-around px-2 py-1.5 bg-pink-50/90 border-t border-pink-100 overflow-x-auto text-xs">
        {stages.map((st) => (
          <button
            key={st.num}
            onClick={() => {
              playPop();
              onSelectStage(st.num);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold ${
              currentStage === st.num
                ? 'bg-pink-300 text-pink-950 font-black shadow-xs'
                : 'text-slate-600'
            }`}
          >
            <span>{st.icon}</span>
            <span>Stage {st.num}</span>
          </button>
        ))}
      </div>
    </header>
  );
};
