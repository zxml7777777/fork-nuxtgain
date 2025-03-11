export default defineNuxtPlugin((nuxtApp) => {
  // 只在客户端执行
  if (process.client) {
    // 使用setTimeout确保在组件挂载后执行
    setTimeout(() => {
      window.console.log('[I18n Debug] Checking i18n configuration...')
      
      try {
        // 使用非类型化的方式访问，避免TypeScript错误
        const i18nData = {
          // @ts-ignore
          locale: nuxtApp.$i18n?.locale?.value,
          // @ts-ignore
          messages: nuxtApp.$i18n?.messages?.value
        }
        
        window.console.log('[I18n Debug] Current locale:', i18nData.locale)
        window.console.log('[I18n Debug] Messages:', i18nData.messages)
      } catch (err) {
        window.console.error('[I18n Debug] Error:', err)
      }
    }, 1000)
  }
  
  return {
    provide: {
      debugI18n: () => {
        if (process.client) {
          try {
            // @ts-ignore
            const i18n = nuxtApp.$i18n
            return {
              // @ts-ignore
              locale: i18n?.locale?.value,
              // @ts-ignore
              messages: i18n?.messages?.value
            }
          } catch (err) {
            console.error('[I18n Debug] Error:', err)
            return null
          }
        }
        return null
      }
    }
  }
}) 