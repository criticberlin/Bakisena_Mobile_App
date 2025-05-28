import { auth, firestore } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { User } from '../types';

export const userService = {
  // Get current user profile from Firestore
  async getCurrentUserProfile(): Promise<User | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    
    try {
      const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Check if user is marked as deleted
        if (userData.deleted) return null;
        return { id: userDoc.id, ...userData } as User;
      } else {
        // Create a default profile if it doesn't exist
        const defaultProfile: User = {
          id: currentUser.uid,
          email: currentUser.email || '',
          name: currentUser.displayName || '',
          phone: '',
          isAdmin: false,
          deleted: false
        };
        
        await setDoc(doc(firestore, 'users', currentUser.uid), defaultProfile);
        return defaultProfile;
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },
  
  // Update user profile in Firestore
  async updateUserProfile(userData: Partial<User>): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No authenticated user');
    
    try {
      await updateDoc(doc(firestore, 'users', currentUser.uid), userData);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
  
  // Delete user account and all associated data
  async deleteUserAccount(): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No authenticated user');
    
    try {
      // Delete user document from Firestore
      await deleteDoc(doc(firestore, 'users', currentUser.uid));
      
      // Delete the authentication account
      await currentUser.delete();
    } catch (error) {
      console.error('Error deleting user account:', error);
      throw error;
    }
  }
}; 