import { useState } from 'react';
import { ToastProvider } from '@/components/shared/Toast';
import { useSession } from '@/components/shared/useSession';
import { PublicSite } from '@/components/public/PublicSite';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { supabase } from '@/lib/supabase';

type View = 'public' | 'admin';

function AppContent() {
  const { session, loading } = useSession();
  const [view, setView] = useState<View>('public');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('public');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (view === 'admin') {
    if (!session) {
      return <AdminLogin onSuccess={() => {}} onBack={() => setView('public')} />;
    }
    return (
      <AdminPanel
        session={session}
        onLogout={handleLogout}
        onViewSite={() => setView('public')}
      />
    );
  }

  return <PublicSite onNavigate={(p) => p === 'admin' ? setView('admin') : undefined} />;
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
