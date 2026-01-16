interface VSScreenProps {
  bossStatement: string;
}

export default function VSScreen({ bossStatement }: VSScreenProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative bg-gray-900 rounded-lg p-8 border-4 border-red-500 shadow-2xl">
        {/* VS Badge */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-yellow-500 text-black font-black text-6xl px-8 py-4 rounded-full border-4 border-yellow-300 shadow-2xl animate-pulse">
            VS
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Player Side */}
          <div className="text-center opacity-90">
            <div className="bg-blue-600 rounded-lg p-4 mb-4">
              <p className="text-white font-bold text-xl">YOU</p>
            </div>
            <div className="text-6xl mb-2">🧑</div>
            <p className="text-white font-bold">部下</p>
          </div>

          {/* Boss Side */}
          <div className="text-center opacity-90">
            <div className="bg-red-600 rounded-lg p-4 mb-4">
              <p className="text-white font-bold text-xl">BOSS</p>
            </div>
            <div className="text-6xl mb-2">😈</div>
            <p className="text-white font-bold">ブラック上司</p>
          </div>
        </div>

        {/* Boss Statement */}
        <div className="mt-8 bg-red-900 rounded-lg p-6 border-2 border-red-500">
          <p className="text-sm text-red-300 mb-2">上司の発言:</p>
          <p className="text-white text-xl font-bold leading-relaxed">
            「{bossStatement}」
          </p>
        </div>
      </div>
    </div>
  );
}
