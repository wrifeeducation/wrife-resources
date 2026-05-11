import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { checkApiAccess } from '@/lib/subscription/checkApiAccess';
import { logToolUse } from '@/lib/events/logToolUse';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface ConnectGridRequest {
  topic: string;          // the central topic word (centre of the grid)
  cells: string[];        // up to 8 surrounding words/phrases the pupil entered
  targetCell: number;     // which cell (0-7) the pupil wants coaching on
  cellWord: string;       // the word in that cell
}

export interface ConnectGridResponse {
  coachingText: string;   // 2-3 sentences coaching them to stretch the word into a sentence
  exampleSentence: string; // one example sentence using the word (not the definitive answer)
  nudge?: string;          // optional follow-up question to push thinking further
  error?: string;
}

const SYSTEM_PROMPT = `You are a warm, encouraging WriFe writing coach for primary school pupils aged 7–14.
Your job is to help a pupil use their Connect Grid planning tool. They have a topic word in the centre of a 3×3 grid and have added surrounding words. You are coaching them to stretch one of those surrounding words into a full, interesting sentence.

Rules:
- Be warm, encouraging, and age-appropriate.
- Your coachingText should ask guiding questions that help them build a sentence — don't just write one for them.
- Your exampleSentence shows ONE possible sentence to spark ideas — make it clearly an example, not the only option.
- Keep coachingText to 2–3 sentences.
- Your nudge (optional) is one short question to push their thinking one step further.
- Use simple, friendly language a child would understand.

Always respond with valid JSON only — no markdown, no explanation outside the JSON.`;

function buildPrompt(req: ConnectGridRequest): string {
  const filledCells = req.cells.filter(Boolean).join(', ');
  return `A pupil is planning a piece of writing about: "${req.topic}"

Their Connect Grid surrounding words are: ${filledCells || '(none yet)'}

They want help stretching this word into a sentence: "${req.cellWord}"

Coach them to turn "${req.cellWord}" into a full, interesting sentence about "${req.topic}". Ask guiding questions. Give one short example sentence to spark ideas.

Respond with this exact JSON:
{
  "coachingText": "2–3 warm guiding sentences with questions to help them build a sentence",
  "exampleSentence": "One example sentence to spark ideas (prefaced with e.g.)",
  "nudge": "One optional follow-up question to deepen thinking (omit if not needed)"
}`;
}

export async function POST(req: NextRequest) {
  try {
    const access = await checkApiAccess('connect-grid');
    if (access.error) return access.error;

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured.' },
        { status: 503 }
      );
    }

    const body: ConnectGridRequest = await req.json();

    if (!body.cellWord?.trim()) {
      return NextResponse.json({ error: 'No word provided.' }, { status: 400 });
    }
    if (!body.topic?.trim()) {
      return NextResponse.json({ error: 'No topic provided.' }, { status: 400 });
    }

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildPrompt(body) }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const result: ConnectGridResponse = JSON.parse(clean);

    void logToolUse({ userId: access.userId, eventType: 'connect_grid_session', eventData: { topic: body.topic } });

    return NextResponse.json(result);
  } catch (err) {
    console.error('[Connect Grid API]', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
