import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import firebaseService from '../services/firebaseService';
import { Member, Workout, ProgressLog } from '../types';

const DashboardScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [recentProgress, setRecentProgress] = useState<ProgressLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
            <View style={styles.profileImage}>
              <Ionicons name="person" size={40} color="white" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.nameText}>{member.name}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Membership Status */}
      <View style={styles.membershipCard}>
        <View style={styles.membershipHeader}>
          <Ionicons name="card-outline" size={24} color="#667eea" />
          <Text style={styles.membershipTitle}>Membership Status</Text>
        </View>
        <View style={styles.membershipDetails}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status:</Text>
            <View style={[styles.statusBadge, { backgroundColor: getMembershipStatusColor(member.membershipStatus) }]}>
              <Text style={styles.statusText}>{member.membershipStatus.toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Fee:</Text>
            <Text style={styles.statusValue}>${member.membershipFee}/month</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Next Payment:</Text>
            <Text style={styles.statusValue}>{formatDate(member.nextPaymentDate)}</Text>
          </View>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="fitness" size={24} color="#667eea" />
            <Text style={styles.statNumber}>{recentWorkouts.length}</Text>
            <Text style={styles.statLabel}>Recent Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>{recentProgress.length}</Text>
            <Text style={styles.statLabel}>Progress Logs</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="scale" size={24} color="#FF9800" />
            <Text style={styles.statNumber}>{member.weight}kg</Text>
            <Text style={styles.statLabel}>Current Weight</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="resize" size={24} color="#9C27B0" />
            <Text style={styles.statNumber}>{member.height}cm</Text>
            <Text style={styles.statLabel}>Height</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddWorkout')}
          >
            <Ionicons name="add-circle" size={24} color="#667eea" />
            <Text style={styles.actionButtonText}>Add Workout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddProgress')}
          >
            <Ionicons name="add-circle" size={24} color="#4CAF50" />
            <Text style={styles.actionButtonText}>Log Progress</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.activityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        {recentWorkouts.length > 0 && (
          <View style={styles.activitySection}>
            <Text style={styles.activitySectionTitle}>Recent Workouts</Text>
            {recentWorkouts.map((workout, index) => (
              <View key={workout.id} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name="fitness" size={20} color="#667eea" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{workout.type} Workout</Text>
                  <Text style={styles.activitySubtitle}>
                    {workout.duration} min • {formatDate(workout.date)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {recentProgress.length > 0 && (
          <View style={styles.activitySection}>
            <Text style={styles.activitySectionTitle}>Recent Progress</Text>
            {recentProgress.map((progress, index) => (
              <View key={progress.id} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name="trending-up" size={20} color="#4CAF50" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Progress Update</Text>
                  <Text style={styles.activitySubtitle}>
                    {progress.weight}kg • {formatDate(progress.date)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {recentWorkouts.length === 0 && recentProgress.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="fitness-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No recent activity</Text>
            <Text style={styles.emptyStateSubtext}>Start your fitness journey today!</Text>
          </View>
        )}
      </View>
    </ScrollView>
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
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
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
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  nameText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
  },
  membershipCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  membershipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  membershipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  membershipDetails: {
    gap: 10,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    width: '48%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  actionsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 8,
  },
  activityContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  activitySection: {
    marginBottom: 20,
  },
  activitySectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  activityItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
});

export default DashboardScreen; 