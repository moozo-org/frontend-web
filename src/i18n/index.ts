import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en'
import fr from './locales/fr'
import { getStored, setStored } from '../utils'

export const languages = ['fr', 'en'] as const

i18n.on('languageChanged', () => {
  const lang = i18n.resolvedLanguage ?? 'fr'
  setStored('lang', lang)
  document.documentElement.lang = lang
})

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng:
    getStored('lang') ??
    navigator.languages
      .map((l) => l.slice(0, 2))
      .find((l) => (languages as readonly string[]).includes(l)),
  fallbackLng: 'fr',
  supportedLngs: languages,
  interpolation: { escapeValue: false },
})

export default i18n
