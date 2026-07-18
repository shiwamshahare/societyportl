import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme } from '../utils/theme';
import { SPACING, BORDER_RADIUS } from '../constants/layout';
import { HouseIllustration, ListSocietyIllustration } from '../components/ui/SvgIllustrations';

const OnboardingIntroScreen = ({ navigation }: { navigation: any }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Background content representing the landing/mockup page */}
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Header bar on landing page */}
        <View style={styles.landingHeader}>
          <TouchableOpacity 
            style={styles.addSpaceButton}
            onPress={() => navigation.navigate('Signup')}
            activeOpacity={0.7}
          >
            <Text style={styles.addSpaceText}>Add Space</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.profileIconButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <Ionicons name="person-circle-outline" size={32} color={DarkTheme.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Digitize your society Title */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Digitize Your Society</Text>
          <Text style={styles.mainSubtitle}>
            Pre-approving visitors to booking events has never been this easy
          </Text>
        </View>

        {/* Visual Mockup Section (representing phone/features) */}
        <View style={styles.mockupContainer}>
          {/* Simulated Phone Body */}
          <View style={styles.phoneBody}>
            <View style={styles.phoneNotch} />
            <View style={styles.phoneScreen}>
              <View style={styles.phoneHeader}>
                <Text style={styles.phoneHeaderTitle}>Society Features</Text>
              </View>
              {/* Mock content grid */}
              <View style={styles.phoneGrid}>
                <View style={styles.phoneCard} />
                <View style={styles.phoneCard} />
                <View style={styles.phoneCard} />
                <View style={styles.phoneCard} />
              </View>
            </View>
          </View>

          {/* Floating Mockup Badges */}
          {/* 1. Digital ID */}
          <View style={[styles.floatingBadge, styles.badgeDigitalId]}>
            <Text style={styles.badgeTitleGold}>Digital ID</Text>
            <Text style={styles.badgeDesc}>Passport for seamless access to your project</Text>
          </View>

          {/* 2. Tickets */}
          <View style={[styles.floatingBadge, styles.badgeTickets]}>
            <Text style={styles.badgeTitleGold}>Tickets</Text>
            <Text style={styles.badgeDesc}>Quick and easy way for issue resolution</Text>
          </View>

          {/* 3. Amenities */}
          <View style={[styles.floatingBadge, styles.badgeAmenities]}>
            <Text style={styles.badgeTitleGold}>Amenities</Text>
            <Text style={styles.badgeDesc}>Book and play your favourite sport now</Text>
          </View>

          {/* 4. Bills */}
          <View style={[styles.floatingBadge, styles.badgeBills]}>
            <Text style={styles.badgeTitleGold}>Bills</Text>
            <Text style={styles.badgeDesc}>Convenient way for clearing all your dues</Text>
          </View>
        </View>
      </ScrollView>

      {/* Onboarding Request Bottom Sheet (always overlaid at the bottom) */}
      <View style={styles.bottomSheet}>
        {/* Bottom Sheet Header */}
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Onboarding Request</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => navigation.navigate('Login')}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Ionicons name="close-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Options List */}
        <View style={styles.sheetOptions}>
          {/* Option 1: Add Your Home */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => navigation.navigate('SelectType')}
            activeOpacity={0.7}
          >
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Add Your Home</Text>
              <Text style={styles.optionDesc}>
                Booking your favourite amenity to allowing visitors made seamless
              </Text>
            </View>
            <View style={styles.optionIllustration}>
              <HouseIllustration />
            </View>
          </TouchableOpacity>

          {/* Option 2: List Your Society With Us */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => navigation.navigate('SocietyDetails')}
            activeOpacity={0.7}
          >
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>List Your Society With Us</Text>
              <Text style={styles.optionDesc}>
                Most advanced and premium society management solution
              </Text>
            </View>
            <View style={styles.optionIllustration}>
              <ListSocietyIllustration />
            </View>
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
  },
  scrollContent: {
    paddingBottom: 380, // Leave enough space for bottom sheet overlay
  },
  landingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  addSpaceButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
    borderRadius: BORDER_RADIUS.pill,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  addSpaceText: {
    color: DarkTheme.text.secondary,
    fontSize: 13,
    fontWeight: '500',
  },
  profileIconButton: {
    padding: SPACING.xs,
  },
  titleSection: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: DarkTheme.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  mainSubtitle: {
    fontSize: 14,
    color: DarkTheme.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  mockupContainer: {
    alignItems: 'center',
    position: 'relative',
    height: 320,
    width: '100%',
    justifyContent: 'center',
    opacity: 0.15, // Blurry / background effect matching screenshot overlay styling
  },
  phoneBody: {
    width: 180,
    height: 300,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: '#374151',
    backgroundColor: '#111827',
    padding: 6,
    position: 'relative',
  },
  phoneNotch: {
    width: 60,
    height: 12,
    backgroundColor: '#374151',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    position: 'absolute',
    top: 0,
    left: 56,
    zIndex: 10,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: SPACING.sm,
  },
  phoneHeader: {
    marginTop: 8,
    marginBottom: 12,
  },
  phoneHeaderTitle: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '600',
  },
  phoneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 6,
  },
  phoneCard: {
    width: '45%',
    height: 40,
    backgroundColor: '#1E293B',
    borderRadius: 6,
  },
  floatingBadge: {
    position: 'absolute',
    backgroundColor: 'rgba(24, 24, 27, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    width: 150,
  },
  badgeTitleGold: {
    color: '#D97706',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  badgeDesc: {
    color: '#9CA3AF',
    fontSize: 10,
    lineHeight: 14,
  },
  badgeDigitalId: {
    top: 10,
    left: 15,
  },
  badgeTickets: {
    top: 50,
    right: 15,
  },
  badgeAmenities: {
    bottom: 80,
    left: 15,
  },
  badgeBills: {
    bottom: 40,
    right: 15,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#18181B', // Charcoal dark sheet background
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DarkTheme.text.primary,
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BORDER_RADIUS.pill,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetOptions: {
    gap: SPACING.md,
  },
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionInfo: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DarkTheme.text.primary,
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 12,
    color: DarkTheme.text.secondary,
    lineHeight: 16,
  },
  optionIllustration: {
    width: 90,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OnboardingIntroScreen;
