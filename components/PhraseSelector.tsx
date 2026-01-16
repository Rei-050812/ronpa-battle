"use client";

import { useState, useEffect } from "react";

interface PhraseSelectorProps {
  phase: 1 | 2 | 3;
  phrases: string[];
  selectedPhrases: string[];
  onSelect: (phrase: string) => void;
  bossStatement: string;
}

export default function PhraseSelector({
  phase,
  phrases,
  selectedPhrases,
  onSelect,
  bossStatement,
}: PhraseSelectorProps) {
  const [timeLeft, setTimeLeft] = useState(3);
  const [shuffledPhrases, setShuffledPhrases] = useState<string[]>([]);

  useEffect(() => {
    // Shuffle phrases for random positioning
    const shuffled = [...phrases].sort(() => Math.random() - 0.5);
    setShuffledPhrases(shuffled);
  }, [phrases]);

  useEffect(() => {
    setTimeLeft(3);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-select random phrase on timeout
          const randomPhrase =
            shuffledPhrases[
              Math.floor(Math.random() * shuffledPhrases.length)
            ];
          onSelect(randomPhrase);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, shuffledPhrases, onSelect]);

  const phaseLabel = phase === 1 ? "文頭" : phase === 2 ? "中盤" : "締め";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Timer */}
      <div className="text-center mb-6">
        <div
          className={`inline-block text-8xl font-black ${
            timeLeft <= 1 ? "text-red-500 animate-pulse" : "text-yellow-400"
          }`}
        >
          {timeLeft}
        </div>
      </div>

      {/* Boss Statement */}
      <div className="bg-gray-800 rounded-lg p-4 mb-4 border-2 border-red-500">
        <p className="text-sm text-red-300 mb-1">上司:</p>
        <p className="text-white font-bold">「{bossStatement}」</p>
      </div>

      {/* Selected Phrases So Far */}
      {selectedPhrases.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6 border-2 border-green-500">
          <p className="text-sm text-green-300 mb-1">あなた:</p>
          <p className="text-white text-lg">
            「{selectedPhrases.join("")}
            <span className="animate-pulse">_</span>」
          </p>
        </div>
      )}

      {/* Phase Indicator */}
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold text-white mb-2">
          第{phase}フレーズを選べ！
        </h3>
        <p className="text-gray-400">({phaseLabel})</p>
      </div>

      {/* Phrase Buttons */}
      <div className="grid grid-cols-2 gap-4">
        {shuffledPhrases.map((phrase, index) => (
          <button
            key={index}
            onClick={() => onSelect(phrase)}
            className="bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-8 px-6 rounded-lg text-xl transform transition hover:scale-105 shadow-lg border-2 border-purple-400 active:scale-95"
          >
            {phrase}
          </button>
        ))}
      </div>
    </div>
  );
}
