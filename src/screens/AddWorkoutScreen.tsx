import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import firebaseService from '../services/firebaseService';
import { Exercise } from '../types';

const AddWorkoutScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [workoutData, setWorkoutData] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: '',
    type: 'strength' as 'cardio' | 'strength' | 'flexibility' | 'mixed',
    notes: '',
    caloriesBurned: '',
  });
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: '',
      sets: 0,
      reps: 0,
      weight: 0,
      duration: 0,
      restTime: 0,
      notes: '',
    };
    setExercises([...exercises, newExercise]);
  };

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setExercises(updatedExercises);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!workoutData.duration || exercises.length === 0) {
      Alert.alert('Error', 'Please fill in duration and add at least one exercise');
      return;
    }

    setIsLoading(true);
    try {
      await firebaseService.createWorkout({
        memberId: user?.memberId || '',
        date: new Date(workoutData.date),
        duration: parseInt(workoutData.duration),
        type: workoutData.type,
        notes: workoutData.notes,
        caloriesBurned: workoutData.caloriesBurned ? parseFloat(workoutData.caloriesBurned) : undefined,
        exercises: exercises,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      Alert.alert('Success', 'Workout saved successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save workout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Workout</Text>
        </View>

        {/* Workout Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date</Text>
            <TextInput
              style={styles.input}
              value={workoutData.date}
              onChangeText={(text) => setWorkoutData({ ...workoutData, date: text })}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Duration (minutes)</Text>
            <TextInput
              style={styles.input}
              value={workoutData.duration}
              onChangeText={(text) => setWorkoutData({ ...workoutData, duration: text })}
              placeholder="60"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Type</Text>
            <View style={styles.typeButtons}>
              {(['cardio', 'strength', 'flexibility', 'mixed'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    workoutData.type === type && styles.typeButtonActive
                  ]}
                  onPress={() => setWorkoutData({ ...workoutData, type })}
                >
                  <Text style={[
                    styles.typeButtonText,
                    workoutData.type === type && styles.typeButtonTextActive
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Calories Burned (optional)</Text>
            <TextInput
              style={styles.input}
              value={workoutData.caloriesBurned}
              onChangeText={(text) => setWorkoutData({ ...workoutData, caloriesBurned: text })}
              placeholder="300"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notes (optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={workoutData.notes}
              onChangeText={(text) => setWorkoutData({ ...workoutData, notes: text })}
              placeholder="How did the workout feel?"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Exercises */}
        <View style={styles.section}>
          <View style={styles.exercisesHeader}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            <TouchableOpacity style={styles.addExerciseButton} onPress={addExercise}>
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.addExerciseButtonText}>Add Exercise</Text>
            </TouchableOpacity>
          </View>

          {exercises.map((exercise, index) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseTitle}>Exercise {index + 1}</Text>
                <TouchableOpacity onPress={() => removeExercise(index)}>
                  <Ionicons name="trash-outline" size={20} color="#F44336" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Exercise Name</Text>
                <TextInput
                  style={styles.input}
                  value={exercise.name}
                  onChangeText={(text) => updateExercise(index, 'name', text)}
                  placeholder="e.g., Bench Press"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>Sets</Text>
                  <TextInput
                    style={styles.input}
                    value={exercise.sets.toString()}
                    onChangeText={(text) => updateExercise(index, 'sets', parseInt(text) || 0)}
                    placeholder="3"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>Reps</Text>
                  <TextInput
                    style={styles.input}
                    value={exercise.reps.toString()}
                    onChangeText={(text) => updateExercise(index, 'reps', parseInt(text) || 0)}
                    placeholder="10"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>Weight (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={exercise.weight?.toString() || ''}
                    onChangeText={(text) => updateExercise(index, 'weight', parseFloat(text) || 0)}
                    placeholder="50"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>Rest Time (sec)</Text>
                  <TextInput
                    style={styles.input}
                    value={exercise.restTime?.toString() || ''}
                    onChangeText={(text) => updateExercise(index, 'restTime', parseInt(text) || 0)}
                    placeholder="60"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Notes (optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={exercise.notes || ''}
                  onChangeText={(text) => updateExercise(index, 'notes', text)}
                  placeholder="Any notes about this exercise"
                  multiline
                  numberOfLines={2}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Workout'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#667eea',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 5,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  typeButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  typeButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: 'white',
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addExerciseButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addExerciseButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  exerciseCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#667eea',
    margin: 20,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddWorkoutScreen; 