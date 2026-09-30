import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Users,
  MessageSquare,
  ShieldCheck,
  GraduationCap,
  CheckCircle2,
  Send,
  HelpCircle,
  Database,
  Cpu,
} from 'lucide-react';
import { processUserQuery } from '../../services/chatbotEngine';

interface LandingPageProps {
  onNavigate: (tab: string, queryParam?: string) => void;
  onQuickAsk: (question: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onQuickAsk }) => {
  // Interactive live preview state on the landing page
  const [previewQuery, setPreviewQuery] = useState('');
  const [previewResponse, setPreviewResponse] = useState<string | null>(null);
  const [isPreviewThinking, setIsPreviewThinking] = useState(false);

  const sampleQuestions = [
    'What subjects do I have in Semester III?',
    'What subjects do I have in Semester IV?',
    'Who is the HOD of AIDS?',
    'What are my 3rd semester electives?',
    'Does OOP have a practical?',
    'Who has 11 years of teaching experience?',
  ];

  const handleRunPreview = (q: string) => {
    setPreviewQuery(q);
    setIsPreviewThinking(true);
    setTimeout(() => {
      const resp = processUserQuery(q);
      setPreviewResponse(resp.text);
      setIsPreviewThinking(false);
    }, 350);
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-8 sm:pt-14 pb-8 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-blue-400/10 via-indigo-400/10 to-violet-400/10 dark:from-blue-600/10 dark:to-violet-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Department Kicker (anti-slop clean typography) */}
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-700 dark:text-blue-400">
                <span>PES Modern College of Engineering, Pune</span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span>AIDS Department</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                Meet Your Modern College{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-300">
                  AI Assistant
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Your intelligent academic companion. Get instant answers about your subjects, semester syllabus, faculty members, and college academics through a simple conversation.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => onNavigate('student_login')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Start as Student</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('admin_login')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                  <span>Faculty / Admin Login</span>
                </button>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Verified AIDS Curriculum</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Official 12-Member Faculty Records</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Semester III &amp; IV Mapped</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Chat Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                {/* Chat Preview Header */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        AI Assistant Preview
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online &middot; AIDS Knowledge Base
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('chat')}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Open Full Chat</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Chat Preview Body */}
                <div className="p-4 space-y-3 min-h-[260px] max-h-[320px] overflow-y-auto text-xs bg-slate-50/30 dark:bg-slate-950/20">
                  {/* Assistant Initial Message */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                      AI
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 p-3 rounded-2xl rounded-tl-xs shadow-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                      Hi! Ask me anything about your AIDS semester subjects, laboratories, electives, or faculty profiles. Try clicking a sample below!
                    </div>
                  </div>

                  {/* Active Question if user clicked */}
                  {previewQuery && (
                    <div className="flex items-start justify-end gap-2">
                      <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-xs shadow-xs max-w-[85%] leading-relaxed font-medium">
                        {previewQuery}
                      </div>
                    </div>
                  )}

                  {/* Thinking or Response */}
                  {isPreviewThinking && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs py-2 pl-8">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-100" />
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-200" />
                      <span>Retrieving college knowledge...</span>
                    </div>
                  )}

                  {previewResponse && !isPreviewThinking && (
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                        AI
                      </div>
                      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 p-3 rounded-2xl rounded-tl-xs shadow-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                        {previewResponse}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sample Question Chips */}
                <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Quick Sample Questions:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleQuestions.slice(0, 3).map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleRunPreview(q)}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 transition-colors text-left"
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  {/* Input Simulation Trigger */}
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => onNavigate('chat')}
                      className="w-full py-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Launch Full Interactive Chat &rarr;</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS (Exact 6 features from brief) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Intelligent Academic Architecture
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Designed for Modern College AI &amp; Data Science
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Everything students and faculty need to navigate curriculum guidelines, laboratory requirements, and departmental contacts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: AI Academic Assistant */}
          <div
            onClick={() => onQuickAsk('What subjects do I have in Semester III?')}
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              AI Academic Assistant
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Ask questions about subjects, semesters, programming, and academics. Get contextual answers instantly without searching manual PDFs.
            </p>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:gap-1.5 transition-all">
              Try asking questions &rarr;
            </span>
          </div>

          {/* Card 2: Smart Semester Guide */}
          <div
            onClick={() => onNavigate('academics')}
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Smart Semester Guide
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Explore semester-wise subjects, laboratories, and elective options. Filter between Core, Laboratory practicals, and Electives.
            </p>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:gap-1.5 transition-all">
              Browse Semester Syllabi &rarr;
            </span>
          </div>

          {/* Card 3: Faculty Directory */}
          <div
            onClick={() => onNavigate('faculty')}
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-600 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Faculty Directory
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Discover faculty qualifications, teaching experience, and official email addresses. View details for all 12 AIDS faculty members.
            </p>
            <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 flex items-center gap-1 group-hover:gap-1.5 transition-all">
              View 12 Faculty Records &rarr;
            </span>
          </div>

          {/* Card 4: Student Support */}
          <div
            onClick={() => onQuickAsk('What are the elective options in Semester III?')}
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Student Support
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Get quick answers to frequently asked academic questions, course prerequisites, and curriculum requirements with zero friction.
            </p>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:gap-1.5 transition-all">
              Explore Academic FAQs &rarr;
            </span>
          </div>

          {/* Card 5: Personalized Student Experience */}
          <div
            onClick={() => onNavigate('student_login')}
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Personalized Student Experience
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Ask follow-up questions while the assistant maintains relevant conversation context (e.g. asking practicals after viewing Semester III).
            </p>
            <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1 group-hover:gap-1.5 transition-all">
              Log in as Student &rarr;
            </span>
          </div>

          {/* Card 6: Teacher Knowledge Management */}
          <div
            onClick={() => onNavigate('admin_login')}
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Teacher Knowledge Management
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Allow authorized administrators and faculty to update academic course records, manage student query logs, and refine knowledge entries.
            </p>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1 group-hover:gap-1.5 transition-all">
              Access Admin Panel &rarr;
            </span>
          </div>
        </div>
      </section>

      {/* QUICK SUGGESTIONS CAROUSEL SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Interactive Quick-Launch Prompts</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              What would you like to ask the Modern College AI Assistant?
            </h3>
            <p className="text-xs text-blue-100/80 max-w-xl">
              Click any question below to immediately launch the AI assistant with that query prefilled and executed:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onQuickAsk(q)}
                  className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-left text-xs font-medium text-white transition-all hover:scale-[1.02] flex items-center justify-between group cursor-pointer"
                >
                  <span className="line-clamp-2">{q}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-300 opacity-60 group-hover:opacity-100 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
