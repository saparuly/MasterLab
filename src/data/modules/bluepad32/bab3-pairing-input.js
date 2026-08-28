export const bab3PairingInput = {
  id: 'bluepad32-bab-3',
  moduleId: 'bluepad32',
  title: 'Bab 3: Pairing Gamepad & Membaca Data Input',
  subtitle: 'Cara pairing berbagai merk gamepad, membaca data stick analog, trigger L2/R2, dan tombol aksi dengan deadzone filter.',
  readingTime: '12 min',
  level: 'Menengah',
  tags: ['Pairing', 'Gamepad Input', 'Analog Stick', 'Deadzone', 'D-Pad', 'Buttons'],
  hardwareNeeded: [
    'ESP32 DevKit V1 terprogram',
    'Gamepad Bluetooth (PS4 / PS5 / Xbox / Nintendo Switch / 8BitDo)',
    'Serial Monitor di Arduino IDE'
  ],
  prerequisites: ['Telah menyelesaikan Bab 2 Setup'],
  sections: [
    {
      type: 'paragraph',
      content: `Setelah kode dasar terupload ke ESP32, langkah berikutnya adalah memicu mode pairing pada gamepad Bluetooth kamu agar ESP32 dapat menemukan dan menyimpannya ke dalam memori paired devices.`
    },
    {
      type: 'heading',
      level: 2,
      text: 'Cara Memasukkan Gamepad ke Mode Pairing'
    },
    {
      type: 'steps',
      steps: [
        {
          title: 'Sony DualShock 4 (PS4)',
          description: 'Dalam kondisi mati, tekan dan tahan bersamaan tombol SHARE + PS Button selama 3-5 detik sampai Lightbar berkedip putih ganda secara cepat (Double-Blink).'
        },
        {
          title: 'Sony DualSense (PS5)',
          description: 'Dalam kondisi mati, tekan dan tahan tombol CREATE (di kiri touchpad) + PS Button sampai lightbar berkedip biru/putih cepat.'
        },
        {
          title: 'Microsoft Xbox Wireless Controller',
          description: 'Nyalakan controller dengan tombol Xbox (logo tengah), lalu tekan dan tahan tombol Pairing kecil di bagian atas dekat port USB selama 3 detik sampai logo Xbox berkedip cepat.'
        },
        {
          title: 'Nintendo Switch Pro Controller',
          description: 'Tekan dan tahan tombol bulat kecil Pairing di sebelah atas port USB-C selama 2-3 detik hingga 4 lampu LED hijau di bawah berjalan bolak-balik.'
        }
      ]
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Pairing Otomatis & Cepat',
      text: 'Saat ESP32 menyala dan gamepad berada dalam mode pairing, Bluepad32 akan otomatis melakukan handshake dan pairing dalam waktu 1-3 detik. Lampu gamepad akan berubah menjadi solid/stabil.'
    },
    {
      type: 'heading',
      level: 2,
      text: 'Membaca Data Analog & Tombol Lengkap'
    },
    {
      type: 'paragraph',
      content: `Berikut adalah contoh program lengkap untuk membaca seluruh tombol, D-Pad, dan stik analog, lengkap dengan filter **Deadzone** (mengabaikan getaran kecil saat stik di posisi tengah agar robot tidak jalan sendiri):`
    },
    {
      type: 'code',
      language: 'cpp',
      filename: 'Read_Full_Gamepad_Inputs.ino',
      code: `#include <Bluepad32.h>

GamepadPtr myGamepad = nullptr;

// Ambang batas deadzone joystick (mengabaikan nilai noise di sekitar 0)
const int DEADZONE = 30;

void onConnectedGamepad(GamepadPtr gp) {
    if (myGamepad == nullptr) {
        Serial.printf("[INFO] Controller terhubung: %s (Battery: %d%%)\\n", 
                      gp->getModelName().c_str(), 
                      (gp->battery() * 100) / 255);
        myGamepad = gp;
    }
}

void onDisconnectedGamepad(GamepadPtr gp) {
    if (myGamepad == gp) {
        Serial.println("[WARN] Controller terputus!");
        myGamepad = nullptr;
    }
}

// Fungsi helper untuk filter deadzone
int applyDeadzone(int val, int threshold) {
    if (abs(val) < threshold) return 0;
    return val;
}

void processGamepadInput(GamepadPtr gp) {
    // 1. Baca Joystick Kiri (Rentang: -511 s/d 512)
    int rawLX = gp->axisX();
    int rawLY = gp->axisY();
    int lx = applyDeadzone(rawLX, DEADZONE);
    int ly = applyDeadzone(rawLY, DEADZONE);

    // 2. Baca Joystick Kanan (Rentang: -511 s/d 512)
    int rx = applyDeadzone(gp->axisRX(), DEADZONE);
    int ry = applyDeadzone(gp->axisRY(), DEADZONE);

    // 3. Baca Trigger Analog L2 & R2 (Rentang: 0 s/d 1023)
    int l2_brake = gp->brake();
    int r2_throttle = gp->throttle();

    // 4. Baca Tombol D-Pad
    uint8_t dpad = gp->dpad();
    if (dpad & DPAD_UP)    Serial.println(">> DPAD: ATAS");
    if (dpad & DPAD_DOWN)  Serial.println(">> DPAD: BAWAH");
    if (dpad & DPAD_LEFT)  Serial.println(">> DPAD: KIRI");
    if (dpad & DPAD_RIGHT) Serial.println(">> DPAD: KANAN");

    // 5. Baca Tombol Aksi Utama (A/Cross, B/Circle, X/Square, Y/Triangle)
    uint16_t btns = gp->buttons();
    if (btns & BUTTON_A) Serial.println(">> Tombol A / Cross (X) ditekan");
    if (btns & BUTTON_B) Serial.println(">> Tombol B / Circle (O) ditekan");
    if (btns & BUTTON_X) Serial.println(">> Tombol X / Square ([]) ditekan");
    if (btns & BUTTON_Y) Serial.println(">> Tombol Y / Triangle (/\\) ditekan");

    // Cetak nilai analog jika stik digerakkan
    if (lx != 0 || ly != 0 || r2_throttle > 50) {
        Serial.printf("Stick Left [X: %4d, Y: %4d] | R2 Gas: %4d\\n", lx, ly, r2_throttle);
    }
}

void setup() {
    Serial.begin(115200);
    BP32.setup(&onConnectedGamepad, &onDisconnectedGamepad);
}

void loop() {
    BP32.update();

    if (myGamepad && myGamepad->isConnected()) {
        processGamepadInput(myGamepad);
    }
    
    delay(20); // Interval pembacaan 50Hz (responsif dan ramah CPU)
}`,
      explanation: 'Fungsi applyDeadzone() memfilter noise potensial mekanik joystick ketika berada di posisi istirahat netral.'
    },
    {
      type: 'heading',
      level: 2,
      text: 'Simulasi Pembacaan Input'
    },
    {
      type: 'paragraph',
      content: `Gunakan visualizer di bawah ini untuk melihat bagaimana data analog X/Y dan tombol terbaca secara dinamis:`
    },
    {
      type: 'gamepad-visualizer'
    },
    {
      type: 'quiz',
      question: 'Berapa rentang nilai pembacaan axis joystick analog kiri (axisX dan axisY) pada Bluepad32?',
      options: [
        '0 sampai 255 (8-bit unsigned)',
        '-511 sampai 512 (Signed)',
        '0 sampai 1023 (10-bit analog)',
        '-1.0 sampai +1.0 (Float)'
      ],
      correctIndex: 1,
      explanation: 'Bluepad32 mengembalikan nilai joystick integer bertanda (signed) dalam rentang -511 hingga 512 (0 adalah titik tengah netral).'
    }
  ]
};
