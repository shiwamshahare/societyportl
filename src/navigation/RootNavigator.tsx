import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Platform } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Import role-based tab navigators
import { ResidentTabNavigator } from './ResidentTabNavigator';
import { GuardTabNavigator } from './GuardTabNavigator';
import { AdminTabNavigator } from './AdminTabNavigator';

import LoginScreen from '@/screens/auth/LoginScreen';
import SignupScreen from '@/screens/auth/SignupScreen';
import OnboardingIntroScreen from '@/screens/onboarding/OnboardingIntroScreen';
import SelectCityScreen from '@/screens/onboarding/SelectCityScreen';
import SelectTypeScreen from '@/screens/onboarding/SelectTypeScreen';
import SelectSocietyScreen from '@/screens/onboarding/SelectSocietyScreen';
import SelectRoleScreen from '@/screens/onboarding/SelectRoleScreen';
import SelectWingScreen from '@/screens/onboarding/SelectWingScreen';
import SelectFlatScreen from '@/screens/onboarding/SelectFlatScreen';
import SelectCompanyScreen from '@/screens/onboarding/SelectCompanyScreen';
import CorporateDetailsScreen from '@/screens/onboarding/CorporateDetailsScreen';
import SocietyDetailsScreen from '@/screens/onboarding/SocietyDetailsScreen';
import OwnerIdProofScreen from '@/screens/onboarding/OwnerIdProofScreen';
import OwnerDocumentsScreen from '@/screens/onboarding/OwnerDocumentsScreen';
import TenantNocScreen from '@/screens/onboarding/TenantNocScreen';

// Stack Navigator for Auth
const Stack = createNativeStackNavigator();
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
      <Stack.Screen name="OnboardingIntro" component={OnboardingIntroScreen} />
      <Stack.Screen name="SelectCity" component={SelectCityScreen} />
      <Stack.Screen name="SelectType" component={SelectTypeScreen} />
      <Stack.Screen name="SelectSociety" component={SelectSocietyScreen} />
      <Stack.Screen name="SelectRole" component={SelectRoleScreen} />
      <Stack.Screen name="SelectWing" component={SelectWingScreen} />
      <Stack.Screen name="SelectFlat" component={SelectFlatScreen} />
      <Stack.Screen name="SelectCompany" component={SelectCompanyScreen} />
      <Stack.Screen name="CorporateDetails" component={CorporateDetailsScreen} />
      <Stack.Screen name="SocietyDetails" component={SocietyDetailsScreen} />
      <Stack.Screen name="OwnerIdProof" component={OwnerIdProofScreen} />
      <Stack.Screen name="OwnerDocuments" component={OwnerDocumentsScreen} />
      <Stack.Screen name="TenantNoc" component={TenantNocScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

// Root Navigator - handles auth state and role-based routing
const RootNavigator = () => {
  const { isSignedIn, user } = useContext(AuthContext);

  // If not signed in, show auth stack
  if (!isSignedIn) {
    return <AuthStack />;
  }

  // If signed in, show appropriate tab navigator based on role
  switch (user?.role) {
    case 'resident':
      return <ResidentTabNavigator />;
    case 'guard':
      return <GuardTabNavigator />;
    case 'admin':
      return <AdminTabNavigator />;
    default:
      // Default to resident if role is not recognized
      return <ResidentTabNavigator />;
  }
};

export default RootNavigator;