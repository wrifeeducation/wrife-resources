import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type ProjectStage = 'idea' | 'planning' | 'drafting' | 'editing' | 'publishing';

export const PROJECT_STAGES: { id: ProjectStage; label: string; icon: string; desc: string }[] = [
  { id: 'idea',       label: 'Idea Stage',       icon: '💡', desc: 'I have an idea but haven\'t started planning yet' },
  { id: 'planning',   label: 'Planning',          icon: '🗺️', desc: 'I\'m planning my structure and content' },
  { id: 'drafting',   label: 'Drafting',          icon: '✏️', desc: 'I\'m writing my first draft' },
  { id: 'editing',    label: 'Editing',           icon: '🔍', desc: 'I\'m improving and refining my writing' },
  { id: 'publishing', label: 'Nearly Finished',   icon: '🏆', desc: 'I\'m polishing and getting ready to share' },
];

export interface ProjectMentorRequest {
  title: string;         // the project title / working title
  description: string;  // what the project is about (the pupil's own words)
  stage: ProjectStage;  // where they are in the process
  question?: string;    // optional specific question or challenge they have
}

export interface MentorStep {
  step: string;     // a concrete action to take
  why: string;      // brief reason why it helps
}

export interface ProjectMentorResponse {
  encouragement: string;   // 1–2 warm sentences affirming their project idea
  stageAdvice: string;     // 2–3 sentences of advice specific to their current stage
  nextSteps: MentorStep[]; // 3 concrete next steps
  keyQuestion: string;     // one big question for them to think about
  answerToQuestion?: string; // if they asked a specific question, address it here
  error?: string;
}

const STAGE_GUIDANCE: Record<ProjectStage, string> = {
  idea: `At the idea stage, pupils need help clarifying what their project is really about. Good advice focuses on:
- Narrowing the focus (what is the ONE main thing?)
- Thinking about audience (who is this for?)
- Exploring the why (why does this project matter or interest them?)
- Quick planning tools: mindmap, question list, or thumbnail sketches`,

  planning: `At the planning stage, pupils need a clear structure. Good advice focuses on:
- Deciding on the overall shape (beginning, middle, end OR introduction, sections, conclusion)
- Planning the opening hook to grab the reader
- Deciding what to include and what to cut
- Creating a paragraph-level plan (each paragraph = one main idea)`,

  drafting: `At the drafting stage, pupils need to keep momentum. Good advice focuses on:
- Getting words down without worrying about perfection
- Using their plan but being flexible
- Writing the opening and closing sections with care
- Not stopping to edit — save that for later`,

  editing: `At the editing stage, pupils should improve systematically. Good advice focuses on:
- Reading aloud to hear awkward sentences
- Checking one thing at a time (punctuation / vocabulary / structure)
- Adding detail and precision to vague sections
- Cutting repetition and padding`,

  publishing: `At the publishing/finishing stage, pupils should focus on final polish. Good advice focuses on:
- Proofreading for spelling and punctuation errors
- Checking their opening is as strong as possible
- Ensuring the ending gives a sense of completion
- Thinking about presentation and how it will be shared`,
};

const SYSTEM_PROMPT = `You are a warm, encouraging WriFe writing mentor for primary school pupils aged 7–14.
Your job is to give structured, practical advice to help a pupil develop a personal writing project.

Rules:
- Be warm, enthusiastic about their idea, and age-appropriate.
- encouragement: 1–2 sentences affirming their project idea specifically (reference their title or idea).
- stageAdvice: 2–3 sentences of concrete, stage-appropriate advice — practical, not vague.
- nextSteps: exactly 3 concrete actions. Each has a "step" (what to do) and "why" (brief reason).
- keyQuestion: ONE powerful question that will help them think deeper about their project.
- answerToQuestion: ONLY include if they asked a specific question — address it directly and helpfully.
- Keep language clear and encouraging for a Year 5–8 pupil.

Always respond with valid JSON only — no markdown, no explanation outside the JSON.`;

function buildPrompt(req: ProjectMentorRequest): string {
  const stageInfo = PROJECT_STAGES.find((s) => s.id === req.stage);
  const guidance = STAGE_GUIDANCE[req.stage];

  return `A pupil is working on a writing project.

Title: "${req.title.trim()}"
About: "${req.description.trim()}"
Stage: ${stageInfo?.label ?? req.stage} — ${stageInfo?.desc ?? ''}
${req.question ? `Their specific question: "${req.question.trim()}"` : ''}

Stage guidance for your advice:
${guidance}

Give them structured mentoring for their project at this stage.

Respond with this exact JSON:
{
  "encouragement": "1–2 warm sentences affirming their specific project idea",
  "stageAdvice": "2–3 sentences of practical advice for the ${stageInfo?.label ?? req.stage} stage",
  "nextSteps": [
    { "step": "concrete action 1", "why": "brief reason" },
    { "step": "concrete action 2", "why": "brief reason" },
    { "step": "concrete action 3", "why": "brief reason" }
  ],
  "keyQuestion": "one powerful question to help them think deeper"${req.question ? `,\n  "answerToQuestion": "direct, helpful answer to their specific question"` : ''}
}`;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured.' }, { status: 503 });
    }

    const body: ProjectMentorRequest = await req.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Please give your project a title.' }, { status: 400 });
    }
    if (!body.description?.trim()) {
      return NextResponse.json({ error: 'Please describe what your project is about.' }, { status: 400 });
    }
    if (!body.stage) {
      return NextResponse.json({ error: 'Please choose your current stage.' }, { status: 400 });
    }
    if (body.description.trim().split(' ').length < 5) {
      return NextResponse.json(
        { error: 'Tell us a bit more about your project — at least a sentence.' },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildPrompt(body) }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const result: ProjectMentorResponse = JSON.parse(clean);

    return NextResponse.json(result);
  } catch (err) {
    console.error('[Project Mentor API]', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
