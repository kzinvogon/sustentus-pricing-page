import nodemailer from 'nodemailer';

// Create a transporter using Gmail SMTP (you can change this to any provider)
// For Gmail, you'll need to enable "Less secure app access" or use App Passwords
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail', // or 'outlook', 'yahoo', etc.
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

// Alternative: Use your own SMTP server
const createCustomTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-password'
    }
  });
};

export const sendMagicLink = async (email, plan, token) => {
  const magicLink = `${window.location.origin}?token=${token}&plan=${plan}`;
  
  const mailOptions = {
    from: process.env.FROM_EMAIL || 'noreply@sustentus.com',
    to: email,
    subject: `Complete Your ${plan} Plan - Magic Link`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to Sustentus!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Complete your ${plan} plan setup</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">You're Almost There!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Thank you for choosing Sustentus! To complete your ${plan} plan setup and proceed to payment, 
            please click the button below.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${magicLink}" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
              Complete Setup & Payment
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 25px;">
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          <p style="color: #667eea; font-size: 14px; word-break: break-all; margin: 10px 0;">
            ${magicLink}
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              This link will expire in 24 hours. If you didn't request this email, please ignore it.
            </p>
          </div>
        </div>
      </div>
    `
  };

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log('Magic link email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Nodemailer error:', error);
    return { success: false, error: error.message };
  }
};

export const sendWelcomeEmail = async (email, plan, registrationData) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL || 'noreply@sustentus.com',
    to: email,
    subject: `Welcome to Sustentus ${plan} Plan!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Welcome to Sustentus!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your ${plan} plan is now active</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Account Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Company Information</h3>
            <p><strong>Company:</strong> ${registrationData.companyName}</p>
            <p><strong>Contact:</strong> ${registrationData.contactName}</p>
            <p><strong>Email:</strong> ${registrationData.email}</p>
            <p><strong>Phone:</strong> ${registrationData.phone}</p>
            <p><strong>Country:</strong> ${registrationData.country}</p>
          </div>
          
          <h3 style="color: #333;">What's Next?</h3>
          <ul style="color: #666; line-height: 1.6;">
            <li>Access your dashboard at <a href="https://app.sustentus.com" style="color: #667eea;">app.sustentus.com</a></li>
            <li>Set up your team members and permissions</li>
            <li>Configure your first project and lead intake</li>
            <li>Explore our knowledge base and support resources</li>
          </ul>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #155724; margin-top: 0;">Need Help?</h4>
            <p style="color: #155724; margin-bottom: 0;">
              Our support team is here to help you get started. 
              Contact us at <a href="mailto:support@sustentus.com" style="color: #155724;">support@sustentus.com</a>
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://app.sustentus.com" 
               style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
              Access Your Dashboard
            </a>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} Sustentus. All rights reserved.
          </p>
        </div>
      </div>
    `
  };

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Nodemailer error:', error);
    return { success: false, error: error.message };
  }
};

export const sendPaymentConfirmation = async (email, plan, registrationData, paymentDetails) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL || 'noreply@sustentus.com',
    to: email,
    subject: `Payment Confirmation - Sustentus ${plan} Plan`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">💳 Payment Successful!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your ${plan} plan payment has been processed</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Payment Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Transaction Summary</h3>
            <p><strong>Plan:</strong> ${plan}</p>
            <p><strong>Amount:</strong> €${plan === 'Trial' ? '0' : plan === 'Starter' ? '150' : plan === 'Standard' ? '750' : 'POA'}</p>
            <p><strong>Billing Cycle:</strong> Monthly</p>
            <p><strong>Next Billing:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Account Information</h3>
            <p><strong>Company:</strong> ${registrationData.companyName}</p>
            <p><strong>Contact:</strong> ${registrationData.contactName}</p>
            <p><strong>Email:</strong> ${registrationData.email}</p>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #155724; margin-top: 0;">What's Included</h4>
            <p style="color: #155724; margin-bottom: 0;">
              Your ${plan} plan includes all the features you selected. 
              Check your dashboard for complete details and get started today!
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://app.sustentus.com" 
               style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
              Access Your Account
            </a>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `
  };

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log('Payment confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Nodemailer error:', error);
    return { success: false, error: error.message };
  }
};
