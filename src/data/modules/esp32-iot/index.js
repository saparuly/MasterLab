export const esp32IotModule = {
  id: 'esp32-iot',
  title: 'ESP32 IoT & Wireless Networking',
  shortTitle: 'ESP32 IoT',
  description: 'Membangun Web Server Asinkron, Komunikasi MQTT Dashboard, dan Kontrol Smart Home nirkabel.',
  icon: 'Wifi',
  badge: 'Networking',
  color: '#10b981',
  level: 'Menengah',
  totalDuration: '25 min',
  chapters: [
    {
      id: 'esp32-iot-bab-1',
      moduleId: 'esp32-iot',
      title: 'Bab 1: Membuat Web Server Pengendali Relay via WiFi',
      subtitle: 'Membuat web control panel interaktif di browser untuk mengontrol lampu/relay dari smartphone atau laptop lokal.',
      readingTime: '12 min',
      level: 'Menengah',
      tags: ['WiFi', 'WebServer', 'Relay', 'HTML', 'IoT'],
      hardwareNeeded: ['ESP32 DevKit', 'Modul Relay 1-Channel / 2-Channel', 'Smartphone / PC'],
      prerequisites: ['Dasar GPIO ESP32'],
      sections: [
        {
          type: 'paragraph',
          content: 'ESP32 dapat bertindak sebagai Web Server mandiri dalam mode **Station (STA)** terhubung ke router WiFi rumah atau mode **Access Point (AP)** memancarkan sinyal hotspot sendiri.'
        },
        {
          type: 'code',
          language: 'cpp',
          filename: 'ESP32_Simple_WebServer.ino',
          code: `#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "NAMA_WIFI_KAMU";
const char* password = "PASSWORD_WIFI";

WebServer server(80);
const int RELAY_PIN = 23;
bool relayState = false;

void handleRoot() {
    String html = "<html><head><title>ESP32 Relay</title></head>";
    html += "<body style='font-family:sans-serif; text-align:center; padding-top:50px;'>";
    html += "<h2>ESP32 Smart Switch</h2>";
    html += "<p>Status Relay: <b>" + String(relayState ? "ON" : "OFF") + "</b></p>";
    html += "<a href='/toggle'><button style='padding:15px 30px; font-size:18px; border-radius:8px;'>TOGGLE</button></a>";
    html += "</body></html>";
    server.send(200, "text/html", html);
}

void handleToggle() {
    relayState = !relayState;
    digitalWrite(RELAY_PIN, relayState ? LOW : HIGH); // Active Low Relay
    server.sendHeader("Location", "/");
    server.send(303);
}

void setup() {
    Serial.begin(115200);
    pinMode(RELAY_PIN, OUTPUT);
    digitalWrite(RELAY_PIN, HIGH);

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.printf("\\nWiFi Terhubung! Buka IP ini di browser: %s\\n", WiFi.localIP().toString().c_str());

    server.on("/", handleRoot);
    server.on("/toggle", handleToggle);
    server.begin();
}

void loop() {
    server.handleClient();
}`
        }
      ]
    }
  ]
};
