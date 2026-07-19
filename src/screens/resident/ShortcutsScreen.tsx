import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme } from '@/utils/theme';
import { SPACING, BORDER_RADIUS } from '@/constants/layout';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - SPACING.lg * 2 - SPACING.md) / 2;

const ShortcutsScreen = ({ navigation }: { navigation: any }) => {
  const shortcuts = [
    {
      title: 'Visitors',
      desc: 'Pre-approve and manage guests',
      icon: 'person-add-outline',
      color: '#A78BFA', // Violet
      screen: 'Visitors',
    },
    {
      title: 'Amenities',
      desc: 'Book sports and club facilities',
      icon: 'fitness-outline',
      color: '#10B981', // Green
      screen: 'Amenities',
    },
    {
      title: 'Notices',
      desc: 'View circulars and updates',
      icon: 'newspaper-outline',
      color: '#F59E0B', // Gold
      screen: 'Notices',
    },
    {
      title: 'Complaints',
      desc: 'Raise and track service requests',
      icon: 'chatbubble-ellipses-outline',
      color: '#EF4444', // Red
      screen: 'Complaints',
    },
    {
      title: 'Polls',
      desc: 'Participate in decision-making',
      icon: 'stats-chart-outline',
      color: '#3B82F6', // Blue
      screen: 'Polls',
    },
    {
      title: 'Profile',
      desc: 'Manage your settings & flat details',
      icon: 'person-outline',
      color: '#0D9488', // Teal
      screen: 'Profile',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shortcuts</Text>
        <Text style={styles.headerSubtitle}>Access all community features instantly</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {shortcuts.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon as any} size={28} color={item.color} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.bg.primary,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
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
    fontSize: 14,
    marginTop: 4,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100, // Leave room for tab bar
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  card: {
    width: CARD_SIZE,
    backgroundColor: DarkTheme.bg.card,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  cardInfo: {
    gap: 4,
  },
  cardTitle: {
    color: DarkTheme.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDesc: {
    color: DarkTheme.text.secondary,
    fontSize: 11,
    lineHeight: 14,
  },
});

export default ShortcutsScreen;
