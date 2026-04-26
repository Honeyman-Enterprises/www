import { Clock, FileText, ArrowRight, Check } from 'lucide-react';

export const EngagementModels = () => {
  const models = [
    {
      icon: Clock,
      title: 'Time and Materials',
      bestFor: 'evolving or exploratory projects',
      description: 'Ideal when you\'re still defining your needs or want flexibility as we build together',
      features: [
        'Billed monthly for actual hours and resources used',
        'Transparent progress reports and adaptive pacing',
        'Recommended for audits, strategy sessions, or phased builds',
      ],
      cta: 'Start with a discovery session',
    },
    {
      icon: FileText,
      title: 'Fixed Price Project',
      bestFor: 'clearly scoped deliverables',
      description: 'Perfect when you know exactly what you need like a full HubSpot implementation or CRM configuration',
      features: [
        'Defined scope, timeline, and total cost upfront',
        'Structured milestone payments (30/40/30)',
        'Guaranteed delivery aligned to an approved scope',
      ],
      cta: 'Start with a discovery session',
    },
  ];

  return (
    <section id="engagement" className="py-12 md:py-20 bg-white relative z-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl font-bold uppercase tracking-tight mb-4 font-heading text-navy">
              Engagement Models
            </h2>
            <p className="text-lg max-w-3xl mx-auto">
              Choose how you want to work with us—each model is designed to meet you where you are in your growth or implementation journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {models.map((model) => {
              const Icon = model.icon;
              return (
                <div
                  key={model.title}
                  className="bg-cream p-8 rounded-xl text-dark hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center mb-6">
                    <Icon className="text-white h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-navy">{model.title}</h3>
                  <p className="text-sm font-medium text-teal mb-4">
                    Best for: {model.bestFor}
                  </p>
                  <p className="mb-6 italic">{model.description}</p>
                  <ul className="space-y-3 mb-6">
                    {model.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="text-teal mt-1 h-5 w-5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-navy hover:text-teal transition-colors font-medium"
                  >
                    <ArrowRight className="h-5 w-5" />
                    {model.cta}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
