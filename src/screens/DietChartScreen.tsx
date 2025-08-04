import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import firebaseService from '../services/firebaseService';
import { DietChart } from '../types';

const DietChartScreen = () => {
  const { user } = useAuth();
  const [dietChart, setDietChart] = useState<DietChart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDietChart();
  }, []);

  const loadDietChart = async () => {
    if (!user?.memberId) return;

    try {
      const chart = await firebaseService.getDietChartByMember(user.memberId);
      setDietChart(chart);
    } catch (error) {
      console.error('Error loading diet chart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading diet chart...</Text>
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
        <Text style={styles.headerTitle}>Diet Chart</Text>
      </LinearGradient>

      {dietChart ? (
        <>
          {/* Diet Overview */}
          <View style={styles.dietOverview}>
            <Text style={styles.dietTitle}>{dietChart.name}</Text>
            <Text style={styles.dietDescription}>{dietChart.description}</Text>
            
            <View style={styles.dietStats}>
              <View style={styles.statItem}>
                <Ionicons name="restaurant" size={20} color="#667eea" />
                <Text style={styles.statLabel}>Goal</Text>
                <Text style={styles.statValue}>{dietChart.goal.replace('_', ' ').toUpperCase()}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="flame" size={20} color="#F44336" />
                <Text style={styles.statLabel}>Daily Calories</Text>
                <Text style={styles.statValue}>{dietChart.targetCalories}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="time" size={20} color="#4CAF50" />
                <Text style={styles.statLabel}>Meals</Text>
                <Text style={styles.statValue}>{dietChart.meals.length}</Text>
              </View>
            </View>
          </View>

          {/* Daily Meals */}
          <View style={styles.mealsContainer}>
            <Text style={styles.sectionTitle}>Daily Meal Plan</Text>
            
            {dietChart.meals.map((meal, index) => (
              <View key={meal.id} style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <View style={styles.mealIcon}>
                    <Ionicons name="restaurant" size={24} color="#667eea" />
                  </View>
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Text style={styles.mealTime}>{meal.time}</Text>
                  </View>
                  <View style={styles.mealCalories}>
                    <Text style={styles.caloriesText}>{meal.totalCalories} cal</Text>
                  </View>
                </View>

                {meal.foods && meal.foods.length > 0 && (
                  <View style={styles.foodsList}>
                    {meal.foods.map((food) => (
                      <View key={food.id} style={styles.foodItem}>
                        <View style={styles.foodInfo}>
                          <Text style={styles.foodName}>{food.name}</Text>
                          <Text style={styles.foodQuantity}>
                            {food.quantity} {food.unit}
                          </Text>
                        </View>
                        <View style={styles.foodNutrition}>
                          <Text style={styles.nutritionText}>{food.calories} cal</Text>
                          <Text style={styles.nutritionText}>
                            P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {meal.notes && (
                  <View style={styles.mealNotes}>
                    <Text style={styles.notesText}>{meal.notes}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="restaurant-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>No Diet Chart Assigned</Text>
          <Text style={styles.emptySubtitle}>
            Your trainer will assign you a personalized diet chart based on your goals and nutritional needs.
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
  dietOverview: {
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
  dietTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  dietDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  dietStats: {
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
  mealsContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  mealCard: {
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
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  mealIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  mealTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  mealCalories: {
    alignItems: 'flex-end',
  },
  caloriesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
  },
  foodsList: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  foodQuantity: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  foodNutrition: {
    alignItems: 'flex-end',
  },
  nutritionText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  mealNotes: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
    marginTop: 15,
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

export default DietChartScreen; 