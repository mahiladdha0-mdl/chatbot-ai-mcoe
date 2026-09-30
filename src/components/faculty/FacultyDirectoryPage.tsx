import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { FacultyMember } from '../../types';
import {
  Users,
  Search,
  Mail,
  Copy,
  Check,
  Clock,
  Briefcase,
  Sparkles,
  ExternalLink,
  Award,
  GraduationCap,
} from 'lucide-react';

interface FacultyDirectoryPageProps {
  initialFilter?: string;
  onAskAboutFaculty: (name: string) => void;
}

export const FacultyDirectoryPage: React.FC<FacultyDirectoryPageProps> = ({
  initialFilter = 'all',
  onAskAboutFaculty,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>(initialFilter);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const facultyList = storageService.getFaculty();

  const handleCopy = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const filteredFaculty = facultyList.filter(fac => {
    const matchesSearch =
      fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.qualification.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'hod') {
      return fac.isHod || fac.designation.toLowerCase().includes('head');
    }
    if (filterType === 'assistant') {
      return fac.designation.toLowerCase().includes('assistant');
    }
    if (filterType === 'industry') {
      return Boolean(fac.industryExperience);
    }
    return true;
  });

  const hodMember = facultyList.find(f => f.isHod || f.designation.toLowerCase().includes('head'));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
          <Users className="w-4 h-4" />
          <span>Department of Artificial Intelligence &amp; Data Science</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AIDS Faculty Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Official academic faculty profiles for Modern College AIDS Department. Browse qualifications, teaching tenure, industry exposure, and direct institutional email addresses.
        </p>
      </div>

      {/* Prominent Head of Department Spotlight Card */}
      {hodMember && (filterType === 'all' || filterType === 'hod') && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden border border-blue-800">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/90 text-white flex items-center justify-center font-bold text-xl shadow-md border-2 border-white/20 shrink-0">
                {hodMember.initials || 'SP'}
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-[11px] font-semibold tracking-wide">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>Head of Department — AIDS</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {hodMember.name}
                </h2>
                <div className="text-xs text-blue-200">
                  {hodMember.qualification} &middot; {hodMember.teachingExperience} Teaching Experience
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
              <a
                href={`mailto:${hodMember.email}`}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>{hodMember.email}</span>
              </a>

              <button
                onClick={() => onAskAboutFaculty(hodMember.name)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-blue-300" />
                <span>Ask AI About HOD</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Segmented Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: `All Faculty (${facultyList.length})` },
            { id: 'hod', label: 'Head of Department' },
            { id: 'assistant', label: 'Assistant Professors' },
            { id: 'industry', label: 'Industry Experience' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, designation, email..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="space-y-4">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Showing {filteredFaculty.length} official faculty record{filteredFaculty.length !== 1 ? 's' : ''}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFaculty.map(fac => {
            const isHod = fac.isHod;

            return (
              <div
                key={fac.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 bg-white dark:bg-slate-900 ${
                  isHod
                    ? 'border-blue-400 dark:border-blue-700 shadow-md ring-1 ring-blue-400/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Avatar & Name */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
                        isHod
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {fac.initials || fac.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {fac.name}
                      </h3>
                      <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 truncate mt-0.5">
                        {isHod ? 'Head of Department — AIDS' : fac.designation}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {fac.qualification}
                      </div>
                    </div>
                  </div>

                  {/* Teaching and Industry Experience details */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Teaching Experience:</span>
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {fac.teachingExperience}
                      </span>
                    </div>

                    {fac.industryExperience ? (
                      <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-400 font-medium">
                        <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>Industry Experience:</span>
                        </span>
                        <span className="font-semibold">
                          {fac.industryExperience}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span>Industry Experience:</span>
                        <span>None recorded</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions: Clickable Email & Ask AI */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={`mailto:${fac.email}`}
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 truncate"
                    >
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{fac.email}</span>
                    </a>

                    <button
                      onClick={() => handleCopy(fac.email)}
                      title="Copy email address"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      {copiedEmail === fac.email ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => onAskAboutFaculty(fac.name)}
                    className="w-full py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Ask AI about {fac.name.split(' ')[0]}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
