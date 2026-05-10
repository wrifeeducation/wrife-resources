'use client';

import { useState } from 'react';
import type { EditingMode, EditingDoctorResponse } from '@/app/api/tools/editing-doctor/route';

const EDITING_MODES: { id: EditingMode; label: string; icon: string; desc: string; lesson: number }[] = [
  { id: 'punctuation',      label: 'Punctuation',     icon: '❝',  desc: 'Full stops, commas, apostrophes, speech marks',  lesson: 42 },
  { id: 'grammar',          label: 'Grammar',          icon: '📐', desc: 'Verb tense, subject-verb agreement, word order', lesson: 43 },
  { id: 'vocabulary',       label: 'Vocabulary',       icon: '🔤', desc: 'Word range, precision, avoiding repetition',    lesson: 44 },
  { id: 'cohesion',         label: 'Cohesion',         icon: '🔗', desc: 'Connectives, referencing, flow between ideas',  lesson: 45 },
  { id: 'sentence-variety', label: 'Sentence Variety', icon: '〰️', desc: 'Short/long mix, openers, rhythm',              lesson: 46 },
  { id: 'paragraphing',     label: 'Paragraphing',     icon: '📄', desc: 'Structure, topic focus, transitions',           lesson: 47 },
  { id: 'clarity',          label: 'Clarity',          icon: '💡', desc: 'Clear meaning, avoiding ambiguity',             lesson: 48 },
  { id: 'word-choice',      label: 'Word Choice',      icon: '🎯', desc: 'Precise, powerful, audience-appropriate words', lesson: 49 },
  { id: 'spelling',         label: 'Spelling',         icon: '✅', desc: 'Common errors, phonics, homophones',            lesson: 50 },
  { id: 'style',            label: 'Style & Voice',    icon: '✨', desc: 'Tone, persona, individual voice',               lesson: 51 },
];

function ScoreDots({ score }: { score: number }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className={`w-4 h-4 rounded-full border-2 transition-colors ${
            n <= score ? 'bg-purple-500 border-purple-500' : 'bg-white border-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

const SCORE_META: Record<number, { label: string; colour: string }> = {
  1: { label: 'Needs work',    colour: 'text-red-600' },
  2: { label: 'Getting there', colour: 'text-orange-500' },
  3: { label: 'On track',      colour: 'text-yellow-600' },
  4: { label: 'Good',          colour: 'text-green-600' },
  5: { label: 'Excellent',     colour: 'text-emerald-600' },
};

export default function EditingDoctorPage() {
  const [selectedMode, setSelectedMode] = useState<EditingMode | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EditingDoctorResponse | null>(null);
  const [error, setError] = useState('');

  const modeInfo = EDITING_MODES.find((m) => m.id === selectedMode);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMode) { setError('Please choose an editing dimension first.'); return; }
    if (!text.trim()) { setError('Please enter your writing.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/tools/editing-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode: selectedMode }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong.'); return; }
      setResult(data);
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError('');
    setSelectedMode(null);
    setText('');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🩺</div>
          <h1 className="text-3xl font-bold text-purple-800 mb-2">Editing Doctor</h1>
          <p className="text-gray-600">
            Choose one editing focus, paste your writing, and get a targeted diagnosis.
          </p>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Mode selector */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
              <h2 className="text-base font-semibold text-gray-700 mb-4">
                1. Choose your editing focus
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {EDITING_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSelectedMode(mode.id)}
                    className={`text-left p-3 rounded-xl border-2 transition-all ${
                      selectedMode === mode.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-lg leading-none">{mode.icon}</span>
                      <span className="font-semibold text-sm text-gray-800">{mode.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-snug pl-7">{mode.desc}</p>
                    <span className="inline-block mt-1 pl-7 text-xs text-purple-400 font-medium">
                      L{mode.lesson}
                    </span>
                  </button>
                ))}
              </div>
              {selectedMode && (
                <div className="mt-3 p-3 bg-purple-100 rounded-lg text-sm text-purple-800 font-medium">
                  Focus: {modeInfo?.icon} {modeInfo?.label} — {modeInfo?.desc}
                </div>
              )}
            </div>

            {/* Text input */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
              <h2 className="text-base font-semibold text-gray-700 mb-3">
                2. Paste your writing
              </h2>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type your writing here — at least a couple of sentences…"
                className="w-full h-44 p-4 border-2 border-gray-200 rounded-xl text-base resize-none focus:outline-none focus:border-purple-400 transition-colors"
              />
              <p className="text-xs text-gray-400 mt-1">
                {text.trim().split(/\s+/).filter(Boolean).length} words
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedMode}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-lg rounded-2xl transition-colors shadow-sm"
            >
              {loading ? '🩺 Diagnosing…' : 'Diagnose my writing →'}
            </button>
          </form>

        ) : (
          <div className="space-y-5">

            {/* Mode badge */}
            <div className="text-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                {modeInfo?.icon} {modeInfo?.label} diagnosis
              </span>
            </div>

            {/* Score card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Score</p>
                  <ScoreDots score={result.score} />
                </div>
                <div className="text-right">
                  <span className="text-5xl font-bold text-purple-700">{result.score}</span>
                  <span className="text-gray-400 text-xl">/5</span>
                  <p className={`text-sm font-semibold mt-1 ${SCORE_META[result.score]?.colour ?? 'text-gray-600'}`}>
                    {SCORE_META[result.score]?.label}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{result.diagnosis}</p>
            </div>

            {/* Praise */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <p className="text-sm font-semibold text-green-700 mb-1">⭐ What you did well</p>
              <p className="text-gray-700">{result.praise}</p>
            </div>

            {/* Issues */}
            {result.issues && result.issues.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
                <h3 className="font-semibold text-gray-700 mb-4">
                  🔍 {result.issues.length} issue{result.issues.length !== 1 ? 's' : ''} to fix
                </h3>
                <div className="space-y-4">
                  {result.issues.map((issue, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                      <div className="bg-red-50 px-4 py-3 border-b border-gray-100">
                        <p className="text-xs text-red-500 font-semibold uppercase tracking-wide mb-1">Original</p>
                        <p className="text-gray-800 italic">&ldquo;{issue.original}&rdquo;</p>
                      </div>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">Issue</p>
                        <p className="text-gray-700 text-sm">{issue.issue}</p>
                      </div>
                      <div className="bg-green-50 px-4 py-3">
                        <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-1">Fix</p>
                        <p className="text-gray-700 text-sm">{issue.fix}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.score >= 4 && (!result.issues || result.issues.length === 0) && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
                <p className="text-emerald-700 font-semibold text-lg">🎉 No issues found — great work!</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => { setResult(null); setError(''); }}
                className="flex-1 py-3 border-2 border-purple-300 text-purple-700 font-semibold rounded-xl hover:bg-purple-50 transition-colors"
              >
                Same text, new focus
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
              >
                Start again
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
