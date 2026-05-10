'use client';

import { useState } from 'react';
import type { CompositionResponse } from '@/app/api/tools/composition/route';

const LESSONS = [39, 40, 41];
const GENRES = ['Narrative', 'Non-fiction', 'Persuasive', 'Poetry'];

const LSC_CONFIG = [
  { key: 'leadScore' as const, feedback: 'leadFeedback' as const, label: 'Lead', icon: '🎯', desc: 'Opening sentence — hooks the reader', colour: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE' },
  { key: 'supportScore' as const, feedback: 'supportFeedback' as const, label: 'Support', icon: '🔗', desc: 'Middle sentences — add detail and development', colour: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE' },
  { key: 'closeScore' as const, feedback: 'closeFeedback' as const, label: 'Close', icon: '✅', desc: 'Final sentence — rounds off the paragraph', colour: '#10B981', bg: '#F0FFF4', border: '#A7F3D0' },
];

function ScoreCircle({ score, colour }: { score: number; colour: string }) {
  return (
    <div style={{
      width: 40, height: 40, borderRadius: '50%', background: colour,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <span style={{ color: 'white', fontWeight: 800, fontSize: 16 }}>{score}</span>
    </div>
  );
}

const S = {
  page: { maxWidth: 720, margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', color: '#2C3E50' } as React.CSSProperties,
  badge: { display: 'inline-flex', gap: 6, background: '#F0FDFA', color: '#0F766E', border: '1px solid #99F6E4', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', padding: '3px 10px', borderRadius: 20, marginBottom: 10, textTransform: 'uppercase' as const },
  heading: { fontSize: 26, fontWeight: 800, margin: '0 0 6px' },
  sub: { fontSize: 14, color: '#7F8C8D', margin: '0 0 24px' },
  card: { background: 'white', border: '1px solid #E0D8CC', borderRadius: 14, padding: '24px 28px', marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' } as React.CSSProperties,
  label: { fontSize: 13, fontWeight: 600, color: '#2C3E50', marginBottom: 6, display: 'block' },
};

export default function CompositionPage() {
  const [paragraph, setParagraph] = useState('');
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompositionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!paragraph.trim() || loading) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const res = await fetch('/api/tools/composition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paragraph, genre }),
      });
      const data: CompositionResponse = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch {
      setError('Could not reach the AI. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  const overallColour = result
    ? result.overallScore >= 4 ? '#22C55E' : result.overallScore >= 3 ? '#F59E0B' : '#EF4444'
    : '#0F766E';

  return (
    <div style={S.page}>
      <div style={S.badge}>{LESSONS.map((l) => `L${l}`).join(' · ')} · Structure</div>
      <h1 style={S.heading}>Composition Reviewer</h1>
      <p style={S.sub}>Paste your paragraph below — the AI will review it against the LSC scaffold (Lead, Support, Close) and give feedback on each part.</p>

      <form onSubmit={handleSubmit}>
        <div style={S.card}>
          {/* LSC reminder */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 18 }}>
            {LSC_CONFIG.map((s) => (
              <div key={s.key} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>{s.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: s.colour }}>{s.label}</div>
                <div style={{ fontSize: 10, color: '#7F8C8D', marginTop: 2 }}>{s.desc}</div>
              </div>
            ))}
          </div>

          <label style={S.label}>Your paragraph</label>
          <textarea
            value={paragraph}
            onChange={(e) => { setParagraph(e.target.value); setResult(null); setError(null); }}
            placeholder="Write or paste your paragraph here…"
            rows={6}
            disabled={loading}
            style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E0D8CC', borderRadius: 8, fontSize: 14, color: '#2C3E50', outline: 'none', resize: 'vertical', background: '#FAFAF8', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6 }}
          />

          <label style={{ ...S.label, marginTop: 14 }}>Genre (optional)</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
            {GENRES.map((g) => (
              <button
                key={g} type="button"
                onClick={() => setGenre(genre === g ? '' : g)}
                style={{
                  padding: '6px 14px', borderRadius: 20, border: `1.5px solid ${genre === g ? '#0F766E' : '#E0D8CC'}`,
                  background: genre === g ? '#F0FDFA' : 'white', color: genre === g ? '#0F766E' : '#7F8C8D',
                  fontSize: 13, fontWeight: genre === g ? 700 : 400, cursor: 'pointer',
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!paragraph.trim() || loading}
          style={{
            width: '100%', padding: '13px', borderRadius: 10, border: 'none',
            background: paragraph.trim() && !loading ? '#0F766E' : '#D1D5DB',
            color: 'white', fontSize: 15, fontWeight: 700,
            cursor: paragraph.trim() && !loading ? 'pointer' : 'default', marginBottom: 20,
          }}
        >
          {loading ? '✦ Reviewing your paragraph…' : '✦ Review my paragraph'}
        </button>
      </form>

      {error && (
        <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', color: '#BE123C', borderRadius: 10, padding: '14px 18px', marginBottom: 20, fontSize: 14 }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ ...S.card, border: `1.5px solid ${overallColour}44` }}>
          {/* Overall */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #F0EAD6' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: overallColour, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: 'white', fontWeight: 800, fontSize: 22 }}>{result.overallScore}</span>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Overall LSC score</div>
              <p style={{ fontSize: 14, color: '#7F8C8D', margin: 0 }}>{result.overallFeedback}</p>
            </div>
          </div>

          {/* Three sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {LSC_CONFIG.map((s) => (
              <div key={s.key} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <ScoreCircle score={result[s.key]} colour={s.colour} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: s.colour, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                    {s.icon} {s.label}
                  </div>
                  <p style={{ fontSize: 14, color: '#2C3E50', margin: 0, lineHeight: 1.55 }}>{result[s.feedback]}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Top suggestion */}
          <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: '14px 16px', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>✏️ Most important improvement</div>
            <p style={{ fontSize: 14, color: '#78350F', margin: 0 }}>{result.topSuggestion}</p>
          </div>

          <button
            onClick={() => { setParagraph(''); setResult(null); setError(null); }}
            style={{ background: '#0F766E', color: 'white', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
          >
            Review another paragraph →
          </button>
        </div>
      )}
    </div>
  );
}
