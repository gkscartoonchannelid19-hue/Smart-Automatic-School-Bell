#!/bin/bash

# Git Setup Script for Smart Automatic School Bell
# Run this script to initialize git and set up the remote repository

echo "🚀 Setting up Git repository..."

# Initialize git repository
git init

# Add README.md (already created)
git add README.md

# Make initial commit
git commit -m "first commit"

# Rename branch to main
git branch -M main

# Add remote origin
git remote add origin https://github.com/gkscartoonchannelid19-hue/Smart-Automatic-School-Bell.git

echo "✅ Git repository initialized!"
echo ""
echo "📝 Next steps:"
echo "   1. Add all files: git add ."
echo "   2. Commit: git commit -m 'Initial project setup'"
echo "   3. Push to GitHub: git push -u origin main"
echo ""
echo "⚠️  Note: Make sure you have:"
echo "   - Git installed and configured"
echo "   - GitHub credentials set up"
echo "   - Access to the repository"
