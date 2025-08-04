// Environment configuration for the Gym Management Application
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
    APP_ID: "1:491835332207:web:618019b0c947be42429f9a"
  },
  
  // App Configuration
  APP: {
    NAME: "GymApp",
    VERSION: "1.0.0",
    DESCRIPTION: "Your Fitness Journey Starts Here"
  },
  
  // Feature Flags
  FEATURES: {
    ENABLE_ANALYTICS: false,
    ENABLE_CRASH_REPORTING: false,
    ENABLE_PUSH_NOTIFICATIONS: false,
    ENABLE_OFFLINE_SUPPORT: true
  },
  
  // API Configuration
  API: {
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3
  }
};

// Helper function to get Firebase config
export const getFirebaseConfig = () => {
  return {
    apiKey: ENV.FIREBASE.API_KEY,
    authDomain: ENV.FIREBASE.AUTH_DOMAIN,
    projectId: ENV.FIREBASE.PROJECT_ID,
    storageBucket: ENV.FIREBASE.STORAGE_BUCKET,
    messagingSenderId: ENV.FIREBASE.MESSAGING_SENDER_ID,
    appId: ENV.FIREBASE.APP_ID
  };
};

// Environment detection
export const isDevelopment = __DEV__;
export const isProduction = !__DEV__;

// Logging configuration
export const LOGGING = {
  ENABLED: isDevelopment,
  LEVEL: isDevelopment ? 'debug' : 'error'
}; 