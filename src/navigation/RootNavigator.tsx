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

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import OnboardingIntroScreen from '../screens/OnboardingIntroScreen';
import SelectCityScreen from '../screens/SelectCityScreen';
import SelectTypeScreen from '../screens/SelectTypeScreen';
import SelectRoleScreen from '../screens/SelectRoleScreen';
import SocietyDetailsScreen from '../screens/SocietyDetailsScreen';

// Stack Navigator for Auth
const Stack = createNativeStackNavigator();
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
      <Stack.Screen name="OnboardingIntro" component={OnboardingIntroScreen} />
      <Stack.Screen name="SelectCity" component={SelectCityScreen} />
      <Stack.Screen name="SelectType" component={SelectTypeScreen} />
      <Stack.Screen name="SelectRole" component={SelectRoleScreen} />
      <Stack.Screen name="SocietyDetails" component={SocietyDetailsScreen} />
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