"use client";

import { useState } from "react";
import ModeSelection from "@/components/ModeSelection";
import BattleScreen from "@/components/BattleScreen";
import ResultScreen from "@/components/ResultScreen";
import type { GameMode, GameState } from "@/types";

type GameScreen = "mode" | "battle" | "result";

export default function Home() {
  const [screen, setScreen] = useState<GameScreen>("mode");
  const [gameState, setGameState] = useState<GameState>({
    mode: "single",
    score: 0,
    combo: 0,
    currentBattle: null,
    selectedPhrases: [undefined, undefined, undefined],
    gameOver: false,
  });

  const handleModeSelect = (mode: GameMode) => {
    setGameState({
      mode,
      score: 0,
      combo: 0,
      currentBattle: null,
      selectedPhrases: [undefined, undefined, undefined],
      gameOver: false,
    });
    setScreen("battle");
  };

  const handleBattleComplete = (judgeResult: {
    score: number;
    result: "perfect" | "good" | "ok" | "ko";
  }) => {
    const pointsMap = {
      perfect: 100,
      good: 50,
      ok: 10,
      ko: 0,
    };

    const points = pointsMap[judgeResult.result];
    const newCombo = judgeResult.result === "ko" ? 0 : gameState.combo + 1;
    const isGameOver =
      judgeResult.result === "ko" || gameState.mode === "single";

    setGameState({
      ...gameState,
      score: gameState.score + points,
      combo: newCombo,
      gameOver: isGameOver,
    });

    setScreen("result");
  };

  const handlePlayAgain = () => {
    if (gameState.mode === "continuous" && !gameState.gameOver) {
      // Continue to next battle
      setGameState({
        ...gameState,
        currentBattle: null,
        selectedPhrases: [undefined, undefined, undefined],
      });
      setScreen("battle");
    } else {
      // Reset to mode selection
      setScreen("mode");
      setGameState({
        mode: "single",
        score: 0,
        combo: 0,
        currentBattle: null,
        selectedPhrases: [undefined, undefined, undefined],
        gameOver: false,
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 tracking-wider game-title">
            上司論破バトル
          </h1>
          <p className="text-gray-300 text-sm mb-1">
            #上司論破バトル
          </p>
          <p className="text-gray-400 text-xs">
            Presented by{" "}
            <a
              href="https://zero-venture.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline transition-colors"
            >
              ZEROVENTURE
            </a>
          </p>
        </header>

        {screen === "mode" && <ModeSelection onSelect={handleModeSelect} />}
        {screen === "battle" && (
          <BattleScreen
            gameState={gameState}
            onComplete={handleBattleComplete}
          />
        )}
        {screen === "result" && (
          <ResultScreen gameState={gameState} onPlayAgain={handlePlayAgain} />
        )}
      </div>
    </main>
  );
}
