import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        error: "API key not configured. Please set ANTHROPIC_API_KEY in .env.local"
      }, { status: 500 });
    }

    if (!apiKey.startsWith("sk-ant-")) {
      return NextResponse.json({ error: "Invalid API key format" }, { status: 500 });
    }

    const anthropic = new Anthropic({ apiKey });

    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: "Say 'API test successful' in Japanese.",
        },
      ],
    });

    const content = message.content[0];
    if (content.type === "text") {
      return NextResponse.json({
        success: true,
        response: content.text,
        apiKeyPrefix: apiKey.substring(0, 15) + "..."
      });
    }

    return NextResponse.json({ error: "Unexpected response type" }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Unknown error",
        type: error.constructor.name,
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
