import type { ToolSlug } from '@/lib/supabase/types';

export interface ToolInfo {
  slug: ToolSlug;
  label: string;
  icon: string;
  href: string;
  colour: string;
}

export const ALL_TOOLS: ToolInfo[] = [
  { slug: 'pwp',            label: 'PWP Practice',         icon: '✍️',  href: '/daily/pwp',            colour: '#27AE60' },
  { slug: 'dwp',            label: 'Daily Writing',         icon: '📖',  href: '/daily/dwp',            colour: '#27AE60' },
  { slug: 'connect-grid',   label: 'Connect Grid',          icon: '🔲',  href: '/lesson/connect-grid',  colour: '#4F46E5' },
  { slug: 'sentence-coach', label: 'Sentence Coach',        icon: '⭐',  href: '/lesson/sentence-coach',colour: '#B45309' },
  { slug: 'story-types',    label: 'Story Type Identifier', icon: '🔍',  href: '/lesson/story-types',   colour: '#047857' },
  { slug: 'composition',    label: 'Composition Reviewer',  icon: '📝',  href: '/lesson/composition',   colour: '#7C3AED' },
  { slug: 'editing-doctor', label: 'Editing Doctor',        icon: '🩺',  href: '/lesson/editing-doctor',colour: '#DC2626' },
  { slug: 'genre-coach',    label: 'Genre Coach',           icon: '🎭',  href: '/lesson/genre-coach',   colour: '#2563EB' },
  { slug: 'project-mentor', label: 'Project Mentor',        icon: '🎓',  href: '/lesson/project-mentor',colour: '#059669' },
];

export function getToolInfo(slug: ToolSlug): ToolInfo | undefined {
  return ALL_TOOLS.find((t) => t.slug === slug);
}
