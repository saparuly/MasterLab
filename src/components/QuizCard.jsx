import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { HelpCircle, CheckCircle2, XCircle } from 'lucide-react';

export default function QuizCard({ question, options = [], correctIndex = 0, explanation = '' }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);

    if (idx === correctIndex) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  const isCorrect = selectedIdx === correctIndex;

  return (
    <div className="quiz-box">
      <div className="quiz-header">
        <HelpCircle size={20} />
        <span>Kuis Pemahaman Materi</span>
      </div>

      <p style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
        {question}
      </p>

      <div className="quiz-options">
        {options.map((option, idx) => {
          let btnClass = '';
          if (isAnswered) {
            if (idx === correctIndex) btnClass = 'correct';
            else if (idx === selectedIdx) btnClass = 'incorrect';
          }

          return (
            <button
              key={idx}
              className={`quiz-option-btn ${btnClass}`}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--bg-main)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {String.fromCharCode(65 + idx)}
              </div>
              <span style={{ flex: 1 }}>{option}</span>
              {isAnswered && idx === correctIndex && (
                <CheckCircle2 size={18} color="var(--success)" />
              )}
              {isAnswered && idx === selectedIdx && idx !== correctIndex && (
                <XCircle size={18} color="var(--danger)" />
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div
          className="quiz-feedback"
          style={{
            background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'}`,
            color: isCorrect ? 'var(--success)' : 'var(--danger)',
          }}
        >
          <strong>{isCorrect ? '🎉 Benar sekali!' : '❌ Belum tepat!'}</strong>
          {explanation && <p style={{ margin: '0.35rem 0 0 0', color: 'var(--text-secondary)' }}>{explanation}</p>}
        </div>
      )}
    </div>
  );
}
