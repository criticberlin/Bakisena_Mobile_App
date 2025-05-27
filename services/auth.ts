import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

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
    
    // Check if user is admin
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    const isAdmin = userDoc.exists() && userDoc.data().isAdmin === true;
    
    console.log('Login successful:', userCredential.user.uid, 'isAdmin:', isAdmin);
    return {
      user: userCredential.user,
      isAdmin,
      error: null
    };
  } catch (error: any) {
    console.error('Login error:', error.code, error.message);
    return {
      user: null,
      isAdmin: false,
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

// Create admin user
export const createAdminUser = async (email: string, password: string, name: string) => {
  try {
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create the user document in Firestore with admin role
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name,
      email,
      isAdmin: true,
      createdAt: new Date().toISOString()
    });

    return {
      user: userCredential.user,
      error: null
    };
  } catch (error: any) {
    console.error('Admin user creation error:', error.code, error.message);
    return {
      user: null,
      error: error.message
    };
  }
};

// Initialize admin account
export const initializeAdminAccount = async () => {
  const adminEmail = 'admin@bakisena.com';
  const adminPassword = 'admin123';
  
  try {
    // First check if admin exists in Firestore
    const adminQuery = query(
      collection(db, 'users'),
      where('email', '==', adminEmail),
      where('isAdmin', '==', true)
    );
    const adminSnapshot = await getDocs(adminQuery);
    
    if (!adminSnapshot.empty) {
      console.log('Admin account already exists in Firestore');
      return { error: null };
    }

    // Create the admin account in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    
    // Create the admin user document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name: 'Admin User',
      email: adminEmail,
      isAdmin: true,
      createdAt: new Date().toISOString()
    });
    
    console.log('Admin account created successfully');
    return { error: null };
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      // If the email is already in use, try to sign in to verify credentials
      try {
        await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        console.log('Admin account exists and credentials are valid');
        return { error: null };
      } catch (signInError: any) {
        console.error('Error signing in to existing admin account:', signInError);
        return { error: signInError.message };
      }
    }
    console.error('Error initializing admin account:', error);
    return { error: error.message };
  }
};

// Check if user is admin
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.isAdmin === true;
    }
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}; 