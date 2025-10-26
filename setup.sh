#!/bin/bash

# LLM Comparison App - Setup Script
# This script helps you set up the application quickly

set -e

echo "🚀 LLM Comparison App Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚙️  Creating .env.local file..."
    cp env.template .env.local
    echo "✅ Created .env.local from template"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your API keys!"
    echo "   You can also configure them later via the Settings page in the app."
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "================================"
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local and add your API keys (optional)"
echo "   OR configure them in the app's Settings page"
echo ""
echo "2. Run the development server:"
echo "   npm run dev"
echo ""
echo "3. Open your browser to:"
echo "   http://localhost:3000"
echo ""
echo "📚 For help, see:"
echo "   - QUICKSTART.md for quick start guide"
echo "   - README.md for full documentation"
echo "   - TROUBLESHOOTING.md for common issues"
echo ""
echo "Happy comparing! 🎉"

