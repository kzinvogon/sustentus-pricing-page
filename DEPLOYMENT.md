# Deployment Guide for Sustentus Pricing Page

Your pricing page is ready to be deployed! Here are the best options:

## 🚀 Quick Deploy Options

### Option 1: GitHub Pages (Recommended - Free)
1. Create a GitHub repository
2. Push your code to GitHub
3. Run: `npm run deploy`
4. Your site will be live at: `https://yourusername.github.io/sustentus-pricing-cursor-ready/`

### Option 2: Netlify (Free & Easy)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `dist` folder to deploy
3. Get a live URL instantly

### Option 3: Vercel (Free & Fast)
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Automatic deployments on every push

### Option 4: Surge.sh (Free)
```bash
npm install -g surge
surge dist
```

## 📁 What's in the dist folder?
- `index.html` - Main HTML file
- `assets/` - CSS and JavaScript files
- All optimized for production

## 🔧 Manual Deployment Steps

### For any web server:
1. Upload the contents of the `dist` folder to your web server
2. Ensure the server serves `index.html` for all routes
3. Your site will be live!

### For shared hosting:
1. Upload all files from `dist` to your `public_html` folder
2. That's it!

## 🌐 Custom Domain
- Point your domain to your hosting provider
- Update DNS settings as required by your host

## 📱 Features Ready
- ✅ Responsive design
- ✅ Interactive feature comparison
- ✅ Click-through details
- ✅ URL state management
- ✅ Optimized for production

## 🛠️ Local Testing
```bash
npm run build
npm run preview
```
Then visit: `http://localhost:4173`

Your pricing page is production-ready! 🎉
