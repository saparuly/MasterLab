import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-arduino';
import 'prismjs/components/prism-clike';
import { Copy, Check, Download, Info, Terminal } from 'lucide-react';

export default function CodeBlock({ language = 'cpp', filename = 'sketch.ino', code = '', explanation }) {
  const [copied, setCopied] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="code-block-container">
      <div className="code-header">
        <div className="code-title-group">
          <Terminal size={16} color="var(--primary)" />
          <span>{filename}</span>
          <span className="badge badge-cyan" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>
            {language.toUpperCase()}
          </span>
        </div>
        <div className="code-actions">
          {explanation && (
            <button
              className="code-action-btn"
              onClick={() => setShowExplanation(!showExplanation)}
              title="Penjelasan Kode"
            >
              <Info size={14} />
              <span>{showExplanation ? 'Tutup Info' : 'Penjelasan'}</span>
            </button>
          )}
          <button className="code-action-btn" onClick={handleDownload} title="Unduh File .ino">
            <Download size={14} />
            <span>Unduh</span>
          </button>
          <button className="code-action-btn" onClick={handleCopy} title="Salin Kode">
            {copied ? (
              <>
                <Check size={14} color="var(--success)" />
                <span style={{ color: 'var(--success)' }}>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Salin</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showExplanation && explanation && (
        <div
          style={{
            padding: '0.75rem 1.25rem',
            background: 'rgba(0, 242, 254, 0.07)',
            borderBottom: '1px solid var(--border-color)',
            fontSize: '0.85rem',
            color: 'var(--text-primary)',
          }}
        >
          💡 <strong>Catatan Teknis:</strong> {explanation}
        </div>
      )}

      <div className="code-body">
        <pre>
          <code className={`language-${language}`}>{code.trim()}</code>
        </pre>
      </div>
    </div>
  );
}
