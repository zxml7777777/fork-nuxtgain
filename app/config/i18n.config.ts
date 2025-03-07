export default {
  defaultLocale: 'en',
  availableLocales: ['en', 'ua', 'zh'],
  fallbackLocale: 'en',
  strategy: 'prefix_except_default',
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'i18n_redirected',
    redirectOn: 'root',
  },
  locales: [
    {
      code: 'en',
      name: 'English',
      iso: 'en-US',
      file: 'en'
    },
    {
      code: 'zh',
      name: '中文',
      iso: 'zh-CN',
      file: 'zh'
    },
    {
      code: 'ua',
      name: 'Українська',
      iso: 'uk-UA',
      file: 'ua'
    }
  ],
  lazy: true,
  langDir: '~/app/i18n/'
} 