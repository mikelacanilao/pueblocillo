'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  BarChart3, 
  FileText, 
  Map, 
  Database, 
  UserCheck, 
  ShieldCheck, 
  PhoneCall, 
  ChevronRight,
  Sparkles,
  ClipboardList,
  Sun,
  Moon,
  LogIn,
  LogOut,
  ShieldAlert,
  User
} from 'lucide-react';
import { HouseholdCensusRecord, VillageSettings, UserAccount } from '@/types/census';
import { CensusEncoderForm } from '@/components/census/CensusEncoderForm';
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';
import { VillagePlanViewer } from '@/components/map/VillagePlanViewer';
import { VillageNotices } from '@/components/portal/VillageNotices';
import { LoginPage } from '@/components/auth/LoginPage';
import { SecurityAuditPanel } from '@/components/security/SecurityAuditPanel';
import { 
  loadStoredRecords, 
  saveStoredRecords, 
  loadStoredSettings, 
  loadActiveUser, 
  saveActiveUser 
} from '@/lib/storage';
import { getStoredAuthSession, saveAuthSession, clearAuthSession } from '@/lib/auth';
import { SUPABASE_SQL_SCHEMA } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'portal' | 'dashboard' | 'encode' | 'map' | 'security' | 'supabase' | 'login'>('portal');
  const [records, setRecords] = useState<HouseholdCensusRecord[]>([]);
  const [settings, setSettings] = useState<VillageSettings>({
    villageName: 'Pueblocillo Village (Brgy. Langkaan, Dasmariñas, Cavite)',
    totalLotsBaseline: 480,
    subdivisionCode: 'PUEBLOCILLO-NDC',
    location: 'Brgy. Langkaan II, Dasmariñas City, Cavite'
  });
  
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [editingRecord, setEditingRecord] = useState<HouseholdCensusRecord | null>(null);
  const [showSqlCopied, setShowSqlCopied] = useState<boolean>(false);

  // Initialize data on client mount
  useEffect(() => {
    setRecords(loadStoredRecords());
    setSettings(loadStoredSettings());
    const sessionUser = getStoredAuthSession();
    if (sessionUser) {
      setCurrentUser(sessionUser);
    }
  }, []);

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    saveAuthSession(user);
    saveActiveUser(user.name);
    // Direct user based on role
    if (user.role === 'admin' || user.role === 'encoder1' || user.role === 'encoder2') {
      setActiveTab('encode');
    } else {
      setActiveTab('portal');
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    setCurrentUser(null);
    setActiveTab('portal');
  };

  const handleSaveRecord = (newRecord: HouseholdCensusRecord) => {
    let updated: HouseholdCensusRecord[];
    const exists = records.some((r) => r.id === newRecord.id);
    if (exists) {
      updated = records.map((r) => (r.id === newRecord.id ? newRecord : r));
    } else {
      updated = [newRecord, ...records];
    }
    setRecords(updated);
    saveStoredRecords(updated);
    setEditingRecord(null);
  };

  const handleDeleteRecord = (recordId: string) => {
    if (!currentUser?.canDelete) {
      alert('Access Denied: Only HOA Administrators are authorized to delete census records.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this census record?')) {
      const updated = records.filter((r) => r.id !== recordId);
      setRecords(updated);
      saveStoredRecords(updated);
    }
  };

  const handleStartEdit = (record: HouseholdCensusRecord) => {
    setEditingRecord(record);
    setActiveTab('encode');
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setShowSqlCopied(true);
    setTimeout(() => setShowSqlCopied(false), 3000);
  };

  // Quick summary counts
  const totalLotsBaseline = settings.totalLotsBaseline || 480;
  const totalEncoded = records.length;
  const activeHouseholds = records.filter((r) => r.occupancyType === 'owner' || r.occupancyType === 'renter').length;
  const completionRate = Math.min(100, Math.round((totalEncoded / totalLotsBaseline) * 100));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
              PV
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight leading-none">
                Pueblocillo Village
              </h1>
              <p className="text-[11px] font-medium text-emerald-800 dark:text-emerald-400 mt-0.5">
                Community Portal &amp; Census System (Blocks 1–23)
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('portal')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'portal'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Public Portal
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Analytics Dashboard
            </button>
            <button
              onClick={() => setActiveTab('encode')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'encode'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Field Encoder
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'map'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Blueprint Map
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'security'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Security Audit
            </button>
            <button
              onClick={() => setActiveTab('supabase')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'supabase'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Supabase SQL
            </button>
          </nav>

          {/* Right Controls: Theme Toggle & User Auth */}
          <div className="flex items-center gap-2">
            {/* Dark/Light Mode Button */}
            <button
              type="button"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Auth Button / User Profile */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{currentUser.name}</div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400">{currentUser.badge}</div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Officer Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('portal')}
            className={`px-2 py-1 rounded-lg ${activeTab === 'portal' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-500'}`}
          >
            Portal
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2 py-1 rounded-lg ${activeTab === 'dashboard' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-500'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('encode')}
            className={`px-2 py-1 rounded-lg ${activeTab === 'encode' ? 'bg-emerald-700 text-white' : 'text-slate-500'}`}
          >
            Encoder
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-2 py-1 rounded-lg ${activeTab === 'map' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-500'}`}
          >
            Map
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-2 py-1 rounded-lg ${activeTab === 'security' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-500'}`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`px-2 py-1 rounded-lg ${activeTab === 'login' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-500'}`}
          >
            {currentUser ? 'Profile' : 'Login'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Tab: Login Page */}
        {activeTab === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => setActiveTab('portal')}
          />
        )}

        {/* Tab 1: Portal Landing */}
        {activeTab === 'portal' && (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="relative rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-10 shadow-lg overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-bold tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Phase 1 Community Census Underway</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  Welcome to the Pueblocillo Village Community Portal
                </h2>
                <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
                  Building a modern, transparent community record for Blocks 1 through 23 in Brgy. Langkaan, Dasmariñas. Door-to-door encoding ensures accurate lot tenure, resident security, and disaster readiness.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveTab('encode')}
                    className="px-5 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs sm:text-sm hover:bg-emerald-50 shadow-sm transition flex items-center gap-2"
                  >
                    <ClipboardList className="w-4 h-4 text-emerald-700" />
                    <span>Open Field Census Encoder</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="px-5 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700/80 border border-emerald-600/50 text-white font-semibold text-xs sm:text-sm transition flex items-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4 text-emerald-200" />
                    <span>View Analytics Dashboard</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className="px-4 py-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-900/60 border border-white/10 text-white font-semibold text-xs sm:text-sm transition flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>Security Audit</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Live Snapshot Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Total Mapped Lots</span>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{totalLotsBaseline}</div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">Blocks 1 to 23</div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Completed Records</span>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{totalEncoded}</div>
                <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">{completionRate}% baseline reached</div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Active Occupancy</span>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{activeHouseholds}</div>
                <div className="text-[11px] text-teal-700 dark:text-teal-400 mt-1">Owners &amp; Renters</div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Subdivision Plan</span>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">23 Blocks</div>
                <button
                  onClick={() => setActiveTab('map')}
                  className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline mt-1 font-semibold flex items-center gap-1"
                >
                  <span>Inspect Blueprint</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Village Notices & Guidelines */}
            <VillageNotices />
          </div>
        )}

        {/* Tab 2: Analytics Dashboard */}
        {activeTab === 'dashboard' && (
          <AnalyticsDashboard
            records={records}
            settings={settings}
            onEditRecord={handleStartEdit}
            onDeleteRecord={handleDeleteRecord}
            onNavigateToEncode={() => setActiveTab('encode')}
          />
        )}

        {/* Tab 3: Field Census Encoder */}
        {activeTab === 'encode' && (
          <CensusEncoderForm
            existingRecords={records}
            activeUser={currentUser ? currentUser.name : 'Encoder 1 (Field Coordinator)'}
            editRecord={editingRecord}
            onSaveRecord={handleSaveRecord}
            onCancelEdit={() => setEditingRecord(null)}
          />
        )}

        {/* Tab 4: Subdivision Blueprint Map */}
        {activeTab === 'map' && (
          <VillagePlanViewer
            onSelectBlock={(blockNo) => {
              setActiveTab('encode');
            }}
          />
        )}

        {/* Tab 5: Security & Compliance Audit Panel */}
        {activeTab === 'security' && (
          <SecurityAuditPanel />
        )}

        {/* Tab 6: Supabase SQL & Cloud Setup */}
        {activeTab === 'supabase' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Production Supabase PostgreSQL Schema</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Execute this SQL in your Supabase project (Free Tier) to create the relational tables, indexes, and Row Level Security.
                </p>
              </div>

              <button
                onClick={handleCopySql}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold transition"
              >
                {showSqlCopied ? 'Copied to Clipboard!' : 'Copy SQL Schema'}
              </button>
            </div>

            <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[500px] leading-relaxed">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-12 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <p>Pueblocillo Village NDC Housing Project • Brgy. Langkaan II, Dasmariñas City, Cavite</p>
        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
          Philippine Data Privacy Act (R.A. 10173) Compliant • Phase 1 Census &amp; Property System
        </p>
      </footer>
    </div>
  );
}
