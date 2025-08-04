import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  Member,
  Workout,
  Exercise,
  FitnessPlan,
  WorkoutTemplate,
  ExerciseTemplate,
  DietChart,
  Meal,
  FoodItem,
  ProgressLog,
  BodyMeasurements,
  Trainer,
  AuthUser,
  Notification
} from '../types';

// Helper function to convert Firestore timestamp to Date
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
};

// Helper function to convert Date to Firestore timestamp
const convertToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

// Helper function to prepare data for Firestore (convert Date objects to timestamps)
const prepareDataForFirestore = (data: any): any => {
  const prepared = { ...data };
  Object.keys(prepared).forEach(key => {
    if (prepared[key] instanceof Date) {
      prepared[key] = convertToTimestamp(prepared[key]);
    }
  });
  return prepared;
};

// Helper function to convert Firestore data back to our format
const convertFromFirestore = (data: any): any => {
  const converted = { ...data };
  Object.keys(converted).forEach(key => {
    if (converted[key] && typeof converted[key] === 'object' && converted[key].seconds) {
      converted[key] = convertTimestamp(converted[key]);
    }
  });
  return converted;
};

// Member operations
export const createMember = async (memberData: Omit<Member, 'id'>): Promise<Member> => {
  try {
    const docRef = await addDoc(collection(db, 'members'), {
      ...prepareDataForFirestore(memberData),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      id: docRef.id,
      ...memberData
    };
  } catch (error) {
    console.error('Error creating member:', error);
    throw error;
  }
};

export const getMember = async (id: string): Promise<Member | null> => {
  try {
    const docRef = doc(db, 'members', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...convertFromFirestore(docSnap.data())
      } as Member;
    }
    return null;
  } catch (error) {
    console.error('Error getting member:', error);
    throw error;
  }
};

export const updateMember = async (id: string, updates: Partial<Member>): Promise<void> => {
  try {
    const docRef = doc(db, 'members', id);
    await updateDoc(docRef, {
      ...prepareDataForFirestore(updates),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating member:', error);
    throw error;
  }
};

export const getAllMembers = async (): Promise<Member[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'members'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertFromFirestore(doc.data())
    })) as Member[];
  } catch (error) {
    console.error('Error getting all members:', error);
    throw error;
  }
};

// Workout operations
export const createWorkout = async (workoutData: Omit<Workout, 'id'>): Promise<Workout> => {
  try {
    const docRef = await addDoc(collection(db, 'workouts'), {
      ...prepareDataForFirestore(workoutData),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      id: docRef.id,
      ...workoutData
    };
  } catch (error) {
    console.error('Error creating workout:', error);
    throw error;
  }
};

export const getWorkoutsByMember = async (memberId: string): Promise<Workout[]> => {
  try {
    const q = query(
      collection(db, 'workouts'),
      where('memberId', '==', memberId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertFromFirestore(doc.data())
    })) as Workout[];
  } catch (error) {
    console.error('Error getting workouts by member:', error);
    throw error;
  }
};

export const updateWorkout = async (id: string, updates: Partial<Workout>): Promise<void> => {
  try {
    const docRef = doc(db, 'workouts', id);
    await updateDoc(docRef, {
      ...prepareDataForFirestore(updates),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating workout:', error);
    throw error;
  }
};

export const deleteWorkout = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'workouts', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
};

// Fitness Plan operations
export const createFitnessPlan = async (planData: Omit<FitnessPlan, 'id'>): Promise<FitnessPlan> => {
  try {
    const docRef = await addDoc(collection(db, 'fitnessPlans'), {
      ...prepareDataForFirestore(planData),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      id: docRef.id,
      ...planData
    };
  } catch (error) {
    console.error('Error creating fitness plan:', error);
    throw error;
  }
};

export const getFitnessPlanByMember = async (memberId: string): Promise<FitnessPlan | null> => {
  try {
    const q = query(
      collection(db, 'fitnessPlans'),
      where('memberId', '==', memberId),
      where('isActive', '==', true),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...convertFromFirestore(doc.data())
      } as FitnessPlan;
    }
    return null;
  } catch (error) {
    console.error('Error getting fitness plan by member:', error);
    throw error;
  }
};

export const updateFitnessPlan = async (id: string, updates: Partial<FitnessPlan>): Promise<void> => {
  try {
    const docRef = doc(db, 'fitnessPlans', id);
    await updateDoc(docRef, {
      ...prepareDataForFirestore(updates),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating fitness plan:', error);
    throw error;
  }
};

// Progress Log operations
export const createProgressLog = async (progressData: Omit<ProgressLog, 'id'>): Promise<ProgressLog> => {
  try {
    const docRef = await addDoc(collection(db, 'progressLogs'), {
      ...prepareDataForFirestore(progressData),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      id: docRef.id,
      ...progressData
    };
  } catch (error) {
    console.error('Error creating progress log:', error);
    throw error;
  }
};

export const getProgressLogsByMember = async (memberId: string): Promise<ProgressLog[]> => {
  try {
    const q = query(
      collection(db, 'progressLogs'),
      where('memberId', '==', memberId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertFromFirestore(doc.data())
    })) as ProgressLog[];
  } catch (error) {
    console.error('Error getting progress logs by member:', error);
    throw error;
  }
};

export const updateProgressLog = async (id: string, updates: Partial<ProgressLog>): Promise<void> => {
  try {
    const docRef = doc(db, 'progressLogs', id);
    await updateDoc(docRef, {
      ...prepareDataForFirestore(updates),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating progress log:', error);
    throw error;
  }
};

export const deleteProgressLog = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'progressLogs', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting progress log:', error);
    throw error;
  }
};

// Diet Chart operations
export const createDietChart = async (dietData: Omit<DietChart, 'id'>): Promise<DietChart> => {
  try {
    const docRef = await addDoc(collection(db, 'dietCharts'), {
      ...prepareDataForFirestore(dietData),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      id: docRef.id,
      ...dietData
    };
  } catch (error) {
    console.error('Error creating diet chart:', error);
    throw error;
  }
};

export const getDietChartByMember = async (memberId: string): Promise<DietChart | null> => {
  try {
    const q = query(
      collection(db, 'dietCharts'),
      where('memberId', '==', memberId),
      where('isActive', '==', true),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...convertFromFirestore(doc.data())
      } as DietChart;
    }
    return null;
  } catch (error) {
    console.error('Error getting diet chart by member:', error);
    throw error;
  }
};

export const updateDietChart = async (id: string, updates: Partial<DietChart>): Promise<void> => {
  try {
    const docRef = doc(db, 'dietCharts', id);
    await updateDoc(docRef, {
      ...prepareDataForFirestore(updates),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating diet chart:', error);
    throw error;
  }
};

// Auth User operations
export const createAuthUser = async (authData: Omit<AuthUser, 'id'>): Promise<AuthUser> => {
  try {
    const docRef = await addDoc(collection(db, 'authUsers'), {
      ...prepareDataForFirestore(authData),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      id: docRef.id,
      ...authData
    };
  } catch (error) {
    console.error('Error creating auth user:', error);
    throw error;
  }
};

export const getAuthUserByEmail = async (email: string): Promise<AuthUser | null> => {
  try {
    const q = query(
      collection(db, 'authUsers'),
      where('email', '==', email),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...convertFromFirestore(doc.data())
      } as AuthUser;
    }
    return null;
  } catch (error) {
    console.error('Error getting auth user by email:', error);
    throw error;
  }
};

export const updateAuthUser = async (id: string, updates: Partial<AuthUser>): Promise<void> => {
  try {
    const docRef = doc(db, 'authUsers', id);
    await updateDoc(docRef, {
      ...prepareDataForFirestore(updates),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating auth user:', error);
    throw error;
  }
};

// Notification operations
export const createNotification = async (notificationData: Omit<Notification, 'id'>): Promise<Notification> => {
  try {
    const docRef = await addDoc(collection(db, 'notifications'), {
      ...prepareDataForFirestore(notificationData),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      id: docRef.id,
      ...notificationData
    };
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const getNotificationsByUser = async (userId: string): Promise<Notification[]> => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertFromFirestore(doc.data())
    })) as Notification[];
  } catch (error) {
    console.error('Error getting notifications by user:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'notifications', id);
    await updateDoc(docRef, {
      isRead: true,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Admin Functions
export const getAllAuthUsers = async (): Promise<AuthUser[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'authUsers'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertFromFirestore(doc.data())
    })) as AuthUser[];
  } catch (error) {
    console.error('Error getting all auth users:', error);
    throw error;
  }
};

export const getAllWorkouts = async (): Promise<Workout[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'workouts'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertFromFirestore(doc.data())
    })) as Workout[];
  } catch (error) {
    console.error('Error getting all workouts:', error);
    throw error;
  }
};

export const getAllProgressLogs = async (): Promise<ProgressLog[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'progressLogs'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertFromFirestore(doc.data())
    })) as ProgressLog[];
  } catch (error) {
    console.error('Error getting all progress logs:', error);
    throw error;
  }
};

export const getAllFitnessPlans = async (): Promise<FitnessPlan[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'fitnessPlans'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertFromFirestore(doc.data())
    })) as FitnessPlan[];
  } catch (error) {
    console.error('Error getting all fitness plans:', error);
    throw error;
  }
};

export const getAllDietCharts = async (): Promise<DietChart[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'dietCharts'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertFromFirestore(doc.data())
    })) as DietChart[];
  } catch (error) {
    console.error('Error getting all diet charts:', error);
    throw error;
  }
};

export const deleteMember = async (memberId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'members', memberId));
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
};

export const deleteAuthUser = async (userId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'authUsers', userId));
  } catch (error) {
    console.error('Error deleting auth user:', error);
    throw error;
  }
};

export const deleteFitnessPlan = async (planId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'fitnessPlans', planId));
  } catch (error) {
    console.error('Error deleting fitness plan:', error);
    throw error;
  }
};

export const deleteDietChart = async (dietId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'dietCharts', dietId));
  } catch (error) {
    console.error('Error deleting diet chart:', error);
    throw error;
  }
};

// Initialize sample data for testing
export const initializeSampleData = async (): Promise<void> => {
  try {
    // Check if sample data already exists
    const members = await getAllMembers();
    if (members.length > 0) {
      console.log('Sample data already exists, skipping initialization');
      return;
    }

    console.log('Initializing sample data...');

    // Create sample members
    const member1 = await createMember({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      address: '123 Main St, City, State',
      height: 175,
      weight: 70,
      gender: 'male',
      membershipStatus: 'active',
      membershipFee: 50,
      membershipFeeStatus: 'paid',
      membershipStartDate: new Date('2024-01-01'),
      membershipEndDate: new Date('2024-12-31'),
      lastPaymentDate: new Date().toISOString(),
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      emergencyContact: {
        name: 'Jane Doe',
        phone: '+1234567891',
        relationship: 'Spouse'
      }
    });

    const member2 = await createMember({
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567892',
      address: '456 Oak Ave, City, State',
      height: 165,
      weight: 55,
      gender: 'female',
      membershipStatus: 'active',
      membershipFee: 50,
      membershipFeeStatus: 'paid',
      membershipStartDate: new Date('2024-01-01'),
      membershipEndDate: new Date('2024-12-31'),
      lastPaymentDate: new Date().toISOString(),
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      emergencyContact: {
        name: 'John Smith',
        phone: '+1234567893',
        relationship: 'Spouse'
      }
    });

    // Create sample auth users
    await createAuthUser({
      email: 'john@example.com',
      memberId: member1.id,
      role: 'member',
      isActive: true,
      createdAt: new Date().toISOString()
    });

    await createAuthUser({
      email: 'jane@example.com',
      memberId: member2.id,
      role: 'member',
      isActive: true,
      createdAt: new Date().toISOString()
    });

    // Create admin user
    await createAuthUser({
      email: 'admin@gymapp.com',
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString()
    });

    // Create sample workouts
    await createWorkout({
      memberId: member1.id,
      date: new Date('2024-01-15'),
      duration: 60,
      type: 'strength',
      caloriesBurned: 300,
      notes: 'Great workout today!',
      exercises: [
        {
          id: '1',
          name: 'Bench Press',
          sets: 3,
          reps: 10,
          weight: 80,
          restTime: 90,
          notes: 'Felt strong today'
        },
        {
          id: '2',
          name: 'Squats',
          sets: 3,
          reps: 12,
          weight: 100,
          restTime: 120,
          notes: 'Good form maintained'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Create sample progress logs
    await createProgressLog({
      memberId: member1.id,
      date: new Date('2024-01-15'),
      weight: 70,
      bodyFat: 15,
      muscleMass: 55,
      notes: 'Feeling good about progress',
      measurements: {
        chest: 95,
        waist: 80,
        hips: 95,
        biceps: 35,
        thighs: 55,
        calves: 35,
        neck: 40
      },
      createdAt: new Date().toISOString()
    });

    console.log('Sample data initialized successfully');
  } catch (error) {
    console.error('Error initializing sample data:', error);
    throw error;
  }
};

// Export as default for easier imports
export default {
  createMember,
  getMember,
  updateMember,
  getAllMembers,
  createWorkout,
  getWorkoutsByMember,
  updateWorkout,
  deleteWorkout,
  createFitnessPlan,
  getFitnessPlanByMember,
  updateFitnessPlan,
  createProgressLog,
  getProgressLogsByMember,
  updateProgressLog,
  deleteProgressLog,
  createDietChart,
  getDietChartByMember,
  updateDietChart,
  createAuthUser,
  getAuthUserByEmail,
  updateAuthUser,
  createNotification,
  getNotificationsByUser,
  markNotificationAsRead,
  initializeSampleData,
  getAllAuthUsers,
  getAllWorkouts,
  getAllProgressLogs,
  getAllFitnessPlans,
  getAllDietCharts,
  deleteMember,
  deleteAuthUser,
  deleteFitnessPlan,
  deleteDietChart
}; 