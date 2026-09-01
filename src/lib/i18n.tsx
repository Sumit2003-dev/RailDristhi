import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { translations } from "@/data/translations";

export type Language = "en" | "hi" | "bn" | "te" | "ta" | "mr" | "gu" | "kn";

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  script: string;
  badge: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: "en", name: "English", nativeName: "English", script: "Latin", badge: "EN" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", script: "Devanagari", badge: "हि" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", script: "Bengali", badge: "বা" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", script: "Telugu", badge: "తె" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", script: "Tamil", badge: "த" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", script: "Devanagari", badge: "म" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", script: "Gujarati", badge: "ગુ" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", script: "Kannada", badge: "ಕ" },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  currentLanguageInfo: LanguageInfo;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "rail_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const currentLanguageInfo = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === language) ?? SUPPORTED_LANGUAGES[0]!;
  }, [language]);

  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split(".");

    // Helper to traverse translation dictionary
    const getVal = (dict: Record<string, unknown>): string | undefined => {
      let current: unknown = dict;
      for (const k of keys) {
        if (current === undefined || current === null || typeof current !== "object")
          return undefined;
        current = (current as Record<string, unknown>)[k];
      }
      return typeof current === "string" ? current : undefined;
    };

    // Try target language, fallback to English
    const dicts = translations as Record<string, Record<string, unknown>>;
    const currentDict = dicts[language] || dicts.en;
    let str = getVal(currentDict) ?? getVal(dicts.en) ?? path;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      });
    }

    return str;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLanguageInfo }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function useTranslation() {
  const { t, language, setLanguage, currentLanguageInfo } = useLanguage();
  return { t, language, setLanguage, currentLanguageInfo };
}
