import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { AcademicSubject } from '../../types';
import { Modal } from '../common/Modal';
import {
  BookOpen,
  Search,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Award,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface AcademicsPageProps {
  initialSemester?: string;
  onAskAboutSubject: (subjectName: string) => void;
}

export const AcademicsPage: React.FC<AcademicsPageProps> = ({
  initialSemester = 'Semester III',
  onAskAboutSubject,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<string>(initialSemester);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'core' | 'laboratory' | 'elective'>('all');
  const [inspectedSubject, setInspectedSubject] = useState<AcademicSubject | null>(null);

  const subjects = storageService.getSubjects();

  // Filter list
  const filtered = subjects.filter(s => {
    const matchesSemester =
      selectedSemester === 'All' ? true : s.semester === selectedSemester;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === 'all' ? true : s.type === typeFilter;

    return matchesSemester && matchesSearch && matchesType;
  });

  const sem3Core = filtered.filter(s => s.semester === 'Semester III' && s.type === 'core');
  const sem3Labs = filtered.filter(s => s.semester === 'Semester III' && s.type === 'laboratory');
  const sem3Electives = filtered.filter(s => s.semester === 'Semester III' && s.type === 'elective');

  const sem4Core = filtered.filter(s => s.semester === 'Semester IV' && s.type === 'core');
  const sem4Labs = filtered.filter(s => s.semester === 'Semester IV' && s.type === 'laboratory');
  const sem4Electives = filtered.filter(s => s.semester === 'Semester IV' && s.type === 'elective');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
          <BookOpen className="w-4 h-4" />
          <span>AIDS Academic Knowledge Base &middot; SPPU Affiliated</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Curriculum &amp; Academic Subjects
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Official academic curriculum for Artificial Intelligence and Data Science at PES Modern College of Engineering. Browse Semester III, Semester IV, First Year foundation, and Additional curriculum courses.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Semester Segmented Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['Semester III', 'Semester IV', 'First Year', 'Additional', 'All'].map(sem => (
            <button
              key={sem}
              onClick={() => {
                setSelectedSemester(sem);
                setTypeFilter('all');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedSemester === sem
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {sem}
            </button>
          ))}
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search code or subject..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="hidden sm:flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-xl p-0.5 text-[11px]">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                typeFilter === 'all' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('core')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                typeFilter === 'core' ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300' : 'text-slate-500'
              }`}
            >
              Core
            </button>
            <button
              onClick={() => setTypeFilter('laboratory')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                typeFilter === 'laboratory' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' : 'text-slate-500'
              }`}
            >
              Labs
            </button>
            <button
              onClick={() => setTypeFilter('elective')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                typeFilter === 'elective' ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300' : 'text-slate-500'
              }`}
            >
              Electives
            </button>
          </div>
        </div>
      </div>

      {/* SEMESTER III VIEW */}
      {selectedSemester === 'Semester III' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/60 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 dark:text-blue-200 space-y-1">
              <span className="font-bold block">
                Semester III — Artificial Intelligence and Data Science
              </span>
              <p className="leading-relaxed">
                Semester III curriculum comprises core theory courses, laboratory practicals, and elective options. Note: In the official curriculum excerpt, laboratory courses share the course code with their respective theory courses (e.g. ADS01201 for OS and OS Lab).
              </p>
            </div>
          </div>

          {/* Core Subjects Group */}
          {(typeFilter === 'all' || typeFilter === 'core') && sem3Core.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Core Theory Subjects ({sem3Core.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sem3Core.map(sub => (
                  <SubjectCard
                    key={sub.id}
                    subject={sub}
                    onInspect={() => setInspectedSubject(sub)}
                    onAskAI={() => onAskAboutSubject(sub.name)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Laboratory Courses Group */}
          {(typeFilter === 'all' || typeFilter === 'laboratory') && sem3Labs.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Laboratory Courses ({sem3Labs.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sem3Labs.map(sub => (
                  <SubjectCard
                    key={sub.id}
                    subject={sub}
                    onInspect={() => setInspectedSubject(sub)}
                    onAskAI={() => onAskAboutSubject(sub.name)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Electives Group */}
          {(typeFilter === 'all' || typeFilter === 'elective') && sem3Electives.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span>Elective Options (Choose 1 Alternative)</span>
                </h2>
                <span className="text-[11px] text-purple-700 dark:text-purple-300 font-medium">
                  Elective Alternatives · Confirm choice with department
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sem3Electives.map(sub => (
                  <SubjectCard
                    key={sub.id}
                    subject={sub}
                    onInspect={() => setInspectedSubject(sub)}
                    onAskAI={() => onAskAboutSubject(sub.name)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SEMESTER IV VIEW */}
      {selectedSemester === 'Semester IV' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="p-4 rounded-xl bg-violet-50/70 dark:bg-violet-950/40 border border-violet-200/60 dark:border-violet-900/60 flex items-start gap-3">
            <Info className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
            <div className="text-xs text-violet-900 dark:text-violet-200 space-y-1">
              <span className="font-bold block">
                Semester IV — Artificial Intelligence and Data Science
              </span>
              <p className="leading-relaxed">
                Semester IV curriculum focuses on core machine learning, computer networks, probability and statistics, embedded systems, and departmental electives (IT Act and Cyber Laws or Human Resource Management).
              </p>
            </div>
          </div>

          {/* Core */}
          {(typeFilter === 'all' || typeFilter === 'core') && sem4Core.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Core Theory Subjects ({sem4Core.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sem4Core.map(sub => (
                  <SubjectCard
                    key={sub.id}
                    subject={sub}
                    onInspect={() => setInspectedSubject(sub)}
                    onAskAI={() => onAskAboutSubject(sub.name)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Labs */}
          {(typeFilter === 'all' || typeFilter === 'laboratory') && sem4Labs.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Laboratory Courses ({sem4Labs.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sem4Labs.map(sub => (
                  <SubjectCard
                    key={sub.id}
                    subject={sub}
                    onInspect={() => setInspectedSubject(sub)}
                    onAskAI={() => onAskAboutSubject(sub.name)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Electives */}
          {(typeFilter === 'all' || typeFilter === 'elective') && sem4Electives.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span>Elective Options (Choose 1 Alternative)</span>
                </h2>
                <span className="text-[11px] text-purple-700 dark:text-purple-300 font-medium">
                  IT Act &amp; Cyber Laws OR HRM
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sem4Electives.map(sub => (
                  <SubjectCard
                    key={sub.id}
                    subject={sub}
                    onInspect={() => setInspectedSubject(sub)}
                    onAskAI={() => onAskAboutSubject(sub.name)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FIRST YEAR VIEW */}
      {selectedSemester === 'First Year' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
            <strong>First Year Foundation Subjects:</strong> As provided in the curriculum excerpt. Note: Semester allocations for first-year courses are not assigned unless confirmed.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(sub => (
              <SubjectCard
                key={sub.id}
                subject={sub}
                onInspect={() => setInspectedSubject(sub)}
                onAskAI={() => onAskAboutSubject(sub.name)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ADDITIONAL COURSES VIEW */}
      {selectedSemester === 'Additional' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-300 space-y-1">
            <strong>Additional Curriculum Courses:</strong>
            <p>
              These four courses are included in the academic knowledge base. In compliance with the curriculum guidelines, they are not allocated to Semester III or Semester IV pending verified departmental assignment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(sub => (
              <SubjectCard
                key={sub.id}
                subject={sub}
                onInspect={() => setInspectedSubject(sub)}
                onAskAI={() => onAskAboutSubject(sub.name)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ALL COURSES VIEW */}
      {selectedSemester === 'All' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-xs text-slate-500">
            Showing all {filtered.length} academic courses across the entire curriculum.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(sub => (
              <SubjectCard
                key={sub.id}
                subject={sub}
                onInspect={() => setInspectedSubject(sub)}
                onAskAI={() => onAskAboutSubject(sub.name)}
              />
            ))}
          </div>
        </div>
      )}

      {/* SUBJECT DETAIL MODAL */}
      {inspectedSubject && (
        <Modal
          isOpen={!!inspectedSubject}
          onClose={() => setInspectedSubject(null)}
          title={inspectedSubject.name}
          subtitle={`Course Code: ${inspectedSubject.code} · ${inspectedSubject.semester}`}
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                {inspectedSubject.type.toUpperCase()}
              </span>
              {inspectedSubject.credits && (
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {inspectedSubject.credits} Credits
                </span>
              )}
              {inspectedSubject.hasPractical && (
                <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Includes Laboratory Practical
                </span>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                Course Description &amp; Scope:
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                {inspectedSubject.description ||
                  'Official course content approved by the Department of Artificial Intelligence & Data Science, PES Modern College of Engineering.'}
              </p>
            </div>

            {inspectedSubject.notes && (
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-xs text-purple-900 dark:text-purple-300">
                <strong>Curriculum Note:</strong> {inspectedSubject.notes}
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  const name = inspectedSubject.name;
                  setInspectedSubject(null);
                  onAskAboutSubject(name);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask AI About This Subject</span>
              </button>
              <button
                onClick={() => setInspectedSubject(null)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Reusable Course Card
const SubjectCard: React.FC<{
  subject: AcademicSubject;
  onInspect: () => void;
  onAskAI: () => void;
}> = ({ subject, onInspect, onAskAI }) => {
  const isLab = subject.type === 'laboratory';
  const isElective = subject.type === 'elective';

  return (
    <div
      onClick={onInspect}
      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-3"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono font-bold text-blue-700 dark:text-blue-400">
            {subject.code}
          </span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
              isLab
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : isElective
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
            }`}
          >
            {isLab ? 'Laboratory' : isElective ? 'Elective' : 'Core'}
          </span>
        </div>

        <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">
          {subject.name}
        </h3>

        {subject.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {subject.description}
          </p>
        )}
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400">
          {subject.semester}
        </span>
        <button
          onClick={e => {
            e.stopPropagation();
            onAskAI();
          }}
          className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 text-[11px]"
        >
          <Sparkles className="w-3 h-3" />
          <span>Ask AI</span>
        </button>
      </div>
    </div>
  );
};
