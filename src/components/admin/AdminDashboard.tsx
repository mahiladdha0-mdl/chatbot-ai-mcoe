import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import {
  AcademicSubject,
  FacultyMember,
  StudentQueryRecord,
  FAQItem,
  KnowledgeItem,
  CourseType,
} from '../../types';
import { Modal } from '../common/Modal';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  BookOpen,
  HelpCircle,
  Database,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Layers,
  Calendar,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (tab: string, queryParam?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Local state mirrored from storageService
  const [subjects, setSubjects] = useState<AcademicSubject[]>(() => storageService.getSubjects());
  const [faculty, setFaculty] = useState<FacultyMember[]>(() => storageService.getFaculty());
  const [queries, setQueries] = useState<StudentQueryRecord[]>(() => storageService.getQueries());
  const [faqs, setFaqs] = useState<FAQItem[]>(() => storageService.getFAQs());
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>(() => storageService.getKnowledge());

  // Search/Filters within tables
  const [searchTerm, setSearchTerm] = useState('');
  const [queryFilter, setQueryFilter] = useState<'all' | 'answered' | 'flagged' | 'reviewed'>('all');

  // Modals state
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<AcademicSubject | null>(null);
  const [subjectFormData, setSubjectFormData] = useState({
    code: '',
    name: '',
    semester: 'Semester III' as AcademicSubject['semester'],
    type: 'core' as CourseType,
    description: '',
    credits: 3,
    hasPractical: false,
    notes: '',
  });

  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<FacultyMember | null>(null);
  const [facultyFormData, setFacultyFormData] = useState({
    name: '',
    designation: 'Assistant Professor',
    qualification: '',
    teachingExperience: '',
    industryExperience: '',
    email: '',
    isHod: false,
  });

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'subject' | 'faculty' | 'faq' | 'kb'; id: string; name: string } | null>(null);

  // Success toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // SUBJECT HANDLERS
  const handleOpenAddSubject = (semDefault?: AcademicSubject['semester']) => {
    setEditingSubject(null);
    setSubjectFormData({
      code: '',
      name: '',
      semester: semDefault || 'Semester III',
      type: 'core',
      description: '',
      credits: 3,
      hasPractical: false,
      notes: '',
    });
    setIsSubjectModalOpen(true);
  };

  const handleOpenEditSubject = (subj: AcademicSubject) => {
    setEditingSubject(subj);
    setSubjectFormData({
      code: subj.code,
      name: subj.name,
      semester: subj.semester,
      type: subj.type,
      description: subj.description || '',
      credits: subj.credits || 3,
      hasPractical: Boolean(subj.hasPractical),
      notes: subj.notes || '',
    });
    setIsSubjectModalOpen(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectFormData.name.trim() || !subjectFormData.code.trim()) return;

    let updatedList: AcademicSubject[];
    if (editingSubject) {
      updatedList = subjects.map(s =>
        s.id === editingSubject.id
          ? {
              ...s,
              ...subjectFormData,
            }
          : s
      );
      showToast(`Subject "${subjectFormData.name}" updated successfully.`);
    } else {
      const newSubject: AcademicSubject = {
        id: 'sub-' + Date.now(),
        department: 'Artificial Intelligence & Data Science',
        ...subjectFormData,
      };
      updatedList = [newSubject, ...subjects];
      showToast(`Subject "${subjectFormData.name}" added successfully.`);
    }

    storageService.saveSubjects(updatedList);
    setSubjects(updatedList);
    setIsSubjectModalOpen(false);
  };

  // FACULTY HANDLERS
  const handleOpenAddFaculty = () => {
    setEditingFaculty(null);
    setFacultyFormData({
      name: '',
      designation: 'Assistant Professor',
      qualification: '',
      teachingExperience: '',
      industryExperience: '',
      email: '',
      isHod: false,
    });
    setIsFacultyModalOpen(true);
  };

  const handleOpenEditFaculty = (fac: FacultyMember) => {
    setEditingFaculty(fac);
    setFacultyFormData({
      name: fac.name,
      designation: fac.designation,
      qualification: fac.qualification,
      teachingExperience: fac.teachingExperience,
      industryExperience: fac.industryExperience || '',
      email: fac.email,
      isHod: Boolean(fac.isHod),
    });
    setIsFacultyModalOpen(true);
  };

  const handleSaveFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyFormData.name.trim() || !facultyFormData.email.trim()) return;

    let updatedList: FacultyMember[];
    if (editingFaculty) {
      updatedList = faculty.map(f =>
        f.id === editingFaculty.id
          ? {
              ...f,
              ...facultyFormData,
              initials: facultyFormData.name.slice(0, 2).toUpperCase(),
            }
          : f
      );
      showToast(`Faculty record for "${facultyFormData.name}" updated.`);
    } else {
      const newFac: FacultyMember = {
        id: 'fac-' + Date.now(),
        ...facultyFormData,
        initials: facultyFormData.name.slice(0, 2).toUpperCase(),
      };
      updatedList = [...faculty, newFac];
      showToast(`Faculty "${facultyFormData.name}" added to directory.`);
    }

    storageService.saveFaculty(updatedList);
    setFaculty(updatedList);
    setIsFacultyModalOpen(false);
  };

  // CONFIRM DELETE
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'subject') {
      const updated = subjects.filter(s => s.id !== deleteTarget.id);
      storageService.saveSubjects(updated);
      setSubjects(updated);
      showToast(`Subject "${deleteTarget.name}" deleted.`);
    } else if (deleteTarget.type === 'faculty') {
      const updated = faculty.filter(f => f.id !== deleteTarget.id);
      storageService.saveFaculty(updated);
      setFaculty(updated);
      showToast(`Faculty "${deleteTarget.name}" removed.`);
    }

    setIsDeleteConfirmOpen(false);
    setDeleteTarget(null);
  };

  // RESET TO DEFAULT
  const handleResetToOfficialData = () => {
    if (window.confirm('Reset all academic subjects and faculty records back to original official AIDS curriculum data?')) {
      const defSubjects = storageService.resetSubjects();
      const defFaculty = storageService.resetFaculty();
      setSubjects(defSubjects);
      setFaculty(defFaculty);
      showToast('All records restored to official curriculum defaults.');
    }
  };

  // FILTERED LISTS
  const filteredSubjects = subjects.filter(s => {
    if (activeTab === 'sem3') return s.semester === 'Semester III';
    if (activeTab === 'sem4') return s.semester === 'Semester IV';
    if (activeTab === 'electives') return s.type === 'elective';
    return (
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredFaculty = faculty.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredQueries = queries.filter(q => {
    const matchesFilter = queryFilter === 'all' ? true : q.status === queryFilter;
    const matchesSearch =
      q.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ADMIN SIDEBAR */}
      <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-6 hidden md:block">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Knowledge Desk</span>
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate">
            AIDS Department
          </h2>
          <p className="text-[11px] text-slate-500 truncate">{user?.name || 'Administrator'}</p>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="space-y-1 text-xs">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'queries', label: 'Student Queries', icon: MessageSquare, count: queries.length },
            { id: 'faculty_mgmt', label: 'Faculty Directory Management', icon: Users, count: faculty.length },
            { id: 'subjects_mgmt', label: 'Academic Subjects', icon: BookOpen, count: subjects.length },
            { id: 'sem3', label: 'Semester III', icon: Layers },
            { id: 'sem4', label: 'Semester IV', icon: Calendar },
            { id: 'electives', label: 'Elective Management', icon: Filter },
            { id: 'faqs', label: 'FAQ Management', icon: HelpCircle, count: faqs.length },
            { id: 'kb', label: 'Chatbot Knowledge Base', icon: Database, count: knowledge.length },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSearchTerm('');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 font-semibold border border-amber-200/80 dark:border-amber-900/60'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 shrink-0 text-slate-500" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Reset & Logout */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <button
            onClick={handleResetToOfficialData}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Official Data</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout from Admin</span>
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN WORKSPACE */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                AIDS Academic Knowledge Administration
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Departmental control center for curriculum databases, faculty rosters, and student query telemetry.
              </p>
            </div>

            {/* 4 Overview Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab('faculty_mgmt')}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Total Faculty Records
                  </span>
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {faculty.length}
                </div>
                <div className="text-[11px] text-emerald-600 mt-1">
                  Includes HOD &amp; Asst Professors
                </div>
              </div>

              <div
                onClick={() => setActiveTab('subjects_mgmt')}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Academic Subjects
                  </span>
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {subjects.length}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  FE, Sem III, Sem IV &amp; Additional
                </div>
              </div>

              <div
                onClick={() => setActiveTab('queries')}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Student Queries
                  </span>
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {queries.length}
                </div>
                <div className="text-[11px] text-blue-600 mt-1">
                  Active query log
                </div>
              </div>

              <div
                onClick={() => setActiveTab('kb')}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Knowledge Base Entries
                  </span>
                  <Database className="w-4 h-4 text-violet-600" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {knowledge.length + faqs.length}
                </div>
                <div className="text-[11px] text-emerald-600 mt-1">
                  Verified college knowledge
                </div>
              </div>
            </div>

            {/* Recent Queries Preview */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Recent Student Questions
                </h3>
                <button
                  onClick={() => setActiveTab('queries')}
                  className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>View All Queries</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {queries.slice(0, 5).map(q => (
                  <div key={q.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {q.query}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {q.studentName} ({q.studentEmail}) &middot; {new Date(q.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        q.status === 'answered'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : q.status === 'flagged'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STUDENT QUERIES */}
        {activeTab === 'queries' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Student Queries &amp; Interactions
                </h2>
                <p className="text-xs text-slate-500">
                  Review questions asked by students to detect curriculum bottlenecks and gaps.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
                  {(['all', 'answered', 'flagged', 'reviewed'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setQueryFilter(s)}
                      className={`px-3 py-1 rounded-lg capitalize font-medium transition-colors ${
                        queryFilter === s
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-500'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3.5">Student</th>
                      <th className="p-3.5">Question Asked</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Date &amp; Time</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredQueries.map(q => (
                      <tr key={q.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {q.studentName}
                          </div>
                          <div className="text-[10px] text-slate-400">{q.studentEmail}</div>
                        </td>
                        <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200 max-w-xs">
                          {q.query}
                        </td>
                        <td className="p-3.5 text-slate-500">{q.category || 'General'}</td>
                        <td className="p-3.5 text-slate-400 whitespace-nowrap">
                          {new Date(q.timestamp).toLocaleString()}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                              q.status === 'answered'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : q.status === 'flagged'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            }`}
                          >
                            {q.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <button
                            onClick={() => {
                              storageService.updateQueryStatus(q.id, 'reviewed');
                              setQueries(storageService.getQueries());
                              showToast('Marked as reviewed');
                            }}
                            className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline mr-2"
                          >
                            Mark Reviewed
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SUBJECT MANAGEMENT (or Sem3 / Sem4 / Electives views) */}
        {(activeTab === 'subjects_mgmt' ||
          activeTab === 'sem3' ||
          activeTab === 'sem4' ||
          activeTab === 'electives') && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {activeTab === 'sem3'
                    ? 'Semester III Subject Management'
                    : activeTab === 'sem4'
                    ? 'Semester IV Subject Management'
                    : activeTab === 'electives'
                    ? 'Elective Subject Management'
                    : 'Academic Subjects Directory'}
                </h2>
                <p className="text-xs text-slate-500">
                  Update course codes, course types, laboratory linkages, and descriptions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleOpenAddSubject(
                      activeTab === 'sem3'
                        ? 'Semester III'
                        : activeTab === 'sem4'
                        ? 'Semester IV'
                        : 'Semester III'
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Subject</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3.5">Code</th>
                      <th className="p-3.5">Subject Name</th>
                      <th className="p-3.5">Semester</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Credits / Lab</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredSubjects.map(sub => (
                      <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                        <td className="p-3.5 font-mono font-bold text-blue-700 dark:text-blue-400">
                          {sub.code}
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {sub.name}
                          </div>
                          {sub.description && (
                            <div className="text-[10px] text-slate-500 line-clamp-1 max-w-sm">
                              {sub.description}
                            </div>
                          )}
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300">{sub.semester}</td>
                        <td className="p-3.5">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                              sub.type === 'laboratory'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : sub.type === 'elective'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            }`}
                          >
                            {sub.type}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500">
                          {sub.credits ? `${sub.credits} Cr` : '-'}
                          {sub.hasPractical ? ' · Lab' : ''}
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleOpenEditSubject(sub)}
                            className="p-1 text-slate-500 hover:text-blue-600 mr-2"
                            title="Edit Subject"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTarget({ type: 'subject', id: sub.id, name: sub.name });
                              setIsDeleteConfirmOpen(true);
                            }}
                            className="p-1 text-slate-500 hover:text-rose-600"
                            title="Delete Subject"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FACULTY MANAGEMENT */}
        {activeTab === 'faculty_mgmt' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Faculty Directory Management
                </h2>
                <p className="text-xs text-slate-500">
                  Update faculty qualifications, designations, experience records, and institutional emails.
                </p>
              </div>

              <button
                onClick={handleOpenAddFaculty}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Faculty Member</span>
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3.5">Name</th>
                      <th className="p-3.5">Designation</th>
                      <th className="p-3.5">Qualifications</th>
                      <th className="p-3.5">Teaching Exp</th>
                      <th className="p-3.5">Industry Exp</th>
                      <th className="p-3.5">Official Email</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredFaculty.map(fac => (
                      <tr key={fac.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{fac.name}</span>
                            {fac.isHod && (
                              <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                HOD
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5 text-blue-700 dark:text-blue-400 font-medium">
                          {fac.designation}
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300">{fac.qualification}</td>
                        <td className="p-3.5 text-slate-800 dark:text-slate-200 font-medium">
                          {fac.teachingExperience}
                        </td>
                        <td className="p-3.5 text-indigo-600 dark:text-indigo-400 font-medium">
                          {fac.industryExperience || '-'}
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-slate-500">
                          {fac.email}
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleOpenEditFaculty(fac)}
                            className="p-1 text-slate-500 hover:text-blue-600 mr-2"
                            title="Edit Faculty"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTarget({ type: 'faculty', id: fac.id, name: fac.name });
                              setIsDeleteConfirmOpen(true);
                            }}
                            className="p-1 text-slate-500 hover:text-rose-600"
                            title="Delete Faculty"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: FAQ & KNOWLEDGE BASE */}
        {(activeTab === 'faqs' || activeTab === 'kb') && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Chatbot Knowledge Base &amp; FAQ Management
              </h2>
              <p className="text-xs text-slate-500">
                Official approved answers and departmental facts utilized by the conversational AI assistant.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs.map(faq => (
                <div
                  key={faq.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-blue-600">{faq.category}</span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6 animate-in fade-in duration-200">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              System Settings &amp; Data Control
            </h2>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Prototype Knowledge Storage
                </span>
                <p className="text-slate-500">
                  Data modified in this panel persists immediately to local storage and updates the student AI assistant in real-time.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    Restore Official AIDS Curriculum
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Reset all subjects and 12 faculty profiles to official defaults.
                  </span>
                </div>
                <button
                  onClick={handleResetToOfficialData}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-semibold hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  Reset Defaults
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ADD/EDIT SUBJECT MODAL */}
      <Modal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        title={editingSubject ? 'Edit Academic Subject' : 'Add Academic Subject'}
        subtitle="Artificial Intelligence & Data Science Curriculum"
      >
        <form onSubmit={handleSaveSubject} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Course Code
              </label>
              <input
                type="text"
                value={subjectFormData.code}
                onChange={e => setSubjectFormData({ ...subjectFormData, code: e.target.value })}
                placeholder="e.g. ADS01201"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Semester Allocation
              </label>
              <select
                value={subjectFormData.semester}
                onChange={e =>
                  setSubjectFormData({
                    ...subjectFormData,
                    semester: e.target.value as AcademicSubject['semester'],
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Semester III">Semester III</option>
                <option value="Semester IV">Semester IV</option>
                <option value="First Year">First Year</option>
                <option value="Additional">Additional Curriculum</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subject Name
            </label>
            <input
              type="text"
              value={subjectFormData.name}
              onChange={e => setSubjectFormData({ ...subjectFormData, name: e.target.value })}
              placeholder="e.g. Operating System"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Course Classification
              </label>
              <select
                value={subjectFormData.type}
                onChange={e =>
                  setSubjectFormData({
                    ...subjectFormData,
                    type: e.target.value as CourseType,
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="core">Core Theory Subject</option>
                <option value="laboratory">Laboratory Course</option>
                <option value="elective">Elective Option</option>
                <option value="first_year">First Year</option>
                <option value="additional">Additional Course</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Credits
              </label>
              <input
                type="number"
                value={subjectFormData.credits}
                onChange={e =>
                  setSubjectFormData({ ...subjectFormData, credits: Number(e.target.value) })
                }
                min={1}
                max={5}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Course Description &amp; Syllabus Overview
            </label>
            <textarea
              value={subjectFormData.description}
              onChange={e => setSubjectFormData({ ...subjectFormData, description: e.target.value })}
              rows={3}
              placeholder="Course contents, topics covered, learning outcomes..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSubjectModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs"
            >
              Save Subject
            </button>
          </div>
        </form>
      </Modal>

      {/* ADD/EDIT FACULTY MODAL */}
      <Modal
        isOpen={isFacultyModalOpen}
        onClose={() => setIsFacultyModalOpen(false)}
        title={editingFaculty ? 'Edit Faculty Record' : 'Add Faculty Member'}
        subtitle="AIDS Department Roster"
      >
        <form onSubmit={handleSaveFaculty} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={facultyFormData.name}
              onChange={e => setFacultyFormData({ ...facultyFormData, name: e.target.value })}
              placeholder="e.g. Prof. Mrs. Jane Doe"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Designation
              </label>
              <input
                type="text"
                value={facultyFormData.designation}
                onChange={e =>
                  setFacultyFormData({ ...facultyFormData, designation: e.target.value })
                }
                placeholder="Assistant Professor / HOD"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Qualification
              </label>
              <input
                type="text"
                value={facultyFormData.qualification}
                onChange={e =>
                  setFacultyFormData({ ...facultyFormData, qualification: e.target.value })
                }
                placeholder="e.g. M.E. (Computer Engineering)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Teaching Experience
              </label>
              <input
                type="text"
                value={facultyFormData.teachingExperience}
                onChange={e =>
                  setFacultyFormData({ ...facultyFormData, teachingExperience: e.target.value })
                }
                placeholder="e.g. 5.5 Years"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Industry Experience (optional)
              </label>
              <input
                type="text"
                value={facultyFormData.industryExperience}
                onChange={e =>
                  setFacultyFormData({ ...facultyFormData, industryExperience: e.target.value })
                }
                placeholder="e.g. 2 Years"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Official Email Address
            </label>
            <input
              type="email"
              value={facultyFormData.email}
              onChange={e => setFacultyFormData({ ...facultyFormData, email: e.target.value })}
              placeholder="faculty@moderncoe.edu.in"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              required
            />
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={facultyFormData.isHod}
                onChange={e => setFacultyFormData({ ...facultyFormData, isHod: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Mark as Head of Department (HOD)
              </span>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsFacultyModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs"
            >
              Save Faculty
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE MODAL */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Confirm Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <div className="flex items-start gap-3 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p>
              Are you sure you want to delete{' '}
              <strong className="text-slate-900 dark:text-white">{deleteTarget?.name}</strong>?
              This action updates the academic knowledge base immediately.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
