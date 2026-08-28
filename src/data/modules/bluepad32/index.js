import { bab1Intro } from './bab1-intro.js';
import { bab2Setup } from './bab2-setup.js';
import { bab3PairingInput } from './bab3-pairing-input.js';
import { bab4RcCar } from './bab4-rc-car.js';
import { bab5LedRumble } from './bab5-led-rumble.js';
import { bab6Troubleshooting } from './bab6-troubleshooting.js';

export const bluepad32Module = {
  id: 'bluepad32',
  title: 'ESP32 & Bluepad32 Masterclass',
  shortTitle: 'Bluepad32 Gamepad',
  description: 'Panduan terlengkap menghubungkan gamepad Bluetooth (PS4, PS5, Xbox, Nintendo Switch, 8BitDo) ke ESP32 untuk proyek robotika, RC car, dan kontroler interaktif.',
  icon: 'Gamepad2',
  badge: 'Modul Utama',
  color: '#00f2fe',
  level: 'Semua Tingkat',
  totalDuration: '68 min',
  chapters: [
    bab1Intro,
    bab2Setup,
    bab3PairingInput,
    bab4RcCar,
    bab5LedRumble,
    bab6Troubleshooting,
  ],
};
