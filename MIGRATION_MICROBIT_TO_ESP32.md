# Migration: BBC Micro:bit → ESP-32

## Summary of Changes

The Smart Automatic School Bell system has been migrated from BBC Micro:bit (using Web Bluetooth API) to ESP-32 (using Web Serial API). This provides better compatibility, easier setup, and more flexibility.

---

## What Changed

### 1. **Communication Protocol**
- **Old**: Web Bluetooth API (wireless Bluetooth LE)
- **New**: Web Serial API (USB serial connection)
- **Benefit**: More reliable, faster, and works over USB without pairing

### 2. **Hardware Connection**
- **Old**: BBC Micro:bit connected via Bluetooth dongle or direct Bluetooth
- **New**: ESP-32 connected via USB cable
- **Benefit**: No range limitations, more stable connection, easier setup

### 3. **Code Files Changed**

#### New Files Created:
- `hooks/use-esp32.ts` - ESP-32 connection logic using Web Serial API
- `components/esp32-info.tsx` - ESP-32 UI component with Arduino code examples
- `ESP32_SETUP.md` - Comprehensive ESP-32 setup guide
- `MIGRATION_MICROBIT_TO_ESP32.md` - This file

#### Files Modified:
- `app/page.tsx` - Updated to use `useESP32` instead of `useMicrobit`
- `lib/types.ts` - Changed `MicrobitConnection` to `ESP32Connection`
- `README.md` - Updated hardware requirements and setup instructions

#### Files No Longer Used (but kept for reference):
- `hooks/use-microbit.ts` - Old BBC Micro:bit connection hook
- `components/microbit-info.tsx` - Old Micro:bit UI component
- `CONNECT_MICROBIT.md` - Old Micro:bit setup guide
- `MICROBIT_SETUP.md` - Old Micro:bit setup instructions
- `MICROBIT_*.md` - Other Micro:bit documentation

---

## Key Differences

### Browser Support
| Browser | Micro:bit | ESP-32 |
|---------|-----------|--------|
| Chrome  | ✅ Yes   | ✅ Yes  |
| Edge    | ✅ Yes   | ✅ Yes  |
| Opera   | ❌ No    | ✅ Yes  |
| Firefox | ❌ No    | ❌ No   |
| Safari  | ❌ No    | ❌ No   |

### Setup Complexity
| Step | Micro:bit | ESP-32 |
|------|-----------|--------|
| Hardware | BBC Micro:bit + Relay | ESP-32 + Relay |
| Driver | Bluetooth built-in | CP2102 USB driver (optional) |
| Code | MicroPython or MakeCode | Arduino IDE + ESP-32 library |
| Flashing | USB drag-drop or web editor | Arduino IDE or ESP32-S3 USB boot |
| Connection | Bluetooth pairing dialog | Serial port selection |

### Performance
| Metric | Micro:bit | ESP-32 |
|--------|-----------|--------|
| Range | ~10 meters | Unlimited (USB) |
| Speed | ~9600 baud typical | 115200 baud |
| Latency | ~100-500ms | ~10-50ms |
| Reliability | Good | Excellent |

---

## How to Migrate Your Setup

### If You Had a Micro:bit:

1. **Get an ESP-32 board** - Any ESP-32 variant (DevKit, S3, S2, etc.)
2. **Install Arduino IDE** - https://www.arduino.cc/en/software
3. **Add ESP-32 board support** - Follow steps in `ESP32_SETUP.md`
4. **Flash the code** - Copy code from ESP-32 Info panel in the web app
5. **Connect** - Click "Connect" button and select your ESP-32 port
6. **Done!** - Your system now uses ESP-32

### Changes in Code for Your Custom Scripts:

If you had custom code using the Micro:bit hook:

**Old (Micro:bit):**
```typescript
import { useMicrobit } from "@/hooks/use-microbit"

const microbit = useMicrobit()
await microbit.ringBell(3)
```

**New (ESP-32):**
```typescript
import { useESP32 } from "@/hooks/use-esp32"

const esp32 = useESP32()
await esp32.ringBell(3)
```

The API is identical - just change the import and variable name!

---

## API Compatibility

The new `useESP32` hook has the same interface as the old `useMicrobit` hook:

```typescript
interface ESP32State {
  isConnected: boolean
  isConnecting: boolean
  portName: string | null  // Changed from deviceName
  error: string | null
}

// Methods - same as before!
const { connect, disconnect, ringBell, sendCommand } = useESP32()
```

**Breaking Changes:**
- `deviceName` → `portName` (the property name changed)
- All other methods and properties work the same way

---

## File Structure Changes

### Before:
```
components/
  ├── microbit-info.tsx        ← Old Micro:bit UI
hooks/
  ├── use-microbit.ts          ← Old Micro:bit logic
docs/
  ├── MICROBIT_SETUP.md        ← Old Micro:bit guide
  ├── CONNECT_MICROBIT.md      ← Old connection guide
```

### After:
```
components/
  ├── esp32-info.tsx           ← New ESP-32 UI
  └── (microbit-info.tsx)      ← Kept for reference
hooks/
  ├── use-esp32.ts             ← New ESP-32 logic
  └── (use-microbit.ts)        ← Kept for reference
docs/
  ├── ESP32_SETUP.md           ← New ESP-32 guide
  └── (MICROBIT_*.md)          ← Kept for reference
```

---

## Advantages of ESP-32

1. **Better Performance**: Faster baud rate (115200 vs 9600)
2. **Lower Latency**: Commands arrive in milliseconds, not seconds
3. **More Features**: WiFi, Bluetooth, ADC inputs, PWM outputs, etc.
4. **Easier Setup**: Standard Arduino IDE, no special MakeCode needed
5. **Better IDE**: Arduino IDE is more standard than MakeCode
6. **Reliable**: USB connection is more stable than Bluetooth
7. **Wider Compatibility**: Opera browser also supported (not just Chrome/Edge)
8. **Future-Proof**: ESP-32 is actively developed, Micro:bit is more toy-focused

---

## Disadvantages (vs Micro:bit)

1. **USB Cable Required**: No wireless connection, must have USB cable to computer
2. **More Complex Setup**: Arduino IDE + board manager (vs simple drag-drop)
3. **Driver Installation**: CP2102 driver may need manual installation
4. **Power Management**: ESP-32 needs proper power supply (Micro:bit ran on batteries)

---

## Troubleshooting Migration

### "ESP-32 doesn't appear in port list"
1. Check USB cable is properly connected
2. Install CP2102 USB driver
3. Try different USB port on computer
4. Try different USB cable

### "Can't upload code to ESP-32"
1. Select correct board: `Tools → Board → ESP32 → ESP32 Dev Module`
2. Select correct port: `Tools → Port → COM3` (or your port)
3. Press BOOT button on ESP-32 while uploading (if upload fails)

### "Connection works but bell doesn't ring"
1. Check wiring: GPIO5 to relay input
2. Check relay is powered (3.3V)
3. Test relay manually with power supply
4. Check Arduino code has correct pin (GPIO5)

---

## Reverting to Micro:bit (If Needed)

If you want to go back to Micro:bit:

1. Change `hooks/use-esp32.ts` to `hooks/use-microbit.ts` in imports
2. Change `components/esp32-info.tsx` to `components/microbit-info.tsx` in imports
3. Update variable names: `esp32` → `microbit`, `portName` → `deviceName`
4. Re-flash your Micro:bit with MicroPython code

The old files are still in the repository for reference!

---

## Support

For detailed setup instructions, see `ESP32_SETUP.md`.

For troubleshooting, check the ESP-32 Info panel in the web app - it has detailed error messages and solutions.

---

**Migration completed successfully! Your school bell system now uses ESP-32.** 🎓
