import { NextResponse } from "next/server";
import type { GenerateBattleResponse } from "@/types";

// モックデータ - Claude API不要でテスト可能
const mockBattles: GenerateBattleResponse[] = [
  {
    bossStatement: "残業は当たり前だろ。俺の若い頃は毎日終電だったぞ",
    phrases: {
      first: ["しかし", "申し訳ございませんが", "ちょっと待って", "マジで"],
      second: ["労働基準法では", "個人的には", "時代が違いますし", "ChatGPT的には"],
      third: ["違法です", "無理です", "認められていません", "異世界転生します"]
    }
  },
  {
    bossStatement: "有給？忙しい時期に休むなんて社会人失格だ",
    phrases: {
      first: ["恐縮ですが", "でも", "すみません", "ぶっちゃけ"],
      second: ["労働者の権利として", "体調的に", "スケジュール的に", "占い的には"],
      third: ["取得します", "厳しいです", "権利です", "人類の危機です"]
    }
  },
  {
    bossStatement: "今日中に終わらせろ。徹夜してでもやれ",
    phrases: {
      first: ["申し訳ございませんが", "ちょっと待って", "正直", "いやいや"],
      second: ["物理的に", "健康的に", "現実的に", "AI的には"],
      third: ["不可能です", "無理です", "できません", "宇宙の法則が乱れます"]
    }
  },
  {
    bossStatement: "休日も会社の携帯に出るのは常識だろ",
    phrases: {
      first: ["しかしながら", "恐れ入りますが", "いやいや", "ていうか"],
      second: ["労働時間外は", "プライベートでは", "法律上は", "宇宙の真理では"],
      third: ["義務ではありません", "対応できません", "拒否します", "次元が歪みます"]
    }
  },
  {
    bossStatement: "新人なんだから朝は誰よりも早く来い",
    phrases: {
      first: ["恐縮ですが", "すみませんが", "ちょっと", "え？"],
      second: ["就業規則では", "始業時刻は", "常識的に", "量子力学的には"],
      third: ["決まっています", "9時です", "おかしいです", "パラレルワールドです"]
    }
  },
  {
    bossStatement: "飲み会は仕事の延長だ。絶対参加しろ",
    phrases: {
      first: ["申し訳ありませんが", "でも", "正直", "無理"],
      second: ["業務時間外は", "個人的な予定が", "体質的に", "前世の記憶では"],
      third: ["参加義務はありません", "あります", "飲めません", "滅びの予兆です"]
    }
  },
  {
    bossStatement: "給料もらってるんだから文句言うな",
    phrases: {
      first: ["しかし", "恐れ入りますが", "いやでも", "ちょっと待て"],
      second: ["労働の対価として", "正当な報酬を", "権利として", "因果律的に"],
      third: ["適正ではありません", "求めます", "主張します", "時空が歪みます"]
    }
  },
  {
    bossStatement: "病欠？熱が39度くらいで休むな",
    phrases: {
      first: ["申し訳ございませんが", "でも", "いやいや", "は？"],
      second: ["健康管理上", "医学的に", "常識的に", "錬金術的には"],
      third: ["休むべきです", "危険です", "無理です", "賢者の石が必要です"]
    }
  },
  {
    bossStatement: "育休？男が取るもんじゃないだろ",
    phrases: {
      first: ["しかしながら", "恐縮ですが", "いや", "時代錯誤"],
      second: ["法律で認められた", "父親の権利として", "現代では", "進化論的には"],
      third: ["権利です", "取得します", "当然です", "種の多様性です"]
    }
  },
  {
    bossStatement: "ミスしたら給料から天引きだからな",
    phrases: {
      first: ["申し訳ございませんが", "でも", "ちょっと", "それ"],
      second: ["労働基準法では", "法律上", "明確に", "宇宙法典では"],
      third: ["違法です", "禁止されています", "できません", "銀河連邦違反です"]
    }
  },
  {
    bossStatement: "お前の代わりはいくらでもいるんだぞ",
    phrases: {
      first: ["しかし", "恐縮ですが", "でしたら", "なら"],
      second: ["私の経験と", "スキルを持つ人材は", "他社でも", "多元宇宙でも"],
      third: ["評価されます", "少ないです", "転職します", "無限に存在します"]
    }
  },
  {
    bossStatement: "仕事が遅いのはやる気がない証拠だ",
    phrases: {
      first: ["申し訳ございませんが", "しかし", "いや", "違います"],
      second: ["業務量が", "適切なプロセスでは", "効率化すれば", "タイムパラドックス的には"],
      third: ["多すぎます", "時間がかかります", "改善できます", "因果が逆転します"]
    }
  },
  {
    bossStatement: "定時で帰るなんてやる気あるのか",
    phrases: {
      first: ["恐縮ですが", "しかし", "いやいや", "むしろ"],
      second: ["効率的に", "生産性を上げて", "タスク管理で", "時間魔法で"],
      third: ["終わらせています", "完了しました", "可能です", "時を止めました"]
    }
  },
  {
    bossStatement: "資格取得は自腹で休日にやれ",
    phrases: {
      first: ["申し訳ございませんが", "でも", "しかし", "え"],
      second: ["業務に必要なら", "会社の利益になるなら", "制度として", "魔導書的には"],
      third: ["支援すべきです", "補助すべきです", "あるはずです", "禁書です"]
    }
  },
  {
    bossStatement: "若手は飲み物くらい率先して用意しろ",
    phrases: {
      first: ["恐縮ですが", "しかし", "でも", "それって"],
      second: ["業務内容に", "職務には", "平等に", "封印された契約には"],
      third: ["含まれません", "ありません", "すべきです", "記されていません"]
    }
  }
];

export async function POST() {
  try {
    // ランダムにモックデータを返す
    const randomBattle = mockBattles[Math.floor(Math.random() * mockBattles.length)];

    // 実際のAPIのようにちょっと遅延
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json(randomBattle);
  } catch (error) {
    console.error("Error in mock API:", error);
    return NextResponse.json(
      { error: "Failed to generate mock battle" },
      { status: 500 }
    );
  }
}
