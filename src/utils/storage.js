// LocalStorage keys and utility helper functions

const STORAGE_KEYS = {
  COMPLETED_LESSONS: 'materi_mengajar_completed_lessons',
  BOOKMARKS: 'materi_mengajar_bookmarks',
  THEME: 'materi_mengajar_theme',
  LAST_VISITED: 'materi_mengajar_last_visited',
};

export const getCompletedLessons = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to read completed lessons:', e);
    return [];
  }
};

export const toggleLessonCompletion = (lessonId) => {
  try {
    const current = getCompletedLessons();
    const exists = current.includes(lessonId);
    const updated = exists
      ? current.filter((id) => id !== lessonId)
      : [...current, lessonId];
    localStorage.setItem(STORAGE_KEYS.COMPLETED_LESSONS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to toggle lesson completion:', e);
    return [];
  }
};

export const getBookmarks = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to read bookmarks:', e);
    return [];
  }
};

export const toggleBookmark = (lessonId) => {
  try {
    const current = getBookmarks();
    const exists = current.includes(lessonId);
    const updated = exists
      ? current.filter((id) => id !== lessonId)
      : [...current, lessonId];
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to toggle bookmark:', e);
    return [];
  }
};

export const getTheme = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  } catch (e) {
    return 'dark';
  }
};

export const saveTheme = (theme) => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (e) {
    console.error('Failed to save theme:', e);
  }
};

export const getLastVisited = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.LAST_VISITED) || null;
  } catch (e) {
    return null;
  }
};

export const saveLastVisited = (lessonId) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_VISITED, lessonId);
  } catch (e) {
    console.error('Failed to save last visited:', e);
  }
};
