# TheGymEye - Gym Management Application

A full-featured React Native mobile application for gym management with Firebase backend integration. This app allows gym members to track their fitness journey, manage workouts, monitor progress, and follow personalized fitness plans and diet charts.

## Features

### 🔐 Authentication & User Management
- Secure user registration and login with Firebase Authentication
- User profile management with personal and contact information
- Membership status tracking and fee management

### 💪 Fitness Tracking
- **Workout Management**: Log and track individual workouts with detailed exercise information
- **Progress Monitoring**: Record weight, body measurements, and progress photos
- **Exercise Library**: Comprehensive exercise tracking with sets, reps, weight, and rest times

### 📊 Progress Analytics
- Visual progress tracking over time
- Body measurements and weight monitoring
- Progress photos and milestone tracking
- Detailed workout history and statistics

### 🎯 Personalized Plans
- **Fitness Plans**: Customized workout schedules assigned by trainers
- **Diet Charts**: Personalized meal plans with nutritional information
- **Goal Tracking**: Set and monitor fitness goals

### 📱 Real-Time Features
- Live data synchronization with Firebase
- Real-time updates across devices
- Offline support for core functionality
- Push notifications (configurable)

## Technology Stack

- **Frontend**: React Native with Expo
- **Backend**: Firebase (Firestore, Authentication)
- **Language**: TypeScript
- **Navigation**: React Navigation
- **UI Components**: Custom components with LinearGradient and Ionicons
- **State Management**: React Context API
- **Database**: Cloud Firestore (NoSQL)

## Prerequisites

Before running this application, make sure you have:

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device (for testing)
- A Firebase project (see [Firebase Setup Guide](FIREBASE_SETUP.md))

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd thegymeye
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Follow the [Firebase Setup Guide](FIREBASE_SETUP.md)
   - Update the Firebase configuration in `src/config/environment.ts`

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - Scan the QR code with Expo Go (Android/iOS)
   - Or press 'a' for Android emulator or 'i' for iOS simulator

## Project Structure

```
thegymeye/
├── src/
│   ├── components/          # Reusable UI components
│   ├── config/             # Configuration files
│   │   ├── firebase.ts     # Firebase initialization
│   │   └── environment.ts  # Environment variables
│   ├── context/            # React Context providers
│   │   └── AuthContext.tsx # Authentication context
│   ├── hooks/              # Custom React hooks
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── screens/            # Application screens
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── WorkoutsScreen.tsx
│   │   ├── AddWorkoutScreen.tsx
│   │   ├── ProgressScreen.tsx
│   │   ├── AddProgressScreen.tsx
│   │   ├── FitnessPlanScreen.tsx
│   │   └── DietChartScreen.tsx
│   ├── services/           # API and data services
│   │   ├── firebaseService.ts  # Firebase data operations
│   │   └── authService.ts      # Authentication operations
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   └── utils/              # Utility functions
├── assets/                 # Static assets
├── App.tsx                 # Main application component
├── package.json
└── README.md
```

## Key Features Implementation

### Authentication Flow
- Firebase Authentication with email/password
- Secure user session management
- Automatic login state persistence
- Protected routes and navigation

### Data Management
- Real-time Firestore database operations
- Optimistic updates for better UX
- Error handling and retry mechanisms
- Data validation and sanitization

### User Interface
- Modern, responsive design
- Intuitive navigation with bottom tabs
- Form validation and error messages
- Loading states and empty states
- Accessibility considerations

## Firebase Collections

The application uses the following Firestore collections:

- **members**: User profile and membership information
- **authUsers**: Authentication user records
- **workouts**: Individual workout sessions
- **progressLogs**: Progress tracking data
- **fitnessPlans**: Personalized workout plans
- **dietCharts**: Personalized meal plans
- **notifications**: User notifications

## Configuration

### Environment Variables
Update `src/config/environment.ts` with your Firebase configuration:

```typescript
export const ENV = {
  FIREBASE: {
    API_KEY: "your-api-key",
    AUTH_DOMAIN: "your-project-id.firebaseapp.com",
    PROJECT_ID: "your-project-id",
    STORAGE_BUCKET: "your-project-id.appspot.com",
    MESSAGING_SENDER_ID: "your-messaging-sender-id",
    APP_ID: "your-app-id"
  },
  // ... other configurations
};
```

### Security Rules
Configure Firestore security rules in the Firebase console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /members/{memberId} {
      allow read, write: if request.auth != null && request.auth.uid == memberId;
    }
    // Add similar rules for other collections
  }
}
```

## Development

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

### Code Style
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Consistent naming conventions

### Testing
- Unit tests for utility functions
- Integration tests for Firebase operations
- Component testing with React Native Testing Library

## Deployment

### Expo Build
1. Configure app.json with your app details
2. Run `expo build:android` or `expo build:ios`
3. Submit to app stores

### Firebase Deployment
1. Configure Firebase hosting (if web version)
2. Set up Firebase App Check for security
3. Configure production security rules

## Security Considerations

- Firebase Authentication for user management
- Firestore security rules for data access control
- Input validation and sanitization
- Secure API key management
- Regular security audits

## Performance Optimization

- Lazy loading of screens and components
- Image optimization and caching
- Efficient Firestore queries
- Offline data synchronization
- Memory leak prevention

## Troubleshooting

### Common Issues

1. **Firebase Connection Errors**
   - Verify Firebase configuration
   - Check network connectivity
   - Ensure Firestore rules allow access

2. **Authentication Issues**
   - Verify Email/Password auth is enabled
   - Check user credentials
   - Clear app cache if needed

3. **Build Errors**
   - Update dependencies
   - Clear Metro cache: `npx expo start --clear`
   - Check TypeScript errors

### Debug Mode
Enable debug logging in development:

```typescript
// In src/config/environment.ts
export const LOGGING = {
  ENABLED: true,
  LEVEL: 'debug'
};
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the [Firebase Setup Guide](FIREBASE_SETUP.md)
- Review Firebase documentation
- Open an issue in the repository

## Roadmap

### Planned Features
- [ ] Push notifications
- [ ] Social features (friend connections)
- [ ] Advanced analytics and charts
- [ ] Integration with fitness devices
- [ ] Video exercise demonstrations
- [ ] Meal planning and recipes
- [ ] Trainer dashboard
- [ ] Payment integration

### Performance Improvements
- [ ] Offline-first architecture
- [ ] Advanced caching strategies
- [ ] Image compression and optimization
- [ ] Bundle size optimization

---

**Note**: This application is designed for educational and demonstration purposes. For production use, ensure proper security measures, testing, and compliance with relevant regulations. 