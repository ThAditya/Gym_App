import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import firebaseService from '../services/firebaseService';
import { FitnessPlan } from '../types';

const FitnessPlanScreen = () => {
  const { user } = useAuth();
  const [fitnessPlan, setFitnessPlan] = useState<FitnessPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFitnessPlan();
  }, []);

  const loadFitnessPlan = async () => {
    if (!user?.memberId) return;

    try {
      const plan = await firebaseService.getFitnessPlanByMember(user.memberId);
      setFitnessPlan(plan);
    } catch (error) {
      console.error('Error loading fitness plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading fitness plan...</Text>
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
        <Text style={styles.headerTitle}>Fitness Plan</Text>
      </LinearGradient>

      {fitnessPlan ? (
        <>
          {/* Plan Overview */}
          <View style={styles.planOverview}>
            <Text style={styles.planTitle}>{fitnessPlan.name}</Text>
            <Text style={styles.planDescription}>{fitnessPlan.description}</Text>
            
            <View style={styles.planStats}>
              <View style={styles.statItem}>
                <Ionicons name="flag" size={20} color="#667eea" />
                <Text style={styles.statLabel}>Goal</Text>
                <Text style={styles.statValue}>{fitnessPlan.goal.replace('_', ' ').toUpperCase()}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="calendar" size={20} color="#4CAF50" />
                <Text style={styles.statLabel}>Duration</Text>
                <Text style={styles.statValue}>{Math.ceil((new Date(fitnessPlan.endDate).getTime() - new Date(fitnessPlan.startDate).getTime()) / (1000 * 60 * 60 * 24 * 7))} weeks</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="fitness" size={20} color="#FF9800" />
                <Text style={styles.statLabel}>Workouts</Text>
                <Text style={styles.statValue}>{fitnessPlan.workoutTemplates.length}</Text>
              </View>
            </View>
          </View>

          {/* Workout Schedule */}
          <View style={styles.workoutSchedule}>
            <Text style={styles.sectionTitle}>Weekly Workout Schedule</Text>
            
            {fitnessPlan.workoutTemplates.map((workout, index) => (
              <View key={workout.id} style={styles.workoutDay}>
                <View style={styles.dayHeader}>
                  <View style={[styles.workoutIcon, { backgroundColor: getWorkoutTypeColor(workout.type) }]}>
                    <Ionicons name={getWorkoutTypeIcon(workout.type) as any} size={20} color="white" />
                  </View>
                  <View style={styles.dayInfo}>
                    <Text style={styles.dayName}>{getDayName(workout.dayOfWeek)}</Text>
                    <Text style={styles.workoutName}>{workout.name}</Text>
                  </View>
                  <View style={styles.workoutDuration}>
                    <Text style={styles.durationText}>{workout.duration} min</Text>
                  </View>
                </View>

                {workout.exercises && workout.exercises.length > 0 && (
                  <View style={styles.exercisesList}>
                    {workout.exercises.map((exercise) => (
                      <View key={exercise.id} style={styles.exerciseItem}>
                        <View style={styles.exerciseInfo}>
                          <Text style={styles.exerciseName}>{exercise.name}</Text>
                          <Text style={styles.exerciseDetails}>
                            {exercise.sets} sets × {exercise.reps} reps
                            {exercise.weight && ` @ ${exercise.weight}kg`}
                            {exercise.duration && ` for ${exercise.duration}s`}
                          </Text>
                        </View>
                        {exercise.instructions && (
                          <Text style={styles.exerciseInstructions}>{exercise.instructions}</Text>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>No Fitness Plan Assigned</Text>
          <Text style={styles.emptySubtitle}>
            Your trainer will assign you a personalized fitness plan based on your goals and current fitness level.
          </Text>
        </View>
      )}
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
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  planOverview: {
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
  planTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  planStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  workoutSchedule: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  workoutDay: {
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
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  workoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  dayInfo: {
    flex: 1,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  workoutName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  workoutDuration: {
    alignItems: 'flex-end',
  },
  durationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  exercisesList: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  exerciseItem: {
    marginBottom: 15,
  },
  exerciseInfo: {
    marginBottom: 5,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  exerciseInstructions: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 100,
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
    lineHeight: 24,
  },
});

export default FitnessPlanScreen; 