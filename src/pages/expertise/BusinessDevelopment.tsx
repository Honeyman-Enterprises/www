import { Link } from 'react-router-dom';
import { ArrowLeft, Target, TrendingUp, Users, Zap } from 'lucide-react';
import Section from '../../components/shared/Section';
import Button from '../../components/shared/Button';

const BusinessDevelopment = () => {
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
            Business Development & CRM
          </h1>
          <p className="text-xl tablet:text-2xl text-cream">
            Transform leads into revenue with intelligent pipeline management and automated outreach systems
          </p>
        </div>
      </Section>

      {/* Overview */}
      <Section variant="default">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-6">
            Revenue Growth Through Systematic Outreach
          </h2>
          <p className="text-lg text-dark mb-6">
            Your sales pipeline shouldn't be a mystery. We build intelligent BD systems that capture every opportunity,
            automate repetitive outreach, and give you real-time visibility into what's working.
          </p>
          <p className="text-lg text-dark">
            From LinkedIn automation to HubSpot workflows, we connect your tools and data so your team spends less time
            on admin and more time closing deals.
          </p>
        </div>
      </Section>

      {/* What We Do */}
      <Section variant="cream">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-12 text-center">
            What We Deliver
          </h2>

          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-8">
            {/* HubSpot Optimization */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  HubSpot Pipeline Design
                </h3>
              </div>
              <p className="text-dark">
                Custom deal stages, automated workflows, and lead scoring that matches your actual sales process—not a generic template.
              </p>
            </div>

            {/* LinkedIn Automation */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  LinkedIn Outreach Systems
                </h3>
              </div>
              <p className="text-dark">
                Automated connection requests, personalized messaging sequences, and lead capture that fills your pipeline while you sleep.
              </p>
            </div>

            {/* Scheduling Integration */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  Calendly & Scheduling Flows
                </h3>
              </div>
              <p className="text-dark">
                Seamless booking experiences that sync with your CRM, send reminders, and capture meeting context automatically.
              </p>
            </div>

            {/* Multi-Channel Campaigns */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  Multi-Channel Campaigns
                </h3>
              </div>
              <p className="text-dark">
                Coordinate email, LinkedIn, and call outreach in unified sequences that adapt based on prospect behavior and engagement.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Tools & Platforms */}
      <Section variant="default">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-8 text-center">
            Platforms We Work With
          </h2>
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-8">
            <div>
              <div className="font-heading text-lg font-bold text-navy mb-2">HubSpot</div>
              <p className="text-sm text-dark">Cloud-based CRM combining marketing, sales, and service into one workspace. Unified dashboard for lead capture, automation, and campaign management.</p>
            </div>
            <div>
              <div className="font-heading text-lg font-bold text-navy mb-2">LinkedIn Sales Navigator</div>
              <p className="text-sm text-dark">Helps sales teams find leads and reach decision-makers using LinkedIn's data. Enables high-quality conversations at scale with extended network visibility.</p>
            </div>
            <div>
              <div className="font-heading text-lg font-bold text-navy mb-2">Calendly</div>
              <p className="text-sm text-dark">Cloud-based scheduling that automates meeting bookings with real-time availability. Eliminates back-and-forth emails for effortless time coordination.</p>
            </div>
            <div>
              <div className="font-heading text-lg font-bold text-navy mb-2">Outreach</div>
              <p className="text-sm text-dark">AI-powered sales engagement platform for building quality pipeline and rep productivity. Orchestrates every stage of the sales process with intelligent workflows.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="navy">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold mb-6">
            Ready to Fill Your Pipeline?
          </h2>
          <p className="text-lg text-cream mb-8">
            Let's build a BD system that turns prospects into customers—systematically.
          </p>
          <Link to="/contact">
            <Button variant="primary" size="lg">
              Schedule a Consultation
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
};

export default BusinessDevelopment;
