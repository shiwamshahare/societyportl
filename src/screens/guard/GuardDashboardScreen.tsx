import React, { useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '@/context/AuthContext';
import { DarkTheme } from '@/utils/theme';
import { SPACING, TOUCH_TARGET, BORDER_RADIUS } from '@/constants/layout';

const GuardDashboardScreen = () => {
  const { colors } = useTheme();
  const { user, debugSwitchRole } = useContext(AuthContext);
  const isGuard = user?.role === 'guard';

  // If user is not a guard, show access denied
  if (!isGuard) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.accessDeniedContainer}>
          <Ionicons name="lock-closed-outline" size={48} color={DarkTheme.status.error} />
          <Text style={styles.accessDeniedTitle}>Access Denied</Text>
          <Text style={styles.accessDeniedMessage}>
            This area is restricted to security personnel only.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Role Switcher Debug Banner */}
      <View style={styles.debugBanner}>
        <Text style={styles.debugText}>Logged in as: <Text style={{fontWeight: 'bold', color: '#2DD4BF'}}>{user?.name} ({user?.role})</Text></Text>
        <TouchableOpacity
          onPress={() => {
            if (debugSwitchRole) debugSwitchRole('resident');
          }}
          style={styles.debugButton}
          hitSlop={TOUCH_TARGET.comfortable}
        >
          <Text style={styles.debugButtonText}>Switch to Resident</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Guard Dashboard</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="person-add-outline" size={24} color={DarkTheme.accent.teal} />
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>Today's Visitors</Text>
            <Text style={styles.statValue}>12</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="cube-outline" size={24} color={DarkTheme.accent.teal} />
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>Deliveries</Text>
            <Text style={styles.statValue}>5</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="alert-circle-outline" size={24} color={DarkTheme.status.error} />
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>Alerts</Text>
            <Text style={styles.statValue}>2</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Activity</Text>
        <View style={styles.activityItem}>
          <Ionicons name="checkmark-circle-outline" size={20} color={DarkTheme.status.success} />
          <View style={styles.activityDetails}>
            <Text style={styles.activityText}>Visitor approved for Flat 101A</Text>
            <Text style={styles.activityTime}>2 minutes ago</Text>
          </View>
        </View>
        <View style={styles.activityItem}>
          <Ionicons name="checkmark-circle-outline" size={20} color={DarkTheme.status.success} />
          <View style={styles.activityDetails}>
            <Text style={styles.activityText}>Delivery accepted for Tower B</Text>
            <Text style={styles.activityTime}>15 minutes ago</Text>
          </View>
        </View>
        <View style={styles.activityItem}>
          <Ionicons name="alert-circle-outline" size={20} color={DarkTheme.status.error} />
          <View style={styles.activityDetails}>
            <Text style={styles.activityText}>Unauthorized entry attempt at Gate 2</Text>
            <Text style={styles.activityTime}>1 hour ago</Text>
          </View>
        </View>
      </View>
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
    padding: 20,
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
    justifyContent: 'space-between',
    padding: 16,
  },
  statCard: {
    backgroundColor: DarkTheme.bg.card,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    width: '31%',
    alignItems: 'center',
  },
  statInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  section: {
    padding: 16,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: DarkTheme.text.primary,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: DarkTheme.bg.card,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
    borderRadius: 8,
    marginBottom: 8,
  },
  activityDetails: {
    flex: 1,
    marginLeft: 12,
  },
  activityText: {
    fontSize: 14,
    color: DarkTheme.text.primary,
  },
  activityTime: {
    fontSize: 12,
    color: DarkTheme.text.tertiary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: DarkTheme.text.secondary,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DarkTheme.text.primary,
    marginTop: 2,
    textAlign: 'center',
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: DarkTheme.bg.primary,
  },
  accessDeniedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: DarkTheme.status.error,
  },
  accessDeniedMessage: {
    fontSize: 16,
    color: DarkTheme.text.secondary,
  },
  debugBanner: {
    backgroundColor: '#064E3B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#065F46',
  },
  debugText: {
    color: '#A7F3D0',
    fontSize: 12,
  },
  debugButton: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default GuardDashboardScreen;