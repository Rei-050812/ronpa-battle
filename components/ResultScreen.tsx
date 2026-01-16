import type { GameState } from "@/types";

interface ResultScreenProps {
  gameState: GameState;
  onPlayAgain: () => void;
}

export default function ResultScreen({
  gameState,
  onPlayAgain,
}: ResultScreenProps) {
  const getTitleByScore = (score: number) => {
    if (score >= 500) return "伝説の論破王";
    if (score >= 300) return "論破マスター";
    if (score >= 150) return "論破の達人";
    if (score >= 80) return "論破見習い";
    if (score >= 50) return "新人論破者";
    return "論破修行中";
  };

  const title = getTitleByScore(gameState.score);

  const shareText = `私は上司論破バトルで${gameState.score}点を獲得！
称号は「${title}」でした！

#上司論破バトル
https://ronpa-battle.zero-venture.com`;
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}`;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 rounded-lg p-8 border-4 border-purple-500 shadow-2xl">
        <h2 className="text-4xl font-bold text-center text-white mb-8">
          {gameState.gameOver ? "🎮 GAME OVER" : "✨ CLEAR!"}
        </h2>

        {/* Title Badge */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-6 mb-6 text-center">
          <p className="text-black text-sm font-bold mb-2">あなたの称号</p>
          <p className="text-black text-3xl font-black">{title}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <p className="text-gray-400 mb-2">総スコア</p>
            <p className="text-white text-4xl font-bold">{gameState.score}</p>
            <p className="text-gray-400 text-sm">pt</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <p className="text-gray-400 mb-2">最高コンボ</p>
            <p className="text-white text-4xl font-bold">{gameState.combo}</p>
            <p className="text-gray-400 text-sm">連続</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={onPlayAgain}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-4 px-8 rounded-lg text-xl transform transition hover:scale-105 shadow-lg"
          >
            {gameState.mode === "continuous" && !gameState.gameOver
              ? "🔥 次の上司を論破する"
              : "🔄 もう一回論破する"}
          </button>

          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl text-center transform transition hover:scale-105 shadow-lg"
          >
            🐦 Xでシェア
          </a>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-1">#上司論破バトル</p>
          <p className="text-gray-500 text-xs">Presented by ZEROVENTURE</p>
        </div>
      </div>
    </div>
  );
}
