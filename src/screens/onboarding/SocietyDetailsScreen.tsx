import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, BORDER_RADIUS } from '@/constants/layout';
import { FloatingLabelInput } from '@/components/ui/FloatingLabelInput';
import { DarkTheme } from '@/utils/theme';
import { AuthContext } from '@/context/AuthContext';

const SocietyDetailsScreen = ({ navigation }: { navigation: any }) => {
  const { setIsSocietyLocked, setSubmittedName } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    managerPhone: '',
    managerName: '',
    societyName: '',
    city: '',
    description: '',
  });

  const handleSubmit = () => {
    // Simple validation
    if (!formData.managerPhone || !formData.managerName || !formData.societyName || !formData.city) {
      Alert.alert('Required Fields', 'Please fill in all the required fields.');
      return;
    }

    // Success response
    Alert.alert(
      'Success',
      'Society registration request submitted successfully! We will contact you shortly.',
      [
        {
          text: 'OK',
          onPress: () => {
            setIsSocietyLocked(true);
            setSubmittedName(formData.managerName);
            navigation.navigate('ResidentTabs', { screen: 'Society' });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Society Details</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Phone Field */}
          <FloatingLabelInput
            label="Society manager's mobile number"
            leftComponent={<Text style={styles.countryCode}>+91</Text>}
            rightComponent={
              <TouchableOpacity style={styles.contactIcon} activeOpacity={0.7}>
                <Ionicons name="person-outline" size={20} color="rgba(255, 255, 255, 0.5)" />
              </TouchableOpacity>
            }
            style={styles.phoneInputContainer}
            keyboardType="phone-pad"
            maxLength={10}
            value={formData.managerPhone}
            onChangeText={(text) => setFormData({ ...formData, managerPhone: text.replace(/[^0-9]/g, '') })}
          />

          {/* Manager's Name */}
          <View style={styles.inputGroup}>
            <FloatingLabelInput
              label="Society manager's name"
              value={formData.managerName}
              onChangeText={(text) => setFormData({ ...formData, managerName: text })}
              style={styles.input}
            />
          </View>

          {/* Society Name */}
          <View style={styles.inputGroup}>
            <FloatingLabelInput
              label="Society name"
              value={formData.societyName}
              onChangeText={(text) => setFormData({ ...formData, societyName: text })}
              style={styles.input}
            />
          </View>

          {/* City */}
          <View style={styles.inputGroup}>
            <FloatingLabelInput
              label="City"
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              style={styles.input}
            />
          </View>

          {/* Description (Optional) */}
          <View style={styles.inputGroup}>
            <FloatingLabelInput
              label="Description ( Optional )"
              multiline={true}
              numberOfLines={4}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              style={[styles.input, styles.textArea]}
            />
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Text style={styles.submitButtonText}>Submit Society Details</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Pure black background matching screenshot
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerPlaceholder: {
    width: 32, // to keep Title centered
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    gap: SPACING.lg,
  },
  inputGroup: {
    width: '100%',
  },
  input: {
    height: 56, // Tall input matching screenshot
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)', // Subtle thin border
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    fontSize: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    color: '#FFFFFF',
  },
  textArea: {
    height: 120,
    paddingTop: SPACING.md,
    textAlignVertical: 'top',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56, // Tall input matching screenshot
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingHorizontal: SPACING.lg,
    width: '100%',
  },
  countryCode: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginRight: SPACING.sm,
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    color: '#FFFFFF',
    fontSize: 15,
  },
  contactIcon: {
    padding: SPACING.xs,
  },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  submitButton: {
    backgroundColor: '#FFFFFF', // Premium white button matching screenshot
    borderRadius: 16, // Extra rounded corners
    height: 56, // Tall button
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  submitButtonText: {
    color: '#000000', // Bold black text
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SocietyDetailsScreen;
