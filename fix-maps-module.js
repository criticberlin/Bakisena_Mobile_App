const fs = require('fs');
const path = require('path');

// Path to react-native-maps module
const modulePath = path.join(__dirname, 'node_modules/react-native-maps');
const generatedDir = path.join(modulePath, 'lib/generated');
const airModulePath = path.join(generatedDir, 'RNMapsAirModule.js');

// Create directories if they don't exist
if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir, { recursive: true });
}

// Create an empty module for RNMapsAirModule
const emptyModule = `
/**
 * This is a workaround for the RNMapsAirModule error
 * It creates an empty module that can be imported without crashing
 */

import { TurboModuleRegistry } from 'react-native';

export default TurboModuleRegistry.get('RNMapsAirModule') || {};
`;

// Write the file
fs.writeFileSync(airModulePath, emptyModule);

console.log('Fix applied: Created empty RNMapsAirModule');

// Also modify ParkingMap.native.tsx to ensure it uses the default provider
const mapFilePath = path.join(__dirname, 'components/map/ParkingMap.native.tsx');

try {
  const mapFileContent = fs.readFileSync(mapFilePath, 'utf8');
  
  // Simple string replacement to ensure we're not using PROVIDER_GOOGLE
  const updatedContent = mapFileContent.replace(
    /provider={PROVIDER_GOOGLE}/g,
    '// provider={PROVIDER_GOOGLE}'
  );
  
  fs.writeFileSync(mapFilePath, updatedContent);
  console.log('Fix applied: Modified ParkingMap.native.tsx to use default provider');
} catch (err) {
  console.error('Failed to modify ParkingMap.native.tsx:', err);
} 