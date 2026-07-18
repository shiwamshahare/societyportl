import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { DarkTheme } from '../utils/theme';
import { SPACING, BORDER_RADIUS } from '../constants/layout';
import { CustomDatePicker } from '../components/ui/DatePicker';
import { FloatingLabelInput } from '../components/ui/FloatingLabelInput';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Visitors: undefined;
  Amenities: undefined;
  Notices: undefined;
  Profile: undefined;
};

type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;

const SignupScreen = ({ navigation, route }: { navigation: SignupScreenNavigationProp; route: any }) => {
  const { colors } = useTheme();
  const { signUp } = useContext(AuthContext);
  
  const { city, type, userRole, phone, email } = route.params || {};

  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailId, setEmailId] = useState(email || '');
  const [mobileNumber, setMobileNumber] = useState(phone || '');
  const [dob, setDob] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Sync route params when navigated with prefilled details
  React.useEffect(() => {
    if (phone) setMobileNumber(phone);
    if (email) setEmailId(email);
  }, [phone, email]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    setError(null);
    setLoading(true);

    // Simple validation
    if (!firstName.trim() || !lastName.trim() || !emailId.trim() || !mobileNumber.trim()) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const registerResult = await signUp({
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: emailId.trim(),
        password: 'user123', // auto generated password for simplified direct flow
        phone: mobileNumber.trim(),
        role: (userRole || 'resident') as 'resident' | 'guard' | 'admin',
        flatNumber: '101A',
        tower: 'Tower A',
      });

      if (!registerResult.success) {
        setError(registerResult.error || 'Registration failed');
      } else {
        Alert.alert('Success', 'Account created successfully! Welcome to Society Portl.');
      }
    } catch {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (selectedDate: Date) => {
    setDob(selectedDate);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header Back Button */}
        <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            style={{ width: 40, height: 40, justifyContent: 'center' }}
          >
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        >
          {/* Onboarding summary context if arriving from onboarding */}
          {(city || type || userRole) && (
            <View style={{
              backgroundColor: 'rgba(217, 119, 6, 0.1)',
              borderWidth: 1,
              borderColor: 'rgba(217, 119, 6, 0.3)',
              borderRadius: BORDER_RADIUS.md,
              padding: SPACING.sm,
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: SPACING.xs
            }}>
              <Ionicons name="information-circle-outline" size={18} color={DarkTheme.accent.gold} />
              <Text style={{ color: DarkTheme.text.secondary, fontSize: 12 }}>
                Onboarding: <Text style={{ color: '#fff', fontWeight: 'bold' }}>{city ? city.charAt(0).toUpperCase() + city.slice(1) : ''}</Text> • <Text style={{ color: '#fff', fontWeight: 'bold' }}>{type ? type.charAt(0).toUpperCase() + type.slice(1) : ''}</Text> • <Text style={{ color: '#fff', fontWeight: 'bold' }}>{userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : ''}</Text>
              </Text>
            </View>
          )}

          <Text style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>
            Sign up
          </Text>

          {/* Gender Selector */}
          <View style={{ flexDirection: 'row', gap: 16, marginBottom: 20 }}>
            <TouchableOpacity
              style={[
                styles.genderCard,
                gender === 'male' && styles.genderCardActive
              ]}
              onPress={() => setGender('male')}
              activeOpacity={0.8}
            >
              <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderCard,
                gender === 'female' && styles.genderCardActive
              ]}
              onPress={() => setGender('female')}
              activeOpacity={0.8}
            >
              <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>
                Female
              </Text>
            </TouchableOpacity>
          </View>

          {/* First Name Input */}
          <FloatingLabelInput
            label="First name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />

          {/* Last Name Input */}
          <FloatingLabelInput
            label="Last name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />

          {/* Email ID Input */}
          <FloatingLabelInput
            label="Email Id"
            value={emailId}
            onChangeText={setEmailId}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          {/* Mobile Number Floating Input */}
          <FloatingLabelInput
            label="Mobile Number"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
            style={styles.input}
          />

          {/* Date Of Birth Picker */}
          <TouchableOpacity
            style={[styles.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.8}
          >
            <Text style={{ color: dob ? '#FFFFFF' : 'rgba(255, 255, 255, 0.35)', fontSize: 16 }}>
              {dob ? dob.toLocaleDateString() : 'Date Of Birth'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="rgba(255, 255, 255, 0.5)" />
          </TouchableOpacity>

          <CustomDatePicker
            value={dob || new Date('1995-01-01')}
            onChange={handleDateChange}
            visible={showDatePicker}
            onClose={() => setShowDatePicker(false)}
            maximumDate={new Date()}
          />

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSignup}
            disabled={loading}
            style={styles.submitBtn}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <Text style={styles.submitBtnText}>Sign up</Text>
            )}
          </TouchableOpacity>

          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 14 }}>
              Already have an account?
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Login')}
              style={{ marginTop: 8 }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  genderCard: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  genderCardActive: {
    borderColor: '#0ea5e9',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
  },
  genderText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 16,
  },
  genderTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    marginBottom: 20,
  },
  floatingLabelContainer: {
    position: 'absolute',
    top: -9,
    left: 16,
    backgroundColor: '#000000',
    paddingHorizontal: 6,
    zIndex: 1,
  },
  floatingLabelText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
  },
  errorContainer: {
    marginBottom: 20,
    padding: SPACING.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: BORDER_RADIUS.sm,
    borderLeftWidth: 4,
    borderLeftColor: DarkTheme.status.error,
  },
  errorText: {
    color: DarkTheme.status.error,
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: '#FFFFFF',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitBtnText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SignupScreen;