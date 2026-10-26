'use client';

import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ShieldCheck, 
  AlertCircle, 
  UserCheck, 
  KeyRound, 
  Eye, 
  EyeOff,
  Building2,
  Info
} from 'lucide-react';
import { UserAccount } from '@/types/census';
import { authenticateUser, DEMO_ACCOUNTS } from '@/lib/auth';

interface LoginPageProps {
  onLoginSuccess: (user: UserAccount) => void;
  onCancel?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = authenticateUser(email, password);
      setIsLoading(false);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setErrorMessage(result.error || 'Authentication failed. Please check your credentials.');
      }
    }, 400);
  };

  const fillQuickCredential = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-md w-full mx-auto my-8 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 transition-colors">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
          PV
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          HOA Officer &amp; Resident Login
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Pueblocillo Village NDC Housing Project • Brgy. Langkaan, Cavite
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Registered Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="e.g. admin@pueblocillo.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 pl-10 pr-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Security Passcode / Password
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 pl-10 pr-10 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Lock className="w-4 h-4" />
          <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Portal'}</span>
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            Continue as Public Visitor
          </button>
        )}
      </form>

      {/* Security Info & Quick Test Accounts */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Protected by Rate-Limiting &amp; RA 10173 Audit Logging</span>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
            Click to Auto-Fill Role Account (Demo / Testing):
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => fillQuickCredential(acc.email, acc.passwordHash)}
                className="p-2 rounded-xl text-left border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-emerald-500 dark:hover:border-emerald-500 transition"
              >
                <div className="font-bold text-slate-800 dark:text-slate-200">{acc.badge}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{acc.email}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
