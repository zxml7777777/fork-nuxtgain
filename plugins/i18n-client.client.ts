// 客户端专用的i18n辅助插件
import { replaceTranslationPlaceholders } from '~/utils/i18n-helper'

export default defineNuxtPlugin({
  name: 'i18n-client',
  enforce: 'post', // 在其他插件之后执行
  setup(nuxtApp) {
    // 页面导航完成后替换翻译占位符
    nuxtApp.hook('page:finish', () => {
      // 使用setTimeout确保DOM完全更新后再执行替换
      setTimeout(() => {
        replaceTranslationPlaceholders()
      }, 50)
    })
    
    // 确保第一次加载时也正确替换
    if (process.client) {
      nuxtApp.hook('app:mounted', () => {
        // 确保水合完成后添加标记类
        document.body.classList.add('i18n-loaded')
        // 执行翻译替换
        replaceTranslationPlaceholders()
      })
    }
  }
}) 