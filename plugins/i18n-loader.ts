import { defineNuxtPlugin, useState } from '#app'

// 创建一个插件来处理i18n的加载状态
export default defineNuxtPlugin((nuxtApp) => {
  // 从i18n-namespace-loader中获取并使用相同的全局状态
  const i18nReady = useState('i18n-ready')
  
  // 仅在i18n-namespace-loader尚未加载时进行处理
  if (i18nReady.value === undefined || i18nReady.value === null) {
    // 默认设置为未加载
    i18nReady.value = false
    
    // 延迟一小段时间，如果i18n-namespace-loader没有处理，则设置为已加载
    setTimeout(() => {
      if (!i18nReady.value) {
        console.log('[i18n-loader] 未检测到i18n-namespace-loader的加载状态更新，设置为已加载')
        i18nReady.value = true
      }
    }, 1000)
  }
  
  // 不再提供i18nReady函数，避免与i18n-namespace-loader冲突
  // 由于i18n-namespace-loader.client.ts已经提供了这个函数，这里不再重复提供
}) 