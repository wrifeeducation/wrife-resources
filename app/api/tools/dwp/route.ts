import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface DWPRequest {
  text: string;
  promptId: string;
  promptText: string;
  promptType: string;
  wordCount: number;
}

export interface DWPResponse {
  feedback: string;       // 2–3 warm, specific sentences celebrating what they wrote
  highlight: string;      // one specific phrase or sentence they did well
  nudge?: string;         // one optional "push yourself" question to extend thinking
  error?: string;
}

const SYSTEM_PROMPT = `You are a warm, encouraging WriFe writing coach for primary school pupils aged 7–14.
Your job is to respond to a pupil's free writing with genuine, specific encouragement.

Rules:
- This is NOT formula practice — there is no right or wrong answer. Celebrate whatever they wrote.
- Be genuine and specific. Reference something they actually wrote — a word choice, an image, a detail.
- Never be vague ("Good job!"). Always point to something real in their text.
- Keep feedback to 2–3 sentences maximum.
- The "highlight" should be a short phrase or sentence from their writing that stood out — copy it verbatim if possible, or describe it precisely.
- The "nudge" is one optional follow-up question that invites them to think further — only include it if it would add value. Keep it short and open-ended.
- Write as if talking directly to the pupil. Use "you" and "your". Be warm, not sycophantic.
- Do not mention scores, marks, or correctness.

Always respond with valid JSON only — no markdown, no explanation outside the JSON.`;

function buildPrompt(req: DWPRequest): string {
  return `Writing prompt (${req.promptType}): "${req.promptText}"

The pupil wrote (${req.wordCount} words):
"${req.text.trim()}"

Give warm, specific feedback on what they wrote. Pick one moment or phrase that genuinely stood out.

Respond with this exact JSON structure:
{
  "feedback": "2–3 sentences of warm, specific feedback referencing something real in their writing",
  "highlight": "a specific phrase or detail from their writing that you loved",
  "nudge": "one short follow-up question to extend their thinking (or omit this field if not needed)"
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

    const body: DWPRequest = await req.json();

    if (!body.text?.trim()) {
      return NextResponse.json({ error: 'No writing provided.' }, { status: 400 });
    }
    if (body.wordCount < 5) {
      return NextResponse.json({ error: 'Write a little more first!' }, { status: 400 });
    }

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 350,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildPrompt(body) }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const result: DWPResponse = JSON.parse(clean);

    return NextResponse.json(result);
  } catch (err) {
    console.error('[DWP API]', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
