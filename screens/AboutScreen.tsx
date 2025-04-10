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

type AboutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'About'>;

const AboutScreen: React.FC = () => {
  const navigation = useNavigation<AboutScreenNavigationProp>();
  const { themeMode, colors } = useTheme();
  const { t, language } = useLanguage();
  
  const appVersion = "1.0.0";

  return (
    <AppLayout style={[
      styles.container, 
      { alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }
    ]}>
      {/* Header */}
      <View style={[
        styles.header, 
        { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
      ]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name={language === 'ar' ? "arrow-forward" : "arrow-back"} size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          {t('about')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* App Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/Logo_With_Border.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.appName, { color: colors.text.primary }]}>
            Bakisena Parking
          </Text>
          <Text style={[styles.appVersion, { color: colors.text.secondary }]}>
            {t('version')}: {appVersion}
          </Text>
        </View>
        
        {/* App Description */}
        <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.sectionBlur}>
          <View style={[
            styles.sectionContainer, 
            { 
              backgroundColor: colors.surface, 
            }
          ]}>
            <Text style={[
              styles.sectionTitle, 
              { 
                color: colors.text.primary,
                textAlign: language === 'ar' ? 'right' : 'left'
              }
            ]}>
              {t('aboutApp')}
            </Text>
            <Text style={[
              styles.sectionText, 
              { 
                color: colors.text.secondary,
                textAlign: language === 'ar' ? 'right' : 'left'
              }
            ]}>
              {t('appDescription')}
            </Text>
          </View>
        </BlurView>
        
        {/* Developer Info */}
        <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.sectionBlur}>
          <View style={[styles.sectionContainer, { backgroundColor: colors.surface }]}>
            <Text style={[
              styles.sectionTitle, 
              { 
                color: colors.text.primary,
                textAlign: language === 'ar' ? 'right' : 'left'  
              }
            ]}>
              {t('developer')}
            </Text>
            <Text style={[
              styles.sectionText, 
              { 
                color: colors.text.secondary,
                textAlign: language === 'ar' ? 'right' : 'left'
              }
            ]}>
              {t('developerInfo')}
            </Text>
          </View>
        </BlurView>
        
        {/* Contact Info */}
        <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.sectionBlur}>
          <View style={[styles.sectionContainer, { backgroundColor: colors.surface }]}>
            <Text style={[
              styles.sectionTitle, 
              { 
                color: colors.text.primary,
                textAlign: language === 'ar' ? 'right' : 'left'
              }
            ]}>
              {t('contact')}
            </Text>
            
            <TouchableOpacity 
              style={[
                styles.contactItem,
                { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
              ]}
              onPress={() => Linking.openURL('mailto:support@bakisena.com')}
            >
              <Ionicons name="mail-outline" size={20} color={colors.accent} style={language === 'ar' ? styles.iconRtl : styles.icon} />
              <Text style={[styles.contactText, { color: colors.text.secondary }]}>
                support@bakisena.com
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.contactItem,
                { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
              ]}
              onPress={() => Linking.openURL('tel:+1234567890')}
            >
              <Ionicons name="call-outline" size={20} color={colors.accent} style={language === 'ar' ? styles.iconRtl : styles.icon} />
              <Text style={[styles.contactText, { color: colors.text.secondary }]}>
                +123 456 7890
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.contactItem,
                { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
              ]}
              onPress={() => Linking.openURL('https://www.bakisena.com')}
            >
              <Ionicons name="globe-outline" size={20} color={colors.accent} style={language === 'ar' ? styles.iconRtl : styles.icon} />
              <Text style={[styles.contactText, { color: colors.text.secondary }]}>
                www.bakisena.com
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>
        
        {/* Legal */}
        <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.sectionBlur}>
          <View style={[styles.sectionContainer, { backgroundColor: colors.surface }]}>
            <TouchableOpacity 
              style={[
                styles.legalItem, 
                { borderBottomColor: colors.divider },
                { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
              ]}
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={[
                styles.legalText, 
                { 
                  color: colors.text.primary,
                  textAlign: language === 'ar' ? 'right' : 'left'
                }
              ]}>
                {t('termsOfService')}
              </Text>
              <Ionicons 
                name={language === 'ar' ? "chevron-back" : "chevron-forward"} 
                size={18} 
                color={colors.text.secondary} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.legalItem, 
                { borderBottomWidth: 0 },
                { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
              ]}
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={[
                styles.legalText, 
                { 
                  color: colors.text.primary,
                  textAlign: language === 'ar' ? 'right' : 'left'
                }
              ]}>
                {t('privacyPolicy')}
              </Text>
              <Ionicons 
                name={language === 'ar' ? "chevron-back" : "chevron-forward"} 
                size={18} 
                color={colors.text.secondary} 
              />
            </TouchableOpacity>
          </View>
        </BlurView>
        
        <Text style={[
          styles.copyright, 
          { 
            color: colors.text.secondary,
            textAlign: language === 'ar' ? 'right' : 'left'
          }
        ]}>
          © 2023 Bakisena. {t('allRightsReserved')}
        </Text>
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 20,
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
    textAlign: 'center',
    width: '100%',
  },
});

export default AboutScreen; 