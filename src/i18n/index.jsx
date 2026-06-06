import React, { createContext, useContext, useEffect, useState } from "react";
import en from "./en.json";
import am from "./am.json";
import om from "./om.json";

const LOCALE_KEY = "zu-burger-locale";

const locales = { en, am, om };

const I18nContext = createContext({
  locale: "en",
  setLocale: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    try {
      return localStorage.getItem(LOCALE_KEY) || "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCALE_KEY, locale);
    } catch {}
  }, [locale]);

  const t = (key) => {
    const parts = String(key).split(".");
    const data = locales[locale] || locales.en;
    let cur = data;
    for (const p of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, p)) cur = cur[p];
      else return key;
    }
    return typeof cur === "string" ? cur : key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}

export default LanguageProvider;
