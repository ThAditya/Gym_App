import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import firebaseService from '../services/firebaseService';
import { ProgressLog } from '../types';

const ProgressScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgressLogs();
  }, []);

  const loadProgressLogs = async () => {
    if (!user?.memberId) return;

    try {
      const logs = await firebaseService.getProgressLogsByMember(user.memberId);
      setProgressLogs(logs);
    } catch (error) {
      console.error('Error loading progress logs:', error);
    } finally {
      setIsLoading(false);
    }
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
          <Text style={styles.progressWeight}>{item.weight} kg</Text>
        </View>
        <View style={styles.progressStats}>
          {item.bodyFat && (
            <Text style={styles.statText}>Body Fat: {item.bodyFat}%</Text>
          )}
          {item.muscleMass && (
            <Text style={styles.statText}>Muscle: {item.muscleMass}kg</Text>
          )}
        </View>
      </View>

      {/* Body Measurements */}
      <View style={styles.measurementsContainer}>
        <Text style={styles.measurementsTitle}>Body Measurements</Text>
        <View style={styles.measurementsGrid}>
          <View style={styles.measurementItem}>
            <Text style={styles.measurementLabel}>Chest</Text>
            <Text style={styles.measurementValue}>{item.measurements.chest}cm</Text>
          </View>
          <View style={styles.measurementItem}>
            <Text style={styles.measurementLabel}>Waist</Text>
            <Text style={styles.measurementValue}>{item.measurements.waist}cm</Text>
          </View>
          <View style={styles.measurementItem}>
            <Text style={styles.measurementLabel}>Hips</Text>
            <Text style={styles.measurementValue}>{item.measurements.hips}cm</Text>
          </View>
          <View style={styles.measurementItem}>
            <Text style={styles.measurementLabel}>Biceps</Text>
            <Text style={styles.measurementValue}>{item.measurements.biceps}cm</Text>
          </View>
          <View style={styles.measurementItem}>
            <Text style={styles.measurementLabel}>Thighs</Text>
            <Text style={styles.measurementValue}>{item.measurements.thighs}cm</Text>
          </View>
          <View style={styles.measurementItem}>
            <Text style={styles.measurementLabel}>Calves</Text>
            <Text style={styles.measurementValue}>{item.measurements.calves}cm</Text>
          </View>
        </View>
      </View>

      {item.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}

      {item.photos && item.photos.length > 0 && (
        <View style={styles.photosContainer}>
          <Text style={styles.photosTitle}>Progress Photos</Text>
          <Text style={styles.photosCount}>{item.photos.length} photo(s)</Text>
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading progress...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Progress Tracking</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddProgress')}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Progress List */}
      {progressLogs.length > 0 ? (
        <FlatList
          data={progressLogs}
          renderItem={renderProgressItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="trending-up-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>No Progress Logs Yet</Text>
          <Text style={styles.emptySubtitle}>Start tracking your fitness journey by logging your first progress update!</Text>
          <TouchableOpacity
            style={styles.emptyAddButton}
            onPress={() => navigation.navigate('AddProgress')}
          >
            <Text style={styles.emptyAddButtonText}>Log Your First Progress</Text>
          </TouchableOpacity>
        </View>
      )}
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
  progressWeight: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 2,
  },
  progressStats: {
    alignItems: 'flex-end',
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  measurementsContainer: {
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
  },
  emptyAddButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProgressScreen; 