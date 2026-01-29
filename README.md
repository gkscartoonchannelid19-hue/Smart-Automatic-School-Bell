# Smart-Automatic-School-Bell

An intelligent, web-based automatic school bell system with BBC Micro:bit integration. Manage bell schedules, automate bell ringing, and control physical bells through a modern web interface.

## Features

- 🕐 **Automatic Bell Scheduling** - Create and manage multiple bell schedules for different days
- 📱 **Modern Web Interface** - Beautiful, responsive UI built with Next.js and React
- 🔌 **BBC Micro:bit Integration** - Connect and control physical bells via Bluetooth
- 🔊 **Audio Fallback** - Plays audio bell when Micro:bit is not connected
- ⚙️ **Flexible Configuration** - Customize bell times, durations, and schedules
- 💾 **Local Storage** - All schedules and settings saved locally in your browser
- 🌓 **Dark Mode Support** - Beautiful dark and light themes

## Prerequisites

- **Node.js** 18+ and **pnpm** (or npm/yarn)
- **Chrome or Edge browser** (for Web Bluetooth API support)
- **BBC Micro:bit** (optional - for physical bell control)

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

## BBC Micro:bit Setup

### Hardware Requirements

- BBC Micro:bit v2 (recommended) or v1
- Relay module or buzzer connected to Pin 0
- Power supply for the relay/buzzer

### Software Setup

1. **Flash the MicroPython code to your Micro:bit:**

   - Open the [MicroPython Editor](https://python.microbit.org/)
   - Copy the code from the Micro:bit Info panel in the web interface (or see below)
   - Flash it to your Micro:bit

2. **MicroPython Code:**

```python
from microbit import *
import radio

# Enable UART over Bluetooth
uart.init(baudrate=115200)

while True:
    # Check for incoming commands
    if uart.any():
        data = uart.readline()
        if data:
            command = str(data, 'utf-8').strip()
            if command.startswith("RING:"):
                duration = int(command.split(":")[1])
                # Ring the bell (use pin0 for relay/buzzer)
                for i in range(duration * 2):
                    pin0.write_digital(1)
                    display.show(Image.HEART)
                    sleep(250)
                    pin0.write_digital(0)
                    display.clear()
                    sleep(250)
                uart.write("OK\n")
    sleep(100)
```

3. **Connect in the Web Interface:**

   - Open the application in Chrome or Edge
   - Click "Connect" in the Micro:bit Info panel
   - Select your Micro:bit from the Bluetooth device list
   - The connection status will update when successful

### Hardware Wiring

```
Micro:bit Pin 0 → Relay Module Input (or Buzzer +)
GND → Relay Module GND (or Buzzer -)
3V → Relay Module VCC (if needed)
```

**Note:** For production use, use a relay module to control a larger bell or buzzer system. The Micro:bit can only provide limited current.

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
│   ├── microbit-info.tsx # Micro:bit connection UI
│   ├── schedule-list.tsx # Schedule management
│   └── ...
├── hooks/                 # Custom React hooks
│   ├── use-microbit.ts   # Micro:bit Bluetooth connection
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
- **Bluetooth**: Web Bluetooth API
- **Language**: TypeScript

## Browser Compatibility

- ✅ Chrome 56+ (recommended)
- ✅ Edge 79+
- ⚠️ Firefox (no Web Bluetooth support - audio fallback only)
- ⚠️ Safari (no Web Bluetooth support - audio fallback only)

## Troubleshooting

### Micro:bit Won't Connect

1. **Check Browser**: Ensure you're using Chrome or Edge
2. **Check Micro:bit**: Make sure it's powered on and the code is flashed
3. **Check Bluetooth**: Ensure Bluetooth is enabled on your computer
4. **Check Pairing**: The Micro:bit should appear as "BBC micro:bit" in the device list
5. **Try Again**: Close and reopen the browser, then try connecting again

### Bells Not Ringing

1. **Check Schedule**: Ensure a schedule is active and includes today
2. **Check Time**: Verify the bell time is correct (24-hour format)
3. **Check Enabled**: Make sure the bell is enabled (toggle switch)
4. **Check Connection**: If using Micro:bit, verify it's connected
5. **Check Audio**: If not using Micro:bit, check your system volume

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
