import React, { Fragment, useMemo, useRef, useState, useEffect } from 'react'

export default function App() {
  const [selectedPlan, setSelectedPlan] = useState('Standard'); // default focus
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [showDifferences, setShowDifferences] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authStep, setAuthStep] = useState('email'); // 'email', 'check-email', 'payment'
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending', 'processing', 'success', 'failed'
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
    setAuthStep('email');
    setIsAuthenticated(false);
    setUserEmail('');
  }

  function handleSendMagicLink(email) {
    if (!email || !email.includes('@')) return;
    
    setIsLoading(true);
    setUserEmail(email);
    
    // Simulate sending magic link
    setTimeout(() => {
      setIsLoading(false);
      setAuthStep('check-email');
    }, 2000);
  }

  function handlePaymentSubmit() {
    setPaymentStatus('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('success');
      
      // Auto-close after success
      setTimeout(() => {
        setShowPaymentFlow(false);
        setPaymentStatus('pending');
        setAuthStep('email');
        setIsAuthenticated(false);
      }, 3000);
    }, 3000);
  }

  function handleResendMagicLink() {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Show success message
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <Header />
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
      />
      <Footer />
    </div>
  );
}

function Header() {
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
  plans, 
  userEmail, 
  setUserEmail, 
  isAuthenticated, 
  isLoading, 
  authStep, 
  paymentStatus, 
  onSendMagicLink, 
  onPaymentSubmit, 
  onResendMagicLink 
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
                  onClick={onPaymentSubmit}
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

        {/* Success State */}
        {paymentStatus === 'success' && (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-900">Payment Successful!</h4>
              <p className="text-sm text-slate-600">Your {selectedPlan} plan is now active</p>
            </div>
            <div className="text-xs text-slate-500">
              You'll receive a confirmation email shortly
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
