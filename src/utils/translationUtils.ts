
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
    toast.warning('No translation API key set. Using mock translation.');
    // Return a more visible mock translation for debugging
    return `[MOCK_${targetLang}] ${text}`;
  }
  
  try {
    // Check if we're translating to English, which is our default
    if (targetLang === 'en') {
      return text;
    }
    
    console.log(`Translating to ${targetLang}: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`);
    
    // Format request payload according to Google Translate API specifications
    const payload = {
      q: text,
      target: targetLang,
      key: apiKey
    };
    
    // Make the API request
    const response = await fetch(GOOGLE_TRANSLATE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Translation API error:', errorData);
      toast.error(`Translation failed: ${errorData.error?.message || response.statusText}`);
      throw new Error(errorData.error?.message || `Translation failed with status ${response.status}`);
    }
    
    const data = await response.json() as GoogleTranslateResponse;
    
    if (!data.data?.translations?.[0]?.translatedText) {
      console.error('Unexpected translation response format:', data);
      toast.error('Invalid translation response format');
      throw new Error('Invalid translation response format');
    }
    
    console.log(`Translation successful for "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`);
    return data.data.translations[0].translatedText;
  } catch (error: any) {
    console.error('Translation error:', error);
    toast.error(`Translation error: ${error.message || 'Unknown error'}`);
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
 * Get the language code for a given language
 */
export const getLanguageCode = (language: SupportedLanguage): string => {
  return SUPPORTED_LANGUAGES[language]?.code || 'en';
};
