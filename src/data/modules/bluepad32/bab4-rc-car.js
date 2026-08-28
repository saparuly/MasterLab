export const bab4RcCar = {
  id: 'bluepad32-bab-4',
  moduleId: 'bluepad32',
  title: 'Bab 4: Proyek Praktis - Robot RC Car Gamepad Controller',
  subtitle: 'Membangun mobil robot RC kendali gamepad PS4 / Xbox dengan ESP32, Driver Motor 4-Channel PWM, dan kemudi D-Pad serta Stik Analog.',
  readingTime: '18 min',
  level: 'Menengah',
  tags: ['Proyek', 'RC Car', 'Motor Driver', 'L298N', 'L9110S', 'PWM', 'D-Pad', 'Robotics'],
  hardwareNeeded: [
    'ESP32 DevKit V1 Board (30-Pin / 38-Pin)',
    'Motor Driver Dual H-Bridge (L298N / L9110S / Mini Driver)',
    '2x DC Gearbox Motor TT (Yellow Motor)',
    'Chassis 2WD Robot Kit + 1x Caster Wheel',
    'Baterai Li-ion 18650 2S (7.4V) + Holder Baterai',
    'Gamepad Bluetooth (PS4 / PS5 / Xbox / Switch Pro)',
    'Kabel Jumper Female-Female & Male-Female'
  ],
  prerequisites: ['Telah menyelesaikan Bab 1, 2, dan 3'],
  sections: [
    {
      type: 'paragraph',
      content: `Pada bab ini, kita akan membuat proyek nyata: **Mobil Robot RC Pintar** yang dikendalikan dengan tombol arah **D-Pad** dan **Joystick Analog** menggunakan driver motor 4-pin (IN1, IN2, IN3, IN4) dengan modulasi lebar pulsa (**Hardware PWM LEDC ESP32**).`
    },
    {
      type: 'heading',
      level: 2,
      text: 'Skema Rangkaian Pinout & Wiring'
    },
    {
      type: 'paragraph',
      content: `Sambungkan pin ESP32 ke modul Motor Driver (L298N / L9110S) dan Baterai sesuai tabel berikut:`
    },
    {
      type: 'wiring',
      pins: [
        { espPin: 'GPIO 12', targetComponent: 'Motor Driver', targetPin: 'IN1 (Motor Kiri Maju)', wireColor: '#00f2fe', note: 'LEDC Channel 0' },
        { espPin: 'GPIO 14', targetComponent: 'Motor Driver', targetPin: 'IN2 (Motor Kiri Mundur)', wireColor: '#9d4edd', note: 'LEDC Channel 1' },
        { espPin: 'GPIO 13', targetComponent: 'Motor Driver', targetPin: 'IN3 (Motor Kanan Maju)', wireColor: '#f59e0b', note: 'LEDC Channel 2' },
        { espPin: 'GPIO 27', targetComponent: 'Motor Driver', targetPin: 'IN4 (Motor Kanan Mundur)', wireColor: '#10b981', note: 'LEDC Channel 3' },
        { espPin: 'GND', targetComponent: 'Baterai & Driver', targetPin: 'GND Bersama (Common Ground)', wireColor: '#334155', note: 'Wajib Common GND!' },
        { espPin: 'VIN (5V)', targetComponent: 'Regulator / Output Driver 5V', targetPin: '5V Power In', wireColor: '#ef4444', note: 'Daya input ESP32' }
      ],
      notes: 'PENTING: Selalu satukan kabel GND baterai, GND motor driver, dan GND ESP32 (Common Ground) agar sinyal PWM stabil!'
    },
    {
      type: 'callout',
      variant: 'danger',
      title: 'Perhatian Daya Baterai!',
      text: 'Jangan memberi daya motor DC langsung dari pin 3.3V ESP32! Motor DC membutuhkan arus besar yang harus disuplai langsung dari baterai eksternal (7.4V Li-Ion).'
    },
    {
      type: 'heading',
      level: 2,
      text: 'Metode 1: Kode Pembelajaran Dasar (Kontrol D-Pad Digital)'
    },
    {
      type: 'paragraph',
      content: `Berikut adalah kode standar pembelajaran yang menggunakan fungsi pembatas nilai \`batasi()\` dan fungsi penggerak terpadu \`drive(left, right)\` untuk mengontrol 4 channel PWM H-Bridge berdasarkan tombol **D-Pad**:`
    },
    {
      type: 'code',
      language: 'cpp',
      filename: 'ESP32_Bluepad32_RC_Car_DPad.ino',
      code: `#include <Bluepad32.h>

#define MOTOR_LEFT_IN1  12  
#define MOTOR_LEFT_IN2  14  
#define MOTOR_RIGHT_IN3 13  
#define MOTOR_RIGHT_IN4 27  
#define SPEED           255  // Kecepatan motor (Rentang: 0 - 255)

GamepadPtr myGamepad = nullptr;

// Pembatas nilai manual pengganti constrain()
int batasi(int val, int minVal, int maxVal) {
  if (val < minVal) return minVal;
  if (val > maxVal) return maxVal;
  return val;
}

// Fungsi penggerak 4-channel H-Bridge PWM
void drive(int left, int right) {
  left = batasi(left, -255, 255);
  right = batasi(right, -255, 255);

  ledcWrite(0, left > 0 ? left : 0);
  ledcWrite(1, left < 0 ? -left : 0);
  ledcWrite(2, right > 0 ? right : 0);
  ledcWrite(3, right < 0 ? -right : 0);
}

void onConnected(GamepadPtr gp) { 
  myGamepad = gp; 
  Serial.printf("[INFO] Controller Terhubung: %s\\n", gp->getModelName().c_str());
}

void onDisconnected(GamepadPtr gp) { 
  myGamepad = nullptr; 
  drive(0, 0); // Matikan motor saat controller terputus
  Serial.println("[WARN] Controller Terputus!");
}

void setup() {
  Serial.begin(115200);
  const int pins[] = {MOTOR_LEFT_IN1, MOTOR_LEFT_IN2, MOTOR_RIGHT_IN3, MOTOR_RIGHT_IN4};
  
  // Konfigurasi 4 Channel PWM ESP32 (Frekuensi: 5000 Hz, Resolusi: 8-Bit)
  for (int i = 0; i < 4; i++) {
    ledcSetup(i, 5000, 8);
    ledcAttachPin(pins[i], i);
  }
  
  BP32.setup(&onConnected, &onDisconnected);
}

void loop() {
  BP32.update();

  if (myGamepad && myGamepad->isConnected() && myGamepad->hasData()) {
    uint8_t dpad = myGamepad->dpad();

    if (dpad & DPAD_UP)         drive(SPEED, SPEED);    // Maju
    else if (dpad & DPAD_DOWN)  drive(-SPEED, -SPEED);  // Mundur
    else if (dpad & DPAD_LEFT)  drive(-SPEED, SPEED);   // Belok Kiri (Putar di Tempat)
    else if (dpad & DPAD_RIGHT) drive(SPEED, -SPEED);   // Belok Kanan (Putar di Tempat)
    else                        drive(0, 0);            // Diam / Berhenti
  }
  
  delay(15);
}`,
      explanation: 'Fungsi drive(left, right) secara cerdas memisahkan nilai positif untuk maju dan nilai negatif (-val) untuk mundur pada masing-masing channel PWM.'
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'Memahami Logika Fungsi drive(left, right)',
      text: 'Ketika left = 255 (Maju), Channel 0 (IN1) bernilai 255 dan Channel 1 (IN2) bernilai 0. Ketika left = -255 (Mundur), Channel 0 bernilai 0 dan Channel 1 bernilai 255. Sangat ringkas dan aman tanpa terjadi korsleting logika!'
    },
    {
      type: 'heading',
      level: 2,
      text: 'Metode 2: Upgrade ke Analog Joystick (Smooth Speed & Steering)'
    },
    {
      type: 'paragraph',
      content: `Dengan fungsi \`drive()\` yang sama persis di atas, kita dapat meningkatkan kemampuan robot agar bisa dikendalikan secara bertahap dan halus (**proporsional**) menggunakan stik analog kiri:`
    },
    {
      type: 'code',
      language: 'cpp',
      filename: 'ESP32_Bluepad32_RC_Car_Analog.ino',
      code: `#include <Bluepad32.h>

#define MOTOR_LEFT_IN1  12  
#define MOTOR_LEFT_IN2  14  
#define MOTOR_RIGHT_IN3 13  
#define MOTOR_RIGHT_IN4 27  
const int DEADZONE      = 35;

GamepadPtr myGamepad = nullptr;

int batasi(int val, int minVal, int maxVal) {
  if (val < minVal) return minVal;
  if (val > maxVal) return maxVal;
  return val;
}

void drive(int left, int right) {
  left = batasi(left, -255, 255);
  right = batasi(right, -255, 255);

  ledcWrite(0, left > 0 ? left : 0);
  ledcWrite(1, left < 0 ? -left : 0);
  ledcWrite(2, right > 0 ? right : 0);
  ledcWrite(3, right < 0 ? -right : 0);
}

void onConnected(GamepadPtr gp) { myGamepad = gp; }
void onDisconnected(GamepadPtr gp) { myGamepad = nullptr; drive(0, 0); }

void setup() {
  Serial.begin(115200);
  const int pins[] = {MOTOR_LEFT_IN1, MOTOR_LEFT_IN2, MOTOR_RIGHT_IN3, MOTOR_RIGHT_IN4};
  
  for (int i = 0; i < 4; i++) {
    ledcSetup(i, 5000, 8);
    ledcAttachPin(pins[i], i);
  }
  
  BP32.setup(&onConnected, &onDisconnected);
}

void loop() {
  BP32.update();

  if (myGamepad && myGamepad->isConnected() && myGamepad->hasData()) {
    // 1. Baca Joystick Kiri: Sumbu Y (Maju/Mundur) & Sumbu X (Belok)
    int rawY = -myGamepad->axisY(); // Dibalik karena dorong ke atas bernilai negatif
    int rawX = myGamepad->axisX();

    // 2. Terapkan Deadzone
    if (abs(rawY) < DEADZONE) rawY = 0;
    if (abs(rawX) < DEADZONE) rawX = 0;

    // 3. Konversi nilai (-511..512) ke kecepatan PWM (-255..255)
    int throttle = map(rawY, -511, 512, -255, 255);
    int steer    = map(rawX, -511, 512, -255, 255);

    // 4. Kalkulasi Diferensial Steering Arcade
    int leftSpeed  = throttle + steer;
    int rightSpeed = throttle - steer;

    drive(leftSpeed, rightSpeed);
  } else {
    drive(0, 0);
  }
  
  delay(15);
}`,
      explanation: 'Metode analog memungkinkan kecepatan bertambah perlahan sesuai seberapa jauh joystick didorong oleh pemain.'
    },
    {
      type: 'heading',
      level: 2,
      text: 'Pinout & GPIO Explorer'
    },
    {
      type: 'paragraph',
      content: `Periksa panduan pinout ESP32 di bawah ini untuk melihat detail karakteristik pin GPIO 12, 13, 14, dan 27:`
    },
    {
      type: 'pinout-explorer'
    },
    {
      type: 'quiz',
      question: 'Jika fungsi drive(-150, 150) dipanggil, bagaimanakah kondisi pergerakan mobil robot?',
      options: [
        'Maju lurus ke depan dengan kecepatan 150',
        'Mundur lurus ke belakang dengan kecepatan 150',
        'Berputar di tempat ke arah Kiri (roda kiri mundur 150, roda kanan maju 150)',
        'Robot berhenti total'
      ],
      correctIndex: 2,
      explanation: 'Nilai negatif (-150) memutar roda kiri ke belakang, dan nilai positif (150) memutar roda kanan ke depan, sehingga robot berputar pivot ke kiri.'
    }
  ]
};
