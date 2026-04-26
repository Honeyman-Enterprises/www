import { Link } from 'react-router-dom';
import { ArrowLeft, Kanban, FileText, DollarSign, Calendar } from 'lucide-react';
import Section from '../../components/shared/Section';
import Button from '../../components/shared/Button';

const BusinessOperations = () => {
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
            Business Operations & Tools
          </h1>
          <p className="text-xl tablet:text-2xl text-cream">
            Connect your operational stack—from project management to payments—so work flows without manual handoffs
          </p>
        </div>
      </Section>

      {/* Overview */}
      <Section variant="default">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-6">
            Operations That Scale
          </h2>
          <p className="text-lg text-dark mb-6">
            Your operations tools should work together, not create silos. We integrate project management, financial systems,
            and documentation platforms so information flows automatically and teams stay aligned.
          </p>
          <p className="text-lg text-dark">
            From Monday.com workflows to Xero accounting integrations—we connect the tools you already use.
          </p>
        </div>
      </Section>

      {/* What We Do */}
      <Section variant="cream">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-12 text-center">
            Operational Systems
          </h2>

          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-8">
            {/* Project Management */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Kanban className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  Project Management Setup
                </h3>
              </div>
              <p className="text-dark">
                Configure Monday.com, JIRA, Asana, or Trello with boards, automations, and reporting that match your workflow—not generic templates.
              </p>
            </div>

            {/* Documentation Systems */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  Knowledge Base & Docs
                </h3>
              </div>
              <p className="text-dark">
                Build Confluence wikis, Notion workspaces, or custom documentation hubs that make institutional knowledge accessible and searchable.
              </p>
            </div>

            {/* Financial Operations */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  Financial System Integration
                </h3>
              </div>
              <p className="text-dark">
                Connect Mercury banking, Helcim payments, Xero accounting, and DocuSign contracts so money moves efficiently and compliantly.
              </p>
            </div>

            {/* Cross-Tool Automation */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  Cross-Platform Workflows
                </h3>
              </div>
              <p className="text-dark">
                Sync tasks, clients, and financials across tools so data doesn't live in silos and your team always has current information.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Platforms */}
      <Section variant="default">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-8 text-center">
            Tools We Integrate
          </h2>
          <div className="grid grid-cols-2 tablet:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="font-heading text-lg font-bold text-navy">Monday.com</div>
              <p className="text-sm text-dark">Work management</p>
            </div>
            <div className="text-center">
              <div className="font-heading text-lg font-bold text-navy">JIRA</div>
              <p className="text-sm text-dark">Issue tracking</p>
            </div>
            <div className="text-center">
              <div className="font-heading text-lg font-bold text-navy">Confluence</div>
              <p className="text-sm text-dark">Documentation</p>
            </div>
            <div className="text-center">
              <div className="font-heading text-lg font-bold text-navy">Asana</div>
              <p className="text-sm text-dark">Task management</p>
            </div>
            <div className="text-center">
              <div className="font-heading text-lg font-bold text-navy">Trello</div>
              <p className="text-sm text-dark">Visual boards</p>
            </div>
            <div className="text-center">
              <div className="font-heading text-lg font-bold text-navy">Mercury</div>
              <p className="text-sm text-dark">Business banking</p>
            </div>
            <div className="text-center">
              <div className="font-heading text-lg font-bold text-navy">Helcim</div>
              <p className="text-sm text-dark">Payments</p>
            </div>
            <div className="text-center">
              <div className="font-heading text-lg font-bold text-navy">Xero</div>
              <p className="text-sm text-dark">Accounting</p>
            </div>
            <div className="text-center">
              <div className="font-heading text-lg font-bold text-navy">DocuSign</div>
              <p className="text-sm text-dark">E-signature</p>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="navy">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold mb-6">
            Connect Your Operations Stack
          </h2>
          <p className="text-lg text-cream mb-8">
            Stop juggling disconnected tools. Let's integrate your systems and automate the busywork.
          </p>
          <Link to="/contact">
            <Button variant="primary" size="lg">
              Streamline Operations
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
};

export default BusinessOperations;
