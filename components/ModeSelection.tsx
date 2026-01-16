import type { GameMode } from "@/types";

interface ModeSelectionProps {
  onSelect: (mode: GameMode) => void;
}

export default function ModeSelection({ onSelect }: ModeSelectionProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 rounded-lg p-8 shadow-2xl border-4 border-purple-500">
        <div className="flex justify-center mb-8">
          <button
            onClick={() => onSelect("continuous")}
            className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-8 px-12 rounded-lg text-3xl transform transition hover:scale-105 shadow-2xl border-4 border-red-400"
          >
            <div className="text-5xl mb-3">🔥</div>
            <div>バトル開始</div>
            <div className="text-sm font-normal mt-3 opacity-90">
              何回連続で論破できるか挑戦！
            </div>
          </button>
        </div>

        <div className="text-center text-gray-400 text-sm">
          <p>上司の理不尽発言に対して</p>
          <p>3つのフレーズを組み合わせて論破しよう！</p>
          <p className="mt-2 text-purple-400">制限時間: 各フレーズ3秒</p>
        </div>
      </div>
    </div>
  );
}
