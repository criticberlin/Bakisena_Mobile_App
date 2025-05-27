# Theming and Internationalization System

This system provides comprehensive theming and internationalization (i18n) that affects every UI element and text in the application.

## How to Use the Theme System

### Basic Components

Use these components to automatically apply theme and language to your UI:

1. `AppThemeWrapper` - Wrapper for views/containers that automatically applies theme colors
2. `AppTextWrapper` - Text component that automatically applies theme styles and translations

### Example Usage

```jsx
import { AppThemeWrapper, AppTextWrapper, useTheme } from '../theme';
import { TouchableOpacity } from 'react-native';

const MyScreen = () => {
  const { colors } = useTheme();
  
  return (
    <AppThemeWrapper containerType="screen" style={{ flex: 1 }}>
      <AppThemeWrapper containerType="card" style={{ padding: 16, margin: 16, borderRadius: 8 }}>
        {/* Translated text with styling */}
        <AppTextWrapper variant="title" textKey="welcomeTitle">
          Default text if key not found
        </AppTextWrapper>
        
        {/* Regular text with theme styling */}
        <AppTextWrapper style={{ marginTop: 8 }}>
          This text will use theme colors but won't be translated
        </AppTextWrapper>
        
        {/* Translated text with values */}
        <AppTextWrapper 
          textKey="userGreeting" 
          values={{ name: "John", count: 5 }}
          variant="subtitle"
        />
        
        {/* Theme is automatically applied to custom components */}
        <TouchableOpacity 
          style={{ 
            backgroundColor: colors.accent,
            padding: 12,
            borderRadius: 8,
            marginTop: 16
          }}
        >
          <AppTextWrapper textKey="buttonLabel" style={{ color: 'white' }} />
        </TouchableOpacity>
      </AppThemeWrapper>
    </AppThemeWrapper>
  );
};
```

## Container Types

The `AppThemeWrapper` accepts different container types:

- `screen` - For full screens (uses background color)
- `surface` - For cards and elevated surfaces
- `card` - For interactive cards
- `view` - For basic view containers (transparent by default)

## Text Variants

The `AppTextWrapper` supports different text variants:

- `header` - Large headlines
- `title` - Section titles
- `subtitle` - Secondary titles
- `body` - Regular text (default)
- `caption` - Small descriptive text
- `button` - Text for buttons
- `label` - Text for form labels

## Theme Hooks

Get access to theme values directly in your components:

```jsx
import { useTheme } from '../theme';

const MyComponent = () => {
  const { colors, themeMode, toggleTheme } = useTheme();
  
  // Now use colors in your styles
  return (
    <View style={{ backgroundColor: colors.surface }}>
      <Text style={{ color: colors.text.primary }}>
        Current theme: {themeMode}
      </Text>
      <Button onPress={toggleTheme} title="Toggle Theme" />
    </View>
  );
};
```

## Language Hooks

Access translation functions directly:

```jsx
import { useLanguage } from '../constants/translations/LanguageContext';

const MyComponent = () => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  
  return (
    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
      <Text>{t('currentLanguage')}: {language}</Text>
      <Button 
        onPress={() => setLanguage(language === 'en' ? 'ar' : 'en')} 
        title={t('switchLanguage')} 
      />
    </View>
  );
};
```

## Best Practices

1. Always use `AppThemeWrapper` for containers
2. Always use `AppTextWrapper` for text
3. For custom styling, get theme values from `useTheme()` hook
4. Use translation keys for all user-facing text
5. Test your UI in both light and dark themes
6. Test your UI in LTR and RTL layouts 