import {
  AcademicSubject,
  FacultyMember,
  StudentQueryRecord,
  FAQItem,
  KnowledgeItem,
  Conversation,
  User,
  TeachingAllocation,
} from '../types';
import { INITIAL_ACADEMIC_SUBJECTS } from '../data/academicData';
import { INITIAL_FACULTY_DATA } from '../data/facultyData';
import { INITIAL_FAQS, INITIAL_KNOWLEDGE_BASE } from '../data/faqData';
import { INITIAL_TEACHING_ALLOCATIONS } from '../data/teachingAllocationData';

const KEYS = {
  SUBJECTS: 'mc_aids_subjects_v1',
  FACULTY: 'mc_aids_faculty_v1',
  ALLOCATIONS: 'mc_aids_allocations_v1',
  FAQS: 'mc_aids_faqs_v1',
  KNOWLEDGE: 'mc_aids_kb_v1',
  QUERIES: 'mc_aids_queries_v1',
  CONVERSATIONS: 'mc_aids_conversations_v1',
  USER: 'mc_aids_current_user_v1',
  THEME: 'mc_aids_theme_v1',
};

// Seed sample queries so admin has realistic records immediately
const DEFAULT_STUDENT_QUERIES: StudentQueryRecord[] = [
  {
    id: 'sq-1',
    studentName: 'Rohan Sharma',
    studentEmail: 'rohan.sharma@moderncoe.edu.in',
    query: 'What subjects do I have in Semester III?',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'answered',
    category: 'Academics',
    responseSnippet: 'Listed 13 Semester III subjects including OS, DSA, OOP, and DELD.',
  },
  {
    id: 'sq-2',
    studentName: 'Priya Kulkarni',
    studentEmail: 'priya.k@moderncoe.edu.in',
    query: 'Who is the HOD of AIDS?',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'answered',
    category: 'Faculty',
    responseSnippet: 'Prof. Dr. S. V. Pandit, M.E., Ph.D. (hodads@moderncoe.edu.in)',
  },
  {
    id: 'sq-3',
    studentName: 'Amit Deshmukh',
    studentEmail: 'amit.d@moderncoe.edu.in',
    query: 'What electives can I choose in Semester IV?',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'reviewed',
    category: 'Electives',
    responseSnippet: 'IT Act and Cyber Laws OR Human Resource Management (HRM).',
  },
  {
    id: 'sq-4',
    studentName: 'Sneha Joshi',
    studentEmail: 'sneha.j@moderncoe.edu.in',
    query: 'Does Object Oriented Programming have a practical lab?',
    timestamp: new Date(Date.now() - 3600000 * 30).toISOString(),
    status: 'answered',
    category: 'Academics',
    responseSnippet: 'Yes, ADS01203 Object Oriented Programming Laboratory.',
  },
  {
    id: 'sq-5',
    studentName: 'Tanmay Patil',
    studentEmail: 'tanmay.p@moderncoe.edu.in',
    query: 'When is the in-sem exam scheduled?',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
    status: 'flagged',
    category: 'Exams',
    responseSnippet: 'Timetable unverified notice returned. Directs student to college ERP.',
  },
];

export const storageService = {
  // Current User
  getUser(): User | null {
    try {
      const data = localStorage.getItem(KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setUser(user: User | null): void {
    if (user) {
      localStorage.setItem(KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.USER);
    }
  },

  // Subjects
  getSubjects(): AcademicSubject[] {
    try {
      const stored = localStorage.getItem(KEYS.SUBJECTS);
      if (!stored) {
        localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(INITIAL_ACADEMIC_SUBJECTS));
        return INITIAL_ACADEMIC_SUBJECTS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_ACADEMIC_SUBJECTS;
    }
  },
  saveSubjects(subjects: AcademicSubject[]): void {
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(subjects));
  },
  resetSubjects(): AcademicSubject[] {
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(INITIAL_ACADEMIC_SUBJECTS));
    return INITIAL_ACADEMIC_SUBJECTS;
  },

  // Faculty
  getFaculty(): FacultyMember[] {
    try {
      const stored = localStorage.getItem(KEYS.FACULTY);
      if (!stored) {
        localStorage.setItem(KEYS.FACULTY, JSON.stringify(INITIAL_FACULTY_DATA));
        return INITIAL_FACULTY_DATA;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_FACULTY_DATA;
    }
  },
  saveFaculty(faculty: FacultyMember[]): void {
    localStorage.setItem(KEYS.FACULTY, JSON.stringify(faculty));
  },
  resetFaculty(): FacultyMember[] {
    localStorage.setItem(KEYS.FACULTY, JSON.stringify(INITIAL_FACULTY_DATA));
    return INITIAL_FACULTY_DATA;
  },

  // Teaching Allocations
  getAllocations(): TeachingAllocation[] {
    try {
      const stored = localStorage.getItem(KEYS.ALLOCATIONS);
      if (!stored) {
        localStorage.setItem(KEYS.ALLOCATIONS, JSON.stringify(INITIAL_TEACHING_ALLOCATIONS));
        return INITIAL_TEACHING_ALLOCATIONS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_TEACHING_ALLOCATIONS;
    }
  },
  saveAllocations(allocations: TeachingAllocation[]): void {
    localStorage.setItem(KEYS.ALLOCATIONS, JSON.stringify(allocations));
  },
  resetAllocations(): TeachingAllocation[] {
    localStorage.setItem(KEYS.ALLOCATIONS, JSON.stringify(INITIAL_TEACHING_ALLOCATIONS));
    return INITIAL_TEACHING_ALLOCATIONS;
  },

  // FAQs
  getFAQs(): FAQItem[] {
    try {
      const stored = localStorage.getItem(KEYS.FAQS);
      if (!stored) {
        localStorage.setItem(KEYS.FAQS, JSON.stringify(INITIAL_FAQS));
        return INITIAL_FAQS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_FAQS;
    }
  },
  saveFAQs(faqs: FAQItem[]): void {
    localStorage.setItem(KEYS.FAQS, JSON.stringify(faqs));
  },

  // Knowledge Base
  getKnowledge(): KnowledgeItem[] {
    try {
      const stored = localStorage.getItem(KEYS.KNOWLEDGE);
      if (!stored) {
        localStorage.setItem(KEYS.KNOWLEDGE, JSON.stringify(INITIAL_KNOWLEDGE_BASE));
        return INITIAL_KNOWLEDGE_BASE;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_KNOWLEDGE_BASE;
    }
  },
  saveKnowledge(kb: KnowledgeItem[]): void {
    localStorage.setItem(KEYS.KNOWLEDGE, JSON.stringify(kb));
  },

  // Student Queries Log
  getQueries(): StudentQueryRecord[] {
    try {
      const stored = localStorage.getItem(KEYS.QUERIES);
      if (!stored) {
        localStorage.setItem(KEYS.QUERIES, JSON.stringify(DEFAULT_STUDENT_QUERIES));
        return DEFAULT_STUDENT_QUERIES;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_STUDENT_QUERIES;
    }
  },
  addQuery(record: Omit<StudentQueryRecord, 'id' | 'timestamp'>): StudentQueryRecord {
    const list = this.getQueries();
    const newRecord: StudentQueryRecord = {
      ...record,
      id: 'sq-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
    };
    list.unshift(newRecord);
    localStorage.setItem(KEYS.QUERIES, JSON.stringify(list));
    return newRecord;
  },
  updateQueryStatus(id: string, status: StudentQueryRecord['status']): void {
    const list = this.getQueries();
    const idx = list.findIndex(q => q.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      localStorage.setItem(KEYS.QUERIES, JSON.stringify(list));
    }
  },

  // Conversations (isolated by student ID)
  getConversations(studentId: string): Conversation[] {
    try {
      const stored = localStorage.getItem(KEYS.CONVERSATIONS);
      const all: Conversation[] = stored ? JSON.parse(stored) : [];
      return all.filter(c => c.studentId === studentId);
    } catch {
      return [];
    }
  },
  saveConversation(conv: Conversation): void {
    try {
      const stored = localStorage.getItem(KEYS.CONVERSATIONS);
      const all: Conversation[] = stored ? JSON.parse(stored) : [];
      const idx = all.findIndex(c => c.id === conv.id);
      if (idx !== -1) {
        all[idx] = { ...conv, updatedAt: new Date().toISOString() };
      } else {
        all.unshift(conv);
      }
      localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(all));
    } catch (e) {
      console.error('Failed to save conversation:', e);
    }
  },
  deleteConversation(id: string): void {
    try {
      const stored = localStorage.getItem(KEYS.CONVERSATIONS);
      const all: Conversation[] = stored ? JSON.parse(stored) : [];
      const filtered = all.filter(c => c.id !== id);
      localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to delete conversation:', e);
    }
  },
  renameConversation(id: string, newTitle: string): void {
    try {
      const stored = localStorage.getItem(KEYS.CONVERSATIONS);
      const all: Conversation[] = stored ? JSON.parse(stored) : [];
      const c = all.find(item => item.id === id);
      if (c) {
        c.title = newTitle;
        c.updatedAt = new Date().toISOString();
        localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(all));
      }
    } catch (e) {
      console.error('Failed to rename conversation:', e);
    }
  },
};
