import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type EditingMode =
  | 'punctuation'
  | 'grammar'
  | 'vocabulary'
  | 'cohesion'
  | 'sentence-variety'
  | 'paragraphing'
  | 'clarity'
  | 'word-choice'
  | 'spelling'
  | 'style';

const EDITING_MODES: { id: EditingMode; label: string; icon: string; desc: string; lesson: number }[] = [
  { id: 'punctuation',      label: 'Punctuation',      icon: '❝', desc: 'Full stops, commas, apostrophes, speech marks',  lesson: 42 },
  { id: 'grammar',          label: 'Grammar',           icon: '📐', desc: 'Verb tense, subject-verb agreement, word order', lesson: 43 },
  { id: 'vocabulary',       label: 'Vocabulary',        icon: '🔤', desc: 'Word range, precision, avoiding repetition',    lesson: 44 },
  { id: 'cohesion',         label: 'Cohesion',          icon: '🔗', desc: 'Connectives, referencing, flow between ideas',  lesson: 45 },
  { id: 'sentence-variety', label: 'Sentence Variety',  icon: '〰️', desc: 'Short/long mix, openers, rhythm',              lesson: 46 },
  { id: 'paragraphing',     label: 'Paragraphing',      icon: '📄', desc: 'Structure, topic focus, transitions',           lesson: 47 },
  { id: 'clarity',          label: 'Clarity',           icon: '💡', desc: 'Clear meaning, avoiding ambiguity',             lesson: 48 },
  { id: 'word-choice',      label: 'Word Choice',       icon: '🎯', desc: 'Precise, powerful, audience-appropriate words', lesson: 49 },
  { id: 'spelling',         label: 'Spelling',          icon: '✅', desc: 'Common errors, phonics, homophones',            lesson: 50 },
  { id: 'style',            label: 'Style & Voice',     icon: '✨', desc: 'Tone, persona, individual voice',               lesson: 51 },
];

export interface EditingDoctorRequest {
  text: string;
  mode: EditingMode;
}

export interface EditingIssue {
  original: string;    // the problematic text snippet
  issue: string;       // what the problem is
  fix: string;         // the correction or suggestion
}

export interface EditingDoctorResponse {
  score: number;          // 1–5 for this editing dimension
  diagnosis: string;      // 2–3 sentences overall assessment
  issues: EditingIssue[]; // up to 4 specific issues found (empty if score 5)
  praise: string;         // one thing they did well in this dimension
  error?: string;
}

const SYSTEM_PROMPT = `You are a warm, encouraging WriFe writing coach acting as an "Editing Doctor" for primary school pupils aged 7–14.
The pupil has chosen ONE editing dimension to focus on. Your job is to diagnose specific issues in that dimension only — not everything at once.

Rules:
- Focus ONLY on the chosen editing dimension. Ignore other issues.
- Score 1–5 for that dimension (5 = excellent, 1 = many issues).
- diagnosis: 2–3 warm sentences giving the overall assessment for this dimension.
- issues: up to 4 specific examples found in the text. Each has the original snippet, what the issue is, and how to fix it. Empty array if score is 4 or 5.
- praise: one genuine thing they did well in this dimension — always include this.
- Keep language accessible for a Year 5–8 pupil.

Always respond with valid JSON only — no markdown, no explanation outside the JSON.`;

function buildPrompt(req: EditingDoctorRequest): string {
  const modeInfo = EDITING_MODES.find((m) => m.id === req.mode);
  return `Editing dimension: ${modeInfo?.label ?? req.mode} — ${modeInfo?.desc ?? ''}

The pupil wrote:
"${req.text.trim()}"

Diagnose this text for ${modeInfo?.label ?? req.mode} issues only. Score it 1–5 and identify up to 4 specific issues with fixes.

Respond with this exact JSON:
{
  "score": 1-5,
  "diagnosis": "2–3 warm sentences assessing ${modeInfo?.label ?? req.mode}",
  "issues": [
    { "original": "snippet from their text", "issue": "what is wrong", "fix": "how to correct it" }
  ],
  "praise": "one specific thing they did well in this dimension"
}`;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured.' }, { status: 503 });
    }

    const body: EditingDoctorRequest = await req.json();

    if (!body.text?.trim()) {
      return NextResponse.json({ error: 'No text provided.' }, { status: 400 });
    }
    if (!body.mode) {
      return NextResponse.json({ error: 'No editing mode selected.' }, { status: 400 });
    }
    if (body.text.trim().split(' ').length < 10) {
      return NextResponse.json({ error: 'Please write more — at least a couple of sentences.' }, { status: 400 });
    }

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildPrompt(body) }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const result: EditingDoctorResponse = JSON.parse(clean);

    return NextResponse.json(result);
  } catch (err) {
    console.error('[Editing Doctor API]', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
