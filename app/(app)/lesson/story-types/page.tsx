'use client';

import { useState } from 'react';
import type { StoryTypesResponse } from '@/app/api/tools/story-types/route';

const LESSONS = [31];

const CONFIDENCE_CONFIG = {
  high: { colour: '#22C55E', bg: '#F0FFF4', border: '#A7F3D0', label: 'High confidence' },
  medium: { colour: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', label: 'Medium confidence' },
  low: { colour: '#EF4444', bg: '#FFF1F2', border: '#FECDD3', label: 'Low confidence' },
};

const STORY_TYPE_ICONS: Record<string, string> = {
  'Quest': '🗺️', 'Voyage and Return': '⛵', 'Rags to Riches': '👑',
  'Overcoming the Monster': '🐉', 'Rebirth': '🌱', 'Comedy': '😄',
  'Tragedy': '🎭', 'Mystery': '🔍', 'Adventure': '⚡',
  'Forbidden Love': '💔', 'Rivalry': '⚔️', 'Sacrifice': '🕊️',
};

const S = {
  page: { maxWidth: 680, margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', color: '#2C3E50' } as React.CSSProperties,
  badge: { display: 'inline-flex', gap: 6, background: '#FDF4FF', color: '#7E22CE', border: '1px solid #E9D5FF', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', padding: '3px 10px', borderRadius: 20, marginBottom: 10, textTransform: 'uppercase' as const },
  heading: { fontSize: 26, fontWeight: 800, margin: '0 0 6px' },
  sub: { fontSize: 14, color: '#7F8C8D', margin: '0 0 24px' },
  card: { background: 'white', border: '1px solid #E0D8CC', borderRadius: 14, padding: '24px 28px', marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' } as React.CSSProperties,
  label: { fontSize: 13, fontWeight: 600, color: '#2C3E50', marginBottom: 6, display: 'block' },
};

export default function StoryTypesPage() {
  const [passage, setPassage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StoryTypesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!passage.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch('/api/tools/story-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passage }),
      });
      const data: StoryTypesResponse = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch {
      setError('Could not reach the AI. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  const conf = result ? CONFIDENCE_CONFIG[result.confidence] : null;

  return (
    <div style={S.page}>
      <div style={S.badge}>L{LESSONS[0]} · Genre</div>
      <h1 style={S.heading}>Story Type Identifier</h1>
      <p style={S.sub}>
        Paste a story opening below — the AI will identify which of WriFe's twelve story types it is and explain the tell-tale features it spotted.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={S.card}>
          <label style={S.label}>Story opening (paste your text here)</label>
          <textarea
            value={passage}
            onChange={(e) => { setPassage(e.target.value); setResult(null); setError(null); }}
            placeholder="Paste a story opening here — at least a few sentences…"
            rows={6}
            disabled={loading}
            style={{
              width: '100%', padding: '10px 14px', border: '1.5px solid #E0D8CC',
              borderRadius: 8, fontSize: 14, color: '#2C3E50', outline: 'none',
              resize: 'vertical', background: '#FAFAF8', boxSizing: 'border-box',
              fontFamily: 'inherit', lineHeight: 1.6,
            }}
          />
          <div style={{ fontSize: 12, color: '#ABA89E', marginTop: 6, textAlign: 'right' }}>
            {passage.trim().split(/\s+/).filter(Boolean).length} words
          </div>
        </div>

        <button
          type="submit"
          disabled={!passage.trim() || loading}
          style={{
            width: '100%', padding: '13px', borderRadius: 10, border: 'none',
            background: passage.trim() && !loading ? '#7E22CE' : '#D1D5DB',
            color: 'white', fontSize: 15, fontWeight: 700,
            cursor: passage.trim() && !loading ? 'pointer' : 'default',
            marginBottom: 20,
          }}
        >
          {loading ? '🔍 Identifying story type…' : '🔍 Identify this story type'}
        </button>
      </form>

      {error && (
        <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', color: '#BE123C', borderRadius: 10, padding: '14px 18px', marginBottom: 20, fontSize: 14 }}>
          {error}
        </div>
      )}

      {result && conf && (
        <div style={{ ...S.card, border: `1.5px solid ${conf.border}` }}>
          {/* Story type */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #F0EAD6' }}>
            <div style={{ fontSize: 40 }}>{STORY_TYPE_ICONS[result.storyType] ?? '📖'}</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#7F8C8D', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Story type identified</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#2C3E50' }}>{result.storyType}</div>
              <span style={{ fontSize: 11, fontWeight: 700, background: conf.bg, color: conf.colour, border: `1px solid ${conf.border}`, padding: '2px 8px', borderRadius: 10 }}>
                {conf.label}
              </span>
            </div>
          </div>

          {/* Explanation */}
          <p style={{ fontSize: 15, color: '#2C3E50', lineHeight: 1.65, margin: '0 0 16px' }}>
            {result.explanation}
          </p>

          {/* Key features */}
          <div style={{ background: '#F8F7FF', border: '1px solid #E9D5FF', borderRadius: 8, padding: '14px 16px', marginBottom: result.alternativeType ? 12 : 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6D28D9', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Tell-tale features spotted
            </div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {result.keyFeatures.map((f, i) => (
                <li key={i} style={{ fontSize: 14, color: '#4C1D95', marginBottom: 4 }}>{f}</li>
              ))}
            </ul>
          </div>

          {result.alternativeType && (
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                Could also be…
              </div>
              <p style={{ fontSize: 14, color: '#78350F', margin: 0 }}>
                {STORY_TYPE_ICONS[result.alternativeType] ?? '📖'} {result.alternativeType} — though {result.storyType} fits best based on the features above.
              </p>
            </div>
          )}

          <button
            onClick={() => { setPassage(''); setResult(null); setError(null); }}
            style={{ background: '#7E22CE', color: 'white', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
          >
            Try another passage →
          </button>
        </div>
      )}
    </div>
  );
}
