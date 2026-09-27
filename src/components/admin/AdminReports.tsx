import { useEffect, useState } from 'react';
import { FileText, Users, Calendar, CreditCard, TrendingUp, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SERVICES, SERVICE_MAP, REQUEST_STATUS_LABELS } from '@/lib/constants';
import type { ServiceRequest, Payment, Appointment } from '@/lib/types';

export function AdminReports() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [reqRes, payRes, aptRes] = await Promise.all([
      supabase.from('service_requests').select('*'),
      supabase.from('payments').select('*'),
      supabase.from('appointments').select('*'),
    ]);
    setRequests(reqRes.data as ServiceRequest[] ?? []);
    setPayments(payRes.data as Payment[] ?? []);
    setAppointments(aptRes.data as Appointment[] ?? []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Service breakdown
  const serviceBreakdown = SERVICES.map((s) => {
    const count = requests.filter((r) => r.service_type === s.key).length;
    const completed = requests.filter((r) => r.service_type === s.key && r.status === 'completed').length;
    const revenue = payments
      .filter((p) => p.payment_status === 'paid')
      .filter((p) => {
        const req = requests.find((r) => r.id === p.service_request_id);
        return req?.service_type === s.key;
      })
      .reduce((sum, p) => sum + Number(p.amount), 0);
    return { ...s, count, completed, revenue };
  });

  // Status breakdown
  const statusBreakdown = Object.entries(REQUEST_STATUS_LABELS).map(([key, label]) => ({
    key,
    label,
    count: requests.filter((r) => r.status === key).length,
  }));

  const totalRevenue = payments.filter((p) => p.payment_status === 'paid').reduce((s, p) => s + Number(p.amount), 0);
  const maxServiceCount = Math.max(...serviceBreakdown.map((s) => s.count), 1);

  // Monthly trend (last 6 months)
  const months: { label: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-IN', { month: 'short' });
    const count = requests.filter((r) => r.created_at.startsWith(monthKey)).length;
    months.push({ label, count });
  }
  const maxMonthCount = Math.max(...months.map((m) => m.count), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
        <p className="text-sm text-slate-500">Business performance overview</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center mb-3">
            <FileText className="w-5 h-5 text-primary-700" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{requests.length}</p>
          <p className="text-sm text-slate-500">Total Requests</p>
        </div>
        <div className="card p-5">
          <div className="w-11 h-11 rounded-lg bg-accent-50 flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-accent-700" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{appointments.length}</p>
          <p className="text-sm text-slate-500">Appointments</p>
        </div>
        <div className="card p-5">
          <div className="w-11 h-11 rounded-lg bg-success-50 flex items-center justify-center mb-3">
            <CreditCard className="w-5 h-5 text-success-700" />
          </div>
          <p className="text-2xl font-bold text-slate-900">Rs. {totalRevenue.toLocaleString('en-IN')}</p>
          <p className="text-sm text-slate-500">Total Revenue</p>
        </div>
        <div className="card p-5">
          <div className="w-11 h-11 rounded-lg bg-secondary-50 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-secondary-700" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {requests.length > 0 ? Math.round((requests.filter((r) => r.status === 'completed').length / requests.length) * 100) : 0}%
          </p>
          <p className="text-sm text-slate-500">Completion Rate</p>
        </div>
      </div>

      {/* Service breakdown */}
      <div className="card p-5">
        <h2 className="font-bold text-slate-900 mb-4">Service Breakdown</h2>
        <div className="space-y-3">
          {serviceBreakdown.map((s) => (
            <div key={s.key} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{s.name}</span>
                <span className="text-slate-500">{s.count} requests • Rs. {s.revenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-500"
                  style={{ width: `${(s.count / maxServiceCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly trend */}
        <div className="card p-5">
          <h2 className="font-bold text-slate-900 mb-4">Monthly Request Trend</h2>
          <div className="flex items-end justify-between gap-2 h-40">
            {months.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-full">
                  <div
                    className="w-full max-w-[40px] bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-md transition-all duration-500"
                    style={{ height: `${(m.count / maxMonthCount) * 100}%`, minHeight: '4px' }}
                    title={`${m.count} requests`}
                  />
                </div>
                <span className="text-xs text-slate-500">{m.label}</span>
                <span className="text-xs font-semibold text-slate-700">{m.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status breakdown */}
        <div className="card p-5">
          <h2 className="font-bold text-slate-900 mb-4">Request Status Breakdown</h2>
          <div className="space-y-3">
            {statusBreakdown.map((s) => (
              <div key={s.key} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <span className="text-sm font-medium text-slate-700">{s.label}</span>
                <span className="text-lg font-bold text-slate-900">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
