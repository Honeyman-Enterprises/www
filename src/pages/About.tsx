import Section from '../components/shared/Section';
import Card from '../components/shared/Card';
import Grid from '../components/shared/Grid';
import Button from '../components/shared/Button';
import {
  Target,
  Shield,
  Lightbulb,
  Leaf,
  Handshake
} from 'lucide-react';

const values = [
  {
    id: 'efficiency',
    title: 'Efficiency',
    description: 'We eliminate waste and optimize workflows, ensuring every action contributes to measurable outcomes.',
    icon: Target,
  },
  {
    id: 'integrity',
    title: 'Integrity',
    description: 'We operate with transparency and accountability, building trust through consistent, ethical practices.',
    icon: Shield,
  },
  {
    id: 'innovation',
    title: 'Innovation',
    description: 'We embrace emerging technologies and methodologies to create solutions that adapt and evolve with your needs.',
    icon: Lightbulb,
  },
  {
    id: 'sustainability',
    title: 'Sustainability',
    description: 'We design systems that scale responsibly, balancing growth with long-term viability and impact.',
    icon: Leaf,
  },
  {
    id: 'partnership',
    title: 'Partnership',
    description: 'We collaborate closely with our clients, acting as an extension of your team to achieve shared success.',
    icon: Handshake,
  },
];

const teamCapabilities = [
  {
    id: 'leadership',
    title: 'Strategic Leadership',
    description: 'Michelle Honeyman and Eric Hodonsky bring decades of combined experience in operational excellence, systems design, and technical innovation. Together, they lead strategic initiatives that transform how organizations operate and scale.',
    icon: Handshake,
  },
  {
    id: 'freeflow',
    title: 'FreeFlow Collaborative',
    description: 'Our operational excellence arm specializes in EOS implementation, organizational design, and strategic systems thinking. FreeFlow partners deliver clarity, execution alignment, and sustainable operational frameworks.',
    icon: Target,
  },
  {
    id: 'prime',
    title: 'Prime Division',
    description: 'Technical innovation and AI enablement experts who architect intelligent automation systems, digital transformation initiatives, and integration solutions that empower teams with unprecedented efficiency.',
    icon: Lightbulb,
  },
  {
    id: 'yalantis',
    title: 'Yalantis Partnership',
    description: 'Strategic development partnership providing enterprise-grade software engineering, mobile application development, and custom technology solutions for complex digital transformation projects.',
    icon: Shield,
  },
];

const About = () => {
  return (
    <>
      {/* Hero Section */}
      <Section variant="navy">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-heading uppercase tracking-tight mb-6">
            About Honeyman Enterprises
          </h1>
          <p className="text-xl md:text-2xl text-white/90">
            Strategic systems. Sustainable innovation. Results that matter.
          </p>
        </div>
      </Section>

      {/* Company Story Section */}
      <Section variant="default">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold font-heading uppercase tracking-tight text-navy mb-8 text-center">
            Our Story
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg md:text-xl text-navy/80 leading-relaxed mb-6">
              Honeyman Enterprises partners with organizations that believe in progress through systems thinking.
              Our team blends executive-level strategy, digital transformation, and AI-driven enablement to help
              businesses grow sustainably and intelligently.
            </p>
            <p className="text-lg md:text-xl text-navy/80 leading-relaxed mb-6">
              Founded on the principle that every organization deserves clarity, efficiency, and scalable systems,
              we work with leadership teams to implement frameworks that drive measurable outcomes. From startups
              building their first operational infrastructure to established enterprises modernizing legacy processes,
              we deliver solutions that adapt to your unique needs.
            </p>
            <p className="text-lg md:text-xl text-navy/80 leading-relaxed">
              Our approach combines proven methodologies like EOS and OKRs with cutting-edge automation and AI
              technologies, creating a comprehensive ecosystem where strategy meets execution. We don't just consult—we
              partner with you to build, implement, and optimize the systems that power your success.
            </p>
          </div>
        </div>
      </Section>

      {/* Values Section */}
      <Section variant="cream">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-heading uppercase tracking-tight text-navy mb-4">
            Our Values
          </h2>
          <p className="text-lg md:text-xl text-navy/80 max-w-3xl mx-auto">
            The principles that guide everything we do
          </p>
        </div>

        <Grid cols={3} gap="lg">
          {values.map((value) => {
            const IconComponent = value.icon;
            return (
              <Card key={value.id} variant="elevated" interactive>
                <div className="flex flex-col items-center text-center h-full">
                  <div className="mb-4">
                    <IconComponent className="w-12 h-12 text-gold" />
                  </div>
                  <h3 className="text-xl font-bold font-subheading uppercase text-navy mb-3">
                    {value.title}
                  </h3>
                  <p className="text-navy/80">
                    {value.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </Grid>
      </Section>

      {/* Team Capabilities Section */}
      <Section variant="default">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-heading uppercase tracking-tight text-navy mb-4">
            Our Team
          </h2>
          <p className="text-lg md:text-xl text-navy/80 max-w-3xl mx-auto">
            Combining expertise across operational excellence, technical innovation, and strategic partnerships
          </p>
        </div>

        <Grid cols={2} gap="lg" className="max-w-5xl mx-auto">
          {teamCapabilities.map((capability) => {
            const IconComponent = capability.icon;
            return (
              <Card key={capability.id} variant="elevated" interactive>
                <div className="flex flex-col items-center text-center h-full">
                  <div className="mb-4">
                    <IconComponent className="w-12 h-12 text-gold" />
                  </div>
                  <h3 className="text-xl font-bold font-subheading uppercase text-navy mb-3">
                    {capability.title}
                  </h3>
                  <p className="text-navy/80">
                    {capability.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </Grid>
      </Section>

      {/* CTA Section */}
      <Section variant="navy">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-heading uppercase tracking-tight mb-6">
            Work With Us
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Whether you're building from the ground up or transforming existing operations,
            we're here to help you create systems that scale and teams that execute with precision.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#contact">
              <Button variant="primary" size="lg">
                Schedule a Consultation
              </Button>
            </a>
            <a href="/services">
              <Button variant="ghost" size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-navy">
                View Our Services
              </Button>
            </a>
          </div>
        </div>
      </Section>
    </>
  );
};

export default About;
