import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme } from '../utils/theme';
import { SPACING, BORDER_RADIUS } from '../constants/layout';

const { width } = Dimensions.get('window');

// Mock societies grouped by city
const MOCK_SOCIETIES: Record<string, string[]> = {
  mumbai: ['Shanti Sadan Apartments', 'Palm Beach Residency', 'Eternity Towers', 'Imperial Heights', 'Gokuldham Co-Op Society'],
  pune: ['Silicon Hills Society', 'Amanora Gateway Towers', 'Blue Ridge Smart City', 'Ganga Constella', 'Shaniwar Wada Enclave'],
  bangalore: ['Prestige Shantiniketan', 'Brigade Metropolis', 'Sobha Dream Acres', 'Orchid Enclave', 'Vidhana View Residency'],
  chennai: ['DLF Gardencity', 'Olympia Opaline Apartments', 'Hiranandani Parks', 'L&T Eden Park', 'Marina Breeze'],
  noida: ['ATS Pristine', 'Supertech Capetown', 'Mahagun Moderne', 'Jaypee Greens', 'Wave City Center'],
  hyderabad: ['My Home Avatar', 'Aurobindo Regency', 'Lanco Hills Residency', 'Rainbow Vistas Rock', 'Cyberabad Heights'],
};

const SelectSocietyScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { type, role, city } = route.params || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSociety, setSelectedSociety] = useState<string | null>(null);

  // Retrieve mock list for the selected city, falling back to a general list if not found
  const cityKey = (city || 'mumbai').toLowerCase();
  const societiesList = MOCK_SOCIETIES[cityKey] || MOCK_SOCIETIES.mumbai;

  const filteredSocieties = societiesList.filter(s =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNext = () => {
    if (selectedSociety) {
      navigation.navigate('SelectWing', { type, role, city, society: selectedSociety });
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
        <Text style={styles.title}>Please select your society</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="rgba(255, 255, 255, 0.4)" style={styles.searchIcon} />
          <TextInput
            placeholder="Search society"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={false}
          />
        </View>

        {/* Societies List */}
        <ScrollView style={styles.listContainer} keyboardShouldPersistTaps="handled">
          {filteredSocieties.map((society, index) => {
            const isSelected = selectedSociety === society;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.societyItem,
                  isSelected && styles.selectedSocietyItem
                ]}
                onPress={() => setSelectedSociety(society)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.societyText,
                  isSelected && styles.selectedSocietyText
                ]}>
                  {society}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={20} color={DarkTheme.accent.gold} />
                )}
              </TouchableOpacity>
            );
          })}
          {filteredSocieties.length === 0 && (
            <Text style={styles.emptyText}>No societies found matching "{searchQuery}"</Text>
          )}
        </ScrollView>
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        {/* Progress bar line (Step 4/7 = 57.1% width) */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: '57.1%' }]} />
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
              !selectedSociety && styles.disabledNextButton
            ]}
            onPress={handleNext}
            disabled={!selectedSociety}
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
    marginBottom: SPACING.xl,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: SPACING.lg,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#FFFFFF',
    fontSize: 15,
  },
  listContainer: {
    flex: 1,
  },
  societyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 16,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  selectedSocietyItem: {
    borderColor: DarkTheme.accent.gold,
    backgroundColor: 'rgba(217, 119, 6, 0.05)',
  },
  societyText: {
    fontSize: 15,
    color: '#9CA3AF',
    fontWeight: '500',
    flex: 1,
    paddingRight: SPACING.md,
  },
  selectedSocietyText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#6B7280',
    textAlign: 'center',
    marginTop: SPACING.xxl,
    fontSize: 14,
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

export default SelectSocietyScreen;
