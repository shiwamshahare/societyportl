import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme } from '../utils/theme';
import { SPACING, BORDER_RADIUS } from '../constants/layout';

const SelectRoleScreen = ({ navigation, route }: { navigation: any, route: any }) => {
  const { city, type } = route.params || {};
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedRole) {
      navigation.navigate('Signup', { city, type, userRole: selectedRole });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.navigate('OnboardingIntro')}
          activeOpacity={0.7}
        >
          <Ionicons name="close-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Are you an owner or tenant?</Text>

        {/* Vertical Role Cards */}
        <View style={styles.cardsContainer}>
          {/* Owner */}
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'owner' && styles.selectedRoleCard,
            ]}
            onPress={() => setSelectedRole('owner')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.roleText,
                selectedRole === 'owner' && styles.selectedRoleText,
              ]}
            >
              Owner
            </Text>
          </TouchableOpacity>

          {/* Tenant */}
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'tenant' && styles.selectedRoleCard,
            ]}
            onPress={() => setSelectedRole('tenant')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.roleText,
                selectedRole === 'tenant' && styles.selectedRoleText,
              ]}
            >
              Tenant
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        {/* Progress bar line (Step 3/3 = 100% width) */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: '100%' }]} />
        </View>

        <View style={styles.footerButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nextButton,
              !selectedRole && styles.disabledNextButton
            ]}
            onPress={handleNext}
            disabled={!selectedRole}
            activeOpacity={0.8}
          >
            <Text style={styles.nextText}>Next</Text>
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
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BORDER_RADIUS.pill,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: DarkTheme.text.primary,
    marginBottom: SPACING.xxl,
  },
  cardsContainer: {
    gap: SPACING.lg,
  },
  roleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BORDER_RADIUS.lg,
    height: 72,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  selectedRoleCard: {
    borderColor: DarkTheme.accent.gold,
    backgroundColor: 'rgba(217, 119, 6, 0.05)',
  },
  roleText: {
    fontSize: 16,
    color: DarkTheme.text.secondary,
    fontWeight: '500',
  },
  selectedRoleText: {
    color: DarkTheme.text.primary,
    fontWeight: 'bold',
  },
  footer: {
    paddingBottom: SPACING.xl,
  },
  progressBarContainer: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
    marginBottom: SPACING.xl,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  backButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  backText: {
    color: DarkTheme.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: 32,
    minWidth: 100,
    alignItems: 'center',
  },
  disabledNextButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  nextText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SelectRoleScreen;
