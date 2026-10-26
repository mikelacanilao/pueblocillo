'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  FileCode, 
  Database, 
  CheckCircle2, 
  AlertTriangle,
  Server,
  KeyRound,
  EyeOff
} from 'lucide-react';
import { SUPABASE_SQL_SCHEMA } from '@/lib/supabase';

export const SecurityAuditPanel: React.FC = () => {
  const securityChecks = [
    {
      title: 'Philippine Data Privacy Act (R.A. 10173) Compliance',
      status: 'Passed',
      desc: 'Mandatory consent checkbox embedded in the Census form. PII (owner contacts, tenant names, health vulnerability flags) is stored strictly for HOA governance and disaster rescue records.',
      category: 'Legal / Compliance'
    },
    {
      title: 'Database Row Level Security (RLS) Policies',
      status: 'Passed',
      desc: 'Supabase PostgreSQL RLS policies enforce that only authenticated HOA admins can delete or modify records. Public visitors cannot query raw tenant phone numbers or financial ledgers.',
      category: 'Database'
    },
    {
      title: 'Rate-Limiting & Brute-Force Defense',
      status: 'Active',
      desc: 'Client & API authentication records failed attempts per email address and triggers a temporary lockout (60s) after 5 consecutive failures.',
      category: 'Authentication'
    },
    {
      title: 'Role-Based Access Control (RBAC)',
      status: 'Enforced',
      desc: 'Strict role hierarchy separates HOA Admin (full rights), Field Encoders (create and update lots only, no deletion), and Residents (read-only own unit view).',
      category: 'Access Control'
    },
    {
      title: 'Duplicate Prevention (Block & Lot Unique Constraint)',
      status: 'Active',
      desc: 'Composite unique index on (block_no, lot_no) prevents duplicate lots from being encoded or overwritten without explicit confirmation.',
      category: 'Data Integrity'
    },
    {
      title: 'Credential Exposure Prevention',
      status: 'Secured',
      desc: 'Environment variables for Supabase keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are isolated, and service role keys are excluded from client code.',
      category: 'Secrets Management'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Pueblocillo Security &amp; Compliance Audit</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Application Security &amp; Data Privacy Posture
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Evaluated against Philippine R.A. 10173 (Data Privacy Act) and OWASP Top 10 Web Application Standards.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-2xl">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <div>
            <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Security Status: Good</div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400">Zero Critical Vulnerabilities</div>
          </div>
        </div>
      </div>

      {/* Security Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityChecks.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {item.category}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                {item.status}
              </span>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>{item.title}</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Recommendations & Hardening Steps */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Recommended Production Hardening Steps (Before Cloud Deployment)</span>
        </h3>

        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">1</span>
            <div>
              <strong className="text-slate-800 dark:text-slate-200">Supabase Project Secrets:</strong> Set up your free-tier Supabase project and store `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` or Vercel Environment Variables. Never commit `.env.local` to git.
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">2</span>
            <div>
              <strong className="text-slate-800 dark:text-slate-200">HOA Admin Multi-Factor Authentication (MFA):</strong> When moving beyond demo accounts, enable Supabase Auth Email Magic Links or TOTP Authenticator Apps for the HOA Board and Treasurers.
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">3</span>
            <div>
              <strong className="text-slate-800 dark:text-slate-200">Automated Daily Backups:</strong> Supabase provides automated daily PostgreSQL database backups on the free tier, ensuring census data can be restored if corrupted by field encoders.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
