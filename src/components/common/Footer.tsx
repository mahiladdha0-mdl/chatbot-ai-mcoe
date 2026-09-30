import React from 'react';
import { Bot, GraduationCap, MapPin, Mail, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string, queryParam?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base">
                Modern College AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Official academic companion for the Artificial Intelligence &amp; Data Science (AIDS) Department, Progressive Education Society’s Modern College of Engineering, Pune.
            </p>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>Shivajinagar, Pune - 411005, Maharashtra</span>
            </div>
          </div>

          {/* Quick Academic Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Academics &amp; Syllabus
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('academics', 'Semester III')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Semester III (SE AIDS)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('academics', 'Semester IV')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Semester IV (SE AIDS)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('academics', 'First Year')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  First Year Foundation Subjects
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('academics', 'Additional')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Additional Curriculum Courses
                </button>
              </li>
            </ul>
          </div>

          {/* Assistant & Faculty */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Assistant &amp; People
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('chat')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  Interactive Chatbot
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faculty')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Faculty Directory (12 Members)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faculty', 'hod')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Head of Department (Prof. Dr. S. V. Pandit)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  About AIDS Department
                </button>
              </li>
            </ul>
          </div>

          {/* Portals & Prototyping */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Portals &amp; Verification
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('student_login')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <GraduationCap className="w-3 h-3" />
                  Student Portal Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin_login')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3" />
                  Admin / Faculty Knowledge Desk
                </button>
              </li>
            </ul>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                Official Department Email:
              </span>
              <a
                href="mailto:hodads@moderncoe.edu.in"
                className="block text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline pt-0.5"
              >
                hodads@moderncoe.edu.in
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Banner with Student Prototype Disclaimer */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500 dark:text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} PES Modern College of Engineering, Pune. Department of Artificial Intelligence &amp; Data Science.
          </p>
          <div className="px-3 py-1 rounded bg-slate-200/60 dark:bg-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 text-center">
            Student Academic Prototype · Realistic AIDS Curriculum Demonstration
          </div>
        </div>
      </div>
    </footer>
  );
};
