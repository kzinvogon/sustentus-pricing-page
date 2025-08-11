const crypto = require('crypto');
require('dotenv').config();

// Encryption configuration
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012';
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

class EncryptionService {
  
  // Encrypt a Vendor ID
  static encryptVendorId(vendorId) {
    try {
      // Generate a random IV
      const iv = crypto.randomBytes(IV_LENGTH);
      
               // Create cipher
         const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
         cipher.setAutoPadding(true);
      
      // Encrypt the vendor ID
      let encrypted = cipher.update(vendorId, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Combine IV and encrypted data
      const result = iv.toString('hex') + ':' + encrypted;
      
      // URL-safe base64 encoding
      return Buffer.from(result).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
        
    } catch (error) {
      console.error('❌ Encryption failed:', error);
      throw new Error('Failed to encrypt vendor ID');
    }
  }
  
  // Decrypt a Vendor ID
  static decryptVendorId(encryptedVendorId) {
    try {
      // Restore base64 padding and convert back
      let padded = encryptedVendorId
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      
      // Add padding if needed
      while (padded.length % 4) {
        padded += '=';
      }
      
      // Decode base64
      const decoded = Buffer.from(padded, 'base64').toString('utf8');
      
      // Split IV and encrypted data
      const parts = decoded.split(':');
      if (parts.length !== 2) {
        throw new Error('Invalid encrypted format');
      }
      
      const iv = Buffer.from(parts[0], 'hex');
      const encrypted = parts[1];
      
                   // Create decipher
             const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
             decipher.setAutoPadding(true);
      
      // Decrypt
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
      
    } catch (error) {
      console.error('❌ Decryption failed:', error);
      throw new Error('Failed to decrypt vendor ID');
    }
  }
  
  // Generate a secure token for magic links
  static generateSecureToken(vendorId, email, plan) {
    try {
      const data = {
        vendorId,
        email,
        plan,
        timestamp: Date.now(),
        random: crypto.randomBytes(16).toString('hex')
      };
      
      const jsonData = JSON.stringify(data);
      return this.encryptVendorId(jsonData);
      
    } catch (error) {
      console.error('❌ Token generation failed:', error);
      throw new Error('Failed to generate secure token');
    }
  }
  
  // Validate and extract data from secure token
  static validateSecureToken(encryptedToken) {
    try {
      const decrypted = this.decryptVendorId(encryptedToken);
      const data = JSON.parse(decrypted);
      
      // Check if token is expired (24 hours)
      const tokenAge = Date.now() - data.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      if (tokenAge > maxAge) {
        throw new Error('Token expired');
      }
      
      return data;
      
    } catch (error) {
      console.error('❌ Token validation failed:', error);
      throw new Error('Invalid or expired token');
    }
  }
  
  // Create a URL-safe vendor identifier
  static createVendorUrlId(vendorId) {
    try {
      const encrypted = this.encryptVendorId(vendorId);
      return `v_${encrypted}`;
    } catch (error) {
      console.error('❌ URL ID creation failed:', error);
      throw new Error('Failed to create vendor URL ID');
    }
  }
  
  // Extract vendor ID from URL identifier
  static extractVendorIdFromUrl(urlId) {
    try {
      if (!urlId.startsWith('v_')) {
        throw new Error('Invalid URL ID format');
      }
      
      const encrypted = urlId.substring(2);
      return this.decryptVendorId(encrypted);
      
    } catch (error) {
      console.error('❌ URL ID extraction failed:', error);
      throw new Error('Failed to extract vendor ID from URL');
    }
  }
}

module.exports = EncryptionService;
