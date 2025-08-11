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
import { Member } from '../types';
import RefreshHeader from '../components/RefreshHeader';

const ProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!user?.memberId) return;

    try {
      const memberData = await firebaseService.getMember(user.memberId);
      setMember(memberData);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
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
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (!member) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error loading profile data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RefreshHeader
        title="Profile"
        subtitle="Your personal information"
        onRefresh={onRefresh}
        gradientColors={['#9C27B0', '#673AB7']}
      />

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.profileImage}>
              <Ionicons name="person" size={60} color="white" />
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
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="person" size={20} color="#9C27B0" />
                <Text style={styles.infoLabel}>Name:</Text>
                <Text style={styles.infoValue}>{member.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="mail" size={20} color="#9C27B0" />
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{member.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="call" size={20} color="#9C27B0" />
                <Text style={styles.infoLabel}>Phone:</Text>
                <Text style={styles.infoValue}>{member.phone}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location" size={20} color="#9C27B0" />
                <Text style={styles.infoLabel}>Address:</Text>
                <Text style={styles.infoValue}>{member.address}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="body" size={20} color="#9C27B0" />
                <Text style={styles.infoLabel}>Gender:</Text>
                <Text style={styles.infoValue}>{member.gender}</Text>
              </View>
            </View>
          </View>

          {/* Physical Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Physical Stats</Text>
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Ionicons name="resize" size={24} color="#4CAF50" />
                <Text style={styles.statValue}>{member.height} cm</Text>
                <Text style={styles.statLabel}>Height</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="scale" size={24} color="#FF9800" />
                <Text style={styles.statValue}>{member.weight} kg</Text>
                <Text style={styles.statLabel}>Weight</Text>
              </View>
            </View>
          </View>

          {/* Membership Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Membership Details</Text>
            <View style={styles.membershipCard}>
              <View style={styles.membershipRow}>
                <Text style={styles.membershipLabel}>Status:</Text>
                <View style={[
                  styles.membershipBadge, 
                  { backgroundColor: getMembershipStatusColor(member.membershipStatus) }
                ]}>
                  <Text style={styles.membershipBadgeText}>
                    {member.membershipStatus.toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.membershipRow}>
                <Text style={styles.membershipLabel}>Fee:</Text>
                <Text style={styles.membershipValue}>${member.membershipFee}/month</Text>
              </View>
              <View style={styles.membershipRow}>
                <Text style={styles.membershipLabel}>Start Date:</Text>
                <Text style={styles.membershipValue}>{formatDate(member.membershipStartDate)}</Text>
              </View>
              <View style={styles.membershipRow}>
                <Text style={styles.membershipLabel}>End Date:</Text>
                <Text style={styles.membershipValue}>{formatDate(member.membershipEndDate)}</Text>
              </View>
              <View style={styles.membershipRow}>
                <Text style={styles.membershipLabel}>Next Payment:</Text>
                <Text style={styles.membershipValue}>{formatDate(member.nextPaymentDate)}</Text>
              </View>
            </View>
          </View>

          {/* Emergency Contact */}
          {member.emergencyContact && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Emergency Contact</Text>
              <View style={styles.emergencyCard}>
                <View style={styles.emergencyRow}>
                  <Ionicons name="person" size={20} color="#F44336" />
                  <Text style={styles.emergencyLabel}>Name:</Text>
                  <Text style={styles.emergencyValue}>{member.emergencyContact.name}</Text>
                </View>
                <View style={styles.emergencyRow}>
                  <Ionicons name="call" size={20} color="#F44336" />
                  <Text style={styles.emergencyLabel}>Phone:</Text>
                  <Text style={styles.emergencyValue}>{member.emergencyContact.phone}</Text>
                </View>
                <View style={styles.emergencyRow}>
                  <Ionicons name="people" size={20} color="#F44336" />
                  <Text style={styles.emergencyLabel}>Relationship:</Text>
                  <Text style={styles.emergencyValue}>{member.emergencyContact.relationship}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Actions */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="white" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileEmail: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 18,
    marginTop: 5,
  },
  membershipStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoCard: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginLeft: 10,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  membershipCard: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  membershipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  membershipLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  membershipBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  membershipBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  membershipValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
    textAlign: 'right',
  },
  emergencyCard: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  emergencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  emergencyLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  emergencyValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
    textAlign: 'right',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: '#F44336',
    borderRadius: 10,
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ProfileScreen; 