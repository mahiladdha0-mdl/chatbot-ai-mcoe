import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { storageService } from '../services/storageService';

interface AuthContextType {
  user: User | null;
  role: Role;
  isAuthenticated: boolean;
  loginStudent: (name: string, email: string) => void;
  loginAdmin: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateStudentProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'guest',
  isAuthenticated: false,
  loginStudent: () => {},
  loginAdmin: () => ({ success: false }),
  logout: () => {},
  updateStudentProfile: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => storageService.getUser());

  useEffect(() => {
    // If no user initially, we keep as guest or restore
    const stored = storageService.getUser();
    if (stored) {
      setUser(stored);
    }
  }, []);

  const loginStudent = (name: string, email: string) => {
    const studentUser: User = {
      id: 'std-' + (email.toLowerCase().replace(/[^a-z0-9]/g, '') || Date.now().toString()),
      name: name.trim() || 'Student',
      email: email.trim().toLowerCase(),
      role: 'student',
      department: 'Artificial Intelligence & Data Science',
      semester: 'Second Year (SE - AIDS)',
      avatar: name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ST',
    };
    storageService.setUser(studentUser);
    setUser(studentUser);
  };

  const loginAdmin = (email: string, password: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    // Validate prototype credentials: allow standard admin credentials or official faculty emails with demo key
    const validEmails = [
      'admin@moderncoe.edu.in',
      'hodads@moderncoe.edu.in',
      'faculty@moderncoe.edu.in',
      'aids.dept@moderncoe.edu.in',
    ];

    if (!cleanEmail) {
      return { success: false, error: 'Please enter your official college email address.' };
    }

    if (!password) {
      return { success: false, error: 'Please enter your password.' };
    }

    // Demo password check
    if (password === 'modern@aids2026' || password === 'admin123' || password === 'moderncoe') {
      const adminUser: User = {
        id: 'adm-' + Date.now(),
        name: cleanEmail.includes('hod') ? 'Prof. Dr. S. V. Pandit' : 'AIDS Academic Administrator',
        email: cleanEmail,
        role: 'admin',
        department: 'Artificial Intelligence & Data Science',
        avatar: 'AD',
      };
      storageService.setUser(adminUser);
      setUser(adminUser);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid email or password. Use demo credentials (modern@aids2026) to test the Admin portal.',
    };
  };

  const logout = () => {
    storageService.setUser(null);
    setUser(null);
  };

  const updateStudentProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    storageService.setUser(updated);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'guest',
        isAuthenticated: !!user,
        loginStudent,
        loginAdmin,
        logout,
        updateStudentProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
