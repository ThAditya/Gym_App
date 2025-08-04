# Firebase Setup Guide for Gym Management Application

## Overview
This guide will help you set up Firebase for the Gym Management Application to enable secure cloud-based data storage and authentication.

## Prerequisites
- A Google account
- Node.js and npm installed
- Expo CLI installed

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "gym-management-app")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication:
   - Click on "Email/Password"
   - Toggle the "Enable" switch
   - Click "Save"

## Step 3: Set up Firestore Database

1. In your Firebase project console, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can add security rules later)
4. Select a location for your database (choose the closest to your users)
5. Click "Done"

## Step 4: Get Firebase Configuration

1. In your Firebase project console, click the gear icon next to "Project Overview"
2. Select "Project settings"
3. Scroll down to the "Your apps" section
4. Click the web icon (</>) to add a web app
5. Enter an app nickname (e.g., "GymApp Web")
6. Click "Register app"
7. Copy the Firebase configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## Step 5: Update Firebase Configuration

1. Open `src/config/firebase.ts` in your project
2. Replace the placeholder configuration with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-actual-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-actual-project-id.appspot.com",
  messagingSenderId: "your-actual-messaging-sender-id",
  appId: "your-actual-app-id"
};
```

## Step 6: Set up Firestore Security Rules

1. In your Firebase console, go to "Firestore Database" > "Rules"
2. Replace the default rules with the following (for development):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all users under any document
    // WARNING: This is for development only. Use proper security rules for production.
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Important**: These rules allow full access to anyone. For production, implement proper authentication and authorization rules.

## Step 7: Test the Setup

1. Start your Expo development server:
   ```bash
   npm start
   ```

2. Open the app in Expo Go or a simulator
3. Try to register a new account
4. Check the Firebase console to see if the user was created in Authentication
5. Check Firestore to see if the member data was created

## Step 8: Production Security Rules (Optional)

For production, implement proper security rules. Here's an example:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /members/{memberId} {
      allow read, write: if request.auth != null && request.auth.uid == memberId;
    }
    
    match /workouts/{workoutId} {
      allow read, write: if request.auth != null && 
        resource.data.memberId == request.auth.uid;
    }
    
    match /progressLogs/{logId} {
      allow read, write: if request.auth != null && 
        resource.data.memberId == request.auth.uid;
    }
    
    // Add similar rules for other collections
  }
}
```

## Troubleshooting

### Common Issues:

1. **"Firebase App named '[DEFAULT]' already exists"**
   - This usually happens when the app is reloaded. The error is harmless and can be ignored in development.

2. **"Permission denied" errors**
   - Check your Firestore security rules
   - Make sure you're using the correct Firebase configuration

3. **Authentication errors**
   - Verify that Email/Password authentication is enabled in Firebase
   - Check that your Firebase configuration is correct

4. **Network errors**
   - Ensure you have a stable internet connection
   - Check if your Firebase project is in the correct region

## Additional Features

### Enable Additional Authentication Methods (Optional)

You can enable additional sign-in methods in Firebase:

1. **Google Sign-In**: Enable Google authentication for easier login
2. **Phone Authentication**: Enable phone number verification
3. **Anonymous Authentication**: Allow users to use the app without registration

### Enable Firebase Storage (Optional)

If you want to store progress photos:

1. Go to "Storage" in Firebase console
2. Click "Get started"
3. Choose a location
4. Set up security rules for file uploads

### Enable Firebase Analytics (Optional)

1. Go to "Analytics" in Firebase console
2. Follow the setup instructions
3. Track user engagement and app performance

## Security Best Practices

1. **Never commit Firebase config with real API keys to public repositories**
2. **Use environment variables for sensitive configuration**
3. **Implement proper Firestore security rules**
4. **Enable Firebase App Check for additional security**
5. **Regularly review and update security rules**

## Support

If you encounter issues:
1. Check the [Firebase Documentation](https://firebase.google.com/docs)
2. Review the [Firebase Console](https://console.firebase.google.com/) for error messages
3. Check the Expo and React Native Firebase documentation

## Next Steps

After setting up Firebase:
1. Test all app features with the new backend
2. Implement proper error handling
3. Add offline support if needed
4. Set up monitoring and analytics
5. Plan for production deployment 