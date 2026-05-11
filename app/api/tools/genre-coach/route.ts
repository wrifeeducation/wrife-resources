import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { checkApiAccess } from '@/lib/subscription/checkApiAccess';
import { logToolUse } from '@/lib/events/logToolUse';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type Genre = 'narrative' | 'non-fiction' | 'persuasive' | 'poetry';

const GENRES: { id: Genre; label: string; icon: string; desc: string }[] = [
  { id: 'narrative',    label: 'Narrative',    icon: '📖', desc: 'Stories, characters, plot, setting, dialogue' },
  { id: 'non-fiction',  label: 'Non-Fiction',  icon: '📰', desc: 'Facts, explanation, report, information' },
  { id: 'persuasive',   label: 'Persuasive',   icon: '📣', desc: 'Argument, opinion, rhetoric, evidence' },
  { id: 'poetry',       label: 'Poetry',       icon: '🎭', desc: 'Imagery, rhythm, sound, emotion, form' },
];

export interface GenreCoachRequest {
  paragraph: string;
  genre: Genre;
}

export interface GenreFeature {
  feature: string;   // e.g. "Vivid setting description"
  found: boolean;    // true = present in the text, false = missing
  example?: string;  // quote from the text if found, or a tip if not found
}

export interface GenreCoachResponse {
  score: number;           // 1–5 how well the paragraph matches the genre
  assessment: string;      // 2–3 warm sentences overall
  features: GenreFeature[]; // 4 key genre features, present or absent
  topTip: string;          // single most impactful improvement for this genre
  praise: string;          // one specific thing done well in this genre
  error?: string;
}

const GENRE_GUIDES: Record<Genre, string> = {
  narrative: `Key features of narrative writing:
- Vivid setting (place, time, atmosphere)
- Character voice or action
- Storyline or conflict hinted at
- Show don't tell — sensory detail
- Varied sentence structure for pace`,

  'non-fiction': `Key features of non-fiction writing:
- Clear topic sentence / main idea
- Facts, data, or specific information
- Technical or subject-specific vocabulary
- Objective, informative tone
- Logical sequencing of ideas`,

  persuasive: `Key features of persuasive writing:
- Clear viewpoint or argument stated
- Rhetorical devices (rule of three, rhetorical questions, direct address)
- Evidence or examples to support points
- Confident, authoritative tone
- Counter-argument acknowledged or dismissed`,

  poetry: `Key features of poetry:
- Imagery — comparisons (simile, metaphor, personification)
- Sound devices — alliteration, assonance, rhyme
- Rhythm or deliberate line breaks
- Emotional or sensory impact
- Precise, chosen word selection`,
};

const SYSTEM_PROMPT = `You are a warm, encouraging WriFe writing coach for primary school pupils aged 7–14.
Your job is to assess a paragraph against the conventions of a specific writing genre.

Check for 4 key genre features. For each, state whether it is present (found: true) or missing (found: false).
- If found: give a short example or quote from the text (15 words max).
- If not found: give a brief tip on how to add it.

Score 1–5 how well the paragraph uses this genre:
- 5 = confidently uses the genre's conventions
- 3 = some genre features present but inconsistent
- 1 = very few genre conventions used

Rules:
- Be warm, specific, and age-appropriate.
- assessment: 2–3 warm sentences about the overall genre match.
- topTip: ONE clear, actionable improvement to make it more genre-appropriate.
- praise: ONE specific thing they did well for this genre.

Always respond with valid JSON only — no markdown, no explanation outside the JSON.`;

function buildPrompt(req: GenreCoachRequest): string {
  const genreInfo = GENRES.find((g) => g.id === req.genre);
  const guide = GENRE_GUIDES[req.genre];

  return `Genre target: ${genreInfo?.label ?? req.genre} (${genreInfo?.desc ?? ''})

${guide}

The pupil wrote:
"${req.paragraph.trim()}"

Assess this paragraph as ${genreInfo?.label ?? req.genre} writing. Check for 4 key genre features and score it 1–5.

Respond with this exact JSON:
{
  "score": 1-5,
  "assessment": "2–3 warm sentences on how well it matches the ${genreInfo?.label ?? req.genre} genre",
  "features": [
    { "feature": "feature name", "found": true, "example": "short quote from text or tip" },
    { "feature": "feature name", "found": false, "example": "brief tip on how to add this" },
    { "feature": "feature name", "found": true, "example": "short quote from text or tip" },
    { "feature": "feature name", "found": false, "example": "brief tip on how to add this" }
  ],
  "topTip": "single most impactful improvement for this genre",
  "praise": "one specific thing they did well for this genre"
}`;
}

export async function POST(req: NextRequest) {
  try {
    const access = await checkApiAccess('genre-coach');
    if (access.error) return access.error;

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured.' }, { status: 503 });
    }

    const body: GenreCoachRequest = await req.json();

    if (!body.paragraph?.trim()) {
      return NextResponse.json({ error: 'No paragraph provided.' }, { status: 400 });
    }
    if (!body.genre) {
      return NextResponse.json({ error: 'No genre selected.' }, { status: 400 });
    }
    if (body.paragraph.trim().split(' ').length < 10) {
      return NextResponse.json(
        { error: 'Please write more — at least a couple of sentences.' },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildPrompt(body) }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const result: GenreCoachResponse = JSON.parse(clean);

    void logToolUse({ userId: access.userId, eventType: 'genre_coach_session', eventData: { genre: body.genre, score: result.score } });

    return NextResponse.json(result);
  } catch (err) {
    console.error('[Genre Coach API]', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
