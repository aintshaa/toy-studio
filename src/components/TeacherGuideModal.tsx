import React from 'react';
import { X, BookOpen, CheckCircle, Lightbulb } from 'lucide-react';
import { playPop } from '../utils/audio';

interface TeacherGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/30 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl border-3 border-purple-200 flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b-2 border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-slate-800">
                Teacher & Educator Guide
              </h3>
              <p className="text-xs text-purple-700 font-bold">
                By Teacher Nurulain Natasha binti Zakaria • Year 1 English / ESL
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playPop();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-slate-700 text-sm">
          {/* Overview */}
          <div className="bg-pink-50/70 p-4 rounded-3xl border border-pink-200 space-y-2">
            <h4 className="font-display font-bold text-base text-purple-900 flex items-center gap-1.5">
              <span>🌸</span> Lesson Purpose & Learning Outcomes
            </h4>
            <p className="text-slate-700 leading-relaxed">
              <strong>Toy Designer Studio</strong> empowers Year 1 pupils to actively select, match, arrange, and write their own toy descriptions rather than passively watching. Each pupil designs an individual digital toy label for the classroom Toy Corner.
            </p>
          </div>

          {/* 4 Stages Breakdown */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-base text-slate-800">
              The 4 Learning Stages
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-200 space-y-1">
                <span className="font-black text-xs uppercase text-pink-800 block">
                  Stage 1: Pick a Toy
                </span>
                <p className="text-xs text-slate-600">
                  Pupils explore the digital shelf with 8 authentic flashcards (Robot, Doll, Car, Kite, Ball, Train, Blocks, Teddy Bear). Clear, slow-paced female speech provides audio scaffolding.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                <span className="font-black text-xs uppercase text-purple-800 block">
                  Stage 2: Describing Words
                </span>
                <p className="text-xs text-slate-600">
                  Target adjectives: <em>big, small, long, short, fast, slow, new, old</em> and pastel colours (<em>red, blue, green, yellow, pink, purple, orange</em>) with picture cues.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 space-y-1">
                <span className="font-black text-xs uppercase text-sky-800 block">
                  Stage 3: Build Sentence
                </span>
                <p className="text-xs text-slate-600">
                  Sentence frame: <strong>"It's a/an [adjective] [noun]."</strong> Immediate interactive guidance helps pupils correct word order and indefinite article choices.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="font-black text-xs uppercase text-emerald-800 block">
                  Stage 4: Create Toy Label
                </span>
                <p className="text-xs text-slate-600">
                  Pupils create an individual label to print or pin on the class Toy Corner. More proficient pupils can write an extra sentence.
                </p>
              </div>
            </div>
          </div>

          {/* Grammar & Phonics Targets */}
          <div className="border-t border-purple-100 pt-4 space-y-2">
            <h4 className="font-display font-bold text-base text-slate-800">
              Grammar & Language Focus
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Adjective-Noun Order:</strong> Describing words precede the noun in English (e.g. <em>"a new kite"</em>, not <em>"a kite new"</em>).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Articles "a" vs "an":</strong> Explains why we say <em>"an old teddy bear"</em> or <em>"an orange ball"</em> because "old" and "orange" begin with vowel sounds.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Punctuation & Phonics:</strong> Sentence capitalization (<em>It's</em>), final full stop (<em>.</em>), and phonemic awareness.
                </span>
              </li>
            </ul>
          </div>

          {/* Classroom Ideas */}
          <div className="bg-purple-50/70 p-4 rounded-3xl border border-purple-200 space-y-2 text-xs text-purple-950">
            <div className="font-extrabold flex items-center gap-1.5 text-sm text-purple-900">
              <Lightbulb className="w-4 h-4 text-pink-500" />
              <span>Suggested Classroom Routine</span>
            </div>
            <ol className="list-decimal pl-4 space-y-1 leading-relaxed">
              <li>Demonstrate the studio on your smartboard to introduce the vocabulary and syntax.</li>
              <li>Give pupils time on tablets or class computers to build their toy descriptions.</li>
              <li>Print the completed labels for pupils to cut and display in your physical classroom Toy Corner!</li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-purple-50/50 px-6 py-4 border-t border-purple-100 flex items-center justify-between">
          <span className="text-xs text-purple-700 font-semibold">
            By Teacher Nurulain Natasha binti Zakaria
          </span>
          <button
            type="button"
            onClick={() => {
              playPop();
              onClose();
            }}
            className="px-5 py-2.5 rounded-2xl bg-purple-400 hover:bg-purple-500 text-white font-extrabold text-sm shadow-xs transition-all"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};
