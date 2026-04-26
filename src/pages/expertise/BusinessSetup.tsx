import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, DollarSign, Globe, Zap } from 'lucide-react';
import Section from '../../components/shared/Section';
import Button from '../../components/shared/Button';

const BusinessSetup = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section variant="navy">
        <Link to="/services" className="inline-flex items-center gap-2 text-cream hover:text-gold transition-colors mb-8">
          <ArrowLeft className="w-5 h-5" />
          Back to Services
        </Link>

        <div className="max-w-4xl">
          <h1 className="font-heading text-4xl tablet:text-5xl desktop:text-6xl font-bold uppercase tracking-tight mb-6">
            Business Setup & Enablement
          </h1>
          <p className="text-xl tablet:text-2xl text-cream">
            Launch your business with the right legal structure, financial foundation, and digital infrastructure from day one
          </p>
        </div>
      </Section>

      {/* Overview */}
      <Section variant="default">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-6">
            Start Strong, Scale Smart
          </h2>
          <p className="text-lg text-dark mb-6">
            The decisions you make at founding shape everything that follows. We guide entrepreneurs through entity formation,
            financial infrastructure setup, and digital foundation building—so you start with processes that scale.
          </p>
          <p className="text-lg text-dark">
            From LLC vs. C-Corp decisions to banking and payment processing—we handle the operational groundwork while you focus on building product.
          </p>
        </div>
      </Section>

      {/* What We Do */}
      <Section variant="cream">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-12 text-center">
            Foundational Services
          </h2>

          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-8">
            {/* Entity Formation */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  Entity Formation Strategy
                </h3>
              </div>
              <p className="text-dark">
                Navigate LLC, C-Corp, and S-Corp structures with guidance on tax implications, ownership flexibility, and investor readiness.
              </p>
            </div>

            {/* Financial Infrastructure */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  Financial System Setup
                </h3>
              </div>
              <p className="text-dark">
                Establish business banking, payment processing, accounting systems, and expense management that keep finances clean from day one.
              </p>
            </div>

            {/* Digital Foundation */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  Digital Foundation Build
                </h3>
              </div>
              <p className="text-dark">
                Set up domain, email, workspace (Google/Microsoft), project management, and communication tools—integrated and secure.
              </p>
            </div>

            {/* Operational Readiness */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  Operational Readiness
                </h3>
              </div>
              <p className="text-dark">
                Create essential templates, contracts, onboarding flows, and process documentation that make growth repeatable.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Typical Setup Flow */}
      <Section variant="default">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-8">
            Typical Setup Flow
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-teal pl-6">
              <h3 className="font-heading text-xl font-bold text-navy mb-2">1. Legal Structure</h3>
              <p className="text-dark">
                Entity formation, EIN, operating agreement, and state registrations—setting up the legal foundation.
              </p>
            </div>
            <div className="border-l-4 border-teal pl-6">
              <h3 className="font-heading text-xl font-bold text-navy mb-2">2. Financial Systems</h3>
              <p className="text-dark">
                Business bank account, payment processor, accounting software, and bookkeeping workflows.
              </p>
            </div>
            <div className="border-l-4 border-teal pl-6">
              <h3 className="font-heading text-xl font-bold text-navy mb-2">3. Digital Infrastructure</h3>
              <p className="text-dark">
                Domain, email, workspace tools, cloud storage, and collaboration platforms—your operational backbone.
              </p>
            </div>
            <div className="border-l-4 border-teal pl-6">
              <h3 className="font-heading text-xl font-bold text-navy mb-2">4. Process Documentation</h3>
              <p className="text-dark">
                Templates, contracts, SOPs, and onboarding flows that make operations consistent and scalable.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="navy">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold mb-6">
            Launch Your Business Right
          </h2>
          <p className="text-lg text-cream mb-8">
            Skip the startup mistakes. Let's build your business foundation the right way from the beginning.
          </p>
          <Link to="/contact">
            <Button variant="primary" size="lg">
              Start Your Setup
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
};

export default BusinessSetup;
