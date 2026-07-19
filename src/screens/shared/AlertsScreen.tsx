import React from 'react';
import { View, Text, StyleSheet, FlatList, Switch, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { DarkTheme } from '@/utils/theme';
import { SPACING, TOUCH_TARGET, BORDER_RADIUS } from '@/constants/layout';

const AlertsScreen = () => {
  const { colors } = useTheme();
  const { user } = useContext(AuthContext);
  const isGuard = user?.role === 'guard';
  const isAdmin = user?.role === 'admin';
  const isResident = user?.role === 'resident';

  // Mock alerts data
  const allAlerts = [
    {
      id: '1',
      title: 'Visitor Approval Required',
      message: 'Visitor for Flat 101A needs approval',
      time: '2 min ago',
      type: 'visitor',
      read: false,
    },
    {
      id: '2',
      title: 'Delivery Alert',
      message: 'Package delivered to Flat 205B',
      time: '15 min ago',
      type: 'delivery',
      read: true,
    },
    {
      id: '3',
      title: 'Maintenance Request',
      message: 'Water leakage reported in Tower B',
      time: '1 hour ago',
      type: 'maintenance',
      read: false,
    },
    {
      id: '4',
      title: 'Security Alert',
      message: 'Unidentified person at west gate',
      time: '30 min ago',
      type: 'security',
      read: false,
    },
    {
      id: '5',
      title: 'Event Notice',
      message: 'Community meeting today at 6 PM',
      time: '2 hours ago',
      type: 'announcement',
      read: true,
    },
  ];

  // Filter alerts based on user role
  const alerts = allAlerts.filter(alert => {
    if (isAdmin) return true; // Admin sees all alerts
    if (isGuard) {
      // Guard sees security-related alerts: visitor, security
      return alert.type === 'visitor' || alert.type === 'security';
    }
    if (isResident) {
      // Resident sees personal notifications: delivery, maintenance (their requests), announcement
      return alert.type === 'delivery' || alert.type === 'maintenance' || alert.type === 'announcement';
    }
    return false;
  });

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
    >
      <View style={[
        styles.alertItem,
        !item.read && styles.alertUnread
      ]}>
        <View style={styles.alertContent}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertTitle}>{item.title}</Text>
            <Text style={styles.alertTime}>{item.time}</Text>
          </View>
          <Text style={styles.alertMessage}>{item.message}</Text>
          {!item.read && (
            <View style={styles.markReadContainer}>
              <Switch
                value={true}
                onValueChange={() => {}} // In real app, would mark as read
                trackColor={{ false: DarkTheme.bg.input, true: isGuard ? 'rgba(13, 148, 136, 0.2)' : 'rgba(217, 119, 6, 0.2)' }}
                thumbColor={true ? (isGuard ? DarkTheme.accent.teal : DarkTheme.accent.gold) : DarkTheme.text.tertiary}
              />
              <Text style={styles.markReadText}>Mark as read</Text>
            </View>
          )}
        </View>
        <Ionicons
          name={getAlertIcon(item.type) as any}
          size={24}
          color={getAlertColor(item.type)}
        />
      </View>
    </TouchableOpacity>
  );

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'visitor': return 'person-add-outline';
      case 'delivery': return 'cube-outline';
      case 'maintenance': return 'build-outline';
      case 'security': return 'shield-checkmark-outline';
      case 'announcement': return 'megaphone-outline';
      default: return 'notifications-outline';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'visitor': return '#3B82F6';
      case 'delivery': return '#F59E0B';
      case 'maintenance': return '#10B981';
      case 'security': return '#EF4444';
      case 'announcement': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alerts & Notifications</Text>
        {!isAdmin && (
          <Text style={styles.subtitle}>
            {isGuard ? 'Security & visitor alerts' : isResident ? 'Personal notifications' : ''}
          </Text>
        )}
      </View>

      {alerts.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-outline" size={40} color="#6B7280" />
          <Text style={styles.emptyText}>No alerts</Text>
        </View>
      ) : (
        <FlatList
          data={alerts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.bg.primary,
  },
  header: {
    backgroundColor: DarkTheme.bg.card,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: DarkTheme.border.subtle,
  },
  headerTitle: {
    color: DarkTheme.text.primary,
    fontSize: 20,
    fontWeight: '600',
  },
  subtitle: {
    color: DarkTheme.text.secondary,
    marginTop: SPACING.xs,
    fontSize: 14,
    textAlign: 'center',
  },
  listContent: {
    padding: SPACING.md,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    backgroundColor: DarkTheme.bg.card,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: DarkTheme.border.subtle,
  },
  alertUnread: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  alertContent: {
    flex: 1,
    marginRight: SPACING.md,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DarkTheme.text.primary,
  },
  alertTime: {
    fontSize: 12,
    color: DarkTheme.text.tertiary,
  },
  alertMessage: {
    fontSize: 14,
    color: DarkTheme.text.secondary,
  },
  markReadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  markReadText: {
    fontSize: 12,
    color: DarkTheme.text.secondary,
    marginLeft: SPACING.xs,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xxl,
  },
  emptyText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: DarkTheme.text.secondary,
  },
});

export default AlertsScreen;