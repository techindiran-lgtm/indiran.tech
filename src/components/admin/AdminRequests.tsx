import { useEffect, useState } from 'react';
import { Search, X, FileText, Phone, Calendar, Save, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  SERVICES, SERVICE_MAP,
  REQUEST_STATUS_LABELS, REQUEST_STATUS_COLORS,
  APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_COLORS,
} from '@/lib/constants';
import type { ServiceRequest, Appointment, RequestStatus, AppointmentStatus } from '@/lib/types';

type Tab = 'requests' | 'appointments';

export function AdminRequests() {
  const [tab, setTab] = useState<Tab>('requests');
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ServiceRequest | Appointment | null>(null);
  const [editType, setEditType] = useState<'request' | 'appointment'>('request');
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [reqRes, aptRes] = await Promise.all([
      supabase.from('service_requests').select('*, customer:customers(*)').order('created_at', { ascending: false }),
      supabase.from('appointments').select('*, customer:customers(*)').order('created_at', { ascending: false }),
    ]);
    setRequests(reqRes.data as ServiceRequest[] ?? []);
    setAppointments(aptRes.data as Appointment[] ?? []);
    setLoading(false);
  };

  const openEdit = (item: ServiceRequest | Appointment, type: 'request' | 'appointment') => {
    setEditing(item);
    setEditType(type);
    if (type === 'request') {
      setNewStatus((item as ServiceRequest).status);
      setAdminNotes((item as ServiceRequest).admin_notes || '');
    } else {
      setNewStatus((item as Appointment).status);
      setAdminNotes((item as Appointment).notes || '');
    }
  };

  const saveEdit = async () => {
    if (!editing) return;
    if (editType === 'request') {
      await supabase.from('service_requests').update({
        status: newStatus as RequestStatus,
        admin_notes: adminNotes,
      }).eq('id', editing.id);
    } else {
      await supabase.from('appointments').update({
        status: newStatus as AppointmentStatus,
        notes: adminNotes,
      }).eq('id', editing.id);
    }
    setEditing(null);
    loadData();
  };

  const filteredRequests = requests.filter((r) => {
    const matchSearch = (r.customer?.name ?? '').toLowerCase().includes(search.toLowerCase()) || r.service_type.includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredAppointments = appointments.filter((a) => {
    const matchSearch = (a.customer?.name ?? '').toLowerCase().includes(search.toLowerCase()) || a.service_type.includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Service Requests & Appointments</h1>
        <p className="text-sm text-slate-500">Manage all customer requests and appointments</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab('requests')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'requests' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500'}`}
        >
          Service Requests ({requests.length})
        </button>
        <button
          onClick={() => setTab('appointments')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'appointments' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500'}`}
        >
          Appointments ({appointments.length})
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer or service..."
            className="input pl-10"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-auto">
          <option value="all">All Status</option>
          {tab === 'requests' ? (
            Object.entries(REQUEST_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)
          ) : (
            Object.entries(APPOINTMENT_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)
          )}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {tab === 'requests' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase px-4 py-3">Service</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase px-4 py-3 hidden sm:table-cell">Customer</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase px-4 py-3 hidden md:table-cell">Date</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-sm text-slate-400 py-12">No requests found</td></tr>
                ) : (
                  filteredRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => openEdit(r, 'request')}>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-slate-800">{SERVICE_MAP[r.service_type]?.name ?? r.service_type}</p>
                        <p className="text-xs text-slate-400 font-tamil">{SERVICE_MAP[r.service_type]?.tamilName}</p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <p className="text-sm text-slate-700">{r.customer?.name ?? 'Unknown'}</p>
                        <p className="text-xs text-slate-400">{r.customer?.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 hidden md:table-cell">
                        {new Date(r.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${REQUEST_STATUS_COLORS[r.status]}`}>{REQUEST_STATUS_LABELS[r.status]}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-sm text-primary-600 hover:text-primary-700">View</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase px-4 py-3">Service</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase px-4 py-3 hidden sm:table-cell">Customer</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase px-4 py-3">Date & Time</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-sm text-slate-400 py-12">No appointments found</td></tr>
                ) : (
                  filteredAppointments.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => openEdit(a, 'appointment')}>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-slate-800">{SERVICE_MAP[a.service_type]?.name ?? a.service_type}</p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <p className="text-sm text-slate-700">{a.customer?.name ?? 'Unknown'}</p>
                        <p className="text-xs text-slate-400">{a.customer?.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {new Date(a.preferred_date).toLocaleDateString('en-IN')}<br />
                        <span className="text-xs text-slate-400">{a.preferred_time}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${APPOINTMENT_STATUS_COLORS[a.status]}`}>{APPOINTMENT_STATUS_LABELS[a.status]}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-sm text-primary-600 hover:text-primary-700">Edit</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editType === 'request' ? 'Service Request' : 'Appointment'} Details
                </h2>
                <p className="text-sm text-slate-500">
                  {editType === 'request' ? SERVICE_MAP[(editing as ServiceRequest).service_type]?.name : SERVICE_MAP[(editing as Appointment).service_type]?.name}
                </p>
              </div>
              <button onClick={() => setEditing(null)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Customer info */}
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <User className="w-4 h-4 text-primary-600" />
                  {(editing as ServiceRequest).customer?.name ?? 'Unknown'}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-primary-600" />
                  {(editing as ServiceRequest).customer?.phone}
                </div>
                {editType === 'appointment' && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-primary-600" />
                    {new Date((editing as Appointment).preferred_date).toLocaleDateString('en-IN')} at {(editing as Appointment).preferred_time}
                  </div>
                )}
              </div>

              {/* Form data */}
              {editType === 'request' && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Submitted Information</h3>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    {Object.entries((editing as ServiceRequest).form_data ?? {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-slate-500 capitalize">{key.replace(/_/g, ' ')}:</span>
                        <span className="text-slate-800 font-medium text-right">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status edit */}
              <div>
                <label className="label">Update Status</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="input">
                  {editType === 'request' ? (
                    Object.entries(REQUEST_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)
                  ) : (
                    Object.entries(APPOINTMENT_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)
                  )}
                </select>
              </div>

              {/* Admin notes */}
              <div>
                <label className="label">{editType === 'request' ? 'Admin Notes' : 'Notes'}</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="input resize-none"
                  placeholder="Add internal notes..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={saveEdit} className="btn-primary flex-1">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
                <button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
