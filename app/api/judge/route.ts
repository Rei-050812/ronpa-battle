import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import type { JudgeRequest, JudgeResponse } from "@/types";

const SYSTEM_PROMPT = `あなたは論破バトルの審判です。
上司の発言に対する部下の返答を評価してください。

評価基準:
1. coherence(文章の整合性、0-100): 日本語として意味が通るか
2. rebuttal(反論の説得力、0-100): 上司の発言に対する反論として有効か
3. score(総合スコア、0-100): coherence と rebuttal を総合的に判断

判定結果:
- 80-100点: "perfect" (完璧な論破！)
- 60-79点: "good" (まあまあ論破)
- 40-59点: "ok" (微妙...)
- 0-39点: "ko" (意味不明で負け)

出力形式:
{
  "score": 85,
  "coherence": 90,
  "rebuttal": 80,
  "comment": "短い一言コメント(20文字以内)",
  "result": "perfect"
}

出力はJSON形式のみで、他の説明は不要です。`;

export async function POST(request: Request) {
  try {
    const body: JudgeRequest = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `上司の発言: ${body.bossStatement}

部下の返答: ${body.playerResponse}

この返答を評価してください。`,
        },
      ],
      system: SYSTEM_PROMPT,
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    // Extract JSON from the response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const data: JudgeResponse = JSON.parse(jsonMatch[0]);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error judging response:", error);
    return NextResponse.json(
      { error: "Failed to judge response" },
      { status: 500 }
    );
  }
}
