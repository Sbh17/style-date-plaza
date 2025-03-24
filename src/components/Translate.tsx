
import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { translateText } from '@/utils/translationUtils';

interface TranslateProps {
  text?: string;
  children?: React.ReactNode;
}

/**
 * Component to translate text or children content
 */
const Translate: React.FC<TranslateProps> = ({ text, children }) => {
  const { language, languageCode } = useTranslation();
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get the text to translate (either from props.text or by rendering children to string)
  const textToTranslate = text ?? (
    typeof children === 'string' ? children :
    React.isValidElement(children) ? String(children.props.children || '') :
    Array.isArray(children) ? React.Children.toArray(children)
        .map(child => typeof child === 'string' ? child : '')
        .join(' ') :
    String(children || '')
  );

  useEffect(() => {
    if (!textToTranslate || textToTranslate.trim() === '') {
      setTranslatedText('');
      return;
    }
    
    // Skip translation if we're in English
    if (languageCode === 'en') {
      setTranslatedText(textToTranslate);
      return;
    }
    
    const translate = async () => {
      setIsLoading(true);
      try {
        console.log('Translating:', textToTranslate, 'to', languageCode);
        
        const result = await translateText(textToTranslate, languageCode);
        
        console.log('Translation result:', result);
        setTranslatedText(result);
      } catch (error) {
        console.error('Translation error:', error);
        // Fallback to original text on error
        setTranslatedText(textToTranslate);
      } finally {
        setIsLoading(false);
      }
    };
    
    translate();
  }, [textToTranslate, language, languageCode]);

  // Show loading indicator or original text while translating
  if (isLoading) {
    return <span className="opacity-70">{textToTranslate}</span>;
  }
  
  // Return translated text if available, otherwise original content
  if (translatedText !== null) {
    return <>{translatedText}</>;
  }
  
  // Fallback to original content
  return <>{text || children}</>;
};

export default Translate;
