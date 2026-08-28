export const bab5LedRumble = {
  id: 'bluepad32-bab-5',
  moduleId: 'bluepad32',
  title: 'Bab 5: Fitur Lanjutan - LED RGB, Rumble & Multi-Gamepad',
  subtitle: 'Mengendalikan warna Lightbar gamepad, haptic force-feedback motor getar, serta mengelola hingga 4 controller sekaligus pada satu ESP32.',
  readingTime: '11 min',
  level: 'Lanjutan',
  tags: ['RGB LED', 'Rumble', 'Force Feedback', 'Multi-Controller', 'Haptic'],
  hardwareNeeded: [
    'ESP32 Board',
    '1 atau 2 Gamepad Bluetooth (PS4 / PS5 / Xbox One)',
    'Komputer & Arduino IDE'
  ],
  prerequisites: ['Telah menyelesaikan Bab 3 & Bab 4'],
  sections: [
    {
      type: 'paragraph',
      content: `Salah satu keunggulan terbesar Bluepad32 adalah dukungannya terhadap fitur hardware native pada controller komersial, seperti **Lightbar RGB (PS4/PS5)**, **Player LEDs (Switch/Wii)**, dan **Motor Getar Haptic (Rumble)** untuk memberikan umpan balik (feedback) saat robot menabrak rintangan atau baterai menipis.`
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
      code: `// Mengubah LED menjadi Merah (Indikasi Error / Tabrakan)
myGamepad->setColorLED(255, 0, 0);

// Mengubah LED menjadi Hijau (Indikasi Siap / OK)
myGamepad->setColorLED(0, 255, 0);

// Mengubah LED menjadi Biru Cyan (Standby)
myGamepad->setColorLED(0, 242, 254);

// Mengubah LED menjadi Kuning Amber (Peringatan Baterai Lemah)
myGamepad->setColorLED(255, 180, 0);`
    },
    {
      type: 'heading',
      level: 2,
      text: '2. Mengaktifkan Haptic Force-Feedback (Rumble)'
    },
    {
      type: 'paragraph',
      content: `Motor getar controller dapat dipicu menggunakan fungsi \`gamepad->setRumble(force, duration)\` atau \`gamepad->playDualRumble(lowFreq, highFreq, duration)\`:`
    },
    {
      type: 'code',
      language: 'cpp',
      filename: 'Gamepad_Rumble_Control.ino',
      code: `// Getar standar: Kekuatan (0-255), Durasi dalam satuan pulsa
myGamepad->setRumble(200, 250);

// Getar Dual-Motor (DualShock 4 & Xbox):
// lowFreq (motor getar berat di kiri), highFreq (motor getar ringan di kanan)
myGamepad->playDualRumble(0, 150, 0x80, 0x40);`
    },
    {
      type: 'heading',
      level: 2,
      text: '3. Multi-Gamepad: Menghubungkan 2 Gamepad Sekaligus'
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

void processPlayer(int playerIndex, GamepadPtr gp) {
    // Logika kontrol spesifik per player
    int stickX = gp->axisX();
    int stickY = gp->axisY();
    // ...
}

void setup() {
    Serial.begin(115200);
    BP32.setup(&onConnectedGamepad, &onDisconnectedGamepad);
}

void loop() {
    BP32.update();

    for (int i = 0; i < MAX_GAMEPADS; i++) {
        if (myGamepads[i] && myGamepads[i]->isConnected()) {
            processPlayer(i, myGamepads[i]);
        }
    }

    delay(20);
}`,
      explanation: 'Array pointer myGamepads[] menyimpan referensi setiap controller yang terhubung secara independen.'
    },
    {
      type: 'quiz',
      question: 'Bagaimana cara memberi getaran getar (rumble) pada gamepad yang terhubung saat tombol A ditekan?',
      options: [
        'gamepad->vibrateMotor(100);',
        'gamepad->setRumble(force, duration);',
        'digitalWrite(RUMBLE_PIN, HIGH);',
        'BP32.triggerShake();'
      ],
      correctIndex: 1,
      explanation: 'Fungsi resmi Bluepad32 untuk mengaktifkan motor getar controller adalah gamepad->setRumble(force, duration).'
    }
  ]
};
