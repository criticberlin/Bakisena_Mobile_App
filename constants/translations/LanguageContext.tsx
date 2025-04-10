import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager, Text, TextProps } from 'react-native';
import { translations, Language, TranslationKey } from './index';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: TranslationKey) => string;
  TranslatedText: React.FC<TranslatedTextProps>;
  isRTL: boolean;
}

interface TranslatedTextProps extends TextProps {
  textKey: TranslationKey;
  values?: Record<string, string | number>;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: async () => {},
  t: () => '',
  TranslatedText: () => null,
  isRTL: false,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState<boolean>(false);

  useEffect(() => {
    // Load saved language preference
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('language');
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
          changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
      }
    };

    loadLanguage();
  }, []);

  const changeLanguage = async (lang: Language) => {
    setLanguageState(lang);
    
    // For RTL support in Arabic
    const shouldBeRTL = lang === 'ar';
    setIsRTL(shouldBeRTL);
    
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.forceRTL(shouldBeRTL);
      // In a real app, you might want to reload the app here
      // Updates to I18nManager require a reload to take effect properly
    }
    
    try {
      await AsyncStorage.setItem('language', lang);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  // Translation function
  const t = (key: TranslationKey, values?: Record<string, string | number>): string => {
    let text = translations[language][key] || translations.en[key] || key;
    
    if (values) {
      Object.entries(values).forEach(([valueKey, value]) => {
        text = text.replace(new RegExp(`{{${valueKey}}}`, 'g'), String(value));
      });
    }
    
    return text;
  };

  // Translated Text component
  const TranslatedText: React.FC<TranslatedTextProps> = ({ 
    textKey, 
    values,
    style,
    ...props 
  }) => {
    return (
      <Text style={style} {...props}>
        {t(textKey, values)}
      </Text>
    );
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: changeLanguage,
      t,
      TranslatedText,
      isRTL
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext); 