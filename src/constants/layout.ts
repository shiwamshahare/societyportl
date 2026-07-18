// Layout Constants for Portl App
// Following UI/UX Pro Max 4/8dp spacing system and mobile-first principles

import { Platform } from 'react-native';

// Spacing Scale (4/8dp incremental system)
export const SPACING = {
  xs: 4,   // Extra small
  sm: 8,   // Small
  md: 12,  // Medium
  lg: 16,  // Large
  xl: 20,  // Extra large
  xxl: 24, // Double extra large
  xxxl: 32, // Triple extra large
};

// Touch Target Sizes (minimum 44pt for iOS, 48dp for Android)
export const TOUCH_TARGET = {
  minimum: Platform.select({ ios: 44, android: 48 }),
  comfortable: Platform.select({ ios: 48, android: 56 }),
  large: Platform.select({ ios: 56, android: 64 }),
};

// Border Radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  pill: 9999,
};

// Elevation/Shadow (for Android) and Shadow (for iOS)
export const SHADOW = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  firm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
};

// Safe Area Insets Helper
export const getSafeAreaInsets = () => {
  // This would typically come from react-native-safe-area-context
  // For now, returning defaults - should be replaced with actual implementation
  return {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };
};

// Layout Configuration
export const LAYOUT = {
  // Container padding
  containerPadding: SPACING.lg,
  // Screen horizontal padding
  screenPaddingHorizontal: SPACING.md,
  // Screen vertical padding
  screenPaddingVertical: SPACING.sm,
  // Card padding
  cardPadding: SPACING.md,
  // Item spacing
  itemSpacing: SPACING.sm,
  // Section spacing
  sectionSpacing: SPACING.lg,
  // Header height
  headerHeight: TOUCH_TARGET.comfortable,
  // Footer height
  footerHeight: TOUCH_TARGET.comfortable,
};

// Typography Scale (following system type roles)
export const TYPOGRAPHY = {
  // Display
  h1: { fontSize: 32, fontWeight: '700' as const },
  h2: { fontSize: 28, fontWeight: '600' as const },
  h3: { fontSize: 24, fontWeight: '600' as const },
  // Headline
  h4: { fontSize: 20, fontWeight: '600' as const },
  h5: { fontSize: 18, fontWeight: '600' as const },
  h6: { fontSize: 16, fontWeight: '500' as const },
  // Title
  title: { fontSize: 16, fontWeight: '500' as const },
  // Body
  body1: { fontSize: 16, fontWeight: '400' as const },
  body2: { fontSize: 14, fontWeight: '400' as const },
  body3: { fontSize: 12, fontWeight: '400' as const },
  // Label
  label1: { fontSize: 14, fontWeight: '500' as const },
  label2: { fontSize: 12, fontWeight: '500' as const },
  // Caption
  caption: { fontSize: 12, fontWeight: '400' as const },
};

// Color Tokens (semantic)
export const COLOR_TOKENS = {
  // Primary
  primary: '#2563EB',
  primaryForeground: '#FFFFFF',
  // Secondary
  secondary: '#3B82F6',
  // Accent
  accent: '#059669',
  // Background
  background: '#F8FAFC',
  // Surface/Card
  card: '#FFFFFF',
  // Muted
  muted: '#F1F5FD',
  // Border
  border: '#E4ECFC',
  // Text
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  // Ring (for focus states)
  ring: '#2563EB',
};