import { useEffect, useState } from 'react';
import { Bell, Check, Trash2, FileText, Calendar, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Notification } from '@/lib/types';

export function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    setNotifications(data as Notification[] ?? []);
    setLoading(false);
  };

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    loadNotifications();
  };

  const markAllRead = async () => {
    await supabase.from('notifications').update({ is_read: true }).eq('is_read', false);
    loadNotifications();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
    loadNotifications();
  };

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.is_read) : notifications;
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const iconMap: Record<string, typeof FileText> = {
    new_request: FileText,
    new_appointment: Calendar,
    new_document: Upload,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500">{unreadCount} unread notifications</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-secondary">
            <Check className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'all' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500'}`}>
          All ({notifications.length})
        </button>
        <button onClick={() => setFilter('unread')} className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'unread' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500'}`}>
          Unread ({unreadCount})
        </button>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No notifications</p>
          </div>
        ) : (
          filtered.map((n) => {
            const Icon = iconMap[n.type] ?? Bell;
            return (
              <div key={n.id} className={`card p-4 flex items-start gap-3 ${!n.is_read ? 'border-primary-200 bg-primary-50/30' : ''}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${!n.is_read ? 'bg-primary-100' : 'bg-slate-100'}`}>
                  <Icon className={`w-5 h-5 ${!n.is_read ? 'text-primary-700' : 'text-slate-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{n.title}</p>
                  <p className="text-sm text-slate-600">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(n.created_at).toLocaleString('en-IN')}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {!n.is_read && (
                    <button onClick={() => markRead(n.id)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-primary-600" title="Mark as read">
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(n.id)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-error-600" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
