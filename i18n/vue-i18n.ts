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
  
  return {
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages,
    missingWarn: true, // 启用缺少翻译时的警告
    fallbackWarn: true, // 启用使用回退值时的警告
    silentTranslationWarn: false, // 不要隐藏翻译警告
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