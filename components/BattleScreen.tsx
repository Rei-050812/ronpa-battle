"use client";

import { useState, useEffect } from "react";
import type {
  GameState,
  BattleData,
  JudgeResponse,
  GenerateBattleResponse,
} from "@/types";
import PhraseSelector from "./PhraseSelector";
import VSScreen from "./VSScreen";
import JudgmentScreen from "./JudgmentScreen";

interface BattleScreenProps {
  gameState: GameState;
  onComplete: (result: { score: number; result: JudgeResponse["result"] }) => void;
}

type BattlePhase =
  | "loading"
  | "vs"
  | "select1"
  | "select2"
  | "select3"
  | "response"
  | "judging"
  | "judgment";

export default function BattleScreen({
  gameState,
  onComplete,
}: BattleScreenProps) {
  const [phase, setPhase] = useState<BattlePhase>("loading");
  const [battleData, setBattleData] = useState<BattleData | null>(null);
  const [selectedPhrases, setSelectedPhrases] = useState<string[]>([]);
  const [judgmentData, setJudgmentData] = useState<JudgeResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [loadingTime, setLoadingTime] = useState<number>(0);

  // Load battle data
  useEffect(() => {
    let loadingTimer: NodeJS.Timeout;

    async function loadBattle() {
      try {
        // ローディングタイマー開始
        const startTime = Date.now();
        loadingTimer = setInterval(() => {
          setLoadingTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        // Claude APIを使用
        const response = await fetch("/api/generate-battle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: gameState.mode }),
        });

        clearInterval(loadingTimer);

        if (!response.ok) throw new Error("Failed to load battle");

        const data: GenerateBattleResponse = await response.json();
        setBattleData(data);
        setPhase("vs");

        // Auto-transition to first selection after 2 seconds
        setTimeout(() => {
          setPhase("select1");
        }, 2000);
      } catch (err) {
        clearInterval(loadingTimer);
        setError("バトルの読み込みに失敗しました");
        console.error(err);
      }
    }

    loadBattle();

    return () => {
      if (loadingTimer) clearInterval(loadingTimer);
    };
  }, [gameState.mode]);

  const handlePhraseSelect = (phrase: string, phaseNum: 1 | 2 | 3) => {
    const newPhrases = [...selectedPhrases];
    newPhrases[phaseNum - 1] = phrase;
    setSelectedPhrases(newPhrases);

    if (phaseNum === 1) {
      setPhase("select2");
    } else if (phaseNum === 2) {
      setPhase("select3");
    } else if (phaseNum === 3) {
      setPhase("response");
      // Show response for 2 seconds, then judge
      setTimeout(() => {
        judgeBattle(newPhrases);
      }, 2000);
    }
  };

  const judgeBattle = async (phrases: string[]) => {
    setPhase("judging");
    try {
      const playerResponse = phrases.join("");
      // Claude APIを使用
      const response = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bossStatement: battleData?.bossStatement,
          playerResponse,
        }),
      });

      if (!response.ok) throw new Error("Failed to judge");

      const data: JudgeResponse = await response.json();
      setJudgmentData(data);
      setPhase("judgment");
    } catch (err) {
      setError("判定に失敗しました");
      console.error(err);
    }
  };

  const handleJudgmentComplete = () => {
    if (judgmentData) {
      onComplete({
        score: judgmentData.score,
        result: judgmentData.result,
      });
    }
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-red-900 p-8 rounded-lg text-white text-center">
        <p className="text-xl mb-4">❌ {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-white text-red-900 px-6 py-2 rounded-lg font-bold"
        >
          リロード
        </button>
      </div>
    );
  }

  if (phase === "loading") {
    return (
      <div className="max-w-2xl mx-auto bg-gray-800 p-12 rounded-lg text-center border-4 border-purple-500">
        <div className="animate-spin text-6xl mb-4">⚔️</div>
        <p className="text-white text-2xl mb-4">AI が上司を生成中...</p>

        {/* タイマー表示 */}
        <div className="text-4xl font-bold text-purple-400 mb-4">
          {loadingTime}秒
        </div>

        <div className="w-full bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-1000"
            style={{
              width: `${Math.min((loadingTime / 60) * 100, 95)}%`,
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          ></div>
        </div>

        <p className="text-gray-400 text-sm">
          Claude AI で理不尽な上司とフレーズを生成しています
        </p>

        {loadingTime < 30 && (
          <p className="text-gray-500 text-xs mt-2">
            初回は30〜60秒ほどかかる場合があります
          </p>
        )}

        {loadingTime >= 30 && loadingTime < 60 && (
          <p className="text-yellow-500 text-sm mt-2 animate-pulse">
            もう少しお待ちください... AI が複雑な生成を行っています
          </p>
        )}

        {loadingTime >= 60 && (
          <p className="text-orange-500 text-sm mt-2 animate-pulse">
            予想より時間がかかっています。しばらくお待ちください...
          </p>
        )}
      </div>
    );
  }

  if (phase === "vs" && battleData) {
    return <VSScreen bossStatement={battleData.bossStatement} />;
  }

  if (
    (phase === "select1" || phase === "select2" || phase === "select3") &&
    battleData
  ) {
    const phaseNum = phase === "select1" ? 1 : phase === "select2" ? 2 : 3;
    const phrasesKey =
      phaseNum === 1 ? "first" : phaseNum === 2 ? "second" : "third";

    return (
      <PhraseSelector
        phase={phaseNum}
        phrases={battleData.phrases[phrasesKey]}
        selectedPhrases={selectedPhrases}
        onSelect={(phrase) => handlePhraseSelect(phrase, phaseNum)}
        bossStatement={battleData.bossStatement}
      />
    );
  }

  if (phase === "response" && battleData) {
    return (
      <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg border-4 border-green-500">
        <h3 className="text-xl text-gray-400 mb-4">あなたの返答:</h3>
        <div className="bg-green-900 p-6 rounded-lg mb-6">
          <p className="text-2xl text-white font-bold">
            {selectedPhrases.join("")}
          </p>
        </div>
        <p className="text-center text-gray-300 animate-pulse">
          判定中...
        </p>
      </div>
    );
  }

  if (phase === "judging") {
    return (
      <div className="max-w-2xl mx-auto bg-gray-800 p-12 rounded-lg text-center border-4 border-yellow-500">
        <div className="animate-bounce text-6xl mb-4">⚖️</div>
        <p className="text-white text-2xl mb-4">AI が論破力を判定中...</p>
        <div className="w-full bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full rounded-full animate-pulse" style={{width: '75%'}}></div>
        </div>
        <p className="text-gray-400 text-sm">
          Claude AI があなたの返答を分析しています
        </p>
        <p className="text-gray-500 text-xs mt-2">
          10〜30秒ほどお待ちください
        </p>
      </div>
    );
  }

  if (phase === "judgment" && judgmentData && battleData) {
    return (
      <JudgmentScreen
        judgmentData={judgmentData}
        playerResponse={selectedPhrases.join("")}
        bossStatement={battleData.bossStatement}
        onComplete={handleJudgmentComplete}
      />
    );
  }

  return null;
}
