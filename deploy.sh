#!/bin/bash

# Deployment script for Vercel

echo "🚀 Preparing React Todo App for Vercel deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building the application..."
npm run build

echo "✅ Build complete! Ready for Vercel deployment."
echo ""
echo "📋 Next steps:"
echo "1. Install Vercel CLI: npm i -g vercel"
echo "2. Login to Vercel: vercel login"
echo "3. Deploy: vercel --prod"
echo ""
echo "🔧 Don't forget to:"
echo "- Set REACT_APP_API_BASE_URL environment variable in Vercel dashboard"
echo "- Update your Spring Boot backend CORS settings to allow your Vercel domain"
