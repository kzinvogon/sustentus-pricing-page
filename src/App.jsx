import React, { Fragment, useMemo, useRef, useState, useEffect } from 'react'

export default function App({ onNavigateToLogin }) {
  const [selectedPlan, setSelectedPlan] = useState('Standard'); // default focus
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [showDifferences, setShowDifferences] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authStep, setAuthStep] = useState('registration'); // 'registration', 'check-email', 'payment'
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending', 'processing', 'success', 'failed'
  const [encryptedVendorId, setEncryptedVendorId] = useState('');
  const [registrationData, setRegistrationData] = useState({
    companyName: '',
    contactName: '',
    billingAddress: '',
    email: '',
    phone: '',
    country: 'US'
  });
  const featuresRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get('plan');
    const solo = params.get('solo');
    if (plan && ['Trial','Starter','Standard','Premier'].includes(plan)) setSelectedPlan(plan);
    if (solo === '1') setShowSelectedOnly(true);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('plan', selectedPlan);
    if (showSelectedOnly) params.set('solo', '1'); else params.delete('solo');
    const newUrl = window.location.pathname + '?' + params.toString() + (window.location.hash || '');
    window.history.replaceState({}, '', newUrl);
  }, [selectedPlan, showSelectedOnly]);

  // Check for magic link token in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      // Simulate token validation
      setIsLoading(true);
      setTimeout(() => {
        // Get stored registration data from localStorage
        const storedData = localStorage.getItem('sustentus_registration');
        const storedEncryptedVendorId = localStorage.getItem('sustentus_encrypted_vendor_id');
        
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            setRegistrationData(parsedData);
            setUserEmail(parsedData.email);
            
            // Get plan from stored data or URL
            const planFromUrl = params.get('plan');
            if (planFromUrl && ['Trial','Starter','Standard','Premier'].includes(planFromUrl)) {
              setSelectedPlan(planFromUrl);
            } else if (parsedData.plan) {
              // Fallback to stored plan if not in URL
              setSelectedPlan(parsedData.plan);
            }
            
            // Set encrypted vendor ID if available
            if (storedEncryptedVendorId) {
              setEncryptedVendorId(storedEncryptedVendorId);
            }
            
            console.log('🔗 Magic link processed successfully:');
            console.log('Email:', parsedData.email);
            console.log('Plan:', planFromUrl || parsedData.plan);
            console.log('Registration Data:', parsedData);
          } catch (e) {
            console.error('Error parsing stored registration data:', e);
          }
        }
        
        setIsAuthenticated(true);
        setAuthStep('payment');
        setShowPaymentFlow(true);
        setIsLoading(false);
        
        // Clean up URL
        const newUrl = window.location.pathname + '?' + params.toString().replace(/&?token=[^&]*/, '');
        window.history.replaceState({}, '', newUrl);
      }, 1500);
    }
  }, []);

  const plans = useMemo(() => ({
    Trial: { price: 0, cta: 'Start Trial', blurb: 'Free trial to get started.' },
    Starter: { price: 150, cta: 'Choose Starter', blurb: 'Kick off with core lead intake and dashboards.' },
    Standard: { price: 750, cta: 'Choose Standard', blurb: 'Scale with CRM sync, AI helpers, and flexible timers.' },
    Premier: { price: 'POA', cta: 'Talk to Sales', blurb: 'Unlock managed service, custom integrations, and SLAs.' },
  }), []);

  const featureDetails = useMemo(() => ({
    'Dynamic Graphical Dashboard': {
      title: 'Dynamic Graphical Dashboard',
      description: 'Interactive dashboards with customizable graphs and data visualization.',
      details: [
        'Graphs can be organized to display region, project conversion rate, abandonment rate, and many more parameters',
        'Each graph supports broad range of data elements that can be selected for X & Y axis',
        'Variable date range selection for all graphs',
        'Real-time data updates and refresh capabilities',
        'Export functionality for reports and presentations'
      ]
    },
    'Vendor Dashboard Access': {
      title: 'Vendor Dashboard Access',
      description: 'Comprehensive dashboard for vendor management and oversight.',
      details: [
        'Real-time vendor performance metrics',
        'Lead tracking and status updates',
        'Revenue and conversion analytics',
        'Customizable dashboard layouts'
      ]
    },
    'Create Leads via UI': {
      title: 'Create Leads via UI',
      description: 'User-friendly interface for lead creation and management.',
      details: [
        'Intuitive lead creation forms',
        'Bulk lead import capabilities',
        'Lead validation and quality checks',
        'Custom field configuration'
      ]
    },
    'Human CSM Support': {
      title: 'Human CSM Support',
      description: 'Working alongside our agentile CSM, Sustentus FTE Resources provide escalatory interface to Customers and Point of Contact for Vendors.',
      details: [
        'Direct access to human Customer Success Managers',
        'Escalation support for complex customer issues',
        'Dedicated point of contact for vendor relationships',
        'Personalized account management and support',
        'Strategic guidance for business growth and optimization'
      ]
    },
    'Operated by Sustentus': {
      title: 'Operated by Sustentus',
      description: 'Sustentus provides a Managed Business Service. Our staff will perform all activities including Customer Success Management, Service Delivery Management, Expert Market Place motivation and management, targeted upsell to Customers of Vendor products/services, Overall Business Administration.',
      details: [
        'Full Customer Success Management by Sustentus staff',
        'Comprehensive Service Delivery Management',
        'Expert Marketplace motivation and management',
        'Targeted upsell campaigns for vendor products/services',
        'Complete Business Administration and operations',
        'Managed service approach for hands-off business operation'
      ]
    },
    'Dedicated Instance': {
      title: 'Dedicated Instance',
      description: 'Customized solution based on Service Design with seamless integration to Vendor Domain, White Label capabilities, and Enterprise-grade integration.',
      details: [
        'Customization based on Service Design requirements',
        'Deep integration with Vendor Domain systems',
        'White Label solution for brand consistency',
        'Enterprise seamless integration capabilities',
        'Dedicated infrastructure and resources',
        'Custom API endpoints and data flows'
      ]
    },
    'Team Member Login': {
      title: 'Team Member Login',
      description: 'Add your team members and tag by sales region, territory, product, record conversions of leads to project at team member level.',
      details: [
        'Add and manage team members within the platform',
        'Tag team members by sales region and territory',
        'Product-specific team member assignments',
        'Track lead-to-project conversions at individual level',
        'Performance analytics per team member',
        'Territory and region-based reporting'
      ]
    },
    'Sales Regions': {
      title: 'Sales Regions',
      description: 'Configure and manage sales regions for territory-based operations and reporting.',
      details: [
        'Define and configure sales regions',
        'Territory-based lead distribution and management',
        'Regional performance analytics and reporting',
        'Region-specific business rules and workflows',
        'Multi-region expansion capabilities',
        'Geographic sales territory optimization'
      ]
    },
    'Lead & Project Conversion Stats': {
      title: 'Lead & Project Conversion Stats',
      description: 'Comprehensive tracking and analytics for lead-to-project conversion rates and performance metrics.',
      details: [
        'Real-time conversion rate tracking and analytics',
        'Lead-to-project pipeline performance metrics',
        'Conversion funnel analysis and optimization insights',
        'Historical conversion data and trend analysis',
        'Custom conversion metric definitions and tracking',
        'Performance benchmarking and goal setting capabilities'
      ]
    },
    'Service Timers': {
      title: 'Service Timers',
      description: 'Comprehensive timer management system for service delivery optimization including qualification, bid pool management, and customer engagement timers.',
      details: [
        'Configurable time limits for lead qualification processes',
        'Flexible bid pool placement and duration timers',
        'Bid activity alerts and response time management',
        'Expert non-response timer tracking and escalation',
        'Multi-stage customer wake-up timer system for engagement',
        'Real-time timer tracking and workflow automation',
        'Integration with customer success and expert management workflows'
      ]
    },
    'License/Subscription Upsell tracking': {
      title: 'License/Subscription Upsell tracking',
      description: 'Track evolution of licenses / Subscriptions referred or sold in the Project Delivery.',
      details: [
        'Monitor license and subscription sales evolution',
        'Track referrals and conversions in project delivery',
        'Upsell opportunity identification and management',
        'Revenue tracking from license/subscription sales',
        'Performance analytics for upsell campaigns',
        'Integration with project delivery workflows'
      ]
    }
  }), []);

  const rows = [
    { group: 'Vendor', items: [
      { label: 'Vendor Dashboard Access', Trial: true, Starter: true, Standard: true, Premier: true },
      { label: 'Team Member Login', Trial: false, Starter: false, Standard: true, Premier: true },
      { label: 'Sales Regions', Trial: '1 region', Starter: '1 region', Standard: '2 regions', Premier: 'Unlimited' },
      { label: 'License/Subscription Upsell tracking', Trial: false, Starter: false, Standard: true, Premier: true },
      { label: 'Dynamic Graphical Dashboard', Trial: '1 Graph (4 datasets)', Starter: '1 Graph (4 datasets)', Standard: '2 Graphs (8 datasets)', Premier: 'Up to 4 Graphs (Unlimited datasets)' },
      { label: 'Create Leads via UI', Trial: true, Starter: true, Standard: true, Premier: true },
      { label: 'Mobile App Access', Trial: false, Starter: false, Standard: true, Premier: true },
      { label: 'Vendor Admin Role', Trial: true, Starter: true, Standard: true, Premier: true },
      { label: 'Custom Branding', Trial: false, Starter: false, Standard: false, Premier: true },
      { label: 'Reporting & Analytics', Trial: 'Basic', Starter: 'Basic', Standard: 'Enhanced', Premier: 'Custom + API' },
      { label: 'Support SLAs', Trial: 'Community', Starter: 'Community', Standard: 'Email + Chat', Premier: 'Dedicated Manager' },
      { label: 'Lead & Project Conversion Stats', Trial: 'Basic', Starter: 'Basic', Standard: 'Enhanced', Premier: 'Custom + API' },
    ]},
    { group: 'Lead Management & CRM', items: [
      { label: 'Import Leads via CSV', Trial: '50', Starter: '100/mo', Standard: '1000/mo', Premier: true },
      { label: 'Sync Leads from CRM', Trial: false, Starter: false, Standard: 'HubSpot (1)', Premier: 'Multiple/Custom' },
      { label: 'Open Table-to-Table Sync', Trial: false, Starter: false, Standard: true, Premier: true },
      { label: 'CRM Integrations', Trial: false, Starter: false, Standard: 'HubSpot', Premier: 'HS, SF, Dyn, Custom' },
      { label: 'Lead Volume / mo', Trial: '50', Starter: '100', Standard: '1,000', Premier: 'Unlimited' },
      { label: 'Max Customers', Trial: '10', Starter: '500', Standard: '5000', Premier: 'Unlimited' },
      { label: 'Max Experts', Trial: '10', Starter: '1000', Standard: '25000', Premier: 'Unlimited' },
    ]},
    { group: 'AI & Automation', items: [
      { label: 'AI ChatBots', Trial: 'Basic', Starter: 'Basic', Standard: 'Advanced', Premier: 'Custom / Multiple' },
      { label: 'AI Agents (CSM, Expert)', Trial: false, Starter: false, Standard: true, Premier: true },
      { label: 'Expert Onboarding Tools', Trial: 'Manual', Starter: 'Manual', Standard: 'Guided + AI', Premier: 'Fully Managed' },
      { label: 'Bid Manager Agent', Trial: false, Starter: false, Standard: true, Premier: true },
      { label: 'Human CSM Support', Trial: false, Starter: false, Standard: false, Premier: true },
      { label: 'Operated by Sustentus', Trial: false, Starter: false, Standard: false, Premier: true },
      { label: 'Dedicated Instance', Trial: false, Starter: false, Standard: false, Premier: true },
    ]},
    { group: 'Service Timers & Notifications', items: [
      { label: 'Service Timers', Trial: 'Basic', Starter: 'Basic', Standard: 'Enhanced', Premier: 'Custom + Advanced' },
      { label: 'Timer Customization', Trial: false, Starter: false, Standard: true, Premier: true },
      { label: 'Notification Type', Trial: 'Basic', Starter: 'Basic', Standard: 'Short/Long + URL', Premier: 'Long + URL + Action' },
      { label: 'Custom Notification Rules', Trial: false, Starter: false, Standard: false, Premier: true },
    ]},
  ];

  function handleChoose(plan) {
    setSelectedPlan(plan);
    const target = featuresRef.current || document.getElementById('features');
    if (target && target.scrollIntoView) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.location.hash !== '#features') window.location.hash = '#features';
  }

  function handleFeatureClick(featureName) {
    if (featureDetails[featureName]) {
      setSelectedFeature(featureDetails[featureName]);
      setShowFeatureModal(true);
    }
  }

  function handleStartPayment(plan) {
    setSelectedPlan(plan);
    setShowPaymentFlow(true);
    setAuthStep('registration');
    setIsAuthenticated(false);
    setUserEmail('');
    setRegistrationData({
      companyName: '',
      contactName: '',
      billingAddress: '',
      email: '',
      phone: '',
      country: 'US'
    });
  }

  async function handleSendMagicLink(registrationData) {
    if (!registrationData.email || !registrationData.email.includes('@')) return;
    if (!registrationData.companyName || !registrationData.contactName || !registrationData.billingAddress) return;
    
    setIsLoading(true);
    setUserEmail(registrationData.email);
    setRegistrationData(registrationData); // Save the registration data to state
    
    // Store registration data in localStorage for cross-tab access
    const dataToStore = {
      ...registrationData,
      plan: selectedPlan // Include the plan in stored data
    };
    localStorage.setItem('sustentus_registration', JSON.stringify(dataToStore));
    
    try {
      // Send real magic link email via backend
      const response = await fetch('http://localhost:3001/api/send-magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registrationData.email,
          plan: selectedPlan,
          registrationData: registrationData
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Magic link sent successfully to:', registrationData.email);
        console.log('Full response:', result);
        console.log('Vendor ID:', result.vendorId);
        console.log('Encrypted Vendor ID:', result.encryptedVendorId);
        
        // Store the encrypted vendor ID for future use
        if (result.encryptedVendorId) {
          setEncryptedVendorId(result.encryptedVendorId);
          localStorage.setItem('sustentus_encrypted_vendor_id', result.encryptedVendorId);
          console.log('✅ Encrypted Vendor ID stored:', result.encryptedVendorId);
        } else {
          console.error('❌ No encrypted Vendor ID in response');
        }
        
        setAuthStep('check-email');
      } else {
        console.error('Failed to send magic link:', result.error);
        alert('Failed to send magic link. Please try again.');
      }
    } catch (error) {
      console.error('Error sending magic link:', error);
      alert('Error sending magic link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePaymentSubmit() {
    console.log('🚀 handlePaymentSubmit function called!');
    console.log('Current state:', { userEmail, selectedPlan, registrationData });
    console.log('🔍 State details:');
    console.log('- userEmail type:', typeof userEmail, 'value:', userEmail);
    console.log('- selectedPlan type:', typeof selectedPlan, 'value:', selectedPlan);
    console.log('- registrationData type:', typeof registrationData, 'keys:', registrationData ? Object.keys(registrationData) : 'undefined');
    
    setPaymentStatus('processing');
    
    try {
      console.log('⏳ Simulating payment processing...');
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('✅ Payment processing simulation complete');
      
      // Send real welcome and payment confirmation emails
      console.log('=== EMAIL DEBUGGING START ===');
      console.log('Email:', userEmail);
      console.log('Plan:', selectedPlan);
      console.log('Registration Data:', registrationData);
      console.log('Registration Data Type:', typeof registrationData);
      console.log('Registration Data Keys:', registrationData ? Object.keys(registrationData) : 'undefined');
      console.log('=== EMAIL DEBUGGING END ===');
      
      try {
        // Validate required data before sending emails
        if (!userEmail || !selectedPlan || !registrationData) {
          console.error('❌ Missing required data for emails:');
          console.error('userEmail:', userEmail);
          console.error('selectedPlan:', selectedPlan);
          console.error('registrationData:', registrationData);
          throw new Error('Missing required data for emails');
        }

        if (!registrationData.companyName || !registrationData.contactName || !registrationData.billingAddress || !registrationData.phone) {
          console.error('❌ Missing required registration fields:');
          console.error('registrationData:', registrationData);
          console.error('Missing fields check:');
          console.error('companyName:', !!registrationData.companyName);
          console.error('contactName:', !!registrationData.contactName);
          console.error('billingAddress:', !!registrationData.billingAddress);
          console.error('phone:', !!registrationData.phone);
          throw new Error('Missing required registration fields');
        }

        console.log('✅ Data validation passed, sending welcome email...');
        const welcomeResponse = await fetch('http://localhost:3001/api/send-welcome-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userEmail,
            plan: selectedPlan,
            registrationData: registrationData
          })
        });

        console.log('Welcome email response status:', welcomeResponse.status);
        const welcomeResult = await welcomeResponse.json();
        console.log('Welcome email result:', welcomeResult);

        console.log('Sending payment confirmation email...');
        const paymentResponse = await fetch('http://localhost:3001/api/send-payment-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userEmail,
            plan: selectedPlan,
            registrationData: registrationData,
            paymentDetails: {}
          })
        });

        console.log('Payment confirmation response status:', paymentResponse.status);
        const paymentResult = await paymentResponse.json();
        console.log('Payment confirmation result:', paymentResult);

        if (welcomeResponse.ok && paymentResponse.ok) {
          console.log('✅ Welcome and payment confirmation emails sent successfully');
        } else {
          console.error('❌ Failed to send some emails');
        }
      } catch (emailError) {
        console.error('❌ Error sending emails:', emailError);
        // Continue with success even if emails fail
      }
      
      setPaymentStatus('success');
      
      // Transition to dashboard state to show navigation buttons
      setAuthStep('dashboard');
      
      // Success state will now be controlled by user clicking the button
      // No auto-close timeout needed
    } catch (error) {
      console.error('Error processing payment:', error);
      setPaymentStatus('failed');
      
      // Reset on failure
      setTimeout(() => {
        setPaymentStatus('pending');
      }, 3000);
    }
  }

  async function handleResendMagicLink() {
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/send-magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          plan: selectedPlan
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Magic link resent successfully to:', userEmail);
        alert('Magic link resent! Please check your email.');
      } else {
        console.error('Failed to resend magic link:', result.error);
        alert('Failed to resend magic link. Please try again.');
      }
    } catch (error) {
      console.error('Error resending magic link:', error);
      alert('Error resending magic link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <Header onNavigateToLogin={onNavigateToLogin} />
      <Hero />
      <Pricing 
        plans={plans} 
        onChoose={handleChoose} 
        selectedPlan={selectedPlan}
        onStartPayment={handleStartPayment}
      />
      <FeatureMatrix
        rows={rows}
        plans={plans}
        selectedPlan={selectedPlan}
        onChoose={handleChoose}
        featuresRef={featuresRef}
        showSelectedOnly={showSelectedOnly}
        setShowSelectedOnly={setShowSelectedOnly}
        showDifferences={showDifferences}
        onFeatureClick={handleFeatureClick}
      />
      <FeatureModal
        isOpen={showFeatureModal}
        onClose={() => setShowFeatureModal(false)}
        feature={selectedFeature}
      />
              <PaymentFlow 
          isOpen={showPaymentFlow}
          onClose={() => setShowPaymentFlow(false)}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          plans={plans}
          userEmail={userEmail}
          setUserEmail={setUserEmail}
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
          authStep={authStep}
          paymentStatus={paymentStatus}
          onSendMagicLink={handleSendMagicLink}
          onPaymentSubmit={handlePaymentSubmit}
          onResendMagicLink={handleResendMagicLink}
          setIsAuthenticated={setIsAuthenticated}
          setAuthStep={setAuthStep}
          registrationData={registrationData}
          setRegistrationData={setRegistrationData}
          encryptedVendorId={encryptedVendorId}
          setEncryptedVendorId={setEncryptedVendorId}
        />
      <Footer />
    </div>
  );
}

function Header({ onNavigateToLogin }) {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-indigo-600" />
          <span className="text-lg font-semibold">Sustentus Business Solutions</span>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#pricing" className="text-sm font-medium hover:text-indigo-600">Pricing</a>
          <a href="#features" className="text-sm font-medium hover:text-indigo-600">Features</a>
          <button 
            onClick={onNavigateToLogin}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Login
          </button>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-6 pt-14 text-center md:pt-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Flexible pricing for your business growth</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">Click a plan below to jump to the feature breakdown. Prices are per user/month.</p>
      </div>
    </section>
  );
}

function Pricing({ plans, onChoose, selectedPlan, onStartPayment }) {
  const order = ['Trial','Starter','Standard','Premier'];
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 pb-6">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {order.map((name) => {
          const p = plans[name];
          const highlight = name === 'Standard';
          const isStarter = name === 'Starter';
          return (
            <button
              key={name}
              onClick={() => onStartPayment(name)}
              className={`relative rounded-2xl border p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 ${
                highlight ? 'border-indigo-600' : 'border-slate-200'
              } ${isStarter ? 'opacity-90' : ''}`}
            >
              {highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-indigo-600 bg-white px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
                  Most popular
                </div>
              )}
              <h3 className="text-xl font-bold">{name}</h3>
              <p className="mt-1 text-sm text-slate-600">{p.blurb}</p>
              <div className="mt-5 flex items-end gap-1">
                {typeof p.price === 'number' ? (
                  <>
                    <span className="text-4xl font-extrabold tracking-tight">€{p.price}</span>
                    <span className="mb-1 text-sm text-slate-500">/user/mo</span>
                  </>
                ) : (
                  <span className="text-3xl font-extrabold tracking-tight">{p.price}</span>
                )}
              </div>
              <div className={`mt-4 inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold ${
                highlight ? 'bg-indigo-600 text-white' : 'border border-slate-300'
              } ${selectedPlan === name ? 'ring-2 ring-indigo-600' : ''} ${
                isStarter ? 'bg-slate-600 text-white' : ''
              }`}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onStartPayment(name);
                  }}
                  className="w-full text-left"
                >
                  {p.cta ?? 'See features'}
                  <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <div className="mt-2 text-xs text-slate-500">No setup fees. Cancel anytime.</div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function FeatureMatrix({
  rows, plans, selectedPlan, onChoose, featuresRef, showSelectedOnly, setShowSelectedOnly, showDifferences, onFeatureClick,
}) {
  const allOrder = ['Trial','Starter','Standard','Premier'];
  const order = showSelectedOnly ? [selectedPlan] : allOrder;

  const [stickyReady, setStickyReady] = useState(false);
  useEffect(() => setStickyReady(true), []);

  return (
    <section id="features" ref={featuresRef} className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-4xl font-extrabold text-slate-900">Compare features by plan</h2>
        <div className="flex items-center gap-4">
          <label className="flex select-none items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-indigo-600"
              checked={showSelectedOnly}
              onChange={(e) => setShowSelectedOnly(e.target.checked)}
            />
            <span>Show selected only</span>
          </label>
          <label className="flex select-none items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-indigo-600"
              checked={showDifferences}
              onChange={(e) => setShowDifferences(e.target.checked)}
            />
            <span>Highlight differences</span>
          </label>
        </div>
      </div>
      
      {/* Duplicate CTAs above table */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {order.map((name) => (
          <button
            key={name}
            onClick={() => onChoose(name)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              selectedPlan === name 
                ? 'bg-indigo-600 text-white ring-2 ring-indigo-600' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {plans[name].cta}
          </button>
        ))}
      </div>

      <div className="mt-2 rounded-2xl border-2 border-slate-200 shadow-xl">
        <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="sticky top-0 z-20 bg-gradient-to-r from-slate-50 to-slate-100 shadow-sm">
              <tr>
                <th className={`${order.length === 1 ? 'w-3/4' : 'w-1/2'} p-4 font-bold text-slate-700 text-lg`}>Feature</th>
                {order.map((name) => (
                  <th key={name} className={`p-4 text-center font-bold text-lg ${selectedPlan === name ? 'text-indigo-700' : 'text-slate-700'}`}>
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
          <tbody>
            {rows.map((group, gi) => (
              <Fragment key={group.group}>
                <tr>
                  <td colSpan={1 + order.length} className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 text-sm font-bold uppercase tracking-wider text-white shadow-sm">
                    {group.group}
                  </td>
                </tr>

                {group.items.map((r, index) => (
                  <tr key={r.label} className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-indigo-50 transition-colors`}>
                    <td className="p-4">
                      <button
                        onClick={() => onFeatureClick(r.label)}
                        className="text-left font-semibold hover:text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded transition-colors"
                        title="Click for more details"
                      >
                        {r.label}
                        <svg className="inline ml-2 h-5 w-5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </td>
                    {order.map((name) => {
                      const isDifferent = showDifferences && order.some(otherName => 
                        otherName !== name && r[otherName] !== r[name]
                      );
                      return (
                        <td
                          key={name}
                          className={`p-4 text-center align-top ${
                            selectedPlan === name ? 'bg-indigo-50' : ''
                          } ${
                            isDifferent ? 'ring-2 ring-amber-300 bg-amber-50' : ''
                          }`}
                        >
                          <PlanCell value={r[name]} />
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Price row at bottom of table (Xero-style) */}
                {gi === rows.length - 1 && (
                  <tr className="border-t">
                    <td className="p-4 font-semibold">Price (per user / month)</td>
                    {order.map((name) => (
                      <td key={name} className="relative p-4 text-center">
                        <div
                          className={`mx-auto inline-flex items-end gap-1 rounded-lg px-3 py-2 font-bold ${
                            selectedPlan === name ? 'bg-indigo-100 ring-2 ring-indigo-600 shadow-md' : 'bg-slate-50'
                          }`}
                        >
                          {typeof plans[name].price === 'number' ? (
                            <>
                              <span className="text-lg font-bold">€{plans[name].price}</span>
                              <span className="mb-0.5 text-[11px] text-slate-500">/user/mo</span>
                            </>
                          ) : (
                            <span className="text-lg font-bold">{plans[name].price}</span>
                          )}
                        </div>

                        {/* Sticky CTA inside selected column */}
                        {stickyReady && selectedPlan === name && (
                          <div className="pointer-events-none sticky bottom-2 mt-2 flex justify-center">
                                                          <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onChoose(name);
                                }}
                                className="pointer-events-auto rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all"
                              >
                              {plans[name].cta ?? 'Select plan'}
                            </button>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Plan selector buttons remain visible even in filtered mode */}
      <div className="mx-auto mt-6 flex max-w-md justify-center gap-2">
        {allOrder.map((name) => (
                  <button
          key={name}
          onClick={() => onChoose(name)}
          className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition-all ${
            selectedPlan === name ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md' : 'border-slate-300 text-slate-600 hover:border-indigo-400 hover:bg-slate-50'
          }`}
        >
            {name}
          </button>
        ))}
      </div>
    </section>
  );
}

function PlanCell({ value }) {
  if (value === true) return <Check />;
  if (value === false) return <Cross />;
  return <span className="text-slate-700">{value}</span>;
}

function Footer() {
  return (
    <footer className="border-t py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <p className="text-sm text-slate-500">© {new Date().getFullYear()} Sustentus. All rights reserved.</p>
        <div className="flex items-center gap-6 text-sm">
          <a href="#" className="text-slate-500 hover:text-slate-700">Terms</a>
          <a href="#" className="text-slate-500 hover:text-slate-700">Privacy</a>
          <a href="#" className="text-slate-500 hover:text-slate-700">Security</a>
        </div>
      </div>
    </footer>
  );
}

function Check() {
  return (
    <svg className="mx-auto mt-0.5 h-5 w-5 flex-none" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Cross() {
  return (
    <svg className="mx-auto mt-0.5 h-5 w-5 flex-none" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor">
      <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeatureModal({ isOpen, onClose, feature }) {
  if (!isOpen || !feature) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative mx-4 max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        
        {/* Description */}
        <p className="mb-4 text-slate-600">{feature.description}</p>
        
        {/* Details */}
        <div className="space-y-2">
          <h4 className="font-semibold text-slate-900">Key Features:</h4>
          <ul className="space-y-2">
            {feature.details.map((detail, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                <svg className="mt-0.5 h-4 w-4 flex-none text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {detail}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Close button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function PaymentFlow({ 
  isOpen, 
  onClose, 
  selectedPlan, 
  setSelectedPlan,
  plans, 
  userEmail, 
  setUserEmail, 
  isAuthenticated, 
  isLoading, 
  authStep, 
  paymentStatus, 
  onSendMagicLink, 
  onPaymentSubmit, 
  onResendMagicLink,
  setIsAuthenticated,
  setAuthStep,
  registrationData,
  setRegistrationData,
  encryptedVendorId,
  setEncryptedVendorId
}) {
  if (!isOpen) return null;

  const plan = plans[selectedPlan];
  const isFree = selectedPlan === 'Trial' || plan.price === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Complete Your {selectedPlan} Plan</h3>
            <p className="text-sm text-slate-600">You're just a few steps away from getting started</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Plan Summary */}
        <div className="mb-6 rounded-xl bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-slate-900">{selectedPlan} Plan</h4>
              <p className="text-sm text-slate-600">{plan.blurb}</p>
            </div>
            <div className="text-right">
              {typeof plan.price === 'number' ? (
                <div className="text-2xl font-bold text-slate-900">€{plan.price}</div>
              ) : (
                <div className="text-xl font-bold text-slate-900">{plan.price}</div>
              )}
              <div className="text-xs text-slate-500">per user/month</div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        {authStep === 'registration' && !isAuthenticated && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={registrationData.companyName}
                onChange={(e) => setRegistrationData({...registrationData, companyName: e.target.value})}
                placeholder="Enter your company name"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contact Name * <span className="text-xs text-slate-500">(The Master User)</span>
              </label>
              <input
                type="text"
                value={registrationData.contactName}
                onChange={(e) => setRegistrationData({...registrationData, contactName: e.target.value})}
                placeholder="Enter contact name"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Billing Address *
              </label>
              <textarea
                value={registrationData.billingAddress}
                onChange={(e) => setRegistrationData({...registrationData, billingAddress: e.target.value})}
                placeholder="Enter complete billing address"
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={registrationData.email}
                onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                placeholder="Enter your email address"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Country *
                </label>
                <select
                  value={registrationData.country}
                  onChange={(e) => setRegistrationData({...registrationData, country: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="IE">Ireland</option>
                  <option value="NL">Netherlands</option>
                  <option value="SE">Sweden</option>
                  <option value="NO">Norway</option>
                  <option value="DK">Denmark</option>
                  <option value="FI">Finland</option>
                  <option value="CH">Switzerland</option>
                  <option value="AT">Austria</option>
                  <option value="BE">Belgium</option>
                  <option value="IT">Italy</option>
                  <option value="ES">Spain</option>
                  <option value="PT">Portugal</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={registrationData.phone}
                  onChange={(e) => setRegistrationData({...registrationData, phone: e.target.value})}
                  placeholder="+1 (555) 123-4567"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
            
            <button
              onClick={() => onSendMagicLink(registrationData)}
              disabled={!registrationData.email || !registrationData.companyName || !registrationData.contactName || !registrationData.billingAddress || !registrationData.phone || isLoading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </div>
              ) : (
                'Continue to Payment'
              )}
            </button>
            
            {/* Demo: Skip to payment for testing */}
            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 mb-2">Demo: Skip to payment</p>
              <button
                onClick={() => {
                  setIsAuthenticated(true);
                  setAuthStep('payment');
                }}
                className="w-full text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg transition-colors"
              >
                🚀 Skip to Payment Form
              </button>
            </div>
          </div>
        )}

        {/* Authentication Flow */}
        {authStep === 'email' && !isAuthenticated && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={() => onSendMagicLink(userEmail)}
              disabled={!userEmail || isLoading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </div>
              ) : (
                'Send Magic Link'
              )}
            </button>
            
            {/* Demo: Skip to payment for testing */}
            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 mb-2">Demo: Skip to payment</p>
              <button
                onClick={() => {
                  setIsAuthenticated(true);
                  setAuthStep('payment');
                }}
                className="w-full text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg transition-colors"
              >
                🚀 Skip to Payment Form
              </button>
            </div>
          </div>
        )}

        {/* Check Email Step */}
        {authStep === 'check-email' && (
          <div className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-900">Check Your Email</h4>
              <p className="text-sm text-slate-600">
                We've sent a magic link to <span className="font-medium">{userEmail}</span>
              </p>
            </div>
            <div className="text-xs text-slate-500">
              Click the link in your email to continue to payment
            </div>
            <button
              onClick={onResendMagicLink}
              disabled={isLoading}
              className="text-sm text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Resend magic link'}
            </button>
            
            {/* Demo: Simulate magic link click for testing */}
            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 mb-2">Demo: Click to simulate magic link</p>
              <button
                onClick={() => {
                  // Restore data from localStorage when simulating magic link
                  const storedData = localStorage.getItem('sustentus_registration');
                  const storedEncryptedVendorId = localStorage.getItem('sustentus_encrypted_vendor_id');
                  
                  if (storedData) {
                    try {
                      const parsedData = JSON.parse(storedData);
                      setRegistrationData(parsedData);
                      setUserEmail(parsedData.email);
                      
                      // Set plan if available
                      if (parsedData.plan) {
                        setSelectedPlan(parsedData.plan);
                      }
                      
                      // Set encrypted vendor ID if available
                      if (storedEncryptedVendorId) {
                        setEncryptedVendorId(storedEncryptedVendorId);
                      }
                      
                      console.log('🧪 Simulated magic link - restored data:');
                      console.log('Email:', parsedData.email);
                      console.log('Plan:', parsedData.plan);
                      console.log('Registration Data:', parsedData);
                    } catch (e) {
                      console.error('Error parsing stored data:', e);
                    }
                  }
                  
                  setIsAuthenticated(true);
                  setAuthStep('payment');
                }}
                className="w-full text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg transition-colors"
              >
                🧪 Simulate Magic Link Click
              </button>
            </div>
          </div>
        )}

        {/* Payment Step */}
        {authStep === 'payment' && isAuthenticated && (
          <div className="space-y-4">
            {isFree ? (
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">Start Your Free Trial</h4>
                  <p className="text-sm text-slate-600">No payment required to get started</p>
                </div>
                <button
                  onClick={onPaymentSubmit}
                  className="w-full rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Activate Trial
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Payment Information</h4>
                  
                  {/* Mock Payment Form */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        disabled={paymentStatus === 'processing'}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          disabled={paymentStatus === 'processing'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          CVC
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          disabled={paymentStatus === 'processing'}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        disabled={paymentStatus === 'processing'}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  onClick={() => {
                    console.log('🔄 Payment button clicked!');
                    console.log('onPaymentSubmit function:', onPaymentSubmit);
                    onPaymentSubmit();
                  }}
                  disabled={paymentStatus === 'processing'}
                  className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentStatus === 'processing' ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    `Pay €${plan.price}/month`
                  )}
                </button>

                {/* Security Notice */}
                <div className="text-xs text-slate-500 text-center">
                  🔒 Your payment information is secure and encrypted
                </div>
              </div>
            )}
          </div>
        )}

        {/* Failed Payment State */}
        {paymentStatus === 'failed' && (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-red-900">Payment Failed</h4>
              <p className="text-sm text-red-600">There was an issue processing your payment</p>
            </div>
            <div className="text-xs text-slate-500">
              Please check your payment details and try again
            </div>
            <button
              onClick={() => setPaymentStatus('pending')}
              className="w-full rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Success State */}
        {paymentStatus === 'success' && (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-900">Confirmation of Subscription</h4>
              <p className="text-sm text-slate-600">Your {selectedPlan} plan is now active</p>
            </div>
            <div className="text-xs text-slate-500 space-y-1">
              <p>✅ Account created successfully</p>
              <p>✅ Payment processed</p>
              <p>📧 Check your email for login details</p>
              <p>📧 Welcome package sent to {registrationData.email}</p>
            </div>
            <div className="pt-2 text-xs text-slate-400">
              <p>Company: {registrationData.companyName}</p>
              <p>Contact: {registrationData.contactName}</p>
              {encryptedVendorId ? (
                <p className="text-xs text-slate-400 mt-1">
                  <strong>Vendor ID:</strong> {encryptedVendorId.substring(0, 20)}...
                </p>
              ) : (
                <p className="text-xs text-red-400 mt-1">
                  <strong>⚠️ Vendor ID:</strong> Not set (check console for details)
                </p>
              )}
            </div>
            
            {/* Continue Button */}
            <button
              onClick={() => {
                console.log('🔄 Continue to Dashboard button clicked!');
                console.log('Current authStep:', authStep);
                console.log('Setting authStep to dashboard...');
                setAuthStep('dashboard');
                console.log('authStep should now be dashboard');
              }}
              className="w-full rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Continue to Dashboard
            </button>
          </div>
        )}

        {/* Dashboard State - Post Payment */}
        {authStep === 'dashboard' && (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-900">Account Setup Complete!</h4>
              <p className="text-sm text-slate-600">You're all set to start using Sustentus</p>
            </div>
            <div className="text-xs text-slate-500 space-y-1">
              <p>🎯 Next steps:</p>
              <p>• Check your email for login credentials</p>
              <p>• Access your dashboard at app.sustentus.com</p>
              <p>• Set up your team and integrations</p>
            </div>
            <div className="pt-2 space-y-2">
              {encryptedVendorId && (
                <button
                  onClick={() => {
                    // Debug the encrypted Vendor ID
                    console.log('🔍 Dashboard button clicked:');
                    console.log('- encryptedVendorId:', encryptedVendorId);
                    console.log('- Type:', typeof encryptedVendorId);
                    console.log('- Length:', encryptedVendorId ? encryptedVendorId.length : 'undefined');
                    
                    if (!encryptedVendorId) {
                      alert('Vendor ID not available. Please check console for details.');
                      return;
                    }
                    
                    // Open vendor dashboard in new tab using encrypted Vendor ID
                    const dashboardUrl = `https://demo-vendor.sustentus.com/?vendor=${encryptedVendorId}`;
                    console.log('🌐 Opening dashboard URL:', dashboardUrl);
                    window.open(dashboardUrl, '_blank');
                  }}
                  className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Access Vendor Dashboard
                </button>
              )}
              <button
                onClick={() => {
                  setAuthStep('registration');
                  setShowPaymentFlow(false);
                }}
                className="w-full rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                Back to Pricing
              </button>
              <button
                onClick={() => {
                  setAuthStep('registration');
                  setShowPaymentFlow(false);
                  setIsAuthenticated(false);
                }}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Start New Registration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
