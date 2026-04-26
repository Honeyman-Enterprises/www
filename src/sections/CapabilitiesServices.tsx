import { Target, Users, Database, Zap, BarChart3, UserCheck } from 'lucide-react';

export const CapabilitiesServices = () => {
  const services = [
    {
      icon: Target,
      title: 'Pipeline Architecture and Optimization',
      description: 'Building structured, measurable sales processes that convert leads into revenue',
    },
    {
      icon: Users,
      title: 'Sales Enablement Framework',
      description: 'Aligning tools, playbooks, and process so business development teams spend more time selling and less time chasing data',
    },
    {
      icon: Database,
      title: 'CRM Design and Integration',
      description: 'Building systems in HubSpot to support business development, reporting, and executive decision making',
    },
    {
      icon: Zap,
      title: 'Workflow Efficiency and Automation',
      description: 'Eliminate manual tasks and unify fragmented systems with intelligent automation that saves time, reduces error, and scales performance',
    },
    {
      icon: BarChart3,
      title: 'Data Intelligence and Analytics',
      description: 'We design dashboards and reports that turn data into decisions',
    },
    {
      icon: UserCheck,
      title: 'Advisory and Implementations',
      description: 'From initial design to full-scale rollout, we stay engaged throughout every step ensuring adoption, alignment and measurable results',
    },
  ];

  return (
    <section id="capabilities" className="py-12 md:py-20 bg-white relative z-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl font-bold uppercase tracking-tight mb-4 font-heading text-navy">
            Capabilities & Services
          </h2>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="bg-cream p-8 rounded-xl transition-all hover:shadow-xl hover:-translate-y-2 text-dark"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <Icon className="text-gold h-8 w-8 flex-shrink-0" />
                    <h3 className="text-xl font-bold text-navy">{service.title}</h3>
                  </div>
                  <p className="text-dark">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
