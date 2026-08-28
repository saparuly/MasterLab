import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, ChevronRight, Tag } from 'lucide-react';
import { searchCurriculum } from '../data/curriculum';

export default function QuickSearchModal({ isOpen, onClose, onSelectChapter }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
    } else {
      setResults(searchCurriculum(query));
    }
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '600px', padding: '1.25rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="search-modal-input-wrapper">
          <Search size={20} color="var(--primary)" />
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder="Cari materi, topik (e.g. Bluepad32, PWM, ADC2, RC Car)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {results.length > 0 ? (
          <div className="search-results-list">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              Ditemukan {results.length} Materi:
            </span>
            {results.map((item) => (
              <div
                key={item.id}
                className="search-result-item"
                onClick={() => {
                  onSelectChapter(item.id);
                  onClose();
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: item.moduleColor || 'var(--primary)', fontWeight: 600 }}>
                    {item.moduleShortTitle || item.moduleTitle}
                  </span>
                  <ChevronRight size={14} color="var(--text-muted)" />
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  {item.title}
                </div>
                {item.subtitle && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {item.subtitle}
                  </div>
                )}
                {item.tags && (
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                    {item.tags.slice(0, 3).map((t, idx) => (
                      <span key={idx} style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : query.trim() !== '' ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
            <p>Tidak ditemukan materi dengan kata kunci "{query}"</p>
          </div>
        ) : (
          <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <p style={{ margin: 0 }}>💡 Tips: Ketik nama library, controller, atau konsep hardware untuk mencari.</p>
          </div>
        )}
      </div>
    </div>
  );
}
