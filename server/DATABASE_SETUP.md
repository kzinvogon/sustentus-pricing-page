# Database Setup Guide for Sustentus Master Database

## **🗄️ Prerequisites**

- MySQL 8.0+ or MariaDB 10.5+
- Node.js 18+
- npm or yarn

## **🔧 Installation Steps**

### **1. Install Dependencies**
```bash
cd server
npm install
```

### **2. Database Setup**

#### **Option A: Using MySQL Command Line**
```bash
# Connect to MySQL as root
mysql -u root -p

# Run the schema file
source database/schema.sql
```

#### **Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open `database/schema.sql`
4. Execute the script

### **3. Environment Configuration**

Create or update your `.env` file in the `server` directory:

```env
# Email Configuration (Office 365)
EMAIL_USER=david@davidh.com
EMAIL_PASS=Xowpy1-qaxdig-fasjow
FROM_EMAIL=david@davidh.com
FRONTEND_URL=http://localhost:4173
PORT=3001

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sustentus_master
DB_PORT=3306

# Encryption Configuration (IMPORTANT: Change this in production!)
ENCRYPTION_KEY=your-secret-encryption-key-32-chars-long
```

## **🔐 Security Notes**

### **Encryption Key**
- **NEVER** use the default encryption key in production
- Generate a secure 32-character key:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- Store the encryption key securely (environment variables, secret management service)

### **Database Security**
- Use a dedicated database user (not root) in production
- Grant only necessary permissions:
  ```sql
  CREATE USER 'sustentus_app'@'localhost' IDENTIFIED BY 'secure_password';
  GRANT SELECT, INSERT, UPDATE, DELETE ON sustentus_master.* TO 'sustentus_app'@'localhost';
  FLUSH PRIVILEGES;
  ```

## **🧪 Testing the Setup**

### **1. Start the Server**
```bash
cd server
npm start
```

### **2. Test Database Connection**
```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Sustentus Email Server is running"
}
```

### **3. Test Vendor Creation**
```bash
curl -X POST http://localhost:3001/api/send-magic-link \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "plan": "Starter",
    "registrationData": {
      "companyName": "Test Company",
      "contactName": "Test User",
      "billingAddress": "123 Test St",
      "phone": "1234567890",
      "country": "US"
    }
  }'
```

## **📊 Database Schema Overview**

### **Tables Created**
1. **`vendors`** - Core vendor information
2. **`vendor_plans`** - Plan subscriptions and billing
3. **`vendor_settings`** - Configurable preferences
4. **`vendor_access_logs`** - Access tracking

### **Views Created**
1. **`active_vendor_plans`** - Active vendor plans summary
2. **`vendor_settings_summary`** - Vendor settings overview

## **🔗 API Endpoints**

### **Vendor Management**
- `GET /api/vendor/:encryptedVendorId` - Get vendor details
- `GET /api/vendor/:encryptedVendorId/dashboard` - Get vendor dashboard
- `PUT /api/vendor/:encryptedVendorId/settings` - Update vendor setting
- `PUT /api/vendor/:encryptedVendorId/plan` - Update vendor plan

### **Email Services**
- `POST /api/send-magic-link` - Send registration magic link
- `POST /api/send-welcome-email` - Send welcome email
- `POST /api/send-payment-confirmation` - Send payment confirmation

## **🚀 Production Deployment**

### **Environment Variables**
- Use production database credentials
- Generate and use secure encryption keys
- Configure proper email SMTP settings

### **Database Backups**
```bash
# Create backup
mysqldump -u root -p sustentus_master > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
mysql -u root -p sustentus_master < backup_file.sql
```

### **Monitoring**
- Monitor database connections and performance
- Set up log rotation for access logs
- Implement health checks and alerting

## **🛠️ Troubleshooting**

### **Common Issues**

#### **Database Connection Failed**
- Check MySQL service is running
- Verify database credentials in `.env`
- Ensure database `sustentus_master` exists

#### **Encryption Errors**
- Verify `ENCRYPTION_KEY` is 32 characters long
- Check for special characters in the key
- Ensure consistent key across deployments

#### **Permission Denied**
- Check MySQL user permissions
- Verify database exists and is accessible
- Check firewall settings if connecting remotely

### **Debug Mode**
Enable detailed logging by setting:
```env
DEBUG=true
NODE_ENV=development
```

## **📚 Next Steps**

1. **Test the complete flow** from registration to payment
2. **Implement frontend integration** with encrypted Vendor IDs
3. **Add authentication middleware** for secure API access
4. **Set up monitoring and alerting** for production use
5. **Implement backup and recovery** procedures
