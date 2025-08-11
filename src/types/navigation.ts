export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MemberTabs: undefined;
  AdminTabs: undefined;
  AddWorkout: undefined;
  AddProgress: undefined;
  AdminEditUser: { userId: string };
  AdminEditWorkout: { workoutId: string };
  AdminEditProgress: { progressId: string };
  AdminEditFitnessPlan: { planId: string };
  AdminEditDietChart: { chartId: string };
  AdminNotifications: undefined;
};

export type MemberTabParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Workouts: undefined;
  Progress: undefined;
  'Fitness Plan': undefined;
  'Diet Chart': undefined;
  Notifications: undefined;
};

export type AdminTabParamList = {
  'Admin Dashboard': undefined;
  Users: undefined;
  Workouts: undefined;
  Progress: undefined;
  'Fitness Plans': undefined;
  'Diet Charts': undefined;
  Notifications: undefined;
}; 