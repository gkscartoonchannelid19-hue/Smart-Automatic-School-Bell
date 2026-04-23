# ESP-32 Quick Start (5 Minutes)

## ⚡ TL;DR - 3 Steps to Get Running

### Step 1: Setup ESP-32 Board in Arduino IDE (2 min)
```
1. Download Arduino IDE: https://www.arduino.cc/en/software
2. File → Preferences → Add to "Additional Board Manager URLs":
   https://dl.espressif.com/dl/package_esp32_index.json
3. Tools → Board Manager → Search "ESP32" → Install "ESP32 by Espressif Systems"
```

### Step 2: Flash Code to ESP-32 (2 min)
```
1. Connect ESP-32 via USB
2. Copy code from ESP-32 Info panel in web app
3. Paste into Arduino IDE
4. Change WiFi SSID and password
5. Tools → Board → "ESP32 Dev Module"
6. Tools → Port → Select your port
7. Click Upload (→ button)
8. Wait for "Upload complete"
```

### Step 3: Connect from Web App (1 min)
```
1. Open web app in Chrome/Edge/Opera
2. Click "Connect" button in ESP-32 section
3. Select your ESP-32 from port list
4. Click "Connect"
5. Done! Status shows "Ready to ring bell"
```

---

## 🔌 Hardware Wiring

```
ESP-32 GPIO5 ----→ Relay Input
ESP-32 GND   ----→ Relay GND
ESP-32 3.3V  ----→ Relay VCC
Relay COM    ----→ Bell +
Relay NO     ----→ Bell -
```

---

## 🔧 Common Issues

| Problem | Solution |
|---------|----------|
| "No ports found" | Install CP2102 driver: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers |
| "Upload failed" | Press BOOT button on ESP-32 while uploading |
| "Connection works but bell doesn't ring" | Check GPIO5 wiring, verify relay power |
| "Web Serial not supported" | Use Chrome, Edge, or Opera (not Firefox/Safari) |
| "Port in use" | Close Arduino IDE Serial Monitor |

---

## 📝 Minimal Arduino Code Example

```cpp
#include <HardwareSerial.h>

const int BUZZER_PIN = 5;

void setup() {
  Serial.begin(115200);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    
    if (cmd.startsWith("RING:")) {
      int duration = cmd.substring(5).toInt();
      ringBell(duration);
    }
  }
}

void ringBell(int seconds) {
  int endTime = millis() + (seconds * 1000);
  while (millis() < endTime) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(250);
    digitalWrite(BUZZER_PIN, LOW);
    delay(250);
  }
}
```

---

## ✅ Verification Checklist

Before connecting from web app:
- [ ] Arduino code uploaded successfully
- [ ] ESP-32 restarts without errors (check Serial Monitor)
- [ ] USB cable is connected to computer
- [ ] Using Chrome, Edge, or Opera browser
- [ ] Relay/buzzer wiring is correct

---

## 📚 More Information

- **Detailed Setup**: See `ESP32_SETUP.md`
- **Migration Guide**: See `MIGRATION_MICROBIT_TO_ESP32.md`
- **Full Docs**: See `README.md`

---

**You're ready! Open the web app and click "Connect" in the ESP-32 section.** 🎉
