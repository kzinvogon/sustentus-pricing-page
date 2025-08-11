const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const vendorService = require('./services/vendorService');
const EncryptionService = require('./utils/encryption');
const db = require('./database/connection');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create transporter for Office 365
const createTransporter = () => {
  // Office 365 SMTP configuration - much more reliable for business emails
  return nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false
    }
  });
};

// Email templates
const createMagicLinkEmail = (email, plan, token) => ({
  from: process.env.FROM_EMAIL,
  to: email,
  subject: `Welcome to Sustentus - Complete Your ${plan} Plan Setup`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px;">Welcome to Sustentus!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Complete your ${plan} plan setup</p>
      </div>
      
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #333; margin-bottom: 20px;">Almost there!</h2>
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Thank you for choosing Sustentus! To complete your account setup and access your ${plan} plan, please click the button below:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}?token=${token}&plan=${plan}" 
             style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Complete Setup
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          This link will expire in 24 hours. If you didn't request this email, please ignore it.
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #999; font-size: 12px;">
            Sustentus Business Solutions<br>
            Transforming business operations through intelligent automation
          </p>
        </div>
      </div>
    </div>
  `
});

const createWelcomeEmail = (email, plan, registrationData) => ({
  from: process.env.FROM_EMAIL,
  to: email,
  subject: `Welcome to Sustentus - Your ${plan} Plan is Active!`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px;">🎉 Welcome to Sustentus!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Your ${plan} plan is now active</p>
      </div>
      
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #333; margin-bottom: 20px;">Account Details</h2>
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p><strong>Company:</strong> ${registrationData.companyName}</p>
          <p><strong>Contact:</strong> ${registrationData.contactName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Plan:</strong> ${plan}</p>
        </div>
        
        <h3 style="color: #333; margin-bottom: 15px;">🚀 Next Steps</h3>
        <ul style="color: #666; line-height: 1.6;">
          <li>Access your dashboard at <a href="https://app.sustentus.com" style="color: #667eea;">app.sustentus.com</a></li>
          <li>Set up your team and integrations</li>
          <li>Configure your business processes</li>
          <li>Start using your new features</li>
        </ul>
        
        <div style="margin-top: 30px; padding: 20px; background: #e8f5e8; border-radius: 8px; border-left: 4px solid #28a745;">
          <h4 style="color: #155724; margin: 0 0 10px 0;">Need Help?</h4>
          <p style="color: #155724; margin: 0;">
            Our support team is here to help! Contact us at <a href="mailto:support@sustentus.com" style="color: #155724;">support@sustentus.com</a>
          </p>
        </div>
      </div>
    </div>
  `
});

const createPaymentConfirmationEmail = (email, plan, registrationData, paymentDetails) => ({
  from: process.env.FROM_EMAIL,
  to: email,
  subject: `Payment Confirmation - Sustentus ${plan} Plan`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px;">💳 Payment Confirmed!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Your payment has been processed successfully</p>
      </div>
      
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #333; margin-bottom: 20px;">Payment Details</h2>
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p><strong>Amount:</strong> €${getPlanPrice(plan)}/month</p>
          <p><strong>Plan:</strong> ${plan}</p>
          <p><strong>Company:</strong> ${registrationData.companyName}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #d1ecf1; border-radius: 8px; border-left: 4px solid #17a2b8;">
          <h4 style="color: #0c5460; margin: 0 0 10px 0;">What's Next?</h4>
          <p style="color: #0c5460; margin: 0;">
            Your account is now fully activated! Check your email for login credentials and start using Sustentus today.
          </p>
        </div>
      </div>
    </div>
  `
});

// Helper function to get plan price
const getPlanPrice = (plan) => {
  const prices = {
    'Trial': 0,
    'Starter': 29,
    'Standard': 99,
    'Premier': 299
  };
  return prices[plan] || 0;
};

// Initialize database on startup
app.use(async (req, res, next) => {
  try {
    if (!db.pool) {
      await db.initializeDatabase();
    }
    next();
  } catch (error) {
    console.error('Database initialization failed:', error);
    next(error);
  }
});

// Routes
app.post('/api/send-magic-link', async (req, res) => {
  try {
    const { email, plan, registrationData } = req.body;
    
    console.log('🔍 Magic link request received:', { email, plan, companyName: registrationData.companyName });
    
    if (!email || !plan || !registrationData) {
      return res.status(400).json({ success: false, error: 'Email, plan, and registration data are required' });
    }

    // Check if vendor already exists
    console.log('🔍 Checking if vendor exists...');
    let vendor = await vendorService.getVendorByEmail(email);
    console.log('🔍 Existing vendor check result:', vendor ? 'Found' : 'Not found');
    
    if (!vendor) {
      // Create new vendor in database
      console.log('🔍 Creating new vendor...');
      const vendorResult = await vendorService.createVendor(registrationData, plan);
      console.log('🔍 Vendor creation result:', vendorResult);
      
      vendor = await vendorService.getVendorById(vendorResult.vendorId);
      console.log('🔍 Retrieved vendor after creation:', vendor ? 'Success' : 'Failed');
    }
    
    if (!vendor || !vendor.vendor_id) {
      throw new Error('Failed to create or retrieve vendor');
    }
    
    // Generate secure token with encrypted vendor ID
    console.log('🔍 Generating secure token...');
    const secureToken = EncryptionService.generateSecureToken(vendor.vendor_id, email, plan);
    
    const transporter = createTransporter();
    const mailOptions = createMagicLinkEmail(email, plan, secureToken);
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`Magic link sent successfully to: ${email}`);
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    console.log('Vendor ID:', vendor.vendor_id);
    
    const encryptedVendorId = EncryptionService.createVendorUrlId(vendor.vendor_id);
    console.log('🔍 Generated encrypted Vendor ID:', encryptedVendorId);
    
    res.json({ 
      success: true, 
      message: 'Magic link sent successfully', 
      messageId: info.messageId,
      vendorId: vendor.vendor_id,
      encryptedVendorId: encryptedVendorId
    });
    
  } catch (error) {
    console.error('❌ Error sending magic link:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ success: false, error: 'Failed to send magic link' });
  }
});

app.post('/api/send-welcome-email', async (req, res) => {
  try {
    const { email, plan, registrationData } = req.body;
    
    if (!email || !plan || !registrationData) {
      return res.status(400).json({ success: false, error: 'Email, plan, and registration data are required' });
    }

    const transporter = createTransporter();
    const mailOptions = createWelcomeEmail(email, plan, registrationData);
    
    await transporter.sendMail(mailOptions);
    
    console.log(`Welcome email sent successfully to: ${email}`);
    res.json({ success: true, message: 'Welcome email sent successfully' });
    
  } catch (error) {
    console.error('Error sending welcome email:', error);
    res.status(500).json({ success: false, error: 'Failed to send welcome email' });
  }
});

app.post('/api/send-payment-confirmation', async (req, res) => {
  try {
    const { email, plan, registrationData, paymentDetails } = req.body;
    
    if (!email || !plan || !registrationData) {
      return res.status(400).json({ success: false, error: 'Email, plan, and registration data are required' });
    }

    const transporter = createTransporter();
    const mailOptions = createPaymentConfirmationEmail(email, plan, registrationData, paymentDetails);
    
    await transporter.sendMail(mailOptions);
    
    console.log(`Payment confirmation email sent successfully to: ${email}`);
    res.json({ success: true, message: 'Payment confirmation email sent successfully' });
    
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    res.status(500).json({ success: false, error: 'Failed to send payment confirmation email' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sustentus Email Server is running' });
});

// Vendor management endpoints
app.get('/api/vendor/:encryptedVendorId', async (req, res) => {
  try {
    const { encryptedVendorId } = req.params;
    
    // Extract vendor ID from encrypted URL identifier
    const vendorId = EncryptionService.extractVendorIdFromUrl(encryptedVendorId);
    
    // Get vendor data
    const vendor = await vendorService.getVendorById(vendorId);
    
    if (!vendor) {
      return res.status(404).json({ success: false, error: 'Vendor not found' });
    }
    
    res.json({ success: true, vendor });
    
  } catch (error) {
    console.error('Error getting vendor:', error);
    res.status(400).json({ success: false, error: 'Invalid vendor identifier' });
  }
});

app.get('/api/vendor/:encryptedVendorId/dashboard', async (req, res) => {
  try {
    const { encryptedVendorId } = req.params;
    
    // Extract vendor ID from encrypted URL identifier
    const vendorId = EncryptionService.extractVendorIdFromUrl(encryptedVendorId);
    
    // Get vendor dashboard data
    const dashboard = await vendorService.getVendorDashboard(vendorId);
    
    if (!vendor) {
      return res.status(404).json({ success: false, error: 'Vendor not found' });
    }
    
    res.json({ success: true, dashboard });
    
  } catch (error) {
    console.error('Error getting vendor dashboard:', error);
    res.status(400).json({ success: false, error: 'Invalid vendor identifier' });
  }
});

app.put('/api/vendor/:encryptedVendorId/settings', async (req, res) => {
  try {
    const { encryptedVendorId } = req.params;
    const { settingKey, settingValue } = req.body;
    
    // Extract vendor ID from encrypted URL identifier
    const vendorId = EncryptionService.extractVendorIdFromUrl(encryptedVendorId);
    
    // Update vendor setting
    const result = await vendorService.updateVendorSetting(vendorId, settingKey, settingValue);
    
    res.json({ success: true, result });
    
  } catch (error) {
    console.error('Error updating vendor setting:', error);
    res.status(400).json({ success: false, error: 'Failed to update vendor setting' });
  }
});

app.put('/api/vendor/:encryptedVendorId/plan', async (req, res) => {
  try {
    const { encryptedVendorId } = req.params;
    const { newPlanType } = req.body;
    
    // Extract vendor ID from encrypted URL identifier
    const vendorId = EncryptionService.extractVendorIdFromUrl(encryptedVendorId);
    
    // Update vendor plan
    const result = await vendorService.updateVendorPlan(vendorId, newPlanType);
    
    res.json({ success: true, result });
    
  } catch (error) {
    console.error('Error updating vendor plan:', error);
    res.status(400).json({ success: false, error: 'Failed to update vendor plan' });
  }
});

// Test endpoint that doesn't require email
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is working',
    timestamp: new Date().toISOString(),
    emailConfig: {
      user: process.env.EMAIL_USER ? 'Configured' : 'Missing',
      pass: process.env.EMAIL_PASS ? 'Configured' : 'Missing'
    }
  });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const isHealthy = await db.healthCheck();
    res.json({ 
      status: 'OK', 
      message: 'Database connection test',
      database: isHealthy ? 'Connected' : 'Failed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'Error', 
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test vendor service
app.get('/api/test-vendor', async (req, res) => {
  try {
    // Test basic vendor service functionality
    const testData = {
      companyName: 'Test Company',
      contactName: 'Test User',
      billingAddress: '123 Test St',
      email: 'test@example.com',
      phone: '1234567890',
      country: 'US'
    };
    
    console.log('🧪 Testing vendor service...');
    const result = await vendorService.createVendor(testData, 'Starter');
    console.log('🧪 Vendor creation result:', result);
    
    res.json({ 
      status: 'OK', 
      message: 'Vendor service test',
      result: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Vendor service test failed:', error);
    res.status(500).json({ 
      status: 'Error', 
      message: 'Vendor service test failed',
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
});

// Test magic link flow without email sending
app.post('/api/test-magic-link-flow', async (req, res) => {
  try {
    const { email, plan, registrationData } = req.body;
    
    console.log('🧪 Testing magic link flow...');
    console.log('Request data:', { email, plan, registrationData });
    
    if (!email || !plan || !registrationData) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields',
        received: { email, plan, registrationData }
      });
    }
    
    // Check if vendor exists
    console.log('🔍 Checking if vendor exists...');
    const existingVendor = await vendorService.getVendorByEmail(email);
    console.log('🔍 Existing vendor check result:', existingVendor ? 'Found' : 'Not found');
    
    let vendorId;
    if (!existingVendor) {
      console.log('🔍 Creating new vendor...');
      const vendorResult = await vendorService.createVendor(registrationData, plan);
      console.log('🔍 Vendor creation result:', vendorResult);
      vendorId = vendorResult.vendorId;
    } else {
      vendorId = existingVendor.vendor_id;
    }
    
    // Generate encrypted vendor ID
    console.log('🔍 Generating encrypted vendor ID...');
    const encryptedVendorId = EncryptionService.createVendorUrlId(vendorId);
    console.log('🔍 Encrypted vendor ID:', encryptedVendorId);
    
    res.json({
      success: true,
      vendorId,
      encryptedVendorId,
      message: 'Magic link flow test successful'
    });
    
  } catch (error) {
    console.error('❌ Magic link flow test failed:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Sustentus Email Server running on port ${PORT}`);
  console.log(`📧 Email functionality enabled`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
