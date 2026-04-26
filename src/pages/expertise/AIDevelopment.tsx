import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, MessageSquare, Sparkles } from 'lucide-react';
import Section from '../../components/shared/Section';
import Button from '../../components/shared/Button';

const AIDevelopment = () => {
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
            AI Development
          </h1>
          <p className="text-xl tablet:text-2xl text-cream">
            Integrate AI into your workflows—from custom GPTs to voice agents that enhance productivity and customer experience
          </p>
        </div>
      </Section>

      {/* Overview */}
      <Section variant="default">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-6">
            AI That Actually Works
          </h2>
          <p className="text-lg text-dark mb-6">
            AI isn't just hype—it's a practical tool for automating customer support, generating content, and building intelligent workflows.
            We help you cut through the noise and implement AI that delivers measurable value.
          </p>
          <p className="text-lg text-dark">
            Whether you need custom GPTs, Claude integrations, or voice AI for calls—we build solutions that fit your processes.
          </p>
        </div>
      </Section>

      {/* What We Do */}
      <Section variant="cream">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-12 text-center">
            AI Solutions We Build
          </h2>

          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-8">
            {/* Custom GPTs */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  Custom GPTs (OpenAI)
                </h3>
              </div>
              <p className="text-dark">
                Build specialized ChatGPT agents trained on your docs, policies, and processes—for support, onboarding, or internal Q&A.
              </p>
            </div>

            {/* Claude Integration */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  Claude (Anthropic) Integration
                </h3>
              </div>
              <p className="text-dark">
                Leverage Claude's advanced reasoning for complex analysis, content generation, and multi-step workflows that require nuanced understanding.
              </p>
            </div>

            {/* Voice AI */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">
                  Voice AI with Retell
                </h3>
              </div>
              <p className="text-dark">
                Build conversational voice agents for phone support, appointment scheduling, and customer qualification that sound natural and handle edge cases.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Use Cases */}
      <Section variant="default">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-8">
            Real-World Applications
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-teal pl-6">
              <h3 className="font-heading text-xl font-bold text-navy mb-2">Customer Support Automation</h3>
              <p className="text-dark">
                Deploy AI chatbots that handle FAQs, route complex issues to humans, and learn from every conversation to improve responses.
              </p>
            </div>
            <div className="border-l-4 border-teal pl-6">
              <h3 className="font-heading text-xl font-bold text-navy mb-2">Content Generation Workflows</h3>
              <p className="text-dark">
                Generate marketing copy, documentation, and social media content at scale while maintaining brand voice and accuracy.
              </p>
            </div>
            <div className="border-l-4 border-teal pl-6">
              <h3 className="font-heading text-xl font-bold text-navy mb-2">Voice-Enabled Call Centers</h3>
              <p className="text-dark">
                Build AI phone agents that qualify leads, schedule appointments, and handle routine inquiries—freeing your team for high-value conversations.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Platforms */}
      <Section variant="cream">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-8 text-center">
            AI Platforms We Use
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <div className="font-heading text-lg font-bold text-navy mb-2">OpenAI</div>
              <p className="text-sm text-dark">GPT-5 exhibits human-level performance on professional and academic benchmarks. Multimodal model handling text and images with advanced reasoning and reliability.</p>
            </div>
            <div>
              <div className="font-heading text-lg font-bold text-navy mb-2">Anthropic Claude</div>
              <p className="text-sm text-dark">Your AI thinking partner for complex problem-solving, analysis, and code writing. Leader in enterprise AI where precision matters most.</p>
            </div>
            <div>
              <div className="font-heading text-lg font-bold text-navy mb-2">Retell AI</div>
              <p className="text-sm text-dark">Voice AI platform creating natural-sounding agents with 800ms response times. Handles thousands of concurrent calls with zero wait time and no-code setup.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="navy">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold mb-6">
            Ready to Integrate AI?
          </h2>
          <p className="text-lg text-cream mb-8">
            Let's build AI solutions that enhance your team's capabilities and deliver real business value.
          </p>
          <Link to="/contact">
            <Button variant="primary" size="lg">
              Explore AI Solutions
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
};

export default AIDevelopment;
