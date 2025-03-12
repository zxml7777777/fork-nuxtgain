// @ts-ignore - 忽略模块未找到的TypeScript错误
import getMessages from './index'

export default defineI18nConfig(() => {
  const messages = getMessages()
  
  // 控制台输出信息，用于调试
  if (process.client) {
    console.log('[i18n] 初始化配置：', {
      availableMessages: Object.keys(messages),
      enSample: messages.en ? {
        keys: Object.keys(messages.en),
        hasLanding: messages.en.landing !== undefined,
        landingKeys: messages.en.landing ? Object.keys(messages.en.landing) : []
      } : undefined
    })
  }
  
  // 优化路径语言检测逻辑 
  const detectLocaleFromPath = (path: string) => {
    // 使用正则表达式检测路径语言
    // 匹配 /zh/ 或 /zh 开头的路径（确保整个路径元素匹配）
    if (/^\/(zh)(\/|$)/.test(path)) return 'zh'
    // 匹配 /ua/ 或 /ua 开头的路径
    if (/^\/(ua)(\/|$)/.test(path)) return 'ua'
    // 默认返回英文
    return 'en'
  }
  
  const currentPath = process.server ? useRoute().path : window.location.pathname
  const detectedLocale = detectLocaleFromPath(currentPath)
  
  // 调试输出当前检测到的语言
  if (process.client) {
    console.log(`[i18n] 从路径 "${currentPath}" 检测到语言: ${detectedLocale}`)
  }
  
  return {
    legacy: false,
    locale: detectedLocale, // 根据路径检测语言，使客户端和服务端保持一致
    fallbackLocale: 'en',   // 设置英语为回退语言
    messages,
    missingWarn: false,     // 禁用缺少翻译时的警告，避免控制台错误
    fallbackWarn: false,    // 禁用使用回退值时的警告，避免控制台错误
    silentTranslationWarn: true, // 隐藏翻译警告
    // 确保在客户端和服务端使用相同的区域设置策略
    sync: true,             // 保持客户端和服务端同步
    compositionOnly: true,  // 只使用Composition API，提高一致性
    datetimeFormats: {
      'en': {
        short: {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        },
        long: {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          hour: 'numeric',
          minute: 'numeric'
        }
      },
      'ua': {
        short: {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        },
        long: {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          hour: 'numeric',
          minute: 'numeric'
        }
      },
      'zh': {
        short: {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        },
        long: {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          hour: 'numeric',
          minute: 'numeric'
        }
      }
    },
    numberFormats: {
      'en': {
        currency: {
          style: 'currency',
          currency: 'USD'
        },
        decimal: {
          style: 'decimal',
          minimumFractionDigits: 2
        },
        percent: {
          style: 'percent',
          useGrouping: false
        }
      },
      'ua': {
        currency: {
          style: 'currency',
          currency: 'UAH'
        },
        decimal: {
          style: 'decimal',
          minimumFractionDigits: 2
        },
        percent: {
          style: 'percent',
          useGrouping: false
        }
      },
      'zh': {
        currency: {
          style: 'currency',
          currency: 'CNY'
        },
        decimal: {
          style: 'decimal',
          minimumFractionDigits: 2
        },
        percent: {
          style: 'percent',
          useGrouping: false
        }
      }
    }
  }
})