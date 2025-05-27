
import { auth, firestore } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { PricingPlan } from '../types';

export const pricingService = {
  // Get all pricing plans
  async getPricingPlans(): Promise<PricingPlan[]> {
    try {
      const plansQuery = query(
        collection(firestore, 'pricingPlans'),
        orderBy('name')
      );
      
      const snapshot = await getDocs(plansQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as PricingPlan);
    } catch (error) {
      console.error('Error getting pricing plans:', error);
      throw error;
    }
  },
  
  // Get pricing plans for a specific location
  async getLocationPricingPlans(locationId: string): Promise<PricingPlan[]> {
    try {
      const plansQuery = query(
        collection(firestore, 'pricingPlans'),
        where('locationId', '==', locationId),
        orderBy('hourlyRate')
      );
      
      const snapshot = await getDocs(plansQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as PricingPlan);
    } catch (error) {
      console.error('Error getting location pricing plans:', error);
      throw error;
    }
  },
  
  // Get popular pricing plans
  async getPopularPricingPlans(count: number = 3): Promise<PricingPlan[]> {
    try {
      const plansQuery = query(
        collection(firestore, 'pricingPlans'),
        where('isPopular', '==', true),
        limit(count)
      );
      
      const snapshot = await getDocs(plansQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as PricingPlan);
    } catch (error) {
      console.error('Error getting popular pricing plans:', error);
      throw error;
    }
  }
}; 