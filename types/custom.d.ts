// This file contains custom type declarations for the project

// Extending @expo/vector-icons types
import { IconProps } from '@expo/vector-icons/build/createIconSet';

declare module '@expo/vector-icons' {
  export interface IoniconsProps extends IconProps {
    name: string; // Allow any string for Ionicons name
  }
} 