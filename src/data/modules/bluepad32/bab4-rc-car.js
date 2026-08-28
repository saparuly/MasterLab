export const bab4RcCar = {
  id: 'bluepad32-bab-4',
  moduleId: 'bluepad32',
  title: 'Bab 4: Proyek Praktis - Robot RC Car Gamepad Controller',
  subtitle: 'Membangun mobil robot RC kendali gamepad PS4 / Xbox dengan ESP32, Motor Driver TB6612FNG / L298N, dan kemudi diferensial PWM halus.',
  readingTime: '18 min',
  level: 'Menengah',
  tags: ['Proyek', 'RC Car', 'Motor Driver', 'TB6612FNG', 'L298N', 'PWM', 'Robotics'],
  hardwareNeeded: [
    'ESP32 DevKit V1 Board',
    'Motor Driver TB6612FNG (disarankan) atau L298N',
    '2x DC Gearbox Motor TT (Yellow Motor)',
    'Chassis 2WD Robot Kit + 1x Caster Wheel',
    'Baterai Li-ion 18650 2S (7.4V) + Holder Baterai',
    'Gamepad Bluetooth (PS4 / PS5 / Xbox / Switch Pro)',
    'Kabel Jumper Male-Female & Male-Male'
  ],
  prerequisites: ['Telah menyelesaikan Bab 1, 2, dan 3'],
  sections: [
    {
      type: 'paragraph',
      content: `Pada bab ini, kita akan menggabungkan semua materi yang telah dipelajari untuk membuat proyek nyata: **Mobil Robot RC Pintar** yang dikendalikan dengan joystick analog gamepad secara *smooth* dan presisi menggunakan modulasi lebar pulsa (PWM LEDC ESP32).`
    },
    {
      type: 'heading',
      level: 2,
      text: 'Skema Rangkaian Pinout & Wiring'
    },
    {
      type: 'paragraph',
      content: `Berikut adalah tabel sambungan kabel antara ESP32, Motor Driver TB6612FNG / L298N, dan Baterai:`
    },
    {
      type: 'wiring',
      pins: [
        { espPin: 'GPIO 18', targetComponent: 'Motor Driver', targetPin: 'PWMA (Speed Kiri)', wireColor: '#00f2fe', note: 'PWM Kecepatan Motor Kiri' },
        { espPin: 'GPIO 19', targetComponent: 'Motor Driver', targetPin: 'AIN1 (Dir Kiri 1)', wireColor: '#9d4edd', note: 'Arah Maju Motor Kiri' },
        { espPin: 'GPIO 21', targetComponent: 'Motor Driver', targetPin: 'AIN2 (Dir Kiri 2)', wireColor: '#c77dff', note: 'Arah Mundur Motor Kiri' },
        { espPin: 'GPIO 22', targetComponent: 'Motor Driver', targetPin: 'PWMB (Speed Kanan)', wireColor: '#38bdf8', note: 'PWM Kecepatan Motor Kanan' },
        { espPin: 'GPIO 23', targetComponent: 'Motor Driver', targetPin: 'BIN1 (Dir Kanan 1)', wireColor: '#f59e0b', note: 'Arah Maju Motor Kanan' },
        { espPin: 'GPIO 25', targetComponent: 'Motor Driver', targetPin: 'BIN2 (Dir Kanan 2)', wireColor: '#fbbf24', note: 'Arah Mundur Motor Kanan' },
        { espPin: 'GPIO 33', targetComponent: 'TB6612FNG', targetPin: 'STBY (Standby Pin)', wireColor: '#10b981', note: 'Harus HIGH agar driver aktif' },
        { espPin: 'GND', targetComponent: 'Baterai & Driver', targetPin: 'GND Bersama (Common GND)', wireColor: '#334155', note: 'Wajib Common Ground!' },
        { espPin: 'VIN (5V)', targetComponent: 'Baterai 7.4V Step-down / 5V BEC', targetPin: '5V Output', wireColor: '#ef4444', note: 'Tegangan masukan ESP32' }
      ],
      notes: 'PENTING: Selalu satukan kabel GND baterai, GND motor driver, dan GND ESP32 (Common Ground) agar sinyal PWM stabil!'
    },
    {
      type: 'callout',
      variant: 'danger',
      title: 'Perhatian Daya & Motor Surge',
      text: 'JANGAN PERNAH menyuplai motor DC dari pin 3.3V atau 5V ESP32 langsung! Motor DC dapat menarik arus spike hingga 1 Ampere saat start yang akan merusak chip regulator ESP32 atau menyebabkan Brownout Reset terus menerus.'
    },
    {
      type: 'heading',
      level: 2,
      text: 'Kode Program Lengkap (Arcade Drive Controller)'
    },
    {
      type: 'paragraph',
      content: `Kode berikut mengimplementasikan algoritma **Arcade Drive** (Throttle di stik Y dan Kemudi di stik X atau Trigger R2 untuk gas dan Stik Kiri untuk belok):`
    },
    {
      type: 'code',
      language: 'cpp',
      filename: 'ESP32_Bluepad32_RC_Car.ino',
      code: `#include <Bluepad32.h>

// Definisi Pin Motor Driver
#define PIN_PWMA  18
#define PIN_AIN1  19
#define PIN_AIN2  21
#define PIN_PWMB  22
#define PIN_BIN1  23
#define PIN_BIN2  25
#define PIN_STBY  33

// Konfigurasi PWM ESP32
const int PWM_FREQ = 20000;   // 20 kHz (suara motor hening tidak berdengung)
const int PWM_RES  = 8;       // Resolusi 8-bit (nilai 0 - 255)
const int CH_LEFT  = 0;
const int CH_RIGHT = 1;

GamepadPtr myGamepad = nullptr;
const int DEADZONE = 35;

void onConnectedGamepad(GamepadPtr gp) {
    if (myGamepad == nullptr) {
        Serial.printf("[CAR] Gamepad terhubung: %s\\n", gp->getModelName().c_str());
        // Beri warna hijau pada LED controller tanda siap jalan
        gp->setColorLED(0, 255, 0);
        myGamepad = gp;
    }
}

void onDisconnectedGamepad(GamepadPtr gp) {
    if (myGamepad == gp) {
        Serial.println("[CAR] Gamepad terputus! Motor EMERGENCY STOP!");
        stopMotors();
        myGamepad = nullptr;
    }
}

void setupMotors() {
    pinMode(PIN_AIN1, OUTPUT);
    pinMode(PIN_AIN2, OUTPUT);
    pinMode(PIN_BIN1, OUTPUT);
    pinMode(PIN_BIN2, OUTPUT);
    pinMode(PIN_STBY, OUTPUT);
    digitalWrite(PIN_STBY, HIGH); // Aktifkan TB6612FNG

    // Setup LEDC PWM Channels
    ledcAttachChannel(PIN_PWMA, PWM_FREQ, PWM_RES, CH_LEFT);
    ledcAttachChannel(PIN_PWMB, PWM_FREQ, PWM_RES, CH_RIGHT);

    stopMotors();
}

void setMotorLeft(int speed) {
    // speed: -255 s/d 255
    if (speed > 0) {
        digitalWrite(PIN_AIN1, HIGH);
        digitalWrite(PIN_AIN2, LOW);
        ledcWrite(PIN_PWMA, speed);
    } else if (speed < 0) {
        digitalWrite(PIN_AIN1, LOW);
        digitalWrite(PIN_AIN2, HIGH);
        ledcWrite(PIN_PWMA, abs(speed));
    } else {
        digitalWrite(PIN_AIN1, LOW);
        digitalWrite(PIN_AIN2, LOW);
        ledcWrite(PIN_PWMA, 0);
    }
}

void setMotorRight(int speed) {
    // speed: -255 s/d 255
    if (speed > 0) {
        digitalWrite(PIN_BIN1, HIGH);
        digitalWrite(PIN_BIN2, LOW);
        ledcWrite(PIN_PWMB, speed);
    } else if (speed < 0) {
        digitalWrite(PIN_BIN1, LOW);
        digitalWrite(PIN_BIN2, HIGH);
        ledcWrite(PIN_PWMB, abs(speed));
    } else {
        digitalWrite(PIN_BIN1, LOW);
        digitalWrite(PIN_BIN2, LOW);
        ledcWrite(PIN_PWMB, 0);
    }
}

void stopMotors() {
    setMotorLeft(0);
    setMotorRight(0);
}

void controlCar(GamepadPtr gp) {
    // Membaca stik kiri: Sumbu Y (Maju/Mundur), Sumbu X (Belok Kiri/Kanan)
    int rawY = -gp->axisY(); // Dibalik karena dorong ke atas bernilai negatif
    int rawX = gp->axisX();

    if (abs(rawY) < DEADZONE) rawY = 0;
    if (abs(rawX) < DEADZONE) rawX = 0;

    // Pemetaan nilai dari (-511..512) ke (-255..255)
    int throttle = map(rawY, -511, 512, -255, 255);
    int steering = map(rawX, -511, 512, -255, 255);

    // Hitung kecepatan diferensial roda kiri dan kanan
    int leftSpeed  = constrain(throttle + steering, -255, 255);
    int rightSpeed = constrain(throttle - steering, -255, 255);

    // Tombol Rem Darurat (Tombol B / Circle atau Rem L2)
    if ((gp->buttons() & BUTTON_B) || gp->brake() > 500) {
        stopMotors();
        gp->setRumble(128, 100); // Getar controller tanda rem darurat
        return;
    }

    setMotorLeft(leftSpeed);
    setMotorRight(rightSpeed);
}

void setup() {
    Serial.begin(115200);
    setupMotors();
    BP32.setup(&onConnectedGamepad, &onDisconnectedGamepad);
}

void loop() {
    BP32.update();

    if (myGamepad && myGamepad->isConnected()) {
        controlCar(myGamepad);
    } else {
        stopMotors();
    }

    delay(20);
}`,
      explanation: 'Sistem penggerak Arcade Drive menghitung leftSpeed = throttle + steering dan rightSpeed = throttle - steering secara real-time.'
    },
    {
      type: 'heading',
      level: 2,
      text: 'Pinout & GPIO Explorer'
    },
    {
      type: 'paragraph',
      content: `Periksa panduan pinout ESP32 di bawah ini untuk melihat pin mana saja yang aman digunakan untuk PWM motor dan sensor tanpa mengganggu Bluetooth:`
    },
    {
      type: 'pinout-explorer'
    },
    {
      type: 'quiz',
      question: 'Mengapa frekuensi PWM motor diset ke 20.000 Hz (20 kHz) pada fungsi ledcAttachChannel?',
      options: [
        'Agar baterai motor tidak cepat habis',
        'Karena frekuensi di atas 20 kHz berada di luar batas pendengaran manusia sehingga motor tidak menimbulkan bunyi dengungan bising',
        'Karena ESP32 hanya mampu memproses sinyal 20 kHz',
        'Untuk mempercepat koneksi Bluetooth'
      ],
      correctIndex: 1,
      explanation: 'Frekuensi PWM 20kHz berada di atas spektrum audio manusia (ultrasonik), menghasilkan perputaran motor yang sangat halus dan sunyi tanpa desingan mengganggu.'
    }
  ]
};
