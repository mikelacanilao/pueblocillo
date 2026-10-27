'use client';

import React, { useState } from 'react';
import { 
  ClipboardList,
  Sun,
  Moon,
  LogIn,
  LogOut
} from 'lucide-react';
import { HouseholdCensusRecord, UserAccount } from '@/types/census';
import { CensusEncoderForm } from '@/components/census/CensusEncoderForm';
import { LoginPage } from '@/components/auth/LoginPage';
import { 
  loadStoredRecords, 
  saveStoredRecords, 
  saveActiveUser 
} from '@/lib/storage';
import { getStoredAuthSession, saveAuthSession, clearAuthSession } from '@/lib/auth';
import { useTheme } from '@/context/ThemeContext';

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'portal' | 'encode' | 'login'>('portal');
  const [records, setRecords] = useState<HouseholdCensusRecord[]>(() => loadStoredRecords());
  
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getStoredAuthSession());
  const [editingRecord, setEditingRecord] = useState<HouseholdCensusRecord | null>(null);

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    saveAuthSession(user);
    saveActiveUser(user.name);
    setActiveTab('encode');
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

  const totalEncoded = records.length;

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
              Home
            </button>
            <button
              onClick={() => setActiveTab('encode')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'encode'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Census Encoder
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
            Home
          </button>
          <button
            onClick={() => setActiveTab('encode')}
            className={`px-2 py-1 rounded-lg ${activeTab === 'encode' ? 'bg-emerald-700 text-white' : 'text-slate-500'}`}
          >
            Encoder
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
            <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                Phase 1 Census System
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Pueblocillo Village Community Portal
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                Temporary streamlined version focused on operations. Officers can sign in,
                then proceed directly to census data entry.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab(currentUser ? 'encode' : 'login')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold transition flex items-center gap-2"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>{currentUser ? 'Open Encoder' : 'Login to Start Encoding'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('login')}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold transition flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{currentUser ? 'Switch Account' : 'Officer Login'}</span>
                </button>
              </div>
            </section>

            <section className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Encoded Records</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{totalEncoded}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                Use this count for quick progress visibility while field encoding is ongoing.
              </p>
            </section>
          </div>
        )}

        {/* Tab 2: Field Census Encoder */}
        {activeTab === 'encode' && (
          <CensusEncoderForm
            existingRecords={records}
            activeUser={currentUser ? currentUser.name : 'Encoder 1 (Field Coordinator)'}
            editRecord={editingRecord}
            onSaveRecord={handleSaveRecord}
            onCancelEdit={() => setEditingRecord(null)}
          />
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
