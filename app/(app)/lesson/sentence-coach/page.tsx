'use client';

import { useState } from 'react';
import type { SentenceCoachResponse } from '@/app/api/tools/sentence-coach/route';

const LESSONS = [11, 13, 17, 25];

const DIMENSION_LABELS: Record<string, string> = {
  vocabulary: 'Vocabulary',
  grammar: 'Grammar',
  originality: 'Originality',
};
const DIMENSION_COLOURS: Record<string, string> = {
  vocabulary: '#8B5CF6',
  grammar: '#10B981',
  originality: '#F59E0B',
};

function ScoreBar({ value, colour }: { value: number; colour: string }) {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} style={{
          width: 24, height: 6, borderRadius: 3,
          background: n <= value ? colour : '#E5E7EB',
          transition: 'background 0.3s',
        }} />
      ))}
      <span style={{ fontSize: 11, color: '#7F8C8D', marginLeft: 4 }}>{value}/5</span>
    </div>
  );
}

const S = {
  page: { maxWidth: 680, margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', color: '#2C3E50' } as React.CSSProperties,
  badge: { display: 'inline-flex', gap: 6, background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', padding: '3px 10px', borderRadius: 20, marginBottom: 10, textTransform: 'uppercase' as const },
  heading: { fontSize: 26, fontWeight: 800, margin: '0 0 6px' },
  sub: { fontSize: 14, color: '#7F8C8D', margin: '0 0 24px' },
  card: { background: 'white', border: '1px solid #E0D8CC', borderRadius: 14, padding: '24px 28px', marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' } as React.CSSProperties,
  label: { fontSize: 13, fontWeight: 600, color: '#2C3E50', marginBottom: 6, display: 'block' },
};

export default function SentenceCoachPage() {
  const [sentence, setSentence] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SentenceCoachResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sentence.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch('/api/tools/sentence-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence, context }),
      });
      const data: SentenceCoachResponse = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch {
      setError('Could not reach the AI. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  const overallColour = result
    ? result.score >= 4 ? '#22C55E' : result.score >= 3 ? '#F59E0B' : '#EF4444'
    : '#27AE60';

  return (
    <div style={S.page}>
      <div style={S.badge}>{LESSONS.map((l) => `L${l}`).join(' · ')} · Sentence Craft</div>
      <h1 style={S.heading}>Sentence Quality Coach</h1>
      <p style={S.sub}>Write your best sentence — the AI will rate it on vocabulary, grammar, and originality, then suggest one way to make it even better.</p>

      <form onSubmit={handleSubmit}>
        <div style={S.card}>
          <label style={S.label}>Your sentence</label>
          <textarea
            value={sentence}
            onChange={(e) => { setSentence(e.target.value); setResult(null); setError(null); }}
            placeholder="Write one of your best sentences here…"
            rows={3}
            disabled={loading}
            style={{
              width: '100%', padding: '10px 14px', border: '1.5px solid #E0D8CC',
              borderRadius: 8, fontSize: 14, color: '#2C3E50', outline: 'none',
              resize: 'vertical', background: '#FAFAF8', boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
          <label style={{ ...S.label, marginTop: 14 }}>Topic or lesson (optional)</label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. Lesson 13 – expanding noun phrases"
            style={{
              width: '100%', padding: '10px 14px', border: '1.5px solid #E0D8CC',
              borderRadius: 8, fontSize: 14, color: '#2C3E50', outline: 'none',
              background: '#FAFAF8', boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!sentence.trim() || loading}
          style={{
            width: '100%', padding: '13px', borderRadius: 10, border: 'none',
            background: sentence.trim() && !loading ? '#27AE60' : '#D1D5DB',
            color: 'white', fontSize: 15, fontWeight: 700,
            cursor: sentence.trim() && !loading ? 'pointer' : 'default',
            marginBottom: 20,
          }}
        >
          {loading ? '✦ Rating your sentence…' : '✦ Rate my sentence'}
        </button>
      </form>

      {error && (
        <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', color: '#BE123C', borderRadius: 10, padding: '14px 18px', marginBottom: 20, fontSize: 14 }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ ...S.card, border: `1.5px solid ${overallColour}33` }}>
          {/* Overall score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #F0EAD6' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: overallColour,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ color: 'white', fontWeight: 800, fontSize: 20 }}>{result.score}</span>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Overall quality</div>
              <ScoreBar value={result.score} colour={overallColour} />
            </div>
          </div>

          {/* Three dimensions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
            {(['vocabulary', 'grammar', 'originality'] as const).map((dim) => (
              <div key={dim} style={{ background: '#FAFAF8', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#7F8C8D', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  {DIMENSION_LABELS[dim]}
                </div>
                <ScoreBar value={result[dim]} colour={DIMENSION_COLOURS[dim]} />
              </div>
            ))}
          </div>

          {/* Feedback */}
          <p style={{ fontSize: 15, color: '#2C3E50', lineHeight: 1.65, margin: '0 0 16px' }}>
            {result.feedback}
          </p>

          {/* Improvement */}
          <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: '14px 16px', marginBottom: result.improved ? 12 : 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              ✏️ One improvement
            </div>
            <p style={{ fontSize: 14, color: '#78350F', margin: 0 }}>{result.improvement}</p>
          </div>

          {result.improved && (
            <div style={{ background: '#F0FFF4', border: '1px solid #A7F3D0', borderRadius: 8, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                ✨ For example
              </div>
              <p style={{ fontSize: 14, color: '#064E3B', fontStyle: 'italic', margin: 0 }}>"{result.improved}"</p>
            </div>
          )}

          <button
            onClick={() => { setSentence(''); setResult(null); setError(null); }}
            style={{
              marginTop: 16, background: '#27AE60', color: 'white', border: 'none',
              borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Try another sentence →
          </button>
        </div>
      )}
    </div>
  );
}
