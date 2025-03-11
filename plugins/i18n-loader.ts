import { defineNuxtPlugin, useState } from '#app'

// 创建一个插件来处理i18n的加载状态
export default defineNuxtPlugin((nuxtApp) => {
  // 创建一个全局状态来跟踪i18n是否已加载
  const i18nReady = useState('i18n-ready', () => false)
  
  nuxtApp.hook('app:mounted', () => {
    // 等待一小段时间以确保i18n已经初始化
    setTimeout(() => {
      i18nReady.value = true
      console.log('[i18n-loader] i18n加载完成')
    }, 100)
  })
  
  // 提供一个全局函数来检查i18n是否准备就绪
  return {
    provide: {
      i18nReady: () => i18nReady.value
    }
  }
}) 