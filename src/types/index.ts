export interface Member {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  email: string;
  phone: string;
  address: string;
  membershipStatus: 'active' | 'expired' | 'pending';
  membershipFee: number;
  membershipFeeStatus: 'paid' | 'pending' | 'overdue';
  membershipStartDate: Date;
  membershipEndDate: Date;
  lastPaymentDate: string;
  nextPaymentDate: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: string;
  updatedAt: string;
  profileImage?: string;
}

export interface Workout {
  id: string;
  memberId: string;
  date: Date;
  duration: number; // in minutes
  type: 'cardio' | 'strength' | 'flexibility' | 'mixed';
  exercises: Exercise[];
  notes: string;
  caloriesBurned?: number;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number; // in kg
  duration?: number; // in seconds
  restTime?: number; // in seconds
  notes?: string;
}

export interface FitnessPlan {
  id: string;
  memberId: string;
  name: string;
  description: string;
  goal: 'weight_loss' | 'muscle_gain' | 'endurance' | 'flexibility' | 'general_fitness';
  startDate: Date;
  endDate: Date;
  workoutTemplates: WorkoutTemplate[];
  assignedBy: string; // trainer ID or 'system'
  assignedDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  exercises: ExerciseTemplate[];
  duration: number; // in minutes
  type: 'cardio' | 'strength' | 'flexibility' | 'mixed';
}

export interface ExerciseTemplate {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  restTime?: number;
  instructions?: string;
}

export interface DietChart {
  id: string;
  memberId: string;
  name: string;
  description: string;
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'health';
  targetCalories: number;
  startDate: Date;
  endDate: Date;
  meals: Meal[];
  assignedBy: string;
  assignedDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Meal {
  id: string;
  name: string;
  time: string; // HH:MM format
  foods: FoodItem[];
  totalCalories: number;
  notes?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface ProgressLog {
  id: string;
  memberId: string;
  date: Date;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  measurements: BodyMeasurements;
  photos?: string[];
  notes: string;
  createdAt: string;
}

export interface BodyMeasurements {
  chest: number;
  waist: number;
  hips: number;
  biceps: number;
  thighs: number;
  calves: number;
  neck: number;
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  bio: string;
  profileImage?: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'member' | 'trainer' | 'admin';
  memberId?: string;
  trainerId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'membership_renewal';
  isRead: boolean;
  createdAt: string;
  data?: {
    memberId?: string;
    membershipEndDate?: string;
    daysUntilExpiry?: number;
    membershipFee?: number;
  };
}

export interface MembershipRenewalNotification {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  membershipEndDate: string;
  daysUntilExpiry: number;
  membershipFee: number;
  notificationSent: boolean;
  lastNotificationDate?: string;
  createdAt: string;
} 