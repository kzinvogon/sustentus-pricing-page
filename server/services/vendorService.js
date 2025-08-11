const { v4: uuidv4 } = require('uuid');
const db = require('../database/connection');

class VendorService {
  
  // Create a new vendor with initial plan
  async createVendor(vendorData, planType) {
    try {
      console.log('🔍 Starting vendor creation...');
      console.log('🔍 Vendor data:', vendorData);
      console.log('🔍 Plan type:', planType);
      
      const vendorId = uuidv4();
      const planId = uuidv4();
      
      console.log('🔍 Generated IDs:', { vendorId, planId });
      
      // Calculate plan dates and pricing
      const startDate = new Date();
      const renewalDate = new Date();
      renewalDate.setMonth(renewalDate.getMonth() + 1);
      
      const planPricing = this.getPlanPricing(planType);
      console.log('🔍 Plan pricing:', planPricing);
      
      // Create vendor and plan in a transaction
      const queries = [
        {
          sql: `INSERT INTO vendors (vendor_id, company_name, contact_name, billing_address, email, phone, country, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          params: [vendorId, vendorData.companyName, vendorData.contactName, vendorData.billingAddress, vendorData.email, vendorData.phone, vendorData.country, 'trial']
        },
        {
          sql: `INSERT INTO vendor_plans (plan_id, vendor_id, plan_type, plan_status, start_date, renewal_date, monthly_price, billing_cycle) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          params: [planId, vendorId, planType, 'active', startDate, renewalDate, planPricing.monthlyPrice, 'monthly']
        }
      ];
      
      console.log('🔍 SQL queries prepared:', queries.length);
      console.log('🔍 First query params:', queries[0].params);
      console.log('🔍 Second query params:', queries[1].params);
      
      // Insert default settings for the vendor
      const defaultSettings = this.getDefaultSettings(planType);
      console.log('🔍 Default settings count:', defaultSettings.length);
      
      for (const setting of defaultSettings) {
        queries.push({
          sql: `INSERT INTO vendor_settings (setting_id, vendor_id, setting_key, setting_value, setting_type, is_public) 
                VALUES (?, ?, ?, ?, ?, ?)`,
          params: [uuidv4(), vendorId, setting.key, setting.value, setting.type, setting.isPublic]
        });
      }
      
      console.log('🔍 Total queries to execute:', queries.length);
      console.log('🔍 About to execute transaction...');
      
      await db.executeTransaction(queries);
      
      console.log('🔍 Transaction executed successfully');
      
      // Log the vendor creation
      await this.logVendorAccess(vendorId, 'plan_change', true, {
        action: 'vendor_created',
        plan_type: planType,
        email: vendorData.email
      });
      
      console.log('🔍 Vendor access logged successfully');
      
      return {
        vendorId,
        planId,
        success: true,
        message: 'Vendor created successfully'
      };
      
    } catch (error) {
      console.error('❌ Error creating vendor:', error);
      console.error('❌ Error stack:', error.stack);
      throw new Error('Failed to create vendor');
    }
  }
  
  // Get vendor by ID
  async getVendorById(vendorId) {
    try {
      const vendor = await db.executeQuerySingle(
        `SELECT v.*, vp.plan_type, vp.plan_status, vp.renewal_date, vp.monthly_price 
         FROM vendors v 
         LEFT JOIN vendor_plans vp ON v.vendor_id = vp.vendor_id 
         WHERE v.vendor_id = ? AND vp.plan_status = 'active'`,
        [vendorId]
      );
      
      if (!vendor) return null;
      
      // Get vendor settings
      const settings = await db.executeQuery(
        'SELECT setting_key, setting_value, setting_type, is_public FROM vendor_settings WHERE vendor_id = ?',
        [vendorId]
      );
      
      vendor.settings = this.formatSettings(settings);
      
      return vendor;
    } catch (error) {
      console.error('❌ Error getting vendor:', error);
      throw new Error('Failed to get vendor');
    }
  }
  
  // Get vendor by email
  async getVendorByEmail(email) {
    try {
      const vendor = await db.executeQuerySingle(
        `SELECT v.*, vp.plan_type, vp.plan_status, vp.renewal_date, vp.monthly_price 
         FROM vendors v 
         LEFT JOIN vendor_plans vp ON v.vendor_id = vp.vendor_id 
         WHERE v.email = ? AND vp.plan_status = 'active'`,
        [email]
      );
      
      if (!vendor) return null;
      
      // Get vendor settings
      const settings = await db.executeQuery(
        'SELECT setting_key, setting_value, setting_type, is_public FROM vendor_settings WHERE vendor_id = ?',
        [vendor.vendor_id]
      );
      
      vendor.settings = this.formatSettings(settings);
      
      return vendor;
    } catch (error) {
      console.error('❌ Error getting vendor by email:', error);
      throw new Error('Failed to get vendor');
    }
  }
  
  // Update vendor plan
  async updateVendorPlan(vendorId, newPlanType) {
    try {
      const currentPlan = await db.executeQuerySingle(
        'SELECT * FROM vendor_plans WHERE vendor_id = ? AND plan_status = "active"',
        [vendorId]
      );
      
      if (!currentPlan) {
        throw new Error('No active plan found for vendor');
      }
      
      // Deactivate current plan
      await db.executeQuery(
        'UPDATE vendor_plans SET plan_status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE plan_id = ?',
        [currentPlan.plan_id]
      );
      
      // Create new plan
      const newPlanId = uuidv4();
      const startDate = new Date();
      const renewalDate = new Date();
      renewalDate.setMonth(renewalDate.getMonth() + 1);
      
      const planPricing = this.getPlanPricing(newPlanType);
      
      await db.executeQuery(
        `INSERT INTO vendor_plans (plan_id, vendor_id, plan_type, plan_status, start_date, renewal_date, monthly_price, billing_cycle) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [newPlanId, vendorId, newPlanType, 'active', startDate, renewalDate, planPricing.monthlyPrice, 'monthly']
      );
      
      // Update vendor settings based on new plan
      await this.updateVendorSettingsForPlan(vendorId, newPlanType);
      
      // Log the plan change
      await this.logVendorAccess(vendorId, 'plan_change', true, {
        action: 'plan_updated',
        old_plan: currentPlan.plan_type,
        new_plan: newPlanType
      });
      
      return {
        success: true,
        message: 'Vendor plan updated successfully',
        newPlanId
      };
      
    } catch (error) {
      console.error('❌ Error updating vendor plan:', error);
      throw new Error('Failed to update vendor plan');
    }
  }
  
  // Update vendor settings
  async updateVendorSetting(vendorId, settingKey, settingValue) {
    try {
      await db.executeQuery(
        `INSERT INTO vendor_settings (setting_id, vendor_id, setting_key, setting_value, setting_type, is_public) 
         VALUES (?, ?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = CURRENT_TIMESTAMP`,
        [uuidv4(), vendorId, settingKey, settingValue, 'string', true]
      );
      
      // Log the settings update
      await this.logVendorAccess(vendorId, 'settings_update', true, {
        action: 'setting_updated',
        setting_key: settingKey,
        setting_value: settingValue
      });
      
      return { success: true, message: 'Setting updated successfully' };
    } catch (error) {
      console.error('❌ Error updating vendor setting:', error);
      throw new Error('Failed to update vendor setting');
    }
  }
  
  // Get vendor dashboard data
  async getVendorDashboard(vendorId) {
    try {
      const vendor = await this.getVendorById(vendorId);
      if (!vendor) return null;
      
      // Get recent access logs
      const recentLogs = await db.executeQuery(
        'SELECT access_type, success, created_at FROM vendor_access_logs WHERE vendor_id = ? ORDER BY created_at DESC LIMIT 10',
        [vendorId]
      );
      
      // Get plan statistics
      const planStats = await db.executeQuery(
        'SELECT COUNT(*) as total_plans, SUM(CASE WHEN plan_status = "active" THEN 1 ELSE 0 END) as active_plans FROM vendor_plans WHERE vendor_id = ?',
        [vendorId]
      );
      
      return {
        vendor,
        recentActivity: recentLogs,
        planStatistics: planStats[0],
        dashboardUrl: `https://app.sustentus.com/dashboard/${vendorId}`
      };
      
    } catch (error) {
      console.error('❌ Error getting vendor dashboard:', error);
      throw new Error('Failed to get vendor dashboard');
    }
  }
  
  // Log vendor access
  async logVendorAccess(vendorId, accessType, success, details = {}) {
    try {
      await db.executeQuery(
        `INSERT INTO vendor_access_logs (log_id, vendor_id, access_type, success, details) 
         VALUES (?, ?, ?, ?, ?)`,
        [uuidv4(), vendorId, accessType, success, JSON.stringify(details)]
      );
    } catch (error) {
      console.error('❌ Error logging vendor access:', error);
      // Don't throw error for logging failures
    }
  }
  
  // Helper: Get plan pricing
  getPlanPricing(planType) {
    const pricing = {
      'Trial': { monthlyPrice: 0.00, features: ['basic'] },
      'Starter': { monthlyPrice: 29.00, features: ['basic', 'crm_sync'] },
      'Standard': { monthlyPrice: 99.00, features: ['basic', 'crm_sync', 'ai_helpers', 'flexible_timers'] },
      'Premier': { monthlyPrice: 299.00, features: ['basic', 'crm_sync', 'ai_helpers', 'flexible_timers', 'managed_service', 'custom_integrations'] }
    };
    
    return pricing[planType] || pricing['Trial'];
  }
  
  // Helper: Get default settings for plan
  getDefaultSettings(planType) {
    const baseSettings = [
      { key: 'max_customers', value: '500', type: 'number', isPublic: true },
      { key: 'max_experts', value: '1000', type: 'number', isPublic: true },
      { key: 'max_leads_per_month', value: '100', type: 'number', isPublic: true },
      { key: 'import_leads_via_csv', value: 'true', type: 'boolean', isPublic: true },
      { key: 'custom_branding', value: 'false', type: 'boolean', isPublic: true },
      { key: 'team_member_login', value: 'false', type: 'boolean', isPublic: true },
      { key: 'sales_regions', value: '1', type: 'number', isPublic: true },
      { key: 'license_tracking', value: 'false', type: 'boolean', isPublic: true },
      { key: 'conversion_stats', value: 'false', type: 'boolean', isPublic: true },
      { key: 'service_timers', value: 'false', type: 'boolean', isPublic: true }
    ];
    
    // Adjust settings based on plan
    if (planType === 'Standard') {
      baseSettings.find(s => s.key === 'max_customers').value = '5000';
      baseSettings.find(s => s.key === 'max_experts').value = '25000';
      baseSettings.find(s => s.key === 'max_leads_per_month').value = '1000';
      baseSettings.find(s => s.key === 'custom_branding').value = 'true';
      baseSettings.find(s => s.key === 'team_member_login').value = 'true';
      baseSettings.find(s => s.key === 'sales_regions').value = '2';
      baseSettings.find(s => s.key === 'license_tracking').value = 'true';
      baseSettings.find(s => s.key === 'conversion_stats').value = 'true';
      baseSettings.find(s => s.key === 'service_timers').value = 'true';
    } else if (planType === 'Premier') {
      baseSettings.find(s => s.key === 'max_customers').value = 'unlimited';
      baseSettings.find(s => s.key === 'max_experts').value = 'unlimited';
      baseSettings.find(s => s.key === 'max_leads_per_month').value = 'unlimited';
      baseSettings.find(s => s.key === 'custom_branding').value = 'true';
      baseSettings.find(s => s.key === 'team_member_login').value = 'true';
      baseSettings.find(s => s.key === 'sales_regions').value = 'unlimited';
      baseSettings.find(s => s.key === 'license_tracking').value = 'true';
      baseSettings.find(s => s.key === 'conversion_stats').value = 'true';
      baseSettings.find(s => s.key === 'service_timers').value = 'true';
    }
    
    return baseSettings;
  }
  
  // Helper: Format settings for response
  formatSettings(settings) {
    const formatted = {};
    for (const setting of settings) {
      let value = setting.setting_value;
      
      // Convert value based on type
      if (setting.setting_type === 'number') {
        value = value === 'unlimited' ? 'unlimited' : parseInt(value);
      } else if (setting.setting_type === 'boolean') {
        value = value === 'true';
      } else if (setting.setting_type === 'json') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          value = value;
        }
      }
      
      formatted[setting.setting_key] = {
        value,
        type: setting.setting_type,
        isPublic: setting.is_public
      };
    }
    
    return formatted;
  }
}

module.exports = new VendorService();
