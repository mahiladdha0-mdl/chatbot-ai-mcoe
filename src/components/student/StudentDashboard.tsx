import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import {
  Sparkles,
  BookOpen,
  Calendar,
  Users,
  MessageSquare,
  ArrowRight,
  HelpCircle,
  Clock,
  Layers,
  GraduationCap,
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (tab: string, queryParam?: string) => void;
  onQuickAsk: (question: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate, onQuickAsk }) => {
  const { user } = useAuth();
  const studentName = user?.name || 'Student';
  const studentId = user?.id || 'demo';
  const conversations = storageService.getConversations(studentId);

  const quickQuestions = [
    'Who teaches OOP to A division?',
    'Who teaches DSA?',
    'Who teaches Operating System?',
    'Who takes practicals?',
    'Who is my DELD teacher?',
    'Who takes CEP for S3 and S4 batch?',
    'What subjects do I have in Semester III?',
    'Who is the HOD of AIDS?',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Greeting */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-200">
            <GraduationCap className="w-4 h-4" />
            <span>AIDS Department &middot; PES Modern College of Engineering</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {studentName}!
          </h1>
          <p className="text-sm sm:text-base text-blue-100 font-normal">
            What would you like to know about your college today?
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => onNavigate('chat')}
              className="px-4 py-2 rounded-xl bg-white text-blue-900 font-semibold hover:bg-blue-50 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Launch Chatbot</span>
            </button>
            <button
              onClick={() => onNavigate('academics', 'Semester III')}
              className="px-4 py-2 rounded-xl bg-blue-600/60 hover:bg-blue-600 border border-white/20 text-white font-medium transition-colors cursor-pointer"
            >
              View Semester III Syllabus
            </button>
          </div>
        </div>

        {/* Decorative corner graphic */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 6 MAIN DASHBOARD CARDS */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Academic Navigation
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Ask AI Assistant */}
          <div
            onClick={() => onNavigate('chat')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Ask AI Assistant
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Chat naturally with your campus AI to resolve doubts about syllabus, labs, exam notice policies, and faculty.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>Start conversation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: My Academic Subjects */}
          <div
            onClick={() => onNavigate('academics')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                My Academic Subjects
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Full directory of AIDS curriculum courses across FE, Semester III, Semester IV, and Additional offerings.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>Explore all subjects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Semester III */}
          <div
            onClick={() => onNavigate('academics', 'Semester III')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Semester III
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Second Year First Term: OS, DSA, OOP, DELD, Economics, Human Values, and elective options.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400">
              <span>View 13 Sem III courses</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Semester IV */}
          <div
            onClick={() => onNavigate('academics', 'Semester IV')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-600 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Semester IV
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Second Year Second Term: AI &amp; DS, Computer Networks, Probability &amp; Statistics, Embedded Systems, Electives.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-violet-600 dark:text-violet-400">
              <span>View 9 Sem IV courses</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Faculty Directory */}
          <div
            onClick={() => onNavigate('faculty')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Faculty Directory
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Official qualifications, teaching and industry experience, and direct mailto links for all 12 faculty members.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Browse 12 faculty</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Recent Conversations */}
          <div
            onClick={() => onNavigate('chat')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Recent Conversations
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {conversations.length > 0
                  ? `You have ${conversations.length} saved conversation thread${conversations.length > 1 ? 's' : ''} in your history.`
                  : 'Resume previous question threads and context whenever you return.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
              <span>{conversations.length > 0 ? 'Resume chats' : 'Start a chat'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* QUICK QUESTION SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Frequently Asked Academic Questions
          </h2>
          <span className="text-xs text-blue-600 dark:text-blue-400">Click to ask instantly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onQuickAsk(q)}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 text-left text-xs font-medium text-slate-800 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
            >
              <span className="line-clamp-2">{q}</span>
              <Sparkles className="w-3.5 h-3.5 text-blue-500 opacity-60 group-hover:opacity-100 shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
