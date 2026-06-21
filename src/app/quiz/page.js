'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QUESTIONS } from '@/lib/data';
import { scoreToCode } from '@/lib/scoring';

export default function QuizPage() {
  const router = useRouter();
  const total = QUESTIONS.length;
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);

  const q = QUESTIONS[idx];

  function choose(opt) {
    const next = [
      ...answers.slice(0, idx),
      { axis: opt.axis, pole: opt.pole, weight: opt.weight },
    ];
    if (idx + 1 < total) {
      setAnswers(next);
      setIdx(idx + 1);
    } else {
      const code = scoreToCode(next);
      router.push(`/r/${code}/`);
    }
  }

  function back() {
    if (idx === 0) {
      router.push('/');
    } else {
      setIdx(idx - 1);
    }
  }

  const pct = Math.round((idx / total) * 100);

  return (
    <main className="screen quiz">
      <div className="progress-wrap">
        <div className="progress-meta">
          <span>Q{idx + 1}</span>
          <span>
            {idx + 1} / {total}
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <h2 className="q-text">{q.q}</h2>

      <div className="options">
        {q.options.map((opt, i) => (
          <button key={i} className="option" onClick={() => choose(opt)}>
            {opt.text}
          </button>
        ))}
      </div>

      <button className="q-back" onClick={back}>
        ← 이전
      </button>
    </main>
  );
}
