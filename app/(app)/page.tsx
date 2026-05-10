'use client';

import {
  PenLine,
  BookOpen,
  Layers,
  Star,
  Stethoscope,
  Compass,
  FlaskConical,
  Rocket,
  Search,
} from 'lucide-react';
import { ToolCard, type ToolCardProps } from '@/components/ToolCard';

const DAILY_TOOLS: ToolCardProps[] = [
  {
    slug: 'pwp',
    name: 'PWP Practice',
    description:
      "Today's formula, today's subject. Pupils write one sentence using the current Programmable Word Pattern — AI checks it's right and explains why.",
    href: '/daily/pwp',
    icon: PenLine,
    badge: 'Daily habit',
    badgeColour: 'green',
  },
  {
    slug: 'dwp',
    name: 'Daily Writing Practice',
    description:
      'A fresh writing prompt every day. Pupils spend 7 minutes writing — AI gives warm, specific feedback without a score in sight.',
    href: '/daily/dwp',
    icon: BookOpen,
    badge: 'Daily habit',
    badgeColour: 'green',
  },
];

const LESSON_TOOLS: ToolCardProps[] = [
  {
    slug: 'connect-grid',
    name: 'Connect Grid Tutor',
    description:
      "Pupils plan their paragraph using WriFe's 3×3 Connect Grid. AI coaches them to stretch each idea from a word into a sentence.",
    href: '/lesson/connect-grid',
    icon: Layers,
    lessons: [27, 29, 35, 36, 37, 38],
    badge: 'Planning',
    badgeColour: 'blue',
  },
  {
    slug: 'sentence-coach',
    name: 'Sentence Quality Coach',
    description:
      'Pupils submit a sentence — AI rates its quality across vocabulary, grammar, and originality, then suggests one clear improvement.',
    href: '/lesson/sentence-coach',
    icon: Star,
    lessons: [11, 13, 17, 25],
    badge: 'Sentence craft',
    badgeColour: 'blue',
  },
  {
    slug: 'story-types',
    name: 'Story Type Identifier',
    description:
      "Pupils paste a story opening — AI identifies which of WriFe's twelve story types it is and explains the tell-tale features.",
    href: '/lesson/story-types',
    icon: Search,
    lessons: [31],
    badge: 'Genre',
    badgeColour: 'blue',
  },
  {
    slug: 'composition',
    name: 'Composition Reviewer',
    description:
      'Pupils submit a paragraph or short piece — AI reviews it against the LSC scaffold (Lead, Support, Close) and gives targeted feedback.',
    href: '/lesson/composition',
    icon: FlaskConical,
    lessons: [39, 40, 41],
    badge: 'Structure',
    badgeColour: 'blue',
  },
  {
    slug: 'editing-doctor',
    name: 'Editing Doctor',
    description:
      'Ten editing modes, one per layer: punctuation, grammar, vocabulary, cohesion, and more. Pupils choose the layer — AI diagnoses it.',
    href: '/lesson/editing-doctor',
    icon: Stethoscope,
    lessons: [42, 43, 44, 45, 46, 47, 48, 49, 50, 51],
    badge: 'Editing',
    badgeColour: 'orange',
  },
  {
    slug: 'genre-coach',
    name: 'Genre Coach',
    description:
      'Nine genre modes from narrative to argument. Pupils submit a piece — AI evaluates it against the exact WriFe genre conventions.',
    href: '/lesson/genre-coach',
    icon: Compass,
    lessons: [52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62],
    badge: 'Genre',
    badgeColour: 'orange',
  },
  {
    slug: 'project-mentor',
    name: 'Project Mentor',
    description:
      "Pupils share where they are in their extended writing project — AI gives chapter-by-chapter guidance and checks they're hitting the brief.",
    href: '/lesson/project-mentor',
    icon: Rocket,
    lessons: [63, 64, 65, 66, 67],
    badge: 'Extended writing',
    badgeColour: 'orange',
  },
];

export default function ToolCataloguePage() {
  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-wrife-text mb-2">
          WriFe AI Writing Tools
        </h1>
        <p className="text-wrife-muted max-w-2xl">
          Nine tools that give every pupil the kind of feedback that would
          otherwise take a teacher one-to-one time with thirty children.
          Aligned to every lesson in the WriFe curriculum.
        </p>
      </div>

      {/* Surface A — Daily Practice */}
      <section className="mb-12">
        <p className="surface-header">Daily Practice — use every day</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {DAILY_TOOLS.map((tool) => (
            <ToolCard key={tool.slug} {...tool} />
          ))}
        </div>
      </section>

      {/* Surface B — Lesson Resources */}
      <section>
        <p className="surface-header">Lesson Resources — lesson-aligned tools</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LESSON_TOOLS.map((tool) => (
            <ToolCard key={tool.slug} {...tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
