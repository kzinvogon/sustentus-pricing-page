# 🔐 Encrypted Vendor ID System

## **🎯 Overview**

The Sustentus pricing page now includes a **Master Database** with encrypted Vendor IDs that provide secure, persistent access to vendor information, plans, and settings.

## **🏗️ System Architecture**

### **Frontend (React)**
- **Registration Flow**: Collects vendor information and sends to backend
- **State Management**: Stores encrypted Vendor ID in localStorage
- **Secure Access**: Uses encrypted Vendor ID for all vendor operations

### **Backend (Node.js + MySQL)**
- **Master Database**: Stores vendor information, plans, and settings
- **Encryption Service**: Securely encrypts/decrypts Vendor IDs
- **Vendor Service**: Manages all vendor-related operations

### **Database (MySQL)**
- **Vendors Table**: Core vendor information
- **Vendor Plans**: Subscription and billing details
- **Vendor Settings**: Configurable preferences per plan
- **Access Logs**: Track all vendor interactions

## **🔐 How Encryption Works**

### **Vendor ID Encryption**
```javascript
// Frontend receives encrypted Vendor ID
const encryptedVendorId = "v_aBcDeF123...";

// Backend decrypts to get real Vendor ID
const vendorId = EncryptionService.extractVendorIdFromUrl(encryptedVendorId);
// Result: "550e8400-e29b-41d4-a716-446655440000"
```

### **Security Features**
- **AES-256-CBC** encryption with random IV
- **URL-safe** base64 encoding
- **32-character** encryption key (configurable)
- **24-hour expiration** for magic link tokens

## **📱 User Flow**

### **1. Registration**
```
User fills form → Backend creates vendor → Returns encrypted Vendor ID
```

### **2. Magic Link**
```
Email sent with encrypted token → User clicks link → Frontend validates → Access granted
```

### **3. Dashboard Access**
```
User clicks "Access Vendor Dashboard" → Opens production dashboard at demo-vendor.sustentus.com → Backend decrypts encrypted Vendor ID → Returns vendor data
```

## **🔗 API Endpoints**

### **Vendor Management (All use encrypted Vendor ID)**
```bash
# Get vendor details
GET https://demo-vendor.sustentus.com/api/vendor/v_aBcDeF123.../dashboard

# Update vendor setting
PUT https://demo-vendor.sustentus.com/api/vendor/v_aBcDeF123.../settings

# Change vendor plan
PUT https://demo-vendor.sustentus.com/api/vendor/v_aBcDeF123.../plan
```

### **Email Services**
```bash
# Send magic link (creates vendor)
POST /api/send-magic-link

# Send welcome email
POST /api/send-welcome-email

# Send payment confirmation
POST /api/send-payment-confirmation
```

## **🗄️ Database Schema**

### **Vendors Table**
```sql
vendors (
  vendor_id VARCHAR(36) PRIMARY KEY,  -- UUID
  company_name VARCHAR(255),
  contact_name VARCHAR(255),
  billing_address TEXT,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  country VARCHAR(3),
  status ENUM('active', 'suspended', 'cancelled', 'trial'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### **Vendor Plans Table**
```sql
vendor_plans (
  plan_id VARCHAR(36) PRIMARY KEY,
  vendor_id VARCHAR(36) FOREIGN KEY,
  plan_type ENUM('Trial', 'Starter', 'Standard', 'Premier'),
  plan_status ENUM('active', 'expired', 'cancelled', 'pending'),
  start_date DATE,
  renewal_date DATE,
  monthly_price DECIMAL(10,2),
  billing_cycle ENUM('monthly', 'annual'),
  auto_renewal BOOLEAN
)
```

### **Vendor Settings Table**
```sql
vendor_settings (
  setting_id VARCHAR(36) PRIMARY KEY,
  vendor_id VARCHAR(36) FOREIGN KEY,
  setting_key VARCHAR(100),
  setting_value TEXT,
  setting_type ENUM('string', 'number', 'boolean', 'json'),
  is_public BOOLEAN
)
```

## **🚀 Benefits**

### **Security**
- **No exposed UUIDs** in URLs or forms
- **Encrypted tokens** for magic links
- **Secure API access** via encrypted identifiers

### **Persistence**
- **Vendor data persists** across sessions
- **Plan information** stored and retrievable
- **Settings history** maintained over time

### **Scalability**
- **Multiple plans** per vendor supported
- **Settings inheritance** from plan defaults
- **Access logging** for audit trails

## **🛠️ Implementation Details**

### **Frontend State Management**
```javascript
// Store encrypted Vendor ID
const [encryptedVendorId, setEncryptedVendorId] = useState('');

// Save to localStorage for persistence
localStorage.setItem('sustentus_encrypted_vendor_id', result.encryptedVendorId);

// Use in API calls
const dashboardUrl = `https://demo-vendor.sustentus.com/api/vendor/${encryptedVendorId}/dashboard`;
```

### **Backend Encryption**
```javascript
// Encrypt Vendor ID for URLs
static createVendorUrlId(vendorId) {
  const encrypted = this.encryptVendorId(vendorId);
  return `v_${encrypted}`;
}

// Decrypt from URL identifier
static extractVendorIdFromUrl(urlId) {
  if (!urlId.startsWith('v_')) {
    throw new Error('Invalid URL ID format');
  }
  const encrypted = urlId.substring(2);
  return this.decryptVendorId(encrypted);
}
```

### **Database Operations**
```javascript
// Create vendor with plan and settings
const vendorResult = await vendorService.createVendor(registrationData, planType);

// Get vendor by encrypted ID
const vendor = await vendorService.getVendorById(decryptedVendorId);

// Update vendor settings
await vendorService.updateVendorSetting(vendorId, settingKey, settingValue);
```

## **🔧 Setup Requirements**

### **Environment Variables**
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sustentus_master
DB_PORT=3306

# Encryption
ENCRYPTION_KEY=your-32-character-secure-key

# Email
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
FROM_EMAIL=your_email
```

### **Dependencies**
```json
{
  "mysql2": "^3.6.5",
  "uuid": "^9.0.1",
  "crypto": "built-in"
}
```

## **🧪 Testing**

### **Complete Flow Test**
1. **Register** new vendor → Get encrypted Vendor ID
2. **Click magic link** → Validate token → Access payment
3. **Complete payment** → Store vendor data
4. **Access dashboard** → Use encrypted Vendor ID
5. **Update settings** → Modify vendor preferences

### **API Testing**
```bash
# Test vendor creation
curl -X POST http://localhost:3001/api/send-magic-link \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "plan": "Starter", "registrationData": {...}}'

# Test vendor access
curl http://localhost:3001/api/vendor/v_aBcDeF123.../dashboard
```

## **🔒 Security Considerations**

### **Production Deployment**
- **Generate unique encryption keys** for each environment
- **Use dedicated database users** with minimal permissions
- **Enable HTTPS** for all API communications
- **Implement rate limiting** for API endpoints

### **Access Control**
- **Validate token expiration** (24 hours)
- **Log all access attempts** for audit trails
- **Implement session management** for long-term access
- **Add authentication middleware** for sensitive operations

## **📈 Future Enhancements**

### **Planned Features**
- **Multi-factor authentication** for vendor access
- **API key management** for integrations
- **Role-based access control** for team members
- **Advanced analytics** and reporting
- **Webhook notifications** for plan changes

### **Integration Points**
- **CRM systems** (Salesforce, HubSpot)
- **Payment gateways** (Stripe, PayPal)
- **SSO providers** (Okta, Auth0)
- **Monitoring tools** (DataDog, New Relic)

## **🎉 Summary**

The encrypted Vendor ID system provides:
- ✅ **Secure access** to vendor data
- ✅ **Persistent storage** of vendor information
- ✅ **Scalable architecture** for growth
- ✅ **Audit trails** for compliance
- ✅ **Easy integration** with existing systems

**Every vendor interaction is now secure, tracked, and persistent!** 🚀
