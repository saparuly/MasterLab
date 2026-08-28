import React from 'react';
import { 
  Bot, 
  Search, 
  Sun, 
  Moon, 
  PlusCircle, 
  Menu, 
  X, 
  CheckCircle2, 
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function Navbar({
  theme,
  onToggleTheme,
  onOpenSearch,
  onOpenAddGuide,
  completedCount,
  totalChapters,
  mobileSidebarOpen,
  onToggleMobileSidebar,
}) {
  const percent = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0;

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Left: Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="btn-icon"
            style={{ display: 'none' }}
            onClick={onToggleMobileSidebar}
            id="mobile-menu-btn"
          >
            {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="brand-logo">
            <div className="logo-icon-box">
              <Bot size={22} />
            </div>
            <div className="brand-info">
              <span className="brand-title">ESP32 MasterLab</span>
              <span className="brand-subtitle">Modul Belajar Arduino, Bluepad32 & IoT</span>
            </div>
          </div>
        </div>

        {/* Center: Search Trigger */}
        <div className="nav-actions">
          <button className="search-trigger-btn" onClick={onOpenSearch}>
            <Search size={15} />
            <span>Cari materi...</span>
            <kbd className="kbd-shortcut">⌘K</kbd>
          </button>

          {/* Progress Pill */}
          <div className="progress-pill" title={`${completedCount} dari ${totalChapters} bab diselesaikan`}>
            <CheckCircle2 size={15} color="var(--success)" />
            <span>{percent}%</span>
            <div className="progress-bar-mini">
              <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
            </div>
          </div>

          {/* Add Material Guide Button */}
          <button
            className="btn btn-secondary"
            style={{ fontSize: '0.84rem', padding: '0.45rem 0.85rem' }}
            onClick={onOpenAddGuide}
            title="Lihat cara menambah materi atau bab baru"
          >
            <PlusCircle size={15} color="var(--primary)" />
            <span style={{ display: 'inline' }}>Panduan Konten</span>
          </button>

          {/* Theme Switcher */}
          <button
            className="btn-icon"
            onClick={onToggleTheme}
            title={`Ganti ke mode ${theme === 'dark' ? 'Terang (Light)' : 'Gelap (Dark)'}`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
