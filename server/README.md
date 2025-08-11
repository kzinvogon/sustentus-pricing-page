# Sustentus Email Server

Backend server for handling email functionality in the Sustentus pricing page.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
The `.env` file is already configured with your Gmail credentials:
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASS`: Your Gmail app password
- `FROM_EMAIL`: Sender email address
- `FRONTEND_URL`: Frontend application URL
- `PORT`: Server port (default: 3001)

### 3. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## 📧 API Endpoints

### Send Magic Link
```bash
POST /api/send-magic-link
Content-Type: application/json

{
  "email": "user@example.com",
  "plan": "Standard"
}
```

### Send Welcome Email
```bash
POST /api/send-welcome-email
Content-Type: application/json

{
  "email": "user@example.com",
  "plan": "Standard",
  "registrationData": {
    "companyName": "Example Corp",
    "contactName": "John Doe",
    "billingAddress": "123 Main St",
    "phoneNumber": "+1234567890"
  }
}
```

### Send Payment Confirmation
```bash
POST /api/send-payment-confirmation
Content-Type: application/json

{
  "email": "user@example.com",
  "plan": "Standard",
  "registrationData": {...},
  "paymentDetails": {...}
}
```

### Health Check
```bash
GET /api/health
```

## 🔧 Configuration

### Gmail Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `EMAIL_PASS`

### CORS
The server is configured to allow requests from your frontend application. Update the CORS settings in `server.js` if needed.

## 🚨 Security Notes

- **Never commit** the `.env` file to version control
- **Use environment variables** in production
- **Implement proper authentication** for production use
- **Use HTTPS** in production
- **Rate limiting** should be added for production

## 📁 File Structure

```
server/
├── package.json          # Dependencies and scripts
├── server.js            # Main server file
├── .env                 # Environment configuration
└── README.md           # This file
```

## 🧪 Testing

Test the server endpoints using curl or Postman:

```bash
# Test health check
curl http://localhost:3001/api/health

# Test magic link (replace with real email)
curl -X POST http://localhost:3001/api/send-magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","plan":"Standard"}'
```

## 🚀 Production Deployment

For production deployment:

1. **Environment Variables**: Set proper environment variables on your hosting platform
2. **HTTPS**: Use HTTPS for all communications
3. **Authentication**: Implement proper API authentication
4. **Rate Limiting**: Add rate limiting to prevent abuse
5. **Monitoring**: Add logging and monitoring
6. **Backup**: Regular database and configuration backups

## 📞 Support

If you encounter issues:
1. Check the server logs for error messages
2. Verify your Gmail credentials
3. Ensure the frontend URL is correct
4. Check that all required fields are provided in API requests
