import React, { useState } from 'react';
import { Cpu, CheckCircle2, AlertTriangle, XCircle, Search } from 'lucide-react';

const ESP32_PINS = [
  { gpio: 'GPIO 32', adc: 'ADC1_CH4', pwm: true, status: 'safe', desc: 'Sangat aman. Pin ADC1 berfungsi normal saat Bluetooth/WiFi aktif.', role: 'ADC1 / Touch / PWM / IO' },
  { gpio: 'GPIO 33', adc: 'ADC1_CH5', pwm: true, status: 'safe', desc: 'Sangat aman. Pin ADC1 berfungsi normal saat Bluetooth/WiFi aktif.', role: 'ADC1 / Touch / PWM / IO' },
  { gpio: 'GPIO 34', adc: 'ADC1_CH6', pwm: false, status: 'safe', desc: 'Hanya INPUT! Tidak memiliki internal pull-up/pull-down resistor.', role: 'Input Only / ADC1' },
  { gpio: 'GPIO 35', adc: 'ADC1_CH7', pwm: false, status: 'safe', desc: 'Hanya INPUT! Tidak memiliki internal pull-up/pull-down resistor.', role: 'Input Only / ADC1' },
  { gpio: 'GPIO 36 (VP)', adc: 'ADC1_CH0', pwm: false, status: 'safe', desc: 'Hanya INPUT! Cocok untuk sensor analog eksternal.', role: 'Input Only / ADC1' },
  { gpio: 'GPIO 39 (VN)', adc: 'ADC1_CH3', pwm: false, status: 'safe', desc: 'Hanya INPUT! Cocok untuk sensor analog eksternal.', role: 'Input Only / ADC1' },
  { gpio: 'GPIO 16', adc: 'None', pwm: true, status: 'safe', desc: 'Aman untuk PWM Motor, Relay, LED, UART2 RX.', role: 'PWM / UART2 RX / IO' },
  { gpio: 'GPIO 17', adc: 'None', pwm: true, status: 'safe', desc: 'Aman untuk PWM Motor, Relay, LED, UART2 TX.', role: 'PWM / UART2 TX / IO' },
  { gpio: 'GPIO 18', adc: 'None', pwm: true, status: 'safe', desc: 'Default VSPI SCK. Sangat direkomendasikan untuk PWM Motor L298N/TB6612.', role: 'SPI SCK / PWM / IO' },
  { gpio: 'GPIO 19', adc: 'None', pwm: true, status: 'safe', desc: 'Default VSPI MISO. Sangat aman untuk Direction Motor.', role: 'SPI MISO / PWM / IO' },
  { gpio: 'GPIO 21', adc: 'None', pwm: true, status: 'safe', desc: 'Default I2C SDA (OLED Display / MPU6050 Gyro). Sangat aman.', role: 'I2C SDA / PWM / IO' },
  { gpio: 'GPIO 22', adc: 'None', pwm: true, status: 'safe', desc: 'Default I2C SCL (OLED Display / MPU6050 Gyro). Sangat aman.', role: 'I2C SCL / PWM / IO' },
  { gpio: 'GPIO 23', adc: 'None', pwm: true, status: 'safe', desc: 'Default VSPI MOSI. Sangat aman untuk PWM / Direction Motor.', role: 'SPI MOSI / PWM / IO' },
  { gpio: 'GPIO 25', adc: 'ADC2_CH8', pwm: true, status: 'restricted', desc: 'DAC1 / ADC2. JANGAN gunakan analogRead() saat Bluetooth Bluepad32 aktif! Aman sebagai Digital/PWM.', role: 'DAC1 / ADC2 / PWM' },
  { gpio: 'GPIO 26', adc: 'ADC2_CH9', pwm: true, status: 'restricted', desc: 'DAC2 / ADC2. JANGAN gunakan analogRead() saat Bluetooth Bluepad32 aktif! Aman sebagai Digital/PWM.', role: 'DAC2 / ADC2 / PWM' },
  { gpio: 'GPIO 27', adc: 'ADC2_CH7', pwm: true, status: 'restricted', desc: 'ADC2. Jangan gunakan analogRead() saat BT aktif. Aman untuk PWM/Digital.', role: 'ADC2 / Touch / PWM' },
  { gpio: 'GPIO 0', adc: 'ADC2_CH1', pwm: true, status: 'caution', desc: 'Pin Strapping! Harus HIGH saat booting. Terhubung ke tombol BOOT.', role: 'Strapping Pin / Boot Mode' },
  { gpio: 'GPIO 2', adc: 'ADC2_CH2', pwm: true, status: 'caution', desc: 'Pin Strapping & Onboard LED. Harus LOW atau floating saat booting.', role: 'Strapping Pin / LED Onboard' },
  { gpio: 'GPIO 12', adc: 'ADC2_CH5', pwm: true, status: 'caution', desc: 'Pin Strapping MTDI! Jika HIGH saat boot, ESP32 crash / gagal flash.', role: 'Strapping Pin / MTDI' },
  { gpio: 'GPIO 15', adc: 'ADC2_CH3', pwm: true, status: 'caution', desc: 'Pin Strapping MTDO! Mengatur output debug ROM bootloader.', role: 'Strapping Pin / MTDO' },
  { gpio: 'GPIO 6 - 11', adc: 'None', pwm: false, status: 'danger', desc: 'DILARANG DIGUNAKAN! Terhubung langsung ke chip Flash Memory internal SPI.', role: 'Integrated SPI Flash (Do Not Use)' },
];

export default function PinoutExplorer() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredPins = ESP32_PINS.filter((pin) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'safe' && pin.status === 'safe') ||
      (filter === 'pwm' && pin.pwm && pin.status !== 'danger') ||
      (filter === 'adc1' && pin.adc.includes('ADC1')) ||
      (filter === 'adc2' && pin.adc.includes('ADC2')) ||
      (filter === 'strapping' && pin.status === 'caution');

    const matchesSearch =
      pin.gpio.toLowerCase().includes(search.toLowerCase()) ||
      pin.role.toLowerCase().includes(search.toLowerCase()) ||
      pin.desc.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pinout-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu size={18} color="var(--primary)" />
          <h4 style={{ margin: 0 }}>ESP32 Interactive Pinout & Safety Guide</h4>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-surface-elevated)', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Cari GPIO..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      <div className="pinout-filters">
        <button className={`pin-filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          Semua Pin
        </button>
        <button className={`pin-filter-btn ${filter === 'safe' ? 'active' : ''}`} onClick={() => setFilter('safe')}>
          ✅ Sangat Aman
        </button>
        <button className={`pin-filter-btn ${filter === 'pwm' ? 'active' : ''}`} onClick={() => setFilter('pwm')}>
          ⚡ PWM Output (Motor/LED)
        </button>
        <button className={`pin-filter-btn ${filter === 'adc1' ? 'active' : ''}`} onClick={() => setFilter('adc1')}>
          🟢 ADC1 (Aman Saat Bluetooth ON)
        </button>
        <button className={`pin-filter-btn ${filter === 'adc2' ? 'active' : ''}`} onClick={() => setFilter('adc2')}>
          🔴 ADC2 (Konflik Bluetooth)
        </button>
        <button className={`pin-filter-btn ${filter === 'strapping' ? 'active' : ''}`} onClick={() => setFilter('strapping')}>
          ⚠️ Strapping Pins
        </button>
      </div>

      <div className="pinout-grid">
        {filteredPins.map((pin) => (
          <div
            key={pin.gpio}
            className={`pin-card ${
              pin.status === 'safe'
                ? 'pin-safe'
                : pin.status === 'caution'
                ? 'pin-caution'
                : 'pin-restricted'
            }`}
          >
            <div className="pin-header">
              <span className="pin-name">{pin.gpio}</span>
              <span className={`pin-status-tag ${pin.status}`}>
                {pin.status === 'safe' ? 'Aman' : pin.status === 'caution' ? 'Perhatian' : pin.status === 'danger' ? 'Bahaya' : 'Restriksi ADC'}
              </span>
            </div>
            <div className="pin-functions">{pin.role}</div>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {pin.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
