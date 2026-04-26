import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary Component
 *
 * Catches JavaScript errors in child component tree and displays
 * a styled fallback UI instead of crashing the entire application.
 *
 * Features:
 * - Professional error UI matching brand colors
 * - Action buttons for recovery (refresh, home)
 * - Development mode error details
 * - Production mode friendly messaging
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleRefresh = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-navy flex items-center justify-center px-6">
          <div className="max-w-2xl w-full text-center">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="rounded-full bg-gold/10 p-6">
                <AlertTriangle className="text-gold" size={64} />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading uppercase tracking-tight">
              Something Went Wrong
            </h1>

            {/* Message */}
            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
              {import.meta.env.DEV
                ? 'An error occurred while loading this page. Check the console for details.'
                : 'We encountered an unexpected error. Please try refreshing the page or return home.'}
            </p>

            {/* Error Details (Development Only) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-lg text-left overflow-auto max-h-48">
                <p className="text-sm font-mono text-red-300 break-all">
                  {this.state.error.toString()}
                </p>
                {this.state.error.stack && (
                  <pre className="text-xs text-white/60 mt-4 whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={this.handleRefresh}
                className="flex items-center justify-center gap-2"
              >
                <RefreshCw size={20} />
                Refresh Page
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={this.handleHome}
                className="flex items-center justify-center gap-2"
              >
                <Home size={20} />
                Go Home
              </Button>
            </div>

            {/* Additional Help */}
            <p className="mt-8 text-sm text-white/60">
              If the problem persists, please contact us at{' '}
              <a
                href="mailto:info@honeymanenterprises.com"
                className="text-gold hover:text-gold/80 transition-colors underline"
              >
                info@honeymanenterprises.com
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based error boundary for use in router errorElement
 */
export const RouteErrorBoundary = () => {
  const handleRefresh = () => window.location.reload();
  const handleHome = () => (window.location.href = '/');

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        <div className="flex justify-center mb-8">
          <div className="rounded-full bg-gold/10 p-6">
            <AlertTriangle className="text-gold" size={64} />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading uppercase tracking-tight">
          Page Not Found
        </h1>

        <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or failed to load.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} />
            Refresh Page
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleHome}
            className="flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Go Home
          </Button>
        </div>

        <p className="mt-8 text-sm text-white/60">
          If the problem persists, please contact us at{' '}
          <a
            href="mailto:info@honeymanenterprises.com"
            className="text-gold hover:text-gold/80 transition-colors underline"
          >
            info@honeymanenterprises.com
          </a>
        </p>
      </div>
    </div>
  );
};
