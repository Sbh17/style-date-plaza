
import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { translateText, getLanguageCode } from '@/utils/translationUtils';

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
  
  // Get the text to translate (either from props.text or by rendering children to string)
  const textToTranslate = 'text' in props 
    ? props.text 
    : React.isValidElement(props.children) 
      ? React.Children.toArray(props.children).map(child => 
          typeof child === 'string' ? child : ''
        ).join('')
      : String(props.children || '');

  useEffect(() => {
    // Skip translation if we're in English or no text to translate
    if (languageCode === 'en' || !textToTranslate) {
      setTranslatedText(textToTranslate);
      return;
    }
    
    const translate = async () => {
      const result = await translateText(
        textToTranslate,
        languageCode,
        translateApiKey
      );
      setTranslatedText(result);
    };
    
    translate();
  }, [textToTranslate, language, translateApiKey, languageCode]);

  // If no translation yet, or language is English, show original
  if (translatedText === null || languageCode === 'en') {
    return 'text' in props ? <>{props.text}</> : <>{props.children}</>;
  }

  return <>{translatedText}</>;
};

export default Translate;
