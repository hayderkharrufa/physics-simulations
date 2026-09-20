const STORAGE_KEY = "language";
const TEXT_DIRECTIONS = { en: "ltr", ar: "rtl" };

export function createTranslator(translations) {
  let currentLanguage = "en";
  const languageChangeListeners = [];

  function translate(key, params = {}) {
    const template = translations[currentLanguage][key] ?? translations.en[key];
    return template.replace(/\{(\w+)\}/g, (placeholder, name) => params[name] ?? placeholder);
  }

  function onLanguageChange(listener) {
    languageChangeListeners.push(listener);
  }

  function applyTranslations() {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = TEXT_DIRECTIONS[currentLanguage];
    document.title = translate("page.title");
    for (const element of document.querySelectorAll("[data-i18n]")) {
      element.textContent = translate(element.dataset.i18n);
    }
    for (const element of document.querySelectorAll("[data-i18n-aria-label]")) {
      element.setAttribute("aria-label", translate(element.dataset.i18nAriaLabel));
    }
    for (const listener of languageChangeListeners) listener(currentLanguage);
  }

  function readSavedLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function saveLanguage(language) {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {}
  }

  function setLanguage(language) {
    currentLanguage = language in translations ? language : "en";
    saveLanguage(currentLanguage);
    applyTranslations();
  }

  function toggleLanguage() {
    setLanguage(currentLanguage === "en" ? "ar" : "en");
  }

  function initializeLanguage() {
    const savedLanguage = readSavedLanguage();
    currentLanguage = savedLanguage in translations ? savedLanguage : "en";
    applyTranslations();
  }

  return { translate, onLanguageChange, setLanguage, toggleLanguage, initializeLanguage };
}
