import { useEffect, useState } from 'react';
import { Save, Plus, Trash2, UserPlus, X, HardDrive } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/shared/Toast';
import type { Settings as SettingsType } from '@/lib/types';
import { StorageManagement } from '@/components/admin/StorageManagement';

export function AdminSettings() {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { show } = useToast();
  const [admins, setAdmins] = useState<{ id: string; email: string; created_at: string }[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'business' | 'admins' | 'storage'>('business');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [setRes, admRes] = await Promise.all([
      supabase.from('settings').select('*').maybeSingle(),
      supabase.from('admin_users').select('*').order('created_at', { ascending: false }),
    ]);
    setSettings(setRes.data as SettingsType);
    setAdmins(admRes.data ?? []);
    setLoading(false);
  };

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('settings').update({
        business_name: settings.business_name,
        tamil_name: settings.tamil_name,
        address: settings.address,
        location: settings.location,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        email: settings.email,
        office_hours: settings.office_hours,
        about: settings.about,
      }).eq('id', settings.id);
      if (error) throw error;
      show('Settings saved successfully!');
    } catch {
      show('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addAdmin = async () => {
    if (!newAdminEmail.trim()) return;
    const { error } = await supabase.from('admin_users').insert({ email: newAdminEmail.trim() });
    if (error) {
      show(error.message.includes('duplicate') ? 'This admin already exists' : 'Failed to add admin', 'error');
      return;
    }
    setNewAdminEmail('');
    setShowAddAdmin(false);
    show('Admin added successfully');
    loadData();
  };

  const removeAdmin = async (id: string) => {
    await supabase.from('admin_users').delete().eq('id', id);
    loadData();
    show('Admin removed');
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">Manage your business information, admin users, and storage</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('business')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'business'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Business Information
        </button>
        <button
          onClick={() => setActiveTab('admins')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'admins'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Admin Users
        </button>
        <button
          onClick={() => setActiveTab('storage')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'storage'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          Storage Management
        </button>
      </div>

      {/* Business Settings Tab */}
      {activeTab === 'business' && (
        <div className="card p-6">
          <h2 className="font-bold text-slate-900 mb-4">Business Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Business Name</label>
              <input type="text" value={settings.business_name} onChange={(e) => setSettings({ ...settings, business_name: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Tamil Name</label>
              <input type="text" value={settings.tamil_name} onChange={(e) => setSettings({ ...settings, tamil_name: e.target.value })} className="input font-tamil" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Address</label>
              <textarea value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} rows={2} className="input resize-none" />
            </div>
            <div>
              <label className="label">Location</label>
              <input type="text" value={settings.location} onChange={(e) => setSettings({ ...settings, location: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Office Hours</label>
              <input type="text" value={settings.office_hours} onChange={(e) => setSettings({ ...settings, office_hours: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input type="tel" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} placeholder="Phone number" className="input" />
            </div>
            <div>
              <label className="label">WhatsApp</label>
              <input type="tel" value={settings.whatsapp} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} placeholder="WhatsApp number" className="input" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Email</label>
              <input type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} placeholder="Email address" className="input" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">About</label>
              <textarea value={settings.about} onChange={(e) => setSettings({ ...settings, about: e.target.value })} rows={4} className="input resize-none" />
            </div>
          </div>
          <button onClick={save} disabled={saving} className="btn-primary mt-4">
            {saving ? 'Saving...' : 'Save Settings'}
            {!saving && <Save className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Admin Users Tab */}
      {activeTab === 'admins' && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Admin Users</h2>
            <button onClick={() => setShowAddAdmin(true)} className="btn-secondary">
              <UserPlus className="w-4 h-4" /> Add Admin
            </button>
          </div>
          <div className="space-y-2">
            {admins.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div>
                  <p className="text-sm font-medium text-slate-800">{admin.email}</p>
                  <p className="text-xs text-slate-400">Added {new Date(admin.created_at).toLocaleDateString('en-IN')}</p>
                </div>
                <button onClick={() => removeAdmin(admin.id)} className="p-2 rounded-lg text-slate-400 hover:bg-error-50 hover:text-error-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {admins.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No admin users</p>}
          </div>
        </div>
      )}

      {/* Storage Management Tab */}
      {activeTab === 'storage' && <StorageManagement />}

      {/* Add admin modal */}
      {showAddAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddAdmin(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Add Admin User</h3>
              <button onClick={() => setShowAddAdmin(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-4">The user must first sign up with this email in Supabase Auth, then their email is added here to grant admin access.</p>
            <div className="space-y-3">
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="admin@example.com"
                className="input"
                autoFocus
              />
              <div className="flex gap-3">
                <button onClick={addAdmin} className="btn-primary flex-1">
                  <Plus className="w-4 h-4" /> Add
                </button>
                <button onClick={() => setShowAddAdmin(false)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
