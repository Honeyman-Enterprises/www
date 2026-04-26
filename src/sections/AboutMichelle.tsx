import { Linkedin } from 'lucide-react';

export const AboutMichelle = () => {
  return (
    <section id="michelle" className="py-12 md:py-20 bg-cream relative z-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold uppercase tracking-tight mb-8 md:mb-12 font-heading text-navy text-center">
            Michelle Honeyman
          </h2>
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            <div className="md:w-1/3">
              <img
                src="/michelle_honeyman_linkedin.jpeg"
                alt="Michelle Honeyman"
                className="rounded-lg shadow-xl w-full aspect-square object-cover"
              />
            </div>
            <div className="md:w-2/3 space-y-6">
              <p className="text-lg leading-relaxed">
                Michelle Honeyman works with orgs to bridge strategy and execution, turning disjointed workflows into systems that scale. Her work blends business development, process design, and technology integration to create clarity, efficiency, and measurable growth.
              </p>
              <p className="text-lg leading-relaxed">
                Rooted in empathy and connection, she brings a people first approach to solving complex problems and believes sustainable progress starts with well-built systems.
              </p>
              <a
                href="https://www.linkedin.com/in/michelle-honeyman-b01558a0/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-navy hover:text-teal transition-colors font-medium"
              >
                <Linkedin className="h-5 w-5" />
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
