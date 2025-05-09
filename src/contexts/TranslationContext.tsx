
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { SupportedLanguage, getLanguageDirection, SUPPORTED_LANGUAGES } from '@/utils/translationUtils';

interface TranslationContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  direction: 'ltr' | 'rtl';
  languageCode: string;
  translateApiKey: string;
  setTranslateApiKey: (key: string) => void;
}

const TranslationContext = createContext<TranslationContextType>({
  language: 'english',
  setLanguage: () => {},
  direction: 'ltr',
  languageCode: 'en',
  translateApiKey: '',
  setTranslateApiKey: () => {},
});

export const useTranslation = () => useContext(TranslationContext);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('english');
  const [translateApiKey, setTranslateApiKey] = useState<string>('');
  const { user } = useAuth();
  
  // Direction based on language
  const direction = getLanguageDirection(language);
  const languageCode = SUPPORTED_LANGUAGES[language]?.code || 'en';

  // Load user's language preference and translate API key
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('preferred_language, translate_api_key')
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          if (error.code !== 'PGRST116') { // No settings found
            console.error('Error fetching language settings:', error);
          }
          return;
        }
        
        if (data) {
          if (data.preferred_language && Object.keys(SUPPORTED_LANGUAGES).includes(data.preferred_language)) {
            setLanguageState(data.preferred_language as SupportedLanguage);
          }
          
          if (data.translate_api_key) {
            setTranslateApiKey(data.translate_api_key);
          }
        }
      } catch (err) {
        console.error('Exception in fetching language settings:', err);
      }
    };
    
    fetchUserSettings();
  }, [user]);

  // Update document direction when language changes
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = languageCode;
  }, [direction, languageCode]);

  const setLanguage = async (newLanguage: SupportedLanguage) => {
    setLanguageState(newLanguage);
    
    // Save language preference if user is logged in
    if (user?.id) {
      try {
        await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            preferred_language: newLanguage,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });
      } catch (error) {
        console.error('Error saving language preference:', error);
      }
    }
  };

  return (
    <TranslationContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        direction, 
        languageCode,
        translateApiKey,
        setTranslateApiKey
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};
