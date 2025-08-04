import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { RootStackParamList, MemberTabParamList, AdminTabParamList } from '../types/navigation';

// Auth screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Member screens
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import AddWorkoutScreen from '../screens/AddWorkoutScreen';
import ProgressScreen from '../screens/ProgressScreen';
import AddProgressScreen from '../screens/AddProgressScreen';
import FitnessPlanScreen from '../screens/FitnessPlanScreen';
import DietChartScreen from '../screens/DietChartScreen';

// Admin screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import AdminWorkoutsScreen from '../screens/admin/AdminWorkoutsScreen';
import AdminProgressScreen from '../screens/admin/AdminProgressScreen';
import AdminFitnessPlansScreen from '../screens/admin/AdminFitnessPlansScreen';
import AdminDietChartsScreen from '../screens/admin/AdminDietChartsScreen';
import AdminEditUserScreen from '../screens/admin/AdminEditUserScreen';
import AdminEditWorkoutScreen from '../screens/admin/AdminEditWorkoutScreen';
import AdminEditProgressScreen from '../screens/admin/AdminEditProgressScreen';
import AdminEditFitnessPlanScreen from '../screens/admin/AdminEditFitnessPlanScreen';
import AdminEditDietChartScreen from '../screens/admin/AdminEditDietChartScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MemberTabParamList>();
const AdminTab = createBottomTabNavigator<AdminTabParamList>();

const MemberTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Workouts') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Fitness Plan') {
            iconName = focused ? 'flag' : 'flag-outline';
          } else if (route.name === 'Diet Chart') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Workouts" component={WorkoutsScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Fitness Plan" component={FitnessPlanScreen} />
      <Tab.Screen name="Diet Chart" component={DietChartScreen} />
    </Tab.Navigator>
  );
};

const AdminTabNavigator = () => {
  return (
    <AdminTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Admin Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Users') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Workouts') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Fitness Plans') {
            iconName = focused ? 'flag' : 'flag-outline';
          } else if (route.name === 'Diet Charts') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <AdminTab.Screen name="Admin Dashboard" component={AdminDashboardScreen} />
      <AdminTab.Screen name="Users" component={AdminUsersScreen} />
      <AdminTab.Screen name="Workouts" component={AdminWorkoutsScreen} />
      <AdminTab.Screen name="Progress" component={AdminProgressScreen} />
      <AdminTab.Screen name="Fitness Plans" component={AdminFitnessPlansScreen} />
      <AdminTab.Screen name="Diet Charts" component={AdminDietChartsScreen} />
    </AdminTab.Navigator>
  );
};

const AppNavigator = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const isLoading = authContext?.isLoading;

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // Auth screens
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : user.role === 'admin' ? (
          // Admin screens
          <>
            <Stack.Screen name="AdminTabs" component={AdminTabNavigator} />
            <Stack.Screen name="AdminEditUser" component={AdminEditUserScreen} />
            <Stack.Screen name="AdminEditWorkout" component={AdminEditWorkoutScreen} />
            <Stack.Screen name="AdminEditProgress" component={AdminEditProgressScreen} />
            <Stack.Screen name="AdminEditFitnessPlan" component={AdminEditFitnessPlanScreen} />
            <Stack.Screen name="AdminEditDietChart" component={AdminEditDietChartScreen} />
          </>
        ) : (
          // Member screens
          <>
            <Stack.Screen name="MemberTabs" component={MemberTabNavigator} />
            <Stack.Screen name="AddWorkout" component={AddWorkoutScreen} />
            <Stack.Screen name="AddProgress" component={AddProgressScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 