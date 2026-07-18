import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View } from 'react-native';
import { AuthoriseModal } from '../components/ui/AuthoriseModal';

import HomeScreen from '../screens/HomeScreen';
import VisitorsScreen from '../screens/VisitorsScreen';
import AmenitiesScreen from '../screens/AmenitiesScreen';
import NoticesScreen from '../screens/NoticesScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { DarkTheme } from '../utils/theme';

const Tab = createBottomTabNavigator();

export const ResidentTabNavigator = () => {
  return (
    <View style={{ flex: 1 }}>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: DarkTheme.accent.gold,
        tabBarInactiveTintColor: DarkTheme.text.tertiary,
        tabBarStyle: {
          backgroundColor: DarkTheme.bg.card,
          height: 60,
          borderTopColor: DarkTheme.border.subtle,
          ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 0 },
            android: { elevation: 4 },
          }),
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        headerStyle: {
          backgroundColor: DarkTheme.bg.card,
          borderBottomWidth: 1,
          borderBottomColor: DarkTheme.border.subtle,
        },
        headerTintColor: DarkTheme.text.primary,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Visitors"
        component={VisitorsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-add-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Amenities"
        component={AmenitiesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fitness-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notices"
        component={NoticesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
      <AuthoriseModal />
    </View>
  );
};