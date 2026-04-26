import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, RefreshCw, Link2, BarChart3 } from 'lucide-react';
import Section from '../../components/shared/Section';
import Button from '../../components/shared/Button';

const ProcessAutomation = () => {
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
            Process & Workflow Automation
          </h1>
          <p className="text-xl tablet:text-2xl text-cream">
            Eliminate repetitive tasks and connect your tools so data flows seamlessly—without manual intervention
          </p>
        </div>
      </Section>

      {/* Overview */}
      <Section variant="default">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-6">
            Stop Doing What Software Can Do For You
          </h2>
          <p className="text-lg text-dark mb-6">
            Every manual data entry, copy-paste routine, and status update is time your team isn't spending on strategic work.
            We automate the repetitive so you can focus on what moves the needle.
          </p>
          <p className="text-lg text-dark">
            Whether it's syncing CRM data, triggering notifications, or routing leads—we build workflows that run reliably in the background.
          </p>
        </div>
      </Section>

      {/* What We Do */}
      <Section variant="cream">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-12 text-center">
            Automation Solutions
          </h2>

          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-8">
            {/* Zapier Workflows */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  Zapier Integration Chains
                </h3>
              </div>
              <p className="text-dark">
                Connect 5,000+ apps with multi-step workflows that trigger actions across your entire tech stack automatically.
              </p>
            </div>

            {/* N8N Custom Automation */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  N8N Custom Logic
                </h3>
              </div>
              <p className="text-dark">
                Self-hosted automation with advanced conditional logic, data transformation, and unlimited complexity.
              </p>
            </div>

            {/* Make Scenarios */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Link2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  Make.com Visual Flows
                </h3>
              </div>
              <p className="text-dark">
                Build complex scenarios with visual mapping, error handling, and real-time monitoring dashboards.
              </p>
            </div>

            {/* Data Sync */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  Cross-Platform Data Sync
                </h3>
              </div>
              <p className="text-dark">
                Keep customer data, project updates, and reporting metrics synchronized across CRM, project management, and analytics tools.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Use Cases */}
      <Section variant="default">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-8">
            Common Automation Wins
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-teal pl-6">
              <h3 className="font-heading text-xl font-bold text-navy mb-2">Lead Routing</h3>
              <p className="text-dark">
                New form submission → CRM entry → Slack notification → Calendar invite → Follow-up sequence
              </p>
            </div>
            <div className="border-l-4 border-teal pl-6">
              <h3 className="font-heading text-xl font-bold text-navy mb-2">Invoice Processing</h3>
              <p className="text-dark">
                Invoice received → Extract data → Create accounting entry → Send payment notification → Update dashboard
              </p>
            </div>
            <div className="border-l-4 border-teal pl-6">
              <h3 className="font-heading text-xl font-bold text-navy mb-2">Support Ticket Management</h3>
              <p className="text-dark">
                Ticket created → Categorize by keywords → Assign to specialist → Track SLA → Escalate if needed
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Tools */}
      <Section variant="cream">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-8 text-center">
            Automation Platforms
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <div className="font-heading text-lg font-bold text-navy mb-2">Zapier</div>
              <p className="text-sm text-dark">No-code platform connecting 7,000+ apps through automated workflows called Zaps. Transforms individual tools into a unified automation machine with AI orchestration.</p>
            </div>
            <div>
              <div className="font-heading text-lg font-bold text-navy mb-2">N8N</div>
              <p className="text-sm text-dark">Open-source workflow automation with 400+ integrations and visual workflow editor. Self-hosting provides maximum data security and compliance control for enterprises.</p>
            </div>
            <div>
              <div className="font-heading text-lg font-bold text-navy mb-2">Make</div>
              <p className="text-sm text-dark">Visual no-code platform with 3,000+ pre-built apps and AI assistance. Drag-and-drop interface enables unlimited workflow automation without coding.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="navy">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold mb-6">
            Let's Automate Your Workflows
          </h2>
          <p className="text-lg text-cream mb-8">
            Stop wasting hours on manual tasks. We'll map your processes and build automation that just works.
          </p>
          <Link to="/contact">
            <Button variant="primary" size="lg">
              Start Automating
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
};

export default ProcessAutomation;
