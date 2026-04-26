import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileCheck, Lock, AlertTriangle } from 'lucide-react';
import Section from '../../components/shared/Section';
import Button from '../../components/shared/Button';

const PrivacyCompliance = () => {
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
            Privacy & Compliance
          </h1>
          <p className="text-xl tablet:text-2xl text-cream">
            Navigate GDPR, CCPA, FedRAMP, and SOC2 requirements with confidence—build compliance into your operations from day one
          </p>
        </div>
      </Section>

      {/* Overview */}
      <Section variant="default">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-6">
            Compliance That Enables Growth
          </h2>
          <p className="text-lg text-dark mb-6">
            Privacy regulations aren't optional—but they don't have to slow you down. We help you build systems that meet
            GDPR, CCPA, FedRAMP, and SOC2 requirements while maintaining operational efficiency.
          </p>
          <p className="text-lg text-dark">
            From data mapping to access controls, we implement frameworks that protect your customers and position you for enterprise deals.
          </p>
        </div>
      </Section>

      {/* What We Do */}
      <Section variant="cream">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-12 text-center">
            Compliance Services
          </h2>

          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-8">
            {/* GDPR/CCPA Implementation */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  GDPR & CCPA/CPRA Compliance
                </h3>
              </div>
              <p className="text-dark">
                Implement consent management, data subject rights workflows, and documentation to meet EU and California privacy regulations.
              </p>
            </div>

            {/* FedRAMP Readiness */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  FedRAMP Authorization Support
                </h3>
              </div>
              <p className="text-dark">
                Navigate the FedRAMP authorization process with control implementation, documentation, and continuous monitoring frameworks.
              </p>
            </div>

            {/* SOC2 Preparation */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  SOC2 Type II Preparation
                </h3>
              </div>
              <p className="text-dark">
                Build security policies, access controls, and audit trails that meet SOC2 Trust Service Criteria for enterprise customers.
              </p>
            </div>

            {/* Risk Assessment */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  Privacy Risk Assessment
                </h3>
              </div>
              <p className="text-dark">
                Identify data flows, classify sensitive information, and document risks with mitigation strategies before regulators come knocking.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Frameworks */}
      <Section variant="default">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-8">
            Regulatory Frameworks
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-teal pl-6">
              <h3 className="font-heading text-xl font-bold text-navy mb-2">GDPR (General Data Protection Regulation)</h3>
              <p className="text-dark">
                EU privacy law requiring lawful basis for processing, consent management, data subject rights, and breach notification.
              </p>
            </div>
            <div className="border-l-4 border-teal pl-6">
              <h3 className="font-heading text-xl font-bold text-navy mb-2">CCPA/CPRA (California Privacy Laws)</h3>
              <p className="text-dark">
                California consumer rights including data access, deletion, opt-out of sale, and sensitive data limitations.
              </p>
            </div>
            <div className="border-l-4 border-teal pl-6">
              <h3 className="font-heading text-xl font-bold text-navy mb-2">FedRAMP (Federal Risk Authorization Program)</h3>
              <p className="text-dark">
                US government cloud security framework with standardized security controls and continuous monitoring requirements.
              </p>
            </div>
            <div className="border-l-4 border-teal pl-6">
              <h3 className="font-heading text-xl font-bold text-navy mb-2">SOC2 (Service Organization Control)</h3>
              <p className="text-dark">
                Audit framework covering security, availability, processing integrity, confidentiality, and privacy controls.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="navy">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold mb-6">
            Get Compliance-Ready
          </h2>
          <p className="text-lg text-cream mb-8">
            Don't let compliance block enterprise deals. Let's build privacy and security into your foundation.
          </p>
          <Link to="/contact">
            <Button variant="primary" size="lg">
              Start Compliance Journey
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
};

export default PrivacyCompliance;
