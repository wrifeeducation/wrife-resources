'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { DWP_PROMPTS, type DWPPrompt, type DWPPromptType } from '@/lib/data/dwp-prompts';
import type { DWPResponse } from '@/app/api/tools/dwp/route';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Today's prompt type follows a weekly pattern */
const TYPE_BY_DOW: Record<number, DWPPromptType> = {
  0: 'narrative',    // Sunday
  1: 'sensory',      // Monday
  2: 'narrative',    // Tuesday
  3: 'reflection',   // Wednesday
  4: 'description',  // Thursday
  5: 'argument',     // Friday
  6: 'narrative',    // Saturday
};

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function todaysPrompt(): DWPPrompt {
  const dow = new Date().getDay();
  const type = TYPE_BY_DOW[dow];
  const pool = DWP_PROMPTS.filter((p) => p.type === type);
  const idx = getDayOfYear() % pool.length;
  return pool[idx];
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ── Type badge colours ────────────────────────────────────────────────────────

const TYPE_COLOURS: Record<DWPPromptType, { bg: string; text: string; border: string; label: string; emoji: string }> = {
  sensory:     { bg: '#F0FDF4', text: '#065F46', border: '#A7F3D0', label: 'Sensory',     emoji: '👂' },
  narrative:   { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE', label: 'Narrative',   emoji: '📖' },
  reflection:  { bg: '#FDF4FF', text: '#7E22CE', border: '#E9D5FF', label: 'Reflection',  emoji: '🤔' },
  description: { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA', label: 'Description', emoji: '🔍' },
  argument:    { bg: '#FFF1F2', text: '#9F1239', border: '#FECDD3', label: 'Argument',    emoji: '💬' },
};

// ── Word-count meter ──────────────────────────────────────────────────────────

const WORD_TARGETS = [
  { min: 0,   max: 20,   label: 'Just getting started…', colour: '#E5E7EB' },
  { min: 20,  max: 50,   label: 'Keep going!',            colour: '#F59E0B' },
  { min: 50,  max: 80,   label: 'Good effort!',           colour: '#84CC16' },
  { min: 80,  max: 9999, label: 'Excellent writing!',     colour: '#22C55E' },
];

function WordMeter({ count }: { count: number }) {
  const stage = WORD_TARGETS.find((t) => count >= t.min && count < t.max) ?? WORD_TARGETS[3];
  const progress = Math.min((count / 80) * 100, 100);

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: '#7F8C8D' }}>{stage.label}</span>
        <span style={{
          fontSize: 12, fontWeight: 700,
          color: count >= 80 ? '#22C55E' : count >= 50 ? '#84CC16' : count >= 20 ? '#F59E0B' : '#9CA3AF',
        }}>{count} words</span>
      </div>
      <div style={{ height: 5, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${progress}%`,
          background: stage.colour, borderRadius: 3,
          transition: 'width 0.3s ease, background 0.3s ease',
        }} />
      </div>
      {count < 20 && (
        <p style={{ fontSize: 11, color: '#9CA3AF', margin: '4px 0 0', textAlign: 'right' }}>
          Aim for at least 20 words
        </p>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DWPPage() {
  const [prompt] = useState<DWPPrompt>(todaysPrompt);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DWPResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = countWords(text);
  const typeStyle = TYPE_COLOURS[prompt.type];
  const canSubmit = wordCount >= 10 && !loading;

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const mascotSrc = loading
    ? '/mascots/pencil-thinking.png'
    : result
    ? '/mascots/pencil-reading.png'
    : '/mascots/pencil-waving.png';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setSubmitted(true);

    try {
      const res = await fetch('/api/tools/dwp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          promptId: prompt.id,
          promptText: prompt.text,
          promptType: prompt.type,
          wordCount,
        }),
      });
      const data: DWPResponse = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError('Could not reach the AI. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleWriteAgain() {
    setText('');
    setResult(null);
    setError(null);
    setSubmitted(false);
    setTimeout(() => textareaRef.current?.focus(), 50);
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Page header ───────────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{
            background: '#EFF6FF', color: '#1E40AF', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.07em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 20,
          }}>Daily Practice</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#2C3E50', margin: '0 0 4px' }}>
              Daily Writing Practice
            </h1>
            <p style={{ fontSize: 13, color: '#7F8C8D', margin: 0 }}>
              Write freely. There are no wrong answers — just your thoughts and ideas.
            </p>
          </div>
          {/* Mascot */}
          <div style={{
            width: 72, height: 72, background: '#EFF6FF', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', flexShrink: 0,
          }}>
            <Image
              src={mascotSrc}
              alt=""
              role="presentation"
              width={64}
              height={64}
              style={{ objectFit: 'contain', transition: 'opacity 0.25s' }}
            />
          </div>
        </div>
      </div>

      {/* ── Today's prompt ────────────────────────────────────────── */}
      <div style={{
        background: typeStyle.bg,
        border: `1.5px solid ${typeStyle.border}`,
        borderRadius: 14, padding: '18px 20px', marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 18 }}>{typeStyle.emoji}</span>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
            textTransform: 'uppercase', color: typeStyle.text,
          }}>Today&apos;s prompt — {typeStyle.label}</span>
        </div>
        <p style={{
          fontSize: 17, fontWeight: 700, color: '#2C3E50',
          margin: 0, lineHeight: 1.45,
        }}>{prompt.text}</p>
      </div>

      {/* ── Writing area ──────────────────────────────────────────── */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start writing here… let your thoughts flow."
            disabled={submitted && !error}
            rows={6}
            style={{
              width: '100%', border: '1.5px solid #E0D8CC', borderRadius: 12,
              padding: '14px 16px', fontSize: 16, color: '#2C3E50',
              resize: 'none', outline: 'none', background: submitted && !error ? '#FAFAF8' : 'white',
              fontFamily: 'Georgia, serif', lineHeight: 1.8, boxSizing: 'border-box',
              transition: 'border-color 0.15s',
              minHeight: 180,
            }}
            onFocus={(e) => { e.target.style.borderColor = '#3B82F6'; }}
            onBlur={(e) => { e.target.style.borderColor = '#E0D8CC'; }}
          />
          <WordMeter count={wordCount} />
        </div>

        {!submitted && (
          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              width: '100%',
              background: canSubmit ? '#3B82F6' : '#BFDBFE',
              color: 'white', border: 'none', borderRadius: 10, padding: '14px',
              fontSize: 15, fontWeight: 700,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Reading your writing…' : 'Get feedback →'}
          </button>
        )}
      </form>

      {/* ── Loading bar ───────────────────────────────────────────── */}
      {loading && (
        <div style={{ marginTop: 16 }}>
          <div style={{ textAlign: 'center', fontSize: 13, color: '#7F8C8D', marginBottom: 8 }}>
            Reading your writing carefully…
          </div>
          <div style={{ height: 4, background: '#DBEAFE', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%', background: '#3B82F6', borderRadius: 2,
              animation: 'dwp-progress 1.8s ease-in-out infinite', width: '40%',
            }} />
          </div>
        </div>
      )}

      {/* ── Error ─────────────────────────────────────────────────── */}
      {error && (
        <div style={{
          background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 10,
          padding: '14px 16px', marginTop: 16, color: '#BE123C', fontSize: 14,
        }}>
          <strong>Oops!</strong> {error}
          <button onClick={handleWriteAgain} style={{
            display: 'block', marginTop: 10, background: '#3B82F6', color: 'white',
            border: 'none', borderRadius: 7, padding: '8px 16px', fontSize: 13,
            fontWeight: 700, cursor: 'pointer',
          }}>Try again</button>
        </div>
      )}

      {/* ── Feedback panel ────────────────────────────────────────── */}
      {result && !loading && (
        <div style={{
          background: 'white', border: '2px solid #3B82F6',
          borderRadius: 14, padding: '22px 24px', marginTop: 16,
          animation: 'dwp-fade 0.3s ease-out',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: '#EFF6FF', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 20, flexShrink: 0,
            }}>✨</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#2C3E50' }}>
                Here&apos;s what I noticed in your writing
              </div>
              <div style={{ fontSize: 12, color: '#7F8C8D' }}>
                {wordCount} words written today
              </div>
            </div>
          </div>

          {/* Feedback */}
          <p style={{
            fontSize: 15, color: '#2C3E50', lineHeight: 1.7,
            margin: '0 0 16px',
          }}>{result.feedback}</p>

          {/* Highlight */}
          <div style={{
            background: '#EFF6FF', borderRadius: 10, padding: '12px 16px',
            borderLeft: '4px solid #3B82F6', marginBottom: result.nudge ? 14 : 0,
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: '#1E40AF',
              textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4,
            }}>A moment I loved</div>
            <p style={{ fontSize: 14, color: '#1E3A8A', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
              &ldquo;{result.highlight}&rdquo;
            </p>
          </div>

          {/* Nudge */}
          {result.nudge && (
            <div style={{
              background: '#FFFBEB', borderRadius: 10, padding: '12px 16px',
              border: '1px solid #FDE68A', marginTop: 14,
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 17, flexShrink: 0 }}>💭</span>
              <div>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: '#92400E',
                  textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3,
                }}>Something to think about</div>
                <p style={{ fontSize: 13, color: '#78350F', margin: 0, lineHeight: 1.55 }}>
                  {result.nudge}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button
              onClick={handleWriteAgain}
              style={{
                flex: 1, background: '#3B82F6', color: 'white', border: 'none',
                borderRadius: 9, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >
              ✍️ Write again
            </button>
            <a
              href="/dashboard"
              style={{
                flex: 1, background: 'white', color: '#2C3E50',
                border: '1.5px solid #E0D8CC', borderRadius: 9, padding: '12px',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              Back to tools
            </a>
          </div>
        </div>
      )}

      <style>{`
        @keyframes dwp-progress {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
        @keyframes dwp-fade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
