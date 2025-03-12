<template>
  <div class="p-4 border rounded-lg bg-gray-50 my-8">
    <h2 class="text-xl font-bold mb-2">I18n 加载状态测试</h2>
    
    <!-- 加载状态显示 -->
    <div class="bg-white p-4 rounded shadow mb-4">
      <h3 class="font-bold mb-2">加载状态：</h3>
      <div class="space-y-2">
        <div class="flex items-center">
          <span class="mr-2">i18nReady:</span>
          <span :class="i18nReady ? 'text-green-600' : 'text-red-600'">
            {{ i18nReady ? '已加载' : '加载中' }}
          </span>
        </div>
        <div class="flex items-center">
          <span class="mr-2">当前语言:</span>
          <span class="font-mono">{{ locale }}</span>
        </div>
      </div>
    </div>

    <!-- 命名空间加载测试 -->
    <div class="bg-white p-4 rounded shadow mb-4">
      <h3 class="font-bold mb-2">命名空间加载测试：</h3>
      <div class="grid grid-cols-2 gap-4">
        <div v-for="namespace in availableNamespaces" :key="namespace" 
             class="p-2 border rounded">
          <h4 class="font-bold">{{ namespace }}:</h4>
          <div class="text-sm">
            <div class="text-gray-600">
              加载状态: {{ isNamespaceLoaded(namespace) ? '✅' : '❌' }}
            </div>
            <div class="mt-1">
              示例翻译: {{ getTestTranslation(namespace) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 手动重新加载 -->
    <div class="bg-white p-4 rounded shadow">
      <h3 class="font-bold mb-2">手动操作：</h3>
      <div class="space-x-4">
        <button @click="reloadAllNamespaces" 
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          重新加载所有命名空间
        </button>
        <button @click="switchLanguage" 
                class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          切换语言
        </button>
      </div>
    </div>

    <!-- 调试信息 -->
    <div class="mt-4 bg-white p-4 rounded shadow">
      <h3 class="font-bold mb-2">调试信息：</h3>
      <pre class="bg-gray-100 p-2 text-xs overflow-auto max-h-40">{{ debugInfo }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useState, useNuxtApp } from '#app'

const { t, locale, messages } = useI18n()
const nuxtApp = useNuxtApp()
const i18nReady = useState('i18n-ready')

// 可用的命名空间列表
const availableNamespaces = [
  'common',
  'landing',
  'auth',
  'dashboard',
  'blog',
  'priceTrust'
]

// 检查命名空间是否已加载
const isNamespaceLoaded = (namespace) => {
  return messages.value?.[locale.value]?.[namespace] !== undefined
}

// 获取测试翻译
const getTestTranslation = (namespace) => {
  try {
    // 根据不同命名空间获取一个测试key
    const testKeys = {
      common: 'common.loading',
      landing: 'landing.heroTitle1',
      auth: 'auth.signIn',
      dashboard: 'dashboard.welcome',
      blog: 'blog.title',
      priceTrust: 'priceTrust.title'
    }
    return t(`${namespace}.${testKeys[namespace]}`)
  } catch (e) {
    return '翻译不可用'
  }
}

// 重新加载所有命名空间
const reloadAllNamespaces = async () => {
  i18nReady.value = false
  try {
    await nuxtApp.$loadAllNamespaces(locale.value)
  } catch (e) {
    console.error('重新加载失败:', e)
  }
}

// 切换语言
const switchLanguage = () => {
  const languages = ['en', 'zh', 'ua']
  const currentIndex = languages.indexOf(locale.value)
  const nextIndex = (currentIndex + 1) % languages.length
  locale.value = languages[nextIndex]
}

// 调试信息
const debugInfo = computed(() => {
  return {
    i18nReady: i18nReady.value,
    currentLocale: locale.value,
    loadedNamespaces: availableNamespaces.filter(ns => isNamespaceLoaded(ns)),
    messageKeys: Object.keys(messages.value?.[locale.value] || {})
  }
})

// 监听组件加载
onMounted(() => {
  console.log('I18nTest component mounted')
  console.log('i18nReady:', i18nReady.value)
  console.log('Current locale:', locale.value)
  console.log('Loaded namespaces:', availableNamespaces.filter(ns => isNamespaceLoaded(ns)))
})
</script> 