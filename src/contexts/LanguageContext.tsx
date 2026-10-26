import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { LANGUAGES, getSiteContent, getTranslation, resolveLanguage, type Language, type SiteContent, } from "../lib/i18n";
interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  copy: SiteContent;
  t: <T = string>(key: string) => T;
}
interface LanguageProviderProps {
  children: ReactNode;
}
const STORAGE_KEY = "portfolio-language";
const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);
export function LanguageProvider({ children }: LanguageProviderProps) {
  // Match the Spanish server render before applying a browser preference.
  const [language, setLanguage] = useState<Language>(LANGUAGES.ES);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  useEffect(() => {
    let saved: unknown = null;
    try {
      saved = window.localStorage.getItem(STORAGE_KEY);
    }
    catch {
      // Private browsing and restrictive environments may block storage.
    }
    setLanguage(resolveLanguage(saved, window.navigator.language));
    setPreferencesLoaded(true);
  }, []);
  const copy = getSiteContent(language);
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = copy.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", copy.meta.description);
    if (!preferencesLoaded)
      return;
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    }
    catch {
      // A storage failure must never prevent switching languages.
    }
  }, [language, copy.meta.title, copy.meta.description, preferencesLoaded]);
  const t = <T = string,>(key: string): T => getTranslation<T>(language, key);
  return (<LanguageContext.Provider value={{ language, setLanguage, copy, t }}>
    {children}
  </LanguageContext.Provider>);
}
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (context === undefined)
    throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
