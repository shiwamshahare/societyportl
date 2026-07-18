import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { DarkTheme } from '../utils/theme';
import { SPACING, TOUCH_TARGET, BORDER_RADIUS } from '../constants/layout';

// Add extra small spacing
export const SPACING_XS = 2; // This would normally be in constants but adding here for reference


const HomeScreen = () => {
  const { colors } = useTheme();
  const { user, debugSwitchRole } = useContext(AuthContext);
  const isResident = user?.role === 'resident';

  // If user is not a resident, show access denied
  if (!isResident) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.accessDeniedContainer}>
          <Ionicons name="lock-closed-outline" size={48} color={DarkTheme.status.error} />
          <Text style={styles.accessDeniedTitle}>Access Denied</Text>
          <Text style={styles.accessDeniedMessage}>
            This area is reserved for residents only.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Mock data for quick stats
  const stats = [
    { label: 'Visitors Today', value: '12', icon: 'person-add-outline', color: DarkTheme.status.info },
    { label: 'Pending Approvals', value: '3', icon: 'time-outline', color: DarkTheme.status.warning },
    { label: 'Amenity Bookings', value: '5', icon: 'fitness-outline', color: DarkTheme.status.success },
    { label: 'Notices', value: '8', icon: 'newspaper-outline', color: DarkTheme.accent.goldLight },
  ];

  // Mock recent activities
  const recentActivities = [
    { id: '1', icon: 'checkmark-circle-outline', color: DarkTheme.status.success, text: 'Visitor approved for Flat 101A', time: '2 min ago' },
    { id: '2', icon: 'cube-outline', color: DarkTheme.status.warning, text: 'Delivery received for Flat 205B', time: '15 min ago' },
    { id: '3', icon: 'newspaper-outline', color: DarkTheme.accent.gold, text: 'New community notice posted', time: '1 hour ago' },
    { id: '4', icon: 'person-add-outline', color: DarkTheme.status.info, text: 'New resident moved in: Flat 303B', time: '2 hours ago' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Role Switcher Debug Banner */}
      <View style={styles.debugBanner}>
        <Text style={styles.debugText}>Logged in as: <Text style={{fontWeight: 'bold', color: '#C084FC'}}>{user?.name} ({user?.role})</Text></Text>
        <TouchableOpacity
          onPress={() => {
            if (debugSwitchRole) debugSwitchRole('guard');
          }}
          style={styles.debugButton}
          hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
        >
          <Text style={styles.debugButtonText}>Switch to Guard</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome to Portl</Text>
        <Text style={styles.headerSubtitle}>
          Your community, connected
        </Text>
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

      <View style={styles.activitiesSection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <FlatList
          data={recentActivities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.activityItem}
              hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
            >
              <Ionicons name={item.icon as any} size={20} color={item.color} />
              <View style={styles.activityDetails}>
                <Text style={styles.activityText}>{item.text}</Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.activityListContent}
        />
      </View>

      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {}}
            style={styles.quickActionButton}
            hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
          >
            <Ionicons name="person-add-outline" size={28} color={DarkTheme.accent.gold} />
            <Text style={styles.quickActionLabel}>Visitor Approval</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {}}
            style={styles.quickActionButton}
            hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
          >
            <Ionicons name="fitness-outline" size={28} color={DarkTheme.accent.gold} />
            <Text style={styles.quickActionLabel}>Book Amenity</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {}}
            style={styles.quickActionButton}
            hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
          >
            <Ionicons name="calendar-outline" size={28} color={DarkTheme.accent.gold} />
            <Text style={styles.quickActionLabel}>View Events</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {}}
            style={styles.quickActionButton}
            hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={28} color={DarkTheme.accent.gold} />
            <Text style={styles.quickActionLabel}>Support</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.bg.primary,
    paddingTop: SPACING.sm, // Safe area padding at top
    paddingBottom: SPACING.sm, // Safe area padding at bottom
  },
  header: {
    backgroundColor: DarkTheme.bg.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  headerTitle: {
    color: DarkTheme.text.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: DarkTheme.text.secondary,
    marginTop: SPACING.xs,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: SPACING.md,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: DarkTheme.bg.card,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    width: '45%',
    marginBottom: SPACING.md,
  },
  statInfo: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: DarkTheme.text.secondary,
    marginTop: SPACING.xs,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DarkTheme.text.primary,
    marginTop: SPACING.xs,
  },
  activitiesSection: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: SPACING.md,
    color: DarkTheme.text.primary,
  },
  activityListContent: {
    paddingBottom: SPACING.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: DarkTheme.bg.card,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.xs,
  },
  activityDetails: {
    flex: 1,
    marginLeft: SPACING.sm,
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
  quickActionsSection: {
    padding: SPACING.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  quickActionButton: {
    alignItems: 'center',
    backgroundColor: DarkTheme.bg.card,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    width: '45%',
    marginBottom: SPACING.md,
  },
  quickActionLabel: {
    marginTop: SPACING.xs,
    fontSize: 12,
    color: DarkTheme.text.secondary,
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: DarkTheme.bg.primary,
  },
  accessDeniedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
    color: DarkTheme.status.error,
  },
  accessDeniedMessage: {
    fontSize: 16,
    color: DarkTheme.text.secondary,
  },
  debugBanner: {
    backgroundColor: '#1E1B4B',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#312E81',
  },
  debugText: {
    color: '#D8B4FE',
    fontSize: 12,
  },
  debugButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING_XS,
    borderRadius: BORDER_RADIUS.sm,
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});



export default HomeScreen;