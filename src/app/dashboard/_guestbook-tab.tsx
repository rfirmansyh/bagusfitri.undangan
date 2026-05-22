'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { createGuestbookValidation } from '@/src/validations/app.validation';
import type { TApiResponse, TBulkImportResult, TGuestbook, TPaginatedResult } from '@/src/types/app.types';
import type { TCreateGuestbookForm } from '@/src/validations/app.validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { BookOpen, Copy, Check, Trash2, Upload, Plus, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(label ? `${label} disalin!` : 'Disalin!');
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400" title="Salin">
      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

export default function GuestbookTab({ password }: { password: string }) {
  const [guestbooks, setGuestbooks] = useState<TGuestbook[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<TCreateGuestbookForm>({
    resolver: yupResolver(createGuestbookValidation),
    defaultValues: { name: '' },
  });

  const fetchGuestbooks = useCallback(async (pg: number, q?: string) => {
    const params = new URLSearchParams({ password, page: String(pg) });
    if (q) params.set('search', q);
    const res = await fetch(`/api/admin/guestbooks?${params}`);
    const json: TApiResponse<TPaginatedResult<TGuestbook>> = await res.json();
    if (json.success && json.data) {
      setGuestbooks(json.data.data);
      setPage(json.data.page);
      setTotalPages(json.data.totalPages);
      setTotal(json.data.total);
    }
  }, [password]);

  useEffect(() => { 
    fetchGuestbooks(1); 
  }, [fetchGuestbooks]);

  useEffect(() => {
    // Clear selection when page or search changes
    setSelectedIds(new Set());
  }, [guestbooks]);

  const handleSearch = () => fetchGuestbooks(1, search);

  const onSubmit = async (data: TCreateGuestbookForm) => {
    const res = await fetch('/api/admin/guestbooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, name: data.name }),
    });
    const json: TApiResponse<TGuestbook> = await res.json();
    if (!json.success) { toast.error(json.error ?? 'Gagal menambahkan tamu.'); return; }
    toast.success('Tamu berhasil ditambahkan!');
    reset();
    setShowForm(false);
    fetchGuestbooks(page, search);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus tamu ini?')) return;
    await fetch('/api/admin/guestbooks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, id }),
    });
    fetchGuestbooks(page, search);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Hapus ${selectedIds.size} tamu yang dipilih?`)) return;
    
    await fetch('/api/admin/guestbooks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, ids: Array.from(selectedIds) }),
    });
    setSelectedIds(new Set());
    fetchGuestbooks(page, search);
  };

  const handleDeleteAll = async () => {
    if (!confirm('PERINGATAN: Hapus SEMUA data tamu? Aksi ini tidak dapat dibatalkan.')) return;
    
    await fetch('/api/admin/guestbooks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, deleteAll: true }),
    });
    setSelectedIds(new Set());
    fetchGuestbooks(1, '');
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(guestbooks.map(g => g.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelectRow = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds);
    if (checked) newSet.add(id);
    else newSet.delete(id);
    setSelectedIds(newSet);
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

      // Extract names from any column that looks like a name
      const names: string[] = [];
      for (const row of rows) {
        const vals = Object.values(row);
        // Try to find a string column (skip numbers like "no")
        for (const v of vals) {
          if (typeof v === 'string' && v.trim() && isNaN(Number(v))) {
            names.push(v.trim());
            break;
          }
        }
      }

      if (names.length === 0) {
        toast.error('Tidak ditemukan data nama di file.');
        return;
      }

      const res = await fetch('/api/admin/guestbooks/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, names }),
      });
      const json: TApiResponse<TBulkImportResult> = await res.json();
      if (!json.success) { toast.error(json.error ?? 'Gagal import.'); return; }
      const r = json.data!;
      toast.success(`Import selesai: ${r.imported} berhasil, ${r.skipped} duplikat dilewati.`);
      if (r.errors.length > 0) toast.warning(`${r.errors.length} error: ${r.errors[0]}`);
      fetchGuestbooks(1, search);
    } catch {
      toast.error('Gagal membaca file XLSX.');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 font-semibold text-white">
          <BookOpen className="h-4 w-4 text-cyan-400" /> Daftar Tamu ({total})
        </h2>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-1">
            <Input
              placeholder="Cari nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="h-8 w-40 border-white/10 bg-white/5 text-xs text-white placeholder:text-slate-500"
            />
            <Button size="sm" variant="outline" onClick={handleSearch} className="border-white/10 bg-transparent text-xs text-slate-300 hover:bg-white/10">
              <Search className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Button size="sm" onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-xs text-white">
            <Plus className="mr-1 h-3.5 w-3.5" /> Tambah
          </Button>
          <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={importing} className="border-white/10 bg-transparent text-xs text-slate-300 hover:bg-white/10">
            <Upload className="mr-1 h-3.5 w-3.5" /> {importing ? 'Mengimpor...' : 'Import XLSX'}
          </Button>
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileImport} />
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 bg-white/5">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-white/20 bg-black/20 text-emerald-500"
            checked={guestbooks.length > 0 && selectedIds.size === guestbooks.length}
            onChange={(e) => toggleSelectAll(e.target.checked)}
          />
          <span className="text-xs text-slate-300">
            {selectedIds.size} dipilih
          </span>
        </div>
        <div className="flex gap-2">
          {selectedIds.size > 0 && (
            <Button size="sm" variant="outline" onClick={handleBulkDelete} className="border-red-500/30 bg-red-500/10 text-xs text-red-400 hover:bg-red-500/20 hover:text-red-300">
              <Trash2 className="mr-1 h-3.5 w-3.5" /> Hapus Terpilih
            </Button>
          )}
          {total > 0 && (
            <Button size="sm" variant="outline" onClick={handleDeleteAll} className="border-red-500/50 bg-red-500/20 text-xs text-red-400 hover:bg-red-500/30 hover:text-red-300">
              <Trash2 className="mr-1 h-3.5 w-3.5" /> Hapus Semua
            </Button>
          )}
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-start gap-2 border-b border-white/10 px-5 py-3">
          <div className="flex-1">
            <Input {...register('name')} placeholder="Nama tamu baru" className="border-white/10 bg-white/5 text-sm text-white placeholder:text-slate-500" />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <Button type="submit" size="sm" disabled={isSubmitting} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-xs text-white">
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </form>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-left text-xs text-slate-400">
              <th className="px-5 py-3 w-10"></th>
              <th className="px-5 py-3">Nama</th>
              <th className="px-5 py-3">Link Undangan</th>
              <th className="px-5 py-3">Chat Template</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {guestbooks.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-500">Belum ada data tamu.</td></tr>
            )}
            {guestbooks.map((g) => (
              <tr key={g.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.03]">
                <td className="px-5 py-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-black/20 text-emerald-500"
                    checked={selectedIds.has(g.id)}
                    onChange={(e) => toggleSelectRow(g.id, e.target.checked)}
                  />
                </td>
                <td className="px-5 py-3 font-medium text-white">{g.name}</td>
                <td className="max-w-[200px] px-5 py-3">
                  <div className="flex items-center gap-1">
                    <span className="truncate text-xs text-cyan-400">{g.link}</span>
                    <CopyButton value={g.link} label="Link" />
                  </div>
                </td>
                <td className="max-w-[200px] px-5 py-3">
                  <div className="flex items-center gap-1">
                    <span className="truncate text-xs text-slate-300">{g.chatTemplate.slice(0, 50)}...</span>
                    <CopyButton value={g.chatTemplate} label="Chat template" />
                  </div>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => handleDelete(g.id)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/10 px-5 py-3">
          <span className="text-xs text-slate-400">Halaman {page} dari {totalPages}</span>
          <div className="flex gap-1.5">
            <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => fetchGuestbooks(page - 1, search)} className="border-white/10 bg-transparent text-xs text-slate-300 hover:bg-white/10">Prev</Button>
            <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => fetchGuestbooks(page + 1, search)} className="border-white/10 bg-transparent text-xs text-slate-300 hover:bg-white/10">Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
