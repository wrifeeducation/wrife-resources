import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface CompositionRequest {
  paragraph: string;
  genre?: string; // optional: narrative, non-fiction, persuasive, poetry
}

export interface CompositionResponse {
  leadScore: number;    // 1–5
  supportScore: number; // 1–5
  closeScore: number;   // 1–5
  overallScore: number; // 1–5
  leadFeedback: string;
  supportFeedback: string;
  closeFeedback: string;
  overallFeedback: string; // 2–3 warm sentences
  topSuggestion: string;   // one most important improvement
  error?: string;
}

const SYSTEM_PROMPT = `You are a warm, encouraging WriFe writing coach for primary school pupils aged 7–14.
Your job is to review a paragraph against WriFe's LSC scaffold:

- LEAD: The opening sentence that introduces the topic, argument, or scene. Should hook the reader.
- SUPPORT: The middle sentences (1–3) that add detail, evidence, description, or development.
- CLOSE: The final sentence that rounds off the paragraph — a summary, conclusion, or clinching image.

Score each section 1–5:
- 1 = missing or very weak
- 3 = present but generic
- 5 = strong, effective, well-crafted

Rules:
- Be warm and specific — always find something genuine to praise.
- Each feedback line should be 1–2 sentences referencing the actual text.
- overallFeedback: 2–3 warm sentences summing up the paragraph's strengths.
- topSuggestion: ONE clear, actionable improvement that would most lift the paragraph.
- overallScore: average of the three section scores, rounded.

Always respond with valid JSON only — no markdown, no explanation outside the JSON.`;

function buildPrompt(req: CompositionRequest): string {
  return `${req.genre ? `Genre: ${req.genre}\n\n` : ''}The pupil wrote this paragraph:

"${req.paragraph.trim()}"

Review it against the LSC scaffold (Lead, Support, Close). Score each section 1–5 and give specific feedback.

Respond with this exact JSON:
{
  "leadScore": 1-5,
  "supportScore": 1-5,
  "closeScore": 1-5,
  "overallScore": 1-5,
  "leadFeedback": "1-2 sentences about the Lead sentence",
  "supportFeedback": "1-2 sentences about the Support sentences",
  "closeFeedback": "1-2 sentences about the Close sentence",
  "overallFeedback": "2-3 warm sentences summing up the paragraph",
  "topSuggestion": "the single most important improvement"
}`;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured.' }, { status: 503 });
    }

    const body: CompositionRequest = await req.json();

    if (!body.paragraph?.trim()) {
      return NextResponse.json({ error: 'No paragraph provided.' }, { status: 400 });
    }
    if (body.paragraph.trim().split(' ').length < 15) {
      return NextResponse.json({ error: 'Please write a full paragraph — at least a few sentences.' }, { status: 400 });
    }

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildPrompt(body) }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const result: CompositionResponse = JSON.parse(clean);

    return NextResponse.json(result);
  } catch (err) {
    console.error('[Composition API]', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
