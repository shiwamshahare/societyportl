import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useState } from 'react';
import { Alert, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HouseIllustration, ListSocietyIllustration } from '@/components/ui/SvgIllustrations';
import { BORDER_RADIUS, SPACING } from '@/constants/layout';
import { AuthContext } from '@/context/AuthContext';

const { width } = Dimensions.get('window');

const SocietyScreen = ({ navigation }: { navigation: any }) => {
  const { user, isSocietyLocked, submittedName } = useContext(AuthContext);
  const [showBottomSheet, setShowBottomSheet] = useState(true);
  const [showApprovedAlert, setShowApprovedAlert] = useState(false);

  const handleOnboardNow = () => {
    setShowBottomSheet(true);
  };

  const handleBadgePress = (screen: string) => {
    if (screen === 'Bills') {
      Alert.alert('Bills & Dues', 'All your maintenance and utility bills are cleared for this month! 👍');
    } else {
      navigation.navigate(screen);
    }
  };

  const isLocked = isSocietyLocked || (user && user.isApproved === true);
  const displayName = user?.name ? user.name.split(' ')[0] : (submittedName || 'Shiwam');

  if (isLocked) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Background Gradient Glow */}
        <LinearGradient
          colors={['#000000', '#000000', '#061D22', '#0A2D35']}
          locations={[0, 0.4, 0.8, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Lock Content Container */}
        <View style={styles.lockContainer}>
          {/* Lock Icon */}
          <View style={styles.lockIconCircle}>
            <Ionicons name="lock-closed" size={72} color="#F59E0B" />
          </View>

          {/* User Greeting */}
          <Text style={styles.lockTitle}>Hey {displayName}</Text>

          {/* Locked Notice Description */}
          <Text style={styles.lockDesc}>
            The society features would be activated once your request is approved by Society. It usually happens within 48-72 hours. Please reach out to Society for approval related queries.
          </Text>
        </View>

        {/* Custom Pending Approval Dialog */}
        {showApprovedAlert && (
          <View style={styles.alertOverlay}>
            <View style={styles.alertContent}>
              <Text style={styles.alertText}>
                The society features would be activated once your request is approved by the Society admin. It usually happens within 48-72 hours. Please reach out to the Society admin for approval related queries.
              </Text>
              <TouchableOpacity
                style={styles.alertButton}
                onPress={() => setShowApprovedAlert(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.alertButtonText}>Okay</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Background Gradient Glow */}
      <LinearGradient
        colors={['#000000', '#000000', '#061D22', '#0A2D35']}
        locations={[0, 0.4, 0.8, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.addSpaceButton}
          onPress={() => Alert.alert('Add Space', 'Feature coming soon to allow multi-property management.')}
          activeOpacity={0.7}
        >
          <Text style={styles.addSpaceText}>Add Space</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileIconButton}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../assets/images/avatars/user.png')}
            style={styles.avatarImage}
          />
        </TouchableOpacity>
      </View>

      {/* Main Titles */}
      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>Digitize Your Society</Text>
        <Text style={styles.mainSubtitle}>
          Pre-approving visitors to booking events has never been this easy
        </Text>
      </View>

      {/* Mockup Phone & Floating Badges Area */}
      <View style={styles.mockupContainer}>
        {/* Mockup Phone Body */}
        <View style={styles.phoneBody}>
          <View style={styles.phoneNotch} />
          <View style={styles.phoneScreen}>
            {/* Phone Status Bar */}
            <View style={styles.phoneStatusBar}>
              <Text style={styles.phoneTime}>10:45</Text>
              <View style={styles.phoneStatusIcons}>
                <Ionicons name="wifi" size={10} color="#9CA3AF" />
                <Ionicons name="battery-full" size={12} color="#9CA3AF" />
              </View>
            </View>

            {/* Inner Phone Screen Content */}
            <View style={styles.phoneContent}>
              <Text style={styles.phoneSectionHeader}>Society Features</Text>

              {/* Mock Resident Card */}
              <View style={styles.mockUserCard}>
                <Image
                  source={require('../../../assets/images/avatars/user.png')}
                  style={styles.mockUserAvatar}
                />
                <View>
                  <Text style={styles.mockUserName}>{user?.name || 'Resident'}</Text>
                  <Text style={styles.mockUserRole}>Flat 402B • Resident</Text>
                </View>
              </View>

              {/* Grid of icons */}
              <View style={styles.mockGrid}>
                <View style={styles.mockGridCard}>
                  <Ionicons name="card-outline" size={14} color="#D97706" />
                  <Text style={styles.mockGridText}>ID</Text>
                </View>
                <View style={styles.mockGridCard}>
                  <Ionicons name="fitness-outline" size={14} color="#D97706" />
                  <Text style={styles.mockGridText}>Amenities</Text>
                </View>
                <View style={styles.mockGridCard}>
                  <Ionicons name="receipt-outline" size={14} color="#D97706" />
                  <Text style={styles.mockGridText}>Bills</Text>
                </View>
                <View style={styles.mockGridCard}>
                  <Ionicons name="shield-outline" size={14} color="#D97706" />
                  <Text style={styles.mockGridText}>Guard</Text>
                </View>
              </View>

              {/* Mock Notice Board */}
              <View style={styles.mockNoticeBoard}>
                <Text style={styles.mockNoticeTitle}>Notice Board</Text>
                <Text style={styles.mockNoticeDate}>19 Mar 2026 | 03:00</Text>
                <Text style={styles.mockNoticeDesc} numberOfLines={2}>
                  Holi Celebrations: Wing A courtyard, refreshments served next Saturday...
                </Text>
              </View>
            </View>

            {/* Phone Bottom Tab Bar */}
            <View style={styles.phoneTabBar}>
              <Ionicons name="home" size={12} color="#D97706" />
              <Ionicons name="storefront" size={12} color="#4B5563" />
              <Ionicons name="grid" size={12} color="#4B5563" />
              <Ionicons name="menu" size={12} color="#4B5563" />
            </View>
          </View>
        </View>

        {/* Floating Badges */}
        {/* 1. Digital ID (Top-Left) */}
        <TouchableOpacity
          style={[styles.floatingBadge, styles.badgeDigitalId]}
          activeOpacity={0.8}
          onPress={() => handleBadgePress('DigitalId')}
        >
          <Text style={styles.badgeTitle}>Digital ID</Text>
          <Text style={styles.badgeDesc} numberOfLines={2}>
            Passport for seamless access to your project
          </Text>
        </TouchableOpacity>

        {/* 2. Tickets (Middle-Right) */}
        <TouchableOpacity
          style={[styles.floatingBadge, styles.badgeTickets]}
          activeOpacity={0.8}
          onPress={() => handleBadgePress('Complaints')}
        >
          <Text style={styles.badgeTitle}>Tickets</Text>
          <Text style={styles.badgeDesc} numberOfLines={2}>
            Quick and easy way for issue resolution
          </Text>
        </TouchableOpacity>

        {/* 3. Amenities (Middle-Left) */}
        <TouchableOpacity
          style={[styles.floatingBadge, styles.badgeAmenities]}
          activeOpacity={0.8}
          onPress={() => handleBadgePress('Amenities')}
        >
          <Text style={styles.badgeTitle}>Amenities</Text>
          <Text style={styles.badgeDesc} numberOfLines={2}>
            Book and play your favourite sport now
          </Text>
        </TouchableOpacity>

        {/* 4. Bills (Lower-Right) */}
        <TouchableOpacity
          style={[styles.floatingBadge, styles.badgeBills]}
          activeOpacity={0.8}
          onPress={() => handleBadgePress('Bills')}
        >
          <Text style={styles.badgeTitle}>Bills</Text>
          <Text style={styles.badgeDesc} numberOfLines={2}>
            Convenient way for clearing all your dues
          </Text>
        </TouchableOpacity>

        {/* 5. Visitors (Bottom-Left) */}
        <TouchableOpacity
          style={[styles.floatingBadge, styles.badgeVisitors]}
          activeOpacity={0.8}
          onPress={() => handleBadgePress('Visitors')}
        >
          <Text style={styles.badgeTitle}>Visitors</Text>
          <Text style={styles.badgeDesc} numberOfLines={2}>
            Create pre approvals & allow only authorised entries
          </Text>
        </TouchableOpacity>
      </View>

      {/* Onboard Now Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.onboardButton}
          activeOpacity={0.8}
          onPress={handleOnboardNow}
        >
          <Text style={styles.onboardButtonText}>Onboard Now</Text>
        </TouchableOpacity>

        {/* Page Indicator */}
        <View style={styles.pagerContainer}>
          <View style={styles.pagerLineInactive} />
          <View style={styles.pagerLineActive} />
        </View>
      </View>

      {/* Onboarding Request Bottom Sheet */}
      {showBottomSheet && (
        <View style={styles.bottomSheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Onboarding Request</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowBottomSheet(false)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.7}
            >
              <Ionicons name="close-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.sheetOptions}>
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => {
                setShowBottomSheet(false);
                navigation.navigate('SelectType');
              }}
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

            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => {
                setShowBottomSheet(false);
                navigation.navigate('SocietyDetails');
              }}
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
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  addSpaceButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: BORDER_RADIUS.pill,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  addSpaceText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  profileIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  titleSection: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginTop: 10,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  mainSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
    paddingHorizontal: 10,
  },
  mockupContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    minHeight: 360,
  },
  phoneBody: {
    width: 176,
    height: 296,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: '#0C0C0E',
    padding: 5,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  phoneNotch: {
    width: 56,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    position: 'absolute',
    top: 0,
    left: 56,
    zIndex: 10,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#08080A',
    borderRadius: 18,
    padding: 6,
    justifyContent: 'space-between',
  },
  phoneStatusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginTop: 4,
  },
  phoneTime: {
    color: '#9CA3AF',
    fontSize: 8,
    fontWeight: '600',
  },
  phoneStatusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  phoneContent: {
    flex: 1,
    marginTop: 8,
  },
  phoneSectionHeader: {
    color: '#9CA3AF',
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  mockUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 6,
    padding: 5,
    gap: 5,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  mockUserAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  mockUserName: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  mockUserRole: {
    color: '#9CA3AF',
    fontSize: 6,
  },
  mockGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 4,
    marginVertical: 8,
  },
  mockGridCard: {
    width: '46%',
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  mockGridText: {
    color: '#9CA3AF',
    fontSize: 5,
  },
  mockNoticeBoard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 6,
    padding: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  mockNoticeTitle: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: 'bold',
  },
  mockNoticeDate: {
    color: '#F59E0B',
    fontSize: 5,
    marginVertical: 1,
  },
  mockNoticeDesc: {
    color: '#9CA3AF',
    fontSize: 6,
    lineHeight: 8,
  },
  phoneTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 4,
    paddingBottom: 2,
  },
  floatingBadge: {
    position: 'absolute',
    backgroundColor: 'rgba(12, 12, 14, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 10,
    width: 145,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  badgeTitle: {
    color: '#F59E0B', // Premium Amber Gold Title
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 2,
  },
  badgeDesc: {
    color: '#FFFFFF',
    fontSize: 9.5,
    lineHeight: 13,
  },
  badgeDigitalId: {
    top: 15,
    left: 12,
  },
  badgeTickets: {
    top: 55,
    right: 12,
  },
  badgeAmenities: {
    top: 130,
    left: 8,
  },
  badgeBills: {
    top: 185,
    right: 8,
  },
  badgeVisitors: {
    bottom: 15,
    left: 12,
  },
  bottomSection: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 90, // Room for tab bar
    alignItems: 'center',
    gap: 15,
  },
  onboardButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.pill,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  onboardButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: 'bold',
  },
  pagerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pagerLineInactive: {
    width: 36,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 1,
  },
  pagerLineActive: {
    width: 36,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#18181B',
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: 105,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 20,
    zIndex: 100,
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
    color: '#FFFFFF',
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
    color: '#FFFFFF',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 16,
  },
  optionIllustration: {
    width: 90,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
  },
  lockIconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  lockTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  lockDesc: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  alertOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  alertContent: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  alertText: {
    color: '#FFFFFF',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    fontWeight: '500',
  },
  alertButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  alertButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SocietyScreen;
