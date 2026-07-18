// Design Tokens - Dark Theme with Pure Black aesthetics matching Login and Signup screens
export const DarkTheme = {
  // Backgrounds
  bg: {
    primary: '#000000', // Pure black screen/app background
    card: '#0C0C0E',    // Dark card surfaces, list items
    elevated: '#121214', // Modals, drawers, tab bar
    input: 'rgba(255, 255, 255, 0.02)', // Input fields background
  },

  // Borders
  border: {
    subtle: 'rgba(255, 255, 255, 0.08)', // Card borders
    input: 'rgba(255, 255, 255, 0.15)',  // Input borders
  },

  // Accent Colors
  accent: {
    gold: '#D97706',      // Primary accent (selected dates, active states, highlights)
    goldLight: '#F59E0B', // Secondary gold (prices, codes, badges)
    teal: '#0D9488',      // Guard-specific accent (buttons, scan)
  },

  // Text Colors
  text: {
    primary: '#FFFFFF', // Headings, names
    secondary: '#9CA3AF', // Labels, descriptions
    tertiary: '#6B7280', // Disabled, timestamps
  },

  // Status Colors
  status: {
    success: '#10B981', // Approved, active
    error: '#EF4444',   // Rejected, high priority
    warning: '#F59E0B', // Pending
    info: '#3B82F6',    // Info badges
  },

  // Typography
  fontFamily: 'Inter',
  fontSize: 16,
};

// Style Fragments for Reuse
export const cardStyle = {
  backgroundColor: DarkTheme.bg.card,
  borderWidth: 1,
  borderColor: DarkTheme.border.subtle,
  borderRadius: 12,
  padding: 16,
  fontFamily: DarkTheme.fontFamily,
};

export const inputStyle = {
  backgroundColor: DarkTheme.bg.input,
  borderWidth: 1,
  borderColor: DarkTheme.border.input,
  borderRadius: 12,
  padding: 12,
  color: DarkTheme.text.primary,
  fontSize: DarkTheme.fontSize,
  fontFamily: DarkTheme.fontFamily,
};

export const headerStyle = {
  backgroundColor: 'transparent',
  borderBottomWidth: 0,
};

export const modalOverlayStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
};

export const badgeStyle = {
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 16,
};

export const sectionTitleStyle = {
  fontSize: 18,
  fontWeight: '600',
  color: DarkTheme.text.primary,
  fontFamily: DarkTheme.fontFamily,
  marginBottom: 12,
};

export const tabBarStyle = {
  backgroundColor: DarkTheme.bg.elevated,
  height: 60,
};

// Export the complete theme for use with libraries if needed
export default DarkTheme;