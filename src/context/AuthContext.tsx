import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { AuthUser, Member } from '../types';
import * as authService from '../services/authService';
import * as firebaseService from '../services/firebaseService';

interface AuthContextType {
  user: AuthUser | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, memberData: Omit<Member, 'id'>) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize sample data with error handling
    const initializeApp = async () => {
      try {
        await firebaseService.initializeSampleData();
        console.log('Sample data initialized successfully');
      } catch (error: any) {
        console.warn('Firebase permission error - please update Firestore rules:', error.message);
        // Continue without sample data for now
      }
    };

    initializeApp();

    // Listen to Firebase auth state changes
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Get auth user data from Firestore
          const authUserData = await authService.getAuthUserData(firebaseUser.email!);
          if (authUserData) {
            setUser(authUserData);
          }
        } catch (error) {
          console.warn('Error getting auth user data:', error);
        }
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await authService.signIn(email, password);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.signOutUser();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (email: string, password: string, memberData: Omit<Member, 'id'>): Promise<boolean> => {
    try {
      // Create member in Firestore first
      const newMember = await firebaseService.createMember(memberData);
      
      // Create Firebase auth user and auth user record
      await authService.signUp(email, password, newMember);
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    isLoading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 