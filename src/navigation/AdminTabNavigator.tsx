import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import ResidentsScreen from '../screens/ResidentsScreen';
import TowersScreen from '../screens/TowersScreen';
import AmenitiesScreen from '../screens/AmenitiesScreen';
import NoticesScreen from '../screens/NoticesScreen';
import PollsScreen from '../screens/PollsScreen';
import ComplaintsScreen from '../screens/ComplaintsScreen';
import StaffScreen from '../screens/StaffScreen';

import { DarkTheme } from '../utils/theme';

const Tab = createBottomTabNavigator();

export const AdminTabNavigator = () => {
  return (
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
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' }, // Smaller font for more tabs
        headerStyle: {
          backgroundColor: DarkTheme.bg.card,
          borderBottomWidth: 1,
          borderBottomColor: DarkTheme.border.subtle,
        },
        headerTintColor: DarkTheme.text.primary,
      })}
    >
      {/* Admin Dashboard */}
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Residents"
        component={ResidentsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" color={color} size={size} />
          ),
        }}
      />

      {/* Building Management */}
      <Tab.Screen
        name="Towers"
        component={TowersScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="build-outline" color={color} size={size} />
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
        name="Polls"
        component={PollsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Complaints"
        component={ComplaintsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses-outline" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Staff"
        component={StaffScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};