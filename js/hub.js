import { createTranslator } from "./i18n.js";
import { translations } from "./translations.js";

const { onLanguageChange, toggleLanguage, initializeLanguage } = createTranslator(translations);
const languageButton = document.getElementById("toggle-language");

onLanguageChange((language) => {
  languageButton.lang = language === "en" ? "ar" : "en";
});
languageButton.addEventListener("click", toggleLanguage);
initializeLanguage();
