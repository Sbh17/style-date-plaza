import { toast } from 'sonner';

// Supported languages in our application
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

// Simple translations for common phrases
const TRANSLATIONS: Record<string, Record<string, string>> = {
  // English is our base language
  en: {},
  
  // Spanish translations
  es: {
    "Find Your Perfect Salon Experience": "Encuentra tu experiencia perfecta en el salón",
    "Discover, book, and enjoy top-rated salons. Your journey to the perfect style starts here.": 
      "Descubre, reserva y disfruta de salones de primera categoría. Tu viaje hacia el estilo perfecto comienza aquí.",
    "Explore Salons": "Explorar salones",
    "Create Account": "Crear cuenta",
    "Test Environment": "Entorno de prueba",
    "How It Works": "Cómo funciona",
    "Our platform makes it easy to discover and book salon services in just a few steps": 
      "Nuestra plataforma facilita descubrir y reservar servicios de salón en solo unos pasos",
    "Discover": "Descubrir",
    "Browse through our curated list of top-rated salons in your area": 
      "Navega por nuestra lista seleccionada de los mejores salones en tu área",
    "Book": "Reservar",
    "Select your preferred services and schedule an appointment": 
      "Selecciona tus servicios preferidos y programa una cita",
    "Enjoy": "Disfrutar",
    "Experience quality service and share your feedback": 
      "Experimenta un servicio de calidad y comparte tus comentarios",
    "© 2023 Salon Finder. All rights reserved.": "© 2023 Salon Finder. Todos los derechos reservados.",
    "Terms of Service": "Términos de servicio",
    "Privacy": "Privacidad",
    "Settings": "Configuración",
    "Sign In": "Iniciar sesión",
    "My Profile": "Mi perfil"
  },
  
  // French translations
  fr: {
    "Find Your Perfect Salon Experience": "Trouvez votre expérience de salon parfaite",
    "Discover, book, and enjoy top-rated salons. Your journey to the perfect style starts here.": 
      "Découvrez, réservez et profitez des salons les mieux notés. Votre voyage vers le style parfait commence ici.",
    "Explore Salons": "Explorer les salons",
    "Create Account": "Créer un compte",
    "Test Environment": "Environnement de test",
    "How It Works": "Comment ça marche",
    "Our platform makes it easy to discover and book salon services in just a few steps": 
      "Notre plateforme permet de découvrir et de réserver facilement des services de salon en quelques étapes",
    "Discover": "Découvrir",
    "Browse through our curated list of top-rated salons in your area": 
      "Parcourez notre liste organisée des meilleurs salons de votre région",
    "Book": "Réserver",
    "Select your preferred services and schedule an appointment": 
      "Sélectionnez vos services préférés et planifiez un rendez-vous",
    "Enjoy": "Profiter",
    "Experience quality service and share your feedback": 
      "Bénéficiez d'un service de qualité et partagez vos commentaires",
    "© 2023 Salon Finder. All rights reserved.": "© 2023 Salon Finder. Tous droits réservés.",
    "Terms of Service": "Conditions d'utilisation",
    "Privacy": "Confidentialité",
    "Settings": "Paramètres",
    "Sign In": "Se connecter",
    "My Profile": "Mon profil"
  },
  
  // German translations
  de: {
    "Find Your Perfect Salon Experience": "Finden Sie Ihr perfektes Salon-Erlebnis",
    "Discover, book, and enjoy top-rated salons. Your journey to the perfect style starts here.": 
      "Entdecken, buchen und genießen Sie Top-bewertete Salons. Ihre Reise zum perfekten Stil beginnt hier.",
    "Explore Salons": "Salons erkunden",
    "Create Account": "Konto erstellen",
    "Test Environment": "Testumgebung",
    "How It Works": "So funktioniert es",
    "Our platform makes it easy to discover and book salon services in just a few steps": 
      "Unsere Plattform macht es einfach, Salon-Dienstleistungen in nur wenigen Schritten zu entdecken und zu buchen",
    "Discover": "Entdecken",
    "Browse through our curated list of top-rated salons in your area": 
      "Durchsuchen Sie unsere kuratierte Liste der bestbewerteten Salons in Ihrer Nähe",
    "Book": "Buchen",
    "Select your preferred services and schedule an appointment": 
      "Wählen Sie Ihre bevorzugten Dienstleistungen und vereinbaren Sie einen Termin",
    "Enjoy": "Genießen",
    "Experience quality service and share your feedback": 
      "Erleben Sie qualitativ hochwertigen Service und teilen Sie Ihr Feedback",
    "© 2023 Salon Finder. All rights reserved.": "© 2023 Salon Finder. Alle Rechte vorbehalten.",
    "Terms of Service": "Nutzungsbedingungen",
    "Privacy": "Datenschutz",
    "Settings": "Einstellungen",
    "Sign In": "Anmelden",
    "My Profile": "Mein Profil"
  }
};

// For other languages not in our predefined translations, we'll fallback to this simple dictionary
// This allows us to expand the translations over time
const FALLBACK_TRANSLATIONS: Record<string, Record<string, string>> = {
  ja: {
    "Find Your Perfect Salon Experience": "完璧なサロン体験を見つけましょう",
    "Explore Salons": "サロンを探す",
    "Settings": "設定"
  },
  he: {
    "Find Your Perfect Salon Experience": "מצא את חוויית הסלון המושלמת שלך",
    "Explore Salons": "חקור סלונים",
    "Settings": "הגדרות"
  },
  ar: {
    "Find Your Perfect Salon Experience": "اعثر على تجربة الصالون المثالية",
    "Explore Salons": "استكشاف الصالونات",
    "Settings": "إعدادات"
  }
};

/**
 * Translate text using our simple dictionary-based approach
 * @param text The text to translate
 * @param targetLang The target language code
 * @returns The translated text or the original if no translation exists
 */
export const translateText = async (
  text: string,
  targetLang: string
): Promise<string> => {
  if (!text || !text.trim()) return '';
  
  // Return original text for English
  if (targetLang === 'en') return text;
  
  try {
    console.log(`Translating to ${targetLang}: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`);
    
    // Look up in our translation dictionary
    const translations = TRANSLATIONS[targetLang] || FALLBACK_TRANSLATIONS[targetLang] || {};
    
    // If we have a direct translation for this text, use it
    if (translations[text]) {
      return translations[text];
    }
    
    // Otherwise return the original text
    return text;
  } catch (error: any) {
    console.error('Translation error:', error);
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
