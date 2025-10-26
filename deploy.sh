#!/bin/bash

# Bin Cleaning Service - Netlify Deploy Script
echo "🚀 Bin Cleaning Service - Netlify Deployment Setup"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install dependencies (including Netlify plugin)
echo "📦 Installing dependencies and Netlify plugin..."
npm install

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating environment configuration..."
    cp .env.example .env.local
    echo "✅ Environment file created (.env.local)"
    echo "💡 You can edit .env.local to customize company details"
fi

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Setup Complete! Your bin cleaning service is ready."
    echo ""
    echo "📱 To start for mobile testing:"
    echo "   npm start"
    echo ""
    echo "🌐 Then visit:"
    echo "   • Local: http://localhost:3000"
    echo "   • Mobile (same network): http://YOUR_IP:3000"
    echo ""
    echo "📖 For detailed mobile testing instructions, see:"
    echo "   MOBILE-TESTING.md"
    echo ""
    echo "🔧 Key Features Ready:"
    echo "   ✅ Postcode checker (homepage)"
    echo "   ✅ Mobile-optimized booking form"
    echo "   ✅ Admin dashboard"
    echo "   ✅ Abandoned form tracking"
    echo "   ✅ Booking management"
    echo "   ✅ Email notifications (demo mode)"
    echo ""
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
