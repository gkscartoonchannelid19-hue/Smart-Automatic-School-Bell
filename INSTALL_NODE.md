# Installing Node.js - Quick Guide

## Why You Need Node.js

This project requires Node.js to run. Node.js is a JavaScript runtime that allows you to run the development server.

## Installation Options

### Option 1: Install via Homebrew (macOS - Recommended)

If you have Homebrew installed:

```bash
brew install node
```

If you don't have Homebrew, install it first:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then install Node.js:

```bash
brew install node
```

### Option 2: Download from nodejs.org (Easiest)

1. Visit: https://nodejs.org/
2. Download the **LTS (Long Term Support)** version
3. Run the installer
4. Follow the installation wizard
5. Restart your terminal

### Option 3: Install via nvm (Node Version Manager)

This allows you to manage multiple Node.js versions:

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload your shell configuration
source ~/.zshrc

# Install the latest LTS version of Node.js
nvm install --lts

# Use it
nvm use --lts
```

## Verify Installation

After installing, verify it works:

```bash
node --version
npm --version
```

You should see version numbers (e.g., `v20.10.0` and `10.2.3`).

## After Installing Node.js

Once Node.js is installed, you can start the server:

```bash
# Option 1: Use the startup script
./start-server.sh

# Option 2: Manual commands
npm install
npm run dev
```

## Need Help?

- Node.js website: https://nodejs.org/
- Homebrew website: https://brew.sh/
- nvm GitHub: https://github.com/nvm-sh/nvm

---

**After installing Node.js, run `./start-server.sh` to start the development server!**
