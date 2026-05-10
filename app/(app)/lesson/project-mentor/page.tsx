'use client';

import { useState } from 'react';
import type { ProjectStage, ProjectMentorResponse } from '@/app/api/tools/project-mentor/route';

const PROJECT_STAGES: { id: ProjectStage; label: string; icon: string; desc: string }[] = [
  { id: 'idea',       label: 'Idea Stage',     icon: '💡', desc: "I have an idea but haven't started planning yet" },
  { id: 'planning',   label: 'Planning',       icon: '🗺️', desc: "I'm planning my structure and content" },
  { id: 'drafting',   label: 'Drafting',       icon: '✏️', desc: "I'm writing my first draft" },
  { id: 'editing',    label: 'Editing',        icon: '🔍', desc: "I'm improving and refining my writing" },
  { id: 'publishing', label: 'Nearly Finished', icon: '🏆', desc: "I'm polishing and getting ready to share" },
];

export default function ProjectMentorPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stage, setStage] = useState<ProjectStage | null>(null);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProjectMentorResponse | null>(null);
  const [error, setError] = useState('');

  const stageInfo = PROJECT_STAGES.find((s) => s.id === stage);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError('Please give your project a title.'); return; }
    if (!description.trim()) { setError('Please describe what your project is about.'); return; }
    if (!stage) { setError('Please choose your current stage.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/tools/project-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, stage, question: question.trim() || undefined }),
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
    setTitle('');
    setDescription('');
    setStage(null);
    setQuestion('');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎓</div>
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">Project Mentor</h1>
          <p className="text-gray-600">
            Tell me about your writing project and I'll give you personalised advice.
          </p>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Project details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
              <h2 className="text-base font-semibold text-gray-700 mb-4">
                1. Your project
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Project title or working title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. The Dragon's Cave, My Holiday Report, Why We Should Recycle…"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    What is your project about?
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your project in your own words — what is it about, who is it for, what happens or what are you arguing?"
                    className="w-full h-28 px-4 py-3 border-2 border-gray-200 rounded-xl text-base resize-none focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Stage selector */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
              <h2 className="text-base font-semibold text-gray-700 mb-4">
                2. Where are you right now?
              </h2>
              <div className="space-y-2">
                {PROJECT_STAGES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStage(s.id)}
                    className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      stage === s.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0">{s.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-800">{s.label}</p>
                      <p className="text-xs text-gray-500">{s.desc}</p>
                    </div>
                    {stage === s.id && (
                      <span className="ml-auto text-emerald-600 font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional question */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
              <h2 className="text-base font-semibold text-gray-700 mb-1">
                3. Got a specific question? <span className="text-gray-400 font-normal">(optional)</span>
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                Ask anything that's puzzling you — I'll answer it directly.
              </p>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. How do I write a good opening? How can I make my ending more powerful?"
                className="w-full h-20 px-4 py-3 border-2 border-gray-200 rounded-xl text-base resize-none focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !stage}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-lg rounded-2xl transition-colors shadow-sm"
            >
              {loading ? '🎓 Mentoring…' : 'Get mentoring →'}
            </button>
          </form>

        ) : (
          <div className="space-y-5">

            {/* Project + stage badge */}
            <div className="text-center space-y-1">
              <p className="text-lg font-bold text-emerald-800">&ldquo;{title}&rdquo;</p>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                {stageInfo?.icon} {stageInfo?.label}
              </span>
            </div>

            {/* Encouragement */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
              <p className="text-gray-700 text-base leading-relaxed">{result.encouragement}</p>
            </div>

            {/* Stage advice */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
              <h3 className="font-semibold text-gray-700 mb-3">
                {stageInfo?.icon} {stageInfo?.label} advice
              </h3>
              <p className="text-gray-700 leading-relaxed">{result.stageAdvice}</p>
            </div>

            {/* Next steps */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
              <h3 className="font-semibold text-gray-700 mb-4">🗒️ Your next 3 steps</h3>
              <div className="space-y-3">
                {result.nextSteps.map((ns, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{ns.step}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{ns.why}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key question */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="text-sm font-semibold text-amber-700 mb-1">🤔 Think about this</p>
              <p className="text-gray-700 italic">{result.keyQuestion}</p>
            </div>

            {/* Answer to specific question */}
            {result.answerToQuestion && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <p className="text-sm font-semibold text-blue-700 mb-1">💬 Answer to your question</p>
                <p className="text-gray-700">{result.answerToQuestion}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => { setResult(null); setError(''); }}
                className="flex-1 py-3 border-2 border-emerald-300 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
              >
                Update my project
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
              >
                New project
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
