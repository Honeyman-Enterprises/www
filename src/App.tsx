import { Layout } from './components/layout/Layout';
import { Hero } from './sections/Hero';
import { AboutCompany } from './sections/AboutCompany';
import { CapabilitiesServices } from './sections/CapabilitiesServices';
import { AboutMichelle } from './sections/AboutMichelle';
import { EngagementModels } from './sections/EngagementModels';
import { Contact } from './sections/Contact';
import { SEOHead } from './components/seo/SEOHead';
import { StructuredData } from './components/seo/StructuredData';
import './App.css';

function App() {
  return (
    <>
      <SEOHead />
      <StructuredData />
      <Layout>
        <Hero />
        <AboutCompany />
        <AboutMichelle />
        <CapabilitiesServices />
        <EngagementModels />
        <Contact />
      </Layout>
    </>
  );
}

export default App;
