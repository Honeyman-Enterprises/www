import Section from '../components/shared/Section';
import Card from '../components/shared/Card';
import Grid from '../components/shared/Grid';
import partnersData from '../data/partners.json';

interface Partner {
  id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
}

const Partners = () => {
  const partners: Partner[] = partnersData;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section variant="cream">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl tablet:text-5xl desktop:text-6xl font-display font-bold text-navy mb-6">
            Partner Network
          </h1>
          <p className="text-lg tablet:text-xl text-gray-700">
            Strategic collaborators supporting Honeyman's brand strategy and execution
          </p>
        </div>
      </Section>

      {/* Partners Grid */}
      <Section>
        <Grid cols={3} gap="lg">
          {partners.map((partner) => (
            <Card key={partner.id} variant="elevated">
              {/* Logo Placeholder */}
              <div className="mb-6 h-16 flex items-center justify-center bg-cream rounded">
                <div className="text-2xl font-display font-bold text-navy">
                  {partner.name.charAt(0)}
                </div>
              </div>

              {/* Partner Name */}
              <h3 className="text-xl font-display font-bold text-navy mb-3">
                {partner.name}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {partner.description}
              </p>
            </Card>
          ))}
        </Grid>
      </Section>
    </div>
  );
};

export default Partners;
