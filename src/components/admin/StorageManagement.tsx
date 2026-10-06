import { useState, useEffect } from 'react';
import { HardDrive, RefreshCw, AlertTriangle, Trash2, Download, X, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/shared/Toast';
import type { StorageUsage, StorageFile } from '@/lib/types';

export function StorageManagement() {
  const [storageData, setStorageData] = useState<StorageUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showLargestFiles, setShowLargestFiles] = useState(false);
  const [largestFiles, setLargestFiles] = useState<StorageFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<StorageFile | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { show } = useToast();
  const [manualUsage, setManualUsage] = useState<number>(0);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_storage_usage');
      if (error) throw error;
      
      // Group data by bucket
      const buckets = data as any[];
      const firstRow = buckets[0];
      
      const storageInfo = {
        total_bytes: firstRow.total_bytes,
        used_bytes: manualUsage > 0 ? (manualUsage / 100) * firstRow.total_bytes : firstRow.used_bytes,
        available_bytes: manualUsage > 0 ? firstRow.total_bytes - ((manualUsage / 100) * firstRow.total_bytes) : firstRow.available_bytes,
        usage_percentage: manualUsage > 0 ? manualUsage : firstRow.usage_percentage,
        total_files: firstRow.total_files,
        buckets: buckets.map((row: any) => ({
          id: row.bucket_id,
          name: row.bucket_name,
          public: row.public,
          file_size: 0, // Not available without service role
          file_count: row.bucket_file_count,
          size_bytes: 0, // Not available without service role
        })),
      };
      
      setStorageData(storageInfo);
      
      // Check if we need to create a notification
      if (storageInfo.usage_percentage >= 70) {
        await supabase.rpc('create_storage_warning_notification', {
          usage_percentage: storageInfo.usage_percentage,
        });
      }
    } catch (error) {
      console.error('Failed to load storage data:', error);
      show('Failed to load storage data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadLargestFiles = async () => {
    try {
      const { data, error } = await supabase.rpc('get_largest_files', { limit_count: 20 });
      if (error) throw error;
      setLargestFiles(data as StorageFile[]);
      setShowLargestFiles(true);
    } catch (error) {
      console.error('Failed to load largest files:', error);
      show('Failed to load largest files', 'error');
    }
  };

  const deleteFile = async (file: StorageFile) => {
    if (!confirm(`Are you sure you want to delete "${file.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(true);
      const { data, error } = await supabase.rpc('delete_storage_file', {
        file_id: file.id,
        bucket_id: file.bucket_id,
      });
      if (error) throw error;
      
      show('File deleted successfully');
      loadStorageData(); // Refresh storage data
      if (showLargestFiles) loadLargestFiles(); // Refresh file list if open
    } catch (error) {
      console.error('Failed to delete file:', error);
      show('Failed to delete file', 'error');
    } finally {
      setDeleting(false);
      setSelectedFile(null);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getUsageColor = (percentage: number): string => {
    if (percentage >= 95) return 'text-error-600 bg-error-50';
    if (percentage >= 90) return 'text-error-600 bg-error-30';
    if (percentage >= 80) return 'text-warning-600 bg-warning-30';
    if (percentage >= 70) return 'text-warning-600 bg-warning-10';
    return 'text-success-600 bg-success-10';
  };

  const getUsageIcon = (percentage: number) => {
    if (percentage >= 90) return <AlertTriangle className="w-4 h-4" />;
    return <HardDrive className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!storageData) {
    return (
      <div className="card p-6 text-center">
        <p className="text-slate-500">Failed to load storage data</p>
        <button onClick={loadStorageData} className="btn-secondary mt-4">
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900">Storage Management</h2>
          <p className="text-sm text-slate-500">Monitor and manage your Supabase storage usage</p>
        </div>
        <button onClick={() => { setRefreshing(true); loadStorageData().finally(() => setRefreshing(false)); }} disabled={refreshing} className="btn-secondary">
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Warning Banner */}
      {storageData.usage_percentage >= 70 && (
        <div className={`p-4 rounded-xl border ${getUsageColor(storageData.usage_percentage)} border-opacity-30`}>
          <div className="flex items-start gap-3">
            {getUsageIcon(storageData.usage_percentage)}
            <div className="flex-1">
              <p className="font-semibold text-sm">
                {storageData.usage_percentage >= 95 ? 'EMERGENCY: ' : storageData.usage_percentage >= 90 ? 'CRITICAL: ' : 'Warning: '}
                Storage {storageData.usage_percentage.toFixed(1)}% Used
              </p>
              <p className="text-xs mt-1">
                {storageData.usage_percentage >= 95
                  ? 'Service cannot function. Delete files immediately!'
                  : storageData.usage_percentage >= 90
                  ? 'Service disruption imminent. Delete files immediately.'
                  : storageData.usage_percentage >= 80
                  ? 'Delete unnecessary files immediately.'
                  : 'Consider cleaning up unnecessary files.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Storage Overview */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-900 mb-4">Storage Overview</h3>
        
        {/* Manual Usage Input */}
        <div className="mb-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Note:</strong> Supabase Storage doesn't expose file size data without service role keys for security.
            Enter your current storage usage from the Supabase Dashboard to see accurate calculations.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={manualUsage || ''}
              onChange={(e) => setManualUsage(parseFloat(e.target.value) || 0)}
              placeholder="Enter usage % (e.g., 25.5)"
              className="input w-48"
            />
            <button onClick={loadStorageData} className="btn-primary">
              Update Usage
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50">
            <p className="text-xs text-slate-500 mb-1">Total Storage</p>
            <p className="text-xl font-bold text-slate-900">{formatBytes(storageData.total_bytes)}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50">
            <p className="text-xs text-slate-500 mb-1">Used</p>
            <p className="text-xl font-bold text-slate-900">{formatBytes(storageData.used_bytes)}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50">
            <p className="text-xs text-slate-500 mb-1">Available</p>
            <p className="text-xl font-bold text-slate-900">{formatBytes(storageData.available_bytes)}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50">
            <p className="text-xs text-slate-500 mb-1">Total Files</p>
            <p className="text-xl font-bold text-slate-900">{storageData.total_files}</p>
          </div>
        </div>

        {/* Usage Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Usage</span>
            <span className={`text-sm font-semibold ${getUsageColor(storageData.usage_percentage)}`}>
              {storageData.usage_percentage.toFixed(1)}%
            </span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                storageData.usage_percentage >= 95 ? 'bg-error-600' :
                storageData.usage_percentage >= 90 ? 'bg-error-500' :
                storageData.usage_percentage >= 80 ? 'bg-warning-500' :
                storageData.usage_percentage >= 70 ? 'bg-warning-400' :
                'bg-primary-600'
              }`}
              style={{ width: `${Math.min(storageData.usage_percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bucket Breakdown */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-900 mb-4">Bucket Breakdown</h3>
        <div className="space-y-3">
          {storageData.buckets.map((bucket) => (
            <div key={bucket.id} className="p-4 rounded-xl bg-slate-50 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${bucket.public ? 'bg-green-500' : 'bg-slate-400'}`} />
                  <p className="font-medium text-slate-800">{bucket.name}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>{bucket.file_count} files</span>
                  <span className={bucket.public ? 'text-green-600' : 'text-slate-400'}>
                    {bucket.public ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-900 mb-4">Actions</h3>
        <div className="flex gap-3">
          <button onClick={loadLargestFiles} className="btn-secondary">
            <Eye className="w-4 h-4" /> View Largest Files
          </button>
        </div>
      </div>

      {/* Largest Files Modal */}
      {showLargestFiles && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setShowLargestFiles(false); setSelectedFile(null); }} />
          <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl p-6 animate-scale-in max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Largest Files</h3>
              <button onClick={() => { setShowLargestFiles(false); setSelectedFile(null); }} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {largestFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                      <span>{file.bucket_name}</span>
                      <span>Created: {new Date(file.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedFile(file)}
                      className="p-2 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteFile(file)}
                      disabled={deleting}
                      className="p-2 rounded-lg text-slate-400 hover:text-error-600 hover:bg-error-50"
                      title="Delete file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {largestFiles.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">No files found</p>
            )}
          </div>
        </div>
      )}

      {/* File Details Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedFile(null)} />
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">File Details</h3>
              <button onClick={() => setSelectedFile(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="label">File Name</label>
                <p className="text-sm text-slate-800">{selectedFile.name}</p>
              </div>
              <div>
                <label className="label">Bucket</label>
                <p className="text-sm text-slate-800">{selectedFile.bucket_name}</p>
              </div>
              <div>
                <label className="label">Created</label>
                <p className="text-sm text-slate-800">{new Date(selectedFile.created_at).toLocaleString()}</p>
              </div>
              <div>
                <label className="label">Last Accessed</label>
                <p className="text-sm text-slate-800">{new Date(selectedFile.last_accessed_at).toLocaleString()}</p>
              </div>
              <div>
                <label className="label">Owner</label>
                <p className="text-sm text-slate-800">{selectedFile.owner}</p>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => { setSelectedFile(null); deleteFile(selectedFile); }}
                  disabled={deleting}
                  className="btn-error flex-1"
                >
                  <Trash2 className="w-4 h-4" /> Delete File
                </button>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
