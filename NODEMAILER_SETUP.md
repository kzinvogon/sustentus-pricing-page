# Nodemailer Setup Guide

## **📧 Simple Email Setup with Nodemailer**

This project now uses **Nodemailer** instead of SendGrid - it's much easier to set up and doesn't require API keys!

## **🔑 Setup Options**

### **Option 1: Gmail (Recommended for testing)**

1. **Use your Gmail account**
2. **Enable 2-Factor Authentication** (required for app passwords)
3. **Generate an App Password:**
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Copy the 16-character password

4. **Update your `.env` file:**
   ```bash
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   FROM_EMAIL=noreply@sustentus.com
   ```

### **Option 2: Outlook/Office 365**

1. **Use your Outlook account**
2. **Enable 2-Factor Authentication**
3. **Generate an App Password**
4. **Update your `.env` file:**
   ```bash
   EMAIL_USER=your-email@outlook.com
   EMAIL_PASS=your-app-password
   FROM_EMAIL=noreply@sustentus.com
   ```

### **Option 3: Your Own SMTP Server**

1. **Use your company's email server**
2. **Update your `.env` file:**
   ```bash
   SMTP_HOST=smtp.yourcompany.com
   SMTP_PORT=587
   EMAIL_USER=your-email@yourcompany.com
   EMAIL_PASS=your-password
   FROM_EMAIL=noreply@sustentus.com
   ```

## **📝 Quick Gmail Setup**

### **Step 1: Enable 2FA**
1. Go to [Google Account](https://myaccount.google.com/)
2. Security → 2-Step Verification → Turn On
3. Follow the setup process

### **Step 2: Generate App Password**
1. Security → 2-Step Verification → App passwords
2. Select "Mail" from dropdown
3. Click "Generate"
4. Copy the 16-character password (no spaces)

### **Step 3: Update .env File**
```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
FROM_EMAIL=noreply@sustentus.com
```

## **🧪 Testing Your Setup**

1. **Fill out the registration form** completely
2. **Click "Continue to Payment"**
3. **Check your email** for the magic link
4. **Check browser console** for any error messages

## **⚠️ Important Notes**

- **Never commit your `.env` file** to version control
- **App passwords are different** from your regular password
- **Gmail has daily limits** (500 emails/day for regular accounts)
- **Business accounts** have higher limits

## **🔧 Troubleshooting**

### **Common Issues:**

1. **"Invalid credentials"**
   - Check your email and app password
   - Make sure 2FA is enabled

2. **"Less secure app access"**
   - Use App Passwords instead
   - Regular passwords won't work with 2FA

3. **"Rate limit exceeded"**
   - Gmail has daily sending limits
   - Wait 24 hours or upgrade to business account

### **Debug Mode:**
Check browser console for detailed error messages and email sending status.

## **🚀 Ready to Test?**

1. **Set up your Gmail app password**
2. **Update the `.env` file** with your credentials
3. **Restart your preview server**
4. **Test the complete registration flow**

Nodemailer is much simpler than SendGrid - no API keys, no complex setup, just your email credentials!
