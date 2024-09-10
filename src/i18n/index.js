import { createI18n } from 'vue-i18n'
import { messages } from './translations'

const savedLocale = localStorage.getItem('userLocale') || navigator.language.split('-')[0]
const supportedLocales = ['en', 'zh']
const locale = supportedLocales.includes(savedLocale) ? savedLocale : 'en'

export const i18n = createI18n({
  legacy: false,
  locale: locale,
  fallbackLocale: 'en',
  messages,
})