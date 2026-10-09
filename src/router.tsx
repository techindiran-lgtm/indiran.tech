import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useParams } from 'react-router-dom';
import { ToastProvider } from '@/components/shared/Toast';
import { PublicSite } from '@/components/public/PublicSite';
import { NotFound } from '@/components/shared/NotFound';
import { SEO } from '@/components/shared/SEO';
import { useSession } from '@/components/shared/useSession';
import { supabase } from '@/lib/supabase';
import { normalizeServiceSlug } from '@/lib/routes';

// Lazy load admin panel (noindex, not prerendered)
const AdminLoginComponent = lazy(() => import('@/components/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminPanelComponent = lazy(() => import('@/components/admin/AdminPanel').then(m => ({ default: m.AdminPanel })));

// Lazy load privacy policy
const PrivacyPolicyComponent = lazy(() => import('@/components/public/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));

// Admin helper functions
const handleLogout = async () => {
  await supabase.auth.signOut();
  window.location.href = '/';
};

const handleViewSite = () => {
  window.location.href = '/';
};

// Admin routes with auth protection
function AdminLoginPage() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (session) {
    return <AdminPanelComponent session={session} onLogout={handleLogout} onViewSite={handleViewSite} />;
  }

  return (
    <>
      <SEO 
        title="Admin Login | IDIRAN TECH"
        description="Admin login for IDIRAN TECH document office management"
        noindex={true}
      />
      <AdminLoginComponent onSuccess={() => {}} onBack={() => window.location.href = '/'} />
    </>
  );
}

function AdminPanelPage() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    window.location.href = '/admin';
    return null;
  }

  return (
    <>
      <SEO 
        title="Admin Panel | IDIRAN TECH"
        description="Admin panel for IDIRAN TECH document office management"
        noindex={true}
      />
      <AdminPanelComponent
        session={session}
        onLogout={handleLogout}
        onViewSite={handleViewSite}
      />
    </>
  );
}

// Service route validation - returns 404 for unknown slugs
function ServiceRoute() {
  const { slug } = useParams<{ slug: string }>();
  
  if (!slug) {
    return <NotFound />;
  }
  
  const normalizedSlug = normalizeServiceSlug(slug);
  
  if (!normalizedSlug) {
    return <NotFound />;
  }
  
  // If slug was normalized, redirect to the correct URL using React Router Navigate
  if (slug !== normalizedSlug) {
    return <Navigate to={`/services/${normalizedSlug}`} replace />;
  }
  
  return <PublicSite />;
}

// Route configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicSite />,
  },
  {
    path: '/services',
    element: <PublicSite />,
  },
  {
    path: '/services/:slug',
    element: <ServiceRoute />,
  },
  {
    path: '/about',
    element: <PublicSite />,
  },
  {
    path: '/contact',
    element: <PublicSite />,
  },
  {
    path: '/appointment',
    element: <PublicSite />,
  },
  {
    path: '/privacy-policy',
    element: (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>}>
        <PrivacyPolicyComponent />
      </Suspense>
    ),
  },
  {
    path: '/admin',
    element: (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>}>
        <AdminLoginPage />
      </Suspense>
    ),
  },
  {
    path: '/admin/*',
    element: (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>}>
        <AdminPanelPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export function AppRouter() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}
