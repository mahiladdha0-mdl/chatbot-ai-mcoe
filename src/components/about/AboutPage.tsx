import React from 'react';
import { Bot, GraduationCap, MapPin, Award, BookOpen, Users, Sparkles, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (tab: string, queryParam?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
          <GraduationCap className="w-4 h-4" />
          <span>About the Department</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Artificial Intelligence &amp; Data Science (AIDS)
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Progressive Education Society’s Modern College of Engineering, Shivajinagar, Pune - 411005.
        </p>
      </div>

      {/* Main Department Story */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>Department Vision &amp; Academic Charter</span>
            </h2>
            <p>
              The Department of Artificial Intelligence and Data Science at Modern College of Engineering is dedicated to imparting state-of-the-art technical education, fostering multidisciplinary problem-solving, and building industry-ready engineering graduates capable of leading advancements in intelligent systems, machine learning, and data analytics.
            </p>
            <p>
              Affiliated with Savitribai Phule Pune University (SPPU), our updated curriculum spans foundational computation, core data structures, object-oriented software engineering, real-time operating systems, statistics, and machine intelligence pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/60 space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-blue-900 dark:text-blue-300">
                Key Strengths
              </h3>
              <ul className="space-y-1.5 text-xs text-blue-800 dark:text-blue-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Experienced faculty with up to 23+ years tenure</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Active industry background &amp; corporate research</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>State-of-the-art computational &amp; hardware labs</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/60 space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                Campus Location
              </h3>
              <p className="text-xs text-indigo-800 dark:text-indigo-200 leading-relaxed">
                PES Modern College of Engineering is centrally located in Shivajinagar, Pune, Maharashtra. Accessible by rail, metro, and road transportation networks.
              </p>
            </div>
          </div>
        </div>

        {/* Right Info Card */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                About This Assistant
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Modern College AI Assistant is a student-developed conversational academic system designed for professors, hackathon mentors, and students.
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => onNavigate('chat')}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Talk with Assistant</span>
              </button>
              <button
                onClick={() => onNavigate('faculty')}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>View 12 Faculty Members</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
