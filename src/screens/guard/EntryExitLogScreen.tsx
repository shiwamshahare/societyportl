import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '@/context/AuthContext';
import { DarkTheme } from '@/utils/theme';
import { SPACING, BORDER_RADIUS } from '@/constants/layout';

const EntryExitLogScreen = () => {
  const { colors } = useTheme();
  const { user } = useContext(AuthContext);
  const isGuard = user?.role === 'guard';
  const isAdmin = user?.role === 'admin';
  const isResident = user?.role === 'resident';

  // Check if user has permission to view this screen
  const hasPermission = isGuard || isAdmin;

  // Mock data for entry/exit logs
  const logs = [
    {
      id: '1',
      visitorName: 'John Smith',
      flat: '101A',
      tower: 'Tower A',
      type: 'Visitor',
      timeIn: '10:30 AM',
      timeOut: '11:45 AM',
      status: 'Completed',
    },
    {
      id: '2',
      visitorName: 'Amazon Delivery',
      flat: '205B',
      tower: 'Tower B',
      type: 'Delivery',
      timeIn: '11:15 AM',
      timeOut: '11:20 AM',
      status: 'Completed',
    },
    {
      id: '3',
      visitorName: 'Sarah Johnson',
      flat: '105C',
      tower: 'Tower C',
      type: 'Visitor',
      timeIn: '2:00 PM',
      timeOut: null,
      status: 'Inside',
    },
    {
      id: '4',
      visitorName: 'Mr. Patel (Maintenance)',
      flat: '302A',
      tower: 'Tower A',
      type: 'Staff',
      timeIn: '9:00 AM',
      timeOut: '5:00 PM',
      status: 'Completed',
    },
    {
      id: '5',
      visitorName: 'Food Delivery',
      flat: '205B',
      tower: 'Tower B',
      type: 'Delivery',
      timeIn: '1:30 PM',
      timeOut: '1:35 PM',
      status: 'Completed',
    },
  ];

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionDeniedContainer}>
          <Ionicons name="lock-closed-outline" size={48} color="#EF4444" />
          <Text style={styles.permissionDeniedTitle}>Access Denied</Text>
          <Text style={styles.permissionDeniedMessage}>
            You don't have permission to view entry/exit logs.
          </Text>
          {isResident && (
            <Text style={styles.permissionDeniedHint}>
              Contact the security office for entry/exit information.
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Entry/Exit Log</Text>
        {!isResident && (
          <Text style={styles.subtitle}>
            Monitoring all entries and exits to the community
          </Text>
        )}
      </View>

      <FlatList
        data={logs}
        renderItem={({ item }) => (
          <View style={styles.logItem}>
            <View style={styles.logInfo}>
              <Text style={styles.logName}>{item.visitorName}</Text>
              <Text style={styles.logDetail}>
                {item.type} to Flat {item.flat}, {item.tower}
              </Text>
              <Text style={styles.logTime}>
                In: {item.timeIn} | {item.timeOut ? `Out: ${item.timeOut}` : 'Inside'}
              </Text>
              <Text style={[
                styles.logStatus,
                item.status === 'Completed' && styles.statusCompleted,
                item.status === 'Inside' && styles.statusInside,
              ]}>
                {item.status}
              </Text>
            </View>
            <Ionicons
              name={(item.type === 'Visitor' ? 'person-outline' : item.type === 'Delivery' ? 'cube-outline' : 'build-outline') as any}
              size={24}
              color={item.type === 'Visitor' ? '#3B82F6' : item.type === 'Delivery' ? '#F59E0B' : '#8B5CF6'}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="list-outline" size={40} color="#6B7280" />
            <Text style={styles.emptyText}>No entry/exit records found</Text>
          </View>
        }
      />
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
    padding: SPACING.xl,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: DarkTheme.border.subtle,
  },
  headerTitle: {
    color: DarkTheme.text.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: DarkTheme.text.secondary,
    marginTop: SPACING.xs,
    fontSize: 14,
    textAlign: 'center',
  },
  permissionDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  permissionDeniedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    color: DarkTheme.status.error,
  },
  permissionDeniedMessage: {
    fontSize: 16,
    color: DarkTheme.text.secondary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  permissionDeniedHint: {
    fontSize: 14,
    color: DarkTheme.text.tertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  listContent: {
    padding: SPACING.lg,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: DarkTheme.bg.card,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: DarkTheme.border.subtle,
  },
  logInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  logName: {
    fontSize: 16,
    fontWeight: '600',
    color: DarkTheme.text.primary,
  },
  logDetail: {
    fontSize: 14,
    color: DarkTheme.text.secondary,
    marginTop: SPACING.xs,
  },
  logTime: {
    fontSize: 13,
    color: DarkTheme.text.tertiary,
    marginTop: SPACING.xs,
  },
  logStatus: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.lg,
  },
  statusCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: DarkTheme.status.success,
  },
  statusInside: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    color: '#3B82F6',
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xxxl,
  },
  emptyText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: DarkTheme.text.secondary,
  },
});

export default EntryExitLogScreen;