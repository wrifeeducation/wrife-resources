import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface PWPRequest {
  sentence: string;
  lessonNumber: number;
  formula: string;
  label: string;
  example: string;
  variation: string;
}

export interface PWPResponse {
  correct: boolean;
  score: number;        // 1–5
  feedback: string;     // 2–3 warm, specific sentences
  tip?: string;         // one concrete improvement (only when score < 5)
  error?: string;
}

const SYSTEM_PROMPT = `You are a warm, encouraging WriFe writing coach for primary school pupils aged 7–14.
Your job is to assess a pupil's sentence against a specific WriFe formula and give kind, specific feedback.

Rules:
- Always be encouraging, even when the sentence needs work.
- Never be harsh or condescending.
- Keep feedback short: 2–3 sentences maximum.
- If correct: celebrate what they did well.
- If incorrect: explain gently what is missing or wrong, using simple language a child understands.
- The "tip" should be one concrete, actionable suggestion in plain English.
- Score 5 = perfect formula match with good vocabulary. Score 1 = very far from the formula.

Always respond with valid JSON only — no markdown, no explanation outside the JSON.`;

function buildPrompt(req: PWPRequest): string {
  return `Lesson ${req.lessonNumber} — Formula: ${req.formula}
What it means: ${req.label}
Example: ${req.example}
Today's prompt: ${req.variation}

The pupil wrote: "${req.sentence.trim()}"

Assess the sentence. Does it follow the formula? Is the grammar correct? Is it a complete, sensible sentence?

Respond with this exact JSON structure:
{
  "correct": true or false,
  "score": a number from 1 to 5,
  "feedback": "2–3 sentences of warm, specific feedback",
  "tip": "one concrete improvement suggestion, or omit this field if score is 5"
}`;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured yet. Add ANTHROPIC_API_KEY to Vercel env vars.' },
        { status: 503 }
      );
    }

    const body: PWPRequest = await req.json();

    if (!body.sentence?.trim()) {
      return NextResponse.json({ error: 'No sentence provided.' }, { status: 400 });
    }
    if (body.sentence.trim().length < 3) {
      return NextResponse.json({ error: 'Sentence is too short.' }, { status: 400 });
    }

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildPrompt(body) }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';

    // Strip markdown code fences if model wraps in them
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const result: PWPResponse = JSON.parse(clean);

    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[PWP API]', err);
    return NextResponse.json(
      { error: `Debug: ${msg}` },
      { status: 500 }
    );
  }
}
