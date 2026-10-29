/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Stage1PickToy } from './components/Stage1PickToy';
import { Stage2ChooseWord } from './components/Stage2ChooseWord';
import { Stage3BuildSentence } from './components/Stage3BuildSentence';
import { Stage4CreateLabel } from './components/Stage4CreateLabel';
import { ToyCornerGallery } from './components/ToyCornerGallery';
import { TeacherGuideModal } from './components/TeacherGuideModal';
import { TOYS, DESCRIBING_WORDS, INITIAL_GALLERY_LABELS } from './data/toyData';
import { ToyItem, DescribingWord, ToyLabel } from './types/toy';
import { playPop, playSparkle } from './utils/audio';

const STORAGE_KEY = 'toy_designer_studio_labels_v2';

export default function App() {
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [selectedToy, setSelectedToy] = useState<ToyItem>(TOYS[3]); // Default to Kite (matches "It's a new kite.")
  const [selectedWord, setSelectedWord] = useState<DescribingWord | null>(
    DESCRIBING_WORDS.find((w) => w.id === 'new') || DESCRIBING_WORDS[0]
  );
  const [builtSentence, setBuiltSentence] = useState<string>("It's a new kite.");
  const [isTeacherGuideOpen, setIsTeacherGuideOpen] = useState<boolean>(false);

  // Load saved labels from localStorage, or use defaults
  const [labels, setLabels] = useState<ToyLabel[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load stored labels', e);
    }
    return INITIAL_GALLERY_LABELS;
  });

  // Save to localStorage whenever labels change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(labels));
    } catch (e) {
      console.warn('Failed to save labels to storage', e);
    }
  }, [labels]);

  const handleSaveLabel = (newLabel: ToyLabel) => {
    setLabels((prev) => [newLabel, ...prev]);
  };

  const handleLikeLabel = (labelId: string) => {
    setLabels((prev) =>
      prev.map((l) => (l.id === labelId ? { ...l, likes: l.likes + 1 } : l))
    );
  };

  const handleRestartNewToy = () => {
    playSparkle();
    setCurrentStage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/50 via-purple-50/40 to-sky-50/50 flex flex-col justify-between selection:bg-pink-200 selection:text-pink-900 font-sans">
      {/* Top Child-Friendly Navigation Bar with Teacher Attribution */}
      <Navbar
        currentStage={currentStage}
        onSelectStage={(stage) => setCurrentStage(stage)}
        onOpenTeacherGuide={() => setIsTeacherGuideOpen(true)}
        totalLabelsCount={labels.length}
      />

      {/* Main Learning Stage Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentStage === 1 && (
          <Stage1PickToy
            toys={TOYS}
            selectedToy={selectedToy}
            onSelectToy={(toy) => setSelectedToy(toy)}
            onNextStage={() => setCurrentStage(2)}
          />
        )}

        {currentStage === 2 && (
          <Stage2ChooseWord
            selectedToy={selectedToy}
            describingWords={DESCRIBING_WORDS}
            selectedWord={selectedWord}
            onSelectWord={(word) => setSelectedWord(word)}
            onNextStage={() => setCurrentStage(3)}
            onPrevStage={() => setCurrentStage(1)}
          />
        )}

        {currentStage === 3 && selectedWord && (
          <Stage3BuildSentence
            selectedToy={selectedToy}
            selectedWord={selectedWord}
            onSentenceComplete={(sentence) => setBuiltSentence(sentence)}
            onNextStage={() => setCurrentStage(4)}
            onPrevStage={() => setCurrentStage(2)}
          />
        )}

        {currentStage === 4 && selectedWord && (
          <Stage4CreateLabel
            selectedToy={selectedToy}
            selectedWord={selectedWord}
            builtSentence={builtSentence}
            onSaveLabel={handleSaveLabel}
            onRestart={handleRestartNewToy}
            onPrevStage={() => setCurrentStage(3)}
            onViewGallery={() => setCurrentStage(5)}
          />
        )}

        {currentStage === 5 && (
          <ToyCornerGallery
            labels={labels}
            toys={TOYS}
            describingWords={DESCRIBING_WORDS}
            onNewToy={handleRestartNewToy}
            onLikeLabel={handleLikeLabel}
          />
        )}
      </main>

      {/* Cute Pastel Footer */}
      <footer className="no-print mt-8 bg-white/90 backdrop-blur-xs border-t-2 border-pink-100 py-4 px-4 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>🧸 Toy Designer Studio</span>
            <span>•</span>
            <span className="text-purple-700 font-bold">
              By Teacher Nurulain Natasha binti Zakaria
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                playPop();
                setIsTeacherGuideOpen(true);
              }}
              className="text-purple-600 hover:text-purple-800 underline font-bold"
            >
              Curriculum Info
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                playPop();
                setCurrentStage(5);
              }}
              className="text-pink-600 hover:text-pink-800 underline font-bold"
            >
              Class Toy Corner ({labels.length} Labels)
            </button>
          </div>
        </div>
      </footer>

      {/* Teacher Guide Modal */}
      <TeacherGuideModal
        isOpen={isTeacherGuideOpen}
        onClose={() => setIsTeacherGuideOpen(false)}
      />
    </div>
  );
}
