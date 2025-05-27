import { createAdminUser } from '../services/auth';

const createAdmin = async () => {
  try {
    console.log('Starting admin user creation...');
    const adminEmail = 'admin@bakisena.com';
    const adminPassword = 'Admin@123';
    const adminName = 'Bakisena Admin';

    console.log('Creating admin user with email:', adminEmail);
    const admin = await createAdminUser(adminEmail, adminPassword, adminName);
    console.log('Admin user created successfully:', admin);
    console.log('Admin details:', {
      uid: admin.uid,
      email: admin.email,
      isAdmin: admin.isAdmin,
      name: admin.name
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
};

console.log('Script started');
createAdmin().then(() => {
  console.log('Script completed');
}).catch(error => {
  console.error('Script failed:', error);
}); 