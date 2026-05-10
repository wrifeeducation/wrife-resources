'use client';

import { useState } from 'react';
import type { ConnectGridResponse } from '@/app/api/tools/connect-grid/route';

// ── Lesson info ───────────────────────────────────────────────────────────────
const LESSONS = [27, 29, 35, 36, 37, 38];

// Grid layout: 8 surrounding cells + 1 centre
// Indices 0-7 = surrounding (TL, TC, TR, ML, MR, BL, BC, BR)
// Centre = topic word
const CELL_LABELS = [
  'Top left', 'Top centre', 'Top right',
  'Middle left', /* centre */ 'Middle right',
  'Bottom left', 'Bottom centre', 'Bottom right',
];

const S = {
  page: {
    maxWidth: 760, margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif',
    color: '#2C3E50',
  } as React.CSSProperties,
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE',
    fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
    padding: '3px 10px', borderRadius: 20, marginBottom: 10,
    textTransform: 'uppercase' as const,
  },
  heading: { fontSize: 26, fontWeight: 800, margin: '0 0 6px', lineHeight: 1.2 },
  sub: { fontSize: 14, color: '#7F8C8D', margin: '0 0 28px' },
  card: {
    background: 'white', border: '1px solid #E0D8CC', borderRadius: 14,
    padding: '24px 28px', marginBottom: 20,
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  } as React.CSSProperties,
  label: { fontSize: 13, fontWeight: 600, color: '#2C3E50', marginBottom: 6, display: 'block' },
  input: {
    width: '100%', padding: '10px 14px', border: '1.5px solid #E0D8CC',
    borderRadius: 8, fontSize: 14, color: '#2C3E50', outline: 'none',
    background: '#FAFAF8', boxSizing: 'border-box' as const,
  },
};

// ── Grid cell component ────────────────────────────────────────────────────────
function GridCell({
  value, index, selected, onSelect, onChange, loading,
}: {
  value: string; index: number; selected: boolean;
  onSelect: () => void; onChange: (v: string) => void; loading: boolean;
}) {
  return (
    <div
      style={{
        background: selected ? '#EFF6FF' : '#FAFAF8',
        border: `2px solid ${selected ? '#3B82F6' : '#E0D8CC'}`,
        borderRadius: 10, padding: 8, display: 'flex', flexDirection: 'column', gap: 4,
        cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s',
      }}
      onClick={onSelect}
    >
      <input
        type="text"
        value={value}
        placeholder="Word…"
        maxLength={30}
        disabled={loading}
        onChange={(e) => { e.stopPropagation(); onChange(e.target.value); }}
        onClick={(e) => e.stopPropagation()}
        style={{
          border: 'none', background: 'transparent', fontSize: 13, fontWeight: 600,
          color: '#2C3E50', outline: 'none', width: '100%', textAlign: 'center',
        }}
      />
      {value && (
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          style={{
            fontSize: 10, color: selected ? '#3B82F6' : '#7F8C8D', background: 'none',
            border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600,
          }}
        >
          {selected ? '✓ Selected' : 'Get help →'}
        </button>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ConnectGridPage() {
  const [topic, setTopic] = useState('');
  const [cells, setCells] = useState<string[]>(Array(8).fill(''));
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConnectGridResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  function updateCell(idx: number, val: string) {
    setCells((prev) => { const next = [...prev]; next[idx] = val; return next; });
    if (result && selected === idx) { setResult(null); setError(null); }
  }

  async function handleCoach() {
    if (selected === null || !cells[selected]?.trim() || !topic.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch('/api/tools/connect-grid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          cells,
          targetCell: selected,
          cellWord: cells[selected],
        }),
      });
      const data: ConnectGridResponse = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch {
      setError('Could not reach the AI. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  // Build 3x3 grid: [0,1,2] [3,CENTRE,4] [5,6,7]
  const gridRows: (number | 'centre')[][] = [
    [0, 1, 2],
    [3, 'centre', 4],
    [5, 6, 7],
  ];

  const canCoach = topic.trim() && selected !== null && cells[selected]?.trim() && !loading;

  return (
    <div style={S.page}>
      <div style={S.badge}>
        {LESSONS.map((l) => `L${l}`).join(' · ')} · Planning
      </div>
      <h1 style={S.heading}>Connect Grid Tutor</h1>
      <p style={S.sub}>
        Enter your topic in the centre, fill the surrounding cells with related words,
        then click a cell to get coaching on turning that word into a sentence.
      </p>

      {/* Topic input */}
      <div style={S.card}>
        <label style={S.label}>Topic word (goes in the centre of your grid)</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => { setTopic(e.target.value); setResult(null); setError(null); }}
          placeholder="e.g. rainforest, friendship, the moon…"
          maxLength={40}
          style={S.input}
        />
      </div>

      {/* Grid */}
      <div style={S.card}>
        <label style={{ ...S.label, marginBottom: 12 }}>
          Your Connect Grid — fill in surrounding words, then click one to get coaching
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {gridRows.map((row, ri) =>
            row.map((cell, ci) =>
              cell === 'centre' ? (
                <div key="centre" style={{
                  background: '#27AE60', borderRadius: 10, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  padding: 12, minHeight: 64,
                }}>
                  <span style={{ color: 'white', fontWeight: 800, fontSize: 15, textAlign: 'center' }}>
                    {topic || 'Your topic'}
                  </span>
                </div>
              ) : (
                <GridCell
                  key={cell}
                  index={cell as number}
                  value={cells[cell as number]}
                  selected={selected === cell}
                  onSelect={() => {
                    setSelected(cell as number);
                    setResult(null);
                    setError(null);
                  }}
                  onChange={(v) => updateCell(cell as number, v)}
                  loading={loading}
                />
              )
            )
          )}
        </div>
      </div>

      {/* Coach button */}
      {selected !== null && cells[selected]?.trim() && (
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={handleCoach}
            disabled={!canCoach}
            style={{
              width: '100%', padding: '13px 24px', borderRadius: 10, border: 'none',
              background: canCoach ? '#3B82F6' : '#D1D5DB',
              color: 'white', fontSize: 15, fontWeight: 700, cursor: canCoach ? 'pointer' : 'default',
              transition: 'background 0.2s',
            }}
          >
            {loading
              ? '✦ Coaching…'
              : `✦ Help me stretch "${cells[selected]}" into a sentence`}
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: '#FFF1F2', border: '1px solid #FECDD3', color: '#BE123C',
          borderRadius: 10, padding: '14px 18px', marginBottom: 20, fontSize: 14,
        }}>
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{
          background: '#EFF6FF', border: '1.5px solid #BFDBFE', borderRadius: 14,
          padding: '20px 24px', marginBottom: 24,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1D4ED8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            💡 Your coach says
          </div>
          <p style={{ fontSize: 15, color: '#1E3A5F', lineHeight: 1.65, margin: '0 0 14px' }}>
            {result.coachingText}
          </p>
          <div style={{ background: 'white', borderRadius: 8, padding: '12px 16px', border: '1px solid #BFDBFE', marginBottom: result.nudge ? 14 : 0 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Example</span>
            <p style={{ fontSize: 14, color: '#2C3E50', fontStyle: 'italic', margin: '4px 0 0' }}>
              {result.exampleSentence}
            </p>
          </div>
          {result.nudge && (
            <div style={{ background: '#FFFBEB', borderRadius: 8, padding: '12px 16px', border: '1px solid #FDE68A', marginTop: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Think about it</span>
              <p style={{ fontSize: 14, color: '#78350F', margin: '4px 0 0' }}>{result.nudge}</p>
            </div>
          )}
          <button
            onClick={() => { setResult(null); setSelected(null); }}
            style={{
              marginTop: 16, background: '#3B82F6', color: 'white', border: 'none',
              borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Try another cell →
          </button>
        </div>
      )}
    </div>
  );
}
