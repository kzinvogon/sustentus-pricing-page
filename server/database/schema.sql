-- Master Database Schema for Sustentus Vendor Management
-- This database stores vendor information, plans, and settings

-- Create the Master database
CREATE DATABASE IF NOT EXISTS sustentus_master;
USE sustentus_master;

-- Vendors table - Core vendor information
CREATE TABLE IF NOT EXISTS vendors (
    vendor_id VARCHAR(36) PRIMARY KEY, -- UUID for unique identification
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    billing_address TEXT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    country VARCHAR(3) DEFAULT 'US',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active', 'suspended', 'cancelled', 'trial') DEFAULT 'trial',
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Vendor Plans table - Plan subscriptions and billing
CREATE TABLE IF NOT EXISTS vendor_plans (
    plan_id VARCHAR(36) PRIMARY KEY,
    vendor_id VARCHAR(36) NOT NULL,
    plan_type ENUM('Trial', 'Starter', 'Standard', 'Premier') NOT NULL,
    plan_status ENUM('active', 'expired', 'cancelled', 'pending') DEFAULT 'pending',
    start_date DATE NOT NULL,
    renewal_date DATE NOT NULL,
    monthly_price DECIMAL(10,2) DEFAULT 0.00,
    billing_cycle ENUM('monthly', 'annual') DEFAULT 'monthly',
    auto_renewal BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE,
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_plan_type (plan_type),
    INDEX idx_renewal_date (renewal_date),
    INDEX idx_status (plan_status)
);

-- Vendor Settings table - Configurable preferences and settings
CREATE TABLE IF NOT EXISTS vendor_settings (
    setting_id VARCHAR(36) PRIMARY KEY,
    vendor_id VARCHAR(36) NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    is_public BOOLEAN DEFAULT FALSE, -- Whether setting is visible to vendor
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE,
    UNIQUE KEY unique_vendor_setting (vendor_id, setting_key),
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_setting_key (setting_key)
);

-- Vendor Access Logs table - Track login attempts and access
CREATE TABLE IF NOT EXISTS vendor_access_logs (
    log_id VARCHAR(36) PRIMARY KEY,
    vendor_id VARCHAR(36) NOT NULL,
    access_type ENUM('login', 'logout', 'password_reset', 'plan_change', 'settings_update') NOT NULL,
    ip_address VARCHAR(45), -- IPv4 or IPv6
    user_agent TEXT,
    success BOOLEAN DEFAULT TRUE,
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE,
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_access_type (access_type),
    INDEX idx_created_at (created_at),
    INDEX idx_success (success)
);

-- Create a default vendor for system settings
INSERT INTO vendors (vendor_id, company_name, contact_name, billing_address, email, phone, country, status) VALUES
('00000000-0000-0000-0000-000000000000', 'Sustentus System', 'System Admin', 'System Address', 'system@sustentus.com', '0000000000', 'US', 'active');

-- Insert default settings for new vendors
INSERT INTO vendor_settings (setting_id, vendor_id, setting_key, setting_value, setting_type, is_public) VALUES
(UUID(), '00000000-0000-0000-0000-000000000000', 'max_customers', '500', 'number', TRUE),
(UUID(), '00000000-0000-0000-0000-000000000000', 'max_experts', '1000', 'number', TRUE),
(UUID(), '00000000-0000-0000-0000-000000000000', 'max_leads_per_month', '100', 'number', TRUE),
(UUID(), '00000000-0000-0000-0000-000000000000', 'import_leads_via_csv', 'true', 'boolean', TRUE),
(UUID(), '00000000-0000-0000-0000-000000000000', 'custom_branding', 'false', 'boolean', TRUE),
(UUID(), '00000000-0000-0000-0000-000000000000', 'team_member_login', 'false', 'boolean', TRUE),
(UUID(), '00000000-0000-0000-0000-000000000000', 'sales_regions', '1', 'number', TRUE),
(UUID(), '00000000-0000-0000-0000-000000000000', 'license_tracking', 'false', 'boolean', TRUE),
(UUID(), '00000000-0000-0000-0000-000000000000', 'conversion_stats', 'false', 'boolean', TRUE),
(UUID(), '00000000-0000-0000-0000-000000000000', 'service_timers', 'false', 'boolean', TRUE);

-- Create indexes for better performance
CREATE INDEX idx_vendors_company_name ON vendors(company_name);
CREATE INDEX idx_vendors_contact_name ON vendors(contact_name);
CREATE INDEX idx_vendor_plans_start_date ON vendor_plans(start_date);
CREATE INDEX idx_vendor_settings_public ON vendor_settings(is_public);

-- Create a view for active vendor plans
CREATE VIEW active_vendor_plans AS
SELECT 
    v.vendor_id,
    v.company_name,
    v.email,
    vp.plan_type,
    vp.plan_status,
    vp.start_date,
    vp.renewal_date,
    vp.monthly_price,
    vp.billing_cycle,
    vp.auto_renewal,
    v.status as vendor_status
FROM vendors v
JOIN vendor_plans vp ON v.vendor_id = vp.vendor_id
WHERE vp.plan_status = 'active' 
AND v.status = 'active';

-- Create a view for vendor settings summary
CREATE VIEW vendor_settings_summary AS
SELECT 
    v.vendor_id,
    v.company_name,
    vp.plan_type,
    vp.plan_status,
    vp.renewal_date,
    COUNT(vs.setting_id) as total_settings,
    SUM(CASE WHEN vs.is_public = TRUE THEN 1 ELSE 0 END) as public_settings
FROM vendors v
LEFT JOIN vendor_plans vp ON v.vendor_id = vp.vendor_id
LEFT JOIN vendor_settings vs ON v.vendor_id = vs.vendor_id
GROUP BY v.vendor_id, v.company_name, vp.plan_type, vp.plan_status, vp.renewal_date;
