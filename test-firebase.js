// Simple Firebase configuration test
// Run this with: node test-firebase.js

// Mock React Native's __DEV__ variable for Node.js testing
global.__DEV__ = true;

const { getFirebaseConfig } = require('./src/config/environment.ts');

console.log('Testing Firebase Configuration...');
console.log('================================');

try {
  const config = getFirebaseConfig();
  
  console.log('Firebase Config:');
  console.log('- API Key:', config.apiKey ? '✅ Set' : '❌ Missing');
  console.log('- Auth Domain:', config.authDomain ? '✅ Set' : '❌ Missing');
  console.log('- Project ID:', config.projectId ? '✅ Set' : '❌ Missing');
  console.log('- Storage Bucket:', config.storageBucket ? '✅ Set' : '❌ Missing');
  console.log('- Messaging Sender ID:', config.messagingSenderId ? '✅ Set' : '❌ Missing');
  console.log('- App ID:', config.appId ? '✅ Set' : '❌ Missing');
  
  const allSet = Object.values(config).every(value => value && value !== 'your-api-key');
  
  if (allSet) {
    console.log('\n✅ Firebase configuration looks good!');
    console.log('You can now run your app with: npm start');
  } else {
    console.log('\n❌ Please update your Firebase configuration in src/config/environment.ts');
    console.log('Follow the setup guide to get your Firebase project credentials.');
  }
  
} catch (error) {
  console.error('❌ Error testing Firebase configuration:', error.message);
} 