export const bab6Troubleshooting = {
  id: 'bluepad32-bab-6',
  moduleId: 'bluepad32',
  title: 'Bab 6: Troubleshooting & Tips Stabilitas Bluetooth',
  subtitle: 'Solusi masalah umum: Larangan ADC2 saat Bluetooth aktif, Brownout Reset, Pin Strapping ESP32, dan koneksi terputus-putus.',
  readingTime: '9 min',
  level: 'Semua Tingkat',
  tags: ['Troubleshooting', 'ADC2', 'Brownout', 'Strapping Pins', 'Hardware Tips'],
  hardwareNeeded: [
    'ESP32 Board',
    'Kapasitor Elektrolit 100uF - 470uF (opsional untuk filter tegangan)',
    'Multimeter / Logic Analyzer (opsional)'
  ],
  prerequisites: ['Telah menyelesaikan modul Bluepad32'],
  sections: [
    {
      type: 'paragraph',
      content: `Saat membuat proyek robot atau perangkat IoT dengan ESP32 dan Bluetooth, seringkali muncul kendala yang membingungkan seperti ESP32 me-restart sendiri (Brownout), pembacaan sensor analog bernilai 0 atau 4095 saat Bluetooth aktif, atau sketch gagal di-upload. Bab ini merangkum solusi teknisnya.`
    },
    {
      type: 'heading',
      level: 2,
      text: '1. Masalah Kritis: Konflik ADC2 dengan Bluetooth / WiFi'
    },
    {
      type: 'callout',
      variant: 'danger',
      title: 'Pantangan Utama ADC2!',
      text: 'Hardware ADC2 (Analog to Digital Converter 2) pada ESP32 digunakan secara internal oleh modul radio RF WiFi dan Bluetooth. Saat Bluetooth (Bluepad32) aktif, fungsi analogRead() pada pin ADC2 TIDAK BISA DIGUNAKAN!'
    },
    {
      type: 'paragraph',
      content: `Gunakan pin **ADC1** untuk semua sensor analog (potensiometer, sensor jarak, sensor tegangan baterai):`
    },
    {
      type: 'steps',
      steps: [
        {
          title: 'Pin ADC1 (AMAN Digunakan)',
          description: 'GPIO 32, GPIO 33, GPIO 34, GPIO 35, GPIO 36 (VP), GPIO 39 (VN).'
        },
        {
          title: 'Pin ADC2 (HINDARI untuk analogRead)',
          description: 'GPIO 0, GPIO 2, GPIO 4, GPIO 12, GPIO 13, GPIO 14, GPIO 15, GPIO 25, GPIO 26, GPIO 27. (Catatan: Pin-pin ini masih bisa digunakan sebagai Digital I/O biasa atau PWM, asalkan BUKAN analogRead).'
        }
      ]
    },
    {
      type: 'heading',
      level: 2,
      text: '2. Brownout Detector Reset (ESP32 Me-restart Sendiri)'
    },
    {
      type: 'paragraph',
      content: `Pesan error di Serial Monitor: \`Brownout detector was triggered\` terjadi karena tegangan suplai 3.3V turun sesaat di bawah 2.8V akibat lonjakan arus saat modul Bluetooth mengirim paket radio atau saat motor DC mulai berputar.`
    },
    {
      type: 'steps',
      steps: [
        {
          title: 'Gunakan Regulator 5V / BEC Eksternal',
          description: 'Beri daya motor dan driver secara terpisah dari baterai melalui regulator buck DC-DC (misal LM2596 atau Mini 360).'
        },
        {
          title: 'Tambahkan Kapasitor Decoupling',
          description: 'Pasang kapasitor elektrolit 100uF - 470uF secara paralel antara pin VIN/3V3 dan GND pada ESP32 untuk menyerap drop tegangan instan.'
        },
        {
          title: 'Gunakan Kabel USB Berkualitas',
          description: 'Kabel data USB yang tipis atau panjang memiliki resistansi tinggi yang menyebabkan penurunan tegangan (voltage drop).'
        }
      ]
    },
    {
      type: 'heading',
      level: 2,
      text: '3. Memperhatikan Pin Strapping ESP32'
    },
    {
      type: 'paragraph',
      content: `Beberapa GPIO menentukan mode booting chip ESP32 saat pertama kali dinyalakan. Hindari menarik pin ini ke tegangan yang salah saat start:`
    },
    {
      type: 'steps',
      steps: [
        {
          title: 'GPIO 0',
          description: 'Harus HIGH saat booting normal (menjadi LOW hanya saat mode download flashing firmware).'
        },
        {
          title: 'GPIO 2',
          description: 'Harus LOW atau floating saat booting.'
        },
        {
          title: 'GPIO 12 (MTDI)',
          description: 'Jika ditarik HIGH saat booting, tegangan internal flash berubah dari 3.3V ke 1.8V dan ESP32 akan crash (bootloop).'
        },
        {
          title: 'GPIO 15',
          description: 'Mengontrol debug log ROM bootloader.'
        }
      ]
    },
    {
      type: 'heading',
      level: 2,
      text: 'Cek Panduan Pinout Lengkap Interaktif'
    },
    {
      type: 'pinout-explorer'
    },
    {
      type: 'quiz',
      question: 'Pin ADC manakah yang AMAN digunakan untuk membaca sensor analog saat Bluetooth Bluepad32 aktif?',
      options: [
        'GPIO 4 dan GPIO 2 (ADC2)',
        'GPIO 32, GPIO 33, GPIO 34, GPIO 35 (ADC1)',
        'GPIO 25 dan GPIO 26 (ADC2)',
        'GPIO 12 dan GPIO 14 (ADC2)'
      ],
      correctIndex: 1,
      explanation: 'Pin ADC1 (GPIO 32 - 39) memiliki konverter analog terpisah yang tidak terganggu oleh modul radio Bluetooth/WiFi ESP32.'
    }
  ]
};
