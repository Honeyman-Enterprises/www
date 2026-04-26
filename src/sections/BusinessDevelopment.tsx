import { Target, GitBranch, Users, Database, LineChart } from 'lucide-react';

export const BusinessDevelopment = () => {
  const services = [
    {
      icon: Target,
      title: 'Pipeline Optimization & Lead Flow Architecture',
      description: 'Building structured, measurable sales processes that convert curiosity into contracts.',
    },
    {
      icon: GitBranch,
      title: 'Deal Attribution & Lifecycle Automation',
      description: 'Connecting marketing insights to BD execution for end-to-end visibility.',
    },
    {
      icon: Users,
      title: 'Sales Enablement Frameworks',
      description: 'Aligning tools, content, and process so BD teams spend more time selling and less time chasing data.',
    },
    {
      icon: Database,
      title: 'CRM Strategy & Implementation',
      description: 'Designing systems like HubSpot to support business development, reporting, and executive decision-making.',
    },
    {
      icon: LineChart,
      title: 'Outreach Analytics & Performance Tracking',
      description: 'Testing and refining BD messaging and sequences based on engagement data.',
    },
  ];

  return (
    <section id="business-development" className="py-12 md:py-20 bg-navy text-white relative z-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <p className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto mb-8 md:mb-12">
              "We develop targeted outreach strategies that blend CRM data, persona insights, and iterative content testing to increase conversion and meeting rates."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-all"
                >
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mb-4">
                    <Icon className="text-navy h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{service.title}</h3>
                  <p className="text-white/90">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
