import { SEO } from './SEO';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <>
      <SEO 
        title="Page Not Found | IDIRAN TECH"
        description="The page you are looking for does not exist. Visit IDIRAN TECH document office homepage."
        noindex={true}
      />
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow-primary">
            <span className="text-white font-extrabold text-3xl">404</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
          <p className="text-slate-600 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </a>
        </div>
      </div>
    </>
  );
}
