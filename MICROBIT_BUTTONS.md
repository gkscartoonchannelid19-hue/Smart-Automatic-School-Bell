# Micro:bit Buttons Guide - How to Start Pairing

## 🔘 Micro:bit Buttons Explained

### **Reset Button** (On the BACK of Micro:bit)
- **Location:** Small button on the back, near the USB port
- **What it does:** Restarts the Micro:bit (like rebooting a computer)
- **When to use:** 
  - If Micro:bit is frozen
  - If you need to restart the code
  - If pairing isn't working

### **Button A** (On the FRONT, left side)
- **Location:** Left button on the front of Micro:bit
- **What it does:** In our code, pressing this starts Bluetooth pairing mode
- **When to use:** Press this to make Micro:bit ready for pairing

### **Button B** (On the FRONT, right side)
- **Location:** Right button on the front of Micro:bit
- **What it does:** Not used in our code (but you can add features)
- **When to use:** Not needed for pairing

---

## ✅ Step-by-Step: How to Start Pairing

### **Method 1: Using Button A (Recommended)**

1. **Flash the code** to your Micro:bit
2. **Power on Micro:bit** (battery pack or USB power)
3. **Wait for display to show:**
   - ✓ (checkmark) - code is loaded
   - "READY" scrolling text
   - **"A"** letter - this means "Press button A"
4. **Press Button A** (left button on front)
5. **Micro:bit will show:** 😊 (happy face)
6. **Now it's ready for pairing!**
7. **Go to web app** and click "Connect"

### **Method 2: Auto-Start (No Button Press)**

1. **Flash the code** to your Micro:bit
2. **Power on Micro:bit**
3. **Wait 5 seconds** (code will auto-start)
4. **Go to web app** and click "Connect"

---

## 🔄 If Pairing Still Doesn't Work

### **Step 1: Reset Micro:bit**
1. **Press RESET button** (on the back)
2. **Wait for checkmark** to appear
3. **Press Button A** (if you see "A" on display)
4. **Try connecting** in web app

### **Step 2: Check What You See on Display**

**✅ Good Signs:**
- ✓ Checkmark appears
- "READY" text scrolls
- "A" letter appears (means ready for button press)
- 😊 Happy face (after pressing A)

**❌ Bad Signs:**
- ❌ X mark (error)
- Blank display (code not running)
- Constantly scrolling text (stuck in loop)

**If you see bad signs:**
1. **Re-flash the code**
2. **Press RESET button**
3. **Try again**

---

## 🎯 Quick Troubleshooting

### **"I don't see Button A instruction"**
- **Wait 2-3 seconds** after the checkmark
- The "A" should appear
- If not, **press RESET** and try again

### **"I pressed Button A but nothing happened"**
- **Check the display** - should show 😊
- **Wait 2 seconds** after pressing
- **Try connecting** in web app
- If still not working, **press RESET** and try again

### **"Micro:bit shows error (X mark)"**
- **Re-flash the code** - something went wrong
- Make sure you copied the **entire code**
- **Press RESET** after flashing

### **"Display is blank"**
- **Check power** - Micro:bit might not be powered on
- **Press RESET** button
- **Re-flash code** if still blank

---

## 📱 Visual Guide

```
Micro:bit Front View:
┌─────────────────┐
│  [A]      [B]   │  ← Buttons A and B
│                 │
│   [Display]     │  ← LED display
│                 │
└─────────────────┘

Micro:bit Back View:
┌─────────────────┐
│                 │
│    [RESET]      │  ← Reset button (small)
│                 │
│    [USB Port]   │
└─────────────────┘
```

---

## ✅ Success Checklist

Before trying to pair:

- [ ] Code is flashed to Micro:bit
- [ ] Micro:bit is powered on (battery/USB)
- [ ] You see ✓ checkmark on display
- [ ] You see "READY" text (or "A" letter)
- [ ] You pressed Button A (or waited 5 seconds)
- [ ] You see 😊 happy face (or display is clear)
- [ ] Bluetooth is ON on your computer
- [ ] Using Chrome or Edge browser
- [ ] Web app is open on localhost

---

## 🚀 Quick Start (30 seconds)

1. **Flash code** → **Power on** → **See checkmark**
2. **Press Button A** (or wait 5 seconds)
3. **Open web app** → **Click Connect**
4. **Select Micro:bit** → **Done!**

---

**Remember:** The Micro:bit has **NO power button** - it turns on automatically when you provide power (battery or USB). The RESET button just restarts it.
