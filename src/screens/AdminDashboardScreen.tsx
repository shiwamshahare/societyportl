import React, { useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { DarkTheme } from '../utils/theme';
import { SPACING, TOUCH_TARGET, BORDER_RADIUS } from '../constants/layout';

const AdminDashboardScreen = () => {
  const { colors } = useTheme();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  // If user is not admin, show access denied
  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <View style={styles.accessDeniedContainer}>
          <Ionicons name="lock-closed-outline" size={48} color={DarkTheme.status.error} />
          <Text style={styles.accessDeniedTitle}>Access Denied</Text>
          <Text style={styles.accessDeniedMessage}>
            This area is restricted to administrators only.
          </Text>
        </View>
      </View>
    );
  }

  // Mock stats data
  const stats = [
    { label: 'Total Residents', value: '156', icon: 'people-outline', color: DarkTheme.accent.gold },
    { label: 'Active Visitors', value: '12', icon: 'person-add-outline', color: '#10B981' },
    { label: 'Pending Complaints', value: '5', icon: 'chatbubble-ellipses-outline', color: '#F59E0B' },
    { label: 'Maintenance Requests', value: '3', icon: 'build-outline', color: '#8B5CF6' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Ionicons name={stat.icon as any} size={24} color={stat.color} />
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        <View style={styles.activityItem}>
          <Ionicons name="checkmark-circle-outline" size={20} color={DarkTheme.status.success} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.activityText}>New resident moved in: Flat 301A</Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
        </View>
        <View style={styles.activityItem}>
          <Ionicons name="cube-outline" size={20} color="#F59E0B" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.activityText}>Delivery received for Flat 105B</Text>
            <Text style={styles.activityTime}>5 hours ago</Text>
          </View>
        </View>
        <View style={styles.activityItem}>
          <Ionicons name="alert-circle-outline" size={20} color={DarkTheme.status.error} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.activityText}>Water supply maintenance scheduled</Text>
            <Text style={styles.activityTime}>Today at 2:00 PM</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.bg.primary,
  },
  header: {
    backgroundColor: DarkTheme.bg.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  headerTitle: {
    color: DarkTheme.text.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  statCard: {
    backgroundColor: DarkTheme.bg.card,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    width: '48%',
    marginBottom: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  activitySection: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    color: DarkTheme.text.primary,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: DarkTheme.bg.card,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  activityText: {
    fontSize: 14,
    color: DarkTheme.text.primary,
  },
  activityTime: {
    fontSize: 12,
    color: DarkTheme.text.tertiary,
    marginTop: SPACING.xs,
  },
  statIcon: {
    marginBottom: 8,
  },
  statInfo: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: DarkTheme.text.secondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DarkTheme.text.primary,
    marginTop: SPACING.xs,
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: DarkTheme.bg.primary,
  },
  accessDeniedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
    color: DarkTheme.status.error,
  },
  accessDeniedMessage: {
    fontSize: 16,
    color: DarkTheme.text.secondary,
  },
});

export default AdminDashboardScreen;