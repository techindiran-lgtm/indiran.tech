import { useEffect, useState } from 'react';
import { Search, Plus, X, Save, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS, SERVICE_MAP } from '@/lib/constants';
import type { Payment, PaymentStatus, Customer, ServiceRequest } from '@/lib/types';

interface PaymentWithDetails extends Omit<Payment, 'customer'> {
  customer?: { name: string; phone: string } | null | undefined;
  service_request?: { service_type: string } | null | undefined;
}

export function AdminPayments() {
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editPayment, setEditPayment] = useState<PaymentWithDetails | null>(null);
  const [form, setForm] = useState({ customer_id: '', service_request_id: '', amount: '', payment_status: 'pending', payment_method: '', transaction_id: '', notes: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [payRes, custRes, reqRes] = await Promise.all([
      supabase.from('payments').select('*, customer:customers(name, phone), service_request:service_requests(service_type)').order('created_at', { ascending: false }),
      supabase.from('customers').select('*').order('name'),
      supabase.from('service_requests').select('id, service_type, customer_id').order('created_at', { ascending: false }),
    ]);
    setPayments(payRes.data as PaymentWithDetails[] ?? []);
    setCustomers(custRes.data as Customer[] ?? []);
    setRequests(reqRes.data as ServiceRequest[] ?? []);
    setLoading(false);
  };

  const openAdd = () => {
    setForm({ customer_id: '', service_request_id: '', amount: '', payment_status: 'pending', payment_method: '', transaction_id: '', notes: '' });
    setEditPayment(null);
    setShowAdd(true);
  };

  const openEdit = (p: PaymentWithDetails) => {
    setForm({
      customer_id: p.customer_id || '',
      service_request_id: p.service_request_id || '',
      amount: String(p.amount),
      payment_status: p.payment_status,
      payment_method: p.payment_method || '',
      transaction_id: p.transaction_id || '',
      notes: p.notes || '',
    });
    setEditPayment(p);
    setShowAdd(true);
  };

  const save = async () => {
    if (!form.amount || !form.customer_id) return;
    const payload = {
      customer_id: form.customer_id,
      service_request_id: form.service_request_id || null,
      amount: parseFloat(form.amount),
      payment_status: form.payment_status as PaymentStatus,
      payment_method: form.payment_method,
      transaction_id: form.transaction_id,
      notes: form.notes,
    };
    if (editPayment) {
      await supabase.from('payments').update(payload).eq('id', editPayment.id);
    } else {
      await supabase.from('payments').insert(payload);
    }
    setShowAdd(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('payments').delete().eq('id', id);
    loadData();
  };

  const filtered = payments.filter((p) => {
    const matchSearch = (p.customer?.name ?? '').toLowerCase().includes(search.toLowerCase()) || (p.transaction_id ?? '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.payment_status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = payments.filter((p) => p.payment_status === 'paid').reduce((s, p) => s + Number(p.amount), 0);
  const pendingTotal = payments.filter((p) => p.payment_status === 'pending').reduce((s, p) => s + Number(p.amount), 0);

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
          <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
          <p className="text-sm text-slate-500">Track and manage payment records</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Payment
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Total Revenue</p>
          <p className="text-xl font-bold text-emerald-700">Rs. {totalRevenue.toLocaleString('en-IN')}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Pending</p>
          <p className="text-xl font-bold text-amber-700">Rs. {pendingTotal.toLocaleString('en-IN')}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Total Payments</p>
          <p className="text-xl font-bold text-slate-800">{payments.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Paid</p>
          <p className="text-xl font-bold text-slate-800">{payments.filter((p) => p.payment_status === 'paid').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer or transaction ID..."
            className="input pl-10"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-auto">
          <option value="all">All Status</option>
          {Object.entries(PAYMENT_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left text-xs font-semibold text-slate-600 uppercase px-4 py-3">Customer</th>
                <th className="text-left text-xs font-semibold text-slate-600 uppercase px-4 py-3">Amount</th>
                <th className="text-left text-xs font-semibold text-slate-600 uppercase px-4 py-3 hidden sm:table-cell">Method</th>
                <th className="text-left text-xs font-semibold text-slate-600 uppercase px-4 py-3 hidden md:table-cell">Date</th>
                <th className="text-left text-xs font-semibold text-slate-600 uppercase px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-sm text-slate-400 py-12">No payments found</td></tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => openEdit(p)}>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-800">{p.customer?.name ?? 'Unknown'}</p>
                      <p className="text-xs text-slate-400">{p.customer?.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">Rs. {Number(p.amount).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 hidden sm:table-cell">{p.payment_method || '-'}</td>
                    <td className="px-4 py-3 text-sm text-slate-500 hidden md:table-cell">{new Date(p.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${PAYMENT_STATUS_COLORS[p.payment_status]}`}>{PAYMENT_STATUS_LABELS[p.payment_status]}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }} className="text-slate-400 hover:text-error-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAdd(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">{editPayment ? 'Edit Payment' : 'Add Payment'}</h2>
              <button onClick={() => setShowAdd(false)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="label">Customer <span className="text-error-600">*</span></label>
                <select value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })} className="input">
                  <option value="">Select customer</option>
                  {customers.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                </select>
              </div>
              <div>
                <label className="label">Service Request (optional)</label>
                <select value={form.service_request_id} onChange={(e) => setForm({ ...form, service_request_id: e.target.value })} className="input">
                  <option value="">None</option>
                  {requests.filter((r) => !form.customer_id || r.customer_id === form.customer_id).map((r) => (
                    <option key={r.id} value={r.id}>{SERVICE_MAP[r.service_type]?.name ?? r.service_type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Amount (Rs.) <span className="text-error-600">*</span></label>
                <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" className="input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Status</label>
                  <select value={form.payment_status} onChange={(e) => setForm({ ...form, payment_status: e.target.value })} className="input">
                    {Object.entries(PAYMENT_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Method</label>
                  <select value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })} className="input">
                    <option value="">Select method</option>
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                    <option value="card">Card</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Transaction ID</label>
                <input type="text" value={form.transaction_id} onChange={(e) => setForm({ ...form, transaction_id: e.target.value })} placeholder="Transaction reference" className="input" />
              </div>
              <div>
                <label className="label">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="input resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={save} className="btn-primary flex-1"><Save className="w-4 h-4" /> Save</button>
                <button onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
