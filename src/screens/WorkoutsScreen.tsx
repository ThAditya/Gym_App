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
import { Workout } from '../types';

const WorkoutsScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    if (!user?.memberId) return;

    try {
      const workoutData = await firebaseService.getWorkoutsByMember(user.memberId);
      setWorkouts(workoutData);
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  };

  const getWorkoutTypeIcon = (type: string) => {
    switch (type) {
      case 'cardio':
        return 'heart';
      case 'strength':
        return 'fitness';
      case 'flexibility':
        return 'body';
      case 'mixed':
        return 'grid';
      default:
        return 'fitness';
    }
  };

  const getWorkoutTypeColor = (type: string) => {
    switch (type) {
      case 'cardio':
        return '#F44336';
      case 'strength':
        return '#2196F3';
      case 'flexibility':
        return '#4CAF50';
      case 'mixed':
        return '#FF9800';
      default:
        return '#666';
    }
  };

  const renderWorkoutItem = ({ item }: { item: Workout }) => (
    <TouchableOpacity style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <View style={[styles.workoutIcon, { backgroundColor: getWorkoutTypeColor(item.type) }]}>
          <Ionicons name={getWorkoutTypeIcon(item.type) as any} size={24} color="white" />
        </View>
        <View style={styles.workoutInfo}>
          <Text style={styles.workoutTitle}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)} Workout</Text>
          <Text style={styles.workoutDate}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.workoutStats}>
          <Text style={styles.workoutDuration}>{item.duration} min</Text>
          {item.caloriesBurned && (
            <Text style={styles.workoutCalories}>{item.caloriesBurned} cal</Text>
          )}
        </View>
      </View>
      
      {item.exercises && item.exercises.length > 0 && (
        <View style={styles.exercisesPreview}>
          <Text style={styles.exercisesTitle}>Exercises:</Text>
          {item.exercises.slice(0, 3).map((exercise, index) => (
            <Text key={exercise.id} style={styles.exerciseItem}>
              • {exercise.name} ({exercise.sets} sets × {exercise.reps} reps)
            </Text>
          ))}
          {item.exercises.length > 3 && (
            <Text style={styles.moreExercises}>+{item.exercises.length - 3} more exercises</Text>
          )}
        </View>
      )}
      
      {item.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading workouts...</Text>
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
          <Text style={styles.headerTitle}>My Workouts</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddWorkout')}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Workouts List */}
      {workouts.length > 0 ? (
        <FlatList
          data={workouts}
          renderItem={renderWorkoutItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="fitness-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>No Workouts Yet</Text>
          <Text style={styles.emptySubtitle}>Start your fitness journey by adding your first workout!</Text>
          <TouchableOpacity
            style={styles.emptyAddButton}
            onPress={() => navigation.navigate('AddWorkout')}
          >
            <Text style={styles.emptyAddButtonText}>Add Your First Workout</Text>
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
  workoutCard: {
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
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  workoutIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  workoutDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  workoutStats: {
    alignItems: 'flex-end',
  },
  workoutDuration: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  workoutCalories: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  exercisesPreview: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
    marginBottom: 15,
  },
  exercisesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  exerciseItem: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  moreExercises: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 5,
  },
  notesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
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
    backgroundColor: '#667eea',
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

export default WorkoutsScreen; 