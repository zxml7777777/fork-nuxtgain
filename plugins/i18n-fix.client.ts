/**
 * 这个插件用于在客户端修复i18n加载的问题
 * 它会检查翻译是否正确加载，如果没有则尝试手动加载
 */
import en from '~/i18n/en'
import ua from '~/i18n/ua'
import zh from '~/i18n/zh'

export default defineNuxtPlugin((nuxtApp) => {
  if (!process.client) return
  
  // 延迟执行以确保i18n已经初始化
  setTimeout(() => {
    try {
      // 使用any类型避免类型错误
      const i18n = nuxtApp.$i18n as any
      
      if (!i18n) {
        console.warn('[i18n-fix] i18n未找到')
        return
      }
      
      // 检查当前locale的翻译是否存在
      const currentLocale = i18n.locale?.value
      const messages = i18n.messages?.value
      
      console.log('[i18n-fix] 当前语言:', currentLocale)
      console.log('[i18n-fix] 消息对象:', messages)
      
      // 检查landing命名空间是否存在
      if (messages && currentLocale && messages[currentLocale]) {
        const localeMessages = messages[currentLocale]
        console.log('[i18n-fix] 当前语言消息对象的键:', Object.keys(localeMessages))
        
        // 如果landing命名空间不存在，尝试手动注入
        if (!localeMessages.landing) {
          console.warn('[i18n-fix] landing命名空间不存在，尝试手动添加')
          
          // 根据当前语言选择对应的翻译
          let translations = null
          if (currentLocale === 'en') translations = en
          else if (currentLocale === 'ua') translations = ua
          else if (currentLocale === 'zh') translations = zh
          
          if (translations && translations.landing) {
            console.log('[i18n-fix] 手动添加landing命名空间:', translations.landing)
            
            try {
              // 手动设置消息 - 使用try/catch捕获可能的错误
              if (typeof i18n.setLocaleMessage === 'function') {
                i18n.setLocaleMessage(currentLocale, {
                  ...(messages[currentLocale] || {}),
                  landing: translations.landing
                })
                
                // 刷新页面以应用新的翻译
                setTimeout(() => {
                  console.log('[i18n-fix] 尝试强制刷新i18n')
                  if (i18n.locale && i18n.locale.value) {
                    i18n.locale.value = i18n.locale.value
                  }
                }, 100)
              } else {
                console.warn('[i18n-fix] setLocaleMessage方法不存在')
              }
            } catch (e) {
              console.error('[i18n-fix] 设置消息时出错:', e)
            }
          }
        }
      }
    } catch (err) {
      console.error('[i18n-fix] 错误:', err)
    }
  }, 500)
}) 