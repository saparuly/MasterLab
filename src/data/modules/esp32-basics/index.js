export const esp32BasicsModule = {
  id: 'esp32-basics',
  title: 'ESP32 Hardware & GPIO Fundamental',
  shortTitle: 'ESP32 Dasar',
  description: 'Memahami arsitektur internal Dual-Core Xtensa, GPIO Pinout, Interrupts, Timers, dan Hardware PWM (LEDC).',
  icon: 'Cpu',
  badge: 'Fundamental',
  color: '#9d4edd',
  level: 'Pemula',
  totalDuration: '30 min',
  chapters: [
    {
      id: 'esp32-basics-bab-1',
      moduleId: 'esp32-basics',
      title: 'Bab 1: Arsitektur Dual-Core Xtensa & Manajemen Memori',
      subtitle: 'Mengenal CPU Core 0 vs Core 1, Flash ROM, SRAM, dan FreeRTOS bawaan ESP32.',
      readingTime: '10 min',
      level: 'Pemula',
      tags: ['Arsitektur', 'Xtensa', 'Dual-Core', 'FreeRTOS', 'SRAM'],
      hardwareNeeded: ['ESP32 DevKit V1 Board'],
      prerequisites: ['Dasar mikrokontroler'],
      sections: [
        {
          type: 'paragraph',
          content: 'Chip ESP32 adalah SoC (System on Chip) 32-bit yang sangat bertenaga dengan dua inti prosesor **Xtensa LX6** yang dapat berjalan hingga kecepatan 240 MHz.'
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Core 0 vs Core 1',
          text: 'Secara default pada Arduino ESP32, Core 0 didedikasikan untuk menangani protokol wireless (WiFi & Bluetooth stack), sementara Core 1 menjalankan fungsi setup() dan loop() program kamu.'
        },
        {
          type: 'heading',
          level: 2,
          text: 'Cek Informasi Hardware ESP32 Lewat Kode'
        },
        {
          type: 'code',
          language: 'cpp',
          filename: 'ESP32_Chip_Info.ino',
          code: `void setup() {
    Serial.begin(115200);
    delay(1000);

    Serial.println("=== INFORMASI CHIP ESP32 ===");
    Serial.printf("Model Chip: %s\\n", ESP.getChipModel());
    Serial.printf("Jumlah Core: %d\\n", ESP.getChipCores());
    Serial.printf("CPU Frequency: %d MHz\\n", ESP.getCpuFreqMHz());
    Serial.printf("Flash Chip Size: %d MB\\n", ESP.getFlashChipSize() / (1024 * 1024));
    Serial.printf("Free Heap RAM: %d KB\\n", ESP.getFreeHeap() / 1024);
}

void loop() {
    // Menampilkan Core yang sedang mengeksekusi kode
    Serial.printf("Loop berjalan di Core ID: %d\\n", xPortGetCoreID());
    delay(3000);
}`
        },
        {
          type: 'quiz',
          question: 'Pada ESP32 Arduino Core, dimanakah fungsi loop() secara default dieksekusi?',
          options: [
            'Core 0',
            'Core 1',
            'ULP (Ultra Low Power Co-processor)',
            'Eksternal Coprocessor'
          ],
          correctIndex: 1,
          explanation: 'Core 0 digunakan untuk background WiFi/BT tasks, dan Core 1 digunakan untuk mengeksekusi kode Arduino user (setup dan loop).'
        }
      ]
    },
    {
      id: 'esp32-basics-bab-2',
      moduleId: 'esp32-basics',
      title: 'Bab 2: GPIO Output, Input Pull-Up & Hardware PWM (LEDC)',
      subtitle: 'Mengontrol aktuator dan membaca tombol dengan aman serta mengontrol intensitas LED menggunakan LEDC channel.',
      readingTime: '15 min',
      level: 'Pemula',
      tags: ['GPIO', 'LEDC', 'PWM', 'Input Pullup', 'Hardware'],
      hardwareNeeded: [
        'ESP32 Board',
        '1x LED 5mm + Resistor 220 Ohm',
        '1x Push Button',
        'Breadboard & Kabel Jumper'
      ],
      prerequisites: ['Bab 1 Arsitektur ESP32'],
      sections: [
        {
          type: 'paragraph',
          content: 'ESP32 tidak menggunakan fungsi `analogWrite()` standar seperti Arduino Uno lama. Sebagai gantinya, ESP32 memiliki hardware perifer canggih bernama **LEDC (LED Control)** dengan 16 channel PWM independen.'
        },
        {
          type: 'code',
          language: 'cpp',
          filename: 'ESP32_LEDC_Fade.ino',
          code: `const int LED_PIN = 2; // LED Onboard ESP32
const int FREQ = 5000;
const int RES = 8;     // 8-bit = 0 s/d 255

void setup() {
    ledcAttachChannel(LED_PIN, FREQ, RES, 0);
}

void loop() {
    // Fade in
    for (int duty = 0; duty <= 255; duty += 5) {
        ledcWrite(LED_PIN, duty);
        delay(15);
    }
    // Fade out
    for (int duty = 255; duty >= 0; duty -= 5) {
        ledcWrite(LED_PIN, duty);
        delay(15);
    }
}`
        }
      ]
    }
  ]
};
