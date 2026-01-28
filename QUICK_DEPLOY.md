# Quick Deploy to Test on Phone 🚀

## Simplest Way: Deploy to Vercel (FREE, 3 minutes)

### What You Need:
- GitHub account (free)
- Vercel account (free)

### Steps:

1. **Push to GitHub** (if you haven't):
   ```bash
   git add .
   git commit -m "Ready to deploy"
   git push
   ```

2. **Go to Vercel:**
   - Visit: https://vercel.com
   - Sign up/Login (it's free!)
   - Click **"Add New Project"**

3. **Import Your Repo:**
   - Connect your GitHub account
   - Find your "hello" or "smart-automatic-school-bell" repository
   - Click **"Import"**

4. **Deploy:**
   - Vercel auto-detects Next.js ✅
   - Click **"Deploy"**
   - Wait 2-3 minutes

5. **Done!** 
   - You'll get a URL like: `https://your-app.vercel.app`
   - **Open this on your phone!** 📱

---

## Test on Phone:

1. Open the Vercel URL on your phone's browser
2. The app will work perfectly!
3. You can:
   - Create schedules ✅
   - Add bell times ✅
   - Test bells (audio will play) ✅
   - Try connecting Micro:bit (if you have it) ✅

---

## Alternative: Local Network (No HTTPS)

If you just want to test quickly on your local network:

```bash
# Find your computer's IP address
# Mac/Linux:
ifconfig | grep "inet " | grep -v 127.0.0.1

# Then start server:
npm run dev -- -H 0.0.0.0 -p 3002
```

On your phone (same WiFi), go to: `http://YOUR_IP:3002`

**Note:** Web Bluetooth won't work on HTTP (needs HTTPS), but UI and audio bells will work!

---

## That's It!

Once deployed to Vercel, you can:
- ✅ Test on any phone
- ✅ Share with others
- ✅ Use Web Bluetooth (HTTPS is included)
- ✅ Access from anywhere

The app works great without Micro:bit - it plays audio bells automatically! 🎉
