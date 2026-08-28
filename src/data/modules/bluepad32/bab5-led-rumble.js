export const bab5LedRumble = {
  id: 'bluepad32-bab-5',
  moduleId: 'bluepad32',
  title: 'Bab 5: Fitur Lanjutan - LED RGB, Rumble & PS5 Adaptive Triggers',
  subtitle: 'Mengendalikan warna Lightbar gamepad, haptic force-feedback motor getar, fitur Adaptive Triggers PS5 DualSense, dan multi-gamepad.',
  readingTime: '13 min',
  level: 'Lanjutan',
  tags: ['RGB LED', 'Rumble', 'Force Feedback', 'PS5 DualSense', 'Adaptive Triggers', 'Multi-Controller', 'Haptic'],
  hardwareNeeded: [
    'ESP32 Board',
    'Gamepad Bluetooth (PS4 / PS5 DualSense / Xbox One / Switch Pro)',
    'Komputer & Arduino IDE'
  ],
  prerequisites: ['Telah menyelesaikan Bab 3 & Bab 4'],
  sections: [
    {
      type: 'paragraph',
      content: `Salah satu keunggulan terbesar Bluepad32 adalah dukungannya terhadap fitur hardware native pada controller modern, seperti **Lightbar RGB (PS4/PS5)**, **Player LEDs (Switch/Wii)**, **Motor Getar Haptic (Dual Rumble)**, serta **Adaptive Triggers (PS5 DualSense)** untuk memberikan umpan balik fisik yang nyata kepada pengguna!`
    },
    {
      type: 'heading',
      level: 2,
      text: '1. Mengatur Warna LED Lightbar Gamepad'
    },
    {
      type: 'paragraph',
      content: `Kamu dapat mengubah warna LED pada controller PS4 / PS5 / Nintendo Switch menggunakan perintah \`gamepad->setColorLED(red, green, blue)\` dengan nilai intensitas 0 hingga 255:`
    },
    {
      type: 'code',
      language: 'cpp',
      filename: 'Gamepad_LED_Control.ino',
      code: `// Mengubah LED menjadi Merah (Indikasi Error / Tabrakan / Bahaya)
myGamepad->setColorLED(255, 0, 0);

// Mengubah LED menjadi Hijau (Indikasi Siap Jalan / Koneksi Aman)
myGamepad->setColorLED(0, 255, 0);

// Mengubah LED menjadi Biru Cyan (Standby Mode)
myGamepad->setColorLED(0, 242, 254);

// Mengubah LED menjadi Kuning Amber (Peringatan Baterai Lemah)
myGamepad->setColorLED(255, 180, 0);`
    },
    {
      type: 'heading',
      level: 2,
      text: '2. Mengaktifkan Haptic Force-Feedback (Dual Rumble)'
    },
    {
      type: 'paragraph',
      content: `Motor getar controller dapat dipicu menggunakan fungsi \`gamepad->setRumble(force, duration)\` atau \`gamepad->playDualRumble(delay, duration, weak, strong)\`:`
    },
    {
      type: 'code',
      language: 'cpp',
      filename: 'Gamepad_Rumble_Control.ino',
      code: `// 1. Getar Standar: Kekuatan (0-255), Durasi dalam satuan siklus/pulsa
myGamepad->setRumble(200, 250);

// 2. Dual Rumble Presisi (Motor Kiri Berat + Motor Kanan Ringan):
// Param: delayStartMs, durationMs, weakMagnitude (kanan), strongMagnitude (kiri)
myGamepad->playDualRumble(0, 300, 0x40, 0x80);`
    },
    {
      type: 'heading',
      level: 2,
      text: '3. Apa itu PS5 DualSense Adaptive Triggers & Dukungannya di Bluepad32'
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'Mengenal Teknologi Adaptive Triggers (L2 / R2) PS5',
      text: 'Pada controller Sony PlayStation 5 (DualSense & DualSense Edge), tombol pelatuk L2 dan R2 dilengkapi motor mikro dan mekanisme gir khusus. Mekanisme ini dapat secara dinamis mengubah tingkat kekakuan pegas (resistansi) dan memberikan dorongan balik (force feedback) ke jari pemain!'
    },
    {
      type: 'paragraph',
      content: `**Apakah di Bluepad32 sudah ada?**  
**YA, SUDAH ADA!** Sejak versi 3.10 ke atas, Bluepad32 telah menyertakan dukungan untuk efek **DualSense Adaptive Triggers**. Melalui paket Bluetooth HID report khusus, ESP32 dapat menginstruksikan modul trigger DualSense untuk menghasilkan beberapa mode efek:`
    },
    {
      type: 'steps',
      steps: [
        {
          title: 'Mode Resistance (Tahanan Progresif / Rem Berat)',
          description: 'Pelatuk L2/R2 menjadi semakin keras ditekan seiring kedalaman tombol. Sangat cocok disimulasikan sebagai pedal rem hidrolik atau tarikan tali busur panah.'
        },
        {
          title: 'Mode Feedback / Weapon (Sentakan Dua Tahap)',
          description: 'Memberikan titik tahanan ("click point") di tengah penekanan, lalu melepaskannya seketika seperti sensasi pelatuk senjata api.'
        },
        {
          title: 'Mode Vibration / Machine Gun (Denyutan Frekuensi)',
          description: 'Pelatuk berdenyut/bergetar dengan frekuensi tertentu melawan jari pemain, cocok untuk simulasi rem ABS mobil saat jalan licin atau recoil tembakan.'
        }
      ]
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Contoh Penerapan Nyata pada Robotika',
      text: 'Ketika sensor ultrasonik pada mobil robot mendeteksi dinding di depan (< 20 cm), ESP32 dapat memicu efek Resistance maksimal pada trigger R2 (Gas) sehingga jari pengguna merasakan tahanan keras dan secara alami berhenti menekan gas!'
    },
    {
      type: 'heading',
      level: 2,
      text: '4. Multi-Gamepad: Menghubungkan 2-4 Gamepad Sekaligus'
    },
    {
      type: 'paragraph',
      content: `Bluepad32 dapat menangani hingga 4 gamepad secara bersamaan (misalnya untuk robot battle bot 2 player atau robot kolaborasi):`
    },
    {
      type: 'code',
      language: 'cpp',
      filename: 'Multi_Gamepad_Manager.ino',
      code: `#include <Bluepad32.h>

#define MAX_GAMEPADS 4
GamepadPtr myGamepads[MAX_GAMEPADS];

void onConnectedGamepad(GamepadPtr gp) {
    bool foundSlot = false;
    for (int i = 0; i < MAX_GAMEPADS; i++) {
        if (myGamepads[i] == nullptr) {
            myGamepads[i] = gp;
            foundSlot = true;
            Serial.printf("Player %d Terhubung! Model: %s\\n", i + 1, gp->getModelName().c_str());
            
            // Set warna berbeda untuk Player 1 (Biru) dan Player 2 (Merah)
            if (i == 0) gp->setColorLED(0, 100, 255);
            else if (i == 1) gp->setColorLED(255, 50, 0);
            
            // Beri getaran sambutan
            gp->setRumble(150, 100);
            break;
        }
    }
}

void onDisconnectedGamepad(GamepadPtr gp) {
    for (int i = 0; i < MAX_GAMEPADS; i++) {
        if (myGamepads[i] == gp) {
            Serial.printf("Player %d Terputus!\\n", i + 1);
            myGamepads[i] = nullptr;
            break;
        }
    }
}

void setup() {
    Serial.begin(115200);
    BP32.setup(&onConnectedGamepad, &onDisconnectedGamepad);
}

void loop() {
    BP32.update();

    for (int i = 0; i < MAX_GAMEPADS; i++) {
        if (myGamepads[i] && myGamepads[i]->isConnected()) {
            // Proses logika per player
        }
    }

    delay(20);
}`,
      explanation: 'Array pointer myGamepads[] menyimpan referensi setiap controller yang terhubung secara independen.'
    },
    {
      type: 'quiz',
      question: 'Apa fungsi utama mekanisme gir mikro motor pada Adaptive Triggers PS5 DualSense yang didukung oleh Bluepad32?',
      options: [
        'Hanya untuk menyalakan lampu LED di tombol L2/R2',
        'Mengubah resistansi fisik/kekakuan tombol pelatuk dan memberikan umpan balik getaran terarah (force feedback) ke jari pemain',
        'Mendinginkan baterai controller saat bermain game',
        'Mengubah controller menjadi mikrofon nirkabel'
      ],
      correctIndex: 1,
      explanation: 'Adaptive Triggers menggunakan motor dan gir untuk menciptakan sensasi tahanan variabel (seperti pedal rem keras atau tarikan busur) dan getaran recoil pada jari pengguna.'
    }
  ]
};
