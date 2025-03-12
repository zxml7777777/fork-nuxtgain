/**
 * 这个插件用于在客户端修复i18n加载的问题
 * 它会检查翻译是否正确加载，如果没有则尝试手动加载
 */
import en from '~/i18n/en'
import ua from '~/i18n/ua'
import zh from '~/i18n/zh'

// 定义翻译对象的类型
type TranslationObject = {
  [key: string]: any;
}

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
      
      // 检查各命名空间是否存在
      if (messages && currentLocale && messages[currentLocale]) {
        const localeMessages = messages[currentLocale] as TranslationObject
        console.log('[i18n-fix] 当前语言消息对象的键:', Object.keys(localeMessages))
        
        // 选择对应的完整翻译对象
        let translations: TranslationObject | null = null
        if (currentLocale === 'en') translations = en as TranslationObject
        else if (currentLocale === 'ua') translations = ua as TranslationObject
        else if (currentLocale === 'zh') translations = zh as TranslationObject
        
        if (translations) {
          // 检查每个命名空间是否存在，不存在则添加
          const namespaces = ['common', 'landing', 'auth', 'dashboard']
          let needsUpdate = false
          
          const updatedMessages: TranslationObject = { ...localeMessages }
          
          // 专门检查dashboard命名空间
          console.log('[i18n-fix] 检查dashboard命名空间:', {
            inLocaleMessages: Boolean(localeMessages['dashboard']),
            inTranslations: Boolean(translations['dashboard']),
            dashboardContent: translations['dashboard']
          })

          // 确保无论如何都添加dashboard命名空间
          if (translations['dashboard']) {
            console.log('[i18n-fix] 强制添加dashboard命名空间')
            updatedMessages['dashboard'] = translations['dashboard']
            needsUpdate = true
            
            // 如果setLocaleMessage存在，立即添加dashboard命名空间
            if (typeof i18n.setLocaleMessage === 'function') {
              console.log('[i18n-fix] 立即添加dashboard命名空间到i18n')
              // 尝试直接单独设置dashboard命名空间
              try {
                i18n.mergeLocaleMessage(currentLocale, { dashboard: translations['dashboard'] })
                console.log('[i18n-fix] 通过mergeLocaleMessage添加dashboard命名空间成功')
              } catch (e) {
                console.warn('[i18n-fix] mergeLocaleMessage失败，尝试其他方法:', e)
                try {
                  const currentMessages = { ...messages[currentLocale] }
                  currentMessages.dashboard = translations['dashboard']
                  i18n.setLocaleMessage(currentLocale, currentMessages)
                  console.log('[i18n-fix] 通过setLocaleMessage添加dashboard命名空间成功')
                } catch (e2) {
                  console.error('[i18n-fix] 添加dashboard命名空间失败:', e2)
                }
              }
            }
          }
          
          namespaces.forEach(namespace => {
            if (!localeMessages[namespace] && translations && translations[namespace]) {
              console.log(`[i18n-fix] ${namespace}命名空间不存在，添加中...`)
              updatedMessages[namespace] = translations[namespace]
              needsUpdate = true
            }
          })
          
          // 如果需要更新，则设置新的消息
          if (needsUpdate && typeof i18n.setLocaleMessage === 'function') {
            console.log('[i18n-fix] 更新翻译消息:', updatedMessages)
            i18n.setLocaleMessage(currentLocale, updatedMessages)
            
            // 修复原始的t函数，确保它总是返回翻译内容而不是键
            const originalT = i18n.t
            if (originalT && !i18n._fixedT) {
              i18n._fixedT = true  // 标记已修复，避免重复修复
              i18n.t = function(...args: any[]) {
                const key = args[0]
                const result = originalT.apply(i18n, args)
                
                // 如果返回值与键相同，说明可能没有找到翻译
                if (result === key && typeof key === 'string' && translations) {
                  console.warn(`[i18n-fix] 未找到翻译键: ${key}，尝试从完整翻译中查找`)
                  
                  // 尝试从完整翻译中查找
                  const keyParts = key.split('.')
                  if (keyParts.length === 2) {
                    const namespace = keyParts[0]
                    const subKey = keyParts[1]
                    
                    // 检查命名空间和键是否存在
                    if (namespace && namespace in translations) {
                      const namespaceObj = translations[namespace]
                      if (namespaceObj && typeof namespaceObj === 'object' && 
                          subKey && subKey in namespaceObj) {
                        console.log(`[i18n-fix] 从备用翻译中找到键: ${key}`)
                        return namespaceObj[subKey]
                      }
                    }
                  }
                }
                
                return result
              }
            }
            
            // 刷新页面以应用新的翻译
            setTimeout(() => {
              console.log('[i18n-fix] 尝试强制刷新i18n')
              if (i18n.locale && i18n.locale.value) {
                const currentValue = i18n.locale.value
                i18n.locale.value = ''  // 先设置为空，确保触发更新
                setTimeout(() => {
                  i18n.locale.value = currentValue
                  console.log('[i18n-fix] 强制刷新完成，当前消息:', i18n.messages.value[currentValue])
                }, 10)
              }
            }, 100)
          }
        }
      }
    } catch (err) {
      console.error('[i18n-fix] 错误:', err)
    }
  }, 100) // 减少延迟时间，确保更快加载
}) 