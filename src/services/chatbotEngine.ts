import { AcademicSubject, FacultyMember, ChatMessage } from '../types';
import { storageService } from './storageService';

export interface ChatResponse {
  text: string;
  subjectCards?: AcademicSubject[];
  facultyCards?: FacultyMember[];
  suggestedFollowUps?: string[];
  intent?: string;
  contextUpdates?: {
    lastSemester?: string;
    lastSubjectId?: string;
    lastFacultyId?: string;
    topic?: string;
  };
}

export function processUserQuery(
  rawInput: string,
  history: ChatMessage[] = [],
  activeContext: {
    lastSemester?: string;
    lastSubjectId?: string;
    lastFacultyId?: string;
    topic?: string;
  } = {}
): ChatResponse {
  const query = rawInput.trim();
  const lower = query.toLowerCase();

  // Load fresh dynamic data from storage
  const allSubjects = storageService.getSubjects();
  const allFaculty = storageService.getFaculty();
  const allFaqs = storageService.getFAQs();
  const sem3Subjects = allSubjects.filter(s => s.semester === 'Semester III');
  const sem4Subjects = allSubjects.filter(s => s.semester === 'Semester IV');
  const firstYearSubjects = allSubjects.filter(s => s.semester === 'First Year');
  const additionalSubjects = allSubjects.filter(s => s.semester === 'Additional');
  const hod = allFaculty.find(f => f.isHod || f.designation.toLowerCase().includes('head'));

  // 1. GREETINGS & INTRODUCTIONS
  if (/^(hi|hello|hey|namaste|good morning|good afternoon|good evening|yo)\b/i.test(lower) && lower.length < 20) {
    return {
      text: "Hello! I'm your Modern College AI Assistant for the Artificial Intelligence & Data Science (AIDS) department. I can help you with your semester syllabus, subjects, laboratory practicals, electives, and faculty directory. What would you like to explore?",
      suggestedFollowUps: [
        'What subjects do I have in Semester III?',
        'What subjects do I have in Semester IV?',
        'Who is the HOD of AIDS?',
        'Show me the faculty directory',
      ],
      intent: 'greeting',
    };
  }

  // 2. STUDENT CONTEXT / SELF DECLARATION
  // "I'm a second-year AIDS student", "I am in second year", "I'm in SE"
  if (/i('m| am) a? ?(second[- ]year|2nd[- ]year|se|third[- ]year|3rd[- ]year|first[- ]year|fe) (aids|ai & ds|engineering)? ?student/i.test(lower) ||
      /i('m| am) in (second[- ]year|2nd[- ]year|se aids)/i.test(lower)) {
    return {
      text: "Great! Welcome! As a second-year Artificial Intelligence & Data Science student at Modern College, you are exploring Semester III and Semester IV courses. I can help you with your semester curriculum, theory subjects, lab practicals, electives, and faculty members.\n\nWhat would you like to know?",
      suggestedFollowUps: [
        'What subjects do I have in third semester?',
        'What subjects do I have in fourth semester?',
        'What are my Semester III electives?',
        'Who teaches in our department?',
      ],
      intent: 'student_onboarding',
      contextUpdates: { topic: 'second_year' },
    };
  }

  // 3. UNVERIFIED / POLICY QUESTIONS (Strict Boundary: exam dates, marks, fees, timetable)
  if (/(exam date|examination date|when (is|are) (the )?exam|insem date|endsem date|timetable|exam schedule|fees structure|attendance criteria|hall ticket)/i.test(lower)) {
    return {
      text: "I don't currently have verified examination timetable or fee schedule information. Please check the official college notice boards, ERP portal, or contact the AIDS department office for the latest verified schedule.",
      suggestedFollowUps: [
        'What subjects do I have in Semester III?',
        'What subjects do I have in Semester IV?',
        'Who is the HOD of AIDS?',
      ],
      intent: 'unverified_policy',
    };
  }

  // 3.5. FACULTY–SUBJECT–DIVISION TEACHING ALLOCATION
  // Helper to find specific faculty member card
  const findFaculty = (nameMatch: string): FacultyMember | undefined => {
    const clean = nameMatch.toLowerCase();
    return allFaculty.find(f => f.name.toLowerCase().includes(clean));
  };

  const isTeacherQuery =
    /who (teaches|takes|conducts|handles|is teaching|is the teacher for)|who is (my|the|our) .* (teacher|faculty|professor)|(teacher|faculty|professor) for|who takes/i.test(lower) ||
    /who (teaches|takes)/i.test(lower);

  const isDivA = /\b(a division|division a|div a|to a division|for a division|in a division)\b/i.test(lower);
  const isDivB = /\b(b division|division b|div b|to b division|for b division|in b division)\b/i.test(lower);
  const isPractical = /\b(practical|practicals|lab|laboratory|practicle)\b/i.test(lower);

  // A. Operating System (OS)
  const isOs = /\b(os|operating system|operating systems)\b/i.test(lower);
  if (isOs && (isTeacherQuery || /teacher|who/i.test(lower))) {
    if (isPractical) {
      const facSurana = findFaculty('Surana') || findFaculty('Lekha');
      if (isDivA) {
        return {
          text: "Operating System practical for A Division is conducted by Ms. Lekha Ishwarwal Surana.",
          facultyCards: facSurana ? [facSurana] : undefined,
          suggestedFollowUps: ['Who teaches Operating System?', 'Who teaches DSA practical?', 'Who is the HOD of AIDS?'],
          intent: 'teaching_allocation_os_lab_a',
          contextUpdates: { lastSubjectId: 'sem3-os-lab', lastFacultyId: facSurana?.id },
        };
      }
      if (isDivB) {
        return {
          text: "Operating System practical for B Division is conducted by Ms. Lekha Ishwarwal Surana.",
          facultyCards: facSurana ? [facSurana] : undefined,
          suggestedFollowUps: ['Who teaches Operating System?', 'Who teaches DSA practical?', 'Who is the HOD of AIDS?'],
          intent: 'teaching_allocation_os_lab_b',
          contextUpdates: { lastSubjectId: 'sem3-os-lab', lastFacultyId: facSurana?.id },
        };
      }
      return {
        text: "Operating System practical is handled by Ms. Lekha Ishwarwal Surana for both A and B divisions.",
        facultyCards: facSurana ? [facSurana] : undefined,
        suggestedFollowUps: ['Who teaches Operating System?', 'Who teaches OS to A division?', 'Who teaches DSA practical?'],
        intent: 'teaching_allocation_os_lab',
        contextUpdates: { lastSubjectId: 'sem3-os-lab', lastFacultyId: facSurana?.id },
      };
    }

    // OS Theory
    const facAlice = findFaculty('Alice') || findFaculty('Marshal');
    if (isDivA) {
      return {
        text: "Operating System for A Division is taught by Ms. Alice Mary Marshal Rajan.",
        facultyCards: facAlice ? [facAlice] : undefined,
        suggestedFollowUps: ['Who teaches OS to B division?', 'Who teaches OS practical?', 'Who teaches OOP?'],
        intent: 'teaching_allocation_os_a',
        contextUpdates: { lastSubjectId: 'sem3-os', lastFacultyId: facAlice?.id },
      };
    }
    if (isDivB) {
      return {
        text: "Operating System for B Division is taught by Ms. Alice Mary Marshal Rajan.",
        facultyCards: facAlice ? [facAlice] : undefined,
        suggestedFollowUps: ['Who teaches OS to A division?', 'Who teaches OS practical?', 'Who teaches OOP?'],
        intent: 'teaching_allocation_os_b',
        contextUpdates: { lastSubjectId: 'sem3-os', lastFacultyId: facAlice?.id },
      };
    }
    return {
      text: "Operating System is taught by Ms. Alice Mary Marshal Rajan for both A and B divisions.",
      facultyCards: facAlice ? [facAlice] : undefined,
      suggestedFollowUps: ['Who teaches OS to A division?', 'Who teaches OS practical?', 'Who teaches OOP?'],
      intent: 'teaching_allocation_os',
      contextUpdates: { lastSubjectId: 'sem3-os', lastFacultyId: facAlice?.id },
    };
  }

  // B. Object Oriented Programming (OOP)
  const isOop = /\b(oop|oops|object oriented programming)\b/i.test(lower);
  if (isOop && (isTeacherQuery || /teacher|who/i.test(lower))) {
    const facBendale = findFaculty('Bendale') || findFaculty('Bhagyashree');
    if (isPractical) {
      return {
        text: "Object Oriented Programming (OOP) practical is handled by Ms. Bhagyashree P. Bendale for both A and B divisions.",
        facultyCards: facBendale ? [facBendale] : undefined,
        suggestedFollowUps: ['Who teaches OOP?', 'Who teaches OS practical?', 'Who teaches DSA practical?'],
        intent: 'teaching_allocation_oop_lab',
        contextUpdates: { lastSubjectId: 'sem3-oop-lab', lastFacultyId: facBendale?.id },
      };
    }

    if (isDivA) {
      return {
        text: "OOP for A Division is taught by Ms. Bhagyashree P. Bendale.",
        facultyCards: facBendale ? [facBendale] : undefined,
        suggestedFollowUps: ['Who is my OOP teacher in B division?', 'Who teaches Operating System?', 'Who teaches DSA?'],
        intent: 'teaching_allocation_oop_a',
        contextUpdates: { lastSubjectId: 'sem3-oop', lastFacultyId: facBendale?.id },
      };
    }
    if (isDivB) {
      return {
        text: "OOP for B Division is taught by Ms. Bhagyashree P. Bendale.",
        facultyCards: facBendale ? [facBendale] : undefined,
        suggestedFollowUps: ['Who teaches OOP to A division?', 'Who teaches Operating System?', 'Who teaches DSA?'],
        intent: 'teaching_allocation_oop_b',
        contextUpdates: { lastSubjectId: 'sem3-oop', lastFacultyId: facBendale?.id },
      };
    }
    return {
      text: "Object Oriented Programming (OOP) is taught by Ms. Bhagyashree P. Bendale for both A and B divisions.",
      facultyCards: facBendale ? [facBendale] : undefined,
      suggestedFollowUps: ['Who teaches OOP to A division?', 'Who teaches Operating System?', 'Who teaches DSA?'],
      intent: 'teaching_allocation_oop',
      contextUpdates: { lastSubjectId: 'sem3-oop', lastFacultyId: facBendale?.id },
    };
  }

  // C. Data Structures and Algorithms (DSA)
  const isDsa = /\b(dsa|data structures|data structure and algorithms|data structures & algorithms)\b/i.test(lower);
  if (isDsa && (isTeacherQuery || /teacher|who/i.test(lower))) {
    if (isPractical) {
      const facRamtekkar = findFaculty('Ramtekkar') || findFaculty('Preeti');
      return {
        text: "Data Structures & Algorithms (DSA) practical is handled by Ms. Preeti Shankar Ramtekkar for both A and B divisions.",
        facultyCards: facRamtekkar ? [facRamtekkar] : undefined,
        suggestedFollowUps: ['Who teaches DSA?', 'Who teaches OS practical?', 'Who teaches OOP?'],
        intent: 'teaching_allocation_dsa_lab',
        contextUpdates: { lastSubjectId: 'sem3-dsa-lab', lastFacultyId: facRamtekkar?.id },
      };
    }

    if (isDivA) {
      const facRamtekkar = findFaculty('Ramtekkar') || findFaculty('Preeti');
      return {
        text: "DSA for A Division is taught by Ms. Preeti Shankar Ramtekkar.",
        facultyCards: facRamtekkar ? [facRamtekkar] : undefined,
        suggestedFollowUps: ['Who teaches DSA to B division?', 'Who teaches DSA practical?', 'Who teaches Operating System?'],
        intent: 'teaching_allocation_dsa_a',
        contextUpdates: { lastSubjectId: 'sem3-dsa', lastFacultyId: facRamtekkar?.id },
      };
    }
    if (isDivB) {
      const facMalkhede = findFaculty('Malkhede') || findFaculty('Priti');
      return {
        text: "DSA for B Division is taught by Prof. Mrs. Priti Malkhede.",
        facultyCards: facMalkhede ? [facMalkhede] : undefined,
        suggestedFollowUps: ['Who teaches DSA to A division?', 'Who teaches DSA practical?', 'Who teaches Operating System?'],
        intent: 'teaching_allocation_dsa_b',
        contextUpdates: { lastSubjectId: 'sem3-dsa', lastFacultyId: facMalkhede?.id },
      };
    }

    const facRamtekkar = findFaculty('Ramtekkar') || findFaculty('Preeti');
    const facMalkhede = findFaculty('Malkhede') || findFaculty('Priti');
    const cards = [facRamtekkar, facMalkhede].filter(Boolean) as FacultyMember[];
    return {
      text: "For DSA, A Division is taught by Ms. Preeti Shankar Ramtekkar, while B Division is taught by Prof. Mrs. Priti Malkhede.",
      facultyCards: cards.length > 0 ? cards : undefined,
      suggestedFollowUps: ['Who takes DSA for A division?', 'Who teaches DSA to B division?', 'Who teaches DSA practical?'],
      intent: 'teaching_allocation_dsa',
      contextUpdates: { lastSubjectId: 'sem3-dsa' },
    };
  }

  // D. General Practical Sessions (Pure practicals query without a specific subject)
  const isGeneralPractical =
    (isPractical && !isOs && !isOop && !isDsa && !/deld|uhv|cep/i.test(lower)) &&
    (isTeacherQuery || /practical|who/i.test(lower));
  if (isGeneralPractical) {
    const facRamtekkar = findFaculty('Ramtekkar') || findFaculty('Preeti');
    if (isDivA) {
      return {
        text: "Ms. Preeti Shankar Ramtekkar handles the practical sessions for A Division.",
        facultyCards: facRamtekkar ? [facRamtekkar] : undefined,
        suggestedFollowUps: ['Who takes practical for B division?', 'Who teaches OS practical?', 'Who teaches OOP?'],
        intent: 'teaching_allocation_practical_a',
      };
    }
    if (isDivB) {
      return {
        text: "Ms. Preeti Shankar Ramtekkar handles the practical sessions for B Division.",
        facultyCards: facRamtekkar ? [facRamtekkar] : undefined,
        suggestedFollowUps: ['Who takes practical for A division?', 'Who teaches OS practical?', 'Who teaches OOP?'],
        intent: 'teaching_allocation_practical_b',
      };
    }
    return {
      text: "Ms. Preeti Shankar Ramtekkar handles the practical sessions for both A and B divisions.",
      facultyCards: facRamtekkar ? [facRamtekkar] : undefined,
      suggestedFollowUps: ['Who takes practical for A division?', 'Who takes practical for B division?', 'Who teaches OS practical?'],
      intent: 'teaching_allocation_practical_general',
    };
  }

  // E. Digital Electronics & Logic Design (DELD)
  const isDeld = /\b(deld|digital electronics|logic design)\b/i.test(lower);
  if (isDeld && (isTeacherQuery || /teacher|who/i.test(lower))) {
    const facGiri = findFaculty('Giri') || findFaculty('Madhuri');
    if (isPractical) {
      return {
        text: "Digital Electronics & Logic Design (DELD) practical sessions are conducted by Mrs. Madhuri Ash Giri for both A and B divisions.",
        facultyCards: facGiri ? [facGiri] : undefined,
        suggestedFollowUps: ['Who is my DELD teacher?', 'Who teaches Operating System?', 'Who teaches OOP?'],
        intent: 'teaching_allocation_deld_lab',
        contextUpdates: { lastSubjectId: 'sem3-deld-lab', lastFacultyId: facGiri?.id },
      };
    }
    if (isDivA) {
      return {
        text: "DELD for A Division is taught by Mrs. Madhuri Ash Giri.",
        facultyCards: facGiri ? [facGiri] : undefined,
        suggestedFollowUps: ['Who teaches DELD for B division?', 'Who teaches Operating System?', 'Who teaches OOP?'],
        intent: 'teaching_allocation_deld_a',
        contextUpdates: { lastSubjectId: 'sem3-deld', lastFacultyId: facGiri?.id },
      };
    }
    if (isDivB) {
      return {
        text: "DELD for B Division is taught by Mrs. Madhuri Ash Giri.",
        facultyCards: facGiri ? [facGiri] : undefined,
        suggestedFollowUps: ['Who teaches DELD for A division?', 'Who teaches Operating System?', 'Who teaches OOP?'],
        intent: 'teaching_allocation_deld_b',
        contextUpdates: { lastSubjectId: 'sem3-deld', lastFacultyId: facGiri?.id },
      };
    }
    return {
      text: "Digital Electronics & Logic Design (DELD) is taught by Mrs. Madhuri Ash Giri for both A and B divisions.",
      facultyCards: facGiri ? [facGiri] : undefined,
      suggestedFollowUps: ['Who teaches DELD practical?', 'Who teaches Operating System?', 'Who teaches OOP?'],
      intent: 'teaching_allocation_deld',
      contextUpdates: { lastSubjectId: 'sem3-deld', lastFacultyId: facGiri?.id },
    };
  }

  // F. Universal Human Values (UHV)
  const isUhv = /\b(uhv|universal human values|human values)\b/i.test(lower);
  if (isUhv && (isTeacherQuery || /teacher|who/i.test(lower))) {
    const facShaiva = findFaculty('Shaiva') || findFaculty('Rucha');
    if (isDivB) {
      return {
        text: "Universal Human Values (UHV) for B Division is taught by Mrs. Rucha Shaiva.",
        facultyCards: facShaiva ? [facShaiva] : undefined,
        suggestedFollowUps: ['Who teaches UHV for A division?', 'Who takes CEP for S3 and S4 batch?', 'Who is the HOD of AIDS?'],
        intent: 'teaching_allocation_uhv_b',
        contextUpdates: { lastSubjectId: 'sem3-uhv', lastFacultyId: facShaiva?.id },
      };
    }
    if (isDivA) {
      return {
        text: "Universal Human Values (UHV) for A Division is taught by Mrs. Rucha Shaiva.",
        facultyCards: facShaiva ? [facShaiva] : undefined,
        suggestedFollowUps: ['Who teaches UHV for B division?', 'Who takes CEP for S3 and S4 batch?', 'Who is the HOD of AIDS?'],
        intent: 'teaching_allocation_uhv_a',
        contextUpdates: { lastSubjectId: 'sem3-uhv', lastFacultyId: facShaiva?.id },
      };
    }
    return {
      text: "Universal Human Values (UHV) is taught by Mrs. Rucha Shaiva for both A and B divisions.",
      facultyCards: facShaiva ? [facShaiva] : undefined,
      suggestedFollowUps: ['Who teaches UHV for B division?', 'Who takes CEP for S3 and S4 batch?', 'Who is the HOD of AIDS?'],
      intent: 'teaching_allocation_uhv',
      contextUpdates: { lastSubjectId: 'sem3-uhv', lastFacultyId: facShaiva?.id },
    };
  }

  // G. Sustainability Awareness (CEP)
  const isCep = /\b(cep|sustainability|sustainability awareness)\b/i.test(lower);
  if (isCep && (isTeacherQuery || /batch|who/i.test(lower))) {
    const isS3S4 = /\b(s3 and s4|s3 & s4|s3, s4|s3|s4)\b/i.test(lower);
    const isS1S2 = /\b(s1 and s2|s1 & s2|s1, s2|s1|s2)\b/i.test(lower);

    if (isS3S4) {
      const facPatil = findFaculty('Patil') || findFaculty('Jagruti');
      return {
        text: "Sustainability Awareness (CEP) for S3 and S4 batch is conducted by Ms. Jagruti Patil (with Prof. Mrs. Supriya Balote conducting S1 and S2 batches).",
        facultyCards: facPatil ? [facPatil] : undefined,
        suggestedFollowUps: ['Who takes CEP for S1 and S2 batch?', 'Who teaches UHV for B division?', 'Who is my DELD teacher?'],
        intent: 'teaching_allocation_cep_s3s4',
        contextUpdates: { lastSubjectId: 'sem3-sa', lastFacultyId: facPatil?.id },
      };
    }
    if (isS1S2) {
      const facBalote = findFaculty('Balote') || findFaculty('Supriya');
      return {
        text: "Sustainability Awareness (CEP) for S1 and S2 batch is conducted by Prof. Mrs. Supriya Balote (with Ms. Jagruti Patil conducting S3 and S4 batches).",
        facultyCards: facBalote ? [facBalote] : undefined,
        suggestedFollowUps: ['Who takes CEP for S3 and S4 batch?', 'Who teaches UHV for B division?', 'Who is my DELD teacher?'],
        intent: 'teaching_allocation_cep_s1s2',
        contextUpdates: { lastSubjectId: 'sem3-sa', lastFacultyId: facBalote?.id },
      };
    }

    const facBalote = findFaculty('Balote') || findFaculty('Supriya');
    const facPatil = findFaculty('Patil') || findFaculty('Jagruti');
    const cards = [facBalote, facPatil].filter(Boolean) as FacultyMember[];
    return {
      text: "Sustainability Awareness (CEP) is conducted by Prof. Mrs. Supriya Balote (for S1 & S2 batches) and Ms. Jagruti Patil (for S3 & S4 batches).",
      facultyCards: cards.length > 0 ? cards : undefined,
      suggestedFollowUps: ['Who takes CEP for S3 and S4 batch?', 'Who teaches UHV for B division?', 'Who is my DELD teacher?'],
      intent: 'teaching_allocation_cep',
      contextUpdates: { lastSubjectId: 'sem3-sa' },
    };
  }

  // H. Economics for Engineers (EFE)
  const isEfe = /\b(economics|economics for engineers|efe)\b/i.test(lower);
  if (isEfe && (isTeacherQuery || /teacher|who/i.test(lower))) {
    const facDeshpande = findFaculty('Deshpande') || findFaculty('Priyanka');
    return {
      text: "Economics for Engineers is taught by Prof. Mrs. Priyanka Deshpande for both A and B divisions.",
      facultyCards: facDeshpande ? [facDeshpande] : undefined,
      suggestedFollowUps: ['Who teaches Operating System?', 'Who teaches OOP?', 'Who is the HOD of AIDS?'],
      intent: 'teaching_allocation_efe',
      contextUpdates: { lastSubjectId: 'sem3-efe', lastFacultyId: facDeshpande?.id },
    };
  }

  // I. Electives
  if ((/e-business|retailing/i.test(lower)) && (isTeacherQuery || /teacher|who/i.test(lower))) {
    const facChaudhari = findFaculty('Chaudhari') || findFaculty('Sheetal');
    return {
      text: "E-Business and Retailing is taught and coordinated by Prof. Sheetal Chaudhari.",
      facultyCards: facChaudhari ? [facChaudhari] : undefined,
      suggestedFollowUps: ['Who teaches Financial Management?', 'What are my 3rd semester electives?'],
      intent: 'teaching_allocation_ebr',
      contextUpdates: { lastSubjectId: 'sem3-ebr', lastFacultyId: facChaudhari?.id },
    };
  }

  if ((/financial management|finance/i.test(lower)) && (isTeacherQuery || /teacher|who/i.test(lower))) {
    const facDeshpande = findFaculty('Deshpande') || findFaculty('Priyanka');
    return {
      text: "Financial Management is taught and coordinated by Prof. Mrs. Priyanka Deshpande.",
      facultyCards: facDeshpande ? [facDeshpande] : undefined,
      suggestedFollowUps: ['Who teaches E-Business and Retailing?', 'What are my 3rd semester electives?'],
      intent: 'teaching_allocation_fm',
      contextUpdates: { lastSubjectId: 'sem3-fm', lastFacultyId: facDeshpande?.id },
    };
  }

  // 4. HOD SPECIFIC QUESTIONS
  if (/who is (the )?hod|head of (the )?department|hod of aids|hod's? (name|qualification|email|details)/i.test(lower) ||
      (lower.includes('hod') && !lower.includes('faculty'))) {
    if (hod) {
      const isQualificationQuery = /qualification|degree|study|studied/i.test(lower);
      const isEmailQuery = /email|contact|mail/i.test(lower);

      if (isQualificationQuery) {
        return {
          text: `Prof. Dr. S. V. Pandit holds ${hod.qualification} degrees and has ${hod.teachingExperience} of teaching experience as Head of Department (AIDS). Official Email: ${hod.email}.`,
          facultyCards: [hod],
          suggestedFollowUps: ['Show me all faculty members', 'Who has industry experience?'],
          intent: 'hod_qualification',
          contextUpdates: { lastFacultyId: hod.id },
        };
      }

      if (isEmailQuery) {
        return {
          text: `The official email address of the HOD Prof. Dr. S. V. Pandit is ${hod.email}.`,
          facultyCards: [hod],
          suggestedFollowUps: ['What is the qualification of the HOD?', 'Show me the faculty directory'],
          intent: 'hod_email',
          contextUpdates: { lastFacultyId: hod.id },
        };
      }

      return {
        text: `Prof. Dr. S. V. Pandit is listed as the Head of Department of AIDS in the provided faculty information.\n\n• Qualification: ${hod.qualification}\n• Teaching Experience: ${hod.teachingExperience}\n• Official Email: ${hod.email}`,
        facultyCards: [hod],
        suggestedFollowUps: [
          'What is the qualification of the HOD?',
          'Show me all faculty members',
          'Which faculty members have industry experience?',
        ],
        intent: 'hod_profile',
        contextUpdates: { lastFacultyId: hod.id },
      };
    }
  }

  // 5. SPECIFIC FACULTY EXPERIENCE: "Who has 11 years of teaching experience?"
  if (/(11 years|11 yrs)/i.test(lower) && /experience|teaching/i.test(lower)) {
    const faculty = allFaculty.find(f => f.teachingExperience.includes('11'));
    if (faculty) {
      return {
        text: `${faculty.name} is listed with 11 years of teaching experience.\n\n• Designation: ${faculty.designation}\n• Qualification: ${faculty.qualification}\n• Official Email: ${faculty.email}`,
        facultyCards: [faculty],
        suggestedFollowUps: ['Show me all faculty members', 'Who is the HOD of AIDS?'],
        intent: 'faculty_query',
        contextUpdates: { lastFacultyId: faculty.id },
      };
    }
  }

  // 6. SPECIFIC FACULTY EMAIL / LOOKUP: "Give me Jagruti Patil's email" or "Who is Jagruti Patil?"
  for (const fac of allFaculty) {
    const nameParts = fac.name.toLowerCase().split(' ').filter(p => !['mrs.', 'ms.', 'prof.', 'dr.', 'mr.'].includes(p));
    const lastName = nameParts[nameParts.length - 1];
    const firstName = nameParts[0];

    const mentionsFaculty = (firstName && lower.includes(firstName) && lastName && lower.includes(lastName)) ||
      lower.includes(fac.name.toLowerCase()) ||
      (lastName.length > 4 && lower.includes(lastName));

    if (mentionsFaculty) {
      const isEmailOnly = /email|mail|contact/i.test(lower);
      const isExpOnly = /experience|industry/i.test(lower);

      let text = '';
      if (isEmailOnly) {
        text = `${fac.name}'s official email address is ${fac.email}.\n\n• Designation: ${fac.designation}\n• Qualification: ${fac.qualification}\n• Teaching Experience: ${fac.teachingExperience}${fac.industryExperience ? `\n• Industry Experience: ${fac.industryExperience}` : ''}`;
      } else if (isExpOnly) {
        text = `${fac.name} has ${fac.teachingExperience} of teaching experience${fac.industryExperience ? ` and ${fac.industryExperience} of industry experience.` : '.'}\n\n• Qualification: ${fac.qualification}\n• Official Email: ${fac.email}`;
      } else {
        text = `Here are the official details for ${fac.name}:\n\n• Designation: ${fac.designation}\n• Qualification: ${fac.qualification}\n• Teaching Experience: ${fac.teachingExperience}${fac.industryExperience ? `\n• Industry Experience: ${fac.industryExperience}` : ''}\n• Official Email: ${fac.email}`;
      }

      return {
        text,
        facultyCards: [fac],
        suggestedFollowUps: [
          `Email ${fac.name}`,
          'Show me all faculty members',
          'Who is the HOD of AIDS?',
        ],
        intent: 'faculty_detail',
        contextUpdates: { lastFacultyId: fac.id },
      };
    }
  }

  // 7. INDUSTRY EXPERIENCE FACULTY
  if (/industry (exp|experience)|corporate experience|who (has|have) industry experience/i.test(lower)) {
    const industryFac = allFaculty.filter(f => Boolean(f.industryExperience));
    const listStr = industryFac
      .map(f => `• ${f.name} (${f.designation}) — ${f.industryExperience} Industry, ${f.teachingExperience} Teaching`)
      .join('\n');

    return {
      text: `The following faculty members have documented industry experience in the department:\n\n${listStr}\n\nWould you like more details on any specific faculty member?`,
      facultyCards: industryFac,
      suggestedFollowUps: [
        'Give me Jagruti Patil\'s email',
        'Show me the faculty directory',
        'Who is the HOD of AIDS?',
      ],
      intent: 'faculty_industry_experience',
    };
  }

  // 8. ALL FACULTY / DIRECTORY QUERY
  if (/show (me )?(all )?faculty|faculty members|faculty list|faculty directory|teachers list|list of professors|who teaches in aids/i.test(lower)) {
    return {
      text: `Modern College AIDS Department currently has ${allFaculty.length} official faculty records in my knowledge base, led by Head of Department Prof. Dr. S. V. Pandit.\n\nYou can explore each professor's qualifications, teaching experience, industry exposure, and official email addresses below:`,
      facultyCards: allFaculty.slice(0, 4), // show first 4 directly and give a button/trigger to view all
      suggestedFollowUps: [
        'Who is the HOD of AIDS?',
        'Which faculty members have industry experience?',
        'Who has 11 years of teaching experience?',
        'Give me Jagruti Patil\'s email',
      ],
      intent: 'faculty_directory',
    };
  }

  // 9. FIRST YEAR SUBJECTS QUERY
  if (/first[- ]year|1st[- ]year|fe subjects|first sem subjects|what do i study in first year|first year syllabus/i.test(lower)) {
    const fyNames = firstYearSubjects.map((s, i) => `${i + 1}. ${s.name}`).join('\n');
    return {
      text: `Here are the first-year subjects for the AIDS curriculum available in my knowledge base:\n\n${fyNames}\n\nNote: These are the first-year subjects supplied for the prototype. Semester allocations for them are not assigned unless confirmed.`,
      subjectCards: firstYearSubjects,
      suggestedFollowUps: [
        'What subjects do I have in Semester III?',
        'What subjects do I have in Semester IV?',
        'What is PPS?',
      ],
      intent: 'first_year_subjects',
      contextUpdates: { lastSemester: 'First Year' },
    };
  }

  // 10. CONTEXTUAL FOLLOW-UP: "Does it include practicals?" / "Do I have practicals?" / "Laboratory courses"
  const isPracticalsQuery = /practical|practicals|laboratory|labs|lab courses/i.test(lower);
  if (isPracticalsQuery) {
    const isSem3Context = /3rd|third|sem 3|semester 3|semester iii/i.test(lower) || activeContext.lastSemester === 'Semester III';
    const isSem4Context = /4th|fourth|sem 4|semester 4|semester iv/i.test(lower) || activeContext.lastSemester === 'Semester IV';

    if (isSem3Context || (!isSem4Context && !lower.includes('4'))) {
      const labs3 = sem3Subjects.filter(s => s.type === 'laboratory');
      return {
        text: `Yes. The Semester III curriculum includes these laboratory courses:\n\n• Operating System Laboratory (ADS01201)\n• Data Structures & Algorithms Laboratory (ADS01202)\n• Object Oriented Programming Laboratory (ADS01203)\n• Digital Electronics & Logic Design Laboratory (MDM03201C)\n\nNote: In the provided curriculum, each laboratory course preserves the course code matching its parent theory subject.`,
        subjectCards: labs3,
        suggestedFollowUps: [
          'What are my Semester III electives?',
          'What subjects do I have in Semester IV?',
          'Explain Object Oriented Programming',
        ],
        intent: 'sem3_practicals',
        contextUpdates: { lastSemester: 'Semester III' },
      };
    }

    if (isSem4Context) {
      const labs4 = sem4Subjects.filter(s => s.type === 'laboratory');
      return {
        text: `Yes. The Semester IV curriculum includes these laboratory courses:\n\n• Artificial Intelligence and Data Science Laboratory (ADS01251)\n• Computer Networks Laboratory (ADS01252)\n• Embedded System Design Laboratory (MDM03251C)`,
        subjectCards: labs4,
        suggestedFollowUps: [
          'What are my Semester IV electives?',
          'What subjects do I have in Semester III?',
        ],
        intent: 'sem4_practicals',
        contextUpdates: { lastSemester: 'Semester IV' },
      };
    }
  }

  // 11. ELECTIVES SPECIFIC QUERY
  const isElectivesQuery = /elective|electives|optional subject/i.test(lower);
  if (isElectivesQuery) {
    const isSem3 = /3rd|third|sem 3|semester 3|semester iii/i.test(lower) || activeContext.lastSemester === 'Semester III';
    const isSem4 = /4th|fourth|sem 4|semester 4|semester iv/i.test(lower) || activeContext.lastSemester === 'Semester IV';

    if (isSem4 && !isSem3) {
      const electives4 = sem4Subjects.filter(s => s.type === 'elective');
      return {
        text: `Your provided Semester IV curriculum lists these elective options:\n\n1. IT Act and Cyber Laws (OEL11251A)\n2. Human Resource Management (HRM) (OEL11251B)\n\nPlease note: These are elective alternatives, not two compulsory subjects. Confirm which elective applies to your individual course registration with your college.`,
        subjectCards: electives4,
        suggestedFollowUps: [
          'What subjects do I have in Semester IV?',
          'What are my 3rd semester electives?',
        ],
        intent: 'sem4_electives',
        contextUpdates: { lastSemester: 'Semester IV' },
      };
    }

    // Default to Sem 3 or general
    const electives3 = sem3Subjects.filter(s => s.type === 'elective');
    return {
      text: `Your provided Semester III curriculum lists these elective options:\n\n1. E-Business and Retailing (OEL11201A)\n2. Financial Management (OEL11201B)\n\nPlease confirm which option applies to your individual course registration with your college.`,
      subjectCards: electives3,
      suggestedFollowUps: [
        'What subjects do I have in 3rd sem?',
        'What are my Semester IV electives?',
        'Do I have practicals in 3rd semester?',
      ],
      intent: 'sem3_electives',
      contextUpdates: { lastSemester: 'Semester III' },
    };
  }

  // 12. SEMESTER III FULL QUERY (Handles various phrasings: "3rd sem subjects?", "What do I study in Semester III?", "Show my sem 3 syllabus.", "I'm a second-year AIDS student. Tell me my subjects.")
  if (/(3rd sem|third sem|semester 3|semester iii|sem 3|sem iii)/i.test(lower) ||
      (/subjects/i.test(lower) && activeContext.lastSemester === 'Semester III')) {
    const core = sem3Subjects.filter(s => s.type === 'core');
    const labs = sem3Subjects.filter(s => s.type === 'laboratory');
    const electives = sem3Subjects.filter(s => s.type === 'elective');

    return {
      text: `Here are your Semester III subjects for the AIDS curriculum:\n\n1. Operating System (ADS01201)\n2. Operating System Laboratory (ADS01201)\n3. Data Structures & Algorithms (ADS01202)\n4. Data Structures & Algorithms Laboratory (ADS01202)\n5. Object Oriented Programming (ADS01203)\n6. Object Oriented Programming Laboratory (ADS01203)\n7. Digital Electronics & Logic Design (MDM03201C)\n8. Digital Electronics & Logic Design Laboratory (MDM03201C)\n9. Economics for Engineers (EEM04201)\n10. Universal Human Values (VEC04202)\n11. Sustainability Awareness (CEP08201F)\n\nYour elective options are E-Business and Retailing (OEL11201A) or Financial Management (OEL11201B).\n\nWould you like to view the course codes or explore a particular subject?`,
      subjectCards: [...core, ...labs, ...electives],
      suggestedFollowUps: [
        'Do I have practicals in 3rd semester?',
        'What are my 3rd semester electives?',
        'Explain Object Oriented Programming',
        'What subjects do I have in Semester IV?',
      ],
      intent: 'sem3_subjects',
      contextUpdates: { lastSemester: 'Semester III' },
    };
  }

  // 13. SEMESTER IV FULL QUERY (Handles: "4th sem subjects", "subjects in fourth semester", "sem 4 syllabus")
  if (/(4th sem|fourth sem|semester 4|semester iv|sem 4|sem iv)/i.test(lower) ||
      (/subjects/i.test(lower) && activeContext.lastSemester === 'Semester IV')) {
    const core = sem4Subjects.filter(s => s.type === 'core');
    const labs = sem4Subjects.filter(s => s.type === 'laboratory');
    const electives = sem4Subjects.filter(s => s.type === 'elective');

    return {
      text: `Here is your Semester IV subject list:\n\n1. Artificial Intelligence and Data Science (ADS01251)\n2. Artificial Intelligence and Data Science Laboratory (ADS01251)\n3. Computer Networks (ADS01252)\n4. Computer Networks Laboratory (ADS01252)\n5. Probability and Statistics for Data Science (ADS01253)\n6. Embedded System Design (MDM03251C)\n7. Embedded System Design Laboratory (MDM03251C)\n\nElective options:\n• IT Act and Cyber Laws (OEL11251A)\n• Human Resource Management (HRM) (OEL11251B)\n\nWould you like the course codes or a brief explanation of any subject?`,
      subjectCards: [...core, ...labs, ...electives],
      suggestedFollowUps: [
        'What are my Semester IV electives?',
        'What is Artificial Intelligence and Data Science?',
        'What subjects do I have in Semester III?',
        'Who is the HOD of AIDS?',
      ],
      intent: 'sem4_subjects',
      contextUpdates: { lastSemester: 'Semester IV' },
    };
  }

  // 14. OBJECT ORIENTED PROGRAMMING (OOP) SPECIFIC QUERY
  if (/\b(oop|object oriented|object-oriented|oops)\b/i.test(lower)) {
    const oopSubject = sem3Subjects.find(s => s.id === 'sem3-oop');
    const oopLab = sem3Subjects.find(s => s.id === 'sem3-oop-lab');
    return {
      text: `Object Oriented Programming is a programming approach based on classes and objects.\n\nImportant concepts include:\n• Classes and objects\n• Encapsulation\n• Inheritance\n• Polymorphism\n• Abstraction\n\nYour Semester III curriculum lists Object Oriented Programming (ADS01203) and its laboratory (ADS01203).`,
      subjectCards: oopSubject && oopLab ? [oopSubject, oopLab] : undefined,
      suggestedFollowUps: [
        'Do I have practicals in 3rd semester?',
        'What is Data Structures and Algorithms?',
        'What subjects do I have in Semester III?',
      ],
      intent: 'oop_explanation',
      contextUpdates: { lastSubjectId: 'sem3-oop', lastSemester: 'Semester III' },
    };
  }

  // 15. DATA STRUCTURES & ALGORITHMS (DSA) SPECIFIC QUERY
  if (/\b(dsa|data structures|data structure and algorithms|data structures & algorithms)\b/i.test(lower)) {
    const dsaSubject = sem3Subjects.find(s => s.id === 'sem3-dsa');
    const dsaLab = sem3Subjects.find(s => s.id === 'sem3-dsa-lab');
    return {
      text: `Data Structures & Algorithms (ADS01202) covers foundational computational constructs:\n\n• Linear structures: Arrays, Stacks, Queues, Linked Lists\n• Non-linear structures: Trees (Binary, AVL, BST) and Graphs\n• Algorithmic paradigms: Sorting, Searching, Complexity Analysis (Big-O)\n\nSemester III includes both theory (ADS01202) and Data Structures & Algorithms Laboratory (ADS01202).`,
      subjectCards: dsaSubject && dsaLab ? [dsaSubject, dsaLab] : undefined,
      suggestedFollowUps: [
        'Explain Object Oriented Programming',
        'What subjects do I have in Semester III?',
        'Do I have practicals in 3rd semester?',
      ],
      intent: 'dsa_explanation',
      contextUpdates: { lastSubjectId: 'sem3-dsa', lastSemester: 'Semester III' },
    };
  }

  // 16. ARTIFICIAL INTELLIGENCE AND DATA SCIENCE (AIDS) SUBJECT / BRANCH QUERY
  if (/\b(what is aids|what is artificial intelligence and data science|explain aids)\b/i.test(lower)) {
    const aidsSub = sem4Subjects.find(s => s.id === 'sem4-aids');
    return {
      text: `Artificial Intelligence and Data Science is a multidisciplinary engineering discipline that focuses on creating intelligent agents, machine learning pipelines, and predictive data systems.\n\nIn Semester IV, you have the dedicated core subject "Artificial Intelligence and Data Science" (ADS01251) and its corresponding laboratory (ADS01251). Key topics include intelligent agents, heuristic search methods, data preprocessing, and predictive modeling fundamentals.`,
      subjectCards: aidsSub ? [aidsSub] : undefined,
      suggestedFollowUps: [
        'What subjects do I have in Semester IV?',
        'Who is the HOD of AIDS?',
        'What subjects do I have in Semester III?',
      ],
      intent: 'aids_explanation',
      contextUpdates: { lastSubjectId: 'sem4-aids', lastSemester: 'Semester IV' },
    };
  }

  // 17. ADDITIONAL COURSES QUERY: "Java", "Environmental studies", "Additional courses"
  if (/additional courses|extra courses|java|entrepreneurship|environmental studies|pdt|professional development/i.test(lower)) {
    return {
      text: `The academic knowledge base includes these Additional Curriculum Courses:\n\n• Java Programming (ADS05251)\n• Professional Development Training (AEC04251)\n• Entrepreneurship Development (EEM04252)\n• Environmental Studies (VEC04253)\n\nNote: As per departmental guidelines, these four courses are categorized under Additional Curriculum Courses and are not assigned to Semester III or IV until official allocation is confirmed.`,
      subjectCards: additionalSubjects,
      suggestedFollowUps: [
        'What subjects do I have in Semester III?',
        'What subjects do I have in Semester IV?',
        'Who is the HOD of AIDS?',
      ],
      intent: 'additional_courses',
    };
  }

  // 18. LOOKUP BY COURSE CODE (e.g. ADS01201, MDM03201C, OEL11201A)
  const codeMatch = lower.match(/(ads\d+|mdm\d+[a-z]?|oel\d+[a-z]?|eem\d+|vec\d+|cep\d+[a-z]?|aec\d+)/i);
  if (codeMatch) {
    const matchedCode = codeMatch[1].toUpperCase();
    const matches = allSubjects.filter(s => s.code.toUpperCase() === matchedCode);
    if (matches.length > 0) {
      const names = matches.map(s => `• ${s.name} (${s.semester} - ${s.type.toUpperCase()})`).join('\n');
      return {
        text: `Course Code ${matchedCode} corresponds to:\n\n${names}\n\n${matches[0].description ? `Overview: ${matches[0].description}` : ''}`,
        subjectCards: matches,
        suggestedFollowUps: [
          `What subjects do I have in ${matches[0].semester}?`,
          'Who is the HOD of AIDS?',
        ],
        intent: 'course_code_lookup',
      };
    }
  }

  // 19. CHECK SPECIFIC INDIVIDUAL SUBJECTS BY NAME
  for (const sub of allSubjects) {
    if (sub.name.length > 4 && lower.includes(sub.name.toLowerCase())) {
      return {
        text: `**${sub.name}** (${sub.code})\n\n• Semester: ${sub.semester}\n• Course Type: ${sub.type.toUpperCase()}\n${sub.credits ? `• Credits: ${sub.credits}\n` : ''}${sub.hasPractical ? '• Has Practical Laboratory\n' : ''}\n${sub.description || ''}\n${sub.notes ? `\nNote: ${sub.notes}` : ''}`,
        subjectCards: [sub],
        suggestedFollowUps: [
          `What subjects do I have in ${sub.semester}?`,
          'Do I have practicals in 3rd semester?',
          'Who is the HOD of AIDS?',
        ],
        intent: 'subject_detail',
        contextUpdates: { lastSubjectId: sub.id, lastSemester: sub.semester },
      };
    }
  }

  // 20. CHECK FAQS
  for (const faq of allFaqs) {
    const matchesFaq = faq.keywords.some(kw => lower.includes(kw.toLowerCase())) ||
      lower.includes(faq.question.toLowerCase().replace('?', ''));
    if (matchesFaq) {
      return {
        text: faq.answer,
        suggestedFollowUps: [
          'What subjects do I have in Semester III?',
          'Who is the HOD of AIDS?',
          'Show me the faculty directory',
        ],
        intent: 'faq_match',
      };
    }
  }

  // 21. GENERAL KNOWLEDGE / FALLBACK
  return {
    text: "I am your Modern College AI Assistant for the AIDS department. I have verified records for Semester III and IV curriculum, first-year subjects, laboratory courses, electives, and the complete 12-member faculty directory.\n\nCould you clarify your question? For example, you can ask about Semester III subjects, practicals, electives, or faculty profiles.",
    suggestedFollowUps: [
      'What subjects do I have in Semester III?',
      'What subjects do I have in Semester IV?',
      'Who is the HOD of AIDS?',
      'Show me the faculty directory',
      'What are my 3rd semester electives?',
    ],
    intent: 'fallback',
  };
}
