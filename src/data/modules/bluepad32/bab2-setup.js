export const bab2Setup = {
  id: 'bluepad32-bab-2',
  moduleId: 'bluepad32',
  title: 'Bab 2: Setup Environment & Instalasi Board Package di Arduino IDE',
  subtitle: 'Konfigurasi Arduino IDE 2.x dengan Official ESP32 Core dan Board Package Khusus "ESP32 + Bluepad32" by Ricardo Quesada.',
  readingTime: '10 min',
  level: 'Pemula',
  tags: ['Arduino IDE', 'Instalasi', 'Board Package', 'Bluepad32 URL', 'ESP32 Core'],
  hardwareNeeded: [
    'Komputer / Laptop (Windows, macOS, atau Linux)',
    'ESP32 NodeMCU / DevKit V1 Board (ESP-WROOM-32)',
    'Kabel Data USB (Pastikan kabel data, bukan kabel charge-only)'
  ],
  prerequisites: ['Telah membaca Bab 1 Pengenalan'],
  sections: [
    {
      type: 'paragraph',
      content: `Berdasarkan **[Dokumentasi Resmi Bluepad32](https://bluepad32.readthedocs.io/en/latest/plat_arduino/)**, untuk memprogram ESP32 dengan Bluepad32 di Arduino IDE, kita **memerlukan URL Board Manager khusus dari Bluepad32** selain paket board resmi Espressif.`
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'Mengapa Perlu Board Package Khusus dari Bluepad32?',
      text: 'Bluepad32 menggunakan custom Bluetooth stack (BTstack) yang terintegrasi langsung ke dalam precompiled binary ESP-IDF. Paket board "ESP32 + Bluepad32" by Ricardo Quesada telah menyertakan seluruh binary Bluetooth Host ini sehingga proses kompilasi di Arduino IDE berjalan lancar tanpa error link/library.'
    },
    {
      type: 'heading',
      level: 2,
      text: 'Langkah 1: Menambahkan 2 URL Board Manager di Preferences'
    },
    {
      type: 'paragraph',
      content: `Buka Arduino IDE, masuk ke menu **File > Preferences** (atau **Arduino IDE > Settings** di macOS). Pada kolom **Additional boards manager URLs**, tambahkan **kedua baris URL berikut** (pisahkan dengan koma atau baris baru):`
    },
    {
      type: 'code',
      language: 'text',
      filename: 'Additional_Boards_Manager_URLs.txt',
      code: `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
https://raw.githubusercontent.com/ricardoquesada/esp32-arduino-lib-builder/master/bluepad32_files/package_esp32_bluepad32_index.json`,
      explanation: 'URL kedua adalah board package resmi Bluepad32 yang disediakan oleh pengembang (Ricardo Quesada).'
    },
    {
      type: 'heading',
      level: 2,
      text: 'Langkah 2: Menginstall Paket Board di Boards Manager'
    },
    {
      type: 'paragraph',
      content: `Setelah menambahkan kedua URL di atas, lakukan instalasi paket board di Arduino IDE:`
    },
    {
      type: 'steps',
      steps: [
        {
          title: 'Buka Boards Manager',
          description: 'Klik ikon Boards Manager di sidebar sebelah kiri Arduino IDE atau masuk lewat menu: Tools > Board > Boards Manager...'
        },
        {
          title: 'Install Paket ESP32 Resmi',
          description: 'Ketik "esp32" di kotak pencarian, cari "esp32 by Espressif Systems", lalu klik Install.'
        },
        {
          title: 'Install Paket "ESP32 + Bluepad32"',
          description: 'Cari paket bernama "ESP32 + Bluepad32 by Ricardo Quesada" lalu klik tombol Install dan tunggu proses download selesai.'
        }
      ]
    },
    {
      type: 'heading',
      level: 2,
      text: 'Langkah 3: Memilih Board "ESP32 + Bluepad32"'
    },
    {
      type: 'paragraph',
      content: `Setelah instalasi selesai, pilih board kamu dari menu khusus Bluepad32:`
    },
    {
      type: 'steps',
      steps: [
        {
          title: 'Pilih Menu Board',
          description: 'Masuk ke menu: Tools > Board > "ESP32 + Bluepad32 Arduino".'
        },
        {
          title: 'Pilih Tipe Board Kamu',
          description: 'Pilih board yang kamu gunakan, misalnya "ESP32 Dev Module" atau "NodeMCU-32S".'
        },
        {
          title: 'Pilih Port COM',
          description: 'Pastikan Port COM (misal COM3, COM4, atau /dev/cu.usbserial) sudah terpilih sesuai kabel USB yang terhubung.'
        }
      ]
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Membuka Contoh Kode Bawaan Resmi',
      text: 'Kamu juga bisa langsung membuka contoh resmi Bluepad32 dari menu: File > Examples > Bluepad32_ESP32 > Controller.'
    },
    {
      type: 'heading',
      level: 2,
      text: 'Langkah 4: Contoh Kode Kerangka (Skeleton Test)'
    },
    {
      type: 'paragraph',
      content: `Unggah kode verifikasi berikut ke board ESP32 kamu untuk memastikan instalasi berhasil:`
    },
    {
      type: 'code',
      language: 'cpp',
      filename: 'Bluepad32_Skeleton_Test.ino',
      code: `#include <Bluepad32.h>

GamepadPtr myGamepad = nullptr;

// Callback saat controller berhasil tersambung via Bluetooth
void onConnectedGamepad(GamepadPtr gp) {
    if (myGamepad == nullptr) {
        Serial.printf("[BLUEPAD32] Gamepad TERHUBUNG! Model: %s\\n", gp->getModelName().c_str());
        myGamepad = gp;
    }
}

// Callback saat controller terputus
void onDisconnectedGamepad(GamepadPtr gp) {
    if (myGamepad == gp) {
        Serial.println("[BLUEPAD32] Gamepad TERPUTUS!");
        myGamepad = nullptr;
    }
}

void setup() {
    Serial.begin(115200);
    delay(1000);
    Serial.println("=== Inisialisasi Bluepad32 Berhasil ===");

    // Setup callback fungsi koneksi controller
    BP32.setup(&onConnectedGamepad, &onDisconnectedGamepad);

    // Mode auto-scan gamepad
    BP32.forgetBluetoothKeys(); // Menghapus cache pairing lama jika ingin pairing baru
}

void loop() {
    // Wajib dipanggil setiap loop untuk polling Bluetooth stack
    BP32.update();
    delay(10);
}`,
      explanation: 'Header #include <Bluepad32.h> otomatis tersedia ketika kamu memilih board "ESP32 + Bluepad32 Arduino".'
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Referensi Dokumentasi Resmi',
      text: 'Untuk dokumentasi lebih lanjut tentang arsitektur dan pembaruan versi, silakan kunjungi: https://bluepad32.readthedocs.io/en/latest/plat_arduino/'
    },
    {
      type: 'quiz',
      question: 'URL tambahan apakah yang wajib dimasukkan ke Preferences Arduino IDE selain URL resmi Espressif untuk menginstall board package Bluepad32?',
      options: [
        'https://raw.githubusercontent.com/ricardoquesada/esp32-arduino-lib-builder/master/bluepad32_files/package_esp32_bluepad32_index.json',
        'https://arduino.esp8266.com/stable/package_esp8266com_index.json',
        'https://github.com/arduino/ArduinoCore-avr',
        'https://dl.espressif.com/dl/package_esp32_old.json'
      ],
      correctIndex: 0,
      explanation: 'URL package_esp32_bluepad32_index.json dari repository Ricardo Quesada menyediakan board package ESP32 + Bluepad32 lengkap dengan BTstack precompiled.'
    }
  ]
};
