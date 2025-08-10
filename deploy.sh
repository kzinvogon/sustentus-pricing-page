#!/bin/bash

# Deploy script for Sustentus Pricing Page
# This script builds and deploys the site to dhinnovation.sustentus.com

echo "🚀 Building production version..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Production files created in 'dist' folder"
    echo ""
    echo "🌐 To deploy to dhinnovation.sustentus.com:"
    echo "1. Upload the contents of the 'dist' folder to your web server"
    echo "2. Or use the GitHub Actions workflow (requires setup)"
    echo ""
    echo "🔧 Manual deployment steps:"
    echo "   - Upload dist/* to your web server directory"
    echo "   - Ensure index.html is served for all routes"
    echo "   - Test the live site"
    echo ""
    echo "📱 Local preview available at: http://localhost:4173"
    echo "   (Run 'npm run preview' to start)"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
