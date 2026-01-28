# Step-by-Step: Push to GitHub

Do these steps **in order** in your terminal. When a step asks for credentials, use what’s described there.

---

## Step 1: Open Terminal

- **Mac:** `Cmd + Space`, type **Terminal**, press Enter  
- **Windows:** Open **Command Prompt** or **PowerShell**  
- Or in Cursor: **Terminal → New Terminal** (or `` Ctrl+` ``)

---

## Step 2: Go to Your Project Folder

Copy, paste, and run:

```bash
cd /Users/gaurkrishna/Documents/hello
```

Press Enter.

---

## Step 3: Initialize Git (First Time Only)

Run:

```bash
git init
```

You should see: `Initialized empty Git repository in ...`

---

## Step 4: Set Branch Name

Run:

```bash
git branch -M main
```

No output is normal.

---

## Step 5: Add GitHub as Remote

Run (use your real repo URL if it’s different):

```bash
git remote add origin https://github.com/gkscartoonchannelid19-hue/Smart-Automatic-School-Bell.git
```

No output = success.

If you see **“remote origin already exists”**, run:

```bash
git remote remove origin
git remote add origin https://github.com/gkscartoonchannelid19-hue/Smart-Automatic-School-Bell.git
```

---

## Step 6: Stage All Files

Run:

```bash
git add .
```

No output = success.

---

## Step 7: Commit

Run:

```bash
git commit -m "first commit"
```

You should see a list of created/modified files and “first commit” as the message.

---

## Step 8: Push to GitHub — **Credentials Needed Here**

Run:

```bash
git push -u origin main
```

The first time you push, Git will ask you to sign in.

### What Git Will Ask For

| Prompt | What to enter |
|--------|-------------------------------|
| **Username** | Your GitHub username (e.g. `gkscartoonchannelid19-hue`) |
| **Password** | A **Personal Access Token**, **not** your GitHub password |

### If You Don’t Have a Token Yet

1. In your browser go to: **https://github.com/settings/tokens**
2. Click **“Generate new token”** → **“Generate new token (classic)”**
3. Name it (e.g. “School Bell Push”).
4. Choose an expiry (e.g. 90 days or “No expiration”).
5. Under **Scopes**, check **“repo”**.
6. Click **“Generate token”**.
7. **Copy the token** (it starts with `ghp_...`) and store it somewhere safe.  
   Use this as the **password** when Git asks.

### When Git Asks

- **Username for 'https://github.com':** paste your GitHub username  
- **Password for 'https://USERNAME@github.com':** paste your **Personal Access Token**

---

## Step 9: Check on GitHub

1. Open: **https://github.com/gkscartoonchannelid19-hue/Smart-Automatic-School-Bell**
2. You should see your project and all files.

---

## If Something Fails

- **“Authentication failed”** → You used your GitHub password. Use a **Personal Access Token** as the password.
- **“remote origin already exists”** → Do Step 5’s “If you see…” part, then run Step 8 again.
- **“failed to push” / “rejected”** → The repo on GitHub might already have commits. Tell me the exact error and we’ll fix it (e.g. `git pull` then push, or force push if you’re sure).

---

## Quick Checklist

- [ ] Step 1: Terminal open  
- [ ] Step 2: `cd` into project  
- [ ] Step 3: `git init`  
- [ ] Step 4: `git branch -M main`  
- [ ] Step 5: `git remote add origin ...`  
- [ ] Step 6: `git add .`  
- [ ] Step 7: `git commit -m "first commit"`  
- [ ] Step 8: `git push -u origin main` (enter **username** and **token** when asked)  
- [ ] Step 9: Confirm on GitHub

When you’re ready, say which step you’re on and what you see (or any error message), and we’ll do the next part. If you tell me your GitHub username and that you’ve created a token, I can phrase the exact username/password prompts for you.
