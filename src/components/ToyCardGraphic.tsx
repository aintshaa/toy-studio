import React from 'react';
import { ToyItem, DescribingWord } from '../types/toy';
import { Volume2, Sparkles, Zap, Clock, Maximize2, Minimize2 } from 'lucide-react';
import { speakWord, playPop } from '../utils/audio';

interface ToyCardGraphicProps {
  toy: ToyItem;
  describingWord?: DescribingWord | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSoundButton?: boolean;
  showBadge?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

export const ToyCardGraphic: React.FC<ToyCardGraphicProps> = ({
  toy,
  describingWord,
  size = 'md',
  showSoundButton = true,
  showBadge = true,
  interactive = false,
  onClick,
  selected = false,
}) => {
  const handleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPop(520);
    speakWord(toy.name);
  };

  // Dimensions based on size
  const sizeClasses = {
    sm: 'w-24 h-32 text-xs',
    md: 'w-36 h-48 sm:w-40 sm:h-52 text-sm',
    lg: 'w-48 h-64 sm:w-56 sm:h-72 text-base',
    xl: 'w-56 h-76 sm:w-64 sm:h-84 text-lg',
  }[size];

  // Visual adjective modifiers
  const isBig = describingWord?.id === 'big';
  const isSmall = describingWord?.id === 'small';
  const isFast = describingWord?.id === 'fast';
  const isNew = describingWord?.id === 'new';
  const isOld = describingWord?.id === 'old';
  const colorSwatch = describingWord?.colorSwatch;

  return (
    <div
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(e) => {
        if (interactive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`relative flex flex-col items-center justify-between p-2 rounded-3xl bg-white border-3 transition-all duration-300 ${sizeClasses} ${
        selected
          ? 'border-pink-400 ring-4 ring-pink-200/80 shadow-lg scale-105'
          : 'border-purple-200 shadow-sm hover:border-pink-300 hover:shadow-md'
      } ${interactive ? 'cursor-pointer active:scale-95' : ''}`}
      style={{
        boxShadow: selected
          ? '0 10px 25px -4px rgba(244, 114, 182, 0.35)'
          : '0 4px 14px -2px rgba(192, 132, 252, 0.12)',
      }}
    >
      {/* Decorative Card Top Border Accent */}
      <div className="w-full flex items-center justify-between px-1">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400">
          Year 1 Toy
        </span>
        {showSoundButton && (
          <button
            type="button"
            onClick={handleSound}
            aria-label={`Listen to ${toy.name}`}
            className="p-1 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 hover:scale-110 active:scale-95 transition-all"
            title="Listen to teacher's voice"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Toy Graphic Container (All 8 toys from the curriculum sprite sheet) */}
      <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden my-1">
        <div
          className={`w-full h-full relative transition-transform duration-300 ${
            isBig ? 'scale-115' : isSmall ? 'scale-85' : 'scale-100'
          }`}
          style={{
            backgroundImage: "url('/assets/aistudio/image_25b0e891.png')",
            backgroundSize: '400% 200%',
            backgroundPosition: `${toy.spriteCol * 33.3333}% ${toy.spriteRow * 100}%`,
            backgroundRepeat: 'no-repeat',
            filter: colorSwatch ? `drop-shadow(0 0 10px ${colorSwatch})` : undefined,
          }}
        />

        {/* Dynamic Adjective Overlays with cute pastel touches */}
        {isFast && (
          <div className="absolute top-1 right-1 bg-amber-200 text-amber-900 p-1 rounded-full shadow-xs animate-pulse border border-amber-300">
            <Zap className="w-3.5 h-3.5 fill-amber-300" />
          </div>
        )}
        {isNew && (
          <div
            className="absolute top-1 right-1 bg-yellow-200 text-yellow-800 p-1 rounded-full shadow-xs animate-spin border border-yellow-300"
            style={{ animationDuration: '6s' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        )}
        {isOld && (
          <div className="absolute top-1 right-1 bg-amber-100 text-amber-800 p-1 rounded-full shadow-xs border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
          </div>
        )}
        {isBig && (
          <div className="absolute bottom-1 right-1 bg-emerald-200 text-emerald-800 p-1 rounded-full shadow-xs border border-emerald-300">
            <Maximize2 className="w-3 h-3" />
          </div>
        )}
        {isSmall && (
          <div className="absolute bottom-1 right-1 bg-sky-200 text-sky-800 p-1 rounded-full shadow-xs border border-sky-300">
            <Minimize2 className="w-3 h-3" />
          </div>
        )}

        {/* Dynamic Color Tint Ribbon */}
        {colorSwatch && (
          <div
            className="absolute inset-x-2 bottom-0.5 h-1.5 rounded-full shadow-xs opacity-90"
            style={{ backgroundColor: colorSwatch }}
          />
        )}
      </div>

      {/* Toy Name Label */}
      <div className="w-full text-center py-1 px-2 rounded-2xl bg-pink-50/70 border border-pink-100">
        <span className="font-display font-extrabold tracking-widest uppercase text-slate-800 text-xs sm:text-sm">
          {toy.name}
        </span>
      </div>

      {/* Selected check badge */}
      {showBadge && selected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-pink-400 text-white flex items-center justify-center font-bold text-xs shadow-md border-2 border-white animate-bounce">
          ✓
        </div>
      )}
    </div>
  );
};
