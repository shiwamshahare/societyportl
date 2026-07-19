import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FloatingLabelInput } from '@/components/ui/FloatingLabelInput';
import { BORDER_RADIUS, SPACING } from '@/constants/layout';
import { AuthContext } from '@/context/AuthContext';

const CorporateDetailsScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { type, city, company } = route.params || {};
  const { signUp, setIsSocietyLocked, setSubmittedName } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    employeeId: '',
    corporateEmail: '',
    department: '',
    designation: '',
  });

  const handleSubmit = () => {
    if (!formData.employeeId || !formData.corporateEmail || !formData.department || !formData.designation) {
      Alert.alert('Required Fields', 'Please fill in all the verification fields.');
      return;
    }

    Alert.alert(
      'Pending Approval',
      'The Society Feature would be activated once your request is approved by the Society admin. It usually happens within 48-72 hours. Please reach out to the Society Admin for approval related queries',
      [
        {
          text: 'OK',
          onPress: () => {
            setIsSocietyLocked(true);
            setSubmittedName('Shiwam');
            navigation.navigate('ResidentTabs', { screen: 'Society' });
          },
        },
      ]
    );
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

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

          {/* Circular Avatar Block */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={72} color="rgba(255, 255, 255, 0.2)" />
              <TouchableOpacity style={styles.cameraButton} activeOpacity={0.85}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Employee ID */}
            <View style={styles.inputContainer}>
              <FloatingLabelInput
                label="Employee ID"
                style={styles.input}
                value={formData.employeeId}
                onChangeText={(text) => setFormData({ ...formData, employeeId: text })}
              />
            </View>

            {/* Corporate Email Id */}
            <View style={styles.inputContainer}>
              <FloatingLabelInput
                label="Corporate Email Id"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.corporateEmail}
                onChangeText={(text) => setFormData({ ...formData, corporateEmail: text })}
              />
            </View>

            {/* Department */}
            <View style={styles.inputContainer}>
              <FloatingLabelInput
                label="Department"
                style={styles.input}
                value={formData.department}
                onChangeText={(text) => setFormData({ ...formData, department: text })}
              />
            </View>

            {/* Designation */}
            <View style={styles.inputContainer}>
              <FloatingLabelInput
                label="Designation"
                style={styles.input}
                value={formData.designation}
                onChangeText={(text) => setFormData({ ...formData, designation: text })}
              />
            </View>

            {/* Upload Document Section */}
            <View style={styles.uploadSection}>
              <Text style={styles.uploadTitle}>Upload Documents</Text>
              <Text style={styles.uploadSubtitle}>Upload Image or PDF up to 5 MB in size</Text>

              <TouchableOpacity style={styles.uploadCard} activeOpacity={0.7}>
                <Ionicons name="cloud-upload" size={32} color="#FFFFFF" />
                <Text style={styles.uploadText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Footer Navigation */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4B5563',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  form: {
    gap: SPACING.md,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    fontSize: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    color: '#FFFFFF',
  },
  uploadSection: {
    marginTop: SPACING.md,
  },
  uploadTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  uploadSubtitle: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    marginBottom: SPACING.md,
  },
  uploadCard: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BORDER_RADIUS.lg,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    gap: SPACING.xs,
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  submitButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CorporateDetailsScreen;
