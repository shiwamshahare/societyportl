import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { AuthoriseModal } from '../components/ui/AuthoriseModal';
import { AuthContext } from '../context/AuthContext';

// Screens
import AlertsScreen from '../screens/AlertsScreen';
import AmenitiesScreen from '../screens/AmenitiesScreen';
import DigitalIdScreen from '../screens/DigitalIdScreen';
import ComplaintsScreen from '../screens/ComplaintsScreen';
import HomeScreen from '../screens/HomeScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import NoticesScreen from '../screens/NoticesScreen';
import PollsScreen from '../screens/PollsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProjectScreen from '../screens/ProjectScreen';
import ShortcutsScreen from '../screens/ShortcutsScreen';
import SocietyScreen from '../screens/SocietyScreen';
import VisitorRegistrationScreen from '../screens/VisitorRegistrationScreen';
import VisitorsScreen from '../screens/VisitorsScreen';

import SelectRoleScreen from '@/screens/SelectRoleScreen';
import SelectTypeScreen from '@/screens/SelectTypeScreen';
import CorporateDetailsScreen from '../screens/CorporateDetailsScreen';
import OwnerDocumentsScreen from '../screens/OwnerDocumentsScreen';
import OwnerIdProofScreen from '../screens/OwnerIdProofScreen';
import SelectCityScreen from '../screens/SelectCityScreen';
import SelectCompanyScreen from '../screens/SelectCompanyScreen';
import SelectFlatScreen from '../screens/SelectFlatScreen';
import SelectSocietyScreen from '../screens/SelectSocietyScreen';
import SelectWingScreen from '../screens/SelectWingScreen';
import SocietyDetailsScreen from '../screens/SocietyDetailsScreen';
import TenantNocScreen from '../screens/TenantNocScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const { width } = Dimensions.get('window');

// Custom Curved Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  // SVG Path for the curved center dip in the tab bar
  const svgPath = `M 0,20 
                   L ${width / 2 - 45},20 
                   C ${width / 2 - 25},20 ${width / 2 - 30},55 ${width / 2},55 
                   C ${width / 2 + 30},55 ${width / 2 + 25},20 ${width / 2 + 45},20 
                   L ${width},20 
                   L ${width},75 
                   L 0,75 
                   Z`;

  const borderPath = `M 0,20 
                      L ${width / 2 - 45},20 
                      C ${width / 2 - 25},20 ${width / 2 - 30},55 ${width / 2},55 
                      C ${width / 2 + 30},55 ${width / 2 + 25},20 ${width / 2 + 45},20 
                      L ${width},20`;

  return (
    <View style={styles.tabBarContainer}>
      {/* Curved SVG Backdrop */}
      <View style={styles.svgContainer}>
        <Svg width={width} height={75}>
          <Path d={svgPath} fill="#0C0C0E" />
          <Path d={borderPath} fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth={1} />
        </Svg>
      </View>

      {/* Normal Tab buttons row */}
      <View style={styles.buttonsContainer}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          // Color palette matching the screenshots & design guidelines
          const activeColors = ['#A78BFA', '#22D3EE', '#F59E0B', '#60A5FA', '#E2E8F0'];
          const activeColor = activeColors[index];
          const tintColor = isFocused ? activeColor : '#6B7280';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          const getIcon = (name: string, color: string, focused: boolean) => {
            switch (name) {
              case 'Home':
                return <Ionicons name={focused ? 'home' : 'home-outline'} size={20} color={color} />;
              case 'Society':
                return <Ionicons name="git-network-outline" size={20} color={color} />;
              case 'Marketplace':
                // Render an empty spacer for index 2, the center button overlaps this space
                return <View style={{ height: 20 }} />;
              case 'Project':
                return <Ionicons name={focused ? 'logo-react' : 'planet-outline'} size={20} color={color} />;
              case 'Shortcuts':
                return <Ionicons name={focused ? 'menu' : 'menu-outline'} size={20} color={color} />;
              default:
                return <Ionicons name="help-outline" size={20} color={color} />;
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              {getIcon(route.name, tintColor, isFocused)}
              <Text style={[styles.tabLabel, { color: tintColor, marginTop: route.name === 'Marketplace' ? 24 : 4 }]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Floating Center Button for Marketplace */}
      {(() => {
        const marketplaceRoute = state.routes[2];
        const isFocused = state.index === 2;
        const tintColor = isFocused ? '#F59E0B' : '#9CA3AF';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: marketplaceRoute.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({ name: marketplaceRoute.name, merge: true });
          }
        };

        return (
          <TouchableOpacity
            onPress={onPress}
            style={[
              styles.floatingButton,
              isFocused && styles.floatingButtonActive
            ]}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../assets/images/tabIcons/explore.png')}
              style={[styles.floatingIcon, { tintColor: tintColor }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        );
      })()}
    </View>
  );
};

// Tabs Navigator
const ResidentTabs = () => {
  const { user } = useContext(AuthContext);
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      initialRouteName={user && user.isApproved === false ? "Society" : "Amenities"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Society" component={SocietyScreen} />
      <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
      <Tab.Screen name="Project" component={ProjectScreen} />
      <Tab.Screen name="Shortcuts" component={ShortcutsScreen} />
    </Tab.Navigator>
  );
};

// Root Stack for Resident (contains Tabs and details screens)
export const ResidentTabNavigator = () => {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ResidentTabs" component={ResidentTabs} />
        <Stack.Screen name="Visitors" component={VisitorsScreen} />
        <Stack.Screen name="Amenities" component={AmenitiesScreen} />
        <Stack.Screen name="DigitalId" component={DigitalIdScreen} />
        <Stack.Screen name="Notices" component={NoticesScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Complaints" component={ComplaintsScreen} />
        <Stack.Screen name="Polls" component={PollsScreen} />
        <Stack.Screen name="Alerts" component={AlertsScreen} />
        <Stack.Screen name="VisitorRegistration" component={VisitorRegistrationScreen} />
        <Stack.Screen name="SelectType" component={SelectTypeScreen} />
        <Stack.Screen name="SelectRole" component={SelectRoleScreen} />
        <Stack.Screen name="SelectCity" component={SelectCityScreen} />
        <Stack.Screen name="SelectSociety" component={SelectSocietyScreen} />
        <Stack.Screen name="SelectWing" component={SelectWingScreen} />
        <Stack.Screen name="SelectFlat" component={SelectFlatScreen} />
        <Stack.Screen name="SelectCompany" component={SelectCompanyScreen} />
        <Stack.Screen name="CorporateDetails" component={CorporateDetailsScreen} />
        <Stack.Screen name="SocietyDetails" component={SocietyDetailsScreen} />
        <Stack.Screen name="OwnerIdProof" component={OwnerIdProofScreen} />
        <Stack.Screen name="OwnerDocuments" component={OwnerDocumentsScreen} />
        <Stack.Screen name="TenantNoc" component={TenantNocScreen} />
      </Stack.Navigator>
      <AuthoriseModal />
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: 'transparent',
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 75,
  },
  buttonsContainer: {
    flexDirection: 'row',
    height: 75,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingTop: 18,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    top: -12,
    left: width / 2 - 27,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#0F0F11',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  floatingButtonActive: {
    borderColor: '#D97706',
    backgroundColor: '#1E1B16',
  },
  floatingIcon: {
    width: 26,
    height: 26,
  },
});