import React, { useState } from 'react';

function Login({ onBackToMain }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Send magic link via backend
      const response = await fetch('http://localhost:3001/api/send-magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          plan: 'login', // Special plan type for login
          registrationData: {
            email: email,
            // Minimal data for login flow
            companyName: 'Login User',
            contactName: 'Login User',
            billingAddress: 'Login Address',
            phone: '0000000000',
            country: 'US'
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage('Magic link sent! Check your email and click the link to access your dashboard.');
        setMessageType('success');
        
        // Store the encrypted vendor ID for redirect
        if (result.encryptedVendorId) {
          localStorage.setItem('sustentus_login_vendor_id', result.encryptedVendorId);
        }
      } else {
        setMessage('Failed to send magic link. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error sending magic link:', error);
      setMessage('Error sending magic link. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Simulate successful login for demo purposes
    setMessage('Demo login successful! Redirecting to dashboard...');
    setMessageType('success');
    
    // Redirect to demo vendor dashboard
    setTimeout(() => {
      window.location.href = 'https://demo-vendor.sustentus.com';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-slate-900">Sustentus</h1>
            </div>
            <div className="flex items-center space-x-4">
                          <button 
              onClick={onBackToMain}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Back to Pricing
            </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-md mx-auto mt-16 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-blue-100">Access your vendor dashboard</p>
          </div>

          {/* Login Form */}
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              {/* Message Display */}
              {message && (
                <div className={`p-4 rounded-lg ${
                  messageType === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? 'Sending Magic Link...' : 'Send Magic Link'}
              </button>
            </form>

            {/* Demo Login Button */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={handleDemoLogin}
                className="w-full bg-slate-100 text-slate-700 font-semibold py-3 px-6 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
              >
                Demo Login (Skip Magic Link)
              </button>
              <p className="text-xs text-slate-500 text-center mt-2">
                For testing purposes - bypasses email verification
              </p>
            </div>

            {/* Info Section */}
            <div className="mt-8 p-4 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-slate-800 mb-2">How it works:</h3>
              <ol className="text-sm text-slate-600 space-y-1">
                <li>1. Enter your email address</li>
                <li>2. Click "Send Magic Link"</li>
                <li>3. Check your email for the login link</li>
                <li>4. Click the link to access your dashboard</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Don't have an account?{' '}
            <button 
              onClick={onBackToMain}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View our pricing plans
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
