import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useTheme } from '../../theme/ThemeContext';

interface MapWrapperProps {
  children?: React.ReactNode;
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  style?: any;
  showFallback?: boolean;
}

const MapWrapper: React.FC<MapWrapperProps> = ({ 
  children, 
  initialRegion, 
  style, 
  showFallback = false 
}) => {
  const { themeMode, colors } = useTheme();
  const [mapError, setMapError] = useState(showFallback);
  const [mapReady, setMapReady] = useState(false);

  // Get current theme colors
  const currentColors = themeMode === 'light' ? colors.light : colors.dark;

  // Add a timeout to detect if map fails to load
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!mapReady) {
        setMapError(true);
        console.log('Map failed to load within timeout period');
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [mapReady]);

  // Check if we're running in Expo Go
  const isExpoGo = Platform.OS === 'android' && !!(global as any).__expo;

  // Render a fallback UI when maps can't be loaded
  if (mapError) {
    return (
      <View style={[styles.fallbackContainer, style]}>
        <Text style={[styles.fallbackText, { color: currentColors.text.primary }]}>
          Map Preview
        </Text>
        <Text style={[styles.fallbackSubtext, { color: currentColors.text.secondary }]}>
          {isExpoGo ? 'Maps may have limited functionality in Expo Go' : 'Unable to load map'}
        </Text>
        
        {/* Visual representation of the map area */}
        <View style={styles.mockMapArea}>
          <View style={styles.mapGridLine} />
          <View style={[styles.mapGridLine, { transform: [{rotate: '90deg'}] }]} />
          <View style={styles.mapPinContainer}>
            <View style={styles.mapPin} />
            <View style={styles.mapPinShadow} />
          </View>
        </View>
      </View>
    );
  }

  // Try to render the actual map without Google provider
  try {
    return (
      <MapView
        style={[styles.map, style]}
        initialRegion={initialRegion}
        onMapReady={() => setMapReady(true)}
      >
        {children}
      </MapView>
    );
  } catch (error) {
    console.error('Error rendering map:', error);
    return (
      <View style={[styles.fallbackContainer, style]}>
        <Text style={[styles.fallbackText, { color: currentColors.text.primary }]}>
          Unable to load map
        </Text>
        <Text style={[styles.fallbackSubtext, { color: currentColors.text.secondary }]}>
          Map service not available in this environment
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  fallbackText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fallbackSubtext: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  mockMapArea: {
    width: '80%',
    aspectRatio: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 20,
    borderRadius: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  mapGridLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
  },
  mapPinContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPin: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
    borderWidth: 2,
    borderColor: 'white',
  },
  mapPinShadow: {
    position: 'absolute',
    bottom: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.3)',
    transform: [{scaleX: 2}]
  }
});

export default MapWrapper; 