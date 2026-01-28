# Simple Steps to Connect BBC Micro:bit

## 📋 Step-by-Step Instructions

### **Step 1: Prepare Your Micro:bit** (2 minutes)

1. **Get the code:**
   - In the web app, find the "BBC Micro:bit" panel
   - Click to expand "Micro:bit Code (MicroPython)"
   - **Copy all the code** shown there

2. **Flash the code:**
   - Go to: https://python.microbit.org/
   - Paste the code
   - Click "Download" or "Flash"
   - Connect Micro:bit via USB
   - Wait for download to finish

3. **Power on Micro:bit:**
   - Unplug from USB
   - Use battery pack or USB power bank
   - You should see a ✓ (checkmark) on the display

### **Step 2: Prepare Your Computer** (1 minute)

1. **Enable Bluetooth:**
   - **macOS:** Apple menu → System Settings → Bluetooth → ON
   - **Windows:** Settings → Devices → Bluetooth → ON

2. **Open the right browser:**
   - Use **Chrome** or **Edge** (required!)
   - Go to: **http://localhost:3002**

### **Step 3: Connect** (30 seconds)

1. In the web app, find **"BBC Micro:bit"** panel
2. Click **"Connect"** button
3. A window will pop up showing Bluetooth devices
4. Look for **"BBC micro:bit [xxxxx]"**
5. Click on it to select
6. Click **"Pair"** or **"Connect"**
7. Wait 3-5 seconds

### **Step 4: Verify Connection** ✅

You'll know it worked when you see:
- ✅ Green Bluetooth icon
- ✅ Device name appears (e.g., "BBC micro:bit")
- ✅ Status says "Ready to ring bell"

---

## 🐛 If It Doesn't Work

### **Quick Fixes (try in order):**

1. **"Micro:bit not found"**
   - Reset Micro:bit (press reset button)
   - Make sure it's powered on (not just plugged in)
   - Try again

2. **"Web Bluetooth not supported"**
   - Switch to Chrome or Edge browser
   - Make sure you're on localhost (not a remote address)

3. **"UART service not found"**
   - Re-flash the code to Micro:bit
   - Wait 5 seconds after flashing
   - Try connecting again

4. **"Connection failed"**
   - Disconnect in the app
   - Reset Micro:bit
   - Wait 10 seconds
   - Connect again

### **Still Not Working?**

1. Press **F12** in browser (opens developer console)
2. Look for **red error messages**
3. The error message will tell you exactly what's wrong

---

## ✅ Success Checklist

Before connecting, make sure:
- [ ] Micro:bit is powered on (battery/USB power)
- [ ] Code is flashed to Micro:bit
- [ ] Micro:bit shows ✓ when starting
- [ ] Computer Bluetooth is ON
- [ ] Using Chrome or Edge browser
- [ ] Web app is on localhost:3002

---

## 🎯 Test It Works

1. Click **"Test"** button in Bell Editor
2. Watch Micro:bit display → should show ❤ (heart icon)
3. If you see the heart, **it's working!** ✅

---

**That's it!** If you follow these steps, it should work. If not, check the error message and try the quick fixes above.
