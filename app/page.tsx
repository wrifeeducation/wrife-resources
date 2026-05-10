'use client';

import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const WrifeLogoSVG = () => (
  <div
    style={{
      background: 'rgba(255,255,255,0.2)',
      borderRadius: 4,
      width: 30,
      height: 26,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <svg viewBox="0 0 16 14" fill="none" width="16" height="14">
      <rect x="0.5" y="0.5" width="7" height="13" rx="1"
        fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
      <rect x="8.5" y="0.5" width="7" height="13" rx="1"
        fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
      <line x1="8" y1="1" x2="8" y2="13"
        stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
    </svg>
  </div>
);

const TRUST_STATS = [
  { num: '9', label: 'AI tools' },
  { num: '67', label: 'Lessons covered' },
  { num: '365', label: 'Daily prompts' },
  { num: 'Yrs 2–9', label: 'Age range' },
];

const HOW_IT_WORKS = [
  {
    num: '1',
    title: 'Open the right tool',
    desc: "Each tool maps to specific lesson numbers — find today's lesson, open the tool.",
    featured: true,
  },
  {
    num: '2',
    title: 'Pupil writes and submits',
    desc: 'No setup needed for pupils. Just write and tap submit.',
    featured: false,
  },
  {
    num: '3',
    title: 'AI gives instant feedback',
    desc: 'Warm, specific, WriFe-aligned. Scored against the exact lesson criteria.',
    featured: false,
  },
  {
    num: '4',
    title: 'Teacher sees it all',
    desc: "Your dashboard shows every pupil's responses at a glance.",
    featured: false,
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  // Redirect logged-in users straight to the tool catalogue
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/dashboard');
      else setChecking(false);
    });
  }, [router]);

  if (checking) return null;

  return (
    <div className="min-h-screen" style={{ background: '#FBF8F1', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <nav style={{
        background: '#27AE60', height: 52, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <WrifeLogoSVG />
          <span style={{ color: 'white', fontSize: 19, fontWeight: 800, letterSpacing: '-0.3px' }}>WriFe</span>
          <span style={{
            background: 'rgba(255,255,255,0.2)', color: 'white',
            fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 10, letterSpacing: '0.06em',
            textTransform: 'uppercase' as const,
          }}>Resources</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="https://wrife.co.uk/login" style={{
            background: 'transparent', border: '1.5px solid rgba(255,255,255,0.6)', color: 'white',
            padding: '6px 14px', borderRadius: 7, fontSize: 13, fontWeight: 600, textDecoration: 'none',
          }}>Log in</Link>
          <Link href="https://wrife.co.uk/signup" style={{
            background: 'white', border: 'none', color: '#27AE60',
            padding: '6px 14px', borderRadius: 7, fontSize: 13, fontWeight: 700, textDecoration: 'none',
          }}>Get access</Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '32px 24px 20px', maxWidth: 700, margin: '0 auto', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <span style={{
            display: 'inline-block', background: '#E8F5E9', color: '#27AE60',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const,
            padding: '4px 12px', borderRadius: 20, marginBottom: 12,
          }}>9 AI tools · WriFe curriculum · Years 2–9</span>

          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#2C3E50', lineHeight: 1.15, margin: '0 0 12px' }}>
            The AI writing tutor<br />your pupils <span style={{ color: '#27AE60' }}>deserve</span>
          </h1>
          <p style={{ fontSize: 14, color: '#7F8C8D', lineHeight: 1.65, margin: '0 0 20px', maxWidth: 360 }}>
            Nine tools that give every pupil the kind of feedback that would otherwise
            take a teacher one-to-one time with thirty children.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/resources" style={{
              background: '#E8922B', color: 'white', padding: '10px 20px',
              borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none',
            }}>See free resources →</Link>
            <Link href="https://wrife.co.uk/signup" style={{
              background: 'white', color: '#2C3E50', padding: '10px 18px',
              borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none',
              border: '1px solid #E0D8CC',
            }}>Get AI access</Link>
          </div>
        </div>

        {/* Mascot */}
        <div style={{ position: 'relative', flexShrink: 0, marginTop: 4 }}>
          <div style={{
            width: 120, height: 120, background: '#E8F5E9', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
          }}>
            <Image src="/mascots/pencil-waving.png" alt="" role="presentation"
              width={110} height={110} style={{ objectFit: 'contain' }} priority />
          </div>
          <div style={{
            position: 'absolute', bottom: 4, right: 4,
            background: '#F5C500', borderRadius: '50%', width: 30, height: 30,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, border: '2px solid #FBF8F1',
          }}>⭐</div>
        </div>
      </section>

      {/* ── CTA Cards ────────────────────────────────────────────────── */}
      <section style={{ padding: '0 24px 20px', maxWidth: 700, margin: '0 auto' }}>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#7F8C8D', marginBottom: 8 }}>
          Where would you like to start?
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {/* Pupil card */}
          <Link href="https://wrife.co.uk/login" style={{
            background: '#E8922B', borderRadius: 12, padding: '14px 16px',
            textDecoration: 'none', height: 110, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🎒</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.85)' }}>For pupils</span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 800, color: 'white', lineHeight: 1.25, margin: 0 }}>
              I&apos;m a pupil —<br />start my adventure
            </p>
            <span style={{
              alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center',
              fontSize: 11, fontWeight: 700, padding: '5px 10px', borderRadius: 6,
              background: 'white', color: '#E8922B',
            }}>Play now →</span>
          </Link>

          {/* Teacher card */}
          <Link href="https://wrife.co.uk/signup?role=teacher" style={{
            background: '#27AE60', borderRadius: 12, padding: '14px 16px',
            textDecoration: 'none', height: 110, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>📋</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.85)' }}>For teachers</span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 800, color: 'white', lineHeight: 1.25, margin: 0 }}>
              I&apos;m a teacher —<br />set up my class
            </p>
            <span style={{
              alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center',
              fontSize: 11, fontWeight: 700, padding: '5px 10px', borderRadius: 6,
              background: 'white', color: '#27AE60',
            }}>Get started →</span>
          </Link>
        </div>
      </section>

      {/* ── Trust Strip ──────────────────────────────────────────────── */}
      <div style={{ background: '#27AE60', padding: '12px 24px', display: 'flex', justifyContent: 'space-around' }}>
        {TRUST_STATS.map((s) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>{s.num}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Tools Overview ────────────────────────────────────────────── */}
      <section style={{ padding: '28px 24px 8px', maxWidth: 700, margin: '0 auto' }}>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#7F8C8D', marginBottom: 14 }}>
          Daily practice — use every day
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {[
            { icon: '✍️', name: 'PWP Practice', badge: 'Daily', desc: "Today's formula. AI checks the sentence is right and explains why.", bg: '#E8F5E9' },
            { icon: '📖', name: 'Daily Writing Practice', badge: 'Daily', desc: 'A fresh prompt every day. Warm, specific AI feedback — no score in sight.', bg: '#E8F5E9' },
          ].map((t) => (
            <div key={t.name} style={{ background: 'white', borderRadius: 10, padding: '14px 16px', border: '1px solid #F0EAD6' }}>
              <div style={{ width: 32, height: 32, background: t.bg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginBottom: 10 }}>{t.icon}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#2C3E50' }}>{t.name}</span>
                <span style={{ background: '#E8F5E9', color: '#27AE60', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>{t.badge}</span>
              </div>
              <p style={{ fontSize: 11, color: '#7F8C8D', lineHeight: 1.5, margin: 0 }}>{t.desc}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#7F8C8D', marginBottom: 14 }}>
          Lesson resources — curriculum-aligned tools
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 28 }}>
          {[
            { icon: '🔲', name: 'Connect Grid Tutor', lessons: 'L27–38', bg: '#EEF2FF', col: '#4F46E5' },
            { icon: '⭐', name: 'Sentence Coach', lessons: 'L11–25', bg: '#FFF8E7', col: '#B45309' },
            { icon: '🔍', name: 'Story Type Identifier', lessons: 'L31', bg: '#F0FFF4', col: '#047857' },
            { icon: '📝', name: 'Composition Reviewer', lessons: 'L39–41', bg: '#FDF2F8', col: '#9D174D' },
            { icon: '🩺', name: 'Editing Doctor', lessons: 'L42–51', bg: '#FFF1F2', col: '#9F1239' },
            { icon: '🎭', name: 'Genre Coach', lessons: 'L52–62', bg: '#FFFBEB', col: '#92400E' },
          ].map((t) => (
            <div key={t.name} style={{ background: 'white', borderRadius: 10, padding: '12px 14px', border: '1px solid #F0EAD6' }}>
              <div style={{ width: 30, height: 30, background: t.bg, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, marginBottom: 8 }}>{t.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#2C3E50', marginBottom: 3, lineHeight: 1.3 }}>{t.name}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: t.col }}>{t.lessons}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Free Resources Banner ─────────────────────────────────────── */}
      <section style={{ margin: '0 24px 28px', maxWidth: 652, marginLeft: 'auto', marginRight: 'auto' }}>
        <div style={{
          background: 'white', borderRadius: 12, padding: '20px 24px',
          border: '1px solid #F0EAD6', display: 'flex', alignItems: 'center', gap: 18,
        }}>
          <div style={{
            width: 56, height: 56, background: '#E8F5E9', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden',
          }}>
            <Image src="/mascots/pencil-reading.png" alt="" role="presentation" width={50} height={50} style={{ objectFit: 'contain' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#2C3E50', marginBottom: 3 }}>Free lesson resources for every teacher</div>
            <div style={{ fontSize: 12, color: '#7F8C8D', lineHeight: 1.5 }}>Printable PDFs, anchor charts, templates, and flashcards — all aligned to WriFe lessons. No login required.</div>
          </div>
          <Link href="/resources" style={{
            background: '#27AE60', color: 'white', padding: '10px 18px',
            borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none', flexShrink: 0,
          }}>Browse resources →</Link>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────── */}
      <section style={{ padding: '0 24px 28px', maxWidth: 700, margin: '0 auto' }}>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#7F8C8D', marginBottom: 14 }}>
          How it works
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {HOW_IT_WORKS.map((step) => (
            <div key={step.num} style={{
              background: step.featured ? '#F0FFF4' : 'white',
              border: step.featured ? '1.5px solid #27AE60' : '1px solid #F0EAD6',
              borderRadius: 10, padding: '14px 16px',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: step.featured ? '#27AE60' : '#E8F5E9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800, color: step.featured ? 'white' : '#27AE60',
                marginBottom: 10,
              }}>{step.num}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#2C3E50', marginBottom: 4 }}>{step.title}</div>
              <div style={{ fontSize: 11, color: '#7F8C8D', lineHeight: 1.5 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Teacher Footer CTA ────────────────────────────────────────── */}
      <div style={{ background: '#2C3E50', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 3 }}>Set up your class in 60 seconds</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Everything your pupils need, lesson by lesson</div>
        </div>
        <Link href="https://wrife.co.uk/signup?role=teacher" style={{
          background: '#E8922B', color: 'white', padding: '10px 18px',
          borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none',
        }}>Create my class →</Link>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer style={{ background: '#FBF8F1', borderTop: '1px solid #E0D8CC', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#2C3E50' }}>WriFe</span>
        <span style={{ fontSize: 12, color: '#7F8C8D' }}>resource.wrife.co.uk</span>
      </footer>
    </div>
  );
}
