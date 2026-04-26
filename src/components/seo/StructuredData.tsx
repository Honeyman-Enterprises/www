export const StructuredData = () => {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Honeyman Enterprises',
    description:
      'Strategic systems and AI consulting helping organizations scale through automation and intelligent innovation.',
    url: 'https://honeymanenterprises.com',
    logo: 'https://honeymanenterprises.com/logo.svg',
    email: 'info@honeymanenterprises.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    sameAs: [
      'https://www.linkedin.com/company/honeyman-enterprises',
      // Add other social media profiles
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'info@honeymanenterprises.com',
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    serviceType: [
      'Business Consulting',
      'AI Consulting',
      'Digital Transformation',
      'Strategic Planning',
      'Systems Integration',
    ],
  };

  const serviceSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Strategy & Operations Consulting',
      provider: {
        '@type': 'Organization',
        name: 'Honeyman Enterprises',
      },
      description:
        'Structure growth through data-backed business development systems and operational alignment.',
      serviceType: 'Business Strategy',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Digital Transformation Consulting',
      provider: {
        '@type': 'Organization',
        name: 'Honeyman Enterprises',
      },
      description:
        'Modernize legacy operations with scalable, cloud-ready foundations and compliance frameworks.',
      serviceType: 'Digital Transformation',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'AI Consulting & Integration',
      provider: {
        '@type': 'Organization',
        name: 'Honeyman Enterprises',
      },
      description:
        'Integrate and teach the practical use of AI—from prompt strategy to full agentic systems.',
      serviceType: 'Artificial Intelligence Consulting',
    },
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://honeymanenterprises.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://honeymanenterprises.com#services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Contact',
        item: 'https://honeymanenterprises.com#contact',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {serviceSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
};
