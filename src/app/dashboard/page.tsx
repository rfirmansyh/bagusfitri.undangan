'use client';

import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { adminLoginValidation } from '@/src/validations/app.validation';
import type {
  TAdminRsvp,
  TAdminWish,
  TApiResponse,
  TDashboardStats,
  TPaginatedResult,
} from '@/src/types/app.types';
import { yupResolver } from '@hookform/resolvers/yup';
import { Eye, EyeOff, LogOut, Trash2, Users, MessageSquare, BarChart3 } from 'lucide-react';
import { useForm } from 'react-hook-form';

// ─── Helpers ────────────────────────────────────────────────────
function formatDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

// ─── Login Form ─────────────────────────────────────────────────
function LoginForm({ onLogin }: { onLogin: (pw: string) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: yupResolver(adminLoginValidation),
    defaultValues: { password: '' },
  });

  const onSubmit = async (data: { password: string }) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: data.password }),
      });
      const json: TApiResponse = await res.json();
      if (!json.success) {
        setError('password', { message: json.error ?? 'Password salah' });
        return;
      }
      onLogin(data.password);
    } catch {
      setError('password', { message: 'Gagal terhubung ke server.' });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20">
            <BarChart3 className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-white">Dashboard Admin</h1>
          <p className="mt-1 text-sm text-slate-400">Masukkan password untuk melanjutkan</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register('password')}
              type="password"
              placeholder="Password"
              className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 font-medium text-white hover:from-emerald-600 hover:to-teal-600"
          >
            {isSubmitting ? 'Memverifikasi...' : 'Masuk'}
          </Button>
        </form>
      </div>
    </div>
  );
}

// ─── Stats Cards ────────────────────────────────────────────────
function StatsCards({ stats }: { stats: TDashboardStats | null }) {
  const cards = [
    {
      label: 'Total RSVP',
      value: stats?.totalRsvps ?? '-',
      icon: Users,
      gradient: 'from-blue-500 to-indigo-500',
      shadow: 'shadow-blue-500/20',
    },
    {
      label: 'Total Tamu Hadir',
      value: stats?.totalGuests ?? '-',
      icon: Users,
      gradient: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/20',
    },
    {
      label: 'Total Ucapan',
      value: stats?.totalWishes ?? '-',
      icon: MessageSquare,
      gradient: 'from-purple-500 to-pink-500',
      shadow: 'shadow-purple-500/20',
    },
    {
      label: 'Ucapan Publik',
      value: stats?.totalVisibleWishes ?? '-',
      icon: Eye,
      gradient: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all hover:bg-white/[0.08]"
        >
          <div className={`mb-3 inline-flex rounded-lg bg-gradient-to-r ${card.gradient} p-2.5 ${card.shadow} shadow-lg`}>
            <card.icon className="h-5 w-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-white">{card.value}</p>
          <p className="mt-0.5 text-xs text-slate-400">{card.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── RSVP Table ─────────────────────────────────────────────────
function RsvpTable({
  data,
  onDelete,
  page,
  totalPages,
  onPageChange,
}: {
  data: TAdminRsvp[];
  onDelete: (id: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <h2 className="flex items-center gap-2 font-semibold text-white">
          <Users className="h-4 w-4 text-blue-400" /> Data RSVP
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-left text-xs text-slate-400">
              <th className="px-5 py-3">Nama</th>
              <th className="px-5 py-3">Tamu</th>
              <th className="px-5 py-3">Tanggal</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-slate-500">
                  Belum ada data RSVP.
                </td>
              </tr>
            )}
            {data.map((rsvp) => (
              <tr key={rsvp.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.03]">
                <td className="px-5 py-3 font-medium text-white">{rsvp.name}</td>
                <td className="px-5 py-3 text-slate-300">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${rsvp.guests > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {rsvp.guests > 0 ? `${rsvp.guests} orang` : 'Tidak hadir'}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-400">{formatDate(rsvp.createdAt)}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => onDelete(rsvp.id)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/10 px-5 py-3">
          <span className="text-xs text-slate-400">Halaman {page} dari {totalPages}</span>
          <div className="flex gap-1.5">
            <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="border-white/10 bg-transparent text-xs text-slate-300 hover:bg-white/10">Prev</Button>
            <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="border-white/10 bg-transparent text-xs text-slate-300 hover:bg-white/10">Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Wishes Table ───────────────────────────────────────────────
function WishesTable({
  data,
  onDelete,
  onToggle,
  page,
  totalPages,
  onPageChange,
}: {
  data: TAdminWish[];
  onDelete: (id: string) => void;
  onToggle: (id: string, hidden: boolean) => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <h2 className="flex items-center gap-2 font-semibold text-white">
          <MessageSquare className="h-4 w-4 text-purple-400" /> Data Ucapan
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-left text-xs text-slate-400">
              <th className="px-5 py-3">Nama</th>
              <th className="px-5 py-3">Ucapan</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Tanggal</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                  Belum ada ucapan.
                </td>
              </tr>
            )}
            {data.map((wish) => (
              <tr key={wish.id} className={`border-b border-white/5 transition-colors hover:bg-white/[0.03] ${wish.hiddenAt ? 'opacity-50' : ''}`}>
                <td className="px-5 py-3 font-medium text-white">{wish.name}</td>
                <td className="max-w-xs truncate px-5 py-3 text-slate-300">{wish.message}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${wish.hiddenAt ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {wish.hiddenAt ? 'Disembunyikan' : 'Publik'}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-400">{formatDate(wish.createdAt)}</td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onToggle(wish.id, !wish.hiddenAt)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-amber-500/10 hover:text-amber-400" title={wish.hiddenAt ? 'Tampilkan' : 'Sembunyikan'}>
                      {wish.hiddenAt ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button onClick={() => onDelete(wish.id)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/10 px-5 py-3">
          <span className="text-xs text-slate-400">Halaman {page} dari {totalPages}</span>
          <div className="flex gap-1.5">
            <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="border-white/10 bg-transparent text-xs text-slate-300 hover:bg-white/10">Prev</Button>
            <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="border-white/10 bg-transparent text-xs text-slate-300 hover:bg-white/10">Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard Page ────────────────────────────────────────
export default function DashboardPage() {
  const [password, setPassword] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'rsvps' | 'wishes'>('rsvps');
  const [stats, setStats] = useState<TDashboardStats | null>(null);
  const [rsvps, setRsvps] = useState<TAdminRsvp[]>([]);
  const [rsvpPage, setRsvpPage] = useState(1);
  const [rsvpTotalPages, setRsvpTotalPages] = useState(1);
  const [wishes, setWishes] = useState<TAdminWish[]>([]);
  const [wishPage, setWishPage] = useState(1);
  const [wishTotalPages, setWishTotalPages] = useState(1);

  const fetchStats = useCallback(async (pw: string) => {
    const res = await fetch(`/api/admin/stats?password=${encodeURIComponent(pw)}`);
    const json: TApiResponse<TDashboardStats> = await res.json();
    if (json.success && json.data) setStats(json.data);
  }, []);

  const fetchRsvps = useCallback(async (pw: string, page: number) => {
    const res = await fetch(`/api/admin/rsvps?password=${encodeURIComponent(pw)}&page=${page}`);
    const json: TApiResponse<TPaginatedResult<TAdminRsvp>> = await res.json();
    if (json.success && json.data) {
      setRsvps(json.data.data);
      setRsvpPage(json.data.page);
      setRsvpTotalPages(json.data.totalPages);
    }
  }, []);

  const fetchWishes = useCallback(async (pw: string, page: number) => {
    const res = await fetch(`/api/admin/wishes?password=${encodeURIComponent(pw)}&page=${page}`);
    const json: TApiResponse<TPaginatedResult<TAdminWish>> = await res.json();
    if (json.success && json.data) {
      setWishes(json.data.data);
      setWishPage(json.data.page);
      setWishTotalPages(json.data.totalPages);
    }
  }, []);

  useEffect(() => {
    if (!password) return;
    fetchStats(password);
    fetchRsvps(password, 1);
    fetchWishes(password, 1);
  }, [password, fetchStats, fetchRsvps, fetchWishes]);

  const handleDeleteRsvp = async (id: string) => {
    if (!password || !confirm('Hapus RSVP ini?')) return;
    await fetch('/api/admin/rsvps', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, id }),
    });
    fetchRsvps(password, rsvpPage);
    fetchStats(password);
  };

  const handleDeleteWish = async (id: string) => {
    if (!password || !confirm('Hapus ucapan ini?')) return;
    await fetch('/api/admin/wishes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, id }),
    });
    fetchWishes(password, wishPage);
    fetchStats(password);
  };

  const handleToggleWish = async (id: string, hidden: boolean) => {
    if (!password) return;
    await fetch('/api/admin/wishes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, id, hidden }),
    });
    fetchWishes(password, wishPage);
    fetchStats(password);
  };

  if (!password) {
    return <LoginForm onLogin={setPassword} />;
  }

  const tabs = [
    { key: 'rsvps' as const, label: 'RSVP', icon: Users },
    { key: 'wishes' as const, label: 'Ucapan', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-white">Dashboard</h1>
          </div>
          <Button size="sm" variant="outline" onClick={() => setPassword(null)} className="border-white/10 bg-transparent text-xs text-slate-300 hover:bg-white/10">
            <LogOut className="mr-1.5 h-3.5 w-3.5" /> Keluar
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        <StatsCards stats={stats} />

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="h-4 w-4" /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'rsvps' && (
          <RsvpTable
            data={rsvps}
            onDelete={handleDeleteRsvp}
            page={rsvpPage}
            totalPages={rsvpTotalPages}
            onPageChange={(p) => password && fetchRsvps(password, p)}
          />
        )}

        {activeTab === 'wishes' && (
          <WishesTable
            data={wishes}
            onDelete={handleDeleteWish}
            onToggle={handleToggleWish}
            page={wishPage}
            totalPages={wishTotalPages}
            onPageChange={(p) => password && fetchWishes(password, p)}
          />
        )}
      </main>
    </div>
  );
}
