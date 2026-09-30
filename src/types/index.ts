export type Role = 'student' | 'admin' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  semester?: string;
  avatar?: string;
}

export type CourseType = 'core' | 'laboratory' | 'elective' | 'first_year' | 'additional';

export interface AcademicSubject {
  id: string;
  code: string;
  name: string;
  semester: 'First Year' | 'Semester III' | 'Semester IV' | 'Additional';
  type: CourseType;
  department: string;
  description?: string;
  credits?: number;
  hasPractical?: boolean;
  notes?: string;
  electiveGroup?: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  teachingExperience: string; // e.g. "23+ Years", "5.5 Years"
  industryExperience?: string; // e.g. "4 Years", "3 Months"
  email: string;
  isHod?: boolean;
  specialization?: string[];
  initials?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  subjectCards?: AcademicSubject[];
  facultyCards?: FacultyMember[];
  suggestedFollowUps?: string[];
  intent?: string;
  isError?: boolean;
}

export interface Conversation {
  id: string;
  studentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  context?: {
    lastSubjectId?: string;
    lastSemester?: string;
    lastFacultyId?: string;
    topic?: string;
  };
}

export interface StudentQueryRecord {
  id: string;
  studentName: string;
  studentEmail: string;
  query: string;
  timestamp: string;
  status: 'answered' | 'flagged' | 'reviewed';
  category?: string;
  responseSnippet?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Academics' | 'Faculty' | 'Exams' | 'Electives' | 'General';
  keywords: string[];
}

export interface KnowledgeItem {
  id: string;
  topic: string;
  content: string;
  category: string;
  verified: boolean;
  updatedAt: string;
}
