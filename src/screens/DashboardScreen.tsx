import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import firebaseService from '../services/firebaseService';
import { Member, Workout, ProgressLog } from '../types';
import RefreshHeader from '../components/RefreshHeader';

const DashboardScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [recentProgress, setRecentProgress] = useState<ProgressLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!user?.memberId) return;

    try {
      const memberData = await firebaseService.getMember(user.memberId);
      const workouts = await firebaseService.getWorkoutsByMember(user.memberId);
      const progressLogs = await firebaseService.getProgressLogsByMember(user.memberId);

      setMember(memberData);
      setRecentWorkouts(workouts.slice(0, 3)); // Get last 3 workouts
      setRecentProgress(progressLogs.slice(0, 3)); // Get last 3 progress logs
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ]
    );
  };

  const getMembershipStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'expired':
        return '#F44336';
      case 'pending':
        return '#FF9800';
      default:
        return '#666';
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!member) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error loading member data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RefreshHeader
        title="Dashboard"
        subtitle={`Welcome back, ${member.name}!`}
        onRefresh={onRefresh}
        gradientColors={['#667eea', '#764ba2']}
      />

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileImage}>
              <Ionicons name="person" size={40} color="white" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{member.name}</Text>
              <Text style={styles.profileEmail}>{member.email}</Text>
              <View style={styles.membershipStatus}>
                <View 
                  style={[
                    styles.statusDot, 
                    { backgroundColor: getMembershipStatusColor(member.membershipStatus) }
                  ]} 
                />
                <Text style={styles.statusText}>
                  {member.membershipStatus.toUpperCase()}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="fitness" size={24} color="#667eea" />
              <Text style={styles.statValue}>{recentWorkouts.length}</Text>
              <Text style={styles.statLabel}>Recent Workouts</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="trending-up" size={24} color="#4CAF50" />
              <Text style={styles.statValue}>{recentProgress.length}</Text>
              <Text style={styles.statLabel}>Progress Logs</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="calendar" size={24} color="#FF9800" />
              <Text style={styles.statValue}>
                {formatDate(member.membershipEndDate)}
              </Text>
              <Text style={styles.statLabel}>Expires</Text>
            </View>
          </View>

          {/* Recent Workouts */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Workouts</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Workouts')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {recentWorkouts.length > 0 ? (
              recentWorkouts.map((workout) => (
                                 <View key={workout.id} style={styles.workoutCard}>
                   <View style={styles.workoutInfo}>
                     <Text style={styles.workoutName}>{workout.type} Workout</Text>
                     <Text style={styles.workoutDate}>
                       {formatDate(workout.date)}
                     </Text>
                   </View>
                   <View style={styles.workoutStats}>
                     <Text style={styles.workoutDuration}>
                       {workout.duration} min
                     </Text>
                     <Text style={styles.workoutCalories}>
                       {workout.caloriesBurned || 0} cal
                     </Text>
                   </View>
                 </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No recent workouts</Text>
            )}
          </View>

          {/* Recent Progress */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Progress</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Progress')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {recentProgress.length > 0 ? (
                             recentProgress.map((progress) => (
                 <View key={progress.id} style={styles.progressCard}>
                   <View style={styles.progressInfo}>
                     <Text style={styles.progressType}>Weight Progress</Text>
                     <Text style={styles.progressDate}>
                       {formatDate(progress.date)}
                     </Text>
                   </View>
                   <View style={styles.progressValue}>
                     <Text style={styles.progressNumber}>
                       {progress.weight} kg
                     </Text>
                   </View>
                 </View>
               ))
            ) : (
              <Text style={styles.noDataText}>No recent progress logs</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  membershipStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    width: '30%',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
  workoutCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  workoutDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  workoutStats: {
    alignItems: 'flex-end',
  },
  workoutDuration: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4CAF50',
  },
  workoutCalories: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF9800',
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  progressInfo: {
    flex: 1,
  },
  progressType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  progressDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  progressValue: {
    alignItems: 'flex-end',
  },
  progressNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default DashboardScreen; 