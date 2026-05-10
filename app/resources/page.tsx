import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import {
  RESOURCES_BY_CATEGORY,
  CATEGORY_LABELS,
  type LessonResource,
} from '@/lib/data/lesson-resources';

export const metadata: Metadata = {
  title: 'Free Lesson Resources',
  description:
    'Printable PDFs, anchor charts, templates, and flashcards for every WriFe lesson. Free to download — no login required.',
};

const CATEGORY_COLOURS: Record<string, { bg: string; text: string; border: string }> = {
  'starter-pack': { bg: '#E8F5E9', text: '#1E8449', border: '#A9DFBF' },
  planning:       { bg: '#EEF2FF', text: '#3730A3', border: '#C7D2FE' },
  grammar:        { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  sentence:       { bg: '#F0FDFA', text: '#0F766E', border: '#99F6E4' },
  punctuation:    { bg: '#EEF2FF', text: '#4338CA', border: '#C7D2FE' },
  'connect-grid': { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  story:          { bg: '#FDF4FF', text: '#7E22CE', border: '#E9D5FF' },
  editing:        { bg: '#FFF1F2', text: '#BE123C', border: '#FECDD3' },
  genre:          { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
  poetry:         { bg: '#F5F3FF', text: '#5B21B6', border: '#DDD6FE' },
};

function ResourceCard({ resource }: { resource: LessonResource }) {
  const colours = CATEGORY_COLOURS[resource.category];
  return (
    <div style={{
      background: 'white', borderRadius: 10, padding: '16px 18px',
      border: '1px solid #F0EAD6', display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ flex: 1 }}>
          {resource.lesson && (
            <span style={{
              display: 'inline-block', fontSize: 10, fontWeight: 700,
              background: colours.bg, color: colours.text, border: `1px solid ${colours.border}`,
              padding: '2px 8px', borderRadius: 10, marginBottom: 6,
            }}>Lesson {resource.lesson}</span>
          )}
          <div style={{ fontSize: 14, fontWeight: 700, color: '#2C3E50', lineHeight: 1.3 }}>{resource.title}</div>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, color: '#7F8C8D',
          background: '#F5F5F0', padding: '3px 7px', borderRadius: 6,
          textTransform: 'uppercase' as const, letterSpacing: '0.05em', flexShrink: 0,
        }}>{resource.type}</span>
      </div>
      <p style={{ fontSize: 12, color: '#7F8C8D', lineHeight: 1.5, margin: 0 }}>{resource.description}</p>
      <a
        href={`/lesson-resources/${resource.filename}`}
        download
        style={{
          alignSelf: 'flex-start', background: '#27AE60', color: 'white',
          padding: '7px 14px', borderRadius: 7, fontSize: 12, fontWeight: 700,
          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
          marginTop: 2,
        }}
      >
        ↓ Download
      </a>
    </div>
  );
}

export default function ResourcesPage() {
  const categories = Array.from(RESOURCES_BY_CATEGORY.entries()).filter(([, items]) => items.length > 0);

  return (
    <div style={{ background: '#FBF8F1', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <nav style={{
        background: '#27AE60', height: 52, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 4, width: 30, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 16 14" fill="none" width="16" height="14">
              <rect x="0.5" y="0.5" width="7" height="13" rx="1" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
              <rect x="8.5" y="0.5" width="7" height="13" rx="1" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
              <line x1="8" y1="1" x2="8" y2="13" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
            </svg>
          </div>
          <span style={{ color: 'white', fontSize: 19, fontWeight: 800, letterSpacing: '-0.3px' }}>WriFe</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 10, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>Resources</span>
        </Link>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="https://wrife.co.uk/login" style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,0.6)', color: 'white', padding: '6px 14px', borderRadius: 7, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Log in</Link>
          <Link href="https://wrife.co.uk/signup" style={{ background: 'white', border: 'none', color: '#27AE60', padding: '6px 14px', borderRadius: 7, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Get access</Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '32px 24px 24px', maxWidth: 760, margin: '0 auto', display: 'flex', gap: 24, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <span style={{ display: 'inline-block', background: '#E8F5E9', color: '#27AE60', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const, padding: '4px 12px', borderRadius: 20, marginBottom: 12 }}>
            Free · No login required
          </span>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#2C3E50', lineHeight: 1.2, margin: '0 0 10px' }}>
            Lesson resources for every WriFe teacher
          </h1>
          <p style={{ fontSize: 14, color: '#7F8C8D', lineHeight: 1.65, margin: 0, maxWidth: 420 }}>
            Printable PDFs, anchor charts, flashcards, and templates — one for each lesson
            in the WriFe curriculum. Download as many as you need.
          </p>
        </div>
        <div style={{ width: 90, height: 90, background: '#E8F5E9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
          <Image src="/mascots/pencil-reading.png" alt="" role="presentation" width={80} height={80} style={{ objectFit: 'contain' }} />
        </div>
      </section>

      {/* ── Category nav ──────────────────────────────────────────────── */}
      <div style={{ padding: '0 24px 24px', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
          {categories.map(([cat]) => {
            const c = CATEGORY_COLOURS[cat];
            return (
              <a key={cat} href={`#${cat}`} style={{
                background: c.bg, color: c.text, border: `1px solid ${c.border}`,
                padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                textDecoration: 'none',
              }}>{CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}</a>
            );
          })}
        </div>
      </div>

      {/* ── Resource sections ─────────────────────────────────────────── */}
      <main style={{ padding: '0 24px 48px', maxWidth: 760, margin: '0 auto' }}>
        {categories.map(([cat, items]) => {
          const c = CATEGORY_COLOURS[cat];
          return (
            <section key={cat} id={cat} style={{ marginBottom: 36, scrollMarginTop: 64 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{
                  background: c.bg, color: c.text, border: `1px solid ${c.border}`,
                  padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                }}>{CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}</span>
                <span style={{ fontSize: 12, color: '#7F8C8D' }}>{items.length} resource{items.length !== 1 ? 's' : ''}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
                {items.map((r) => <ResourceCard key={r.filename} resource={r} />)}
              </div>
            </section>
          );
        })}
      </main>

      {/* ── AI Tools CTA ──────────────────────────────────────────────── */}
      <div style={{ background: '#2C3E50', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 4 }}>Ready for real-time AI feedback?</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Get access to all 9 AI writing tools for your class</div>
        </div>
        <Link href="https://wrife.co.uk/signup?role=teacher" style={{ background: '#E8922B', color: 'white', padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
          Get AI access →
        </Link>
      </div>

      <footer style={{ background: '#FBF8F1', borderTop: '1px solid #E0D8CC', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#2C3E50' }}>WriFe</span>
        <span style={{ fontSize: 12, color: '#7F8C8D' }}>resource.wrife.co.uk</span>
      </footer>
    </div>
  );
}
