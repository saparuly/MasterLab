import React from 'react';
import confetti from 'canvas-confetti';
import { 
  Clock, 
  Tag, 
  Layers, 
  CheckCircle2, 
  Bookmark, 
  ArrowLeft, 
  ArrowRight, 
  Wrench, 
  Sparkles,
  Award
} from 'lucide-react';

import CodeBlock from './CodeBlock';
import Callout from './Callout';
import WiringDiagram from './WiringDiagram';
import GamepadVisualizer from './GamepadVisualizer';
import PinoutExplorer from './PinoutExplorer';
import QuizCard from './QuizCard';

export default function ArticleViewer({
  chapter,
  isCompleted,
  isBookmarked,
  onToggleComplete,
  onToggleBookmark,
  prevChapter,
  nextChapter,
  onNavigate,
}) {
  if (!chapter) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Pilih materi dari kurikulum di sidebar untuk mulai belajar.</h2>
      </div>
    );
  }

  const handleCompleteWithCelebration = () => {
    if (!isCompleted) {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
    onToggleComplete(chapter.id);
  };

  return (
    <article className="animate-fade-in">
      {/* Header Banner */}
      <header className="article-header">
        <div className="article-breadcrumb">
          <span style={{ color: chapter.moduleColor || 'var(--primary)', fontWeight: 600 }}>
            {chapter.moduleTitle}
          </span>
          <span>/</span>
          <span>Bab {chapter.currentIndex || 1}</span>
        </div>

        <h1>{chapter.title}</h1>

        {chapter.subtitle && (
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {chapter.subtitle}
          </p>
        )}

        <div className="article-meta">
          <div className="meta-item">
            <Clock size={15} color="var(--primary)" />
            <span>{chapter.readingTime} baca</span>
          </div>

          <div className="meta-item">
            <span className="badge badge-purple">{chapter.level}</span>
          </div>

          {chapter.tags && (
            <div className="meta-item" style={{ gap: '0.4rem' }}>
              <Tag size={15} color="var(--text-muted)" />
              {chapter.tags.map((t, i) => (
                <span key={i} style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
            <button
              className={`btn ${isCompleted ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.84rem', padding: '0.4rem 0.8rem' }}
              onClick={handleCompleteWithCelebration}
            >
              <CheckCircle2 size={15} />
              <span>{isCompleted ? 'Selesai Dipelajari' : 'Tandai Selesai'}</span>
            </button>

            <button
              className={`btn-icon ${isBookmarked ? 'active' : ''}`}
              onClick={() => onToggleBookmark(chapter.id)}
              title={isBookmarked ? 'Hapus Simpanan' : 'Simpan Materi Ini'}
            >
              <Bookmark size={16} color={isBookmarked ? 'var(--primary)' : 'currentColor'} />
            </button>
          </div>
        </div>

        {/* Hardware Chips if available */}
        {chapter.hardwareNeeded && chapter.hardwareNeeded.length > 0 && (
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Wrench size={13} />
              <span>Hardware yang Diperlukan:</span>
            </div>
            <div className="hardware-chips">
              {chapter.hardwareNeeded.map((hw, idx) => (
                <div key={idx} className="hardware-chip">
                  <span>⚡</span>
                  <span>{hw}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Dynamic Sections Renderer */}
      <div className="article-body">
        {chapter.sections &&
          chapter.sections.map((section, idx) => {
            switch (section.type) {
              case 'heading': {
                const HeadingTag = section.level === 3 ? 'h3' : 'h2';
                return <HeadingTag key={idx}>{section.text}</HeadingTag>;
              }

              case 'paragraph':
                return (
                  <p
                    key={idx}
                    dangerouslySetInnerHTML={{
                      __html: section.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/`([^`]+)`/g, '<code>$1</code>'),
                    }}
                  />
                );

              case 'code':
                return (
                  <CodeBlock
                    key={idx}
                    language={section.language}
                    filename={section.filename}
                    code={section.code}
                    explanation={section.explanation}
                  />
                );

              case 'callout':
                return (
                  <Callout
                    key={idx}
                    variant={section.variant}
                    title={section.title}
                    text={section.text}
                  />
                );

              case 'wiring':
                return (
                  <WiringDiagram
                    key={idx}
                    pins={section.pins}
                    notes={section.notes}
                  />
                );

              case 'gamepad-visualizer':
                return <GamepadVisualizer key={idx} />;

              case 'pinout-explorer':
                return <PinoutExplorer key={idx} />;

              case 'steps':
                return (
                  <div key={idx} style={{ margin: '1.5rem 0' }}>
                    {section.steps.map((st, stepIdx) => (
                      <div key={stepIdx} className="step-container">
                        <div className="step-marker">{stepIdx + 1}</div>
                        <div className="step-content">
                          <h3 style={{ margin: 0 }}>{st.title}</h3>
                          <p style={{ marginTop: '0.35rem' }}>{st.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                );

              case 'quiz':
                return (
                  <QuizCard
                    key={idx}
                    question={section.question}
                    options={section.options}
                    correctIndex={section.correctIndex}
                    explanation={section.explanation}
                  />
                );

              default:
                return null;
            }
          })}
      </div>

      {/* Completion Banner at end of lesson */}
      <div
        style={{
          marginTop: '3.5rem',
          padding: '1.75rem',
          background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.08), rgba(157, 78, 221, 0.1))',
          border: '1px solid var(--border-highlight)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="logo-icon-box" style={{ width: 44, height: 44 }}>
            <Award size={24} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>
              {isCompleted ? 'Kamu telah menyelesaikan bab ini!' : 'Selesai membaca dan mempraktikkan?'}
            </h4>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Tandai bab ini untuk menyimpan progres belajarmu di browser.
            </span>
          </div>
        </div>

        <button
          className={`btn ${isCompleted ? 'btn-secondary' : 'btn-primary'}`}
          onClick={handleCompleteWithCelebration}
        >
          <CheckCircle2 size={16} />
          <span>{isCompleted ? 'Batalkan Status Selesai' : 'Tandai Bab Selesai'}</span>
        </button>
      </div>

      {/* Footer Navigation (Previous / Next Chapter) */}
      <footer className="article-footer-nav">
        {prevChapter ? (
          <button
            className="btn btn-secondary"
            onClick={() => onNavigate(prevChapter.id)}
            style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <ArrowLeft size={18} />
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Sebelumnya
              </div>
              <div style={{ fontWeight: 600 }}>{prevChapter.title}</div>
            </div>
          </button>
        ) : (
          <div />
        )}

        {nextChapter && (
          <button
            className="btn btn-primary"
            onClick={() => onNavigate(nextChapter.id)}
            style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(11, 15, 25, 0.7)', textTransform: 'uppercase', fontWeight: 700 }}>
                Selanjutnya
              </div>
              <div style={{ fontWeight: 700 }}>{nextChapter.title}</div>
            </div>
            <ArrowRight size={18} />
          </button>
        )}
      </footer>
    </article>
  );
}
