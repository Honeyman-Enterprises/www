import { useState } from 'react';
import { Mail, Calendar } from 'lucide-react';

const HUBSPOT_PORTAL_ID = '244186059';
const HUBSPOT_FORM_ID = '942052e4-a9cf-4068-aeab-fac996a5dc23';

export const Contact = () => {
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
    <section id="contact" className="py-12 md:py-20 bg-navy text-white relative z-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold uppercase tracking-tight mb-6 font-heading">
              Let's Talk
            </h2>
            <p className="text-lg mb-8">
              Every project begins with a conversation. Schedule a call or send us a note to start
              discovery.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="text-gold mt-1" />
                <a href="mailto:info@honeymanenterprises.com" className="hover:underline">
                  info@honeymanenterprises.com
                </a>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="text-gold mt-1" />
                <a href="https://meetings-na2.hubspot.com/honeyman" className="hover:underline">
                  Schedule a discovery call
                </a>
              </div>
            </div>
          </div>

          <div className="md:w-1/2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="First Name *"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="Last Name *"
                  />
                </div>
              </div>

              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="Email *"
                />
              </div>

              <div>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="Company"
                />
              </div>

              <div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                  placeholder="Tell us about your project... *"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold hover:bg-gold-dark text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {submitStatus === 'success' && (
                <div className="p-4 bg-teal/20 border border-teal rounded-lg text-center">
                  <p className="text-teal font-semibold">Thank you! We'll be in touch soon.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-center">
                  <p className="text-red-300">
                    Something went wrong. Please add your domain to HubSpot's allowed list or email us directly.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
