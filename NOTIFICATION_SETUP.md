# TheGymEye - Notification System Setup Guide

This guide explains how to set up and use the notification system for membership renewal reminders in TheGymEye.

## Features

### 🔔 Membership Renewal Notifications
- **30-day reminders**: Gentle reminders sent 30 days before membership expiry
- **7-day urgent reminders**: Urgent notifications when membership expires within a week
- **Expired notifications**: Immediate notifications when membership has expired
- **Local push notifications**: Real-time notifications on user devices
- **In-app notifications**: Persistent notifications stored in the app

### 📱 User Experience
- **Notification badge**: Shows unread notification count on the notifications tab
- **Read/unread status**: Users can mark notifications as read
- **Delete notifications**: Users can remove old notifications
- **Membership details**: Shows membership fee and expiry information

### 🛠️ Admin Management
- **Bulk notifications**: Send renewal reminders to all eligible members
- **Notification overview**: View all sent notifications
- **Member filtering**: See which members need renewal reminders
- **Manual triggers**: Send notifications on-demand

## Setup Instructions

### 1. Expo Project Configuration

Update your `app.json` to include notification permissions:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "UIBackgroundModes": ["remote-notification"]
      }
    },
    "android": {
      "permissions": [
        "NOTIFICATIONS",
        "VIBRATE",
        "WAKE_LOCK"
      ]
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff"
        }
      ]
    ]
  }
}
```

### 2. Environment Configuration

Update `src/config/environment.ts`:

```typescript
export const ENV = {
  // ... existing config
  FEATURES: {
    ENABLE_PUSH_NOTIFICATIONS: true,
    // ... other features
  },
  NOTIFICATIONS: {
    ENABLE_MEMBERSHIP_RENEWAL: true,
    RENEWAL_REMINDER_DAYS: 30,
    URGENT_REMINDER_DAYS: 7,
    DAILY_CHECK_TIME: "09:00",
  }
};
```

### 3. Firebase Configuration

Ensure your Firebase project has the following collections:
- `notifications` - Stores all notifications
- `members` - Contains member data with membership dates

### 4. Notification Permissions

The app will automatically request notification permissions when users first access the notifications tab.

## Usage

### For Members

1. **View Notifications**: Tap the "Notifications" tab in the bottom navigation
2. **Read Notifications**: Tap any notification to mark it as read
3. **Delete Notifications**: Tap the trash icon to remove notifications
4. **Membership Details**: View membership fee and expiry information in renewal notifications

### For Admins

1. **Access Notifications**: Go to Admin Dashboard → Quick Actions → "Manage Notifications"
2. **Send Renewal Reminders**: 
   - Tap "Send Renewal Notifications"
   - Review the list of members needing renewal
   - Confirm to send notifications
3. **View All Notifications**: See all sent notifications with user details
4. **Delete Notifications**: Remove old notifications as needed

## Notification Types

### Membership Renewal Notifications

1. **30-day Reminder** (Orange)
   - Title: "📅 Membership Renewal Reminder"
   - Sent when membership expires within 30 days
   - Includes membership fee and expiry date

2. **7-day Urgent Reminder** (Red)
   - Title: "⚠️ Urgent: Membership Expiring Soon!"
   - Sent when membership expires within 7 days
   - Includes days remaining and urgent messaging

3. **Expired Notification** (Red)
   - Title: "❌ Membership Expired"
   - Sent when membership has expired
   - Immediate action required messaging

## Technical Implementation

### Notification Service (`src/services/notificationService.ts`)

Key functions:
- `requestPermissions()` - Request notification permissions
- `sendMembershipRenewalNotification()` - Send renewal notifications
- `checkAllMembersForRenewal()` - Check all members for renewal needs
- `scheduleDailyRenewalCheck()` - Schedule automatic daily checks

### Firebase Service Extensions

New functions added:
- `getAllNotifications()` - Get all notifications
- `deleteNotification()` - Delete a notification
- `getMembersNeedingRenewal()` - Get members needing renewal

### Components

- `NotificationBadge` - Shows unread notification count
- `NotificationsScreen` - Member notification management
- `AdminNotificationsScreen` - Admin notification management

## Customization

### Notification Timing

Modify the timing in `src/config/environment.ts`:

```typescript
NOTIFICATIONS: {
  RENEWAL_REMINDER_DAYS: 30, // Change to desired days
  URGENT_REMINDER_DAYS: 7,   // Change to desired days
  DAILY_CHECK_TIME: "09:00", // Change to desired time
}
```

### Notification Messages

Customize messages in `src/services/notificationService.ts`:

```typescript
// In createUrgentRenewalNotification()
title: '⚠️ Urgent: Membership Expiring Soon!',
message: `Your membership expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}. Renew now to avoid interruption in your fitness journey!`,
```

### Notification Colors

Update colors in the notification screens:

```typescript
const getNotificationColor = (type: string) => {
  switch (type) {
    case 'membership_renewal':
      return '#FF6B35'; // Change to your preferred color
    // ... other types
  }
};
```

## Testing

### Test Notifications

1. **Create test members** with membership dates in the near future
2. **Use admin panel** to manually trigger renewal notifications
3. **Check notification delivery** on test devices
4. **Verify notification actions** (read, delete, etc.)

### Debug Notifications

Enable debug logging in the notification service:

```typescript
console.log('Sending renewal notification to:', member.name);
console.log('Days until expiry:', daysUntilExpiry);
```

## Troubleshooting

### Common Issues

1. **Notifications not showing**
   - Check notification permissions
   - Verify device settings
   - Ensure app is not in background restrictions

2. **Permission denied**
   - Guide users to Settings → Apps → TheGymEye → Permissions
   - Request permissions again in the app

3. **Notifications delayed**
   - Check device battery optimization settings
   - Verify network connectivity
   - Check Firebase configuration

### Support

For technical support:
1. Check the console logs for error messages
2. Verify Firebase configuration
3. Test on different devices
4. Check Expo notification documentation

## Security Considerations

- Notifications are user-specific and only show relevant information
- Admin notifications include user IDs for management purposes
- Sensitive information is not included in notification messages
- Notification data is stored securely in Firebase

## Future Enhancements

Potential improvements:
- Email notifications
- SMS notifications
- Custom notification schedules
- Notification templates
- Analytics and reporting
- A/B testing for notification effectiveness 