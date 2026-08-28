export const bab1Intro = {
  id: 'bluepad32-bab-1',
  moduleId: 'bluepad32',
  title: 'Bab 1: Pengenalan ESP32 & Apa itu Bluepad32',
  subtitle: 'Memahami arsitektur Bluetooth ESP32 dan fleksibilitas Bluepad32 untuk controller robotika & game.',
  readingTime: '8 min',
  level: 'Pemula',
  tags: ['ESP32', 'Bluepad32', 'Bluetooth', 'Gamepad', 'Pengenalan'],
  hardwareNeeded: [
    'ESP32 DevKit V1 (ESP-WROOM-32)',
    'Gamepad Bluetooth (PS4 / PS5 / Xbox One / Nintendo Switch Pro)',
    'Kabel Micro USB / Type-C (sesuai modul ESP32)',
  ],
  prerequisites: ['Dasar pemrograman C / Arduino', 'Arduino IDE terinstal di komputer'],
  sections: [
    {
      type: 'paragraph',
      content: `Selamat datang di materi awal pembelajaran **Arduino & ESP32**! Pada modul ini, kita akan mempelajari salah satu library paling bertenaga di ekosistem ESP32, yaitu **Bluepad32** yang dikembangkan oleh *Ricardo Quesada*. Library ini memungkinkan board ESP32 kamu terhubung langsung dengan berbagai controller/gamepad Bluetooth modern tanpa perlu receiver USB tambahan (dongle USB Host shield).`
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Kenapa Menggunakan Bluepad32?',
      text: 'Daripada membuat remote control custom dari nol dengan nRF24L01 atau aplikasi HP yang kurang responsif secara ergonomis, Bluepad32 memanfaatkan stick analog presisi, trigger magnetik, dan tombol berkualitas tinggi dari stik PlayStation atau Xbox yang kamu miliki!'
    },
    {
      type: 'heading',
      level: 2,
      text: 'Gamepad Apa Saja yang Didukung?'
    },
    {
      type: 'paragraph',
      content: `Bluepad32 mendukung hampir semua gamepad Bluetooth komersial ternama dengan protokol BLE HID (Bluetooth Low Energy Human Interface Device) dan Classic Bluetooth HID:`
    },
    {
      type: 'steps',
      steps: [
        {
          title: 'Sony PlayStation Family',
          description: 'DualShock 4 (PS4), DualSense & DualSense Edge (PS5), dan PlayStation Move Navigation Controller.'
        },
        {
          title: 'Microsoft Xbox Family',
          description: 'Xbox Wireless Controller (Model 1708 ke atas yang sudah ada Bluetooth, Xbox Series X/S, Xbox Adaptive Controller, dan Xbox Elite Series 2).'
        },
        {
          title: 'Nintendo Family',
          description: 'Nintendo Switch Pro Controller, Joy-Con (L & R), Super Nintendo Online Controller, dan Nintendo Wii Remote / Nunchuk.'
        },
        {
          title: 'Third-Party & Retro Controller',
          description: '8BitDo (SN30 Pro, Pro 2, Ultimate Bluetooth), Steam Controller, Google Stadia Controller (mode Bluetooth), dan gamepad ipega / generic Bluetooth Android.'
        }
      ]
    },
    {
      type: 'heading',
      level: 2,
      text: 'Bagaimana Cara Kerjanya di ESP32?'
    },
    {
      type: 'paragraph',
      content: `ESP32 dilengkapi dengan radio combo 2.4 GHz yang mendukung WiFi 802.11 b/g/n dan Bluetooth v4.2 BR/EDR serta BLE. Bluepad32 berjalan di atas Bluetooth stack ESP-IDF / Arduino ESP32. Saat diaktifkan, ESP32 bertindak sebagai **Bluetooth Host** yang memindai (scan) perangkat controller di sekitarnya, melakukan negosiasi enkripsi, lalu membaca *HID Reports* (laporan posisi joystick, tekanan trigger L2/R2, dan status tombol) dengan latensi yang sangat rendah (sekitar 8-15 ms).`
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Perhatian Spesifikasi ESP32',
      text: 'Bluepad32 memerlukan board dengan chip ESP32 Classic (ESP32-WROOM / ESP32-WROVER) atau ESP32-S3. ESP32-C3 / C6 memiliki arsitektur BLE berbeda dan beberapa fitur Classic BT tidak didukung secara penuh.'
    },
    {
      type: 'heading',
      level: 2,
      text: 'Struktur Data Dasar Bluepad32'
    },
    {
      type: 'paragraph',
      content: `Di dalam kode program, setiap controller yang terhubung direpresentasikan sebagai objek pointer \`GamepadPtr\`. Bluepad32 memetakan semua jenis gamepad ke dalam sebuah format standar terpadu (Unified Controller API):`
    },
    {
      type: 'code',
      language: 'cpp',
      filename: 'Bluepad32_Data_Structure.h',
      code: `// Gambaran struktur data yang disediakan oleh Bluepad32
struct GamepadProperties {
    uint8_t dpad;         // Tombol Arah (DPAD_UP, DPAD_DOWN, DPAD_LEFT, DPAD_RIGHT)
    uint16_t buttons;     // Tombol Aksi (BUTTON_A, BUTTON_B, BUTTON_X, BUTTON_Y, L1, R1, L3, R3)
    int32_t axisX;        // Joystick Kiri Sumbu X (-511 sampai 512)
    int32_t axisY;        // Joystick Kiri Sumbu Y (-511 sampai 512)
    int32_t axisRX;       // Joystick Kanan Sumbu X (-511 sampai 512)
    int32_t axisRY;       // Joystick Kanan Sumbu Y (-511 sampai 512)
    int32_t brake;        // Trigger Kiri L2 / LT (0 sampai 1023)
    int32_t throttle;     // Trigger Kanan R2 / RT (0 sampai 1023)
    uint16_t battery;     // Level baterai stik (0 - 255)
};`,
      explanation: 'Nilai joystick berada pada rentang -511 hingga 512, sedangkan trigger L2/R2 berada pada rentang 0 hingga 1023 (analog 10-bit).'
    },
    {
      type: 'heading',
      level: 2,
      text: 'Coba Simulator Gamepad di Bawah Ini'
    },
    {
      type: 'paragraph',
      content: `Kamu dapat menguji coba pembacaan tombol dan axis secara langsung menggunakan simulator interaktif di bawah ini sebelum mengunggah kode ke ESP32:`
    },
    {
      type: 'gamepad-visualizer'
    },
    {
      type: 'quiz',
      question: 'Manakah di antara chip ESP berikut yang paling ideal dan mendukung Classic BT & BLE untuk Bluepad32 secara penuh?',
      options: [
        'ESP8266 NodeMCU V3',
        'ESP32 Dual-Core (ESP-WROOM-32 / DevKit V1)',
        'Arduino Uno R3 ATMega328P',
        'Raspberry Pi Pico (tanpa W)'
      ],
      correctIndex: 1,
      explanation: 'ESP-WROOM-32 memiliki radio hardware Bluetooth Dual-Mode (Classic BT 4.2 BR/EDR dan BLE) yang didukung penuh oleh Bluepad32.'
    }
  ]
};
