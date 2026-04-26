import { useState } from 'react';
import Section from '../components/shared/Section';
import faqData from '../data/faq.json';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ = () => {
  const faqs: FAQItem[] = faqData;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section variant="cream">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl tablet:text-5xl desktop:text-6xl font-display font-bold text-navy mb-6">
            Frequently Asked Questions
          </h1>
        </div>
      </Section>

      {/* FAQ Accordion */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className="bg-white border-2 border-cream rounded-lg overflow-hidden transition-all duration-300"
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-cream/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-inset"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <h3 className="text-lg tablet:text-xl font-display font-bold text-navy pr-8">
                    {faq.question}
                  </h3>
                  <span
                    className={`text-2xl text-gold transition-transform duration-300 flex-shrink-0 ${
                      openIndex === index ? 'rotate-45' : ''
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                {/* Answer Content */}
                <div
                  id={`faq-answer-${faq.id}`}
                  className={`transition-all duration-300 ease-in-out ${
                    openIndex === index
                      ? 'max-h-96 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                  style={{
                    overflow: 'hidden',
                  }}
                >
                  <div className="px-6 pb-5 pt-2">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default FAQ;
