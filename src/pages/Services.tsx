import { Link } from 'react-router-dom';
import { Target, Cloud, Zap, Brain, Building2, Check } from 'lucide-react';
import Section from '../components/shared/Section';
import Card from '../components/shared/Card';
import Grid from '../components/shared/Grid';
import Button from '../components/shared/Button';
import servicesData from '../data/services.json';

// Map icon strings to lucide-react components
const iconMap = {
  target: Target,
  cloud: Cloud,
  zap: Zap,
  brain: Brain,
  building: Building2,
};

interface Service {
  id: string;
  title: string;
  summary: string;
  outcomes: string[];
  icon: keyof typeof iconMap;
}

const Services = () => {
  const services = servicesData as Service[];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section variant="navy">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-heading text-4xl tablet:text-5xl desktop:text-6xl font-bold uppercase tracking-tight mb-6">
            Services
          </h1>
          <p className="text-lg tablet:text-xl text-cream max-w-3xl mx-auto">
            Purposeful consulting services designed for measurable impact across strategy, technology, and operations
          </p>
        </div>
      </Section>

      {/* Services Grid */}
      <Section variant="default">
        <Grid cols={2} gap="lg">
          {services.map((service) => {
            const Icon = iconMap[service.icon];

            return (
              <Card key={service.id} variant="elevated" interactive>
                <div className="flex flex-col h-full">
                  {/* Icon and Title */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="text-white h-8 w-8" />
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-navy">
                      {service.title}
                    </h2>
                  </div>

                  {/* Summary */}
                  <p className="text-dark mb-6 flex-grow">
                    {service.summary}
                  </p>

                  {/* Outcomes List */}
                  <ul className="space-y-3 mb-6">
                    {service.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-start gap-3">
                        <Check className="text-teal mt-1 h-5 w-5 flex-shrink-0" />
                        <span className="text-dark">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </Grid>
      </Section>

      {/* Expertise and Competencies */}
      <Section variant="cream">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-4">
            Expertise and Competencies
          </h2>
          <p className="text-lg text-dark max-w-3xl mx-auto">
            Our combined capabilities span business strategy, operational automation, and AI integration
          </p>
        </div>

        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-0 max-w-6xl mx-auto bg-white shadow-lg">
          {/* Business Development & CRM */}
          <Link
            to="/expertise/business-development"
            className="group border-b border-r-0 tablet:border-r border-gray-200 p-8 hover:bg-cream transition-colors"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl tablet:text-2xl font-normal text-navy group-hover:text-teal transition-colors">
                Business Development & CRM
              </h3>
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-teal group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>

          {/* Process & Workflow Automation */}
          <Link
            to="/expertise/process-automation"
            className="group border-b border-gray-200 p-8 hover:bg-cream transition-colors"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl tablet:text-2xl font-normal text-navy group-hover:text-teal transition-colors">
                Process & Workflow Automation
              </h3>
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-teal group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>

          {/* Organizational Design */}
          <Link
            to="/expertise/organizational-design"
            className="group border-b border-r-0 tablet:border-r border-gray-200 p-8 hover:bg-cream transition-colors"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl tablet:text-2xl font-normal text-navy group-hover:text-teal transition-colors">
                Organizational Design
              </h3>
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-teal group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>

          {/* AI Development */}
          <Link
            to="/expertise/ai-development"
            className="group border-b border-r-0 tablet:border-r border-gray-200 p-8 hover:bg-cream transition-colors"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl tablet:text-2xl font-normal text-navy group-hover:text-teal transition-colors">
                AI Development
              </h3>
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-teal group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>

          {/* Business Operations & Tools */}
          <Link
            to="/expertise/business-operations"
            className="group border-b border-gray-200 p-8 hover:bg-cream transition-colors"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl tablet:text-2xl font-normal text-navy group-hover:text-teal transition-colors">
                Business Operations & Tools
              </h3>
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-teal group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>

          {/* Privacy & Compliance */}
          <Link
            to="/expertise/privacy-compliance"
            className="group border-b border-r-0 tablet:border-r border-gray-200 p-8 hover:bg-cream transition-colors"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl tablet:text-2xl font-normal text-navy group-hover:text-teal transition-colors">
                Privacy & Compliance
              </h3>
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-teal group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>

          {/* Communication */}
          <Link
            to="/expertise/communication"
            className="group border-b border-gray-200 p-8 hover:bg-cream transition-colors"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl tablet:text-2xl font-normal text-navy group-hover:text-teal transition-colors">
                Communication
              </h3>
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-teal group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>

          {/* Business Setup & Enablement */}
          <Link
            to="/expertise/business-setup"
            className="group border-r-0 tablet:border-r border-gray-200 p-8 hover:bg-cream transition-colors"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl tablet:text-2xl font-normal text-navy group-hover:text-teal transition-colors">
                Business Setup & Enablement
              </h3>
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-teal group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>
        </div>
      </Section>

      {/* CTA Section */}
      <Section variant="default">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-6">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-lg text-dark mb-8">
            Schedule a call to discuss how we can align your strategy, technology, and operations for measurable growth.
          </p>
          <Link to="/contact">
            <Button variant="primary" size="lg">
              Schedule a Call
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
};

export default Services;
