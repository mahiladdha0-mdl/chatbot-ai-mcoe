import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, ArrowRight, UserCheck, Sparkles, BookOpen, Users, CheckCircle2 } from 'lucide-react';

interface StudentLoginProps {
  onSuccess: () => void;
  onNavigate: (tab: string, queryParam?: string) => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({ onSuccess, onNavigate }) => {
  const { loginStudent, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid student email address.');
      return;
    }

    loginStudent(name, email);
    setJustLoggedIn(true);
  };

  const handleDemoSelect = (demoName: string, demoEmail: string) => {
    loginStudent(demoName, demoEmail);
    setJustLoggedIn(true);
  };

  if (justLoggedIn || (user && user.role === 'student')) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Welcome to Modern College AI Assistant!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Logged in as <strong className="text-slate-900 dark:text-white">{user?.name}</strong> ({user?.email})
          </p>
        </div>

        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300">
          Your student profile is active. You can now access your personalized dashboard, chat with the AI assistant, review semester syllabi, and check faculty contacts.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => onNavigate('student_dashboard')}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <span>Open Student Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('chat')}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch AI Chatbot</span>
          </button>
          <button
            onClick={() => onNavigate('academics')}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Browse Academics</span>
          </button>
          <button
            onClick={() => onNavigate('faculty')}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4 text-slate-400" />
            <span>Faculty Directory</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Student Registration &amp; Login
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Artificial Intelligence &amp; Data Science (AIDS) Department
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="e.g. Rohan Sharma"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Student Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="e.g. rohan.sharma@moderncoe.edu.in"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors"
              required
            />
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Continue as Student</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </form>

        {/* Demo Fast Pick Profiles */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
            Or test with a demo student profile:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoSelect('Rohan Sharma', 'rohan.sharma@moderncoe.edu.in')}
              className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 text-left transition-colors cursor-pointer group"
            >
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Rohan Sharma
              </div>
              <div className="text-[10px] text-slate-500 truncate">SE AIDS Student</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSelect('Priya Kulkarni', 'priya.k@moderncoe.edu.in')}
              className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 text-left transition-colors cursor-pointer group"
            >
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Priya Kulkarni
              </div>
              <div className="text-[10px] text-slate-500 truncate">SE AIDS Student</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
