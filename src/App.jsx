import React, { Fragment, useMemo, useRef, useState, useEffect } from 'react'

export default function App() {
  const [selectedPlan, setSelectedPlan] = useState('Standard'); // default focus
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get('plan');
    const solo = params.get('solo');
    if (plan && ['Starter','Standard','Premier'].includes(plan)) setSelectedPlan(plan);
    if (solo === '1') setShowSelectedOnly(true);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('plan', selectedPlan);
    if (showSelectedOnly) params.set('solo', '1'); else params.delete('solo');
    const newUrl = window.location.pathname + '?' + params.toString() + (window.location.hash || '');
    window.history.replaceState({}, '', newUrl);
  }, [selectedPlan, showSelectedOnly]);

  const plans = useMemo(() => ({
    Starter: { price: 150, cta: 'Start Starter', blurb: 'Kick off with core lead intake and dashboards.' },
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
    }
  }), []);

  const rows = [
    { group: 'Vendor', items: [
      { label: 'Vendor Dashboard Access', Starter: true, Standard: true, Premier: true },
      { label: 'Dynamic Graphical Dashboard', Starter: '1 Graph (4 datasets)', Standard: '2 Graphs (8 datasets)', Premier: 'Up to 4 Graphs (Unlimited datasets)' },
      { label: 'Create Leads via UI', Starter: true, Standard: true, Premier: true },
      { label: 'Mobile App Access', Starter: false, Standard: true, Premier: true },
      { label: 'Vendor Admin Role', Starter: true, Standard: true, Premier: true },
      { label: 'Custom Branding', Starter: false, Standard: true, Premier: true },
      { label: 'Reporting & Analytics', Starter: 'Basic', Standard: 'Enhanced', Premier: 'Custom + API' },
      { label: 'Support SLAs', Starter: 'Community', Standard: 'Email + Chat', Premier: 'Dedicated Manager' },
    ]},
    { group: 'Lead Management & CRM', items: [
      { label: 'Import Leads via CSV', Starter: '5/day', Standard: true, Premier: true },
      { label: 'Sync Leads from CRM', Starter: false, Standard: 'HubSpot (1)', Premier: 'Multiple/Custom' },
      { label: 'Open Table-to-Table Sync', Starter: false, Standard: true, Premier: true },
      { label: 'CRM Integrations', Starter: false, Standard: 'HubSpot', Premier: 'HS, SF, Dyn, Custom' },
      { label: 'Lead Volume / mo', Starter: '100', Standard: '1,000', Premier: 'Unlimited' },
      { label: 'Max Customers', Starter: '10', Standard: '500', Premier: 'Unlimited' },
      { label: 'Max Experts', Starter: '1', Standard: '10', Premier: 'Unlimited' },
    ]},
    { group: 'AI & Automation', items: [
      { label: 'AI ChatBots', Starter: 'Basic', Standard: 'Advanced', Premier: 'Custom / Multiple' },
      { label: 'AI Agents (CSM, Expert)', Starter: false, Standard: true, Premier: true },
      { label: 'Expert Onboarding Tools', Starter: 'Manual', Standard: 'Guided + AI', Premier: 'Fully Managed' },
      { label: 'Bid Manager Agent', Starter: false, Standard: true, Premier: true },
      { label: 'Human CSM Support', Starter: false, Standard: false, Premier: true },
      { label: 'Operated by Sustentus', Starter: false, Standard: false, Premier: true },
    ]},
    { group: 'Service Timers & Notifications', items: [
      { label: 'Time to Qualify', Starter: 'Fixed', Standard: 'Editable', Premier: 'Editable' },
      { label: 'Time to Place in Bid Pool', Starter: 'Fixed', Standard: 'Editable', Premier: 'Editable' },
      { label: 'Time in Bid Pool', Starter: 'Fixed', Standard: 'Editable', Premier: 'Editable' },
      { label: 'Bid Activity Alert', Starter: 'Fixed', Standard: 'Editable', Premier: 'Editable' },
      { label: 'Expert Non-Response Timer', Starter: 'Fixed', Standard: 'Editable', Premier: 'Editable' },
      { label: 'Customer Wake-Up Timer', Starter: 'Basic', Standard: 'Multi-stage', Premier: 'Multi-stage' },
      { label: 'Timer Customization', Starter: false, Standard: true, Premier: true },
      { label: 'Notification Type', Starter: 'Basic', Standard: 'Short/Long + URL', Premier: 'Long + URL + Action' },
      { label: 'Custom Notification Rules', Starter: false, Standard: false, Premier: true },
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <Header />
      <Hero />
      <Pricing plans={plans} onChoose={handleChoose} selectedPlan={selectedPlan} />
      <FeatureMatrix
        rows={rows}
        plans={plans}
        selectedPlan={selectedPlan}
        onChoose={handleChoose}
        featuresRef={featuresRef}
        showSelectedOnly={showSelectedOnly}
        setShowSelectedOnly={setShowSelectedOnly}
        onFeatureClick={handleFeatureClick}
      />
      <FeatureModal
        isOpen={showFeatureModal}
        onClose={() => setShowFeatureModal(false)}
        feature={selectedFeature}
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

function Pricing({ plans, onChoose, selectedPlan }) {
  const order = ['Starter','Standard','Premier'];
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 pb-6">
      <div className="grid gap-6 md:grid-cols-3">
        {order.map((name) => {
          const p = plans[name];
          const highlight = name === 'Standard';
          return (
            <button
              key={name}
              onClick={() => onChoose(name)}
              className={`relative rounded-2xl border p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 ${highlight ? 'border-indigo-600' : 'border-slate-200'}`}
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
              <div className={`mt-4 inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold ${highlight ? 'bg-indigo-600 text-white' : 'border border-slate-300'} ${selectedPlan === name ? 'ring-2 ring-indigo-600' : ''}`}>
                {p.cta ?? 'See features'}
                <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function FeatureMatrix({
  rows, plans, selectedPlan, onChoose, featuresRef, showSelectedOnly, setShowSelectedOnly, onFeatureClick,
}) {
  const allOrder = ['Starter','Standard','Premier'];
  const order = showSelectedOnly ? [selectedPlan] : allOrder;

  const [stickyReady, setStickyReady] = useState(false);
  useEffect(() => setStickyReady(true), []);

  return (
    <section id="features" ref={featuresRef} className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-4xl font-extrabold text-slate-900">Compare features by plan</h2>
        <label className="flex select-none items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 accent-indigo-600"
            checked={showSelectedOnly}
            onChange={(e) => setShowSelectedOnly(e.target.checked)}
          />
          <span>Show selected only</span>
        </label>
      </div>

      <div className="mt-2 overflow-hidden rounded-2xl border-2 border-slate-200 shadow-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
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

                {group.items.map((r) => (
                  <tr key={r.label} className="border-t">
                    <td className="p-4">
                      <button
                        onClick={() => onFeatureClick(r.label)}
                        className="text-left font-semibold hover:text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded transition-colors"
                        title="Click for more details"
                      >
                        {r.label}
                        <svg className="inline ml-1 h-4 w-4 text-slate-400 hover:text-indigo-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </td>
                    {order.map((name) => (
                      <td
                        key={name}
                        className={`p-4 text-center align-top ${selectedPlan === name ? 'bg-indigo-50' : ''}`}
                      >
                        <PlanCell value={r[name]} />
                      </td>
                    ))}
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
