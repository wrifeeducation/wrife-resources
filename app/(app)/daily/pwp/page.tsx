'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { PWP_FORMULAS, type PWPFormula } from '@/lib/data/pwp-formulas';
import type { PWPResponse } from '@/app/api/tools/pwp/route';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Pick today's variation index (0–4) based on day of year */
function todaysVariationIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear % 5;
}

const VARIATION_IDX = todaysVariationIndex();

// ── Word-class colour chips ───────────────────────────────────────────────────

const WORD_CLASS_COLOURS: Record<string, { bg: string; text: string }> = {
  Det:   { bg: '#EDE9FE', text: '#5B21B6' },
  Adj:   { bg: '#FEF3C7', text: '#92400E' },
  N:     { bg: '#DBEAFE', text: '#1E40AF' },
  V:     { bg: '#D1FAE5', text: '#065F46' },
  HV:    { bg: '#FCE7F3', text: '#9D174D' },
  O:     { bg: '#DBEAFE', text: '#1E3A8A' },
  S:     { bg: '#FEE2E2', text: '#991B1B' },
  Adv:   { bg: '#FEF9C3', text: '#713F12' },
  Conj:  { bg: '#E0F2FE', text: '#0C4A6E' },
  SConj: { bg: '#F0FDF4', text: '#14532D' },
  Prep:  { bg: '#FDF4FF', text: '#581C87' },
};

function FormulaChips({ formula }: { formula: string }) {
  // Split on + and other connectors, preserve them as separators
  const parts = formula.split(/(\s*[+/,]\s*|\s+or\s+|\s+and\s+)/i);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
      {parts.map((part, i) => {
        const trimmed = part.trim();
        if (!trimmed || /^[+/,]$/.test(trimmed) || /^(or|and)$/i.test(trimmed)) {
          return trimmed ? (
            <span key={i} style={{ fontSize: 14, color: '#7F8C8D', fontWeight: 600 }}>{trimmed}</span>
          ) : null;
        }
        const colour = WORD_CLASS_COLOURS[trimmed];
        if (colour) {
          return (
            <span key={i} style={{
              background: colour.bg, color: colour.text,
              padding: '4px 10px', borderRadius: 6, fontSize: 13, fontWeight: 700,
              fontFamily: 'monospace',
            }}>{trimmed}</span>
          );
        }
        return (
          <span key={i} style={{ fontSize: 13, color: '#2C3E50', fontWeight: 500 }}>{trimmed}</span>
        );
      })}
    </div>
  );
}

// ── Lesson picker ─────────────────────────────────────────────────────────────

function LessonPicker({ current, onChange }: {
  current: PWPFormula;
  onChange: (f: PWPFormula) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: '#F0FFF4', border: '1.5px solid #A9DFBF', color: '#27AE60',
          padding: '5px 12px', borderRadius: 8, fontSize: 13, fontWeight: 700,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        Lesson {current.lesson}: {current.title}
        <span style={{ fontSize: 10 }}>▼</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '110%', left: 0, background: 'white',
          border: '1px solid #E0D8CC', borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 50, maxHeight: 320, overflowY: 'auto', minWidth: 260,
        }}>
          {PWP_FORMULAS.map((f) => (
            <button
              key={f.lesson}
              onClick={() => { onChange(f); setOpen(false); }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '8px 14px', border: 'none', cursor: 'pointer',
                background: f.lesson === current.lesson ? '#F0FFF4' : 'white',
                color: f.lesson === current.lesson ? '#27AE60' : '#2C3E50',
                fontSize: 13, fontWeight: f.lesson === current.lesson ? 700 : 400,
              }}
            >
              L{f.lesson}: {f.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Score bar ─────────────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const colours = ['#EF4444', '#F97316', '#F59E0B', '#84CC16', '#22C55E'];
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} style={{
          width: 28, height: 8, borderRadius: 4,
          background: n <= score ? colours[score - 1] : '#E5E7EB',
          transition: 'background 0.3s',
        }} />
      ))}
      <span style={{ fontSize: 12, color: '#7F8C8D', marginLeft: 4 }}>{score}/5</span>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function PWPPage() {
  const [formula, setFormula] = useState<PWPFormula>(PWP_FORMULAS[0]);
  const [sentence, setSentence] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PWPResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const variation = formula.variations[VARIATION_IDX];

  function handleFormulaChange(f: PWPFormula) {
    setFormula(f);
    setSentence('');
    setResult(null);
    setError(null);
    setSubmitted(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sentence.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setSubmitted(true);

    try {
      const res = await fetch('/api/tools/pwp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentence,
          lessonNumber: formula.lesson,
          formula: formula.formula,
          label: formula.label,
          example: formula.example,
          variation,
        }),
      });
      const data: PWPResponse = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError('Could not reach the AI. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleTryAgain() {
    setSentence('');
    setResult(null);
    setError(null);
    setSubmitted(false);
  }

  const mascotSrc = loading
    ? '/mascots/pencil-thinking.png'
    : result?.correct
    ? '/mascots/pencil-waving.png'
    : result
    ? '/mascots/pencil-reading.png'
    : '/mascots/pencil-waving.png';

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Page header ───────────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{
            background: '#E8F5E9', color: '#27AE60', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.07em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 20,
          }}>Daily Practice</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#2C3E50', margin: '0 0 4px' }}>
              PWP Practice
            </h1>
            <p style={{ fontSize: 13, color: '#7F8C8D', margin: 0 }}>
              Write one sentence using today&apos;s formula. The AI will check it for you.
            </p>
          </div>
          <LessonPicker current={formula} onChange={handleFormulaChange} />
        </div>
      </div>

      {/* ── Formula card ──────────────────────────────────────────── */}
      <div style={{
        background: 'white', borderRadius: 14, border: '1px solid #F0EAD6',
        padding: '20px 22px', marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#7F8C8D', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              Lesson {formula.lesson} — {formula.title}
            </div>
            <div style={{ marginBottom: 10 }}>
              <FormulaChips formula={formula.formula} />
            </div>
            <p style={{ fontSize: 13, color: '#636E72', margin: '0 0 10px', lineHeight: 1.5 }}>
              {formula.label}
            </p>
            <div style={{ background: '#F8F9FA', borderRadius: 8, padding: '8px 12px', borderLeft: '3px solid #27AE60' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#7F8C8D', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Example: </span>
              <span style={{ fontSize: 13, color: '#2C3E50', fontStyle: 'italic' }}>{formula.example}</span>
            </div>
          </div>

          {/* Mascot */}
          <div style={{
            width: 80, height: 80, background: '#F0FFF4', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', flexShrink: 0,
          }}>
            <Image
              src={mascotSrc}
              alt=""
              role="presentation"
              width={72}
              height={72}
              style={{ objectFit: 'contain', transition: 'opacity 0.2s' }}
            />
          </div>
        </div>
      </div>

      {/* ── Today's prompt ────────────────────────────────────────── */}
      <div style={{
        background: '#FFF8E7', border: '1.5px solid #F5C500',
        borderRadius: 10, padding: '12px 16px', marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>✏️</span>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>
            Today&apos;s prompt
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#2C3E50' }}>
            Write about: <span style={{ color: '#D97706' }}>{variation}</span>
          </div>
        </div>
      </div>

      {/* ── Input form ────────────────────────────────────────────── */}
      {!submitted && (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#2C3E50', display: 'block', marginBottom: 8 }}>
              Your sentence
            </label>
            <textarea
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              placeholder={`Write a sentence about: ${variation.toLowerCase()}…`}
              rows={3}
              style={{
                width: '100%', border: '1.5px solid #E0D8CC', borderRadius: 10,
                padding: '12px 14px', fontSize: 16, color: '#2C3E50',
                resize: 'none', outline: 'none', background: 'white',
                fontFamily: 'inherit', lineHeight: 1.5, boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#27AE60'; }}
              onBlur={(e) => { e.target.style.borderColor = '#E0D8CC'; }}
            />
            <div style={{ textAlign: 'right', fontSize: 11, color: '#7F8C8D', marginTop: 4 }}>
              {sentence.trim().split(/\s+/).filter(Boolean).length} words
            </div>
          </div>
          <button
            type="submit"
            disabled={!sentence.trim() || loading}
            style={{
              width: '100%', background: sentence.trim() ? '#27AE60' : '#A9DFBF',
              color: 'white', border: 'none', borderRadius: 10, padding: '14px',
              fontSize: 15, fontWeight: 700, cursor: sentence.trim() ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Checking your sentence…' : 'Submit for feedback →'}
          </button>
        </form>
      )}

      {/* ── Loading state ─────────────────────────────────────────── */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px 0', color: '#7F8C8D', fontSize: 14 }}>
          <div style={{ marginBottom: 8 }}>🤔 Thinking about your sentence…</div>
          <div style={{
            width: '100%', height: 4, background: '#F0EAD6', borderRadius: 2, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', background: '#27AE60', borderRadius: 2,
              animation: 'pwp-progress 1.5s ease-in-out infinite',
              width: '40%',
            }} />
          </div>
        </div>
      )}

      {/* ── Error state ───────────────────────────────────────────── */}
      {error && (
        <div style={{
          background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 10,
          padding: '14px 16px', marginTop: 16, color: '#BE123C', fontSize: 14,
        }}>
          <strong>Oops!</strong> {error}
          <button onClick={handleTryAgain} style={{
            display: 'block', marginTop: 10, background: '#27AE60', color: 'white',
            border: 'none', borderRadius: 7, padding: '8px 16px', fontSize: 13,
            fontWeight: 700, cursor: 'pointer',
          }}>Try again</button>
        </div>
      )}

      {/* ── Feedback panel ────────────────────────────────────────── */}
      {result && !loading && (
        <div style={{
          background: result.correct ? '#F0FFF4' : '#FFFBEB',
          border: `2px solid ${result.correct ? '#27AE60' : '#F5C500'}`,
          borderRadius: 14, padding: '20px 22px', marginTop: 4,
          animation: 'fadeIn 0.3s ease-out',
        }}>
          {/* Result header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: result.correct ? '#27AE60' : '#F59E0B',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, flexShrink: 0,
            }}>
              {result.correct ? '✓' : '✏️'}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#2C3E50' }}>
                {result.correct ? 'Great work!' : 'Nearly there!'}
              </div>
              <ScoreBar score={result.score} />
            </div>
          </div>

          {/* Submitted sentence echo */}
          <div style={{
            background: 'rgba(255,255,255,0.7)', borderRadius: 8,
            padding: '8px 12px', marginBottom: 14, borderLeft: `3px solid ${result.correct ? '#27AE60' : '#F59E0B'}`,
          }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#7F8C8D', textTransform: 'uppercase', letterSpacing: '0.06em' }}>You wrote: </span>
            <span style={{ fontSize: 14, color: '#2C3E50', fontStyle: 'italic' }}>{sentence}</span>
          </div>

          {/* Feedback */}
          <p style={{ fontSize: 14, color: '#2C3E50', lineHeight: 1.65, margin: '0 0 12px' }}>
            {result.feedback}
          </p>

          {/* Tip */}
          {result.tip && (
            <div style={{
              background: 'white', borderRadius: 8, padding: '10px 14px',
              border: '1px solid #FDE68A', marginBottom: 12,
              display: 'flex', gap: 8, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.5 }}>
                <strong>Try this:</strong> {result.tip}
              </p>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleTryAgain} style={{
              flex: 1, background: result.correct ? '#27AE60' : 'white',
              color: result.correct ? 'white' : '#2C3E50',
              border: `1.5px solid ${result.correct ? '#27AE60' : '#E0D8CC'}`,
              borderRadius: 9, padding: '11px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}>
              {result.correct ? '✓ Write another sentence' : '↩ Try again'}
            </button>
            {!result.correct && result.score >= 3 && (
              <button onClick={() => {
                setSentence('');
                setResult(null);
                setError(null);
                setSubmitted(false);
                // Move to next lesson
                const idx = PWP_FORMULAS.findIndex(f => f.lesson === formula.lesson);
                if (idx < PWP_FORMULAS.length - 1) setFormula(PWP_FORMULAS[idx + 1]);
              }} style={{
                background: '#E8922B', color: 'white', border: 'none',
                borderRadius: 9, padding: '11px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}>
                Next lesson →
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pwp-progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
