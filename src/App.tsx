import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { StudentLogin } from './components/student/StudentLogin';
import { AdminLogin } from './components/admin/AdminLogin';
import { StudentDashboard } from './components/student/StudentDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ChatInterface } from './components/chat/ChatInterface';
import { AcademicsPage } from './components/academics/AcademicsPage';
import { FacultyDirectoryPage } from './components/faculty/FacultyDirectoryPage';
import { AboutPage } from './components/about/AboutPage';
import { AcademicSubject } from './types';

function AppContent() {
  const { user, role } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [queryParam, setQueryParam] = useState<string | undefined>(undefined);
  const [initialChatQuestion, setInitialChatQuestion] = useState<string | undefined>(undefined);

  const handleNavigate = (tab: string, param?: string) => {
    // Route protection
    if (tab === 'admin_dashboard' && role !== 'admin') {
      setCurrentTab('admin_login');
      setQueryParam(undefined);
      return;
    }

    if (tab === 'student_dashboard' && role !== 'student' && role !== 'admin') {
      setCurrentTab('student_login');
      setQueryParam(undefined);
      return;
    }

    setCurrentTab(tab);
    setQueryParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickAsk = (question: string) => {
    setInitialChatQuestion(question);
    setCurrentTab('chat');
  };

  const handleSelectSubject = (subject: AcademicSubject) => {
    handleNavigate('academics', subject.semester);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans antialiased">
      {/* Top Navigation */}
      <Navbar currentTab={currentTab} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {currentTab === 'home' && (
          <LandingPage
            onNavigate={handleNavigate}
            onQuickAsk={handleQuickAsk}
          />
        )}

        {currentTab === 'student_login' && (
          <StudentLogin
            onSuccess={() => handleNavigate('student_dashboard')}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'admin_login' && (
          <AdminLogin
            onSuccess={() => handleNavigate('admin_dashboard')}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'student_dashboard' && (
          <StudentDashboard
            onNavigate={handleNavigate}
            onQuickAsk={handleQuickAsk}
          />
        )}

        {currentTab === 'admin_dashboard' && (
          <AdminDashboard onNavigate={handleNavigate} />
        )}

        {currentTab === 'chat' && (
          <ChatInterface
            initialQuestion={initialChatQuestion}
            onNavigate={handleNavigate}
            onSelectSubject={handleSelectSubject}
          />
        )}

        {currentTab === 'academics' && (
          <AcademicsPage
            initialSemester={queryParam || 'Semester III'}
            onAskAboutSubject={name => handleQuickAsk(`Tell me about the subject ${name}`)}
          />
        )}

        {currentTab === 'faculty' && (
          <FacultyDirectoryPage
            initialFilter={queryParam || 'all'}
            onAskAboutFaculty={name => handleQuickAsk(`Tell me about faculty member ${name}`)}
          />
        )}

        {currentTab === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}
      </div>

      {/* Footer is displayed on non-chat views to allow full viewport focus during chat */}
      {currentTab !== 'chat' && currentTab !== 'admin_dashboard' && (
        <Footer onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
