import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import firebaseService from '../services/firebaseService';
import { ProgressLog } from '../types';
import RefreshHeader from '../components/RefreshHeader';

const ProgressScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProgressLogs();
  }, []);

  const loadProgressLogs = async () => {
    if (!user?.memberId) return;

    try {
      const progressData = await firebaseService.getProgressLogsByMember(user.memberId);
      setProgressLogs(progressData);
    } catch (error) {
      console.error('Error loading progress logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProgressLogs();
    setRefreshing(false);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  };

  const renderProgressItem = ({ item }: { item: ProgressLog }) => (
    <View style={styles.progressCard}>
      <View style={styles.progressHeader}>
        <View style={styles.progressIcon}>
          <Ionicons name="trending-up" size={24} color="#4CAF50" />
        </View>
        <View style={styles.progressInfo}>
          <Text style={styles.progressDate}>{formatDate(item.date)}</Text>
          <Text style={styles.progressTitle}>Progress Update</Text>
        </View>
      </View>

      <View style={styles.progressStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Weight</Text>
          <Text style={styles.statValue}>{item.weight} kg</Text>
        </View>
        {item.bodyFat && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Body Fat</Text>
            <Text style={styles.statValue}>{item.bodyFat}%</Text>
          </View>
        )}
        {item.muscleMass && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Muscle Mass</Text>
            <Text style={styles.statValue}>{item.muscleMass} kg</Text>
          </View>
        )}
      </View>

      {item.measurements && (
        <View style={styles.measurementsSection}>
          <Text style={styles.measurementsTitle}>Body Measurements (cm)</Text>
          <View style={styles.measurementsGrid}>
            <View style={styles.measurementItem}>
              <Text style={styles.measurementLabel}>Chest</Text>
              <Text style={styles.measurementValue}>{item.measurements.chest}</Text>
            </View>
            <View style={styles.measurementItem}>
              <Text style={styles.measurementLabel}>Waist</Text>
              <Text style={styles.measurementValue}>{item.measurements.waist}</Text>
            </View>
            <View style={styles.measurementItem}>
              <Text style={styles.measurementLabel}>Hips</Text>
              <Text style={styles.measurementValue}>{item.measurements.hips}</Text>
            </View>
            <View style={styles.measurementItem}>
              <Text style={styles.measurementLabel}>Biceps</Text>
              <Text style={styles.measurementValue}>{item.measurements.biceps}</Text>
            </View>
            <View style={styles.measurementItem}>
              <Text style={styles.measurementLabel}>Thighs</Text>
              <Text style={styles.measurementValue}>{item.measurements.thighs}</Text>
            </View>
            <View style={styles.measurementItem}>
              <Text style={styles.measurementLabel}>Calves</Text>
              <Text style={styles.measurementValue}>{item.measurements.calves}</Text>
            </View>
          </View>
        </View>
      )}

      {item.notes && (
        <View style={styles.notesSection}>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading progress logs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RefreshHeader
        title="Progress"
        subtitle={`${progressLogs.length} progress logs`}
        onRefresh={onRefresh}
        gradientColors={['#4CAF50', '#388E3C']}
      />

      <FlatList
        data={progressLogs}
        renderItem={renderProgressItem}
        keyExtractor={(item) => item.id}
        style={styles.progressList}
        contentContainerStyle={styles.progressListContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="trending-up-outline" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>No Progress Logs Yet</Text>
            <Text style={styles.emptySubtitle}>
              Start tracking your fitness progress by adding your first log!
            </Text>
            <TouchableOpacity
              style={styles.addProgressButton}
              onPress={() => navigation.navigate('AddProgress')}
            >
              <Ionicons name="add" size={24} color="white" />
              <Text style={styles.addProgressButtonText}>Add Progress Log</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddProgress')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
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
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e8f5e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  progressInfo: {
    flex: 1,
  },
  progressDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  progressWeight: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 2,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  measurementsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
    marginBottom: 15,
  },
  measurementsSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
    marginBottom: 15,
  },
  measurementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  measurementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  measurementItem: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  measurementLabel: {
    fontSize: 14,
    color: '#666',
  },
  measurementValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  notesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
    marginBottom: 15,
  },
  notesSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
    marginBottom: 15,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  photosContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  photosTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  photosCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  emptyAddButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyAddButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  progressList: {
    flex: 1,
  },
  progressListContent: {
    padding: 20,
  },
  addProgressButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  addProgressButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default ProgressScreen; 