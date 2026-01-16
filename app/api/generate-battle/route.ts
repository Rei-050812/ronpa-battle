import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import type { GenerateBattleRequest, GenerateBattleResponse } from "@/types";

const SYSTEM_PROMPT = `あなたはブラック企業あるあるゲームのコンテンツ生成AIです。

タスク:
1. ブラック企業の上司が言いそうなリアルで理不尽な発言を1つ生成
2. その発言に対する返答用のフレーズを3段階×各4個生成

【重要】毎回必ず異なるフレーズを生成すること！同じフレーズの使い回し厳禁！

第1フレーズ(文頭) - 切り出し方のバリエーション例:
真面目系: 「恐れ入りますが」「失礼ですが」「申し訳ありませんが」「お言葉ですが」「大変申し上げにくいのですが」
カジュアル系: 「でも」「ちょっと」「えっと」「あの」「すみません」「それって」「いや」「待って」
ネタ系: 「マジで」「ぶっちゃけ」「正直」「ていうか」「つーか」「え、マジ」「冗談でしょ」

第2フレーズ(中盤) - 論理・感情のバリエーション例:
論理系: 「労働基準法では」「就業規則によると」「法律上」「契約書には」「厚生労働省の指針では」「判例では」「弁護士に聞いたら」
感情系: 「体調的に」「精神的に」「家族のことを考えると」「自分の人生を考えて」「健康面で」「プライベートも大事なので」
ネタ系: 「ChatGPT的には」「占い的には」「前世の記憶では」「神のお告げでは」「宇宙の法則的に」「AIの判断では」

第3フレーズ(締め) - 結論のバリエーション例:
論理系: 「違法です」「認められません」「無効です」「問題があります」「コンプライアンス違反です」「訴訟リスクがあります」
感情系: 「無理です」「できません」「辞めます」「お断りします」「考え直します」「納得できません」「限界です」
ネタ系: 「異世界転生します」「人類の危機です」「宇宙の終わりです」「タイムリープします」「記憶を消します」「親に言いつけます」

上司発言のバリエーション例:
- 残業: 「残業代？やる気の問題だよ」「みんな当たり前にやってるよ」「帰るの？空気読めよ」
- 休暇: 「有給？忙しい時期に？」「体調不良？気合で治せ」「家族の用事？仕事優先でしょ」
- 給料: 「給料上げて欲しい？まず結果出せよ」「ボーナス？会社の業績次第だな」
- パワハラ: 「これくらいで？メンタル弱すぎ」「昔はもっと厳しかった」「愛のムチだよ」
- その他: 「飲み会は強制じゃないけど来ないと評価下がるよ」「新人は土日も勉強しろ」

重要なルール:
- フレーズは必ず毎回新しいものを考案すること
- 同じ言い回しを避け、語彙を最大限に広げること
- フレーズは短く(3-15文字程度)
- 各フレーズは独立していて、どの組み合わせでも文法的に接続可能
- 上司発言も毎回全く異なるシチュエーションで生成

出力はJSON形式のみで、他の説明は不要です。`;

export async function POST(request: Request) {
  try {
    const body: GenerateBattleRequest = await request.json();

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
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `ゲームモード: ${body.mode}
難易度: ${body.difficulty || "normal"}

上司の理不尽発言と、それに対する返答フレーズを生成してください。

出力形式:
{
  "bossStatement": "上司の発言",
  "phrases": {
    "first": ["フレーズ1", "フレーズ2", "フレーズ3", "フレーズ4"],
    "second": ["フレーズ1", "フレーズ2", "フレーズ3", "フレーズ4"],
    "third": ["フレーズ1", "フレーズ2", "フレーズ3", "フレーズ4"]
  }
}`,
        },
      ],
      system: SYSTEM_PROMPT,
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    // Extract JSON from the response - find the first complete JSON object
    const text = content.text;
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No JSON found in response");
    }

    const jsonText = text.substring(jsonStart, jsonEnd + 1);
    const data: GenerateBattleResponse = JSON.parse(jsonText);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error generating battle:", error);
    return NextResponse.json(
      { error: "Failed to generate battle content" },
      { status: 500 }
    );
  }
}
