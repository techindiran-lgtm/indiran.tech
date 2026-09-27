import { useEffect, useState } from 'react';
import { Search, Download, Trash2, FileText, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { DocumentRecord } from '@/lib/types';

interface DocWithCustomer extends DocumentRecord {
  customer?: { name: string; phone: string } | null;
}

export function AdminDocuments() {
  const [docs, setDocs] = useState<DocWithCustomer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('documents')
      .select('*, customer:customers(name, phone)')
      .order('created_at', { ascending: false });
    setDocs(data as DocWithCustomer[] ?? []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const doc = docs.find((d) => d.id === id);
    if (doc) {
      const path = doc.file_url.split('/documents/')[1];
      if (path) await supabase.storage.from('documents').remove([path]);
      await supabase.from('documents').delete().eq('id', id);
    }
    setConfirmDelete(null);
    loadDocs();
  };

  const filtered = docs.filter(
    (d) =>
      d.file_name.toLowerCase().includes(search.toLowerCase()) ||
      (d.customer?.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      d.document_type.toLowerCase().includes(search.toLowerCase())
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
        <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
        <p className="text-sm text-slate-500">{docs.length} documents uploaded</p>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by file name, customer, or type..."
          className="input pl-10"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-12 col-span-full">No documents found</p>
        ) : (
          filtered.map((doc) => (
            <div key={doc.id} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">{doc.file_name}</p>
                  <p className="text-xs text-slate-500">{doc.document_type || 'General'}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {doc.customer?.name ?? 'Unknown'} • {new Date(doc.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex-1 !py-2 text-xs"
                >
                  <Download className="w-3.5 h-3.5" /> View
                </a>
                <button
                  onClick={() => setConfirmDelete(doc.id)}
                  className="btn-ghost !px-3 !py-2 text-error-600 hover:bg-error-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmDelete(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Delete Document?</h3>
              <button onClick={() => setConfirmDelete(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-5">This action cannot be undone. The file will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(confirmDelete)} className="btn-danger flex-1">Delete</button>
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
