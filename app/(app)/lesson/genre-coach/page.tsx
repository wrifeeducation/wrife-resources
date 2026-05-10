'use client';

import { useState } from 'react';
import type { Genre, GenreCoachResponse } from '@/app/api/tools/genre-coach/route';

const GENRES: { id: Genre; label: string; icon: string; desc: string }[] = [
  { id: 'narrative',   label: 'Narrative',   icon: '📖', desc: 'Stories, characters, plot, setting, dialogue' },
  { id: 'non-fiction', label: 'Non-Fiction', icon: '📰', desc: 'Facts, explanation, report, information' },
  { id: 'persuasive',  label: 'Persuasive',  icon: '📣', desc: 'Argument, opinion, rhetoric, evidence' },
  { id: 'poetry',      label: 'Poetry',      icon: '🎭', desc: 'Imagery, rhythm, sound, emotion, form' },
];

function ScoreBar({ score }: { score: number }) {
  const pct = (score / 5) * 100;
  const colour =
    score <= 2 ? 'bg-red-400' : score === 3 ? 'bg-yellow-400' : 'bg-green-500';
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colour}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-lg font-bold text-gray-700 w-8 text-right">{score}/5</span>
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

export default function GenreCoachPage() {
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [paragraph, setParagraph] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenreCoachResponse | null>(null);
  const [error, setError] = useState('');

  const genreInfo = GENRES.find((g) => g.id === selectedGenre);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedGenre) { setError('Please choose a genre first.'); return; }
    if (!paragraph.trim()) { setError('Please enter your paragraph.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/tools/genre-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paragraph, genre: selectedGenre }),
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
    setSelectedGenre(null);
    setParagraph('');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎭</div>
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Genre Coach</h1>
          <p className="text-gray-600">
            Choose a genre, paste your paragraph, and see how well it matches the conventions.
          </p>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Genre selector */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
              <h2 className="text-base font-semibold text-gray-700 mb-4">
                1. Choose your genre
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {GENRES.map((genre) => (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() => setSelectedGenre(genre.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      selectedGenre === genre.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{genre.icon}</div>
                    <div className="font-semibold text-gray-800 mb-1">{genre.label}</div>
                    <p className="text-xs text-gray-500">{genre.desc}</p>
                  </button>
                ))}
              </div>
              {selectedGenre && (
                <div className="mt-3 p-3 bg-blue-100 rounded-lg text-sm text-blue-800 font-medium">
                  Checking for: {genreInfo?.icon} {genreInfo?.label} conventions
                </div>
              )}
            </div>

            {/* Paragraph input */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
              <h2 className="text-base font-semibold text-gray-700 mb-3">
                2. Paste your paragraph
              </h2>
              <textarea
                value={paragraph}
                onChange={(e) => setParagraph(e.target.value)}
                placeholder="Paste or type your paragraph here — at least a couple of sentences…"
                className="w-full h-44 p-4 border-2 border-gray-200 rounded-xl text-base resize-none focus:outline-none focus:border-blue-400 transition-colors"
              />
              <p className="text-xs text-gray-400 mt-1">
                {paragraph.trim().split(/\s+/).filter(Boolean).length} words
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedGenre}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-lg rounded-2xl transition-colors shadow-sm"
            >
              {loading ? '🎭 Coaching…' : 'Coach my writing →'}
            </button>
          </form>

        ) : (
          <div className="space-y-5">

            {/* Genre badge */}
            <div className="text-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                {genreInfo?.icon} {genreInfo?.label} coaching
              </span>
            </div>

            {/* Score card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Genre match</p>
                  <p className={`text-sm font-semibold ${SCORE_META[result.score]?.colour ?? 'text-gray-600'}`}>
                    {SCORE_META[result.score]?.label}
                  </p>
                </div>
                <ScoreBar score={result.score} />
              </div>
              <p className="text-gray-700 leading-relaxed">{result.assessment}</p>
            </div>

            {/* Genre features */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
              <h3 className="font-semibold text-gray-700 mb-4">📋 Genre features checklist</h3>
              <div className="space-y-3">
                {result.features.map((feat, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 p-3 rounded-xl ${
                      feat.found ? 'bg-green-50 border border-green-100' : 'bg-amber-50 border border-amber-100'
                    }`}
                  >
                    <span className="text-lg flex-shrink-0 mt-0.5">
                      {feat.found ? '✅' : '⭕'}
                    </span>
                    <div>
                      <p className={`text-sm font-semibold ${feat.found ? 'text-green-800' : 'text-amber-800'}`}>
                        {feat.feature}
                      </p>
                      {feat.example && (
                        <p className="text-xs text-gray-600 mt-0.5 italic">{feat.example}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Praise */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <p className="text-sm font-semibold text-green-700 mb-1">⭐ What worked well</p>
              <p className="text-gray-700">{result.praise}</p>
            </div>

            {/* Top tip */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="text-sm font-semibold text-amber-700 mb-1">💡 Top genre tip</p>
              <p className="text-gray-700">{result.topTip}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => { setResult(null); setError(''); }}
                className="flex-1 py-3 border-2 border-blue-300 text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
              >
                Same text, new genre
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
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
