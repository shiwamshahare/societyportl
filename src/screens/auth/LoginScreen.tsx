import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons } from '@expo/vector-icons';
import { BORDER_RADIUS, SPACING } from '@/constants/layout';
import { AuthContext } from '@/context/AuthContext';
import { DarkTheme } from '@/utils/theme';
import { FloatingLabelInput } from '@/components/ui/FloatingLabelInput';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const { signIn, signInDirect, users } = useContext(AuthContext);

  // Login Steps:
  // 0 = Landing Welcome (Image 1)
  // 1 = Enter Mobile Number (Image 2)
  // 2 = Enter Corporate Email (Image 3)
  // 3 = Enter Password (Password step after email)
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

  // Mobile inputs
  const [phone, setPhone] = useState('');

  // Email/Password inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const phoneInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  // Focus input automatically when entering steps
  useEffect(() => {
    if (step === 1) {
      setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 100);
    } else if (step === 2) {
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
    } else if (step === 3) {
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
    }
  }, [step]);

  const handlePhoneSubmit = async () => {
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError(null);
    setLoading(true);

    // Normalize phone input to digits only
    const normalizedInput = phone.replace(/[^0-9]/g, '');

    // Lookup user by phone number
    const matchedUser = users.find(u => {
      if (!u.phone) return false;
      const normalizedUserPhone = u.phone.replace(/[^0-9]/g, '');
      return normalizedUserPhone.endsWith(normalizedInput) || normalizedInput.endsWith(normalizedUserPhone);
    });

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (matchedUser) {
        signInDirect(matchedUser);
        Alert.alert('Success', `Welcome back, ${matchedUser.name}!`);
      } else {
        Alert.alert('Info', 'Mobile number not found in records. Redirecting to Sign Up.');
        navigation.navigate('Signup', { phone: phone });
      }
    } catch {
      setError('An error occurred during mobile sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid corporate email address');
      return;
    }
    setError(null);
    setLoading(true);

    const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (matchedUser) {
        setStep(3); // User exists, ask for password
      } else {
        Alert.alert('Info', 'Email not found in records. Redirecting to Sign Up.');
        navigation.navigate('Signup', { email: email });
      }
    } catch {
      setError('An error occurred checking email');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    if (!password) {
      setError('Please enter your password');
      return;
    }
    setError(null);
    setLoading(true);

    // Automatically detect role based on email to simplify user experience
    let detectedRole: 'resident' | 'guard' | 'admin' = 'resident';
    if (email.includes('guard')) {
      detectedRole = 'guard';
    } else if (email.includes('admin')) {
      detectedRole = 'admin';
    }

    try {
      const result = await signIn({ email, password, role: detectedRole });
      if (!result.success) {
        setError(result.error || 'Login failed. Please check credentials.');
      } else {
        Alert.alert('Success', 'Login successful!');
      }
    } catch {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  // Developer Quick Login Helper
  const handleQuickLogin = async (selectedRole: 'resident' | 'guard') => {
    setError(null);
    setLoading(true);
    const emailToUse = selectedRole === 'resident' ? 'resident@example.com' : 'guard@example.com';
    const passwordToUse = selectedRole === 'resident' ? 'resident123' : 'guard123';

    setEmail(emailToUse);
    setPassword(passwordToUse);

    try {
      const result = await signIn({ email: emailToUse, password: passwordToUse, role: selectedRole });
      if (!result.success) {
        setError(result.error || 'Login failed');
      } else {
        Alert.alert('Success', 'Login successful!');
      }
    } catch {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  // Render Step 0: Welcome Landing Screen
  if (step === 0) {
    return (
      <View style={styles.container}>
        {/* Upper Background Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../assets/images/login_bg.png')}
            style={styles.bgImage}
            resizeMode="cover"
          />
          {/* Smooth linear gradient overlay to blend image into the dark content theme */}
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.45)', 'rgba(0, 0, 0, 0.85)', '#000000']}
            locations={[0, 0.45, 0.8, 1]}
            style={styles.gradientOverlay}
          />
        </View>

        {/* Bottom Content Area */}
        <SafeAreaView style={styles.landingContent} edges={['bottom']}>
          <View style={styles.textContainer}>
            <Text style={styles.landingTitle}>Welcome to Society Portl</Text>
            <Text style={styles.landingSubtitle}>Your Premium Society Digital Portal</Text>
          </View>

          {/* Dummy Mobile Input fields to trigger Step 1 */}
          <TouchableOpacity
            style={styles.dummyInputContainer}
            onPress={() => setStep(1)}
            activeOpacity={0.9}
          >
            <Text style={styles.countryCodeText}>+91</Text>
            <View style={styles.separatorLine} />
            <Text style={styles.placeholderText}>Mobile number</Text>
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Corporate Email Button */}
          <TouchableOpacity
            onPress={() => setStep(2)}
            activeOpacity={0.7}
            style={styles.corporateLinkButton}
          >
            <Text style={styles.corporateLinkText}>Continue with Corporate Email</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  // Render Step 1: Mobile Entry Screen
  if (step === 1) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['rgba(56, 189, 248, 0.08)', 'rgba(0, 0, 0, 0)']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 220 }}
        />
        {/* Header */}
        <View style={styles.stepHeader}>
          <TouchableOpacity
            onPress={() => setStep(0)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.helpText}>Help</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flexOne}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Enter your Mobile Number</Text>

              {/* Real Phone Input */}
              <FloatingLabelInput
                ref={phoneInputRef}
                label="Mobile number"
                leftComponent={
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.phoneDropdown} activeOpacity={0.7}>
                      <Text style={styles.countryCodeText}>+91 ▾</Text>
                    </TouchableOpacity>
                    <View style={[styles.separatorLine, { marginRight: 0 }]} />
                  </View>
                }
                style={styles.inputBorderContainer}
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={(text) => {
                  setPhone(text.replace(/[^0-9]/g, ''));
                  if (error) setError(null);
                }}
              />

              {error && (
                <View style={styles.innerErrorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Policy agreement */}
              <Text style={styles.policyText}>
                By continuing, you agree to our{' '}
                <Text style={styles.underlinedText}>Terms of Use</Text> and{' '}
                <Text style={styles.underlinedText}>Privacy Policy</Text>
              </Text>

              {/* Submit / Continue Button */}
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  phone.length < 10 && styles.disabledButton
                ]}
                onPress={handlePhoneSubmit}
                disabled={phone.length < 10 || loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#000000" />
                ) : (
                  <Text style={styles.continueButtonText}>Continue</Text>
                )}
              </TouchableOpacity>

              {/* OR Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Corporate Email Button */}
              <TouchableOpacity
                onPress={() => setStep(2)}
                activeOpacity={0.7}
                style={styles.corporateLinkButton}
              >
                <Text style={styles.corporateLinkText}>Continue with Corporate Email</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Render Step 2: Enter Corporate Email (Image 3)
  if (step === 2) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['rgba(56, 189, 248, 0.08)', 'rgba(0, 0, 0, 0)']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 220 }}
        />
        {/* Header */}
        <View style={styles.stepHeader}>
          <TouchableOpacity
            onPress={() => setStep(0)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.helpText}>Help</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flexOne}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Enter your Corporate Email</Text>

              {/* Real Email Input */}
              <FloatingLabelInput
                ref={emailInputRef}
                label="Email Id"
                style={styles.inputBorderContainer}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError(null);
                }}
              />

              {error && (
                <View style={styles.innerErrorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Policy agreement */}
              <Text style={styles.policyText}>
                By continuing, you agree to our{' '}
                <Text style={styles.underlinedText}>Terms of Use</Text> and{' '}
                <Text style={styles.underlinedText}>Privacy Policy</Text>
              </Text>

              {/* Submit / Continue Button */}
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  !email && styles.disabledButton
                ]}
                onPress={handleEmailSubmit}
                disabled={!email}
                activeOpacity={0.8}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>

              {/* OR Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Mobile Number Button */}
              <TouchableOpacity
                onPress={() => setStep(1)}
                activeOpacity={0.7}
                style={styles.corporateLinkButton}
              >
                <Text style={styles.corporateLinkText}>Continue with Mobile Number</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Render Step 3: Enter Password Screen (Post-email entry)
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['rgba(56, 189, 248, 0.08)', 'rgba(0, 0, 0, 0)']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 220 }}
      />
      {/* Header */}
      <View style={styles.stepHeader}>
        <TouchableOpacity
          onPress={() => setStep(2)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitleText}>Enter Password</Text>
        <View style={styles.widthPlaceholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flexOne}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Enter password for</Text>
            <Text style={styles.emailDisplayLabel}>{email}</Text>

            {/* Password input */}
            <FloatingLabelInput
              ref={passwordInputRef}
              label="Password"
              style={styles.inputBorderContainer}
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError(null);
              }}
            />

            {error && (
              <View style={styles.innerErrorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Quick dev-helper logins */}
            <View style={styles.quickLoginContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleQuickLogin('resident')}
                disabled={loading}
                style={[styles.quickLoginButton, styles.quickLoginResident]}
              >
                <Text style={styles.quickLoginText}>⚡ Resident Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleQuickLogin('guard')}
                disabled={loading}
                style={[styles.quickLoginButton, styles.quickLoginGuard]}
              >
                <Text style={styles.quickLoginText}>⚡ Guard Login</Text>
              </TouchableOpacity>
            </View>

            {/* Sign in Button */}
            <TouchableOpacity
              style={[
                styles.continueButton,
                !password && styles.disabledButton
              ]}
              onPress={handlePasswordLogin}
              disabled={!password || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#000000" />
              ) : (
                <Text style={styles.continueButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signUpRow}>
              <Text style={styles.signUpText}>{"Don't have an account?"}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')} activeOpacity={0.7}>
                <Text style={styles.signUpLinkText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.bg.primary,
  },
  flexOne: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  // Step 0: Landing
  imageContainer: {
    height: SCREEN_HEIGHT * 0.52,
    width: '100%',
    position: 'relative',
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  landingContent: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'center',
    gap: SPACING.lg,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  landingTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
  },
  landingSubtitle: {
    fontSize: 14,
    color: DarkTheme.text.secondary,
    textAlign: 'center',
  },
  dummyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: SPACING.lg,
  },
  countryCodeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  separatorLine: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: SPACING.md,
  },
  placeholderText: {
    color: DarkTheme.text.tertiary,
    fontSize: 16,
  },
  // Dividers
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    color: DarkTheme.text.tertiary,
    paddingHorizontal: SPACING.md,
    fontSize: 12,
    fontWeight: '600',
  },
  corporateLinkButton: {
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  corporateLinkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  // Step 1 & 2 & 3: Mobile & Email & Password Entry
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  widthPlaceholder: {
    width: 28,
  },
  helpText: {
    color: '#FFFFFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  stepContent: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    gap: SPACING.lg,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
  },
  emailDisplayLabel: {
    fontSize: 16,
    color: DarkTheme.accent.goldLight,
    fontWeight: '600',
    marginTop: -SPACING.md,
    marginBottom: SPACING.xs,
  },
  inputBorderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingHorizontal: SPACING.lg,
  },
  phoneDropdown: {
    paddingVertical: SPACING.xs,
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    color: '#FFFFFF',
    fontSize: 16,
  },
  policyText: {
    color: DarkTheme.text.secondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginVertical: SPACING.sm,
  },
  underlinedText: {
    textDecorationLine: 'underline',
    color: '#FFFFFF',
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  continueButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  innerErrorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderLeftWidth: 4,
    borderColor: DarkTheme.status.error,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    marginVertical: SPACING.xs,
  },
  errorText: {
    color: DarkTheme.status.error,
    fontSize: 13,
  },
  quickLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  quickLoginButton: {
    flex: 1,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLoginResident: {
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    borderWidth: 1,
    borderColor: '#7C3AED',
  },
  quickLoginGuard: {
    backgroundColor: 'rgba(13, 148, 136, 0.1)',
    borderWidth: 1,
    borderColor: '#0D9488',
  },
  quickLoginText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
    gap: SPACING.xs,
  },
  signUpText: {
    color: DarkTheme.text.secondary,
    fontSize: 14,
  },
  signUpLinkText: {
    color: DarkTheme.accent.goldLight,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default LoginScreen;