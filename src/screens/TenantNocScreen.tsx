import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BORDER_RADIUS, SPACING } from '../constants/layout';
import { DarkTheme } from '../utils/theme';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

const { width } = Dimensions.get('window');

const TenantNocScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { type, role, city, society, wing, flat, docType } = route.params || {};

  const [nocUploaded, setNocUploaded] = useState(false);
  const [nocFileName, setNocFileName] = useState<string | null>(null);
  
  const [rentUploaded, setRentUploaded] = useState(false);
  const [rentFileName, setRentFileName] = useState<string | null>(null);

  const [tenureDate, setTenureDate] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleUploadNoc = () => {
    Alert.alert(
      'Upload NOC',
      'Select your No Objection Certificate (PDF, JPG, PNG up to 5MB).',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission Denied', 'Camera access is required.');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              quality: 0.7,
            });
            if (!result.canceled && result.assets[0].uri) {
              setNocUploaded(true);
              setNocFileName(result.assets[0].uri.split('/').pop() || 'noc.jpg');
            }
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              quality: 0.7,
            });
            if (!result.canceled && result.assets[0].uri) {
              setNocUploaded(true);
              setNocFileName(result.assets[0].uri.split('/').pop() || 'noc.jpg');
            }
          },
        },
        {
          text: 'Document Picker',
          onPress: async () => {
            const result = await DocumentPicker.getDocumentAsync({
              type: ['image/*', 'application/pdf'],
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
              setNocUploaded(true);
              setNocFileName(result.assets[0].name || 'noc.pdf');
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleUploadRent = () => {
    Alert.alert(
      'Upload Rent Agreement',
      'Select your registered rent agreement copy (PDF, JPG, PNG up to 5MB).',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission Denied', 'Camera access is required.');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              quality: 0.7,
            });
            if (!result.canceled && result.assets[0].uri) {
              setRentUploaded(true);
              setRentFileName(result.assets[0].uri.split('/').pop() || 'rent.jpg');
            }
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              quality: 0.7,
            });
            if (!result.canceled && result.assets[0].uri) {
              setRentUploaded(true);
              setRentFileName(result.assets[0].uri.split('/').pop() || 'rent.jpg');
            }
          },
        },
        {
          text: 'Document Picker',
          onPress: async () => {
            const result = await DocumentPicker.getDocumentAsync({
              type: ['image/*', 'application/pdf'],
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
              setRentUploaded(true);
              setRentFileName(result.assets[0].name || 'rent_agreement.pdf');
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSelectDate = () => {
    setShowDatePicker(true);
  };

  const handleNext = () => {
    if (!nocUploaded || !rentUploaded) {
      Alert.alert('Required Documents', 'Please upload both your NOC and Rent Agreement.');
      return;
    }
    if (!tenureDate) {
      Alert.alert('Required Field', 'Please select your tenure end date.');
      return;
    }
    
    navigation.navigate('Signup', {
      type,
      userRole: role,
      city,
      society,
      wing,
      flat,
      docType,
      nocFile: nocFileName,
      rentFile: rentFileName,
      tenureEndDate: tenureDate,
    });
  };

  const dates = [
    '31 Dec 2026',
    '30 Jun 2027',
    '31 Dec 2027',
    '30 Jun 2028',
  ];

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

      {/* Scrollable Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* NOC Area */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.title}>NOC and Other Documents</Text>
          <TouchableOpacity onPress={() => Alert.alert('Info', 'No Objection Certificate from the society or flat owner.')}>
            <Ionicons name="information-circle-outline" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Upload Image or PDF up to 5 MB in size</Text>

        <TouchableOpacity
          style={[styles.uploadBox, nocUploaded && styles.uploadBoxActive]}
          onPress={handleUploadNoc}
          activeOpacity={0.7}
        >
          <Ionicons
            name={nocUploaded ? "cloud-done-outline" : "cloud-upload-outline"}
            size={36}
            color={nocUploaded ? DarkTheme.accent.gold : "rgba(255, 255, 255, 0.85)"}
          />
          <Text style={styles.uploadText}>
            {nocUploaded ? nocFileName : 'Upload'}
          </Text>
        </TouchableOpacity>

        {/* Rent Agreement Area */}
        <Text style={[styles.title, { marginTop: 24 }]}>Upload Rent Agreement</Text>
        <Text style={styles.subtitle}>Upload Image or PDF up to 5 MB in size</Text>

        <TouchableOpacity
          style={[styles.uploadBox, rentUploaded && styles.uploadBoxActive]}
          onPress={handleUploadRent}
          activeOpacity={0.7}
        >
          <Ionicons
            name={rentUploaded ? "cloud-done-outline" : "cloud-upload-outline"}
            size={36}
            color={rentUploaded ? DarkTheme.accent.gold : "rgba(255, 255, 255, 0.85)"}
          />
          <Text style={styles.uploadText}>
            {rentUploaded ? rentFileName : 'Upload'}
          </Text>
        </TouchableOpacity>

        {/* Date Selector Area */}
        <Text style={[styles.title, { marginTop: 28 }]}>Tenure End Date</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={handleSelectDate}
          activeOpacity={0.7}
        >
          <Text style={styles.dropdownText}>
            {tenureDate ? tenureDate : 'Select Date'}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        {/* Progress bar line (Step 8/9 = 88.8% width) */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: '88.8%' }]} />
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
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Simple Date Picker Modal */}
      <Modal visible={showDatePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Tenure End Date</Text>
            {dates.map((dateOption) => (
              <TouchableOpacity
                key={dateOption}
                style={[
                  styles.pickerItem,
                  tenureDate === dateOption && styles.pickerItemActive,
                ]}
                onPress={() => {
                  setTenureDate(dateOption);
                  setShowDatePicker(false);
                }}
              >
                <Text style={styles.pickerItemText}>{dateOption}</Text>
                {tenureDate === dateOption && (
                  <Ionicons name="checkmark" size={20} color={DarkTheme.accent.gold} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelPickerBtn}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.cancelPickerText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    alignItems: 'flex-end',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BORDER_RADIUS.pill,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 12,
    paddingBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 16,
  },
  uploadBox: {
    height: 100,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    gap: 8,
  },
  uploadBoxActive: {
    borderColor: DarkTheme.accent.gold,
    backgroundColor: 'rgba(217, 119, 6, 0.08)',
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'transparent',
    marginTop: 12,
  },
  dropdownText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
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
    textDecorationLine: 'underline',
  },
  nextButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: 32,
    minWidth: 100,
    alignItems: 'center',
  },
  nextText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalHeader: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  pickerItemActive: {
    borderBottomColor: DarkTheme.accent.gold,
  },
  pickerItemText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  cancelPickerBtn: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: '#374151',
    alignItems: 'center',
  },
  cancelPickerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TenantNocScreen;
