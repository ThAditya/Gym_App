import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { createAuthUser, getAuthUserByEmail } from './firebaseService';
import { AuthUser } from '../types';

// Sign up with email and password
export const signUp = async (
  email: string,
  password: string,
  memberData: any
): Promise<FirebaseUser> => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, {
      displayName: memberData.name
    });

    // Create auth user record in Firestore
    await createAuthUser({
      email: email,
      memberId: memberData.id,
      role: 'member',
      isActive: true,
      createdAt: new Date().toISOString()
    });

    return user;
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw new Error(error.message);
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(error.message);
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error(error.message);
  }
};

// Get current user
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get auth user data from Firestore
export const getAuthUserData = async (email: string): Promise<AuthUser | null> => {
  try {
    return await getAuthUserByEmail(email);
  } catch (error) {
    console.error('Error getting auth user data:', error);
    return null;
  }
}; 