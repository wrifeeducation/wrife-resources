/**
 * WriFe Lesson Resources
 * Maps downloadable PDFs to lesson numbers, titles, and categories.
 * Files live in /public/lesson-resources/
 */

export type ResourceCategory =
  | 'starter-pack'
  | 'planning'
  | 'grammar'
  | 'sentence'
  | 'punctuation'
  | 'connect-grid'
  | 'story'
  | 'editing'
  | 'genre'
  | 'poetry';

export interface LessonResource {
  filename: string;
  title: string;
  lesson: number | null; // null = general/starter resource
  category: ResourceCategory;
  type: 'pdf' | 'html';
  description: string;
}

export const LESSON_RESOURCES: LessonResource[] = [
  // ── Starter Pack ─────────────────────────────────────────────────
  {
    filename: '01_Welcome_to_the_WriFe_Pilot.pdf',
    title: 'Welcome to the WriFe Pilot',
    lesson: null,
    category: 'starter-pack',
    type: 'pdf',
    description: 'Introduction guide for pilot schools and teachers.',
  },
  {
    filename: '02_WriFe_Quick_Start_Guide_for_Teachers.pdf',
    title: 'Quick Start Guide for Teachers',
    lesson: null,
    category: 'starter-pack',
    type: 'pdf',
    description: 'Everything you need to get your class up and running.',
  },
  {
    filename: '03_Resource_Index.pdf',
    title: 'Resource Index',
    lesson: null,
    category: 'starter-pack',
    type: 'pdf',
    description: 'Full index of all downloadable resources by lesson.',
  },

  // ── Planning & Vocabulary ─────────────────────────────────────────
  {
    filename: 'WriFe_L01_All_About_Me_Picture_Map.pdf',
    title: 'All About Me Picture Map',
    lesson: 1,
    category: 'planning',
    type: 'pdf',
    description: 'Pupil vocabulary picture map for personal writing topics.',
  },
  {
    filename: 'WriFe_L02_Five_Senses_Booklet.pdf',
    title: 'Five Senses Booklet',
    lesson: 2,
    category: 'planning',
    type: 'pdf',
    description: 'Sensory vocabulary builder for descriptive writing.',
  },
  {
    filename: 'WriFe_L04_Story_Bones_Template.pdf',
    title: 'Story Bones Template',
    lesson: 4,
    category: 'planning',
    type: 'pdf',
    description: 'Scaffold for plotting the core structure of a story.',
  },
  {
    filename: 'WriFe_L05_Story_Mountain_Planner.pdf',
    title: 'Story Mountain Planner',
    lesson: 5,
    category: 'planning',
    type: 'pdf',
    description: 'Classic narrative arc planning sheet.',
  },

  // ── Grammar ───────────────────────────────────────────────────────
  {
    filename: 'WriFe_L07_Determiner_Reference_Card.pdf',
    title: 'Determiner Reference Card',
    lesson: 7,
    category: 'grammar',
    type: 'pdf',
    description: 'Quick-reference card for articles, demonstratives, and quantifiers.',
  },
  {
    filename: 'WriFe_L08_Capital_Letter_Rules_Poster.pdf',
    title: 'Capital Letter Rules Poster',
    lesson: 8,
    category: 'grammar',
    type: 'pdf',
    description: 'Classroom poster covering all capital letter rules.',
  },
  {
    filename: 'WriFe_L08_Irregular_Plurals_Memory_Cards.pdf',
    title: 'Irregular Plurals Memory Cards',
    lesson: 8,
    category: 'grammar',
    type: 'pdf',
    description: 'Print-and-cut flashcards for practising irregular plurals.',
  },
  {
    filename: 'WriFe_L09_Helping_Verb_Anchor_Chart.pdf',
    title: 'Helping Verb Anchor Chart',
    lesson: 9,
    category: 'grammar',
    type: 'pdf',
    description: 'Visual chart of auxiliary/helping verbs for classroom display.',
  },
  {
    filename: 'WriFe_L10_Tense_Timeline_and_Flashcards.pdf',
    title: 'Tense Timeline & Flashcards',
    lesson: 10,
    category: 'grammar',
    type: 'pdf',
    description: 'Timeline graphic and flashcards for past, present, and future tense.',
  },
  {
    filename: 'WriFe_L25_Conjunctions_Anchor_Chart.pdf',
    title: 'Conjunctions Anchor Chart',
    lesson: 25,
    category: 'grammar',
    type: 'pdf',
    description: 'FANBOYS and subordinating conjunctions reference poster.',
  },

  // ── Sentence Building ─────────────────────────────────────────────
  {
    filename: 'WriFe_L11_SVO_Sentence_Builder.pdf',
    title: 'SVO Sentence Builder',
    lesson: 11,
    category: 'sentence',
    type: 'pdf',
    description: 'Subject–Verb–Object sentence construction activity sheet.',
  },
  {
    filename: 'WriFe_L17_Sentence_Builder_Word_Cards.pdf',
    title: 'Sentence Builder Word Cards',
    lesson: 17,
    category: 'sentence',
    type: 'pdf',
    description: 'Print-and-cut word cards for hands-on sentence assembly.',
  },
  {
    filename: 'WriFe_L19_Command_and_Exclamation_Posters.pdf',
    title: 'Command & Exclamation Posters',
    lesson: 19,
    category: 'sentence',
    type: 'pdf',
    description: 'Classroom display posters for command and exclamation sentences.',
  },

  // ── Connect Grid ──────────────────────────────────────────────────
  {
    filename: 'WriFe_L27_Connect_Grid_Pack.pdf',
    title: 'Connect Grid Pack',
    lesson: 27,
    category: 'connect-grid',
    type: 'pdf',
    description: 'Full printable pack for the 3×3 Connect Grid planning tool.',
  },
  {
    filename: 'WriFe_L29_Could_This_Happen_Test_Card.pdf',
    title: '"Could This Happen?" Test Card',
    lesson: 29,
    category: 'connect-grid',
    type: 'pdf',
    description: 'Reference card for evaluating narrative plausibility.',
  },

  // ── Story & Punctuation ───────────────────────────────────────────
  {
    filename: 'WriFe_L31_Seven_Story_Types_Posters.pdf',
    title: 'Seven Story Types Posters',
    lesson: 31,
    category: 'story',
    type: 'pdf',
    description: 'Classroom posters for all twelve WriFe story types.',
  },
  {
    filename: 'WriFe_L33_Speech_Punctuation_Card.pdf',
    title: 'Speech Punctuation Card',
    lesson: 33,
    category: 'punctuation',
    type: 'pdf',
    description: 'Quick-reference card for punctuating direct speech correctly.',
  },

  // ── Editing ───────────────────────────────────────────────────────
  {
    filename: 'WriFe_L42_Grammar_Editing_Checklist.pdf',
    title: 'Grammar Editing Checklist',
    lesson: 42,
    category: 'editing',
    type: 'pdf',
    description: 'Step-by-step checklist for self-editing grammar and punctuation.',
  },
  {
    filename: 'WriFe_L45_Figurative_Language_Bank.pdf',
    title: 'Figurative Language Bank',
    lesson: 45,
    category: 'editing',
    type: 'pdf',
    description: 'Reference bank of similes, metaphors, personification, and more.',
  },
  {
    filename: 'WriFe_L51_Final_Draft_Master_Checklist.pdf',
    title: 'Final Draft Master Checklist',
    lesson: 51,
    category: 'editing',
    type: 'pdf',
    description: 'Comprehensive pre-submission checklist covering all writing layers.',
  },

  // ── Genre Templates ───────────────────────────────────────────────
  {
    filename: 'WriFe_L52_News_Report_Template.pdf',
    title: 'News Report Template',
    lesson: 52,
    category: 'genre',
    type: 'pdf',
    description: 'Scaffolded template for writing a newspaper report.',
  },
  {
    filename: 'WriFe_L54_Diary_Template.pdf',
    title: 'Diary Entry Template',
    lesson: 54,
    category: 'genre',
    type: 'pdf',
    description: 'Structured diary entry writing frame.',
  },
  {
    filename: 'WriFe_L57_Recipe_Instruction_Template.pdf',
    title: 'Recipe & Instructions Template',
    lesson: 57,
    category: 'genre',
    type: 'pdf',
    description: 'Template for procedural/instructional writing in recipe format.',
  },

  // ── Poetry ────────────────────────────────────────────────────────
  {
    filename: 'WriFe_L62_Poetry_Forms_Reference_Sheet.pdf',
    title: 'Poetry Forms Reference Sheet',
    lesson: 62,
    category: 'poetry',
    type: 'pdf',
    description: 'Quick guide to poetic forms covered in the WriFe curriculum.',
  },
];

export const CATEGORY_LABELS: Record<ResourceCategory, string> = {
  'starter-pack': 'Starter Pack',
  planning: 'Planning & Vocabulary',
  grammar: 'Grammar',
  sentence: 'Sentence Building',
  punctuation: 'Punctuation',
  'connect-grid': 'Connect Grid',
  story: 'Story',
  editing: 'Editing',
  genre: 'Genre Templates',
  poetry: 'Poetry',
};

export const CATEGORY_COLOURS: Record<ResourceCategory, string> = {
  'starter-pack': 'bg-wrife-green text-white',
  planning: 'bg-purple-100 text-purple-800',
  grammar: 'bg-blue-100 text-blue-800',
  sentence: 'bg-teal-100 text-teal-800',
  punctuation: 'bg-indigo-100 text-indigo-800',
  'connect-grid': 'bg-orange-100 text-orange-800',
  story: 'bg-pink-100 text-pink-800',
  editing: 'bg-red-100 text-red-800',
  genre: 'bg-amber-100 text-amber-800',
  poetry: 'bg-violet-100 text-violet-800',
};

/** Resources grouped by category, in display order */
export const RESOURCES_BY_CATEGORY = (() => {
  const order: ResourceCategory[] = [
    'starter-pack', 'planning', 'grammar', 'sentence',
    'punctuation', 'connect-grid', 'story', 'editing', 'genre', 'poetry',
  ];
  const map = new Map<ResourceCategory, LessonResource[]>();
  for (const cat of order) map.set(cat, []);
  for (const r of LESSON_RESOURCES) {
    map.get(r.category)?.push(r);
  }
  return map;
})();
