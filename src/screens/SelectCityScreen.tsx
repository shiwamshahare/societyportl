import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme } from '../utils/theme';
import { SPACING, BORDER_RADIUS } from '../constants/layout';
import {
  MumbaiIcon,
  PuneIcon,
  BangaloreIcon,
  ChennaiIcon,
  NoidaIcon,
  HyderabadIcon,
} from '../components/ui/SvgIllustrations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CITIES = [
  { id: 'mumbai', name: 'Mumbai', Icon: MumbaiIcon },
  { id: 'pune', name: 'Pune', Icon: PuneIcon },
  { id: 'bangalore', name: 'Bangalore', Icon: BangaloreIcon },
  { id: 'chennai', name: 'Chennai', Icon: ChennaiIcon },
  { id: 'noida', name: 'Noida', Icon: NoidaIcon },
  { id: 'hyderabad', name: 'Hyderabad', Icon: HyderabadIcon },
];

const SelectCityScreen = ({ navigation }: { navigation: any }) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedCity) {
      navigation.navigate('SelectType', { city: selectedCity });
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
        <Text style={styles.title}>Please select your city</Text>

        {/* 3x2 City Grid with dividing borders */}
        <View style={styles.gridContainer}>
          {CITIES.map((city, index) => {
            const isSelected = selectedCity === city.id;
            const IconComponent = city.Icon;
            
            // Calculate grid border styles dynamically to avoid double borders
            const isSecondRow = index >= 3;
            const isRightColumn = index % 3 === 2;
            const isCenterColumn = index % 3 === 1;

            return (
              <TouchableOpacity
                key={city.id}
                style={[
                  styles.gridItem,
                  isSecondRow && styles.borderTop,
                  isCenterColumn && styles.borderLeftRight,
                  isRightColumn && styles.borderLeft,
                  isSelected && styles.selectedGridItem,
                ]}
                onPress={() => setSelectedCity(city.id)}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <IconComponent 
                    color={isSelected ? DarkTheme.accent.gold : 'rgba(255,255,255,0.4)'} 
                    width={48} 
                    height={48} 
                  />
                </View>
                <Text style={[
                  styles.cityLabel, 
                  isSelected && styles.selectedCityLabel
                ]}>
                  {city.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        {/* Progress bar line (Step 1/3 = 33% width) */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: '33.3%' }]} />
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
              !selectedCity && styles.disabledNextButton
            ]}
            onPress={handleNext}
            disabled={!selectedCity}
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
  },
  gridItem: {
    width: '33.33%',
    height: SCREEN_WIDTH * 0.32,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  // Custom grid border helpers
  borderTop: {
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  borderLeftRight: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  selectedGridItem: {
    backgroundColor: 'rgba(217, 119, 6, 0.08)',
  },
  iconContainer: {
    marginBottom: SPACING.sm,
  },
  cityLabel: {
    fontSize: 12,
    color: DarkTheme.text.secondary,
    fontWeight: '500',
  },
  selectedCityLabel: {
    color: DarkTheme.accent.gold,
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

export default SelectCityScreen;
