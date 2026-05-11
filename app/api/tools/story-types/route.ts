import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { checkApiAccess } from '@/lib/subscription/checkApiAccess';
import { logToolUse } from '@/lib/events/logToolUse';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface StoryTypesRequest {
  passage: string; // the story opening the pupil pasted
}

export interface StoryTypesResponse {
  storyType: string;       // one of the 12 WriFe story types
  confidence: 'high' | 'medium' | 'low';
  explanation: string;     // 2–3 sentences explaining the tell-tale features
  keyFeatures: string[];   // 2–4 bullet-point features found in the text
  alternativeType?: string; // if confidence < high, a plausible second option
  error?: string;
}

// WriFe's 12 story types
const STORY_TYPES = [
  'Quest',
  'Voyage and Return',
  'Rags to Riches',
  'Overcoming the Monster',
  'Rebirth',
  'Comedy',
  'Tragedy',
  'Mystery',
  'Adventure',
  'Forbidden Love',
  'Rivalry',
  'Sacrifice',
];

const SYSTEM_PROMPT = `You are a warm, knowledgeable WriFe writing coach for primary school pupils aged 7–14.
Your job is to identify which of WriFe's twelve story types a story opening belongs to.

WriFe's twelve story types are:
${STORY_TYPES.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Rules:
- Always pick one of the twelve types above — do not invent other categories.
- Explain your reasoning using specific features from the text (character, setting, opening conflict, tone).
- keyFeatures should be 2–4 short phrases identifying the tell-tale features actually found in the passage.
- If confidence is medium or low, name an alternative type that could also fit.
- Write for a Year 5–8 pupil — clear, encouraging, specific.

Always respond with valid JSON only — no markdown, no explanation outside the JSON.`;

function buildPrompt(req: StoryTypesRequest): string {
  return `Here is a story opening a pupil has written or found:

"${req.passage.trim()}"

Identify which of WriFe's twelve story types this most closely matches. Explain the tell-tale features you can see. Rate your confidence as high, medium, or low.

Respond with this exact JSON:
{
  "storyType": "one of the twelve WriFe story types",
  "confidence": "high, medium, or low",
  "explanation": "2–3 sentences explaining why this fits the story type, referencing specific details from the passage",
  "keyFeatures": ["feature 1", "feature 2", "feature 3"],
  "alternativeType": "second possible type if confidence is not high (omit if confidence is high)"
}`;
}

export async function POST(req: NextRequest) {
  try {
    const access = await checkApiAccess('story-types');
    if (access.error) return access.error;

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured.' }, { status: 503 });
    }

    const body: StoryTypesRequest = await req.json();

    if (!body.passage?.trim()) {
      return NextResponse.json({ error: 'No passage provided.' }, { status: 400 });
    }
    if (body.passage.trim().split(' ').length < 10) {
      return NextResponse.json({ error: 'Please paste a longer passage — at least a few sentences.' }, { status: 400 });
    }

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildPrompt(body) }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const result: StoryTypesResponse = JSON.parse(clean);

    void logToolUse({ userId: access.userId, eventType: 'story_types_session', eventData: { story_type: result.storyType, confidence: result.confidence } });

    return NextResponse.json(result);
  } catch (err) {
    console.error('[Story Types API]', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
