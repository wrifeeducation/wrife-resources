# WriFe Resource App (resource.wrife.co.uk)
*Last updated: 2026-05-10 · Session 4*

## Current state
**Session 1 scaffold is complete and building.** The Next.js 14 App Router project exists in the workspace root with zero TypeScript errors and a clean production build. Auth gate, subscription context, tool catalogue homepage, PaywallModal, and all 9 tool routes (placeholder pages) are wired. The 3 SQL migration files are ready to run in Supabase. `lib/data/pwp-formulas.ts` and `lib/data/dwp-prompts.ts` are in place. No AI tool logic exists yet — just the shell that receives it.

## Next steps
1. **Run the 3 SQL migrations** in Supabase Studio (project `gzmgjkbtsvezfclmreru`) — paste 001, 002, 003 in order
2. **Create `.env.local`** — copy from `.env.local.example`, fill in real Supabase keys + Anthropic key
3. **Push to GitHub** — create `wrife/wrife-resource` repo and push this folder
4. **Session 2 (Stripe)** — wire checkout, portal, webhook, subscription gating end-to-end
5. **Session 3 (PWP App)** — build the first AI tool using `lib/data/pwp-formulas.ts`

## Key decisions
- **Stack:** Next.js 14 App Router + Supabase (`gzmgjkbtsvezfclmreru`) + Stripe + Anthropic + Vercel
- **Subscription gate:** All 9 AI tools = Full Teacher (£99/yr); soft paywall modal for Free/Standard
- **Auth sharing:** Cookies scoped to `.wrife.co.uk` — SSO with app.wrife.co.uk automatic
- **AI model mix:** Haiku for PWP + DWP; Sonnet for the 7 lesson tools
- **Pricing:** Free / Standard £49/yr / Full £99/yr / School = Custom
- **Brand colour:** #27AE60 (WriFe green) throughout — confirmed from spec and L29 demo

## Files & locations
- `app/(app)/page.tsx` — tool catalogue homepage (both surfaces, all 9 cards)
- `app/(app)/layout.tsx` — auth gate + subscription context provider (server component)
- `components/PaywallModal.tsx` — soft paywall (shown on click for Free/Standard users)
- `components/ToolCard.tsx` — card with unlock check, paywall trigger, or Link
- `components/Header.tsx` — sticky nav with tier badge and upgrade CTA
- `lib/subscription/gate.ts` — `canUseTool()`, tier ranks, `TOOL_REQUIREMENTS`
- `lib/subscription/context.tsx` — `SubscriptionProvider` + `useSubscription()` hook
- `lib/supabase/server.ts` — server client with `.wrife.co.uk` cookie domain
- `lib/supabase/admin.ts` — service-role client (API routes only)
- `lib/supabase/types.ts` — hand-written DB types (regenerate with supabase CLI after migration)
- `lib/ai/client.ts` — Anthropic client + MODELS constants (Haiku / Sonnet)
- `lib/data/pwp-formulas.ts` — 67 curriculum-accurate PWP formulas with helper functions
- `lib/data/dwp-prompts.ts` — 365 DWP prompts, rotation algorithm, helper functions
- `supabase/migrations/001_init.sql` — tables: profiles, schools, subscriptions, ai_sessions, ai_attempts, daily_streaks, usage_quotas, classes, class_enrolments
- `supabase/migrations/002_rls.sql` — RLS policies for all tables
- `supabase/migrations/003_functions.sql` — `get_user_tier()` + `increment_usage()` RPCs
- `.env.local.example` — all required env vars with comments
- `next.config.mjs` — active Next.js config (next.config.ts is intentionally empty placeholder)

## Session 1 verification checklist
- [x] Zero TypeScript errors (`npx tsc --noEmit` → clean)
- [x] Production build completes — all 13 routes compiled
- [x] All 9 tool routes exist in app-paths-manifest
- [x] Auth gate in `(app)/layout.tsx` redirects unauthenticated users to app.wrife.co.uk/login
- [x] PaywallModal fires for Free/Standard users on tool card click
- [ ] Migrations run in Supabase Studio (manual — paste 001, 002, 003 in order)
- [ ] `get_user_tier(auth.uid())` returns 'free' for a new test user

## Open questions
- School License pricing: flat fee or per-teacher seat?
- Free trial duration: 14 or 30 days?
- Monthly pricing: est. £4.90 / £9.90 (needed before Session 2 Stripe products)
- Brand assets: mascot images available in Graphics/mascot_pack/ — ready to use

---

## Session log

| # | Date | Summary |
|---|------|---------|
| 4 | 2026-05-10 | Session 1 complete: Next.js 14 scaffold, auth gate, subscription context, all 9 tool routes, PaywallModal, 3 SQL migrations, zero TS errors, clean production build |
| 3 | 2026-05-10 | Curriculum-accurate TypeScript conversion of both PWP formulas and DWP prompts |
| 2 | 2026-05-09 | Confirmed 7 of 10 TBD decisions; generated initial PWP and DWP data files |
| 1 | 2026-05-09 | Initial review — spec fully read, project understood, plan of work delivered |
