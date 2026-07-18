import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme } from '../utils/theme';
import { SPACING, BORDER_RADIUS } from '../constants/layout';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - SPACING.lg * 2 - SPACING.md * 2) / 3;

const FLATS = [
  '101', '102', '103',
  '201', '202', '203',
  '301', '302', '303',
  '401', '402', '403',
  '501', '502', '503'
];

const SelectFlatScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { type, role, city, society, wing } = route.params || {};
  const [selectedFlat, setSelectedFlat] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedFlat) {
      // Append Wing prefix e.g. "Wing A - 101" or just "101" but store wing separately too
      const formattedFlat = `${selectedFlat}`;
      navigation.navigate('Signup', { type, userRole: role, city, society, wing, flat: formattedFlat });
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
        <Text style={styles.title}>Please select your flat</Text>

        {/* Flats Grid */}
        <ScrollView style={styles.listContainer}>
          <View style={styles.grid}>
            {FLATS.map((flat, index) => {
              const isSelected = selectedFlat === flat;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.flatItem,
                    isSelected && styles.selectedFlatItem
                  ]}
                  onPress={() => setSelectedFlat(flat)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.flatText,
                    isSelected && styles.selectedFlatText
                  ]}>
                    {flat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        {/* Progress bar line (Step 6/7 = 85.7% width) */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: '85.7%' }]} />
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
              !selectedFlat && styles.disabledNextButton
            ]}
            onPress={handleNext}
            disabled={!selectedFlat}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'flex-start',
  },
  flatItem: {
    width: ITEM_WIDTH,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  selectedFlatItem: {
    borderColor: DarkTheme.accent.gold,
    backgroundColor: 'rgba(217, 119, 6, 0.05)',
  },
  flatText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  selectedFlatText: {
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

export default SelectFlatScreen;
