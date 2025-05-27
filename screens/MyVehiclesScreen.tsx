import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  FlatList,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import { RootStackParamList } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import { Vehicle } from '../types';

type MyVehiclesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MyVehicles'>;

// Sample vehicle data
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    userId: 'user1',
    licensePlate: 'ABC 1234',
    make: 'Toyota',
    model: 'Camry',
    color: 'Black',
    type: 'CAR',
  },
  {
    id: '2',
    userId: 'user1',
    licensePlate: 'XYZ 5678',
    make: 'Honda',
    model: 'Civic',
    color: 'Blue',
    type: 'CAR',
  },
];

const MyVehiclesScreen: React.FC = () => {
  const navigation = useNavigation<MyVehiclesScreenNavigationProp>();
  const { themeMode, colors } = useTheme();

  // Get current theme colors
  const currentColors = themeMode === 'light' ? colors.light : colors.dark;

  const { t, language } = useLanguage();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  
  const handleAddVehicle = () => {
    // Navigate to add vehicle screen - using Settings as a placeholder for now
    navigation.navigate('Settings');
  };
  
  const handleEditVehicle = (vehicle: Vehicle) => {
    // Navigate to edit vehicle screen - using Settings as a placeholder for now
    navigation.navigate('Settings');
  };
  
  const handleDeleteVehicle = (vehicleId: string) => {
    Alert.alert(
      t('deleteVehicle'),
      t('deleteVehicleConfirmation'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('delete'),
          onPress: () => {
            // Remove vehicle from the list
            setVehicles(vehicles.filter(v => v.id !== vehicleId));
          },
          style: 'destructive',
        },
      ],
    );
  };
  
  const renderVehicleItem = ({ item }: { item: Vehicle }) => (
    <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.vehicleItemBlur}>
      <View style={[
        styles.vehicleItem, 
        { 
          backgroundColor: currentColors.surface,
        }
      ]}>
        <View style={[
          styles.vehicleInfo,
          { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
        ]}>
          <View style={[
            styles.vehicleIcon,
            { backgroundColor: currentColors.accent + '20' }
          ]}>
            <Ionicons name="car" size={24} color={currentColors.accent} />
          </View>
          <View style={[
            styles.vehicleDetails,
            { alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }
          ]}>
            <Text style={[
              styles.licensePlate, 
              { 
                color: currentColors.text.primary,
                textAlign: language === 'ar' ? 'right' : 'left'
              }
            ]}>
              {item.licensePlate}
            </Text>
            <Text style={[
              styles.vehicleModel, 
              { 
                color: currentColors.text.secondary,
                textAlign: language === 'ar' ? 'right' : 'left'
              }
            ]}>
              {item.make} {item.model}
            </Text>
            <Text style={[
              styles.vehicleDetails, 
              { 
                color: currentColors.text.secondary,
                textAlign: language === 'ar' ? 'right' : 'left'
              }
            ]}>
              {item.color} • {t(item.type.toLowerCase() as keyof typeof t)}
            </Text>
          </View>
        </View>
        <View style={[
          styles.vehicleActions,
          { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
        ]}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleEditVehicle(item)}
          >
            <Ionicons name="create-outline" size={20} color={currentColors.accent} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeleteVehicle(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color={currentColors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </BlurView>
  );

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: currentColors.background,
      }
    ]}>
      {/* Header */}
      <View style={[
        styles.header, 
        { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
      ]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name={language === 'ar' ? "arrow-forward" : "arrow-back"} size={24} color={currentColors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: currentColors.text.primary }]}>
          {t('myVehicles')}
        </Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddVehicle}
        >
          <Ionicons name="add" size={24} color={currentColors.accent} />
        </TouchableOpacity>
      </View>

      {vehicles.length > 0 ? (
        <FlatList
          data={vehicles}
          renderItem={renderVehicleItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.vehicleList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="car-outline" size={80} color={currentColors.text.secondary} />
          <Text style={[styles.emptyText, { color: currentColors.text.secondary }]}>
            {t('noVehicles')}
          </Text>
          <TouchableOpacity 
            style={[styles.addVehicleButton, { backgroundColor: currentColors.accent }]}
            onPress={handleAddVehicle}
          >
            <Text style={styles.addVehicleButtonText}>
              {t('addVehicle')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleList: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  vehicleItemBlur: {
    overflow: 'hidden',
    borderRadius: 16,
    marginBottom: 16,
  },
  vehicleItem: {
    padding: 16,
    borderRadius: 16,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  vehicleDetails: {
    flex: 1,
  },
  licensePlate: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  vehicleModel: {
    fontSize: 16,
    marginBottom: 2,
  },
  vehicleActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  addVehicleButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addVehicleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyVehiclesScreen; 