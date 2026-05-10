import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface SentenceCoachRequest {
  sentence: string;
  context?: string; // optional: what lesson or topic this is for
}

export interface SentenceCoachResponse {
  score: number;         // 1–5 overall
  vocabulary: number;   // 1–5
  grammar: number;      // 1–5
  originality: number;  // 1–5
  feedback: string;     // 2–3 warm sentences
  improvement: string;  // one concrete suggestion
  improved?: string;    // optional: a rewritten version showing the improvement
  error?: string;
}

const SYSTEM_PROMPT = `You are a warm, encouraging WriFe writing coach for primary school pupils aged 7–14.
Your job is to assess a single sentence for quality across three dimensions: vocabulary, grammar, and originality.

Scoring (1–5):
- vocabulary: 1 = very basic words, 5 = rich, precise, varied vocabulary
- grammar: 1 = major errors, 5 = grammatically perfect
- originality: 1 = very generic/clichéd, 5 = fresh, surprising, specific
- score: overall average rounded to nearest whole number

Rules:
- Always be encouraging, even for weak sentences — find something genuine to praise.
- feedback should be 2–3 warm sentences referencing specific words or choices.
- improvement is ONE concrete, actionable suggestion (e.g. "Try swapping 'nice' for a more precise word like 'inviting' or 'vivid'").
- improved: optionally show a short rewritten version demonstrating the improvement — only if it would clearly help.
- Keep language simple enough for a Year 5 pupil.

Always respond with valid JSON only — no markdown, no explanation outside the JSON.`;

function buildPrompt(req: SentenceCoachRequest): string {
  return `${req.context ? `Context: ${req.context}\n\n` : ''}The pupil wrote this sentence:
"${req.sentence.trim()}"

Rate it on vocabulary, grammar, and originality (each 1–5). Give warm feedback and one improvement suggestion.

Respond with this exact JSON:
{
  "score": overall score 1-5,
  "vocabulary": 1-5,
  "grammar": 1-5,
  "originality": 1-5,
  "feedback": "2–3 warm sentences of specific feedback",
  "improvement": "one concrete improvement suggestion",
  "improved": "optional rewritten sentence showing the improvement (omit if not helpful)"
}`;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured.' }, { status: 503 });
    }

    const body: SentenceCoachRequest = await req.json();

    if (!body.sentence?.trim()) {
      return NextResponse.json({ error: 'No sentence provided.' }, { status: 400 });
    }
    if (body.sentence.trim().split(' ').length < 3) {
      return NextResponse.json({ error: 'Sentence is too short — write a complete sentence.' }, { status: 400 });
    }

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildPrompt(body) }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const result: SentenceCoachResponse = JSON.parse(clean);

    return NextResponse.json(result);
  } catch (err) {
    console.error('[Sentence Coach API]', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
