# Bakisena App Troubleshooting Guide

This document provides solutions for common issues encountered in the Bakisena Mobile App.

## Permission Issues with Firebase

If you encounter "Permission denied" errors when accessing data from Firebase Firestore, follow these steps:

### 1. Deploy Updated Firestore Security Rules

We've updated the security rules to allow access to all the necessary collections. To deploy them:

```bash
npm run deploy:rules
```

This will deploy the updated firestore.rules file which includes permissions for:
- parkingSpots (public read access)
- parkingStatistics (public read access)
- notifications (authenticated user access)
- connectedDevices (authenticated user access)

### 2. Seed Required Data

We've provided scripts to populate the database with sample data:

```bash
# Seed parking locations and pricing plans
npm run seed:locations

# Seed connected devices, parking statistics, notifications, and parking spots
npm run seed:connected

# Run both scripts in sequence
npm run seed:all
```

## Demo Data Fallback

All screens are configured with fallback data to ensure the app works even without Firebase. If you see a "Using Demo Data" message, it means:

1. The app is displaying offline sample data
2. Either Firebase permissions are not set correctly or
3. Data has not been seeded in the database

## "Connected", "Monitor" and Map Screens

These screens require specific collections in Firestore:
- `connectedDevices`: For the Connected screen
- `parkingStatistics`: For the Monitor screen
- `parkingSpots`: For the Map functionality

If data is missing, the app will show demo data automatically.

## Troubleshooting Common Issues

### Authentication Issues
- The app will work without authentication but some features require login
- Login with the default admin credentials: `admin@bakisena.com` / `admin123`

### Navigation Errors
- If experiencing navigation issues, the app now uses improved navigation helpers
- Import from `navigation` folder: `import { navigateTo, goBack } from '../navigation';`

### Button Responsiveness
- TouchableOpacity components were optimized for better responsiveness
- For consistent touch behavior, use TouchableWrapper: `import TouchableWrapper from '../components/TouchableWrapper';`

## Firebase Collections Overview

The app requires these collections in Firestore:

| Collection | Purpose | Access |
|------------|---------|--------|
| parkingLocations | Stores parking location data | Public read |
| pricingPlans | Stores pricing plans | Public read |
| parkingSpots | Stores individual parking spots | Public read |
| parkingStatistics | Stores occupancy statistics | Public read |
| connectedDevices | Stores user's connected devices | User-specific |
| notifications | Stores user notifications | User-specific |
| users | Stores user profiles | User-specific |
| bookings | Stores parking reservations | User-specific | 