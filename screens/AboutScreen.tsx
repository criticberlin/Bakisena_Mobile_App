import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Linking 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import { RootStackParamList } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import AppLayout from '../components/layout/AppLayout';
import RTLWrapper from '../components/layout/RTLWrapper';

type AboutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'About'>;

const AboutScreen: React.FC = () => {
  const navigation = useNavigation<AboutScreenNavigationProp>();
  const { themeMode, colors } = useTheme();
  const { t, language } = useLanguage();
  
  // Get current theme colors
  const currentColors = themeMode === 'light' ? colors?.light || {} : colors?.dark || {};
  
  const appVersion = "1.0.0";

  return (
    <AppLayout style={styles.container} scrollable={true}>
      {/* Header */}
      <RTLWrapper style={styles.header} ignoreArabic={true}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={currentColors.text?.primary || '#0F1544'} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: currentColors.text?.primary || '#0F1544' }]}>
          {t('about')}
        </Text>
        <View style={{ width: 24 }} />
      </RTLWrapper>

      <View style={styles.content}>
        {/* App Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/Logo_With_Border.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.appVersion, { color: currentColors.text?.secondary || '#0F1544' }]}>
            {t('version')}: {appVersion}
          </Text>
        </View>
        
        {/* App Description */}
        <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.sectionBlur}>
          <View style={[
            styles.sectionContainer, 
            { 
              backgroundColor: currentColors.surface, 
            }
          ]}>
            <Text style={[
              styles.sectionTitle, 
              { 
                color: currentColors.text?.primary || '#0F1544',
                textAlign: 'left'
              }
            ]}>
              {t('aboutApp')}
            </Text>
            <Text style={[
              styles.sectionText, 
              { 
                color: currentColors.text?.secondary || '#0F1544',
                textAlign: 'left'
              }
            ]}>
              {t('appDescription')}
            </Text>
          </View>
        </BlurView>
        
        {/* Developer Info */}
        <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.sectionBlur}>
          <View style={[styles.sectionContainer, { backgroundColor: currentColors.surface }]}>
            <Text style={[
              styles.sectionTitle, 
              { 
                color: currentColors.text?.primary || '#0F1544',
                textAlign: 'left'  
              }
            ]}>
              {t('developer')}
            </Text>
            <Text style={[
              styles.sectionText, 
              { 
                color: currentColors.text?.secondary || '#0F1544',
                textAlign: 'left'
              }
            ]}>
              {t('developerInfo')}
            </Text>
          </View>
        </BlurView>
        
        {/* Contact Info */}
        <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.sectionBlur}>
          <View style={[styles.sectionContainer, { backgroundColor: currentColors.surface }]}>
            <Text style={[
              styles.sectionTitle, 
              { 
                color: currentColors.text?.primary || '#0F1544',
                textAlign: 'left'
              }
            ]}>
              {t('contact')}
            </Text>
            
            <RTLWrapper 
              style={styles.contactItem}
              ignoreArabic={true}
            >
              <Ionicons name="mail-outline" size={20} color={currentColors.accent} style={styles.icon} />
              <TouchableOpacity onPress={() => Linking.openURL('mailto:support@bakisena.com')}>
                <Text style={[styles.contactText, { color: currentColors.text?.secondary || '#0F1544' }]}>
                  support@bakisena.com
                </Text>
              </TouchableOpacity>
            </RTLWrapper>
            
            <RTLWrapper 
              style={styles.contactItem}
              ignoreArabic={true}
            >
              <Ionicons name="call-outline" size={20} color={currentColors.accent} style={styles.icon} />
              <TouchableOpacity onPress={() => Linking.openURL('tel:+201015183968')}>
                <Text style={[styles.contactText, { color: currentColors.text?.secondary || '#0F1544' }]}>
                  +201015183968
                </Text>
              </TouchableOpacity>
            </RTLWrapper>
            
            <RTLWrapper 
              style={styles.contactItem}
              ignoreArabic={true}
            >
              <Ionicons name="globe-outline" size={20} color={currentColors.accent} style={styles.icon} />
              <TouchableOpacity onPress={() => Linking.openURL('https://www.bakisena.com')}>
                <Text style={[styles.contactText, { color: currentColors.text?.secondary || '#0F1544' }]}>
                  www.bakisena.com
                </Text>
              </TouchableOpacity>
            </RTLWrapper>
          </View>
        </BlurView>
        
        {/* Legal */}
        <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.sectionBlur}>
          <View style={[styles.sectionContainer, { backgroundColor: currentColors.surface }]}>
            <RTLWrapper 
              style={[
                styles.legalItem, 
                { borderBottomColor: currentColors.divider }
              ]}
              ignoreArabic={true}
            >
              <Text style={[
                styles.legalText, 
                { 
                  color: currentColors.text?.primary || '#0F1544',
                  textAlign: 'left'
                }
              ]}>
                {t('termsOfService')}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <Ionicons 
                  name="chevron-forward" 
                  size={18} 
                  color={currentColors.text?.secondary || '#0F1544'} 
                />
              </TouchableOpacity>
            </RTLWrapper>
            
            <RTLWrapper 
              style={[
                styles.legalItem, 
                { borderBottomWidth: 0 }
              ]}
              ignoreArabic={true}
            >
              <Text style={[
                styles.legalText, 
                { 
                  color: currentColors.text?.primary || '#0F1544',
                  textAlign: 'left'
                }
              ]}>
                {t('privacyPolicy')}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <Ionicons 
                  name="chevron-forward" 
                  size={18} 
                  color={currentColors.text?.secondary || '#0F1544'} 
                />
              </TouchableOpacity>
            </RTLWrapper>
          </View>
        </BlurView>
        
        <Text style={[
          styles.copyright, 
          { 
            color: currentColors.text?.secondary || '#0F1544',
            textAlign: 'left'
          }
        ]}>
          © 2023 Bakisena. {t('allRightsReserved')}
        </Text>
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
    width: '100%',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 24,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 16,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
  },
  sectionBlur: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionContainer: {
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  contactItem: {
    alignItems: 'center',
    marginVertical: 8,
  },
  icon: {
    marginRight: 12,
  },
  iconRtl: {
    marginLeft: 12,
  },
  contactText: {
    fontSize: 15,
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  legalText: {
    fontSize: 15,
    fontWeight: '500',
  },
  copyright: {
    fontSize: 14,
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'left',
    width: '100%',
  },
});

export default AboutScreen; 