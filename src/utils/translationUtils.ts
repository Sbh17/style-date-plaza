
import { toast } from 'sonner';

// Default Google Translate API URL
const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

/**
 * Languages supported by our application
 */
export const SUPPORTED_LANGUAGES = {
  english: { name: 'English', code: 'en', direction: 'ltr' },
  spanish: { name: 'Spanish', code: 'es', direction: 'ltr' },
  french: { name: 'French', code: 'fr', direction: 'ltr' },
  german: { name: 'German', code: 'de', direction: 'ltr' },
  japanese: { name: 'Japanese', code: 'ja', direction: 'ltr' },
  hebrew: { name: 'Hebrew', code: 'he', direction: 'rtl' },
  arabic: { name: 'Arabic', code: 'ar', direction: 'rtl' },
};

// Type for the language configuration
export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

/**
 * Interface for translation response from Google Translate API
 */
interface GoogleTranslateResponse {
  data: {
    translations: {
      translatedText: string;
      detectedSourceLanguage?: string;
    }[];
  };
}

/**
 * Translate text using Google Translate API
 * @param text The text to translate
 * @param targetLang The target language code
 * @param apiKey The Google Translate API key
 * @returns Promise with the translated text
 */
export const translateText = async (
  text: string,
  targetLang: string,
  apiKey?: string
): Promise<string> => {
  if (!text) return '';
  
  // Check if API key is provided
  if (!apiKey) {
    console.warn('No Google Translate API key provided. Using mock translation.');
    // Return mock translation for development
    return `[${targetLang}] ${text}`;
  }
  
  try {
    // Check if we're translating to English, which is our default
    if (targetLang === 'en') {
      return text;
    }
    
    // Prepare request to Google Translate API
    const url = new URL(GOOGLE_TRANSLATE_API_URL);
    url.searchParams.append('key', apiKey);
    url.searchParams.append('q', text);
    url.searchParams.append('target', targetLang);
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Translation failed');
    }
    
    const data = await response.json() as GoogleTranslateResponse;
    return data.data.translations[0].translatedText;
  } catch (error: any) {
    console.error('Translation error:', error);
    toast.error(`Translation error: ${error.message}`);
    return text; // Return original text on error
  }
};

/**
 * Get the direction (ltr or rtl) for a given language
 */
export const getLanguageDirection = (language: SupportedLanguage): 'ltr' | 'rtl' => {
  return SUPPORTED_LANGUAGES[language]?.direction as 'ltr' | 'rtl' || 'ltr';
};

/**
 * Get the language code for a given language name
 */
export const getLanguageCode = (language: SupportedLanguage): string => {
  return SUPPORTED_LANGUAGES[language]?.code || 'en';
};
