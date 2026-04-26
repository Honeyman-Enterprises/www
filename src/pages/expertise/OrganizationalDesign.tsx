import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Users, TrendingUp, GitBranch } from 'lucide-react';
import Section from '../../components/shared/Section';
import Button from '../../components/shared/Button';

const OrganizationalDesign = () => {
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
            Organizational Design
          </h1>
          <p className="text-xl tablet:text-2xl text-cream">
            Build organizational structure that scales—clear roles, aligned teams, and accountability at every level
          </p>
        </div>
      </Section>

      {/* Overview */}
      <Section variant="default">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-6">
            Structure That Drives Execution
          </h2>
          <p className="text-lg text-dark mb-6">
            Growing teams hit friction when roles are unclear, accountability is vague, and strategy doesn't translate to day-to-day work.
            We design organizational structures that eliminate confusion and enable decisive action.
          </p>
          <p className="text-lg text-dark">
            Using proven frameworks like EOS and OKRs, we create clarity from leadership down to individual contributors.
          </p>
        </div>
      </Section>

      {/* What We Do */}
      <Section variant="cream">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-12 text-center">
            How We Structure Organizations
          </h2>

          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-8">
            {/* EOS Implementation */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  EOS Framework Implementation
                </h3>
              </div>
              <p className="text-dark">
                Implement Entrepreneurial Operating System with clear vision, accountability charts, and 90-day rocks that keep teams aligned.
              </p>
            </div>

            {/* OKR Systems */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  OKR System Design
                </h3>
              </div>
              <p className="text-dark">
                Set objectives and key results that cascade from company goals down to individual priorities with measurable outcomes.
              </p>
            </div>

            {/* Team Structure */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <GitBranch className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  Team Structure Mapping
                </h3>
              </div>
              <p className="text-dark">
                Define reporting lines, decision authority, and communication patterns that eliminate bottlenecks and empower teams.
              </p>
            </div>

            {/* Accountability Systems */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  Accountability Frameworks
                </h3>
              </div>
              <p className="text-dark">
                Create clear ownership for outcomes with dashboards, check-ins, and metrics that make accountability transparent.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Frameworks */}
      <Section variant="default">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-8">
            Proven Methodologies
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-teal pl-6">
              <h3 className="font-heading text-xl font-bold text-navy mb-2">EOS (Entrepreneurial Operating System)</h3>
              <p className="text-dark">
                Six key components: Vision, People, Data, Issues, Process, Traction—creating a complete operating system for growth.
              </p>
            </div>
            <div className="border-l-4 border-teal pl-6">
              <h3 className="font-heading text-xl font-bold text-navy mb-2">OKRs (Objectives and Key Results)</h3>
              <p className="text-dark">
                Ambitious objectives with measurable key results that align teams and focus effort on what matters most.
              </p>
            </div>
            <div className="border-l-4 border-teal pl-6">
              <h3 className="font-heading text-xl font-bold text-navy mb-2">Team Topologies</h3>
              <p className="text-dark">
                Define stream-aligned, enabling, complicated-subsystem, and platform teams for sustainable high performance.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="navy">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold mb-6">
            Ready to Build a Scalable Structure?
          </h2>
          <p className="text-lg text-cream mb-8">
            Stop growing through chaos. Let's design an organization that executes with clarity and purpose.
          </p>
          <Link to="/contact">
            <Button variant="primary" size="lg">
              Design Your Organization
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
};

export default OrganizationalDesign;
