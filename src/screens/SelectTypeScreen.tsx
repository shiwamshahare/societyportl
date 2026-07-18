import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme } from '../utils/theme';
import { SPACING, BORDER_RADIUS } from '../constants/layout';

const SelectTypeScreen = ({ navigation }: { navigation: any }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedType) {
      if (selectedType === 'residential') {
        navigation.navigate('SelectRole', { type: selectedType });
      } else {
        navigation.navigate('SelectCity', { type: selectedType });
      }
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
        <Text style={styles.title}>Please select type</Text>

        {/* Vertical Type Cards */}
        <View style={styles.cardsContainer}>
          {/* Commercial */}
          <TouchableOpacity
            style={[
              styles.typeCard,
              selectedType === 'commercial' && styles.selectedTypeCard,
            ]}
            onPress={() => setSelectedType('commercial')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.typeText,
                selectedType === 'commercial' && styles.selectedTypeText,
              ]}
            >
              Commercial
            </Text>
          </TouchableOpacity>

          {/* Residential */}
          <TouchableOpacity
            style={[
              styles.typeCard,
              selectedType === 'residential' && styles.selectedTypeCard,
            ]}
            onPress={() => setSelectedType('residential')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.typeText,
                selectedType === 'residential' && styles.selectedTypeText,
              ]}
            >
              Residential
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        {/* Progress bar line (Step 1/7 = 14.3% width) */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: '14.3%' }]} />
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
              !selectedType && styles.disabledNextButton
            ]}
            onPress={handleNext}
            disabled={!selectedType}
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
  typeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BORDER_RADIUS.lg,
    height: 72,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  selectedTypeCard: {
    borderColor: DarkTheme.accent.gold,
    backgroundColor: 'rgba(217, 119, 6, 0.05)',
  },
  typeText: {
    fontSize: 16,
    color: DarkTheme.text.secondary,
    fontWeight: '500',
  },
  selectedTypeText: {
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

export default SelectTypeScreen;
