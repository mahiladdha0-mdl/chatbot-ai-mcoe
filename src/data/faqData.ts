import { FAQItem, KnowledgeItem } from '../types';

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What are the elective options in Semester III?',
    answer: 'In Semester III (AIDS), students have two elective alternatives: E-Business and Retailing (OEL11201A) or Financial Management (OEL11201B). Please confirm which elective you are enrolled in with the department coordinator.',
    category: 'Electives',
    keywords: ['elective', 'sem 3', 'semester 3', 'third semester', 'financial management', 'e-business'],
  },
  {
    id: 'faq-2',
    question: 'What are the elective options in Semester IV?',
    answer: 'In Semester IV (AIDS), the elective options provided in the curriculum are IT Act and Cyber Laws (OEL11251A) or Human Resource Management (HRM) (OEL11251B).',
    category: 'Electives',
    keywords: ['elective', 'sem 4', 'semester 4', 'fourth semester', 'cyber law', 'hrm'],
  },
  {
    id: 'faq-3',
    question: 'Who is the Head of Department for Artificial Intelligence & Data Science?',
    answer: 'Prof. Dr. S. V. Pandit is the Head of Department (HOD) of AIDS. Qualifications: M.E., Ph.D. with over 23+ years of teaching experience. Official Email: hodads@moderncoe.edu.in.',
    category: 'Faculty',
    keywords: ['hod', 'head of department', 'pandit', 's v pandit', 'aids hod'],
  },
  {
    id: 'faq-4',
    question: 'Which faculty members have prior industry experience?',
    answer: 'The following faculty members have documented industry experience: Mrs. Rucha Shaiva (1.5 Years), Ms. Bhagyashree P. Bendale (4 Years), Ms. Jagruti Patil (5 Years), Ms. Preeti Shankar Ramtekkar (3 Months), Prof. Mrs. Priyanka Deshpande (4 Years), and Prof. Mrs. Supriya Balote (2 Years).',
    category: 'Faculty',
    keywords: ['industry', 'experience', 'corporate', 'industry experience'],
  },
  {
    id: 'faq-5',
    question: 'Does Semester III have practical laboratory exams or sessions?',
    answer: 'Yes! Semester III includes four laboratory courses: Operating System Laboratory (ADS01201), Data Structures & Algorithms Laboratory (ADS01202), Object Oriented Programming Laboratory (ADS01203), and Digital Electronics & Logic Design Laboratory (MDM03201C).',
    category: 'Academics',
    keywords: ['practicals', 'laboratory', 'labs', 'practical courses', 'sem 3 lab'],
  },
  {
    id: 'faq-6',
    question: 'When will the semester examination timetable be published?',
    answer: 'I do not currently have verified examination timetable information. Please check the official Modern College notice boards, ERP portal, or contact your department for the latest exam schedules.',
    category: 'Exams',
    keywords: ['exam', 'timetable', 'examination date', 'insem', 'endsem', 'schedule'],
  },
  {
    id: 'faq-7',
    question: 'What is Artificial Intelligence and Data Science (AIDS)?',
    answer: 'Artificial Intelligence and Data Science is a multidisciplinary engineering branch combining foundational computer science, machine learning, statistics, data analytics, and algorithmic decision systems to build intelligent software.',
    category: 'General',
    keywords: ['aids', 'what is aids', 'artificial intelligence', 'data science', 'branch'],
  },
];

export const INITIAL_KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    id: 'kb-1',
    topic: 'College Identity & Location',
    content: 'Progressive Education Society’s Modern College of Engineering is located in Shivajinagar, Pune, Maharashtra. The AI & Data Science department is established to foster cutting-edge education in artificial intelligence, deep learning, and data analytics.',
    category: 'General',
    verified: true,
    updatedAt: '2026-09-29',
  },
  {
    id: 'kb-2',
    topic: 'Exam and Mark Policies Notice',
    content: 'Official examination dates, hall tickets, internal evaluation marks, and semester fees are published exclusively through the Savitribai Phule Pune University (SPPU) examination portal and college notice boards. The assistant does not generate unverified dates.',
    category: 'Exams',
    verified: true,
    updatedAt: '2026-09-29',
  },
  {
    id: 'kb-3',
    topic: 'Curriculum Code Uniformity Note',
    content: 'Notice on curriculum course codes: Core theory subjects and their corresponding laboratory courses share identical parent codes in the curriculum excerpt (e.g., ADS01201 for both OS and OS Lab). These are presented exactly as provided in the curriculum excerpt.',
    category: 'Curriculum',
    verified: true,
    updatedAt: '2026-09-29',
  },
  {
    id: 'kb-4',
    topic: 'Additional Curriculum Courses',
    content: 'Courses listed under Additional Curriculum: Java Programming (ADS05251), Professional Development Training (AEC04251), Entrepreneurship Development (EEM04252), and Environmental Studies (VEC04253). Official semester allocation is pending confirmation.',
    category: 'Curriculum',
    verified: true,
    updatedAt: '2026-09-29',
  },
];
