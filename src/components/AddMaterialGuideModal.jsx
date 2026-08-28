import React, { useState } from 'react';
import { X, PlusCircle, BookOpen, Layers, Check, Copy } from 'lucide-react';
import CodeBlock from './CodeBlock';

export default function AddMaterialGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="btn-icon modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div className="logo-icon-box" style={{ width: 42, height: 42 }}>
            <PlusCircle size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Panduan Menambah / Edit Materi Baru</h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Struktur modular berbasis data Javascript & React Components
            </span>
          </div>
        </div>

        <p>
          Platform ini dirancang dengan struktur <strong>Component-Driven Content</strong>. Kamu dapat menambahkan bab atau modul baru dalam 3 langkah sangat mudah:
        </p>

        <div className="step-container">
          <div className="step-marker">1</div>
          <div className="step-content">
            <h3>Buat File Bab Baru</h3>
            <p>
              Buat file baru di dalam folder <code>src/data/modules/[nama-modul]/babX-nama-topik.js</code>.
            </p>
            <CodeBlock
              language="javascript"
              filename="src/data/modules/contoh-modul/bab1-materi-baru.js"
              code={`export const bab1MateriBaru = {
  id: 'modul-baru-bab-1',
  moduleId: 'modul-baru',
  title: 'Bab 1: Judul Materi Baru Kamu',
  subtitle: 'Deskripsi ringkas mengenai materi ini...',
  readingTime: '10 min',
  level: 'Pemula', // Pemula | Menengah | Lanjutan
  tags: ['ESP32', 'Sensor', 'IoT'],
  hardwareNeeded: ['ESP32 DevKit', 'Sensor DHT22', 'Resistor 10k'],
  prerequisites: ['Dasar Arduino'],
  sections: [
    {
      type: 'paragraph',
      content: 'Tuliskan isi paragraf materi di sini...'
    },
    {
      type: 'callout',
      variant: 'tip', // 'info' | 'tip' | 'warning' | 'danger'
      title: 'Tips Penting',
      text: 'Gunakan pull-up resistor pada pin data!'
    },
    {
      type: 'code',
      language: 'cpp',
      filename: 'ESP32_DHT22.ino',
      code: '// Kode Arduino C++ lengkap kamu...',
      explanation: 'Penjelasan baris kode penting.'
    },
    {
      type: 'wiring',
      pins: [
        { espPin: 'GPIO 4', targetComponent: 'DHT22', targetPin: 'DATA', wireColor: '#00f2fe', note: 'Data Pin' },
        { espPin: '3V3', targetComponent: 'DHT22', targetPin: 'VCC', wireColor: '#ef4444', note: 'Power 3.3V' },
        { espPin: 'GND', targetComponent: 'DHT22', targetPin: 'GND', wireColor: '#334155', note: 'Ground' },
      ],
      notes: 'Gunakan resistor 4.7k - 10k ohm antara VCC dan DATA.'
    },
    {
      type: 'quiz',
      question: 'Berapakah tegangan operasi rekomendasi sensor DHT22 pada ESP32?',
      options: ['3.3V DC', '12V DC', '220V AC', '1.5V DC'],
      correctIndex: 0,
      explanation: 'ESP32 bekerja pada level logika 3.3V DC.'
    }
  ]
};`}
            />
          </div>
        </div>

        <div className="step-container">
          <div className="step-marker">2</div>
          <div className="step-content">
            <h3>Daftarkan di Index Modul</h3>
            <p>
              Buka atau buat <code>src/data/modules/[nama-modul]/index.js</code> dan masukkan bab tersebut ke dalam array <code>chapters</code>.
            </p>
          </div>
        </div>

        <div className="step-container">
          <div className="step-marker">3</div>
          <div className="step-content">
            <h3>Daftarkan Modul ke Kurikulum Utama</h3>
            <p>
              Buka <code>src/data/curriculum.js</code> dan masukkan modul baru ke dalam array <code>CURRICULUM</code>. Selesai! Halaman, navigasi sidebar, pencarian, dan progress tracker akan terupdate otomatis!
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Mengerti, Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
}
