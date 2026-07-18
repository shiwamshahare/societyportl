import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
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

const DOCUMENT_TYPES = [
  'Aadhaar Card',
  'PAN Card',
  'Passport',
  'Driving License',
];

const OwnerIdProofScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { type, role, city, society, wing, flat } = route.params || {};

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [docType, setDocType] = useState('Aadhaar Card');
  const [showPicker, setShowPicker] = useState(false);
  const [frontImage, setFrontImage] = useState<boolean>(false);
  const [backImage, setBackImage] = useState<boolean>(false);

  const handleAvatarPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please grant photo library access to upload a profile photo.');
      return;
    }

    Alert.alert(
      'Profile Photo',
      'Upload or capture a clean portrait photo for your resident profile.',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
            if (cameraPerm.status !== 'granted') {
              Alert.alert('Permission Denied', 'Camera access is required.');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.5,
            });
            if (!result.canceled && result.assets[0].uri) {
              setAvatarUri(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.5,
            });
            if (!result.canceled && result.assets[0].uri) {
              setAvatarUri(result.assets[0].uri);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleUploadDoc = (side: 'front' | 'back') => {
    Alert.alert(
      `Upload ${side === 'front' ? 'Front' : 'Back'} Image`,
      `Select the source for your ${docType} ${side} side image.`,
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
            if (!result.canceled) {
              if (side === 'front') setFrontImage(true);
              else setBackImage(true);
            }
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              quality: 0.7,
            });
            if (!result.canceled) {
              if (side === 'front') setFrontImage(true);
              else setBackImage(true);
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
              if (side === 'front') setFrontImage(true);
              else setBackImage(true);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleNext = () => {
    if (!frontImage || !backImage) {
      Alert.alert('Required Documents', 'Please upload both front and back pictures of your ID proof.');
      return;
    }
    if (role === 'tenant') {
      navigation.navigate('TenantNoc', {
        type,
        role,
        city,
        society,
        wing,
        flat,
        docType,
      });
    } else {
      navigation.navigate('OwnerDocuments', {
        type,
        role,
        city,
        society,
        wing,
        flat,
        docType,
      });
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
        {/* Avatar block */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleAvatarPress}
            activeOpacity={0.8}
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={54} color="rgba(255, 255, 255, 0.4)" />
              </View>
            )}
            <View style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Dropdown selector */}
        <Text style={styles.sectionTitle}>Select the document which you are going to upload</Text>
        
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowPicker(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.dropdownText}>{docType}</Text>
          <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Upload grids */}
        <Text style={styles.uploadTitle}>Upload document pictures</Text>
        <Text style={styles.uploadSubtitle}>Please ensure that the uploaded picture is readable</Text>

        <View style={styles.uploadRow}>
          {/* Front Card */}
          <TouchableOpacity
            style={[styles.uploadCard, frontImage && styles.uploadCardActive]}
            onPress={() => handleUploadDoc('front')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={frontImage ? "checkmark-circle" : "camera-outline"}
              size={32}
              color={frontImage ? DarkTheme.accent.gold : "rgba(255, 255, 255, 0.8)"}
            />
            <Text style={styles.cardText}>{frontImage ? 'Uploaded' : 'Front'}</Text>
          </TouchableOpacity>

          {/* Back Card */}
          <TouchableOpacity
            style={[styles.uploadCard, backImage && styles.uploadCardActive]}
            onPress={() => handleUploadDoc('back')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={backImage ? "checkmark-circle" : "camera-outline"}
              size={32}
              color={backImage ? DarkTheme.accent.gold : "rgba(255, 255, 255, 0.8)"}
            />
            <Text style={styles.cardText}>{backImage ? 'Uploaded' : 'Back'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        {/* Progress bar line (Step 7/9 = 77.7% width) */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: '77.7%' }]} />
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

      {/* Custom Picker Modal */}
      <Modal visible={showPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Document Type</Text>
            {DOCUMENT_TYPES.map((typeOption) => (
              <TouchableOpacity
                key={typeOption}
                style={[
                  styles.pickerItem,
                  docType === typeOption && styles.pickerItemActive,
                ]}
                onPress={() => {
                  setDocType(typeOption);
                  setShowPicker(false);
                }}
              >
                <Text style={styles.pickerItemText}>{typeOption}</Text>
                {docType === typeOption && (
                  <Ionicons name="checkmark" size={20} color={DarkTheme.accent.gold} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelPickerBtn}
              onPress={() => setShowPicker(false)}
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
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 22,
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
    marginBottom: 32,
  },
  dropdownText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  uploadTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  uploadSubtitle: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 12,
    marginBottom: 16,
  },
  uploadRow: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadCard: {
    flex: 1,
    height: 90,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    gap: 6,
  },
  uploadCardActive: {
    borderColor: DarkTheme.accent.gold,
    backgroundColor: 'rgba(217, 119, 6, 0.08)',
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 12,
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

export default OwnerIdProofScreen;
