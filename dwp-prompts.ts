/**
 * WriFe DWP Prompt Bank — 365 Daily Writing Prompts
 *
 * Source of truth: WriFe_DWP_Prompt_Bank_365.md
 * Used by: /app/api/ai/dwp/route.ts and /app/(app)/daily/dwp/page.tsx
 *
 * Distribution:
 *   Sensory     60   s001–s060
 *   Narrative  105   n001–n105  (real memories n001–n055, imaginary n056–n100, story starters n101–n105)
 *   Reflection  60   r001–r060
 *   Description 80   d001–d080
 *   Argument    60   a001–a060
 *   Total      365
 *
 * ID format: one letter prefix (s/n/r/d/a) + zero-padded 3-digit number.
 *
 * Rotation rules (enforced in getPromptForUserAndDate):
 *   1. Pull the pupil's prompt IDs from the last 90 days (from ai_attempts table).
 *   2. Match the target type for today's day-of-week (TYPE_BY_DAY).
 *   3. Filter to unused prompts of that type.
 *   4. Pick deterministically: same user + same date = same prompt.
 */

export type DWPPromptType = 'sensory' | 'narrative' | 'reflection' | 'description' | 'argument';

export interface DWPPrompt {
  id: string;                // e.g. "s001", "n042", "r007"
  type: DWPPromptType;
  text: string;
}

export const DWP_PROMPTS: DWPPrompt[] = [

  // ─────────────────────────────────────────────────────────────
  // SENSORY — s001 to s060
  // ─────────────────────────────────────────────────────────────
  { id: 's001', type: 'sensory', text: 'Describe one thing you noticed on the way to school today.' },
  { id: 's002', type: 'sensory', text: 'What was the loudest sound you heard this morning?' },
  { id: 's003', type: 'sensory', text: 'Close your eyes for one minute. What do you hear?' },
  { id: 's004', type: 'sensory', text: 'What does your favourite breakfast taste like?' },
  { id: 's005', type: 'sensory', text: 'Describe the smell of your kitchen when something is cooking.' },
  { id: 's006', type: 'sensory', text: 'What do raindrops feel like on your face?' },
  { id: 's007', type: 'sensory', text: 'Describe the texture of your favourite jumper.' },
  { id: 's008', type: 'sensory', text: 'What is the most beautiful colour you have ever seen?' },
  { id: 's009', type: 'sensory', text: 'What does the playground sound like at break time?' },
  { id: 's010', type: 'sensory', text: 'Describe the smell of the sea (or imagine it).' },
  { id: 's011', type: 'sensory', text: 'What does freshly cut grass smell like to you?' },
  { id: 's012', type: 'sensory', text: 'Pick one thing in your room. Describe how it looks AND how it feels.' },
  { id: 's013', type: 'sensory', text: 'What sound do you hear before you fall asleep?' },
  { id: 's014', type: 'sensory', text: 'What does your school uniform feel like when it is brand new?' },
  { id: 's015', type: 'sensory', text: 'Describe the taste of your favourite drink without naming it.' },
  { id: 's016', type: 'sensory', text: 'What does the air smell like first thing in the morning?' },
  { id: 's017', type: 'sensory', text: 'Describe the sound of your favourite song without naming it.' },
  { id: 's018', type: 'sensory', text: 'What does rain sound like on a window?' },
  { id: 's019', type: 'sensory', text: 'Pick a fruit. Describe it as if your reader has never seen one.' },
  { id: 's020', type: 'sensory', text: 'What does darkness feel like to you?' },
  { id: 's021', type: 'sensory', text: 'Describe the shape of a cloud you saw today.' },
  { id: 's022', type: 'sensory', text: 'What does it feel like when your hands are very cold?' },
  { id: 's023', type: 'sensory', text: 'Describe the smell of a library or a bookshop.' },
  { id: 's024', type: 'sensory', text: 'What sound makes you feel happy?' },
  { id: 's025', type: 'sensory', text: 'What does a hot drink feel like on a cold day?' },
  { id: 's026', type: 'sensory', text: 'Describe a sound that scares you a little.' },
  { id: 's027', type: 'sensory', text: 'What does the inside of your school bag smell like?' },
  { id: 's028', type: 'sensory', text: 'Pick a leaf. Describe its colour, shape, and texture.' },
  { id: 's029', type: 'sensory', text: 'What does sunlight feel like through a window?' },
  { id: 's030', type: 'sensory', text: 'Describe the taste of toothpaste.' },
  { id: 's031', type: 'sensory', text: 'What does fresh laundry smell like?' },
  { id: 's032', type: 'sensory', text: 'Describe the sound of your shoes on different surfaces.' },
  { id: 's033', type: 'sensory', text: 'What does a bath feel like when it is just the right temperature?' },
  { id: 's034', type: 'sensory', text: 'Describe the weight of your school bag.' },
  { id: 's035', type: 'sensory', text: 'What does silence sound like in your house?' },
  { id: 's036', type: 'sensory', text: 'Pick a stone. How does it feel? What colours can you see in it?' },
  { id: 's037', type: 'sensory', text: 'Describe the smell of bread baking.' },
  { id: 's038', type: 'sensory', text: 'What does it feel like to step on autumn leaves?' },
  { id: 's039', type: 'sensory', text: 'What do bubbles look like up close?' },
  { id: 's040', type: 'sensory', text: 'Describe the smell of a wet dog.' },
  { id: 's041', type: 'sensory', text: 'What does an ice cube feel like in your hand?' },
  { id: 's042', type: 'sensory', text: 'Describe the sound of a busy road from far away.' },
  { id: 's043', type: 'sensory', text: "What does soap taste like? (Don't try this!)" },
  { id: 's044', type: 'sensory', text: 'Describe a sound you can only hear at night.' },
  { id: 's045', type: 'sensory', text: 'What does sand feel like between your toes?' },
  { id: 's046', type: 'sensory', text: 'Describe the smell of rain on hot pavement.' },
  { id: 's047', type: 'sensory', text: 'What does honey feel like on a spoon?' },
  { id: 's048', type: 'sensory', text: 'Describe the sound your fridge makes.' },
  { id: 's049', type: 'sensory', text: 'What does it feel like when wind blows in your hair?' },
  { id: 's050', type: 'sensory', text: "Describe the taste of a vegetable you don't like." },
  { id: 's051', type: 'sensory', text: 'What does a feather feel like?' },
  { id: 's052', type: 'sensory', text: 'Describe the smell of an old book.' },
  { id: 's053', type: 'sensory', text: 'What does running fast feel like?' },
  { id: 's054', type: 'sensory', text: 'Describe the sound of footsteps in an empty hallway.' },
  { id: 's055', type: 'sensory', text: 'What does it feel like to swim underwater?' },
  { id: 's056', type: 'sensory', text: 'Describe the texture of clay or playdough.' },
  { id: 's057', type: 'sensory', text: 'What does the smell of a campfire remind you of?' },
  { id: 's058', type: 'sensory', text: 'Describe the sound a balloon makes when it pops.' },
  { id: 's059', type: 'sensory', text: 'What does the surface of a frozen puddle look like?' },
  { id: 's060', type: 'sensory', text: 'Describe one beautiful sound you heard this week.' },

  // ─────────────────────────────────────────────────────────────
  // NARRATIVE — n001 to n105
  // Real memories: n001–n055
  // ─────────────────────────────────────────────────────────────
  { id: 'n001', type: 'narrative', text: 'Tell me about the time you woke up earlier than everyone else.' },
  { id: 'n002', type: 'narrative', text: 'Describe the best day you can remember.' },
  { id: 'n003', type: 'narrative', text: 'Tell me about a time you got lost (or nearly did).' },
  { id: 'n004', type: 'narrative', text: 'Write about your first day at school (any school).' },
  { id: 'n005', type: 'narrative', text: 'Tell me about a time you helped someone.' },
  { id: 'n006', type: 'narrative', text: 'Describe a holiday you wish you could repeat.' },
  { id: 'n007', type: 'narrative', text: 'Tell me about a meal that went wrong.' },
  { id: 'n008', type: 'narrative', text: 'Write about a time you laughed so hard your stomach hurt.' },
  { id: 'n009', type: 'narrative', text: 'Tell me about a small adventure you had outside.' },
  { id: 'n010', type: 'narrative', text: 'Describe a time you tried something new and surprised yourself.' },
  { id: 'n011', type: 'narrative', text: 'Tell me about a journey you took (even a short one).' },
  { id: 'n012', type: 'narrative', text: 'Write about a time you made a friend somewhere unexpected.' },
  { id: 'n013', type: 'narrative', text: "Tell me about a time you saw something you couldn't explain." },
  { id: 'n014', type: 'narrative', text: 'Describe a moment when you felt very brave.' },
  { id: 'n015', type: 'narrative', text: "Tell me about something you found that wasn't yours." },
  { id: 'n016', type: 'narrative', text: 'Write about a time you caught the bus or train alone.' },
  { id: 'n017', type: 'narrative', text: 'Tell me about your favourite birthday.' },
  { id: 'n018', type: 'narrative', text: 'Describe a time you tried to keep a secret.' },
  { id: 'n019', type: 'narrative', text: 'Tell me about a time the weather changed your plans.' },
  { id: 'n020', type: 'narrative', text: 'Write about a moment you felt proud of yourself.' },
  { id: 'n021', type: 'narrative', text: 'Tell me about a time you helped a younger child.' },
  { id: 'n022', type: 'narrative', text: 'Describe a time when something broke (and how you felt).' },
  { id: 'n023', type: 'narrative', text: 'Tell me about a journey on your bike.' },
  { id: 'n024', type: 'narrative', text: 'Write about a moment you were really kind.' },
  { id: 'n025', type: 'narrative', text: 'Tell me about a time you got into trouble.' },
  { id: 'n026', type: 'narrative', text: 'Describe a meal someone cooked for you that you loved.' },
  { id: 'n027', type: 'narrative', text: 'Tell me about a time you forgot something important.' },
  { id: 'n028', type: 'narrative', text: 'Write about a small act of kindness someone did for you.' },
  { id: 'n029', type: 'narrative', text: "Tell me about a moment you couldn't stop laughing." },
  { id: 'n030', type: 'narrative', text: 'Describe a time you felt completely safe.' },
  { id: 'n031', type: 'narrative', text: 'Tell me about a time you saw an animal up close.' },
  { id: 'n032', type: 'narrative', text: 'Write about a time the lights went out.' },
  { id: 'n033', type: 'narrative', text: 'Tell me about a time you helped tidy up.' },
  { id: 'n034', type: 'narrative', text: 'Describe a memory of your grandparent or older relative.' },
  { id: 'n035', type: 'narrative', text: 'Tell me about a time you stayed up late.' },
  { id: 'n036', type: 'narrative', text: 'Write about a moment you felt proud of someone else.' },
  { id: 'n037', type: 'narrative', text: 'Tell me about a time you found something amazing in nature.' },
  { id: 'n038', type: 'narrative', text: "Describe a moment when you couldn't believe your eyes." },
  { id: 'n039', type: 'narrative', text: 'Tell me about a small mistake you made.' },
  { id: 'n040', type: 'narrative', text: 'Write about a time you fixed something.' },
  { id: 'n041', type: 'narrative', text: 'Tell me about your favourite memory of a friend.' },
  { id: 'n042', type: 'narrative', text: 'Describe a time you learned to do something new.' },
  { id: 'n043', type: 'narrative', text: "Tell me about a journey somewhere you'd never been." },
  { id: 'n044', type: 'narrative', text: 'Write about a time someone surprised you with a kind word.' },
  { id: 'n045', type: 'narrative', text: 'Tell me about a time you cooked something.' },
  { id: 'n046', type: 'narrative', text: "Describe a moment when a plan didn't work but it was still fun." },
  { id: 'n047', type: 'narrative', text: 'Tell me about a time you watched the sun rise or set.' },
  { id: 'n048', type: 'narrative', text: 'Write about a time you helped an animal.' },
  { id: 'n049', type: 'narrative', text: 'Tell me about a time you finished something hard.' },
  { id: 'n050', type: 'narrative', text: 'Describe a moment you remember from when you were very small.' },
  { id: 'n051', type: 'narrative', text: 'Tell me about a time you played outside in the rain.' },
  { id: 'n052', type: 'narrative', text: 'Write about a time someone gave you good advice.' },
  { id: 'n053', type: 'narrative', text: 'Tell me about a time you wore something brand new.' },
  { id: 'n054', type: 'narrative', text: 'Describe a moment when you felt like part of a team.' },
  { id: 'n055', type: 'narrative', text: 'Tell me about something you taught someone else.' },

  // Imaginary scenarios: n056–n100
  { id: 'n056', type: 'narrative', text: 'Imagine you woke up as an animal for one day. Tell me what happened.' },
  { id: 'n057', type: 'narrative', text: 'Imagine your pet (or favourite animal) could talk for one hour. What did you discuss?' },
  { id: 'n058', type: 'narrative', text: 'Imagine you found a key under your pillow. Where did it open?' },
  { id: 'n059', type: 'narrative', text: 'Imagine school disappeared for a week. Tell me what you did.' },
  { id: 'n060', type: 'narrative', text: 'Imagine a dragon moved into your garden. Tell me about Day 1.' },
  { id: 'n061', type: 'narrative', text: 'Imagine you could shrink to the size of an ant. Tell me where you went.' },
  { id: 'n062', type: 'narrative', text: 'Imagine your toys came alive at night. Tell me what they got up to.' },
  { id: 'n063', type: 'narrative', text: "Imagine you found a door in your bedroom that wasn't there yesterday." },
  { id: 'n064', type: 'narrative', text: 'Imagine you could talk to one tree in your area. What did the tree tell you?' },
  { id: 'n065', type: 'narrative', text: 'Imagine you had to spend a day inside a video game. Which one and what happened?' },
  { id: 'n066', type: 'narrative', text: 'Imagine you discovered an island that no one else knew about.' },
  { id: 'n067', type: 'narrative', text: 'Imagine you swapped lives with your favourite character for a day.' },
  { id: 'n068', type: 'narrative', text: 'Imagine the moon was actually a giant cheese. What happened next?' },
  { id: 'n069', type: 'narrative', text: 'Imagine you woke up speaking a different language. Tell me about your morning.' },
  { id: 'n070', type: 'narrative', text: 'Imagine your pencil could grant one wish. What did you ask for?' },
  { id: 'n071', type: 'narrative', text: 'Imagine you found a baby dragon in the school cloakroom.' },
  { id: 'n072', type: 'narrative', text: 'Imagine you had to organise a birthday party for a giant.' },
  { id: 'n073', type: 'narrative', text: 'Imagine animals took over your house for a day.' },
  { id: 'n074', type: 'narrative', text: 'Imagine you became a teacher for one lesson. What did you teach?' },
  { id: 'n075', type: 'narrative', text: 'Imagine you discovered a hidden room in your school.' },
  { id: 'n076', type: 'narrative', text: 'Imagine you could fly for one hour. Where did you go?' },
  { id: 'n077', type: 'narrative', text: 'Imagine you found a letter addressed to "the new owner of the world".' },
  { id: 'n078', type: 'narrative', text: 'Imagine you could change one thing about yourself for a day.' },
  { id: 'n079', type: 'narrative', text: 'Imagine you woke up famous. Tell me about your morning.' },
  { id: 'n080', type: 'narrative', text: 'Imagine you had to live without electricity for one day.' },
  { id: 'n081', type: 'narrative', text: 'Imagine you found a treasure chest in your back garden.' },
  { id: 'n082', type: 'narrative', text: 'Imagine you became invisible for an hour. What did you do?' },
  { id: 'n083', type: 'narrative', text: 'Imagine you discovered your house could move.' },
  { id: 'n084', type: 'narrative', text: 'Imagine you could go back in time to one day in your life. Which day?' },
  { id: 'n085', type: 'narrative', text: 'Imagine you swapped places with a teacher for a morning.' },
  { id: 'n086', type: 'narrative', text: 'Imagine you grew taller than your house overnight. What was difficult?' },
  { id: 'n087', type: 'narrative', text: "Imagine you could read minds for ten minutes. Whose did you read?" },
  { id: 'n088', type: 'narrative', text: 'Imagine your favourite book character knocked on your door.' },
  { id: 'n089', type: 'narrative', text: 'Imagine you woke up in a fairy tale. Which one?' },
  { id: 'n090', type: 'narrative', text: "Imagine you could borrow any animal's powers for a day." },
  { id: 'n091', type: 'narrative', text: 'Imagine the school playground turned into a jungle.' },
  { id: 'n092', type: 'narrative', text: 'Imagine you could only speak in questions for a day.' },
  { id: 'n093', type: 'narrative', text: 'Imagine you won a prize but no one believed you.' },
  { id: 'n094', type: 'narrative', text: 'Imagine your shoes could walk you anywhere by themselves.' },
  { id: 'n095', type: 'narrative', text: 'Imagine you found a phone that called the future.' },
  { id: 'n096', type: 'narrative', text: 'Imagine your pet became the size of a horse.' },
  { id: 'n097', type: 'narrative', text: 'Imagine you discovered you could communicate with insects.' },
  { id: 'n098', type: 'narrative', text: 'Imagine your dreams started coming true the next day.' },
  { id: 'n099', type: 'narrative', text: 'Imagine you could repeat one day of your life as many times as you wanted.' },
  { id: 'n100', type: 'narrative', text: 'Imagine you found a map with a treasure marked on your road.' },

  // Story starters: n101–n105
  { id: 'n101', type: 'narrative', text: 'Tell me a story that begins: "It was the loudest knock I had ever heard."' },
  { id: 'n102', type: 'narrative', text: 'Tell me a story that begins: "I knew something was wrong as soon as I opened the door."' },
  { id: 'n103', type: 'narrative', text: 'Tell me a story that begins: "Nobody else seemed to have noticed."' },
  { id: 'n104', type: 'narrative', text: 'Tell me a story that begins: "It started as a normal Tuesday."' },
  { id: 'n105', type: 'narrative', text: 'Tell me a story that begins: "There was something different about her."' },

  // ─────────────────────────────────────────────────────────────
  // REFLECTION — r001 to r060
  // ─────────────────────────────────────────────────────────────
  { id: 'r001', type: 'reflection', text: 'What makes you happy without costing any money?' },
  { id: 'r002', type: 'reflection', text: 'Who is the kindest person you know? Why?' },
  { id: 'r003', type: 'reflection', text: 'What is one thing you used to find hard but can do now?' },
  { id: 'r004', type: 'reflection', text: 'If you could give your younger self one piece of advice, what would it be?' },
  { id: 'r005', type: 'reflection', text: 'What makes a good friend?' },
  { id: 'r006', type: 'reflection', text: 'What is something you wish more grown-ups understood?' },
  { id: 'r007', type: 'reflection', text: 'What is something you wish more children understood?' },
  { id: 'r008', type: 'reflection', text: "What's one thing you'd like to be braver about?" },
  { id: 'r009', type: 'reflection', text: 'What does "home" mean to you?' },
  { id: 'r010', type: 'reflection', text: 'What makes you feel calm?' },
  { id: 'r011', type: 'reflection', text: 'What makes you feel safe?' },
  { id: 'r012', type: 'reflection', text: 'What is something you are proud of (big or small)?' },
  { id: 'r013', type: 'reflection', text: "What is something you've changed your mind about?" },
  { id: 'r014', type: 'reflection', text: 'What does it mean to be polite?' },
  { id: 'r015', type: 'reflection', text: "What's the best thing about your age?" },
  { id: 'r016', type: 'reflection', text: "What's the trickiest thing about your age?" },
  { id: 'r017', type: 'reflection', text: 'What does it feel like to be excited?' },
  { id: 'r018', type: 'reflection', text: 'What does it feel like to be patient?' },
  { id: 'r019', type: 'reflection', text: 'If you could give the world one gift, what would it be?' },
  { id: 'r020', type: 'reflection', text: 'What makes you laugh?' },
  { id: 'r021', type: 'reflection', text: "What's something you've learned this week?" },
  { id: 'r022', type: 'reflection', text: "What's a moment you'd like to remember forever?" },
  { id: 'r023', type: 'reflection', text: "Who do you think about when you can't sleep?" },
  { id: 'r024', type: 'reflection', text: "What's the bravest thing you've done?" },
  { id: 'r025', type: 'reflection', text: "What's the kindest thing someone has done for you?" },
  { id: 'r026', type: 'reflection', text: "What's the kindest thing you've done?" },
  { id: 'r027', type: 'reflection', text: 'What is something you find easy that other people seem to find hard?' },
  { id: 'r028', type: 'reflection', text: "What's a tradition in your family?" },
  { id: 'r029', type: 'reflection', text: 'What does fairness mean to you?' },
  { id: 'r030', type: 'reflection', text: "What's something you've never told anyone?" },
  { id: 'r031', type: 'reflection', text: "What's something you would never lie about?" },
  { id: 'r032', type: 'reflection', text: "What's something you wish you could tell your future self?" },
  { id: 'r033', type: 'reflection', text: 'If you could change one rule at school, which one and why?' },
  { id: 'r034', type: 'reflection', text: "What's the best gift you've ever given?" },
  { id: 'r035', type: 'reflection', text: "What's the best gift you've ever received?" },
  { id: 'r036', type: 'reflection', text: 'What is something small that has made a big difference to you?' },
  { id: 'r037', type: 'reflection', text: 'What does it mean to be a good listener?' },
  { id: 'r038', type: 'reflection', text: "What's a habit you'd like to start?" },
  { id: 'r039', type: 'reflection', text: "What's a habit you'd like to break?" },
  { id: 'r040', type: 'reflection', text: 'What makes you feel grown-up?' },
  { id: 'r041', type: 'reflection', text: "What's a question you've always wanted to ask someone?" },
  { id: 'r042', type: 'reflection', text: 'What does success mean to you?' },
  { id: 'r043', type: 'reflection', text: "What's a place where you feel like yourself?" },
  { id: 'r044', type: 'reflection', text: "What's something you want to learn before you leave primary school?" },
  { id: 'r045', type: 'reflection', text: "What's something you've discovered about yourself recently?" },
  { id: 'r046', type: 'reflection', text: "What's a feeling that's hard to put into words?" },
  { id: 'r047', type: 'reflection', text: "What's something only you know about yourself?" },
  { id: 'r048', type: 'reflection', text: "What's a song that always cheers you up?" },
  { id: 'r049', type: 'reflection', text: "What's a story you could read again and again?" },
  { id: 'r050', type: 'reflection', text: 'Who would you ask for help if you were really worried?' },
  { id: 'r051', type: 'reflection', text: 'What does it mean to be honest?' },
  { id: 'r052', type: 'reflection', text: "What's something that always makes you smile?" },
  { id: 'r053', type: 'reflection', text: "What's the best advice anyone has ever given you?" },
  { id: 'r054', type: 'reflection', text: "What's something you've changed your mind about this year?" },
  { id: 'r055', type: 'reflection', text: "What's a small thing you do every day that matters to you?" },
  { id: 'r056', type: 'reflection', text: "What's something you're looking forward to?" },
  { id: 'r057', type: 'reflection', text: "What's something hard about growing up?" },
  { id: 'r058', type: 'reflection', text: "What's something wonderful about growing up?" },
  { id: 'r059', type: 'reflection', text: "What's a moment when you knew you were lucky?" },
  { id: 'r060', type: 'reflection', text: "What's a memory you could live inside forever?" },

  // ─────────────────────────────────────────────────────────────
  // DESCRIPTION — d001 to d080
  // ─────────────────────────────────────────────────────────────
  { id: 'd001', type: 'description', text: 'Describe your bedroom in five sentences.' },
  { id: 'd002', type: 'description', text: 'Describe your classroom on a Monday morning.' },
  { id: 'd003', type: 'description', text: 'Describe the view from one of your windows.' },
  { id: 'd004', type: 'description', text: 'Describe your favourite tree.' },
  { id: 'd005', type: 'description', text: "Describe your school's playground." },
  { id: 'd006', type: 'description', text: 'Describe your kitchen.' },
  { id: 'd007', type: 'description', text: 'Describe your favourite meal so I can almost taste it.' },
  { id: 'd008', type: 'description', text: 'Describe your favourite shoes.' },
  { id: 'd009', type: 'description', text: "Describe a food you really don't like." },
  { id: 'd010', type: 'description', text: 'Describe an old toy you still have.' },
  { id: 'd011', type: 'description', text: 'Describe a piece of jewellery or watch in your house.' },
  { id: 'd012', type: 'description', text: 'Describe your favourite season.' },
  { id: 'd013', type: 'description', text: "Describe an animal you've seen recently." },
  { id: 'd014', type: 'description', text: 'Describe a stranger you saw today.' },
  { id: 'd015', type: 'description', text: 'Describe a rainy day.' },
  { id: 'd016', type: 'description', text: 'Describe a sunny day.' },
  { id: 'd017', type: 'description', text: 'Describe a windy day.' },
  { id: 'd018', type: 'description', text: 'Describe a snowy day (real or imagined).' },
  { id: 'd019', type: 'description', text: 'Describe a foggy morning.' },
  { id: 'd020', type: 'description', text: 'Describe an empty playground.' },
  { id: 'd021', type: 'description', text: 'Describe a busy street.' },
  { id: 'd022', type: 'description', text: 'Describe a corner shop.' },
  { id: 'd023', type: 'description', text: 'Describe your favourite book character.' },
  { id: 'd024', type: 'description', text: "Describe a spider's web up close." },
  { id: 'd025', type: 'description', text: 'Describe the moon as you see it tonight.' },
  { id: 'd026', type: 'description', text: 'Describe the inside of an old chest of drawers.' },
  { id: 'd027', type: 'description', text: 'Describe your favourite hat (real or imagined).' },
  { id: 'd028', type: 'description', text: 'Describe a kind face.' },
  { id: 'd029', type: 'description', text: 'Describe an angry face (without using the word "angry").' },
  { id: 'd030', type: 'description', text: "Describe the tiredest you've ever felt." },
  { id: 'd031', type: 'description', text: 'Describe a market or shop on a busy day.' },
  { id: 'd032', type: 'description', text: 'Describe the feeling of going on holiday.' },
  { id: 'd033', type: 'description', text: "Describe an old building you've seen." },
  { id: 'd034', type: 'description', text: 'Describe a beach (real or imagined).' },
  { id: 'd035', type: 'description', text: 'Describe the corner of a wood or forest.' },
  { id: 'd036', type: 'description', text: 'Describe a sunrise.' },
  { id: 'd037', type: 'description', text: 'Describe a sunset.' },
  { id: 'd038', type: 'description', text: 'Describe a thunderstorm.' },
  { id: 'd039', type: 'description', text: 'Describe a shed or garage.' },
  { id: 'd040', type: 'description', text: 'Describe a swing set.' },
  { id: 'd041', type: 'description', text: "Describe an elderly person's hands." },
  { id: 'd042', type: 'description', text: "Describe a baby's hands." },
  { id: 'd043', type: 'description', text: 'Describe a worn-out pair of shoes.' },
  { id: 'd044', type: 'description', text: 'Describe a brand-new pair of shoes.' },
  { id: 'd045', type: 'description', text: "Describe a butterfly's wings." },
  { id: 'd046', type: 'description', text: 'Describe a row of houses on your street.' },
  { id: 'd047', type: 'description', text: 'Describe a corner of the school field.' },
  { id: 'd048', type: 'description', text: 'Describe a moment of perfect quiet.' },
  { id: 'd049', type: 'description', text: 'Describe a place where many people are talking at once.' },
  { id: 'd050', type: 'description', text: 'Describe the inside of a music shop.' },
  { id: 'd051', type: 'description', text: 'Describe an empty chair in a busy room.' },
  { id: 'd052', type: 'description', text: "Describe the noisiest place you've been." },
  { id: 'd053', type: 'description', text: 'Describe a piece of art you have seen.' },
  { id: 'd054', type: 'description', text: 'Describe a kitchen full of cooking.' },
  { id: 'd055', type: 'description', text: 'Describe a freezer when you open it.' },
  { id: 'd056', type: 'description', text: 'Describe a garden in summer.' },
  { id: 'd057', type: 'description', text: 'Describe a garden in winter.' },
  { id: 'd058', type: 'description', text: 'Describe a churchyard.' },
  { id: 'd059', type: 'description', text: 'Describe a railway station.' },
  { id: 'd060', type: 'description', text: 'Describe an aeroplane taking off.' },
  { id: 'd061', type: 'description', text: 'Describe a bird looking for food.' },
  { id: 'd062', type: 'description', text: 'Describe a cat preparing to pounce.' },
  { id: 'd063', type: 'description', text: 'Describe a dog meeting a friend.' },
  { id: 'd064', type: 'description', text: 'Describe a horse.' },
  { id: 'd065', type: 'description', text: 'Describe a rabbit.' },
  { id: 'd066', type: 'description', text: 'Describe an old photograph.' },
  { id: 'd067', type: 'description', text: 'Describe an old toy.' },
  { id: 'd068', type: 'description', text: 'Describe an empty road.' },
  { id: 'd069', type: 'description', text: 'Describe a busy road.' },
  { id: 'd070', type: 'description', text: 'Describe a tunnel.' },
  { id: 'd071', type: 'description', text: 'Describe a bridge.' },
  { id: 'd072', type: 'description', text: 'Describe a pond.' },
  { id: 'd073', type: 'description', text: 'Describe a fountain.' },
  { id: 'd074', type: 'description', text: 'Describe an open umbrella.' },
  { id: 'd075', type: 'description', text: 'Describe a pair of glasses.' },
  { id: 'd076', type: 'description', text: 'Describe a pile of leaves.' },
  { id: 'd077', type: 'description', text: 'Describe a feather.' },
  { id: 'd078', type: 'description', text: 'Describe an icicle.' },
  { id: 'd079', type: 'description', text: 'Describe a candle burning.' },
  { id: 'd080', type: 'description', text: 'Describe a campfire.' },

  // ─────────────────────────────────────────────────────────────
  // ARGUMENT — a001 to a060
  // ─────────────────────────────────────────────────────────────
  { id: 'a001', type: 'argument', text: 'Should children have homework? Give your opinion with reasons.' },
  { id: 'a002', type: 'argument', text: 'Are dogs better than cats? (Pick a side and persuade me.)' },
  { id: 'a003', type: 'argument', text: 'Should everyone have to learn to play a musical instrument?' },
  { id: 'a004', type: 'argument', text: 'Is it better to read a book or watch the film?' },
  { id: 'a005', type: 'argument', text: 'Should children be allowed to vote in school elections?' },
  { id: 'a006', type: 'argument', text: 'Should school start later in the morning?' },
  { id: 'a007', type: 'argument', text: 'Should everyone be a vegetarian?' },
  { id: 'a008', type: 'argument', text: 'Is it better to be the oldest, youngest, or middle child?' },
  { id: 'a009', type: 'argument', text: 'Should mobile phones be allowed in primary school?' },
  { id: 'a010', type: 'argument', text: 'Should every child learn to swim?' },
  { id: 'a011', type: 'argument', text: 'Are board games better than video games?' },
  { id: 'a012', type: 'argument', text: 'Should pupils be allowed to choose what they wear at school?' },
  { id: 'a013', type: 'argument', text: 'Should we have shorter lessons but more of them?' },
  { id: 'a014', type: 'argument', text: 'Is autumn the best season? Argue for any season you choose.' },
  { id: 'a015', type: 'argument', text: 'Should everyone learn a second language?' },
  { id: 'a016', type: 'argument', text: 'Is breakfast the most important meal? Argue for or against.' },
  { id: 'a017', type: 'argument', text: 'Should children get pocket money? How much?' },
  { id: 'a018', type: 'argument', text: 'Is it better to live in a city or in the countryside?' },
  { id: 'a019', type: 'argument', text: 'Should TV adverts for sweets be banned?' },
  { id: 'a020', type: 'argument', text: 'Should every school have a school garden?' },
  { id: 'a021', type: 'argument', text: 'Should we plant more trees? How and where?' },
  { id: 'a022', type: 'argument', text: 'Should everyone learn to cook by age 11?' },
  { id: 'a023', type: 'argument', text: 'Is it ever okay to lie?' },
  { id: 'a024', type: 'argument', text: 'Should there be a "no homework" weekend every month?' },
  { id: 'a025', type: 'argument', text: 'Should children be paid for chores at home?' },
  { id: 'a026', type: 'argument', text: 'Is it better to keep a pet or to rescue a wild animal?' },
  { id: 'a027', type: 'argument', text: 'Should every primary school have a library?' },
  { id: 'a028', type: 'argument', text: 'Should we have school on Saturdays if it meant longer holidays?' },
  { id: 'a029', type: 'argument', text: 'Should art be as important as maths?' },
  { id: 'a030', type: 'argument', text: 'Should there be a daily quiet hour at school?' },
  { id: 'a031', type: 'argument', text: 'Are reading lessons more important than writing lessons?' },
  { id: 'a032', type: 'argument', text: 'Should every child have to learn first aid?' },
  { id: 'a033', type: 'argument', text: 'Should plastic toys be banned?' },
  { id: 'a034', type: 'argument', text: 'Should every school visit a farm at least once?' },
  { id: 'a035', type: 'argument', text: 'Are summer holidays too long?' },
  { id: 'a036', type: 'argument', text: 'Should we send letters more often (instead of messages)?' },
  { id: 'a037', type: 'argument', text: "Should shops stop selling sweets at children's eye level?" },
  { id: 'a038', type: 'argument', text: 'Should sport be compulsory in school?' },
  { id: 'a039', type: 'argument', text: 'Is the school week long enough?' },
  { id: 'a040', type: 'argument', text: 'Are uniform rules a good idea?' },
  { id: 'a041', type: 'argument', text: 'Should we celebrate more festivals at school?' },
  { id: 'a042', type: 'argument', text: 'Should children have a say in the school menu?' },
  { id: 'a043', type: 'argument', text: 'Is it better to learn from a book or from a video?' },
  { id: 'a044', type: 'argument', text: 'Should schools have a "no plastic" rule?' },
  { id: 'a045', type: 'argument', text: 'Should we all have to recycle? How would you make sure it happened?' },
  { id: 'a046', type: 'argument', text: 'Should every classroom have a class pet?' },
  { id: 'a047', type: 'argument', text: 'Should we ban fireworks because of pets?' },
  { id: 'a048', type: 'argument', text: 'Should every child have to learn about a famous historical figure?' },
  { id: 'a049', type: 'argument', text: 'Should every school have a "buddy" system between older and younger pupils?' },
  { id: 'a050', type: 'argument', text: 'Should drama lessons be every week?' },
  { id: 'a051', type: 'argument', text: 'Is it better to walk to school or come by car? Argue with reasons.' },
  { id: 'a052', type: 'argument', text: 'Should the school day include a longer lunch break?' },
  { id: 'a053', type: 'argument', text: 'Should there be more or fewer tests in primary school?' },
  { id: 'a054', type: 'argument', text: 'Should every child learn how to use money?' },
  { id: 'a055', type: 'argument', text: "Should we have school meetings with pupils' opinions on big choices?" },
  { id: 'a056', type: 'argument', text: 'Is the local park important for your community? Argue with reasons.' },
  { id: 'a057', type: 'argument', text: 'Should we have a national tree-planting day?' },
  { id: 'a058', type: 'argument', text: 'Should every child have a journal? What would they write in it?' },
  { id: 'a059', type: 'argument', text: 'Should children be allowed to choose one school topic each term?' },
  { id: 'a060', type: 'argument', text: 'Is it more important to be clever or to be kind? Defend your view.' },
];

// ─────────────────────────────────────────────────────────────
// Rotation algorithm
// ─────────────────────────────────────────────────────────────

/**
 * Which prompt type to serve on each day of the week.
 * 0 = Sunday, 1 = Monday … 6 = Saturday.
 */
export const TYPE_BY_DAY: Record<number, DWPPromptType> = {
  0: 'reflection',   // Sunday  — introspective
  1: 'narrative',    // Monday  — get the week moving
  2: 'sensory',      // Tuesday
  3: 'description',  // Wednesday
  4: 'narrative',    // Thursday — narrative twice for volume
  5: 'argument',     // Friday   — end the week with opinion
  6: 'sensory',      // Saturday
};

/**
 * Tiny deterministic hash — maps a string to a non-negative integer.
 * Used so same user + same date always returns the same prompt.
 */
function stableHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return Math.abs(h);
}

/**
 * Get the prompt for a specific user on a specific date.
 *
 * Call this server-side in /app/api/ai/dwp/route.ts.
 *
 * @param userId          The user's Supabase UUID
 * @param date            Today's date
 * @param usedPromptIds   IDs of prompts the user has seen in the last 90 days
 *                        (fetched from ai_attempts table before calling this function)
 */
export function getPromptForUserAndDate(
  userId: string,
  date: Date,
  usedPromptIds: string[]
): DWPPrompt {
  const dayOfWeek = date.getDay();
  const targetType = TYPE_BY_DAY[dayOfWeek];

  // Filter: correct type, not used in last 90 days
  const usedSet = new Set(usedPromptIds);
  let candidates = DWP_PROMPTS.filter(
    p => p.type === targetType && !usedSet.has(p.id)
  );

  // Fallback: if all prompts of this type are used, allow repeats
  if (candidates.length === 0) {
    candidates = DWP_PROMPTS.filter(p => p.type === targetType);
  }

  // Deterministic pick: same user + same date = same prompt
  const dateKey = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
  const seed = stableHash(userId + dateKey);
  return candidates[seed % candidates.length];
}

/** Get all prompts of a given type. */
export function getPromptsByType(type: DWPPromptType): DWPPrompt[] {
  return DWP_PROMPTS.filter(p => p.type === type);
}

/** Build the user-prompt string to pass to the AI route. */
export function buildDWPUserPrompt(
  prompt: DWPPrompt,
  pupilWriting: string,
  wordCount: number,
  timeSpentSeconds: number
): string {
  return [
    `Today's prompt (${prompt.type}): "${prompt.text}"`,
    ``,
    `Pupil wrote (${wordCount} words, ${timeSpentSeconds} seconds):`,
    `"""`,
    pupilWriting,
    `"""`,
    ``,
    `Respond as the DWP Coach. Return ONLY the JSON.`,
  ].join('\n');
}

// ─────────────────────────────────────────────────────────────
// Sanity check (runs at import time in development)
// ─────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  const counts: Record<DWPPromptType, number> = {
    sensory: 0, narrative: 0, reflection: 0, description: 0, argument: 0,
  };
  const ids = new Set<string>();
  for (const p of DWP_PROMPTS) {
    counts[p.type]++;
    if (ids.has(p.id)) console.warn(`[DWP] Duplicate prompt ID: ${p.id}`);
    ids.add(p.id);
  }
  console.log('[DWP] Prompt counts:', counts);
  console.log('[DWP] Total:', DWP_PROMPTS.length);
}
