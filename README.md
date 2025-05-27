# Bakisena Mobile App

Bakisena is a comprehensive mobile application designed to streamline parking operations in urban environments. The app connects drivers with available parking spaces, provides real-time monitoring, and offers a seamless payment experience.

## Overview

The Bakisena parking platform addresses common urban parking challenges through:
- **Smart Parking Solutions**: Real-time parking availability detection
- **Seamless User Experience**: Mobile app for finding, booking, and paying for parking
- **Management Dashboard**: Administrative tools for parking operators
- **Data Analytics**: Insights on parking usage patterns for optimization

## Features

### For Drivers
- **User Authentication**: Secure login and registration with email or social media integration
- **Parking Space Locator**: GPS-enabled map interface showing available parking spots in real-time
- **Reservation System**: Pre-book parking slots up to 7 days in advance
- **Vehicle Management**: Add and manage multiple vehicles with license plate recognition
- **Payment Processing**: Multiple payment options including credit/debit cards, mobile wallets
- **Booking History**: Comprehensive records of past parking sessions with receipts
- **Notifications**: Alerts for booking confirmations, upcoming expirations, and special offers
- **Rate Calculator**: Estimate parking costs before booking

### For Admins
- **Dashboard Overview**: Real-time occupancy metrics and revenue data
- **User Management**: Manage user accounts and permissions
- **Pricing Control**: Set and adjust parking rates based on demand
- **Analytics**: Detailed reports on usage patterns and revenue generation
- **Maintenance Tracking**: Log and monitor parking facility maintenance issues

## App Architecture

Bakisena follows a modern React Native architecture with:
- **Frontend**: React Native with Expo framework for cross-platform compatibility
- **State Management**: React Context API and local state management
- **Navigation**: React Navigation (Stack, Tab, and Drawer navigators)
- **API Communication**: RESTful API integration with secure authentication
- **Data Persistence**: AsyncStorage for local data and user preferences
- **UI Components**: Custom components with responsive design principles

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm (v8+) or yarn (v1.22+)
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Physical device or emulator for testing

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/Bakisena_Mobile_App.git
   cd Bakisena_Mobile_App
   ```

2. Install dependencies
   ```bash
   npm install
   # or with yarn
   yarn install
   ```

3. Start the development server
   ```bash
   npm start
   # or
   npx expo start
   ```

### Running on Devices

#### Android
```bash
npm run android
# or
npx expo run:android
```

#### iOS (requires macOS)
```bash
npm run ios
# or
npx expo run:ios
```

#### Using Expo Go
1. Install Expo Go on your device
2. Start the development server: `npm start`
3. Scan the QR code with your device

## Development

### Tech Stack
- **React Native**: Core framework for cross-platform mobile development
- **TypeScript**: For type safety and improved developer experience
- **Expo**: Development toolkit and platform
- **React Navigation**: For handling app navigation
- **AsyncStorage**: For local data persistence
- **React Native Maps**: For location-based features
- **Expo Vector Icons**: For UI elements and graphics
- **React Native Reanimated**: For smooth animations

### Development Workflow
1. Create a feature branch from main: `git checkout -b feature/your-feature-name`
2. Implement your changes following the coding standards
3. Test thoroughly on both Android and iOS platforms
4. Create a pull request to merge into the main branch

### Coding Standards
- Follow the TypeScript strict mode guidelines
- Use functional components with hooks
- Implement proper error handling
- Write descriptive comments where necessary
- Follow the existing folder structure

## Project Structure

- `/app`: Entry point and routing with Expo Router
- `/screens`: Main application screens
  - LoginScreen, RegisterScreen: Authentication screens
  - HomeScreen: Main dashboard for users
  - ParkingScreen: Parking spot location and booking
  - UserDashboardScreen: User-specific information and settings
  - AdminDashboardScreen: Administrative dashboard and controls
- `/components`: Reusable UI components
  - UI elements like buttons, cards, modals
  - Form elements and input components
  - Custom map markers and callouts
- `/navigation`: Navigation setup and configuration
  - Stack navigators for authentication and main app flow
  - Tab navigators for main app sections
  - Drawer navigator for settings and additional options
- `/assets`: Images, fonts, and other static resources
- `/constants`: App constants, theme definitions, and configuration values
- `/theme`: Styling utilities, color palettes, and responsive design helpers
- `/types`: TypeScript type definitions and interfaces
- `/hooks`: Custom React hooks for shared functionality
- `/services`: API service integrations and data fetching logic

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Clear cache: `expo start -c`
   - Verify node modules: `rm -rf node_modules && npm install`

2. **Dependency Issues**
   - Check for conflicting dependencies in package.json
   - Ensure compatible versions with `expo doctor`

3. **Device Connection Problems**
   - Verify same WiFi network for development server and device
   - Try connecting via USB with `expo start --localhost`

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Contribution Guidelines
- Follow the code style of the project
- Write tests for new features
- Update documentation for any changes
- Ensure all tests pass before submitting pull requests

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Maintainer - [Your Name](mailto:your.email@example.com)

Project Link: [https://github.com/yourusername/Bakisena_Mobile_App](https://github.com/yourusername/Bakisena_Mobile_App)
