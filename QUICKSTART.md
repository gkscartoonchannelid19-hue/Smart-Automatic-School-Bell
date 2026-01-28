# Quick Start Guide - Smart Automatic School Bell

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

```bash
pnpm install
```

If you don't have pnpm:
```bash
npm install -g pnpm
# or use npm directly
npm install
```

### Step 2: Start the Development Server

```bash
pnpm dev
```

The app will be available at: **http://localhost:3000**

### Step 3: Test the Application

1. **Open your browser** (Chrome or Edge recommended)
2. **Navigate to** http://localhost:3000
3. **Create a schedule:**
   - Click "Add Schedule"
   - Name it (e.g., "Test Schedule")
   - Select today's day of the week
   - Click "Set as Active"

4. **Add a bell:**
   - In the Bell Editor, click "Add Bell"
   - Set time to a few minutes from now (e.g., if it's 10:00, set 10:05)
   - Set duration (e.g., 3 seconds)
   - Click "Test" to test immediately

5. **Test Micro:bit (Optional):**
   - Click "Connect" in the Micro:bit Info panel
   - Select your Micro:bit from the Bluetooth list
   - Test a bell - it should trigger the Micro:bit

## 🔧 Git Setup (One-time)

Run the setup script:

```bash
./setup-git.sh
```

Then add all files and push:

```bash
git add .
git commit -m "Initial project setup"
git push -u origin main
```

## 📱 Testing Without Micro:bit

The app works perfectly without a Micro:bit! It will:
- Play audio bell sounds through your speakers
- Show visual alerts
- Automatically ring bells at scheduled times

## 🎯 MVP Testing Checklist

- [ ] App loads at http://localhost:3000
- [ ] Can create a schedule
- [ ] Can add bell events
- [ ] Test bell plays audio
- [ ] Bell rings automatically at scheduled time
- [ ] Micro:bit connects (if available)
- [ ] Micro:bit receives ring commands (if connected)

## 🐛 Troubleshooting

**Port 3000 already in use?**
```bash
pnpm dev -- -p 3001
```

**Dependencies not installing?**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Build errors?**
The project is configured to ignore TypeScript build errors for faster development. If you see warnings, they're safe to ignore for MVP testing.

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Check the Micro:bit setup section for hardware connections
- Customize schedules for your school's needs

---

**Happy Testing! 🎉**
