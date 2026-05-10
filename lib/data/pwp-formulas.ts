/**
 * WriFe PWP Formula Library — Lessons 1 to 67
 *
 * Source of truth: WriFe_PWP_Formula_Library_L1-L67.md
 * Used by: /app/api/ai/pwp/route.ts and /app/(app)/daily/pwp/page.tsx
 *
 * Notation:
 *   Det   = determiner (the, a, an, my, this, every …)
 *   Adj   = adjective
 *   N     = noun
 *   V     = verb (main)
 *   HV    = helping / auxiliary verb (is, was, were, will …)
 *   O     = object (full object phrase)
 *   S     = subject (full subject phrase)
 *   Adv   = adverb
 *   Conj  = coordinating conjunction (FANBOYS)
 *   SConj = subordinating conjunction (ISAWAWABUB)
 *   Prep  = preposition
 *
 * Each lesson has five subject variation prompts. The daily session
 * should cycle through these so the formula stays fixed but the
 * subject changes — variation index = (daysSinceLessonStart % 5).
 *
 * Lessons marked confirm: true have titles/formulas that are best-guess
 * and should be verified against WriFe_Curriculum_Complete_For_Lesson_Creation.
 */

export interface PWPFormula {
  lesson: number;
  chapter: string;
  title: string;
  formula: string;        // abstract notation, e.g. "Det + Adj + N + V"
  label: string;          // plain-English description of what the formula does
  example: string;        // teacher's worked example sentence(s)
  variations: string[];   // five subject prompts for daily rotation
  confirm?: boolean;      // true = title/formula needs verification against full curriculum doc
}

export const PWP_FORMULAS: PWPFormula[] = [

  // ─────────────────────────────────────────────────────────────
  // CHAPTER 1 — Stories and Words (L1–L17)
  // ─────────────────────────────────────────────────────────────

  {
    lesson: 1,
    chapter: 'Chapter 1 — Stories and Words',
    title: 'All About Me',
    formula: 'I am + Adj / I have + Det + N',
    label: "Simple 'I am' or 'I have' sentence",
    example: 'I am brave. / I have a brother.',
    variations: [
      'Something you are',
      'Something you have',
      'Something you can do',
      'Somewhere you live',
      'Something you like',
    ],
  },

  {
    lesson: 2,
    chapter: 'Chapter 1 — Stories and Words',
    title: 'Five Senses',
    formula: 'I + sense-V + Det + N',
    label: 'A sense observation sentence',
    example: 'I see the bright sun.',
    variations: [
      'Something you see',
      'Something you hear',
      'Something you smell',
      'Something you taste',
      'Something you feel (touch)',
    ],
  },

  {
    lesson: 3,
    chapter: 'Chapter 1 — Stories and Words',
    title: 'Naming Words',
    formula: 'Det + N + is + Adj',
    label: 'A noun and a describing word about it',
    example: 'The cat is fluffy.',
    variations: [
      'About something at home',
      'About something at school',
      'About a pet',
      'About a friend',
      'About a toy',
    ],
    confirm: true,
  },

  {
    lesson: 4,
    chapter: 'Chapter 1 — Stories and Words',
    title: 'Story Bones (BME structure)',
    formula: 'First / Then / Finally + S + V + O',
    label: 'A simple story-stage sentence',
    example: 'First, the dog dug a hole.',
    variations: [
      'A morning routine',
      'Making toast',
      'Walking to school',
      'Brushing teeth',
      'Bedtime',
    ],
  },

  {
    lesson: 5,
    chapter: 'Chapter 1 — Stories and Words',
    title: 'Story Mountain',
    formula: 'One day, S + V + O',
    label: 'A story-opener sentence',
    example: 'One day, Sam found a key.',
    variations: [
      'About a child',
      'About an animal',
      'About a stranger',
      'About a sibling',
      'About a teacher',
    ],
  },

  {
    lesson: 6,
    chapter: 'Chapter 1 — Stories and Words',
    title: 'Joining Words',
    formula: 'S + V + and + V',
    label: 'Two actions joined with "and"',
    example: 'The bird hopped and sang.',
    variations: [
      'An animal',
      'A friend',
      'Yourself',
      'A character',
      'A teacher',
    ],
    confirm: true,
  },

  {
    lesson: 7,
    chapter: 'Chapter 1 — Stories and Words',
    title: 'Determiners (a / an / the)',
    formula: 'Det + Adj + N + V',
    label: 'A determiner-led subject doing something',
    example: 'A red apple fell.',
    variations: [
      'A "an" word like apple',
      'A "the" word about your school',
      'A "my" word about home',
      'A "this" word in your room',
      'A "three" word in your bag',
    ],
  },

  {
    lesson: 8,
    chapter: 'Chapter 1 — Stories and Words',
    title: 'Capital Letters & Plurals',
    formula: 'Proper Noun + V + Det + plural-N',
    label: 'A name doing something with several nouns',
    example: 'Sam packed three apples.',
    variations: [
      "A friend's name",
      "A teacher's name",
      "A pet's name",
      "A character's name",
      'A family member\'s name',
    ],
  },

  {
    lesson: 9,
    chapter: 'Chapter 1 — Stories and Words',
    title: 'Helping Verbs',
    formula: 'S + HV + V-ing + O',
    label: 'A "is/are/was" sentence with -ing verb',
    example: 'The cat is chasing a leaf.',
    variations: [
      'Something happening now',
      'Yesterday',
      'Tomorrow',
      'In the kitchen',
      'In the playground',
    ],
  },

  {
    lesson: 10,
    chapter: 'Chapter 1 — Stories and Words',
    title: 'Tenses (Past / Present / Future)',
    formula: 'S + V-past / S + V-present / S + will + V',
    label: 'The same idea written in three tenses',
    example: 'I walked to school. I am walking to school. I will walk to school.',
    variations: [
      'Something you do every morning',
      'Something you do at lunch',
      'Something you do after school',
      'Something you do at the weekend',
      'Something you do on holiday',
    ],
  },

  {
    lesson: 11,
    chapter: 'Chapter 1 — Stories and Words',
    title: 'SVO Sentences',
    formula: 'Det + Adj + N + V + Det + N',
    label: 'Subject (with adjective) acts on an object',
    example: 'The big dog chased the ball.',
    variations: [
      'A friend',
      'An animal',
      'A family member',
      'A character from a book',
      'A teacher',
    ],
  },

  {
    lesson: 12,
    chapter: 'Chapter 1 — Stories and Words',
    title: 'Verb Strength',
    formula: 'Det + N + strong-V + Det + N',
    label: 'Replace weak verbs (got, did, was) with vivid ones',
    example: 'The cat pounced on the mouse.',
    variations: [
      'Replace "ran" with a stronger verb',
      'Replace "said"',
      'Replace "walked"',
      'Replace "looked"',
      'Replace "ate"',
    ],
    confirm: true,
  },

  {
    lesson: 13,
    chapter: 'Chapter 1 — Stories and Words',
    title: 'Adverbs',
    formula: 'Det + N + V + Adv',
    label: 'Subject doing something, with an adverb',
    example: 'The dog ran quickly.',
    variations: [
      'A "when" adverb (today, soon)',
      'A "where" adverb (here, outside)',
      'A "how" adverb (loudly, gently)',
      'A "why" reason (because…)',
      'Use any adverb you choose',
    ],
  },

  {
    lesson: 14,
    chapter: 'Chapter 1 — Stories and Words',
    title: 'Multiple Adverbs',
    formula: 'Det + N + V + Adv-how + Adv-when',
    label: 'Add two adverbs to one sentence',
    example: 'She danced gracefully yesterday.',
    variations: [
      'A dance / movement',
      'A meal',
      'A game',
      'A journey',
      'A conversation',
    ],
    confirm: true,
  },

  {
    lesson: 15,
    chapter: 'Chapter 1 — Stories and Words',
    title: 'Comparative Adjectives',
    formula: 'Det + N + is + bigger/smaller + than + Det + N',
    label: 'Compare two things using a comparative adjective',
    example: 'The lion is louder than the cat.',
    variations: [
      'Two animals',
      'Two foods',
      'Two places',
      'Two people',
      'Two objects',
    ],
    confirm: true,
  },

  {
    lesson: 16,
    chapter: 'Chapter 1 — Stories and Words',
    title: 'Prepositions',
    formula: 'Det + N + V + Prep + Det + N',
    label: 'Action happens in/on/under/behind/near a place',
    example: 'The book sat on the table.',
    variations: [
      'Something IN your bag',
      'Something ON the table',
      'Something UNDER your bed',
      'Something BEHIND you',
      'Something NEAR you',
    ],
    confirm: true,
  },

  {
    lesson: 17,
    chapter: 'Chapter 1 — Stories and Words',
    title: 'Sentence Types (Statement / Question / Command / Exclamation)',
    formula: 'Statement / Question / Command / Exclamation',
    label: 'The same topic written as all four sentence types',
    example: 'The dog runs fast. Does the dog run fast? Run, dog! How fast that dog runs!',
    variations: [
      'About the weather',
      'About a meal',
      'About a journey',
      'About a pet',
      'About a game',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CHAPTER 2 — Sentences (L18–L34)
  // ─────────────────────────────────────────────────────────────

  {
    lesson: 18,
    chapter: 'Chapter 2 — Sentences',
    title: 'Black Beauty — Reading Aloud',
    formula: 'Det + N + V + Det + N',
    label: 'Story-style SVO using characters from Black Beauty',
    example: 'The horse pulled the cart.',
    variations: [
      'A horse',
      'A driver',
      'A child',
      'A farmer',
      'A traveller',
    ],
    confirm: true,
  },

  {
    lesson: 19,
    chapter: 'Chapter 2 — Sentences',
    title: 'Commands & Exclamations',
    formula: 'imperative-V + O / What/How + Adj + N + !',
    label: 'A command and a matching exclamation',
    example: 'Stop the horse! / What a beautiful horse!',
    variations: [
      'About a horse',
      'About a meal',
      'About weather',
      'About a sound',
      'About a sight',
    ],
  },

  {
    lesson: 20,
    chapter: 'Chapter 2 — Sentences',
    title: 'Speech Verbs',
    formula: 'S + said-synonym + ", " + speech',
    label: 'Replace "said" with a more precise speech verb',
    example: "Sam whispered, 'Look at this.'",
    variations: [
      'Use "whispered"',
      'Use "shouted"',
      'Use "asked"',
      'Use "muttered"',
      'Use "exclaimed"',
    ],
    confirm: true,
  },

  {
    lesson: 21,
    chapter: 'Chapter 2 — Sentences',
    title: 'Adjective Order',
    formula: 'Det + Adj-size + Adj-colour + N',
    label: 'Adjectives placed in the correct order before a noun',
    example: 'A tiny green frog.',
    variations: [
      'An animal',
      'A vehicle',
      'A piece of clothing',
      'A toy',
      'A piece of food',
    ],
    confirm: true,
  },

  {
    lesson: 22,
    chapter: 'Chapter 2 — Sentences',
    title: 'Compound Subjects',
    formula: 'S + and + S + V + O',
    label: 'Two subjects sharing one verb',
    example: 'The dog and the cat ate the food.',
    variations: [
      'Two animals',
      'Two children',
      'Two characters',
      'Two family members',
      'Two friends',
    ],
    confirm: true,
  },

  {
    lesson: 23,
    chapter: 'Chapter 2 — Sentences',
    title: 'Compound Objects',
    formula: 'S + V + O + and + O',
    label: 'One subject acting on two objects',
    example: 'She packed apples and crisps.',
    variations: [
      'Things in a bag',
      'Things on a plate',
      'Things in a room',
      'Things in a garden',
      'Things in a box',
    ],
    confirm: true,
  },

  {
    lesson: 24,
    chapter: 'Chapter 2 — Sentences',
    title: 'Compound Verbs',
    formula: 'S + V + and + V + O',
    label: 'One subject doing two actions',
    example: 'He laughed and clapped his hands.',
    variations: [
      'Reactions to a joke',
      'Morning routine',
      'Game-playing',
      'Cooking',
      'Saying goodbye',
    ],
    confirm: true,
  },

  {
    lesson: 25,
    chapter: 'Chapter 2 — Sentences',
    title: 'FANBOYS Conjunctions',
    formula: 'Independent clause + , + FANBOYS + Independent clause',
    label: 'Two complete clauses joined by a coordinating conjunction (For/And/Nor/But/Or/Yet/So)',
    example: 'The horse was tired, but he kept walking.',
    variations: [
      'Use BUT',
      'Use AND',
      'Use SO',
      'Use OR',
      'Use YET',
    ],
  },

  {
    lesson: 26,
    chapter: 'Chapter 2 — Sentences',
    title: 'ISAWAWABUB Conjunctions',
    formula: 'SConj + clause + , + clause',
    label: 'Subordinating conjunction fronting a complex sentence (If/Since/As/When/Although/While/After/Before/Until/Because)',
    example: 'When the rain stopped, the children went outside.',
    variations: [
      'Use WHEN',
      'Use BECAUSE',
      'Use IF',
      'Use BEFORE',
      'Use AFTER',
    ],
    confirm: true,
  },

  {
    lesson: 27,
    chapter: 'Chapter 2 — Sentences',
    title: 'Connect Grid — Column 1',
    formula: 'Det + Adj + Proper-N + V + concrete-O + Prep + Det + place',
    label: 'A specific, concrete story event sentence for Column 1 of the Connect Grid',
    example: 'Old Black Beauty pulled the heavy cart through the muddy lane.',
    variations: [
      'A pet doing something',
      'A character from a book',
      'A family event',
      'A school moment',
      'A weekend memory',
    ],
  },

  {
    lesson: 28,
    chapter: 'Chapter 2 — Sentences',
    title: 'Story Setting Sentences',
    formula: 'It was + Adj-time + place-detail + sensory-detail',
    label: 'Open a story with time, place, and a sensory detail',
    example: 'It was a cold winter morning, with frost on every window.',
    variations: [
      'Morning',
      'Evening',
      'A wet day',
      'A hot day',
      'A foggy day',
    ],
    confirm: true,
  },

  {
    lesson: 29,
    chapter: 'Chapter 2 — Sentences',
    title: 'Connect Grid — Column 2 (abstraction)',
    formula: 'A character + abstract-V + abstract-O',
    label: 'The same event made general — must pass the Could-This-Happen test',
    example: 'A character has an unexpected setback.',
    variations: [
      "Abstract a friend's story",
      'Abstract a fairy tale',
      'Abstract a film',
      'Abstract a real event',
      'Abstract a TV scene',
    ],
  },

  {
    lesson: 30,
    chapter: 'Chapter 2 — Sentences',
    title: 'Story Skeleton',
    formula: '[Character] + V + [object] + Prep + [setting]',
    label: 'A reusable story-skeleton template using bracketed variables',
    example: '[Character] discovered [object] in [setting].',
    variations: [
      'Adventure skeleton',
      'Mystery skeleton',
      'Friendship skeleton',
      'Discovery skeleton',
      'Loss skeleton',
    ],
    confirm: true,
  },

  {
    lesson: 31,
    chapter: 'Chapter 2 — Sentences',
    title: "7 Story Types (Booker's archetypes)",
    formula: 'Story-type opening sentence',
    label: 'A first sentence that signals the story type',
    example: 'In the dark wood, something terrible was waiting. (Overcoming the Monster)',
    variations: [
      'Quest opener',
      'Voyage and Return opener',
      'Comedy opener',
      'Tragedy opener',
      'Rebirth opener',
    ],
  },

  {
    lesson: 32,
    chapter: 'Chapter 2 — Sentences',
    title: 'Speech (basic dialogue)',
    formula: '"speech," said + S + .',
    label: 'Direct speech with attribution',
    example: '"It is time to go," said the captain.',
    variations: [
      'Two friends',
      'Parent and child',
      'Teacher and pupil',
      'A stranger',
      'An animal speaking',
    ],
    confirm: true,
  },

  {
    lesson: 33,
    chapter: 'Chapter 2 — Sentences',
    title: 'Speech Punctuation',
    formula: '"X," he said. / He said, "X." / "X," he said, "Y."',
    label: 'All three forms of speech punctuation: speech first, attribution first, split',
    example: '"Hello," she said. / She said, "Hello." / "Hello," she said, "I\'m here."',
    variations: [
      'A greeting',
      'A question',
      'A warning',
      'A command',
      'An apology',
    ],
  },

  {
    lesson: 34,
    chapter: 'Chapter 2 — Sentences',
    title: 'Action + Speech',
    formula: 'S + action-V + . + "speech," + said + S + .',
    label: 'An action sentence followed by a speech sentence',
    example: "Sam dropped the box. 'Oh no!' he cried.",
    variations: [
      'Surprise scene',
      'Argument scene',
      'Parting scene',
      'Greeting scene',
      'Discovery scene',
    ],
    confirm: true,
  },

  // ─────────────────────────────────────────────────────────────
  // CHAPTER 3 — Planning and Drafting (L35–L41)
  // ─────────────────────────────────────────────────────────────

  {
    lesson: 35,
    chapter: 'Chapter 3 — Planning and Drafting',
    title: 'Topic Sentences',
    formula: 'Topic sentence',
    label: "A first sentence of a paragraph that announces the topic",
    example: 'The garden was full of surprises.',
    variations: [
      'Garden topic',
      'Friendship topic',
      'Holiday topic',
      'Lesson topic',
      'Animal topic',
    ],
  },

  {
    lesson: 36,
    chapter: 'Chapter 3 — Planning and Drafting',
    title: 'Supporting Detail Sentences',
    formula: 'For example, S + V + concrete-detail',
    label: 'A specific example that supports the topic sentence',
    example: 'For example, a tiny bird had built a nest in the apple tree.',
    variations: [
      'Garden example',
      'Friend example',
      'Holiday example',
      'Lesson example',
      'Animal example',
    ],
  },

  {
    lesson: 37,
    chapter: 'Chapter 3 — Planning and Drafting',
    title: 'Concluding Sentences',
    formula: 'In the end / All in all + S + V + reflection',
    label: 'A wrap-up sentence that completes a paragraph',
    example: 'In the end, the garden held many secrets.',
    variations: [
      'Reflective conclusion',
      'Hopeful conclusion',
      'Surprising conclusion',
      'Sad conclusion',
      'Funny conclusion',
    ],
  },

  {
    lesson: 38,
    chapter: 'Chapter 3 — Planning and Drafting',
    title: 'Paragraph Building',
    formula: 'Topic + Detail + Detail + Concluding',
    label: 'A four-sentence paragraph: topic → detail → detail → close',
    example: 'The garden was full of surprises. A bird had built a nest. Tiny mushrooms grew between the stones. In the end, the garden held many secrets.',
    variations: [
      'Garden',
      'Bedroom',
      'Beach',
      'Park',
      'Forest',
    ],
    confirm: true,
  },

  {
    lesson: 39,
    chapter: 'Chapter 3 — Planning and Drafting',
    title: 'Story Opening Hook',
    formula: 'Sensory image / question / statement of action',
    label: 'A first sentence designed to grab the reader immediately',
    example: 'The window slammed shut behind me.',
    variations: [
      'Sensory hook',
      'Question hook',
      'Action hook',
      'Dialogue hook',
      'Mystery hook',
    ],
    confirm: true,
  },

  {
    lesson: 40,
    chapter: 'Chapter 3 — Planning and Drafting',
    title: 'Building Tension',
    formula: 'Short sentence + . Short sentence + . Short sentence + .',
    label: 'Three short sentences in a row to build pace',
    example: 'I waited. The door creaked. Nothing moved.',
    variations: [
      'Outside scene',
      'Indoor scene',
      'Sports scene',
      'Surprise scene',
      'Decision moment',
    ],
    confirm: true,
  },

  {
    lesson: 41,
    chapter: 'Chapter 3 — Planning and Drafting',
    title: 'Story Endings',
    formula: 'Reflection / circular / cliffhanger',
    label: 'A final sentence that closes the story with purpose',
    example: 'And from that day on, I never doubted myself again.',
    variations: [
      'Reflective ending',
      'Circular ending (returns to opening)',
      'Surprise ending',
      'Hopeful ending',
      'Open ending',
    ],
    confirm: true,
  },

  // ─────────────────────────────────────────────────────────────
  // CHAPTER 4 — Editing and Cohesion (L42–L51)
  // ─────────────────────────────────────────────────────────────

  {
    lesson: 42,
    chapter: 'Chapter 4 — Editing and Cohesion',
    title: 'Grammar Editing',
    formula: 'Det + Adj + N + HV + V + Adv',
    label: 'A self-edited SVO sentence with correct subject–verb agreement and tense',
    example: 'The dogs were barking loudly.',
    variations: [
      'Singular subject',
      'Plural subject',
      'Past tense',
      'Present continuous',
      'Future tense',
    ],
  },

  {
    lesson: 43,
    chapter: 'Chapter 4 — Editing and Cohesion',
    title: 'Punctuation Editing',
    formula: 'Capital + Sentence + correct end punctuation',
    label: 'Apply correct punctuation — statement, question, or exclamation',
    example: 'Where did you go yesterday?',
    variations: [
      'Statement',
      'Question',
      'Exclamation',
      'Sentence with comma',
      'Sentence with apostrophe',
    ],
    confirm: true,
  },

  {
    lesson: 44,
    chapter: 'Chapter 4 — Editing and Cohesion',
    title: 'Clarity Editing',
    formula: 'S + precise-V + specific-N',
    label: 'Replace vague nouns and weak verbs with specific, vivid ones',
    example: "Vague: 'I got something.' → Clear: 'I caught a tiny silver fish.'",
    variations: [
      'Replace "got"',
      'Replace "did"',
      'Replace "thing"',
      'Replace "stuff"',
      'Replace "nice"',
    ],
    confirm: true,
  },

  {
    lesson: 45,
    chapter: 'Chapter 4 — Editing and Cohesion',
    title: 'Figurative Language',
    formula: 'Sentence containing simile / metaphor / personification / alliteration',
    label: 'A sentence using one figurative device',
    example: 'The lake was as still as glass.',
    variations: [
      'Simile',
      'Metaphor',
      'Personification',
      'Alliteration',
      'Combine two devices',
    ],
  },

  {
    lesson: 46,
    chapter: 'Chapter 4 — Editing and Cohesion',
    title: 'Sentence Variety',
    formula: 'Simple / Compound / Complex',
    label: 'The same idea expressed in three different sentence forms',
    example: 'It rained. It rained, and we got wet. Although it rained, we played outside.',
    variations: [
      'Weather',
      'A meal',
      'A journey',
      'A friendship',
      'A choice',
    ],
  },

  {
    lesson: 47,
    chapter: 'Chapter 4 — Editing and Cohesion',
    title: 'Time Connectives',
    formula: 'Sentence + time-connective + Sentence + time-connective + Sentence',
    label: 'Three sentences linked by time connectives (First / Then / Finally / Suddenly / Meanwhile)',
    example: 'First, I dropped the ball. Then, the dog grabbed it. Finally, I chased her round the garden.',
    variations: [
      'Use First/Then/Finally',
      'Use Suddenly',
      'Use Meanwhile',
      'Use After that',
      'Use At last',
    ],
  },

  {
    lesson: 48,
    chapter: 'Chapter 4 — Editing and Cohesion',
    title: 'Cause and Effect',
    formula: 'S + V + O + because + clause / Because + clause + , + clause',
    label: 'A sentence linking cause and effect using "because"',
    example: 'The plant died because we forgot to water it.',
    variations: [
      'Daily events',
      'Story events',
      'Natural events',
      'Choices',
      'Consequences',
    ],
    confirm: true,
  },

  {
    lesson: 49,
    chapter: 'Chapter 4 — Editing and Cohesion',
    title: 'Paragraph Cohesion',
    formula: 'Five linked sentences on one topic using cohesion devices',
    label: 'A whole paragraph that flows from sentence to sentence',
    example: 'The classroom buzzed with energy. Children chattered at every table. A teacher tried to call the register. Then the bell rang, sharp and sudden. Suddenly, the room fell silent.',
    variations: [
      'Classroom',
      'Park',
      'Kitchen',
      'Beach',
      'Library',
    ],
  },

  {
    lesson: 50,
    chapter: 'Chapter 4 — Editing and Cohesion',
    title: 'Section Cohesion (Multi-paragraph)',
    formula: 'Two paragraphs with a connecting transition sentence between them',
    label: 'Practice transitioning smoothly between paragraphs',
    example: 'The morning had been calm. [new paragraph] By lunchtime, everything had changed.',
    variations: [
      'Time shift',
      'Place shift',
      'Emotion shift',
      'Event shift',
      'Character shift',
    ],
    confirm: true,
  },

  {
    lesson: 51,
    chapter: 'Chapter 4 — Editing and Cohesion',
    title: 'Final Draft',
    formula: 'A polished sentence the pupil is proud of',
    label: "The pupil's best sentence from the day's writing — fully correct and alive",
    example: 'As the last leaf fell, I knew the summer was over.',
    variations: [
      'Best sentence from a story',
      'Best sentence from a description',
      'Best sentence from a poem',
      'Best sentence from a diary',
      'Best sentence from a letter',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CHAPTER 5 — Different Purposes (L52–L62)
  // ─────────────────────────────────────────────────────────────

  {
    lesson: 52,
    chapter: 'Chapter 5 — Different Purposes',
    title: 'News Report',
    formula: 'Lead sentence: WHO + did WHAT + WHEN + WHERE',
    label: 'A news lead sentence covering four of the five Ws',
    example: 'Local children planted 200 trees in Springfield Park yesterday morning.',
    variations: [
      'School news',
      'Sports news',
      'Weather news',
      'Animal news',
      'Community news',
    ],
  },

  {
    lesson: 53,
    chapter: 'Chapter 5 — Different Purposes',
    title: 'Information Text',
    formula: 'Subject + is + Det + class + that + V + complement',
    label: 'A definitional sentence that opens an information text',
    example: 'A dolphin is a mammal that lives in the ocean.',
    variations: [
      'An animal',
      'A place',
      'An object',
      'A profession',
      'A natural feature',
    ],
    confirm: true,
  },

  {
    lesson: 54,
    chapter: 'Chapter 5 — Different Purposes',
    title: 'Diary',
    formula: 'Today + S + V + O + . + I felt + emotion + because + clause',
    label: 'A diary sentence linking a daily event to a feeling',
    example: 'Today I lost my favourite pencil. I felt frustrated because it was a present.',
    variations: [
      'A happy moment',
      'A frustrating moment',
      'A surprising moment',
      'A boring moment',
      'A proud moment',
    ],
  },

  {
    lesson: 55,
    chapter: 'Chapter 5 — Different Purposes',
    title: 'Argument',
    formula: '[Position]. + Firstly + reason. + Secondly + reason. + Therefore + restate.',
    label: 'A mini-argument: claim + two reasons + conclusion',
    example: 'Children should have less homework. Firstly, it tires us out. Secondly, we need time to play. Therefore, less homework would help us learn better.',
    variations: [
      'School topic',
      'Food topic',
      'Pet topic',
      'Holiday topic',
      'Television topic',
    ],
  },

  {
    lesson: 56,
    chapter: 'Chapter 5 — Different Purposes',
    title: 'Letter',
    formula: 'Formal: Dear Sir/Madam + purpose + Yours faithfully / Informal: Dear [name] + news + Love from',
    label: 'A polite formal or friendly informal letter sentence',
    example: 'Formal: "Dear Sir, I am writing to inform you about…" / Informal: "Dear Gran, How are you?…"',
    variations: [
      'Formal complaint',
      'Formal request',
      'Informal news',
      'Informal thanks',
      'Informal invitation',
    ],
  },

  {
    lesson: 57,
    chapter: 'Chapter 5 — Different Purposes',
    title: 'Recipe / Instructions',
    formula: 'imperative-V + Det + N + Prep + Det + N',
    label: 'A clear instruction beginning with a command verb',
    example: 'Pour the milk into the bowl.',
    variations: [
      'Cooking step',
      'Craft step',
      'Game step',
      'Plant care step',
      'Pet care step',
    ],
  },

  {
    lesson: 58,
    chapter: 'Chapter 5 — Different Purposes',
    title: 'Biography',
    formula: 'Proper-N + was born in + place + on + date + . + S + V + achievement',
    label: 'A biography opener linking birth details to a key achievement',
    example: 'Marie Curie was born in Warsaw in 1867. She became one of the greatest scientists in history.',
    variations: [
      'A scientist',
      'An author',
      'A sports person',
      'A historic figure',
      'A family member',
    ],
    confirm: true,
  },

  {
    lesson: 59,
    chapter: 'Chapter 5 — Different Purposes',
    title: 'Recount',
    formula: 'On + day-time + S + V + O + . + Then + S + V + O',
    label: 'A two-stage recount of a real event in the past',
    example: 'On Saturday morning, we went to the beach. Then we built a sandcastle.',
    variations: [
      'Yesterday',
      'Last weekend',
      'On holiday',
      'Last week',
      'This morning',
    ],
    confirm: true,
  },

  {
    lesson: 60,
    chapter: 'Chapter 5 — Different Purposes',
    title: 'Speech (rhetorical)',
    formula: 'Direct-address + rule-of-three + call-to-action',
    label: 'A speech sentence using a rhetorical device',
    example: 'Friends, we must be brave, we must be kind, and we must speak up. Stand with me!',
    variations: [
      'Rule of three',
      'Rhetorical question',
      'Direct address',
      'Imperatives',
      'Repetition',
    ],
  },

  {
    lesson: 61,
    chapter: 'Chapter 5 — Different Purposes',
    title: 'Persuasive Writing',
    formula: 'Persuasive opener + emotional reason + call to action',
    label: 'A persuasive triple: image → feeling → action',
    example: "Imagine a world where every child has a book. Wouldn't that be wonderful? You can help by donating today.",
    variations: [
      'Charity appeal',
      'School improvement',
      'Environment',
      'Sport',
      'Friendship',
    ],
    confirm: true,
  },

  {
    lesson: 62,
    chapter: 'Chapter 5 — Different Purposes',
    title: 'Poetry',
    formula: 'Form-specific line (acrostic / haiku / couplet / limerick / free verse)',
    label: 'One line in a chosen poetry form',
    example: 'Haiku line 1 (5 syllables): "Snow falls on the hills"',
    variations: [
      'Acrostic line',
      'Haiku line (5 syllables)',
      'Couplet line (rhyming)',
      'Limerick line',
      'Free verse line',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CHAPTER 6 — Project-Based Writing (L63–L67)
  // ─────────────────────────────────────────────────────────────

  {
    lesson: 63,
    chapter: 'Chapter 6 — Project-Based Writing',
    title: 'Project Choice',
    formula: 'My project will be + about + topic + because + reason',
    label: 'A project pitch sentence stating topic and personal motivation',
    example: 'My project will be about endangered birds because I want people to care about them.',
    variations: [
      'Animal project',
      'History project',
      'Place project',
      'Person project',
      'Issue project',
    ],
    confirm: true,
  },

  {
    lesson: 64,
    chapter: 'Chapter 6 — Project-Based Writing',
    title: 'Project Plan',
    formula: 'First I will + V. + Then I will + V. + Finally I will + V.',
    label: 'A three-step project plan using time connectives',
    example: 'First I will read about owls. Then I will write notes. Finally I will design my poster.',
    variations: [
      'Research step',
      'Drafting step',
      'Editing step',
      'Designing step',
      'Presenting step',
    ],
    confirm: true,
  },

  {
    lesson: 65,
    chapter: 'Chapter 6 — Project-Based Writing',
    title: 'Project Drafting',
    formula: 'Topic-sentence + 3 detail-sentences + concluding-sentence',
    label: 'A full paragraph for project content: topic → details → close',
    example: 'Owls are remarkable hunters. They have sharp talons. Their eyes see in the dark. Their feathers make no sound. Together, these features make them perfect predators.',
    variations: [
      'Subject paragraph',
      'Habitat paragraph',
      'Diet paragraph',
      'Behaviour paragraph',
      'Threats paragraph',
    ],
    confirm: true,
  },

  {
    lesson: 66,
    chapter: 'Chapter 6 — Project-Based Writing',
    title: 'Project Editing',
    formula: 'A polished sentence refined from the project draft',
    label: 'The pupil\'s best sentence from the project, carefully edited',
    example: 'In silent flight, the snowy owl glides above the frozen tundra in search of its supper.',
    variations: [
      'Best opening',
      'Best image',
      'Best fact',
      'Best transition',
      'Best ending',
    ],
    confirm: true,
  },

  {
    lesson: 67,
    chapter: 'Chapter 6 — Project-Based Writing',
    title: 'Project Presentation',
    formula: 'Hook + main-message + call-to-action',
    label: 'A three-sentence presentation opener: hook → message → action',
    example: "Did you know that one in eight bird species is endangered? My project shows why this matters. Today, I'll show you how we can help.",
    variations: [
      'Question hook',
      'Statistic hook',
      'Story hook',
      'Quote hook',
      'Image hook',
    ],
    confirm: true,
  },
];

// ─────────────────────────────────────────────────────────────
// Helper functions
// ─────────────────────────────────────────────────────────────

/** Get a single formula by lesson number. Returns null if not found. */
export function getFormulaForLesson(lessonNumber: number): PWPFormula | null {
  return PWP_FORMULAS.find(f => f.lesson === lessonNumber) ?? null;
}

/** Get all formulas for a chapter (partial match on chapter string). */
export function getFormulasByChapter(chapterName: string): PWPFormula[] {
  return PWP_FORMULAS.filter(f =>
    f.chapter.toLowerCase().includes(chapterName.toLowerCase())
  );
}

/**
 * Get today's subject variation index for a given lesson.
 * Cycles 0–4 so pupils write about a different subject each day
 * while practising the same formula.
 *
 * @param lessonStartDate  The date the pupil started this lesson (from db)
 * @param today            Today's date (defaults to now)
 */
export function getVariationIndex(lessonStartDate: Date, today: Date = new Date()): number {
  const msPerDay = 86_400_000;
  const daysDiff = Math.floor((today.getTime() - lessonStartDate.getTime()) / msPerDay);
  return Math.abs(daysDiff) % 5;
}

/**
 * Build the user prompt string to send to the AI route.
 * Matches the template in Master Specification Section 9.1.
 */
export function buildPWPUserPrompt(
  formula: PWPFormula,
  pupilSentence: string,
  variationIndex: number
): string {
  const variation = formula.variations[variationIndex] ?? formula.variations[0];
  return [
    `Formula: ${formula.formula} (${formula.label})`,
    `Example: "${formula.example}"`,
    `Today's subject prompt: ${variation}`,
    `Pupil's sentence: "${pupilSentence}"`,
    ``,
    `Lesson ${formula.lesson}: ${formula.title}`,
    ``,
    `Check the sentence. Return ONLY the JSON.`,
  ].join('\n');
}

/** List all lessons that still need curriculum verification. */
export const LESSONS_TO_CONFIRM: number[] = PWP_FORMULAS
  .filter(f => f.confirm)
  .map(f => f.lesson);
