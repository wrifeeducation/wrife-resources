import Link from 'next/link';
import {
  PenLine, BookOpen, Layers, Star, Stethoscope,
  Compass, FlaskConical, Rocket, Search, ArrowRight, CheckCircle2,
} from 'lucide-react';

const tools = [
  { icon: PenLine,      name: 'PWP Practice',           tag: 'Daily' },
  { icon: BookOpen,     name: 'Daily Writing Practice',  tag: 'Daily' },
  { icon: Layers,       name: 'Connect Grid Tutor',      tag: 'Lessons 27–38' },
  { icon: Star,         name: 'Sentence Quality Coach',  tag: 'Lessons 11–25' },
  { icon: Search,       name: 'Story Type Identifier',   tag: 'Lesson 31' },
  { icon: FlaskConical, name: 'Composition Reviewer',    tag: 'Lessons 39–41' },
  { icon: Stethoscope,  name: 'Editing Doctor',          tag: 'Lessons 42–51' },
  { icon: Compass,      name: 'Genre Coach',             tag: 'Lessons 52–62' },
  { icon: Rocket,       name: 'Project Mentor',          tag: 'Lessons 63–67' },
];

const benefits = [
  'Feedback aligned to every WriFe lesson, L1 to L67',
  'Pupils get the coach, teachers get the time back',
  'Warm, specific, never discouraging — built for primary schools',
  'Works alongside your existing class, no setup needed',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-wrife-cream">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-wrife-green flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-wrife-text text-lg">
            WriFe <span className="text-wrife-green font-normal text-sm">Resources</span>
          </span>
        </div>
        <a
          href="https://app.wrife.co.uk/login"
          className="btn-primary text-sm py-2 px-5"
        >
          Sign in
        </a>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
        <p className="inline-block bg-green-100 text-green-700 text-sm font-medium
                      px-3 py-1 rounded-full mb-6">
          Part of the WriFe curriculum platform
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-wrife-text mb-6 leading-tight">
          Nine AI tools that give every pupil{' '}
          <span className="text-wrife-green">the writing coach</span>{' '}
          they deserve
        </h1>
        <p className="text-lg text-wrife-muted mb-10 max-w-2xl mx-auto">
          Real-time, individualised feedback aligned to every WriFe lesson.
          The feedback that would otherwise need teacher one-to-one time with thirty children.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="https://app.wrife.co.uk/login" className="btn-primary flex items-center justify-center gap-2">
            Access tools <ArrowRight className="w-4 h-4" />
          </a>
          <a href="https://wrife.co.uk/pricing" className="btn-secondary text-center">
            View plans
          </a>
        </div>
      </section>

      {/* Tool grid */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-center text-wrife-text mb-10">
          Everything in one place
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map(({ icon: Icon, name, tag }) => (
            <div key={name} className="wrife-card flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-wrife-cream-dark flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-wrife-green" />
              </div>
              <div>
                <p className="font-medium text-wrife-text text-sm">{name}</p>
                <p className="text-xs text-wrife-muted">{tag}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-wrife-text mb-10">
            Built for how teachers actually teach
          </h2>
          <ul className="space-y-4">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-wrife-green mt-0.5 flex-shrink-0" />
                <p className="text-wrife-text">{b}</p>
              </li>
            ))}
          </ul>

          <div className="mt-12 text-center">
            <a href="https://app.wrife.co.uk/login" className="btn-primary inline-flex items-center gap-2">
              Get started — it's free to explore <ArrowRight className="w-4 h-4" />
            </a>
            <p className="text-xs text-wrife-muted mt-3">
              Full Teacher plan required to use AI tools. Sign in to your WriFe account.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-wrife-cream-dark py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-wrife-muted">
          <p>© 2026 WriFe Education Ltd · <a href="https://wrife.co.uk" className="hover:underline">wrife.co.uk</a></p>
        </div>
      </footer>
    </div>
  );
}
