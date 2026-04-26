import { Hero } from '../sections/Hero';
import Section from '../components/shared/Section';
import Card from '../components/shared/Card';
import Grid from '../components/shared/Grid';
import Button from '../components/shared/Button';
import { Link } from 'react-router-dom';
import { Users, Workflow, Network, Briefcase, Presentation } from 'lucide-react';
import capabilitiesData from '../data/capabilities.json';

const iconMap = {
  users: Users,
  workflow: Workflow,
  network: Network,
  briefcase: Briefcase,
  presentation: Presentation,
};

const Home = () => {
  return (
    <>
      <Hero />

      {/* Capabilities Section */}
      <Section variant="cream" id="capabilities">
        <div className="text-center mb-12">
          <h2 className="font-bold font-heading uppercase tracking-tight text-navy mb-4">
            Capabilities
          </h2>
          <p className="text-navy/80 max-w-3xl mx-auto">
            Integrated systems and strategic frameworks that drive sustainable growth
          </p>
        </div>

        <Grid cols={3} gap="lg">
          {capabilitiesData.map((capability) => {
            const IconComponent = iconMap[capability.icon as keyof typeof iconMap];
            return (
              <Card key={capability.id} variant="elevated" interactive>
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    {IconComponent && (
                      <IconComponent className="w-12 h-12 text-gold" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold font-subheading uppercase text-navy mb-3">
                    {capability.title}
                  </h3>
                  <p className="text-navy/80 mb-4 flex-grow">
                    {capability.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {capability.tools.map((tool, index) => (
                      <span
                        key={index}
                        className="text-xs bg-cream px-3 py-1 rounded-full text-navy/70"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </Grid>
      </Section>

      {/* Method Teaser Section */}
      <Section variant="default">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-bold font-heading uppercase tracking-tight text-navy mb-8">
            The Honeyman Method™
          </h2>
          <p className="text-navy/80 mb-12 text-lg leading-relaxed">
            The Honeyman Method™ merges EOS and OKRs into a continuous, collaborative cycle
            that aligns vision with execution, enabling teams to move faster and adapt smarter.
          </p>
          <Link to="/system">
            <Button variant="secondary" size="lg">
              Learn More About Our Method
            </Button>
          </Link>
        </div>
      </Section>

      {/* Primary CTAs Section */}
      <Section variant="navy">
        <div className="text-center">
          <h2 className="font-bold font-heading uppercase tracking-tight mb-8">
            Ready to Transform Your Business?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-12 text-lg leading-relaxed">
            Partner with us to build systems that scale, teams that execute, and outcomes that matter.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#contact">
              <Button variant="primary" size="lg">
                Schedule a Call
              </Button>
            </a>
            <Link to="/services">
              <Button variant="ghost" size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-navy">
                Explore Services
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Home;
