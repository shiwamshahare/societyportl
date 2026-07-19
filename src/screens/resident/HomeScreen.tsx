import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '@/context/AuthContext';
import { DarkTheme } from '@/utils/theme';
import { SPACING, BORDER_RADIUS } from '@/constants/layout';

const HomeScreen = () => {
  const { user, debugSwitchRole } = useContext(AuthContext);
  const isResident = user?.role === 'resident';

  // If user is not a resident, show access denied
  if (!isResident) {
    return (
      <SafeAreaView style={styles.accessDeniedContainer}>
        <View style={styles.accessDeniedCard}>
          <Ionicons name="lock-closed-outline" size={48} color={DarkTheme.status.error} />
          <Text style={styles.accessDeniedTitle}>Access Denied</Text>
          <Text style={styles.accessDeniedMessage}>
            This area is reserved for residents only.
          </Text>
          <Text style={styles.debugText}>Role: {user?.role}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleExploreNow = () => {
    Alert.alert('Explore Services', 'Welcome to the premium lifestyle! Explore our utilities & features.');
  };

  return (
    <View style={styles.container}>
      {/* Full screen sunset background image */}
      <Image
        source={require('../../../assets/images/login_bg.png')}
        style={styles.bgImage}
        resizeMode="cover"
      />

      {/* Dynamic gradient overlay to blend into solid black tab bar */}
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.45)', 'rgba(0, 0, 0, 0.85)', '#000000']}
        locations={[0, 0.45, 0.8, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Top Header Row */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.addSpaceButton}
            onPress={() => Alert.alert('Add Space', 'Feature coming soon to allow multi-property management.')}
            activeOpacity={0.7}
          >
            <Text style={styles.addSpaceText}>Add Space</Text>
          </TouchableOpacity>

          {/* Role switcher debug indicator */}
          <View style={styles.debugIndicator}>
            <TouchableOpacity
              onPress={() => {
                if (debugSwitchRole) debugSwitchRole('guard');
              }}
              style={styles.debugButton}
              hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
            >
              <Ionicons name="swap-horizontal-outline" size={16} color="#A78BFA" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.profileIconButton}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Profile', `Logged in as ${user?.name || 'Resident'}`)}
          >
            <Image
              source={require('../../../assets/images/avatars/user.png')}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        </View>

        {/* Center/Bottom Content */}
        <View style={styles.content}>
          <View style={styles.textGroup}>
            <Text style={styles.title}>Experience An Unmatched</Text>
            <Text style={styles.title}>Lifestyle</Text>
            <Text style={styles.subtitle}>One stop shop for all your household needs</Text>
          </View>

          {/* Explore Now capsule button */}
          <TouchableOpacity
            style={styles.exploreButton}
            activeOpacity={0.8}
            onPress={handleExploreNow}
          >
            <Text style={styles.exploreButtonText}>EXPLORE NOW</Text>
          </TouchableOpacity>

          {/* Pager Indicator */}
          <View style={styles.pagerContainer}>
            <View style={styles.pagerLineActive} />
            <View style={styles.pagerLineInactive} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
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
  debugIndicator: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -20 }],
  },
  debugButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    alignItems: 'center',
    paddingBottom: 90, // Leaving room for custom bottom tab bar
  },
  textGroup: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 38,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: SPACING.xl,
  },
  exploreButton: {
    backgroundColor: 'rgba(12, 12, 14, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BORDER_RADIUS.pill,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  pagerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 35,
  },
  pagerLineActive: {
    width: 36,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  pagerLineInactive: {
    width: 36,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 1,
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: SPACING.lg,
  },
  accessDeniedCard: {
    backgroundColor: DarkTheme.bg.card,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.md,
    width: '90%',
  },
  accessDeniedTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: DarkTheme.status.error,
  },
  accessDeniedMessage: {
    fontSize: 14,
    color: DarkTheme.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  debugText: {
    fontSize: 12,
    color: DarkTheme.text.tertiary,
    marginTop: SPACING.sm,
  },
});

export default HomeScreen;