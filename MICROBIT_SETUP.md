# BBC Micro:bit Connection Guide - Simple Steps

## ✅ Quick Setup (5 Steps)

### Step 1: Flash Code to Micro:bit

1. **Open MicroPython Editor:**
   - Go to: https://python.microbit.org/
   - Or use the MakeCode editor: https://makecode.microbit.org/

2. **Copy the Code:**
   - In the web app, click on "BBC Micro:bit" panel
   - Click to expand "Micro:bit Code (MicroPython)"
   - Copy the entire code shown there

3. **Flash to Micro:bit:**
   - Paste the code into the MicroPython editor
   - Click "Download" or "Flash"
   - Connect your Micro:bit via USB
   - The code will be transferred to your Micro:bit
   - Wait for the download to complete

### Step 2: Power On Micro:bit

- Make sure your Micro:bit is **powered on**
- You should see a checkmark (✓) briefly on the display when it starts
- The Micro:bit should be **unplugged from USB** (use battery pack or USB power bank)

### Step 3: Enable Bluetooth on Your Computer

**macOS:**
- Click Apple menu → System Settings → Bluetooth
- Turn Bluetooth ON
- Make sure your computer's Bluetooth is discoverable

**Windows:**
- Open Settings → Devices → Bluetooth
- Turn Bluetooth ON

### Step 4: Open the Web App

1. **Use Chrome or Edge browser** (required for Web Bluetooth)
2. Go to: **http://localhost:3002** (or whatever port your server is using)
3. Make sure you're on **localhost** (Web Bluetooth only works on localhost or HTTPS)

### Step 5: Connect Micro:bit

1. In the web app, find the **"BBC Micro:bit"** panel
2. Click the **"Connect"** button
3. A Bluetooth device selection window will appear
4. Look for **"BBC micro:bit [xxxxx]"** in the list
5. Click on your Micro:bit to select it
6. Click **"Pair"** or **"Connect"** in the browser dialog
7. Wait a few seconds for connection

**Success!** You should see:
- ✅ Bluetooth icon turns green
- ✅ Device name appears
- ✅ Status shows "Ready to ring bell"

## 🔧 Troubleshooting

### Error: "Web Bluetooth is not supported"

**Solution:**
- Use **Chrome** or **Edge** browser
- Firefox and Safari don't support Web Bluetooth
- Make sure you're on **localhost** (not a remote IP address)

### Error: "Micro:bit not found" or "No device selected"

**Solutions:**
1. **Check Micro:bit is powered on**
   - Micro:bit should show a checkmark when starting
   - If using USB, unplug and use battery pack instead

2. **Check Bluetooth is enabled**
   - Enable Bluetooth on your computer
   - Make sure it's discoverable

3. **Check Micro:bit is in pairing mode**
   - Reset Micro:bit (press reset button)
   - The code should be running (checkmark appears)

4. **Try pairing in system settings first**
   - Pair Micro:bit in macOS System Settings or Windows Settings
   - Then try connecting in the web app

5. **Check the code is flashed correctly**
   - Re-flash the MicroPython code
   - Make sure there are no errors in the editor

### Error: "UART service not found" or "TX characteristic not found"

**Solution:**
- The MicroPython code might not be flashed correctly
- Re-flash the code from the web app
- Make sure you're using the **exact code** shown in the Micro:bit Info panel

### Error: "Connection failed" or "GATT server not available"

**Solutions:**
1. **Reset Micro:bit**
   - Press the reset button on the back
   - Wait for it to restart (checkmark appears)

2. **Disconnect and reconnect**
   - Click disconnect in the web app
   - Wait 5 seconds
   - Try connecting again

3. **Restart browser**
   - Close the browser completely
   - Reopen and try again

4. **Check Micro:bit battery**
   - Low battery can cause connection issues
   - Try a fresh battery or USB power

### Micro:bit Connects But Bell Doesn't Ring

**Solutions:**
1. **Check hardware connection**
   - Pin 0 should be connected to your relay/buzzer
   - Check wiring is correct

2. **Test with a simple command**
   - Try the "Test" button in the Bell Editor
   - Check browser console for errors (F12 → Console)

3. **Check Micro:bit display**
   - When bell should ring, Micro:bit should show a heart icon
   - If no heart appears, command isn't reaching Micro:bit

## 📋 Pre-Connection Checklist

Before connecting, make sure:

- [ ] Micro:bit is powered on (battery pack or USB power)
- [ ] MicroPython code is flashed to Micro:bit
- [ ] Micro:bit shows checkmark when starting
- [ ] Computer Bluetooth is enabled
- [ ] Using Chrome or Edge browser
- [ ] Web app is running on localhost (not remote IP)
- [ ] No other apps are connected to the Micro:bit

## 🎯 Testing the Connection

1. **Connect Micro:bit** (follow steps above)
2. **Create a test bell:**
   - Add a bell with time set to 1 minute from now
   - Or click "Test" button in Bell Editor
3. **Watch for:**
   - Micro:bit display shows heart icon
   - Physical bell/buzzer activates (if connected)
   - Web app shows bell alert

## 💡 Tips

- **Keep Micro:bit close** to your computer (within 10 meters)
- **Avoid interference** - move away from WiFi routers
- **Use fresh batteries** for best connection
- **Restart if stuck** - reset Micro:bit and refresh browser
- **Check browser console** (F12) for detailed error messages

## 🔌 Hardware Setup (Optional)

If you want to connect a physical bell:

```
Micro:bit Pin 0 → Relay Module Input
Micro:bit GND → Relay Module GND  
Micro:bit 3V → Relay Module VCC (if needed)
Relay Output → Bell/Buzzer
```

**Note:** For testing, you can just use the Micro:bit's built-in display (heart icon) to verify it's working.

---

**Still having issues?** Check the browser console (F12) for detailed error messages and share them for help.
