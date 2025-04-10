import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Colors - Updated with 2025 design
const colors = {
  // Main colors from design reference
  primary: '#1C1C3C', // Dark navy background
  secondary: '#FFFFFF', // White
  accent: '#F9B233', // Modern yellow-orange accent
  error: '#FF4D4F', // Modern error red
  warning: '#FAAD14', // Modern warning amber
  info: '#1890FF', // Modern info blue
  success: '#52C41A', // Modern success green
  background: '#1C1C3C', // Dark navy background
  surface: '#2A2A4F', // Secondary dark for cards
  text: {
    primary: '#FFFFFF', // White for primary text
    secondary: '#CCCCCC', // Light gray for secondary text
    disabled: '#8E8E9F', // Medium gray for disabled text
    hint: '#A0A0B8', // Light gray for placeholder/hint text
  },
  divider: '#3A3A5C', // Darker blue for dividers
  // Status colors
  status: {
    available: '#CCCCCC', // Light gray for available slots (as per design guidelines)
    occupied: '#FF4D4F', // Modern error red for occupied slots
    reserved: '#F9B233', // Accent color for reserved slots (as per design)
    outOfService: '#8E8E9F', // Gray for unavailable slots
  },
  // Light mode colors
  light: {
    primary: '#1C1C3C',
    secondary: '#FFFFFF',
    accent: '#F9B233',
    background: '#FFFFFF',
    surface: '#F5F7FA',
    text: {
      primary: '#1C1C3C',
      secondary: '#5E5E7A',
      disabled: '#8E8E9F',
      hint: '#8E8E9F',
    },
    divider: '#EAEAEA',
  }
};

// Typography - Updated with modern font sizes and line heights
const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 36,
    '4xl': 42,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    md: 28,
    lg: 30,
    xl: 34,
    '2xl': 38,
    '3xl': 46,
    '4xl': 54,
  },
  fontWeight: {
    thin: '100',
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  }
};

// Spacing - Updated with more granular sizes
const spacing = {
  '0': 0,
  '0.5': 2,
  '1': 4,
  '2': 8,
  '3': 12,
  '4': 16,
  '5': 20,
  '6': 24,
  '8': 32,
  '10': 40,
  '12': 48,
  '16': 64,
  '20': 80,
  '24': 96,
  // Legacy support
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Borders - Updated with modern rounded corners
const borders = {
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
    // Legacy support
    xs: 2,
    circle: 9999,
  },
  width: {
    thin: 1,
    normal: 2,
    thick: 3,
  },
};

// Shadows - Updated with modern elevation effects
const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.0,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 5.0,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12.0,
    elevation: 16,
  },
  // Legacy support
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 4,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Responsive sizing helper
const size = {
  width,
  height,
  isSmallDevice: width < 375,
};

// Export the theme
const theme = {
  colors,
  typography,
  spacing,
  borders,
  shadows,
  size,
};

export default theme; 