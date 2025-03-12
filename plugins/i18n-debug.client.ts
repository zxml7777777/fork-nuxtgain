export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      getCurrentLocale: () => {
        if (process.client) {
          try {
            // @ts-ignore
            return nuxtApp.$i18n?.locale?.value
          } catch (err) {
            console.error('[I18n] Error getting locale:', err)
            return null
          }
        }
        return null
      }
    }
  }
}) 