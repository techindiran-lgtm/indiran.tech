import { useEffect, useState } from 'react';
import { AdminLayout, type AdminPage } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminCustomers } from '@/components/admin/AdminCustomers';
import { AdminRequests } from '@/components/admin/AdminRequests';
import { AdminEC } from '@/components/admin/AdminEC';
import { AdminDocuments } from '@/components/admin/AdminDocuments';
import { AdminPayments } from '@/components/admin/AdminPayments';
import { AdminNotifications } from '@/components/admin/AdminNotifications';
import { AdminReports } from '@/components/admin/AdminReports';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import type { Notification } from '@/lib/types';

interface AdminPanelProps {
  session: Session;
  onLogout: () => void;
  onViewSite: () => void;
}

export function AdminPanel({ session, onLogout, onViewSite }: AdminPanelProps) {
  const [page, setPage] = useState<AdminPage>('dashboard');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    setNotifications(data as Notification[] ?? []);
    setNotifCount(data?.filter((n) => !n.is_read).length ?? 0);
  };

  return (
    <AdminLayout
      session={session}
      currentPage={page}
      onNavigate={setPage}
      onLogout={onLogout}
      onViewSite={onViewSite}
      notificationCount={notifCount}
    >
      {page === 'dashboard' && <AdminDashboard onNavigate={(p) => setPage(p as AdminPage)} />}
      {page === 'customers' && <AdminCustomers />}
      {page === 'requests' && <AdminRequests />}
      {page === 'ec' && <AdminEC />}
      {page === 'documents' && <AdminDocuments />}
      {page === 'payments' && <AdminPayments />}
      {page === 'notifications' && <AdminNotifications />}
      {page === 'reports' && <AdminReports />}
      {page === 'settings' && <AdminSettings />}
    </AdminLayout>
  );
}
