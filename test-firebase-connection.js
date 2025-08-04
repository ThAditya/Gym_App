// Test Firebase connection and permissions
// Run this with: node test-firebase-connection.js

// Mock React Native's __DEV__ variable for Node.js testing
global.__DEV__ = true;

const { getFirebaseConfig } = require('./src/config/environment.ts');

console.log('Testing Firebase Connection...');
console.log('================================');

try {
  const config = getFirebaseConfig();
  
  console.log('✅ Firebase Config Loaded:');
  console.log('- Project ID:', config.projectId);
  console.log('- API Key:', config.apiKey ? '✅ Set' : '❌ Missing');
  
  console.log('\n📋 Next Steps:');
  console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
  console.log('2. Select project:', config.projectId);
  console.log('3. Go to Firestore Database → Rules');
  console.log('4. Replace rules with:');
  console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
  `);
  console.log('5. Click "Publish"');
  console.log('6. Restart your Expo app');
  
} catch (error) {
  console.error('❌ Error testing Firebase configuration:', error.message);
} 