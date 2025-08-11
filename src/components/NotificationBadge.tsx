import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import firebaseService from '../services/firebaseService';
import { Notification } from '../types';

interface NotificationBadgeProps {
  size?: number;
  color?: string;
  textColor?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  size = 20,
  color = '#FF3B30',
  textColor = 'white'
}) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?.memberId) {
      loadUnreadCount();
    }
  }, [user]);

  const loadUnreadCount = async () => {
    try {
      const notifications = await firebaseService.getNotificationsByUser(user!.memberId!);
      const unread = notifications.filter(notification => !notification.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error loading unread notifications:', error);
    }
  };

  if (unreadCount === 0) {
    return null;
  }

  return (
    <View style={[
      styles.badge,
      {
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: size / 2,
      }
    ]}>
      <Text style={[
        styles.badgeText,
        {
          color: textColor,
          fontSize: Math.max(10, size * 0.6),
        }
      ]}>
        {unreadCount > 99 ? '99+' : unreadCount.toString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 20,
    minHeight: 20,
  },
  badgeText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default NotificationBadge; 