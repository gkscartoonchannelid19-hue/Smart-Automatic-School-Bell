# ESP-32 Connection Guide - Simple Steps

## ✅ Quick Setup (5 Steps)

### Step 1: Flash Code to ESP-32

1. **Download Arduino IDE:**
   - Go to: https://www.arduino.cc/en/software
   - Download and install for your OS

2. **Add ESP-32 Board:**
   - Open Arduino IDE → File → Preferences
   - In "Additional Board Manager URLs" field, add:
     ```
     https://dl.espressif.com/dl/package_esp32_index.json
     ```
   - Go to Tools → Board Manager
   - Search for "ESP32" and install "ESP32 by Espressif Systems"

3. **Install CH340/CP2102 Driver (if needed):**
   - If your ESP-32 uses CP2102 or CH340 USB chip:
   - **Windows/Mac/Linux:** https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers
   - Restart your computer after installing

4. **Flash the Code:**
   - Connect ESP-32 via USB cable
   - Copy the Arduino code from the web app (ESP-32 Setup section)
   - Paste into Arduino IDE
   - Modify WiFi credentials (ssid and password)
   - Select correct board:
     - Tools → Board → ESP32 → "ESP32 Dev Module" (or your specific variant)
   - Select correct port:
     - Tools → Port → (select your ESP-32, usually COM3-COM9 on Windows, /dev/ttyUSB0 on Linux)
   - Click **Upload** button (→ icon)
   - Wait for "Upload complete" message

### Step 2: Verify ESP-32 is Running

1. **Check Serial Output (optional):**
   - Open Tools → Serial Monitor
   - Set baud rate to **115200**
   - Press ESP-32 reset button
   - You should see boot messages and WiFi connection info

2. **If WiFi connection fails:**
   - Make sure WiFi credentials in code are correct
   - Check WiFi signal strength near ESP-32
   - Restart ESP-32

### Step 3: Enable Web Serial in Browser

**Chrome/Edge/Opera:**
- Web Serial is built-in and enabled by default
- Make sure you're on the latest version

**Firefox/Safari:**
- Web Serial API is NOT supported
- Please use Chrome, Edge, or Opera instead

### Step 4: Connect from Web App

1. **Open the web app** in Chrome, Edge, or Opera
2. **Find the ESP-32 section** on the right side
3. Click the **"Connect" button**
4. A dialog will pop up showing available COM ports
5. Look for your **ESP-32 device** (usually labeled "CP2102 USB to UART" or "Silicon Labs CP210x")
6. Click to select it
7. Click **"Connect"** button in the dialog
8. Wait 2-3 seconds

### Step 5: Test the Connection ✅

You'll know it worked when you see:
- ✅ Blue icon showing connected status
- ✅ Port name appears (e.g., "ESP-32 (COM3)")
- ✅ Status says "Ready to ring bell"

**Test it works:**
1. Click the **"Test" button** in Bell Editor
2. ESP-32 should receive the RING command
3. Relay/Buzzer should activate (if wired)
4. Web app shows bell alert

---

## 🔌 Hardware Setup

If you want to ring a physical bell:

```
ESP-32 GPIO5 (D5) → Relay Module Input
ESP-32 GND        → Relay Module GND
ESP-32 3.3V       → Relay Module VCC (if needed)
Relay Output      → Bell/Buzzer
```

**Relay Module Connections:**
- VCC: 3.3V from ESP-32
- GND: GND from ESP-32
- IN: GPIO5 from ESP-32
- COM: Positive wire of bell
- NO: Other side of bell

---

## 🐛 Troubleshooting

### Error: "Web Serial is not supported"

**Solution:**
- Use **Chrome**, **Edge**, or **Opera** browser
- Firefox and Safari don't support Web Serial API
- Make sure your browser is up to date

### Error: "No ports available" or "Port list is empty"

**Solutions:**
1. **Check USB connection:**
   - Make sure USB cable is properly connected to ESP-32
   - Try a different USB port on your computer
   - Try a different USB cable (some are charge-only)

2. **Install USB driver:**
   - ESP-32 boards use CP2102 or CH340 chips
   - Download driver: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers
   - Install and restart computer

3. **Check in Device Manager (Windows):**
   - Plug in ESP-32
   - Right-click Start → Device Manager
   - Expand "Ports (COM & LPT)"
   - Look for "Silicon Labs CP210x" or similar
   - If it shows a warning/error, right-click → Update driver

### Error: "Port is already in use"

**Solutions:**
1. Close Arduino IDE Serial Monitor
2. Close any other terminal/serial apps
3. Refresh the web app browser (Ctrl+R or Cmd+R)
4. Try connecting again

### Error: "Connection succeeded but command not received"

**Solutions:**
1. **Check Arduino code:**
   - Make sure you uploaded the correct code to ESP-32
   - Check WiFi credentials match your network
   - Open Serial Monitor to see boot messages

2. **Check wiring:**
   - Verify GPIO5 is connected to relay
   - Check relay is powered correctly
   - Test relay manually with 3.3V power

3. **Check baud rate:**
   - Code must use 115200 baud rate
   - Browser also uses 115200 (automatic)

### ESP-32 won't upload code

**Solutions:**
1. **Check board selection:**
   - Tools → Board → ESP32 → "ESP32 Dev Module"
   - (Or your specific board variant)

2. **Check port selection:**
   - Tools → Port → (select COM port)

3. **Try bootloader mode:**
   - Hold BOOT button on ESP-32
   - Click Upload
   - Release BOOT button when "Connecting..." appears

4. **Disconnect other devices:**
   - Some USB hubs cause issues
   - Try connecting directly to computer

### No data in Serial Monitor

**Check:**
1. Board is selected correctly
2. Port is selected correctly
3. Baud rate is set to 115200
4. ESP-32 is powered (red LED should be on)
5. Code doesn't have Serial.println() in setup() before delay

---

## 📋 Pre-Connection Checklist

Before connecting, make sure:

- [ ] Arduino code is flashed to ESP-32
- [ ] ESP-32 boots successfully (check Serial Monitor)
- [ ] USB driver is installed (if needed)
- [ ] Using Chrome, Edge, or Opera browser
- [ ] Web app is running
- [ ] ESP-32 USB cable is connected to computer
- [ ] No other app is using the serial port

---

## 💡 Tips for Best Results

- **Keep ESP-32 close:** No distance limitation (unlike Bluetooth)
- **USB cable quality:** Use a good quality USB cable (some are charge-only)
- **Power:** Ensure ESP-32 has stable power (3.3V)
- **Relay:** Use a relay module rated for your bell voltage
- **Serial Monitor:** Keep it closed when web app is using serial port
- **Browser console:** Press F12 to see detailed error messages

---

## 🔧 Advancing Your Setup

### Add WiFi Web Interface (Optional)

You can create a web dashboard to control the bell from any device on your WiFi:

```cpp
#include <WebServer.h>

WebServer server(80);

void handleRoot() {
  server.send(200, "text/html", "<h1>Ring Bell</h1><button onclick='fetch(\"/ring\")'>Ring</button>");
}

void handleRing() {
  ringBell(3);
  server.send(200, "text/plain", "Ringing...");
}

void setup() {
  // ... existing code ...
  
  server.on("/", handleRoot);
  server.on("/ring", handleRing);
  server.begin();
}

void loop() {
  server.handleClient();
  // ... existing code ...
}
```

### Add Status Reporting

Monitor ESP-32 status in the web app:

```cpp
void loop() {
  // ... existing code ...
  
  // Send WiFi status every 10 seconds
  if (millis() % 10000 == 0) {
    Serial.println("STATUS:CONNECTED");
  }
}
```

---

**Still having issues?** Check the browser console (F12) for detailed error messages and share them for help!
