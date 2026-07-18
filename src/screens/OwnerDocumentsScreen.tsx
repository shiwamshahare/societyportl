import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
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

const OwnerDocumentsScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { type, role, city, society, wing, flat, docType } = route.params || {};

  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUploadPress = () => {
    Alert.alert(
      'Upload Document',
      'Select a document or image (PDF, JPG, PNG up to 5MB).',
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
              setDocumentUploaded(true);
              setFileName(result.assets[0].uri.split('/').pop() || 'document.jpg');
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
              setDocumentUploaded(true);
              setFileName(result.assets[0].uri.split('/').pop() || 'document.jpg');
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
              setDocumentUploaded(true);
              setFileName(result.assets[0].name || 'document.pdf');
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleNext = () => {
    navigation.navigate('Signup', {
      type,
      userRole: role,
      city,
      society,
      wing,
      flat,
      docType,
      otherDoc: fileName,
    });
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
        <Text style={styles.title}>Other Documents (Optional)</Text>
        <Text style={styles.subtitle}>Upload Image or PDF up to 5 MB in size</Text>

        {/* Big Upload Area */}
        <TouchableOpacity
          style={[styles.uploadBox, documentUploaded && styles.uploadBoxActive]}
          onPress={handleUploadPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name={documentUploaded ? "cloud-done-outline" : "cloud-upload-outline"}
            size={48}
            color={documentUploaded ? DarkTheme.accent.gold : "rgba(255, 255, 255, 0.85)"}
          />
          <Text style={styles.uploadText}>
            {documentUploaded ? fileName : 'Upload'}
          </Text>
        </TouchableOpacity>
      </View>

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
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 14,
    marginBottom: 24,
  },
  uploadBox: {
    height: 140,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    gap: 12,
  },
  uploadBoxActive: {
    borderColor: DarkTheme.accent.gold,
    backgroundColor: 'rgba(217, 119, 6, 0.08)',
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 15,
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
});

export default OwnerDocumentsScreen;
