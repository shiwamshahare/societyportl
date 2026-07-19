import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme } from '@/utils/theme';
import { SPACING, BORDER_RADIUS } from '@/constants/layout';

const WINGS = ['Wing A', 'Wing B', 'Wing C', 'Wing D', 'Wing E', 'Wing F'];

const SelectWingScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { type, role, city, society } = route.params || {};
  const [selectedWing, setSelectedWing] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedWing) {
      navigation.navigate('SelectFlat', { type, role, city, society, wing: selectedWing });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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
        <Text style={styles.title}>Please select your wing</Text>

        {/* Wings List */}
        <ScrollView style={styles.listContainer}>
          {WINGS.map((wing, index) => {
            const isSelected = selectedWing === wing;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.wingItem,
                  isSelected && styles.selectedWingItem
                ]}
                onPress={() => setSelectedWing(wing)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.wingText,
                  isSelected && styles.selectedWingText
                ]}>
                  {wing}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={20} color={DarkTheme.accent.gold} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        {/* Progress bar line (Step 5/7 = 71.4% width) */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: '71.4%' }]} />
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
              !selectedWing && styles.disabledNextButton
            ]}
            onPress={handleNext}
            disabled={!selectedWing}
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
    backgroundColor: '#000000',
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
    color: '#FFFFFF',
    marginBottom: SPACING.xxl,
  },
  listContainer: {
    flex: 1,
  },
  wingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 18,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  selectedWingItem: {
    borderColor: DarkTheme.accent.gold,
    backgroundColor: 'rgba(217, 119, 6, 0.05)',
  },
  wingText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  selectedWingText: {
    color: '#FFFFFF',
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
    color: '#FFFFFF',
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

export default SelectWingScreen;
