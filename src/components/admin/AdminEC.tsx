import { useEffect, useState } from 'react';
import { Search, X, Upload, Save, MapPin, FileText, Download, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { EC_STATUS_LABELS, EC_STATUS_COLORS } from '@/lib/constants';
import type { ECRequest, ECStatus } from '@/lib/types';

interface ECWithCustomer extends ECRequest {
  service_request?: { customer?: { name: string; phone: string }; form_data: Record<string, unknown> };
}

export function AdminEC() {
  const [ecRequests, setEcRequests] = useState<ECWithCustomer[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ECWithCustomer | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('ec_requests')
      .select(`
        *,
        service_request:service_requests(
          *,
          customer:customers(name, phone)
        )
      `)
      .order('created_at', { ascending: false });
    setEcRequests(data as ECWithCustomer[] ?? []);
    setLoading(false);
  };

  const openEdit = (ec: ECWithCustomer) => {
    setEditing(ec);
    setNewStatus(ec.status);
    setAdminNotes(ec.admin_notes || '');
  };

  const handleUpload = async (file: File) => {
    if (!editing) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `ec-certificates/${editing.id}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from('documents').upload(fileName, file);
    if (error) {
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName);
    setEditing({ ...editing, ec_certificate_url: urlData.publicUrl });
    setUploading(false);
  };

  const saveEdit = async () => {
    if (!editing) return;
    await supabase.from('ec_requests').update({
      status: newStatus as ECStatus,
      admin_notes: adminNotes,
      ec_certificate_url: editing.ec_certificate_url,
    }).eq('id', editing.id);

    // Also update parent service request status
    if (newStatus === 'completed') {
      await supabase.from('service_requests').update({ status: 'completed' }).eq('id', editing.service_request_id);
    } else if (newStatus === 'processing') {
      await supabase.from('service_requests').update({ status: 'processing' }).eq('id', editing.service_request_id);
    }

    setEditing(null);
    loadData();
  };

  const filtered = ecRequests.filter((ec) => {
    const name = ec.service_request?.customer?.name ?? '';
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || ec.district.toLowerCase().includes(search.toLowerCase()) || ec.village.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || ec.status === statusFilter;
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
        <h1 className="text-2xl font-bold text-slate-900">EC Management</h1>
        <p className="text-sm text-slate-500">Process Encumbrance Certificate requests and upload certificates</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, district, village..."
            className="input pl-10"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-auto">
          <option value="all">All Status</option>
          {Object.entries(EC_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-12 col-span-full">No EC requests found</p>
        ) : (
          filtered.map((ec) => (
            <div key={ec.id} className="card p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => openEdit(ec)}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-700" />
                </div>
                <span className={`badge ${EC_STATUS_COLORS[ec.status]}`}>{EC_STATUS_LABELS[ec.status]}</span>
              </div>
              <p className="font-semibold text-slate-900 text-sm mb-1">{ec.service_request?.customer?.name ?? 'Unknown'}</p>
              <p className="text-xs text-slate-500 mb-3">{ec.district} • {ec.taluk} • {ec.village}</p>
              <div className="space-y-1 text-xs text-slate-600">
                <p>Survey: {ec.survey_number} {ec.subdivision_number && `• Sub: ${ec.subdivision_number}`}</p>
                <p>Period: {new Date(ec.ec_period_from).toLocaleDateString('en-IN')} - {new Date(ec.ec_period_to).toLocaleDateString('en-IN')}</p>
              </div>
              {ec.ec_certificate_url && (
                <div className="mt-3 flex items-center gap-1 text-xs text-accent-600">
                  <CheckCircle className="w-3.5 h-3.5" /> Certificate uploaded
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">EC Request Details</h2>
              <button onClick={() => setEditing(null)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Property details */}
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Property Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-slate-500">District:</span> <span className="font-medium text-slate-800">{editing.district}</span></div>
                  <div><span className="text-slate-500">Taluk:</span> <span className="font-medium text-slate-800">{editing.taluk}</span></div>
                  <div><span className="text-slate-500">Village:</span> <span className="font-medium text-slate-800">{editing.village}</span></div>
                  <div><span className="text-slate-500">Survey No:</span> <span className="font-medium text-slate-800">{editing.survey_number}</span></div>
                  <div><span className="text-slate-500">Subdivision:</span> <span className="font-medium text-slate-800">{editing.subdivision_number || '-'}</span></div>
                  <div><span className="text-slate-500">From:</span> <span className="font-medium text-slate-800">{new Date(editing.ec_period_from).toLocaleDateString('en-IN')}</span></div>
                  <div><span className="text-slate-500">To:</span> <span className="font-medium text-slate-800">{new Date(editing.ec_period_to).toLocaleDateString('en-IN')}</span></div>
                </div>
              </div>

              {/* Certificate upload */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">EC Certificate</h3>
                {editing.ec_certificate_url ? (
                  <div className="space-y-2">
                    <a href={editing.ec_certificate_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-2 rounded-lg">
                      <Download className="w-4 h-4" /> View Certificate
                    </a>
                    <label className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">
                      Replace certificate
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 mb-2">Upload EC certificate</p>
                    <label className="btn-secondary cursor-pointer text-sm">
                      {uploading ? 'Uploading...' : 'Choose File'}
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="label">Status</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="input">
                  {Object.entries(EC_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>

              {/* Admin notes */}
              <div>
                <label className="label">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="input resize-none"
                  placeholder="Internal notes about this EC request..."
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
