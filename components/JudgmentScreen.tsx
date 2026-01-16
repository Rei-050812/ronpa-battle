import type { JudgeResponse } from "@/types";

interface JudgmentScreenProps {
  judgmentData: JudgeResponse;
  playerResponse: string;
  bossStatement: string;
  onComplete: () => void;
}

export default function JudgmentScreen({
  judgmentData,
  playerResponse,
  bossStatement,
  onComplete,
}: JudgmentScreenProps) {
  const resultConfig = {
    perfect: {
      label: "完璧な論破！",
      emoji: "🔥",
      color: "from-yellow-500 to-orange-500",
      textColor: "text-yellow-400",
      borderColor: "border-yellow-500",
    },
    good: {
      label: "まあまあ論破",
      emoji: "👍",
      color: "from-green-500 to-green-700",
      textColor: "text-green-400",
      borderColor: "border-green-500",
    },
    ok: {
      label: "微妙...",
      emoji: "😅",
      color: "from-blue-500 to-blue-700",
      textColor: "text-blue-400",
      borderColor: "border-blue-500",
    },
    ko: {
      label: "意味不明で負け",
      emoji: "💀",
      color: "from-gray-500 to-gray-700",
      textColor: "text-gray-400",
      borderColor: "border-gray-500",
    },
  };

  const config = resultConfig[judgmentData.result] || resultConfig.ok;

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`bg-gray-800 rounded-lg p-8 border-4 ${config.borderColor} shadow-2xl`}
      >
        {/* Result Badge */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4 animate-bounce">{config.emoji}</div>
          <div
            className={`text-4xl font-black mb-2 bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}
          >
            {config.label}
          </div>
          <div className={`text-6xl font-black ${config.textColor}`}>
            {judgmentData.score}点
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">文章整合性</p>
            <p className="text-white text-2xl font-bold">
              {judgmentData.coherence}
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">反論説得力</p>
            <p className="text-white text-2xl font-bold">
              {judgmentData.rebuttal}
            </p>
          </div>
        </div>

        {/* Comment */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <p className="text-gray-400 text-sm mb-2">審判コメント:</p>
          <p className="text-white text-lg">{judgmentData.comment}</p>
        </div>

        {/* Battle Recap */}
        <div className="space-y-3 mb-8">
          <div className="bg-red-900 rounded-lg p-3 border-l-4 border-red-500">
            <p className="text-red-300 text-xs mb-1">上司:</p>
            <p className="text-white text-sm">「{bossStatement}」</p>
          </div>
          <div className="bg-green-900 rounded-lg p-3 border-l-4 border-green-500">
            <p className="text-green-300 text-xs mb-1">あなた:</p>
            <p className="text-white text-sm">「{playerResponse}」</p>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-4 px-8 rounded-lg text-xl transform transition hover:scale-105 shadow-lg"
        >
          次へ →
        </button>
      </div>
    </div>
  );
}
