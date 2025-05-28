import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { auth, firestore } from '../config/firebase';

export interface UserFirebase {
  uid: string;
  email: string;
  isAdmin: boolean;
  name?: string;
}

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
    const userDoc = await getDoc(doc(firestore, 'users', userCredential.user.uid));
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
export const getCurrentUser = async (): Promise<UserFirebase | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const userDoc = await getDoc(doc(firestore, 'users', user.uid));
    const userData = userDoc.data();

    return {
      uid: user.uid,
      email: user.email!,
      isAdmin: userData?.isAdmin || false,
      name: userData?.name
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
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
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create admin document in Firestore
    await setDoc(doc(firestore, 'users', user.uid), {
      email: user.email,
      name: name,
      isAdmin: true,
      createdAt: new Date().toISOString()
    });

    return {
      uid: user.uid,
      email: user.email,
      isAdmin: true,
      name: name
    };
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

// Initialize admin account
export const initializeAdminAccount = async () => {
  const adminEmail = 'admin@bakisena.com';
  const adminPassword = 'admin123';
  
  try {
    // First check if admin exists in Firestore
    const adminQuery = query(
      collection(firestore, 'users'),
      where('email', '==', adminEmail)
    );
    const adminSnapshot = await getDocs(adminQuery);
    
    if (!adminSnapshot.empty) {
      // Admin exists, update isAdmin to true
      const adminDoc = adminSnapshot.docs[0];
      await setDoc(doc(firestore, 'users', adminDoc.id), {
        ...adminDoc.data(),
        isAdmin: true
      }, { merge: true });
      console.log('Admin account updated in Firestore');
      return { error: null };
    }

    // Create the admin account in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    
    // Create the admin user document in Firestore
    await setDoc(doc(firestore, 'users', userCredential.user.uid), {
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
        const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        // Update the user document to ensure isAdmin is true
        await setDoc(doc(firestore, 'users', userCredential.user.uid), {
          email: adminEmail,
          isAdmin: true,
          updatedAt: new Date().toISOString()
        }, { merge: true });
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
    const userDoc = await getDoc(doc(firestore, 'users', userId));
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