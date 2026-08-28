import React, { useState } from 'react';
import { 
  Gamepad2, 
  Cpu, 
  Wifi, 
  ChevronDown, 
  ChevronRight, 
  Check, 
  BookOpen, 
  Flame, 
  HelpCircle,
  PlusCircle
} from 'lucide-react';

const ICON_MAP = {
  Gamepad2: Gamepad2,
  Cpu: Cpu,
  Wifi: Wifi,
};

export default function Sidebar({
  modules = [],
  activeChapterId,
  onSelectChapter,
  completedLessons = [],
  onToggleComplete,
  mobileOpen = false,
  onOpenAddGuide,
}) {
  // State accordion open/close per module
  const [openModules, setOpenModules] = useState(() => {
    const init = {};
    modules.forEach((m) => {
      init[m.id] = true; // Open all by default
    });
    return init;
  });

  const toggleModule = (modId) => {
    setOpenModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  return (
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-section-title">Kurikulum Pembelajaran</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {modules.map((mod) => {
          const IconComp = ICON_MAP[mod.icon] || BookOpen;
          const isOpen = openModules[mod.id];
          const completedInMod = mod.chapters.filter((ch) =>
            completedLessons.includes(ch.id)
          ).length;

          return (
            <div key={mod.id} className="module-card">
              {/* Module Header */}
              <div
                className={`module-header ${
                  mod.chapters.some((c) => c.id === activeChapterId) ? 'active-module' : ''
                }`}
                onClick={() => toggleModule(mod.id)}
              >
                <div className="module-title-group">
                  <IconComp size={18} color={mod.color || 'var(--primary)'} />
                  <span title={mod.title}>{mod.shortTitle || mod.title}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: completedInMod === mod.chapters.length ? 'var(--success)' : 'var(--text-muted)',
                      fontWeight: 600,
                    }}
                  >
                    {completedInMod}/{mod.chapters.length}
                  </span>
                  {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>
              </div>

              {/* Chapters list */}
              {isOpen && (
                <ul className="chapter-list">
                  {mod.chapters.map((chap, idx) => {
                    const isActive = chap.id === activeChapterId;
                    const isDone = completedLessons.includes(chap.id);

                    return (
                      <li key={chap.id}>
                        <div
                          className={`chapter-item ${isActive ? 'active' : ''}`}
                          onClick={() => onSelectChapter(chap.id)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: 0 }}>
                            <div
                              className={`chapter-check-icon ${isDone ? 'completed' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleComplete(chap.id);
                              }}
                              title={isDone ? 'Tandai belum selesai' : 'Tandai selesai'}
                            >
                              {isDone && <Check size={11} strokeWidth={3} />}
                            </div>

                            <span
                              style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontSize: '0.84rem',
                              }}
                              title={chap.title}
                            >
                              {chap.title}
                            </span>
                          </div>

                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                            {chap.readingTime}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* Contributor / Add Material Box */}
      <div className="contributor-box">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.35rem' }}>
          <Flame size={16} />
          <span>Tambah Materi Baru</span>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Ingin menambah materi ESP32 atau sensor lainnya? Struktur materi dibuat berbasis modul Javascript yang sangat fleksibel.
        </p>
        <button
          className="btn btn-outline-cyan"
          style={{ width: '100%', fontSize: '0.8rem', padding: '0.4rem' }}
          onClick={onOpenAddGuide}
        >
          <PlusCircle size={14} />
          <span>Cara Tambah Materi</span>
        </button>
      </div>
    </aside>
  );
}
