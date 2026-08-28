import { bluepad32Module } from './modules/bluepad32/index.js';
import { esp32BasicsModule } from './modules/esp32-basics/index.js';
import { esp32IotModule } from './modules/esp32-iot/index.js';

/**
 * Registry Seluruh Modul Kursus & Materi
 * Untuk menambahkan modul baru di masa depan, cukup buat folder di src/data/modules/
 * dan daftarkan modul tersebut ke dalam array CURRICULUM di bawah ini.
 */
export const CURRICULUM = [
  bluepad32Module,
  esp32BasicsModule,
  esp32IotModule,
];

// Helper: Ambil semua modul
export const getAllModules = () => CURRICULUM;

// Helper: Ambil semua bab/artikel dalam satu list flat
export const getAllChapters = () => {
  return CURRICULUM.flatMap((mod) =>
    mod.chapters.map((ch) => ({
      ...ch,
      moduleTitle: mod.title,
      moduleShortTitle: mod.shortTitle,
      moduleColor: mod.color,
      moduleIcon: mod.icon,
    }))
  );
};

// Helper: Temukan bab berdasarkan ID
export const findChapterById = (chapterId) => {
  for (const mod of CURRICULUM) {
    const found = mod.chapters.find((ch) => ch.id === chapterId);
    if (found) {
      return {
        ...found,
        moduleTitle: mod.title,
        moduleShortTitle: mod.shortTitle,
        moduleColor: mod.color,
        moduleIcon: mod.icon,
        totalInModule: mod.chapters.length,
        currentIndex: mod.chapters.indexOf(found) + 1,
      };
    }
  }
  return null;
};

// Helper: Navigasi bab Selanjutnya & Sebelumnya
export const getChapterNavigation = (currentChapterId) => {
  const all = getAllChapters();
  const index = all.findIndex((ch) => ch.id === currentChapterId);
  if (index === -1) return { prev: null, next: null };

  return {
    prev: index > 0 ? all[index - 1] : null,
    next: index < all.length - 1 ? all[index + 1] : null,
  };
};

// Helper: Pencarian cepat global
export const searchCurriculum = (query) => {
  if (!query || query.trim() === '') return [];
  const q = query.toLowerCase().trim();
  const all = getAllChapters();

  return all.filter((ch) => {
    const inTitle = ch.title.toLowerCase().includes(q);
    const inSub = ch.subtitle ? ch.subtitle.toLowerCase().includes(q) : false;
    const inTags = ch.tags ? ch.tags.some((t) => t.toLowerCase().includes(q)) : false;
    const inModule = ch.moduleTitle.toLowerCase().includes(q);
    return inTitle || inSub || inTags || inModule;
  });
};
