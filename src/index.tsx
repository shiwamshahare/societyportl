import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, NavigationContainerRef, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import { VisitorProvider } from './context/VisitorContext';
import { DarkTheme } from './utils/theme';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';

type RootParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Visitors: undefined;
  Amenities: undefined;
  Notices: undefined;
  Profile: undefined;
};

const navTheme = {
  ...NavDarkTheme,
  colors: {
    ...NavDarkTheme.colors,
    primary: DarkTheme.accent.gold,
    background: DarkTheme.bg.primary,
    card: DarkTheme.bg.card,
    text: DarkTheme.text.primary,
    border: DarkTheme.border.subtle,
    notification: DarkTheme.status.error,
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AlertProvider>
        <VisitorProvider>
          <>
            <StatusBar barStyle="light-content" backgroundColor="#0B0F17" />
            <NavigationContainer ref={navigationRef} theme={navTheme}>
              <RootNavigator />
            </NavigationContainer>
          </>
        </VisitorProvider>
      </AlertProvider>
    </AuthProvider>
  );
}

// Reference to navigation reference for imperative navigation actions
export const navigationRef = React.createRef<NavigationContainerRef<RootParamList>>();