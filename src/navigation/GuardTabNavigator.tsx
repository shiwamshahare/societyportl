import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import GuardDashboardScreen from '../screens/GuardDashboardScreen';
import GuardVisitorEntryScreen from '../screens/GuardVisitorEntryScreen';
import StaffScreen from '../screens/StaffScreen';
import EntryExitLogScreen from '../screens/EntryExitLogScreen';

import { DarkTheme } from '../utils/theme';

const Tab = createBottomTabNavigator();

export const GuardTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: DarkTheme.accent.teal,
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
        headerShown: false,
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
        component={GuardDashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Visitors"
        component={GuardVisitorEntryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-add-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Helpers"
        component={StaffScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Vehicle"
        component={EntryExitLogScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};