import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Global scale factor - reduces overall UI size by 10%
const GLOBAL_SCALE = 0.81;

// Function to scale dimensions
const scale = (size: number) => Math.round(size * GLOBAL_SCALE);

// Colors - Updated with 2025 design patterns
const colors = {
  // Main colors from design reference
  primary: '#1A1A38', // Deeper navy background
  secondary: '#FFFFFF', // White
  accent: '#FF9D00', // Vibrant orange accent (updated from yellow-orange)
  error: '#FF4D4F', // Modern error red
  warning: '#FAAD14', // Modern warning amber
  info: '#0091FF', // Brighter info blue
  success: '#00C853', // Brighter success green
  background: '#1A1A38', // Deeper navy background
  surface: '#282852', // Richer secondary dark for cards
  text: {
    primary: '#FFFFFF', // White for primary text
    secondary: '#DADAE8', // Slightly blueish light gray for secondary text
    disabled: '#8E8E9F', // Medium gray for disabled text
    hint: '#A0A0B8', // Light gray for placeholder/hint text
  },
  divider: '#3D3D6B', // Richer blue for dividers
  // Status colors
  status: {
    available: '#00C853', // Bright green for available slots (updated)
    occupied: '#FF4D4F', // Modern error red for occupied slots
    reserved: '#FF9D00', // Updated accent color for reserved slots
    outOfService: '#8E8E9F', // Gray for unavailable slots
  },
  // Light mode colors
  light: {
    primary: '#1A1A38',
    secondary: '#FFFFFF',
    accent: '#FF9D00',
    background: '#F8F8FC', // Slightly blue-tinted white
    surface: '#FFFFFF',
    text: {
      primary: '#1A1A38',
      secondary: '#454570',
      disabled: '#8E8E9F',
      hint: '#8E8E9F',
    },
    divider: '#E8E8F0', // Slightly blue-tinted divider
    error: '#FF4D4F',
  },
  // Dark mode colors
  dark: {
    primary: '#1A1A38',
    secondary: '#FFFFFF',
    accent: '#FF9D00',
    background: '#13132E', // Deeper navy
    surface: '#282852', // Richer secondary dark
    text: {
      primary: '#FFFFFF',
      secondary: '#DADAE8',
      disabled: '#8E8E9F',
      hint: '#A0A0B8',
    },
    divider: '#3D3D6B',
    error: '#FF4D4F',
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
    xs: scale(12),
    sm: scale(14),
    base: scale(16),
    md: scale(18),
    lg: scale(20),
    xl: scale(24),
    '2xl': scale(28),
    '3xl': scale(36),
    '4xl': scale(48),
  },
  lineHeight: {
    xs: scale(16),
    sm: scale(20),
    base: scale(24),
    md: scale(28),
    lg: scale(30),
    xl: scale(34),
    '2xl': scale(38),
    '3xl': scale(46),
    '4xl': scale(58),
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
  '0.5': scale(2),
  '1': scale(4),
  '2': scale(8),
  '3': scale(12),
  '4': scale(16),
  '5': scale(20),
  '6': scale(24),
  '8': scale(32),
  '10': scale(40),
  '12': scale(48),
  '16': scale(64),
  '20': scale(80),
  '24': scale(96),
  // Legacy support
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  xxl: scale(48),
  xxxl: scale(64),
};

// Borders - Updated with modern rounded corners
const borders = {
  radius: {
    none: 0,
    sm: scale(6),
    md: scale(10),
    lg: scale(14),
    xl: scale(20),
    '2xl': scale(28),
    '3xl': scale(36),
    full: 9999,
    // Legacy support
    xs: scale(3),
    circle: 9999,
  },
  width: {
    thin: scale(1),
    normal: scale(2),
    thick: scale(3),
  },
};

// Shadows - Updated with modern elevation effects for 2025 design
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
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.10,
    shadowRadius: scale(3),
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(3) },
    shadowOpacity: 0.12,
    shadowRadius: scale(5),
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(6) },
    shadowOpacity: 0.16,
    shadowRadius: scale(8),
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(10) },
    shadowOpacity: 0.20,
    shadowRadius: scale(16),
    elevation: 16,
  },
  // Legacy support
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.10,
    shadowRadius: scale(3),
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(3) },
    shadowOpacity: 0.12,
    shadowRadius: scale(5),
    elevation: 4,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(8) },
    shadowOpacity: 0.20,
    shadowRadius: scale(12),
    elevation: 10,
  },
};

// Animations - New for 2025 design
const animations = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    // Common easing functions
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1],
  },
  transition: {
    default: {
      duration: 300,
      easing: [0.4, 0, 0.2, 1],
    },
    fast: {
      duration: 200,
      easing: [0.4, 0, 0.2, 1],
    },
    slow: {
      duration: 500,
      easing: [0.4, 0, 0.2, 1],
    },
  },
};

// Responsive sizing helper
const size = {
  width: width * GLOBAL_SCALE,
  height: height * GLOBAL_SCALE,
  isSmallDevice: width < 375,
  isTablet: width >= 768,
};

// Export the theme
const theme = {
  colors,
  typography,
  spacing,
  borders,
  shadows,
  animations,
  size,
  scale, // Export the scale function for use in components
  GLOBAL_SCALE, // Export the global scale factor
};

export default theme; 