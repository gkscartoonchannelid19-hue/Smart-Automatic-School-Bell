# Smart-Automatic-School-Bell

An intelligent, web-based automatic school bell system with ESP-32 integration. Manage bell schedules, automate bell ringing, and control physical bells through a modern web interface.

## Features

- 🕐 **Automatic Bell Scheduling** - Create and manage multiple bell schedules for different days
- 📱 **Modern Web Interface** - Beautiful, responsive UI built with Next.js and React
- 🔌 **ESP-32 Integration** - Connect and control physical bells via Web Serial API
- 🔊 **Audio Fallback** - Plays audio bell when ESP-32 is not connected
- ⚙️ **Flexible Configuration** - Customize bell times, durations, and schedules
- 💾 **Local Storage** - All schedules and settings saved locally in your browser
- 🌓 **Dark Mode Support** - Beautiful dark and light themes

## Prerequisites

- **Node.js** 18+ and **pnpm** (or npm/yarn)
- **Chrome, Edge, or Opera browser** (for Web Serial API support)
- **ESP-32 development board** (optional - for physical bell control)

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
```

### 2. Run Development Server

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 3. Build for Production

```bash
pnpm build
pnpm start
```

## ESP-32 Setup

### Hardware Requirements

- ESP-32 development board (any variant)
- USB cable (USB-C or Micro-USB depending on variant)
- Relay module or buzzer connected to GPIO5
- Power supply for the relay/buzzer

### Software Setup

1. **Install Arduino IDE and ESP-32 Board Support:**

   - Download [Arduino IDE](https://www.arduino.cc/en/software)
   - Add ESP-32 board URL in Preferences: `https://dl.espressif.com/dl/package_esp32_index.json`
   - Install ESP-32 board via Board Manager

2. **Flash the Arduino code to your ESP-32:**

   - Connect ESP-32 via USB
   - Copy the code from the ESP-32 Info panel in the web interface
   - Paste into Arduino IDE, modify WiFi credentials
   - Select Board: `ESP32 Dev Module` (or your variant)
   - Click Upload to flash the code

3. **Connect in the Web Interface:**

   - Open the application in Chrome, Edge, or Opera
   - Click "Connect" in the ESP-32 Info panel
   - Select your ESP-32 from the serial port list
   - The connection status will update when successful

### Hardware Wiring

```
ESP-32 GPIO5 → Relay Module Input (or Buzzer +)
GND → Relay Module GND (or Buzzer -)
3.3V → Relay Module VCC (if needed)
```

**Note:** Use a relay module to control larger bells or buzzers. The ESP-32 GPIO can only provide limited current (up to 12mA per pin).

## Usage Guide

### Creating a Schedule

1. Click "Add Schedule" in the Schedules panel
2. Enter a schedule name (e.g., "Regular School Days")
3. Select which days of the week this schedule applies to
4. Click "Set as Active" to activate the schedule

### Adding Bell Events

1. Select a schedule from the list
2. In the Bell Editor panel, click "Add Bell"
3. Enter:
   - **Name**: Description of the bell (e.g., "Morning Bell", "Lunch Break")
   - **Time**: When the bell should ring (24-hour format, e.g., "08:00")
   - **Duration**: How long the bell should ring (in seconds)
4. Toggle the bell on/off as needed
5. The bell will automatically ring at the scheduled time

### Testing Bells

- Click the "Test" button next to any bell in the editor
- Or use the test button in the Bell Editor panel
- The bell will ring immediately (or send command to Micro:bit if connected)

### Settings

Click the settings icon in the header to:
- Change school name
- Adjust volume settings
- Configure other preferences

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main application page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── bell-alert.tsx    # Bell ringing alert
│   ├── bell-editor.tsx   # Bell schedule editor
│   ├── clock-display.tsx # Clock and countdown
│   ├── header.tsx        # App header
│   ├── esp32-info.tsx    # ESP-32 connection UI
│   ├── schedule-list.tsx # Schedule management
│   └── ...
├── hooks/                 # Custom React hooks
│   ├── use-esp32.ts      # ESP-32 Web Serial connection
│   └── use-school-bell-store.ts # State management
├── lib/                   # Utilities and types
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Helper functions
└── public/                # Static assets
```

## Technology Stack

- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand (via custom hook)
- **Serial Communication**: Web Serial API
- **Language**: TypeScript

## Browser Compatibility

- ✅ Chrome 89+ (recommended)
- ✅ Edge 89+
- ✅ Opera 76+
- ⚠️ Firefox (no Web Serial support - audio fallback only)
- ⚠️ Safari (no Web Serial support - audio fallback only)

## Troubleshooting

### ESP-32 Won't Connect

1. **Check Browser**: Ensure you're using Chrome, Edge, or Opera
2. **Check ESP-32**: Make sure it's powered on and the code is flashed
3. **Check USB Cable**: Ensure USB cable is properly connected
4. **Check Driver**: Install CP2102 USB driver if ESP-32 doesn't appear in port list
5. **Try Again**: Close other serial apps (Arduino IDE), refresh browser, and try connecting again

### Bells Not Ringing

1. **Check Schedule**: Ensure a schedule is active and includes today
2. **Check Time**: Verify the bell time is correct (24-hour format)
3. **Check Enabled**: Make sure the bell is enabled (toggle switch)
4. **Check Connection**: If using ESP-32, verify it's connected
5. **Check Hardware**: Verify relay/buzzer is wired correctly to GPIO5
6. **Check Audio**: If not using ESP-32, check your system volume

### Development Issues

- **Port Already in Use**: Change the port with `pnpm dev -- -p 3001`
- **Build Errors**: Run `pnpm install` to ensure all dependencies are installed
- **Type Errors**: The project is configured to ignore build errors for faster development

## Contributing

This is an MVP prototype. Contributions and feedback are welcome!

## License

This project is open source and available for educational and commercial use.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Built with ❤️ for schools and educational institutions**
# Study
