import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertTriangle, KeyRound } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onNavigate: (tab: string, queryParam?: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onNavigate }) => {
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = loginAdmin(email, password);
    if (res.success) {
      onSuccess();
    } else {
      setError(res.error || 'Authentication failed.');
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@moderncoe.edu.in');
    setPassword('modern@aids2026');
    setError('');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 mx-auto flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Faculty / Admin Login
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            AIDS Academic Knowledge Base &amp; Query Administration
          </p>
        </div>

        {/* Prototype demo note */}
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-300 space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">Academic Prototype Mode</span>
              <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300/90">
                To test administrator capabilities (managing academic subjects, reviewing student query logs, updating faculty profiles), use the pre-configured credentials below:
              </p>
            </div>
          </div>
          <div className="pt-1 flex items-center justify-between border-t border-amber-200/60 dark:border-amber-900/60">
            <span className="font-mono text-[11px]">admin@moderncoe.edu.in</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-semibold text-amber-800 dark:text-amber-200 underline hover:text-amber-950 cursor-pointer"
            >
              Auto-fill Credentials
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Official Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="faculty@moderncoe.edu.in"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-colors"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Demo password: <code className="text-slate-600 dark:text-slate-300 font-mono">modern@aids2026</code>
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-md shadow-amber-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Login to Admin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            type="button"
            onClick={() => onNavigate('student_login')}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Switch to Student Portal &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
