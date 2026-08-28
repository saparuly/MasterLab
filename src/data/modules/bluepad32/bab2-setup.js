export const bab2Setup = {
  id: 'bluepad32-bab-2',
  moduleId: 'bluepad32',
  title: 'Bab 2: Setup Environment & Instalasi Library di Arduino IDE',
  subtitle: 'Konfigurasi Arduino IDE 2.x, Board Package ESP32 by Espressif, dan Library Bluepad32.',
  readingTime: '10 min',
  level: 'Pemula',
  tags: ['Arduino IDE', 'Instalasi', 'Library Manager', 'Partition Scheme', 'ESP32 Core'],
  hardwareNeeded: [
    'Komputer / Laptop (Windows, macOS, atau Linux)',
    'ESP32 NodeMCU / DevKit V1 Board',
    'Kabel Data USB (Pastikan bukan kabel charge-only)'
  ],
  prerequisites: ['Telah membaca Bab 1 Pengenalan'],
  sections: [
    {
      type: 'paragraph',
      content: `Untuk memprogram ESP32 dengan Bluepad32, kita memerlukan lingkungan pengembangan **Arduino IDE** (disarankan versi 2.0 ke atas) dan paket board **ESP32 by Espressif Systems** versi terbaru.`
    },
    {
      type: 'heading',
      level: 2,
      text: 'Langkah 1: Menambahkan URL Board Manager ESP32'
    },
    {
      type: 'paragraph',
      content: `Buka Arduino IDE, masuk ke menu **File > Preferences** (atau **Arduino IDE > Settings** di macOS), lalu tambahkan URL berikut ke kolom *Additional boards manager URLs*:`
    },
    {
      type: 'code',
      language: 'text',
      filename: 'Additional_Boards_URL.txt',
      code: `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
    },
    {
      type: 'heading',
      level: 2,
      text: 'Langkah 2: Menginstall Paket Board ESP32'
    },
    {
      type: 'steps',
      steps: [
        {
          title: 'Buka Boards Manager',
          description: 'Klik ikon Boards Manager di sidebar sebelah kiri atau lewat menu Tools > Board > Boards Manager...'
        },
        {
          title: 'Cari "esp32"',
          description: 'Ketik "esp32" di kotak pencarian lalu pilih "esp32 by Espressif Systems".'
        },
        {
          title: 'Klik Install',
          description: 'Pilih versi terbaru (disarankan v2.0.14 atau v3.0+) lalu klik tombol Install dan tunggu sampai selesai.'
        }
      ]
    },
    {
      type: 'heading',
      level: 2,
      text: 'Langkah 3: Menginstall Library Bluepad32'
    },
    {
      type: 'paragraph',
      content: `Kini kita install library Bluepad32 langsung melalui Library Manager resmi Arduino:`
    },
    {
      type: 'steps',
      steps: [
        {
          title: 'Buka Library Manager',
          description: 'Klik ikon buku di sidebar kiri atau menu Sketch > Include Library > Manage Libraries...'
        },
        {
          title: 'Cari "Bluepad32"',
          description: 'Ketik "Bluepad32" dan temukan library karya Ricardo Quesada.'
        },
        {
          title: 'Klik Install',
          description: 'Klik tombol Install. Jika muncul dialog permohonan dependensi, pilih "Install All".'
        }
      ]
    },
    {
      type: 'callout',
      variant: 'danger',
      title: 'PENTING: Konfigurasi Partition Scheme!',
      text: 'Bluetooth stack membutuhkan memori program (Flash ROM) yang cukup besar. Jika kamu mengalami error "Sketch too big" saat compile, ubah partition scheme di menu: Tools > Partition Scheme > "Huge APP (3MB No OTA/1MB SPIFFS)" atau "Minimal SPIFFS (Large APPS with OTA)".'
    },
    {
      type: 'heading',
      level: 2,
      text: 'Uji Coba: Contoh Program Skeleton (Kerangka Dasar)'
    },
    {
      type: 'paragraph',
      content: `Berikut adalah kerangka minimal kode C++ untuk memastikan library Bluepad32 berhasil di-compile tanpa error di board ESP32 kamu:`
    },
    {
      type: 'code',
      language: 'cpp',
      filename: 'Bluepad32_Skeleton_Test.ino',
      code: `#include <Bluepad32.h>

GamepadPtr myGamepad = nullptr;

// Callback saat controller berhasil tersambung
void onConnectedGamepad(GamepadPtr gp) {
    if (myGamepad == nullptr) {
        Serial.printf("Gamepad TERHUBUNG! Model: %s\\n", gp->getModelName().c_str());
        myGamepad = gp;
    }
}

// Callback saat controller terputus
void onDisconnectedGamepad(GamepadPtr gp) {
    if (myGamepad == gp) {
        Serial.println("Gamepad TERPUTUS!");
        myGamepad = nullptr;
    }
}

void setup() {
    Serial.begin(115200);
    Serial.println("=== Inisialisasi Bluepad32 ===");

    // Inisialisasi library Bluepad32
    BP32.setup(&onConnectedGamepad, &onDisconnectedGamepad);

    // Aktifkan mode auto-scan bluetooth controller
    BP32.forgetBluetoothKeys(); // Opsi: Hapus pairing lama jika ingin fresh
}

void loop() {
    // Wajib dipanggil di setiap loop untuk memproses paket Bluetooth
    BP32.update();
    delay(10);
}`,
      explanation: 'Fungsi BP32.update() bertugas membaca buffer antrean paket Bluetooth dan mengeksekusi callback saat ada perubahan data.'
    },
    {
      type: 'quiz',
      question: 'Apa pengaturan yang harus diubah di menu Tools Arduino IDE jika sketch menghasilkan pesan error "Sketch too big / Flash overflow"?',
      options: [
        'Ubah Upload Speed menjadi 921600 baud',
        'Ubah Partition Scheme menjadi "Huge APP" atau "Minimal SPIFFS"',
        'Ganti Port COM ke COM1',
        'Matikan fitur Serial Monitor'
      ],
      correctIndex: 1,
      explanation: 'Bluetooth stack memakan banyak kapasitas Flash, sehingga Partition Scheme perlu dialokasikan lebih besar untuk Application (Huge APP).'
    }
  ]
};
