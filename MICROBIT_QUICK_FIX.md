# Quick Fix Guide - Micro:bit Connection Issues

## 🚨 Common Errors & Quick Fixes

### Error: "Web Bluetooth is not supported"
**Fix:** Use Chrome or Edge browser (not Firefox/Safari)

### Error: "Micro:bit not found"
**Quick Fix:**
1. Make sure Micro:bit is **powered on** (not just plugged in)
2. **Reset Micro:bit** (press reset button on back)
3. **Enable Bluetooth** on your computer
4. Try connecting again

### Error: "UART service not found"
**Quick Fix:**
1. **Re-flash the code** to Micro:bit
2. Make sure you copied the **exact code** from the web app
3. Wait 5 seconds after flashing before connecting

### Error: "Connection failed" or "GATT server not available"
**Quick Fix:**
1. **Disconnect** in the web app
2. **Reset Micro:bit** (press reset button)
3. Wait 10 seconds
4. **Connect again**

## ✅ 30-Second Connection Test

1. **Micro:bit powered on?** ✓ (checkmark should appear)
2. **Bluetooth enabled?** ✓ (check system settings)
3. **Using Chrome/Edge?** ✓ (not Firefox/Safari)
4. **Code flashed?** ✓ (re-flash if unsure)
5. **Click Connect** → Select Micro:bit → Done!

## 🔍 Still Not Working?

1. **Open browser console:** Press F12 → Console tab
2. **Look for error messages** (they'll be in red)
3. **Share the error message** for help

## 📱 Test Without Micro:bit

The app works perfectly **without Micro:bit**! It will:
- Play audio bell sounds
- Show visual alerts
- Ring bells automatically

You can test everything first, then add Micro:bit later.

---

**Need more help?** See `MICROBIT_SETUP.md` for detailed instructions.
