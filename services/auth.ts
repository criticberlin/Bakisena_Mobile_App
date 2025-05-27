import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Register a new user
export const register = async (email: string, password: string) => {
  try {
    console.log('Attempting to register user:', email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Registration successful:', userCredential.user.uid);
    return {
      user: userCredential.user,
      error: null
    };
  } catch (error: any) {
    console.error('Registration error:', error.code, error.message);
    return {
      user: null,
      error: error.message
    };
  }
};

// Login user
export const login = async (email: string, password: string) => {
  try {
    console.log('Attempting to login user:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Login successful:', userCredential.user.uid);
    return {
      user: userCredential.user,
      error: null
    };
  } catch (error: any) {
    console.error('Login error:', error.code, error.message);
    return {
      user: null,
      error: error.message
    };
  }
};

// Logout user
export const logout = async () => {
  try {
    console.log('Attempting to logout user');
    await signOut(auth);
    console.log('Logout successful');
    return { error: null };
  } catch (error: any) {
    console.error('Logout error:', error.code, error.message);
    return { error: error.message };
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  const user = auth.currentUser;
  console.log('Current user:', user?.uid || 'No user logged in');
  return user;
};

// Subscribe to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  console.log('Setting up auth state listener');
  return onAuthStateChanged(auth, (user) => {
    console.log('Auth state changed:', user?.uid || 'No user');
    callback(user);
  });
}; 