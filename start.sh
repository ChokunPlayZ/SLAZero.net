#!/bin/bash

echo "🚀 Starting SLAZero.net - The World's Most Honest Hosting Service"
echo "📦 Building Docker container..."

# Build the Docker image
docker build -t slazero-net .

echo "🌐 Starting the website on http://localhost:8080"
echo "⚠️  Warning: Uptime not guaranteed!"

# Run with docker-compose
docker-compose up -d

echo "✅ SLAZero.net is now running (probably)"
echo "🌍 Visit: http://localhost:8080"
echo "📊 Check logs: docker-compose logs -f"
echo "🛑 Stop service: docker-compose down"
