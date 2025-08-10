# 🚀 Deployment Guide for dhinnovation.sustentus.com

## ✅ **Production Build Complete!**

Your site has been built and is ready for deployment. The production files are in the `dist/` folder.

## 🌐 **Immediate Deployment Options**

### **Option 1: Manual Upload (Quickest)**
1. **Upload files** from the `dist/` folder to your web server
2. **Server path**: `/var/www/dhinnovation.sustentus.com/` (or your web root)
3. **Files to upload**: All contents of `dist/` folder

### **Option 2: Use the Deploy Script**
```bash
./deploy.sh
```
This will rebuild and show deployment instructions.

### **Option 3: GitHub Actions (Automatic)**
- Push your code to GitHub
- Set up the required secrets (see below)
- Automatic deployment on every push

## 🔧 **GitHub Actions Setup (Recommended)**

### **Required Secrets:**
Add these in your GitHub repository → Settings → Secrets and variables → Actions:

```
SERVER_HOST=your-server-ip-or-domain
SERVER_USERNAME=your-ssh-username
SERVER_SSH_KEY=your-private-ssh-key
SERVER_PORT=22 (or your custom port)
```

### **SSH Key Setup:**
1. Generate SSH key pair: `ssh-keygen -t rsa -b 4096`
2. Add public key to your server's `~/.ssh/authorized_keys`
3. Add private key to GitHub secrets as `SERVER_SSH_KEY`

## 📁 **What's in the dist/ folder?**

```
dist/
├── index.html          # Main HTML file
├── assets/
│   ├── index-[hash].css    # Optimized CSS
│   └── index-[hash].js     # Optimized JavaScript
└── [other assets]
```

## 🧪 **Test Before Deploying**

1. **Local preview**: `npm run preview` → http://localhost:4173
2. **Verify features work**: All improvements should be visible
3. **Check mobile responsiveness**: Test on different screen sizes

## 🚨 **Important Notes**

- **Sticky headers** require proper server configuration
- **URL routing** needs server to serve `index.html` for all routes
- **HTTPS** recommended for production
- **Cache headers** may need configuration for optimal performance

## 🔄 **After Deployment**

1. **Test the live site**: Visit dhinnovation.sustentus.com
2. **Verify all features**: Check sticky headers, tooltips, etc.
3. **Monitor performance**: Use browser dev tools to check loading times

## 📞 **Need Help?**

- Check server logs for any errors
- Verify file permissions on the server
- Ensure all files were uploaded completely
- Test with a simple HTML file first

---

**Your pricing page is now production-ready with all the improvements! 🎉**
