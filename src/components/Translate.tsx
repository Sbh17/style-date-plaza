
import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { translateText } from '@/utils/translationUtils';

interface TranslateProps {
  text: string;
  children?: never;
}

interface TranslateChildrenProps {
  children: React.ReactNode;
  text?: never;
}

type Props = TranslateProps | TranslateChildrenProps;

/**
 * Component to translate text or children content
 */
const Translate: React.FC<Props> = (props) => {
  const { language, translateApiKey, languageCode } = useTranslation();
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get the text to translate (either from props.text or by rendering children to string)
  const textToTranslate = 'text' in props 
    ? props.text 
    : React.isValidElement(props.children) 
      ? String(props.children)
      : typeof props.children === 'string'
        ? props.children
        : Array.isArray(props.children)
          ? React.Children.toArray(props.children)
              .map(child => typeof child === 'string' ? child : '')
              .join(' ')
          : String(props.children || '');

  useEffect(() => {
    // Skip translation if we're in English or no text to translate
    if (languageCode === 'en' || !textToTranslate) {
      setTranslatedText(textToTranslate);
      return;
    }
    
    const translate = async () => {
      setIsLoading(true);
      try {
        console.log('Translating:', textToTranslate, 'to', languageCode);
        const result = await translateText(
          textToTranslate,
          languageCode,
          translateApiKey
        );
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
  }, [textToTranslate, language, translateApiKey, languageCode]);

  // Return original text if translation is loading or not ready
  if (translatedText === null || isLoading || languageCode === 'en') {
    return 'text' in props ? <>{props.text}</> : <>{props.children}</>;
  }

  return <>{translatedText}</>;
};

export default Translate;
