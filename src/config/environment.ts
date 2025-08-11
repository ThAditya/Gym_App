// Environment configuration for TheGymEye - Gym Management Application
// This file helps manage different configurations for development and production

export const ENV = {
  // Firebase Configuration
  FIREBASE: {
    // TODO: Replace these with your actual Firebase project configuration
    // Get these values from your Firebase project settings
    API_KEY: "AIzaSyAXiH6Ico0AxoSYlFN1MUxbJ_UbgvUca7Y",
    AUTH_DOMAIN: "gymapp-77199.firebaseapp.com",
    PROJECT_ID: "gymapp-77199",
    STORAGE_BUCKET: "gymapp-77199.firebasestorage.app",
    MESSAGING_SENDER_ID: "491835332207",
    APP_ID: "1:491835332207:web:618019b0c947be42429f9a",
    // Optional: Add these if you want to use Analytics or Realtime Database
    MEASUREMENT_ID: "", // Optional: for Google Analytics
    DATABASE_URL: "", // Optional: for Realtime Database
  },
  
  // App Configuration
  APP: {
    NAME: "TheGymEye",
    VERSION: "1.0.0",
    DESCRIPTION: "Your Fitness Journey Starts Here"
  },
  
  // Feature Flags
  FEATURES: {
    ENABLE_ANALYTICS: false,
    ENABLE_CRASH_REPORTING: false,
    ENABLE_PUSH_NOTIFICATIONS: true,
    ENABLE_OFFLINE_SUPPORT: true
  },
  
  // API Configuration
  API: {
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3
  },

  // Notification Configuration
  NOTIFICATIONS: {
    ENABLE_MEMBERSHIP_RENEWAL: true,
    RENEWAL_REMINDER_DAYS: 30, // Send reminder 30 days before expiry
    URGENT_REMINDER_DAYS: 7,   // Send urgent reminder 7 days before expiry
    DAILY_CHECK_TIME: "09:00", // Daily check at 9 AM
  }
};

// Helper function to get Firebase config
export const getFirebaseConfig = () => {
  return ENV.FIREBASE;
};

// Environment detection
export const isDevelopment = __DEV__;
export const isProduction = !__DEV__;

// Logging configuration
export const LOGGING = {
  ENABLED: isDevelopment,
  LEVEL: isDevelopment ? 'debug' : 'error'
}; 