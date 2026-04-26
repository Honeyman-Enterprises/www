import { Link } from 'react-router-dom';
import { ArrowLeft, Presentation, Users, BookOpen, Award } from 'lucide-react';
import Section from '../../components/shared/Section';
import Button from '../../components/shared/Button';

const Communication = () => {
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
            Communication
          </h1>
          <p className="text-xl tablet:text-2xl text-cream">
            Master the art of presenting complex ideas clearly—from board decks to internal training that drives understanding and action
          </p>
        </div>
      </Section>

      {/* Overview */}
      <Section variant="default">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-6">
            Communication That Moves People
          </h2>
          <p className="text-lg text-dark mb-6">
            Technical expertise means nothing if you can't explain it. We help leaders craft presentations that win stakeholder buy-in,
            and train teams to communicate complex concepts with clarity and confidence.
          </p>
          <p className="text-lg text-dark">
            Whether you're pitching investors, presenting to the board, or onboarding new hires—we make sure your message lands.
          </p>
        </div>
      </Section>

      {/* What We Do */}
      <Section variant="cream">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-12 text-center">
            Communication Services
          </h2>

          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-8">
            {/* Presentation Design */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Presentation className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  High-Stakes Presentation Design
                </h3>
              </div>
              <p className="text-dark">
                Craft investor pitches, board presentations, and sales decks that tell a compelling story with data-driven visuals and clear narratives.
              </p>
            </div>

            {/* Presentation Coaching */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  Executive Presentation Coaching
                </h3>
              </div>
              <p className="text-dark">
                Develop confident delivery, master body language, and handle tough questions with poise—from rehearsal to performance.
              </p>
            </div>

            {/* Internal Training Programs */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  Internal Training Programs
                </h3>
              </div>
              <p className="text-dark">
                Design onboarding sequences, technical training modules, and process documentation that get teams productive faster.
              </p>
            </div>

            {/* Technical Writing */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  Process Documentation
                </h3>
              </div>
              <p className="text-dark">
                Transform tribal knowledge into clear runbooks, SOPs, and wikis that scale your operations without constant questions.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Training Topics */}
      <Section variant="default">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-8">
            Training & Workshop Topics
          </h2>
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
            <div className="border-l-4 border-teal pl-6">
              <h3 className="font-heading text-lg font-bold text-navy mb-2">Executive Storytelling</h3>
              <p className="text-dark text-sm">Frame complex initiatives with narrative arcs that resonate with stakeholders</p>
            </div>
            <div className="border-l-4 border-teal pl-6">
              <h3 className="font-heading text-lg font-bold text-navy mb-2">Data Visualization</h3>
              <p className="text-dark text-sm">Design charts and dashboards that communicate insights at a glance</p>
            </div>
            <div className="border-l-4 border-teal pl-6">
              <h3 className="font-heading text-lg font-bold text-navy mb-2">Technical Communication</h3>
              <p className="text-dark text-sm">Explain technical concepts to non-technical audiences without losing precision</p>
            </div>
            <div className="border-l-4 border-teal pl-6">
              <h3 className="font-heading text-lg font-bold text-navy mb-2">Meeting Facilitation</h3>
              <p className="text-dark text-sm">Run productive meetings that drive decisions and maintain momentum</p>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="navy">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold mb-6">
            Communicate With Impact
          </h2>
          <p className="text-lg text-cream mb-8">
            Great ideas deserve great presentation. Let's make sure your message gets heard and remembered.
          </p>
          <Link to="/contact">
            <Button variant="primary" size="lg">
              Improve Your Communication
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
};

export default Communication;
