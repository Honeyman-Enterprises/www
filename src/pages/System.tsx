import {
  Triangle,
  Grid3x3,
  Minus,
  Share2
} from 'lucide-react';
import Section from '../components/shared/Section';
import orgModelsData from '../data/orgModels.json';
import HoneymanMethod from '../components/honeyman-method/HoneymanMethod';

// Map icon strings to lucide-react components
const orgIconMap = {
  pyramid: Triangle,
  blocks: Grid3x3,
  minus: Minus,
  grid: Grid3x3,
  share2: Share2,
};

interface OrgModel {
  id: string;
  name: string;
  description: string;
  mainBenefit: string;
  mainWeakness: string;
  bestFor: string;
  icon: keyof typeof orgIconMap;
}

const Method = () => {
  const _orgModels = orgModelsData as OrgModel[];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section variant="navy">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-heading text-4xl tablet:text-5xl desktop:text-6xl font-bold uppercase tracking-tight mb-6">
            The Honeyman Method™
          </h1>
          <p className="text-lg tablet:text-xl text-cream max-w-3xl mx-auto">
            Our agile-inspired framework merges EOS and OKRs into a continuous, collaborative cycle that aligns every
            engagement with measurable outcomes and stakeholder visibility.
          </p>
        </div>
      </Section>

      {/* Process Visualization */}
      <Section variant="default">
        <HoneymanMethod />
      </Section>

      {/* Organizational Models */}
      {/* <Section variant="cream">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold text-navy mb-4">
            Organizational Models
          </h2>
          <p className="text-lg text-dark max-w-3xl mx-auto">
            We work within and help optimize various organizational structures to fit your specific needs
          </p>
        </div>

        <Grid cols={3} gap="lg">
          {orgModels.map((model) => {
            const Icon = orgIconMap[model.icon];

            return (
              <Card key={model.id} variant="elevated" interactive>
                <div className="flex flex-col h-full">
                  <div className="w-14 h-14 bg-navy rounded-full flex items-center justify-center mb-5">
                    <Icon className="text-white h-7 w-7" />
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-navy mb-3">
                    {model.name}
                  </h3>

                  <p className="text-dark text-sm mb-4 flex-grow">
                    {model.description}
                  </p>

                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-teal/10 text-teal text-xs font-semibold rounded-full mb-2">
                      BENEFIT
                    </span>
                    <p className="text-dark text-sm">
                      {model.mainBenefit}
                    </p>
                  </div>

                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-gold/10 text-gold-dark text-xs font-semibold rounded-full mb-2">
                      CONSIDERATION
                    </span>
                    <p className="text-dark text-sm">
                      {model.mainWeakness}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-cream">
                    <p className="text-xs text-dark uppercase font-semibold mb-1">
                      Best For
                    </p>
                    <p className="text-dark text-sm">
                      {model.bestFor}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </Grid>
      </Section> */}

      {/* Framework Summary */}
      <Section variant="navy">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tablet:text-4xl font-bold mb-6">
            Built for Collaboration and Results
          </h2>
          <p className="text-lg text-cream mb-6">
            The Honeyman Method™ combines proven frameworks with adaptive execution, ensuring every engagement
            delivers measurable value while maintaining full transparency with stakeholders.
          </p>
          <p className="text-md text-cream/80">
            Whether you're a startup finding your structure or an enterprise optimizing operations,
            our method adapts to your organizational model and growth stage.
          </p>
        </div>
      </Section>
    </div>
  );
};

export default Method;
