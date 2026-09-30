import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Bot,
  GraduationCap,
  Users,
  BookOpen,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  UserCheck,
  ShieldCheck,
  Sparkles,
  LayoutDashboard,
  MessageSquare,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, queryParam?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { user, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab: string, queryParam?: string) => {
    onNavigate(tab, queryParam);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Department Branding */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                  Modern College
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  AIDS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-tight">
                AI Academic Assistant
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                currentTab === 'home'
                  ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNav('chat')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'chat'
                  ? 'text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              AI Assistant
            </button>

            <button
              onClick={() => handleNav('academics')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'academics'
                  ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              Academics
            </button>

            <button
              onClick={() => handleNav('faculty')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'faculty'
                  ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4 text-slate-500" />
              Faculty Directory
            </button>

            <button
              onClick={() => handleNav('about')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                currentTab === 'about'
                  ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              About
            </button>
          </nav>

          {/* Right Action Controls: Theme + Auth State */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* If Authenticated as Student */}
            {role === 'student' && user && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('student_dashboard')}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>
                <div className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                    {user.avatar || 'ST'}
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* If Authenticated as Admin */}
            {role === 'admin' && user && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('admin_dashboard')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 hover:bg-amber-100 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Admin Panel</span>
                </button>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* If Guest (Not Logged In) */}
            {role === 'guest' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('student_login')}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Student Login</span>
                </button>
                <button
                  onClick={() => handleNav('admin_login')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  Admin Login
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
              currentTab === 'home'
                ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNav('chat')}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-2 ${
              currentTab === 'chat'
                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            AI Assistant
          </button>
          <button
            onClick={() => handleNav('academics')}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-2 ${
              currentTab === 'academics'
                ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            Academics
          </button>
          <button
            onClick={() => handleNav('faculty')}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-2 ${
              currentTab === 'faculty'
                ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <Users className="w-4 h-4 text-slate-500" />
            Faculty Directory
          </button>
          <button
            onClick={() => handleNav('about')}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
              currentTab === 'about'
                ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            About
          </button>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {role === 'student' && user ? (
              <>
                <button
                  onClick={() => handleNav('student_dashboard')}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Student Dashboard ({user.name.split(' ')[0]})
                </button>
                <button
                  onClick={logout}
                  className="w-full py-2 text-xs font-medium text-rose-600 dark:text-rose-400 text-center"
                >
                  Logout
                </button>
              </>
            ) : role === 'admin' && user ? (
              <>
                <button
                  onClick={() => handleNav('admin_dashboard')}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-white"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Dashboard
                </button>
                <button
                  onClick={logout}
                  className="w-full py-2 text-xs font-medium text-rose-600 dark:text-rose-400 text-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleNav('student_login')}
                  className="w-full py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white text-center"
                >
                  Student Login
                </button>
                <button
                  onClick={() => handleNav('admin_login')}
                  className="w-full py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-center"
                >
                  Admin Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
