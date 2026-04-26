import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Layout } from './components/layout/Layout';
import { SEOHead } from './components/seo/SEOHead';
import { StructuredData } from './components/seo/StructuredData';
import { usePageTracking } from './hooks/usePageTracking';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import { ScrollToTop } from './components/shared/ScrollToTop';
import { ErrorBoundary, RouteErrorBoundary } from './components/shared/ErrorBoundary';

// Lazy-loaded page components for code-splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const System = lazy(() => import('./pages/System'));
const Partners = lazy(() => import('./pages/Partners'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));

// Expertise pages
const BusinessDevelopment = lazy(() => import('./pages/expertise/BusinessDevelopment'));
const ProcessAutomation = lazy(() => import('./pages/expertise/ProcessAutomation'));
const OrganizationalDesign = lazy(() => import('./pages/expertise/OrganizationalDesign'));
const AIDevelopment = lazy(() => import('./pages/expertise/AIDevelopment'));
const BusinessOperations = lazy(() => import('./pages/expertise/BusinessOperations'));
const PrivacyCompliance = lazy(() => import('./pages/expertise/PrivacyCompliance'));
const Communication = lazy(() => import('./pages/expertise/Communication'));
const BusinessSetup = lazy(() => import('./pages/expertise/BusinessSetup'));

/**
 * Loading fallback component with navy background to prevent flash
 * Matches the body background and hero section for seamless transitions
 */
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-navy">
    <LoadingSpinner size={64} fullScreen={false} />
  </div>
);

// Root layout wrapper with SEO components
const RootLayout = () => {
  // Initialize GA4 page tracking
  usePageTracking();

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <SEOHead />
      <StructuredData />
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

// Router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'system',
        element: <System />,
      },
      {
        path: 'partners',
        element: <Partners />,
      },
      // Expertise routes
      {
        path: 'expertise/business-development',
        element: <BusinessDevelopment />,
      },
      {
        path: 'expertise/process-automation',
        element: <ProcessAutomation />,
      },
      {
        path: 'expertise/organizational-design',
        element: <OrganizationalDesign />,
      },
      {
        path: 'expertise/ai-development',
        element: <AIDevelopment />,
      },
      {
        path: 'expertise/business-operations',
        element: <BusinessOperations />,
      },
      {
        path: 'expertise/privacy-compliance',
        element: <PrivacyCompliance />,
      },
      {
        path: 'expertise/communication',
        element: <Communication />,
      },
      {
        path: 'expertise/business-setup',
        element: <BusinessSetup />,
      },
      {
        path: 'faq',
        element: <FAQ />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
    ],
  },
]);

// Export router object for use in main.tsx
export { router };

// Export router provider component
export const AppRouter = () => <RouterProvider router={router} />;
