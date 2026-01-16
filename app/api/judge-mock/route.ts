import { NextResponse } from "next/server";
import type { JudgeRequest, JudgeResponse } from "@/types";

// モックの判定ロジック - Claude API不要
export async function POST(request: Request) {
  try {
    const body: JudgeRequest = await request.json();

    // 改善された判定ロジック
    const response = body.playerResponse.toLowerCase();

    let score = 50;
    let coherence = 50;
    let rebuttal = 50;

    // 文頭の判定
    if (response.startsWith("しかし") || response.startsWith("申し訳") || response.startsWith("恐縮")) {
      coherence += 15;
      score += 8;
    } else if (response.startsWith("でも") || response.startsWith("すみません")) {
      coherence += 10;
      score += 5;
    } else if (response.startsWith("マジ") || response.startsWith("いや") || response.startsWith("ぶっちゃけ")) {
      coherence -= 5;
      score -= 3;
    }

    // 論理的な根拠（高評価）
    if (response.includes("労働基準法") || response.includes("法律") || response.includes("就業規則")) {
      rebuttal += 30;
      score += 20;
      coherence += 10;
    }
    if (response.includes("権利") || response.includes("義務")) {
      rebuttal += 25;
      score += 15;
    }
    if (response.includes("違法") || response.includes("禁止") || response.includes("認められ")) {
      rebuttal += 20;
      score += 12;
    }

    // 感情的・実務的な反論（中評価）
    if (response.includes("個人的") || response.includes("体調") || response.includes("健康")) {
      coherence += 15;
      score += 8;
    }
    if (response.includes("無理") || response.includes("できません") || response.includes("不可能")) {
      coherence += 12;
      score += 6;
    }
    if (response.includes("時代") || response.includes("現代") || response.includes("常識")) {
      rebuttal += 10;
      score += 5;
    }

    // ギャグ系（低評価だが文として成立）
    if (response.includes("chatgpt") || response.includes("ai") || response.includes("占い")) {
      coherence -= 10;
      rebuttal -= 15;
      score -= 12;
    }
    if (response.includes("異世界") || response.includes("転生") || response.includes("魔法")) {
      coherence -= 15;
      rebuttal -= 20;
      score -= 15;
    }
    if (response.includes("宇宙") || response.includes("次元") || response.includes("パラレル")) {
      coherence -= 18;
      rebuttal -= 25;
      score -= 18;
    }
    if (response.includes("危機") || response.includes("滅び") || response.includes("法則")) {
      coherence -= 20;
      rebuttal -= 30;
      score -= 20;
    }

    // 文の長さボーナス
    if (response.length > 15 && response.length < 30) {
      coherence += 5;
    } else if (response.length > 30) {
      coherence -= 5; // 長すぎると減点
    }

    // 範囲を0-100に収める
    score = Math.max(0, Math.min(100, score));
    coherence = Math.max(0, Math.min(100, coherence));
    rebuttal = Math.max(0, Math.min(100, rebuttal));

    // 結果判定
    let result: JudgeResponse["result"];
    let comment: string;

    const perfectComments = [
      "完璧な論破！",
      "法的根拠バッチリ！",
      "論理的で説得力抜群！",
      "上司完全論破！",
      "これは勝ち確定！"
    ];
    const goodComments = [
      "なかなか良い反論！",
      "悪くない主張です",
      "筋が通ってます",
      "そこそこ論破",
      "まあまあですね"
    ];
    const okComments = [
      "もう少し頑張って",
      "微妙なライン...",
      "惜しい！",
      "あと一歩",
      "う〜ん..."
    ];
    const koComments = [
      "意味不明です...",
      "何を言ってるの？",
      "支離滅裂！",
      "これは負け",
      "カオスすぎる"
    ];

    if (score >= 80) {
      result = "perfect";
      comment = perfectComments[Math.floor(Math.random() * perfectComments.length)];
    } else if (score >= 60) {
      result = "good";
      comment = goodComments[Math.floor(Math.random() * goodComments.length)];
    } else if (score >= 40) {
      result = "ok";
      comment = okComments[Math.floor(Math.random() * okComments.length)];
    } else {
      result = "ko";
      comment = koComments[Math.floor(Math.random() * koComments.length)];
    }

    // 実際のAPIのようにちょっと遅延
    await new Promise(resolve => setTimeout(resolve, 300));

    const judgeResponse: JudgeResponse = {
      score,
      coherence,
      rebuttal,
      comment,
      result
    };

    return NextResponse.json(judgeResponse);
  } catch (error) {
    console.error("Error in mock judge:", error);
    return NextResponse.json(
      { error: "Failed to judge" },
      { status: 500 }
    );
  }
}
