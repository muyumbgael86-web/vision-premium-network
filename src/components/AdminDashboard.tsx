import React, { useState } from 'react';
import { Shield, Users, FileText, Settings, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { VisionReport, User, Post } from '../types';

interface AdminDashboardProps {
  user: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'users' | 'stats'>('reports');
  const [reports] = useState<VisionReport[]>([]);
  const [users] = useState<User[]>([]);

  const stats = {
    totalUsers: 1247,
    totalPosts: 3842,
    totalReports: 23,
    activeUsers: 892
  };

  if (!user.isAdmin) {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 mx-auto text-zinc-600 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Accès refusé</h1>
        <p className="text-zinc-500">Vous n'avez pas les droits d'administrateur.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-zinc-500">Vision Guard Control Center</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="glass rounded-xl p-4 border border-white/10">
          <Users className="w-6 h-6 text-indigo-400 mb-2" />
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
          <p className="text-xs text-zinc-500">Utilisateurs</p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/10">
          <FileText className="w-6 h-6 text-emerald-400 mb-2" />
          <p className="text-2xl font-bold">{stats.totalPosts}</p>
          <p className="text-xs text-zinc-500">Posts</p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/10">
          <AlertTriangle className="w-6 h-6 text-amber-400 mb-2" />
          <p className="text-2xl font-bold">{stats.totalReports}</p>
          <p className="text-xs text-zinc-500">Signalements</p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/10">
          <TrendingUp className="w-6 h-6 text-rose-400 mb-2" />
          <p className="text-2xl font-bold">{stats.activeUsers}</p>
          <p className="text-xs text-zinc-500">Actifs</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {['reports', 'users', 'stats'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-indigo-600' : 'bg-white/5 hover:bg-white/10'}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'reports' && (
        <div className="glass rounded-xl border border-white/10 overflow-hidden">
          {reports.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Aucun signalement en attente</p>
            </div>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="p-4 border-b border-white/10 hover:bg-white/5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{report.reason}</p>
                    <p className="text-sm text-zinc-500">{report.postCaption?.slice(0, 100)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-emerald-600 rounded-lg"><CheckCircle className="w-4 h-4" /></button>
                    <button className="p-2 bg-rose-600 rounded-lg"><XCircle className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glass rounded-xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <input type="text" placeholder="Rechercher..." className="w-full bg-white/5 rounded-lg px-4 py-2 text-sm outline-none border border-white/10" />
          </div>
          {users.map((u) => (
            <div key={u.id} className="p-4 border-b border-white/10 hover:bg-white/5 flex items-center gap-3">
              <img src={u.avatar} className="w-10 h-10 rounded-full" alt="" />
              <div className="flex-1">
                <p className="font-medium">{u.name}</p>
                <p className="text-xs text-zinc-500">@{u.username}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${u.isVerified ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-700'}`}>{u.isVerified ? 'Vérifié' : 'Standard'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
