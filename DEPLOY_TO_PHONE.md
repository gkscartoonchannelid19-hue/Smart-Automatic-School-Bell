# Deploy to Test on Phone - Simple Guide

## Option 1: Deploy to Vercel (Recommended - 5 minutes)

### Step 1: Push to GitHub (if not already)
```bash
git add .
git commit -m "Ready for deployment"
git push
```

### Step 2: Deploy on Vercel
1. Go to: **https://vercel.com**
2. Sign up/Login (free account)
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Click **"Deploy"** (Vercel auto-detects Next.js)
6. Wait 2-3 minutes
7. **Done!** You'll get a URL like: `https://your-app.vercel.app`

### Step 3: Test on Phone
- Open the Vercel URL on your phone's browser
- The app will work! (Web Bluetooth needs HTTPS, which Vercel provides)

---

## Option 2: Quick Local Network Test (2 minutes)

If you just want to test the UI (without Micro:bit Bluetooth):

### Step 1: Find Your Computer's IP
```bash
# On Mac/Linux:
ifconfig | grep "inet " | grep -v 127.0.0.1

# On Windows:
ipconfig
```

Look for something like: `192.168.1.100`

### Step 2: Start Server on Your Network
```bash
npm run dev -- -H 0.0.0.0 -p 3002
```

### Step 3: Connect from Phone
- Make sure phone is on same WiFi network
- Open browser on phone
- Go to: `http://YOUR_IP:3002` (e.g., `http://192.168.1.100:3002`)

**Note:** Web Bluetooth won't work on HTTP (only HTTPS), but you can test the UI and audio bells!

---

## Option 3: Use ngrok (For HTTPS on Local Network)

### Step 1: Install ngrok
```bash
# Download from: https://ngrok.com/download
# Or with Homebrew:
brew install ngrok
```

### Step 2: Start Your Server
```bash
npm run dev -- -p 3002
```

### Step 3: Create Tunnel
```bash
ngrok http 3002
```

### Step 4: Use the HTTPS URL
- ngrok will give you a URL like: `https://abc123.ngrok.io`
- Open this on your phone
- **Web Bluetooth will work!** ✅

---

## Which Option Should You Use?

| Option | Time | HTTPS | Web Bluetooth | Best For |
|--------|------|-------|---------------|----------|
| **Vercel** | 5 min | ✅ | ✅ | **Production testing** |
| **Local Network** | 2 min | ❌ | ❌ | Quick UI test |
| **ngrok** | 3 min | ✅ | ✅ | Quick HTTPS test |

**Recommendation:** Use **Vercel** - it's the easiest and most reliable!

---

## After Deployment

Once deployed, you can:
1. ✅ Test on your phone
2. ✅ Test on any device
3. ✅ Share the link with others
4. ✅ Test Web Bluetooth (if using HTTPS)

The app works perfectly without Micro:bit - it will play audio bells instead!
