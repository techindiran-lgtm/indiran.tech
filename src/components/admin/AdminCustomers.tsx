import { useEffect, useState } from 'react';
import { Search, Phone, Mail, MapPin, FileText, Calendar, CreditCard, X, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SERVICE_MAP } from '@/lib/constants';
import type { Customer, ServiceRequest, Appointment, Payment, DocumentRecord } from '@/lib/types';

interface CustomerWithDetails extends Customer {
  requests?: ServiceRequest[];
  appointments?: Appointment[];
  payments?: Payment[];
  documents?: DocumentRecord[];
}

export function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CustomerWithDetails | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    const { data } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    setCustomers(data as Customer[] ?? []);
    setLoading(false);
  };

  const openCustomer = async (customer: Customer) => {
    const [reqRes, aptRes, payRes, docRes] = await Promise.all([
      supabase.from('service_requests').select('*').eq('customer_id', customer.id).order('created_at', { ascending: false }),
      supabase.from('appointments').select('*').eq('customer_id', customer.id).order('created_date', { ascending: false }),
      supabase.from('payments').select('*').eq('customer_id', customer.id).order('created_at', { ascending: false }),
      supabase.from('documents').select('*').eq('customer_id', customer.id).order('created_at', { ascending: false }),
    ]);

    setSelected({
      ...customer,
      requests: reqRes.data as ServiceRequest[] ?? [],
      appointments: aptRes.data as Appointment[] ?? [],
      payments: payRes.data as Payment[] ?? [],
      documents: docRes.data as DocumentRecord[] ?? [],
    });
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

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
        <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
        <p className="text-sm text-slate-500">{customers.length} registered customers</p>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone..."
          className="input pl-10"
        />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">Name</th>
              <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Phone</th>
              <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Email</th>
              <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Joined</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-sm text-slate-400 py-12">No customers found</td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => openCustomer(c)}>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-slate-800">{c.name}</p>
                    <p className="text-xs text-slate-500 sm:hidden">{c.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 hidden sm:table-cell">{c.phone}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 hidden md:table-cell">{c.email || '-'}</td>
                  <td className="px-4 py-3 text-sm text-slate-500 hidden lg:table-cell">
                    {new Date(c.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Customer detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl animate-slide-down">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{selected.name}</h2>
                <p className="text-sm text-slate-500">Customer Details</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Contact info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-primary-600" /> {selected.phone}
                </div>
                {selected.email && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-primary-600" /> {selected.email}
                  </div>
                )}
                {selected.address && (
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-primary-600 mt-0.5" /> {selected.address}
                  </div>
                )}
              </div>

              {/* Service Requests */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Service Requests ({selected.requests?.length ?? 0})
                </h3>
                <div className="space-y-2">
                  {selected.requests?.length === 0 ? (
                    <p className="text-xs text-slate-400">No requests</p>
                  ) : (
                    selected.requests?.map((r) => (
                      <div key={r.id} className="bg-slate-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-slate-800">{SERVICE_MAP[r.service_type]?.name ?? r.service_type}</p>
                        <p className="text-xs text-slate-500">Status: {r.status} • {new Date(r.created_at).toLocaleDateString('en-IN')}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Appointments */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Appointments ({selected.appointments?.length ?? 0})
                </h3>
                <div className="space-y-2">
                  {selected.appointments?.length === 0 ? (
                    <p className="text-xs text-slate-400">No appointments</p>
                  ) : (
                    selected.appointments?.map((a) => (
                      <div key={a.id} className="bg-slate-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-slate-800">{SERVICE_MAP[a.service_type]?.name ?? a.service_type}</p>
                        <p className="text-xs text-slate-500">{new Date(a.preferred_date).toLocaleDateString('en-IN')} at {a.preferred_time} • {a.status}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Payments */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Payments ({selected.payments?.length ?? 0})
                </h3>
                <div className="space-y-2">
                  {selected.payments?.length === 0 ? (
                    <p className="text-xs text-slate-400">No payments</p>
                  ) : (
                    selected.payments?.map((p) => (
                      <div key={p.id} className="bg-slate-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-slate-800">Rs. {Number(p.amount).toLocaleString('en-IN')}</p>
                        <p className="text-xs text-slate-500">{p.payment_status} • {p.payment_method || 'N/A'}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Documents ({selected.documents?.length ?? 0})
                </h3>
                <div className="space-y-2">
                  {selected.documents?.length === 0 ? (
                    <p className="text-xs text-slate-400">No documents</p>
                  ) : (
                    selected.documents?.map((d) => (
                      <a key={d.id} href={d.file_url} target="_blank" rel="noopener noreferrer" className="block bg-slate-50 rounded-lg p-3 hover:bg-slate-100 transition-colors">
                        <p className="text-sm font-medium text-primary-700">{d.file_name}</p>
                        <p className="text-xs text-slate-500">{d.document_type} • {new Date(d.created_at).toLocaleDateString('en-IN')}</p>
                      </a>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
