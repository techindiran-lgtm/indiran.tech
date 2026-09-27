import { useEffect, useState } from 'react';
import {
  FileText, Users, Calendar, CreditCard, TrendingUp,
  Clock, CheckCircle, AlertCircle, ArrowRight,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SERVICE_MAP, REQUEST_STATUS_LABELS, REQUEST_STATUS_COLORS } from '@/lib/constants';
import type { ServiceRequest, Appointment } from '@/lib/types';

interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  totalCustomers: number;
  totalAppointments: number;
  pendingAppointments: number;
  totalRevenue: number;
  pendingPayments: number;
}

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0, pendingRequests: 0, completedRequests: 0,
    totalCustomers: 0, totalAppointments: 0, pendingAppointments: 0,
    totalRevenue: 0, pendingPayments: 0,
  });
  const [recentRequests, setRecentRequests] = useState<ServiceRequest[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [reqRes, custRes, aptRes, payRes, recentRes, aptUpcoming] = await Promise.all([
        supabase.from('service_requests').select('*'),
        supabase.from('customers').select('id', { count: 'exact', head: true }),
        supabase.from('appointments').select('*'),
        supabase.from('payments').select('*'),
        supabase.from('service_requests').select('*, customer:customers(*)').order('created_at', { ascending: false }).limit(5),
        supabase.from('appointments').select('*, customer:customers(*)').order('preferred_date', { ascending: true }).limit(5),
      ]);

      const requests = reqRes.data ?? [];
      const appointments = aptRes.data ?? [];
      const payments = payRes.data ?? [];

      setStats({
        totalRequests: requests.length,
        pendingRequests: requests.filter((r) => r.status === 'pending' || r.status === 'in_review' || r.status === 'processing').length,
        completedRequests: requests.filter((r) => r.status === 'completed').length,
        totalCustomers: custRes.count ?? 0,
        totalAppointments: appointments.length,
        pendingAppointments: appointments.filter((a) => a.status === 'pending').length,
        totalRevenue: payments.filter((p) => p.payment_status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0),
        pendingPayments: payments.filter((p) => p.payment_status === 'pending').length,
      });

      setRecentRequests(recentRes.data as ServiceRequest[] ?? []);
      setUpcomingAppointments(aptUpcoming.data as Appointment[] ?? []);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Requests', value: stats.totalRequests, icon: FileText, color: 'primary', sub: `${stats.pendingRequests} pending` },
    { label: 'Customers', value: stats.totalCustomers, icon: Users, color: 'accent', sub: 'Registered' },
    { label: 'Appointments', value: stats.totalAppointments, icon: Calendar, color: 'secondary', sub: `${stats.pendingAppointments} pending` },
    { label: 'Revenue', value: `Rs. ${stats.totalRevenue.toLocaleString('en-IN')}`, icon: CreditCard, color: 'success', sub: `${stats.pendingPayments} pending payments` },
  ];

  const colorMap: Record<string, string> = {
    primary: 'bg-primary-50 text-primary-700',
    accent: 'bg-accent-50 text-accent-700',
    secondary: 'bg-secondary-50 text-secondary-700',
    success: 'bg-success-50 text-success-700',
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
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of your office operations</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card p-5 hover:shadow-card-hover transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${idx * 60}ms` }}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorMap[card.color]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <TrendingUp className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{card.value}</p>
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent requests */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Recent Service Requests</h2>
            <button onClick={() => onNavigate('requests')} className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            {recentRequests.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No requests yet</p>
            ) : (
              recentRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {SERVICE_MAP[req.service_type]?.name ?? req.service_type}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {req.customer?.name ?? 'Unknown'} • {new Date(req.created_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <span className={`badge ${REQUEST_STATUS_COLORS[req.status]} flex-shrink-0 ml-2`}>
                    {REQUEST_STATUS_LABELS[req.status]}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming appointments */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Upcoming Appointments</h2>
            <button onClick={() => onNavigate('requests')} className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            {upcomingAppointments.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No appointments scheduled</p>
            ) : (
              upcomingAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {SERVICE_MAP[apt.service_type]?.name ?? apt.service_type}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(apt.preferred_date).toLocaleDateString('en-IN')} • {apt.preferred_time}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{apt.customer?.name}</p>
                  </div>
                  {apt.status === 'pending' ? (
                    <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 ml-2" />
                  ) : apt.status === 'confirmed' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 ml-2" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
