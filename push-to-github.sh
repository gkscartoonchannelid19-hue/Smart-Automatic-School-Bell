#!/bin/bash
# Push Smart-Automatic-School-Bell to GitHub
# Run this from the project folder: ./push-to-github.sh

set -e
cd "$(dirname "$0")"

echo "=== Pushing to GitHub ==="

# Initialize if needed
if [ ! -d .git ]; then
  echo "Initializing git repository..."
  git init
  git branch -M main
  git remote add origin https://github.com/gkscartoonchannelid19-hue/Smart-Automatic-School-Bell.git
fi

# Add all files, commit, push
git add .
git status
echo ""
read -p "Commit message [default: first commit]: " msg
msg=${msg:-first commit}
git commit -m "$msg"
git push -u origin main

echo ""
echo "=== Done! ==="
