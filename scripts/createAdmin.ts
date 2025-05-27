import { createAdminUser } from '../services/auth';

const createAdmin = async () => {
  try {
    const adminEmail = 'admin@bakisena.com'; // Change this to your desired admin email
    const adminPassword = 'Admin@123'; // Change this to your desired admin password
    const adminName = 'Bakisena Admin';

    const admin = await createAdminUser(adminEmail, adminPassword, adminName);
    console.log('Admin user created successfully:', admin);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

createAdmin(); 