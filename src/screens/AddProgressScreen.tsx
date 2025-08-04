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

const AddProgressScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    bodyFat: '',
    muscleMass: '',
    chest: '',
    waist: '',
    hips: '',
    biceps: '',
    thighs: '',
    calves: '',
    neck: '',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!progressData.weight) {
      Alert.alert('Error', 'Please enter your weight');
      return;
    }

    setIsLoading(true);
    try {
      await firebaseService.createProgressLog({
        memberId: user?.memberId || '',
        date: new Date(progressData.date),
        weight: parseFloat(progressData.weight),
        bodyFat: progressData.bodyFat ? parseFloat(progressData.bodyFat) : undefined,
        muscleMass: progressData.muscleMass ? parseFloat(progressData.muscleMass) : undefined,
        measurements: {
          chest: parseFloat(progressData.chest) || 0,
          waist: parseFloat(progressData.waist) || 0,
          hips: parseFloat(progressData.hips) || 0,
          biceps: parseFloat(progressData.biceps) || 0,
          thighs: parseFloat(progressData.thighs) || 0,
          calves: parseFloat(progressData.calves) || 0,
          neck: parseFloat(progressData.neck) || 0,
        },
        notes: progressData.notes,
        photos: [],
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Success', 'Progress log saved successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save progress log');
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
          <Text style={styles.headerTitle}>Add Progress Log</Text>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date</Text>
            <TextInput
              style={styles.input}
              value={progressData.date}
              onChangeText={(text) => setProgressData({ ...progressData, date: text })}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Weight (kg) *</Text>
            <TextInput
              style={styles.input}
              value={progressData.weight}
              onChangeText={(text) => setProgressData({ ...progressData, weight: text })}
              placeholder="70.5"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Body Fat % (optional)</Text>
              <TextInput
                style={styles.input}
                value={progressData.bodyFat}
                onChangeText={(text) => setProgressData({ ...progressData, bodyFat: text })}
                placeholder="15.0"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Muscle Mass (kg) (optional)</Text>
              <TextInput
                style={styles.input}
                value={progressData.muscleMass}
                onChangeText={(text) => setProgressData({ ...progressData, muscleMass: text })}
                placeholder="45.0"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Body Measurements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Body Measurements (cm)</Text>
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Chest</Text>
              <TextInput
                style={styles.input}
                value={progressData.chest}
                onChangeText={(text) => setProgressData({ ...progressData, chest: text })}
                placeholder="95"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Waist</Text>
              <TextInput
                style={styles.input}
                value={progressData.waist}
                onChangeText={(text) => setProgressData({ ...progressData, waist: text })}
                placeholder="80"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Hips</Text>
              <TextInput
                style={styles.input}
                value={progressData.hips}
                onChangeText={(text) => setProgressData({ ...progressData, hips: text })}
                placeholder="95"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Neck</Text>
              <TextInput
                style={styles.input}
                value={progressData.neck}
                onChangeText={(text) => setProgressData({ ...progressData, neck: text })}
                placeholder="40"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Biceps</Text>
              <TextInput
                style={styles.input}
                value={progressData.biceps}
                onChangeText={(text) => setProgressData({ ...progressData, biceps: text })}
                placeholder="35"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Thighs</Text>
              <TextInput
                style={styles.input}
                value={progressData.thighs}
                onChangeText={(text) => setProgressData({ ...progressData, thighs: text })}
                placeholder="55"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Calves</Text>
            <TextInput
              style={styles.input}
              value={progressData.calves}
              onChangeText={(text) => setProgressData({ ...progressData, calves: text })}
              placeholder="35"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={progressData.notes}
            onChangeText={(text) => setProgressData({ ...progressData, notes: text })}
            placeholder="How are you feeling? Any observations about your progress?"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Progress Log'}
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
    backgroundColor: '#4CAF50',
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
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
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

export default AddProgressScreen; 