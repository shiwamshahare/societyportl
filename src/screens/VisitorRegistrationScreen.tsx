import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { DropdownPicker } from '../components/ui/DropdownPicker';
import { CustomDatePicker } from '../components/ui/DatePicker';
import { FloatingLabelInput } from '../components/ui/FloatingLabelInput';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { DarkTheme } from '../utils/theme';
import { SPACING, TOUCH_TARGET, BORDER_RADIUS } from '../constants/layout';

const VisitorRegistrationScreen = () => {
  const { colors } = useTheme();
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorFlat, setVisitorFlat] = useState('');
  const [visitorTower, setVisitorTower] = useState('');
  const [visitDate, setVisitDate] = useState(new Date());
  const [visitPurpose, setVisitPurpose] = useState('');
  const [visitorType, setVisitorType] = useState('visitor'); // visitor, delivery, service, etc.
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = () => {
    // In a real app, this would send data to backend
    Alert.alert('Success', 'Visitor registered successfully!');
    // Reset form
    setVisitorName('');
    setVisitorPhone('');
    setVisitorFlat('');
    setVisitorTower('');
    setVisitDate(new Date());
    setVisitPurpose('');
    setVisitorType('visitor');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Visitor Registration</Text>
      </View>

      <View style={styles.formContainer}>
        <FloatingLabelInput
          label="Visitor Name"
          value={visitorName}
          onChangeText={setVisitorName}
          style={styles.input}
        />
        <FloatingLabelInput
          label="Phone Number"
          value={visitorPhone}
          onChangeText={setVisitorPhone}
          keyboardType="phone-pad"
          style={styles.input}
        />
        <FloatingLabelInput
          label="Flat Number"
          value={visitorFlat}
          onChangeText={setVisitorFlat}
          style={styles.input}
        />
        <FloatingLabelInput
          label="Tower/Building"
          value={visitorTower}
          onChangeText={setVisitorTower}
          style={styles.input}
        />
        <FloatingLabelInput
          label="Purpose of Visit"
          value={visitPurpose}
          onChangeText={setVisitPurpose}
          style={styles.input}
        />
        <DropdownPicker
          selectedValue={visitorType}
          onValueChange={(value) => setVisitorType(value)}
          items={[
            { label: 'Visitor', value: 'visitor' },
            { label: 'Delivery Person', value: 'delivery' },
            { label: 'Service Staff', value: 'service' },
            { label: 'Cab/Taxi', value: 'cab' },
          ]}
          placeholder="Visitor Type"
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowDatePicker(true)}
          style={[styles.input, { justifyContent: 'center' }]}
          hitSlop={TOUCH_TARGET.comfortable}
        >
          <Text style={{ color: DarkTheme.text.primary, fontSize: 14 }}>
            Visit Date: {visitDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        <CustomDatePicker
          value={visitDate}
          onChange={(date) => setVisitDate(date)}
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSubmit}
          style={styles.submitButton}
          hitSlop={TOUCH_TARGET.comfortable}
        >
          <Text style={styles.submitButtonText}>Register Visitor</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.bg.primary,
    padding: SPACING.lg,
  },
  header: {
    backgroundColor: DarkTheme.bg.card,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: DarkTheme.border.subtle,
  },
  headerTitle: {
    color: DarkTheme.text.primary,
    fontSize: 18, // h5 size
    fontWeight: '600' as const,
    marginBottom: SPACING.xs,
  },
  formContainer: {
    flex: 1,
    marginTop: SPACING.lg,
  },
  input: {
    height: TOUCH_TARGET.comfortable,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: DarkTheme.border.input,
    backgroundColor: DarkTheme.bg.input,
    color: DarkTheme.text.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    fontSize: 14, // label2 size
  },
  pickerWrapper: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: DarkTheme.border.input,
    backgroundColor: DarkTheme.bg.input,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  picker: {
    height: TOUCH_TARGET.comfortable,
    color: DarkTheme.text.primary,
  },
  submitButton: {
    backgroundColor: DarkTheme.accent.gold,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold' as const,
    fontSize: 16, // h6 size
  },
});

export default VisitorRegistrationScreen;