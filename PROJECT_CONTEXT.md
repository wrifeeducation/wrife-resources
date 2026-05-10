# WriFe Resource App (resources.wrife.co.uk)
*Last updated: 2026-05-10 · Session 6*

## Current state
All 9 AI tools are fully built and functional. Auth is self-contained (local login page). All tools built with Haiku (`claude-haiku-4-5-20251001`). Awaiting: (1) Michael to run `git push` to deploy to Vercel, (2) Stripe integration, (3) fix `NEXT_PUBLIC_APP_URL` env var in Vercel.

## Next steps
1. **Deploy** — Michael runs `git add -A && git commit -m "feat: build all 9 AI lesson tools" && git push` from `wrifeapp` repo dir
2. **Fix NEXT_PUBLIC_APP_URL in Vercel** — should be `https://resources.wrife.co.uk` (with 's')
3. **Stripe integration** — wire checkout, portal, webhook, subscription gating end-to-end (needs Stripe credentials from Michael)

## Key decisions
- **Stack:** Next.js 14 App Router + Supabase (`gzmgjkbtsvezfclmreru`) + Anthropic + Vercel
- **Auth:** Self-contained login at `/login` — no cross-domain SSO from wrife.co.uk (cookies don't share without matching domain config)
- **AI model:** Haiku (`claude-haiku-4-5-20251001`) for PWP + DWP; use same for lesson tools unless complexity demands Sonnet
- **API key:** Shared Anthropic API key across all WriFe apps — simpler to manage
- **Subscription gate:** All 9 AI tools = Full Teacher; soft paywall modal for Free/Standard
- **Brand colour:** #27AE60 (WriFe green) throughout

## Files & locations
- `app/login/page.tsx` — local login page (WriFe brand styling, server component)
- `app/login/actions.ts` — `signIn()` server action using Supabase signInWithPassword
- `app/(app)/layout.tsx` — auth gate redirecting to `/login?redirectTo=...`
- `app/(app)/daily/pwp/page.tsx` — PWP Practice tool (full UI, AI feedback)
- `app/(app)/daily/dwp/page.tsx` — DWP Daily Writing Practice tool (full UI, AI feedback)
- `app/(app)/lesson/connect-grid/page.tsx` — Connect Grid Tutor (3×3 planning grid, per-cell coaching)
- `app/(app)/lesson/sentence-coach/page.tsx` — Sentence Quality Coach (vocab/grammar/originality scores)
- `app/(app)/lesson/story-types/page.tsx` — Story Type Identifier (12 WriFe story types)
- `app/(app)/lesson/composition/page.tsx` — Composition Reviewer (LSC scaffold: Lead/Support/Close)
- `app/(app)/lesson/editing-doctor/page.tsx` — Editing Doctor (10 modes: L42–L51)
- `app/(app)/lesson/genre-coach/page.tsx` — Genre Coach (narrative/non-fiction/persuasive/poetry)
- `app/(app)/lesson/project-mentor/page.tsx` — Project Mentor (5 stages: idea → publishing)
- `app/api/tools/pwp/route.ts` — PWP API: Haiku, formula assessment, JSON response
- `app/api/tools/dwp/route.ts` — DWP API: Haiku, free-writing feedback, JSON response
- `app/api/tools/connect-grid/route.ts` — Connect Grid API: coachingText, exampleSentence, nudge
- `app/api/tools/sentence-coach/route.ts` — Sentence Coach API: score, vocab, grammar, originality, feedback
- `app/api/tools/story-types/route.ts` — Story Types API: storyType (1 of 12), confidence, explanation, keyFeatures
- `app/api/tools/composition/route.ts` — Composition API: leadScore/supportScore/closeScore, feedback, topSuggestion
- `app/api/tools/editing-doctor/route.ts` — Editing Doctor API: score, diagnosis, issues (original→issue→fix), praise
- `app/api/tools/genre-coach/route.ts` — Genre Coach API: score, assessment, features (found/missing), topTip, praise
- `app/api/tools/project-mentor/route.ts` — Project Mentor API: encouragement, stageAdvice, nextSteps, keyQuestion
- `lib/supabase/server.ts` — server client with `.wrife.co.uk` cookie domain
- `lib/data/pwp-formulas.ts` — 67 PWP formulas with variations
- `lib/data/dwp-prompts.ts` — 365 DWP prompts, day-of-week rotation

## Open questions
- Stripe monthly pricing: est. £4.90 / £9.90 (needed before Stripe integration)
- School License pricing: flat fee or per-teacher seat?

---

## Session log

| # | Date | Summary |
|---|------|---------|
| 6 | 2026-05-10 | Built all 7 remaining lesson tools (Connect Grid, Sentence Coach, Story Types, Composition, Editing Doctor, Genre Coach, Project Mentor) — all 9 tools now complete, awaiting git push |
| 5 | 2026-05-10 | Built local login page, fixed cross-domain auth, set ANTHROPIC_API_KEY, tested PWP + DWP end-to-end — both tools live and working |
| 4 | 2026-05-10 | Built PWP Practice + DWP tools, URL sweep (app.wrife.co.uk → wrife.co.uk), deployed to resources.wrife.co.uk |
| 3 | 2026-05-10 | Next.js 14 scaffold, auth gate, subscription context, all 9 tool routes, 3 SQL migrations |
| 2 | 2026-05-10 | Curriculum-accurate TypeScript conversion of PWP formulas and DWP prompts |
| 1 | 2026-05-09 | Initial review — spec fully read, project understood, plan of work delivered |
