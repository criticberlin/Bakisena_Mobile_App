import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

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
  return (
    <View style={styles.container}>
      {/* SVG Concave Background */}
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
          fill="rgba(255,255,255,0.7)"
          stroke="#eee"
          strokeWidth={1}
        />
      </Svg>
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
              <Ionicons name={(icon.name + (isFocused ? '' : '-outline')) as any} size={28} color={isFocused ? '#FFD600' : '#888'} />
              <Text style={[styles.label, isFocused && { color: '#FFD600' }]}>{icon.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {/* Central FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          const routeIdx = state.routes.findIndex(r => r.name === 'Parking');
          if (routeIdx !== -1) navigation.navigate('Parking');
        }}
        activeOpacity={0.85}
      >
        <Ionicons name="car" size={32} color="#222" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
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
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: SCREEN_WIDTH - 32,
    paddingHorizontal: 24,
    height: TAB_HEIGHT,
    marginBottom: CURVE_DEPTH / 2,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 11,
    color: '#888',
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
    backgroundColor: '#FFD600',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default CustomTabBar; 