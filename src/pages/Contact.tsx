import { useState } from 'react';
import { Mail, Calendar, Phone } from 'lucide-react';
import Section from '../components/shared/Section';
import Button from '../components/shared/Button';

const HUBSPOT_PORTAL_ID = '244186059';
const HUBSPOT_FORM_ID = '942052e4-a9cf-4068-aeab-fac996a5dc23';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Get HubSpot tracking cookie (hutk)
      const getHutk = () => {
        const match = document.cookie.match(/hubspotutk=([^;]*)/);
        return match ? match[1] : undefined;
      };

      // Prepare data in HubSpot format
      const hubspotData = {
        submittedAt: Date.now(),
        fields: [
          { name: 'firstname', value: formData.firstname },
          { name: 'lastname', value: formData.lastname },
          { name: 'email', value: formData.email },
          { name: 'company', value: formData.company },
          { name: 'message', value: formData.message },
        ],
        context: {
          hutk: getHutk(),
          pageUri: window.location.href,
          pageName: document.title,
        },
      };

      // Try US endpoint first
      let endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`;
      let response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hubspotData),
      });

      // If US endpoint fails with 403, try EU endpoint
      if (response.status === 403) {
        console.log('US endpoint blocked, trying EU endpoint...');
        endpoint = `https://api-eu1.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`;
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(hubspotData),
        });
      }

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          firstname: '',
          lastname: '',
          email: '',
          company: '',
          message: '',
        });
      } else {
        const errorData = await response.json();
        console.error('HubSpot API Error:', errorData);
        console.error('Submitted data:', hubspotData);
        console.error('Endpoint used:', endpoint);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section variant="navy" className="min-h-screen flex items-center">
      <div className="w-full">
        <div className="flex flex-col desktop:flex-row gap-12">
          {/* Left Column - Hero Content */}
          <div className="desktop:w-1/2">
            <h1 className="text-4xl tablet:text-5xl desktop:text-6xl font-bold uppercase tracking-tight mb-6 font-heading">
              Let's Talk
            </h1>
            <p className="text-lg tablet:text-xl mb-8 text-white/90">
              Every project begins with a conversation. Schedule a call or send us a note to start
              discovery.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="text-gold mt-1 flex-shrink-0" size={24} />
                <a
                  href="mailto:info@honeymanenterprises.com"
                  className="hover:text-gold transition-colors duration-200 break-all"
                >
                  info@honeymanenterprises.com
                </a>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="text-gold mt-1 flex-shrink-0" size={24} />
                <a
                  href="tel:+14243602256"
                  className="hover:text-gold transition-colors duration-200"
                >
                  Give us a call: 424.360.2256
                </a>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="text-gold mt-1 flex-shrink-0" size={24} />
                <a
                  href="https://meetings-na2.hubspot.com/honeyman"
                  className="hover:text-gold transition-colors duration-200"
                >
                  Schedule a discovery call
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="desktop:w-1/2">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Name Fields */}
              <div className="grid tablet:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstname" className="sr-only">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200"
                    placeholder="First Name *"
                  />
                </div>
                <div>
                  <label htmlFor="lastname" className="sr-only">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200"
                    placeholder="Last Name *"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="sr-only">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200"
                  placeholder="Email *"
                />
              </div>

              {/* Company Field */}
              <div>
                <label htmlFor="company" className="sr-only">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200"
                  placeholder="Company"
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none transition-all duration-200"
                  placeholder="Tell us about your project... *"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div
                  className="p-4 bg-teal/20 border border-teal rounded-lg text-center"
                  role="alert"
                  aria-live="polite"
                >
                  <p className="text-teal font-semibold">
                    Thank you! We'll be in touch soon.
                  </p>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div
                  className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-center"
                  role="alert"
                  aria-live="assertive"
                >
                  <p className="text-red-300">
                    Something went wrong. Please try again or email us directly at{' '}
                    <a
                      href="mailto:info@honeymanenterprises.com"
                      className="underline hover:text-white transition-colors"
                    >
                      info@honeymanenterprises.com
                    </a>
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </Section>
  );
}
