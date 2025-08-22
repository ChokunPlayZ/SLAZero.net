#!/bin/bash

echo "🚀 Starting SLAZero.net - The World's Most Honest Hosting Service"
echo "📦 Building Docker container with minification..."

# Set build arguments
export BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
export VERSION=${VERSION:-1.0.0}

echo "📅 Build date: $BUILD_DATE"
echo "🔢 Version: $VERSION"

# Build the Docker image with minification
echo "⚙️  Building with auto-minification..."
docker-compose build --no-cache

echo "🌐 Starting the minified website on http://localhost:8080"
echo "⚠️  Warning: Uptime not guaranteed (but at least it's minified)!"

# Run with docker-compose
docker-compose up -d

echo "✅ SLAZero.net is now running (probably) with minified assets"
echo "🌍 Visit: http://localhost:8080"
echo "📊 Check logs: docker-compose logs -f"
echo "🛑 Stop service: docker-compose down"
echo "💾 Minified files are served for better performance (when it's online)"
