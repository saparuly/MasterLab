import React, { useState, useEffect } from 'react';
import { 
  CURRICULUM, 
  getAllModules, 
  getAllChapters, 
  findChapterById, 
  getChapterNavigation 
} from './data/curriculum';
import { 
  getCompletedLessons, 
  toggleLessonCompletion, 
  getBookmarks, 
  toggleBookmark, 
  getTheme, 
  saveTheme,
  getLastVisited,
  saveLastVisited 
} from './utils/storage';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ArticleViewer from './components/ArticleViewer';
import QuickSearchModal from './components/QuickSearchModal';
import AddMaterialGuideModal from './components/AddMaterialGuideModal';

import './styles/main.css';
import './styles/components.css';
import './styles/interactive.css';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => getTheme());

  // Active chapter state (default to Bab 1 Bluepad32 or last visited)
  const [activeChapterId, setActiveChapterId] = useState(() => {
    const last = getLastVisited();
    const exists = last ? findChapterById(last) : null;
    return exists ? last : 'bluepad32-bab-1';
  });

  // User learning state
  const [completedLessons, setCompletedLessons] = useState(() => getCompletedLessons());
  const [bookmarks, setBookmarks] = useState(() => getBookmarks());

  // Modals state
  const [searchOpen, setSearchOpen] = useState(false);
  const [addGuideOpen, setAddGuideOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme);
  }, [theme]);

  // Save last visited chapter
  useEffect(() => {
    if (activeChapterId) {
      saveLastVisited(activeChapterId);
    }
  }, [activeChapterId]);

  // Keyboard shortcut for Cmd+K / Ctrl+K search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setAddGuideOpen(false);
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSelectChapter = (chapterId) => {
    setActiveChapterId(chapterId);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleComplete = (chapterId) => {
    const updated = toggleLessonCompletion(chapterId);
    setCompletedLessons(updated);
  };

  const handleToggleBookmark = (chapterId) => {
    const updated = toggleBookmark(chapterId);
    setBookmarks(updated);
  };

  const currentChapter = findChapterById(activeChapterId);
  const navigation = getChapterNavigation(activeChapterId);
  const allChaptersList = getAllChapters();
  const allModulesList = getAllModules();

  return (
    <div className="app-container">
      {/* Background Cyber Grid */}
      <div className="cyber-background" />

      {/* Main Navbar */}
      <Navbar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAddGuide={() => setAddGuideOpen(true)}
        completedCount={completedLessons.length}
        totalChapters={allChaptersList.length}
        mobileSidebarOpen={mobileSidebarOpen}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      {/* Main Layout (Sidebar + Content) */}
      <div className="main-layout">
        <Sidebar
          modules={allModulesList}
          activeChapterId={activeChapterId}
          onSelectChapter={handleSelectChapter}
          completedLessons={completedLessons}
          onToggleComplete={handleToggleComplete}
          mobileOpen={mobileSidebarOpen}
          onOpenAddGuide={() => setAddGuideOpen(true)}
        />

        <main className="content-wrapper">
          <ArticleViewer
            chapter={currentChapter}
            isCompleted={completedLessons.includes(activeChapterId)}
            isBookmarked={bookmarks.includes(activeChapterId)}
            onToggleComplete={handleToggleComplete}
            onToggleBookmark={handleToggleBookmark}
            prevChapter={navigation.prev}
            nextChapter={navigation.next}
            onNavigate={handleSelectChapter}
          />
        </main>
      </div>

      {/* Quick Search Modal (Cmd+K) */}
      <QuickSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectChapter={handleSelectChapter}
      />

      {/* Developer / Teacher Guide Modal for Adding Materials */}
      <AddMaterialGuideModal
        isOpen={addGuideOpen}
        onClose={() => setAddGuideOpen(false)}
      />
    </div>
  );
}
