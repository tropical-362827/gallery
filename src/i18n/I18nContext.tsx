import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  detectLocale,
  MESSAGES,
  type Locale,
  type LocalePreference,
  type Messages,
} from './config';

interface I18nContextValue {
  locale: Locale;
  localePreference: LocalePreference;
  setLocalePreference: (nextLocalePreference: LocalePreference) => void;
  messages: Messages;
}

const I18nContext = createContext<I18nContextValue | null>(null);
const LOCALE_PREFERENCE_STORAGE_KEY = 'gallery-locale-preference';

interface I18nProviderProps {
  children: ReactNode;
}

function getStoredLocalePreference(): LocalePreference {
  if (typeof window === 'undefined') {
    return 'auto';
  }

  const storedValue = window.localStorage.getItem(LOCALE_PREFERENCE_STORAGE_KEY);
  if (storedValue === 'ja' || storedValue === 'en') {
    return storedValue;
  }

  return 'auto';
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [browserLocale, setBrowserLocale] = useState<Locale>(() => detectLocale());
  const [localePreference, setLocalePreference] = useState<LocalePreference>(() => getStoredLocalePreference());
  const locale = localePreference === 'auto' ? browserLocale : localePreference;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleLanguageChange = () => {
      setBrowserLocale(detectLocale());
    };

    window.addEventListener('languagechange', handleLanguageChange);

    return () => {
      window.removeEventListener('languagechange', handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (localePreference === 'auto') {
      window.localStorage.removeItem(LOCALE_PREFERENCE_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(LOCALE_PREFERENCE_STORAGE_KEY, localePreference);
  }, [localePreference]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      localePreference,
      setLocalePreference,
      messages: MESSAGES[locale],
    }),
    [locale, localePreference],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }

  return context;
}
