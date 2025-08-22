#!/bin/bash

echo "🔧 SLAZero.net Local Minification Build"
echo "======================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing build dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Run the build process
echo "🚀 Starting minification process..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Local build completed successfully!"
    echo "📁 Minified files are in the dist/ directory"
    echo ""
    echo "To test the minified version:"
    echo "  cd dist && python3 -m http.server 8000"
    echo "  Then visit: http://localhost:8000"
    echo ""
    echo "To build Docker image with minification:"
    echo "  ./scripts/start.sh"
else
    echo "❌ Build failed"
    exit 1
fi
