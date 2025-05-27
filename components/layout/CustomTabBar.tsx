import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TAB_HEIGHT = 50;
const FAB_SIZE = 80;
const CURVE_WIDTH = 120;
const CURVE_DEPTH = 32;
const BAR_RADIUS = 28;

const icons = [
  { name: 'home', label: 'Home' },
  { name: 'analytics', label: 'Monitor' },
  { name: 'car', label: 'Parking' },
  { name: 'planet', label: 'Connected' },
  { name: 'person', label: 'Account' },
];

const routeMap: Record<string, string> = {
  home: 'Home',
  analytics: 'Monitor',
  car: 'Parking',
  planet: 'Connected',
  person: 'Account',
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const { themeMode, colors } = useTheme();
  const isDarkMode = themeMode === 'dark';
  
  const currentColors = isDarkMode ? colors.dark : colors.light;
  
  // Dynamic styles based on theme
  const backgroundFill = isDarkMode ? 'rgba(40, 40, 80, 0.8)' : 'rgba(255, 255, 255, 0.85)';
  const backgroundStroke = isDarkMode ? 'rgba(60, 60, 100, 0.6)' : 'rgba(230, 230, 240, 0.8)';
  const tabIconInactiveColor = isDarkMode ? '#999' : '#777';
  const tabTextInactiveColor = isDarkMode ? '#aaa' : '#777';
  const fabBackground = colors.accent;
  const fabIconColor = '#FFFFFF';
  const fabBorderColor = isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.8)';
  
  // Adjust bottom padding for safe area
  const bottomPadding = Math.max(insets.bottom - 10, 0);
  
  return (
    <View style={[styles.container, { bottom: 10 + bottomPadding }]}>
      {/* SVG Concave Background with theme-aware styling */}
      <Svg
        width={SCREEN_WIDTH - 32}
        height={TAB_HEIGHT + CURVE_DEPTH}
        style={styles.svg}
      >
        <Path
          d={`M${BAR_RADIUS},0
            H${(SCREEN_WIDTH - 32) / 2 - CURVE_WIDTH / 2}
            C${(SCREEN_WIDTH - 32) / 2 - CURVE_WIDTH / 2 + 10},0 ${(SCREEN_WIDTH - 32) / 2 - CURVE_WIDTH / 4},${CURVE_DEPTH} ${(SCREEN_WIDTH - 32) / 2},${CURVE_DEPTH}
            C${(SCREEN_WIDTH - 32) / 2 + CURVE_WIDTH / 4},${CURVE_DEPTH} ${(SCREEN_WIDTH - 32) / 2 + CURVE_WIDTH / 2 - 10},0 ${(SCREEN_WIDTH - 32) / 2 + CURVE_WIDTH / 2},0
            H${(SCREEN_WIDTH - 32) - BAR_RADIUS}
            Q${SCREEN_WIDTH - 32},0 ${SCREEN_WIDTH - 32},${BAR_RADIUS}
            V${TAB_HEIGHT + CURVE_DEPTH - BAR_RADIUS}
            Q${SCREEN_WIDTH - 32},${TAB_HEIGHT + CURVE_DEPTH} ${(SCREEN_WIDTH - 32) - BAR_RADIUS},${TAB_HEIGHT + CURVE_DEPTH}
            H${BAR_RADIUS}
            Q0,${TAB_HEIGHT + CURVE_DEPTH} 0,${TAB_HEIGHT + CURVE_DEPTH - BAR_RADIUS}
            V${BAR_RADIUS}
            Q0,0 ${BAR_RADIUS},0
            Z`}
          fill={backgroundFill}
          stroke={backgroundStroke}
          strokeWidth={1}
        />
      </Svg>
      
      {/* Add blur effect for frosted glass look */}
      <BlurView
        intensity={isDarkMode ? 40 : 60}
        tint={isDarkMode ? "dark" : "light"}
        style={styles.blurOverlay}
      />
      
      {/* Tab Icons */}
      <View style={styles.tabRow}>
        {icons.map((icon, idx) => {
          // Center FAB
          if (icon.name === 'car') {
            return (
              <View key={icon.name} style={{ width: FAB_SIZE }} />
            );
          }
          // Use routeMap for exact matching
          const routeName = routeMap[icon.name];
          const routeIdx = state.routes.findIndex(r => r.name === routeName);
          const isFocused = state.index === routeIdx;
          
          return (
            <TouchableOpacity
              key={icon.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={() => {
                if (routeIdx !== -1) navigation.navigate(routeName);
              }}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={(icon.name + (isFocused ? '' : '-outline')) as any} 
                size={24} 
                color={isFocused ? colors.accent : tabIconInactiveColor} 
              />
              <Text style={[
                styles.label, 
                { 
                  color: isFocused ? colors.accent : tabTextInactiveColor,
                  marginTop: 4 
                }
              ]}>
                {icon.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      
      {/* Central FAB */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: fabBackground,
            borderColor: fabBorderColor,
            ...Platform.select({
              android: {
                elevation: isDarkMode ? 8 : 4,
              },
              ios: {
                shadowColor: isDarkMode ? '#000' : '#333',
                shadowOpacity: isDarkMode ? 0.4 : 0.2,
              }
            })
          }
        ]}
        onPress={() => {
          const routeIdx = state.routes.findIndex(r => r.name === 'Parking');
          if (routeIdx !== -1) navigation.navigate('Parking');
        }}
        activeOpacity={0.85}
      >
        <Ionicons name="car" size={32} color={fabIconColor} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: TAB_HEIGHT + CURVE_DEPTH,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 100,
    borderRadius: BAR_RADIUS,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 16,
    overflow: 'visible',
  },
  svg: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BAR_RADIUS,
    overflow: 'hidden',
  },
  blurOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: TAB_HEIGHT + CURVE_DEPTH,
    borderRadius: BAR_RADIUS,
    overflow: 'hidden',
    borderWidth: 0,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: SCREEN_WIDTH - 32,
    paddingHorizontal: 24,
    height: TAB_HEIGHT,
    marginBottom: CURVE_DEPTH / 2,
    zIndex: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    left: (SCREEN_WIDTH - 32 - FAB_SIZE) / 2,
    bottom: CURVE_DEPTH + 0,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    zIndex: 10,
  },
});

export default CustomTabBar; 