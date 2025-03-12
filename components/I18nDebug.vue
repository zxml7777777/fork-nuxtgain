<template>
  <div class="container mx-auto p-6 bg-gray-100 rounded-lg">
    <h2 class="text-xl font-bold mb-4">I18n Debug Information</h2>
    
    <div class="mb-4 p-4 bg-white rounded shadow">
      <h3 class="font-semibold mb-2">Current Configuration:</h3>
      <p>Current Locale: {{ locale }}</p>
      <p>Available Locales: {{ locales.join(', ') }}</p>
      <p>Default Locale: {{ defaultLocale }}</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div class="p-4 bg-white rounded shadow">
        <h3 class="font-semibold mb-2">Using t() Function:</h3>
        <p>landing.heroTitle1: {{ t('landing.heroTitle1') }}</p>
        <p>landing.heroTitle2: {{ t('landing.heroTitle2') }}</p>
        <p>landing.heroSubtitle: {{ t('landing.heroSubtitle') }}</p>
      </div>
      
      <div class="p-4 bg-white rounded shadow">
        <h3 class="font-semibold mb-2">Using $t() Function:</h3>
        <p>landing.heroTitle1: {{ $t('landing.heroTitle1') }}</p>
        <p>landing.heroTitle2: {{ $t('landing.heroTitle2') }}</p>
        <p>landing.heroSubtitle: {{ $t('landing.heroSubtitle') }}</p>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-4 bg-white rounded shadow">
        <h3 class="font-semibold mb-2">Direct Access:</h3>
        <p>Raw messages structure:</p>
        <pre class="bg-gray-100 p-2 text-xs overflow-auto max-h-40">{{ JSON.stringify(messages, null, 2) }}</pre>
      </div>
      
      <div class="p-4 bg-white rounded shadow">
        <h3 class="font-semibold mb-2">Different Namespaces:</h3>
        <p>common.information: {{ t('common.information') }}</p>
        <p>auth.pleaseSignIn: {{ t('auth.pleaseSignIn') }}</p>
        <p>dashboard.pageTitle: {{ t('dashboard.pageTitle') }}</p>
      </div>
    </div>
    
    <div class="mt-4 p-4 bg-white rounded shadow">
      <h3 class="font-semibold mb-2">Language Switcher:</h3>
      <div class="flex gap-2">
        <button 
          v-for="lang in locales" 
          :key="lang"
          @click="switchLanguage(lang)"
          class="px-3 py-1 border rounded"
          :class="{'bg-blue-500 text-white': locale === lang}"
        >
          {{ languageNames[lang as keyof typeof languageNames] || lang }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { navigateTo } from '#app'
import { 
  defaultLocale, 
  locales, 
  languageNames 
} from '~/composables/useI18nSettings'
import type { LocaleType } from '~/composables/useI18nSettings'

const { t, locale, messages } = useI18n()
const router = useRouter()
const route = useRoute()

// 使用导入的全局设置，不再需要重复定义
// const locales = ['en', 'zh', 'ua'] as const
// type LocaleType = typeof locales[number]
// const defaultLocale: LocaleType = 'en'
// const languageNames: Record<LocaleType, string> = { ... }

// 切换语言并更新URL
function switchLanguage(lang: LocaleType) {
  // 更新i18n语言设置
  locale.value = lang
  
  // 获取当前路径（不包含语言前缀）
  let pathWithoutLocale = route.path
  const localePattern = locales.filter(l => l !== defaultLocale).join('|')
  // 如果有非默认语言的前缀，需要移除它
  const localeRegex = new RegExp(`^/(${locales.join('|')})(/|$)`)
  
  if (localeRegex.test(pathWithoutLocale)) {
    // 如果当前路径已有语言前缀，移除它
    pathWithoutLocale = pathWithoutLocale.replace(localeRegex, '/')
    // 确保路径不会以多个斜杠开始
    if (pathWithoutLocale.startsWith('//')) {
      pathWithoutLocale = pathWithoutLocale.substring(1)
    }
  }
  
  // 如果路径只有一个斜杠，则移除尾部斜杠
  if (pathWithoutLocale === '/') {
    pathWithoutLocale = ''
  }
  
  // 构建新路径，默认语言不添加前缀
  const newPath = lang === defaultLocale 
    ? `${pathWithoutLocale || '/'}`
    : `/${lang}${pathWithoutLocale}`
  
  // 导航到新路径
  navigateTo(newPath)
  
  console.log('Changed locale to:', lang)
  console.log('New path:', newPath)
  console.log('Is default locale:', lang === defaultLocale)
}

onMounted(() => {
  console.log('Current locale:', locale.value)
  console.log('Available locales:', locales)
  console.log('Default locale:', defaultLocale)
  console.log('Messages structure:', messages.value)
  
  // 检查当前URL路径
  const path = route.path
  
  // 特殊处理 /en 路径，重定向到根路径
  if (path === '/en' || path === '/en/') {
    navigateTo('/')
    return
  }
  
  // 检查URL是否包含非默认语言的前缀
  const nonDefaultLocalePattern = locales.filter(l => l !== defaultLocale).join('|')
  const localeRegex = new RegExp(`^/(${nonDefaultLocalePattern})(/|$)`)
  
  if (localeRegex.test(path)) {
    // 如果URL包含非默认语言前缀，确保i18n语言设置与URL一致
    const urlLocale = path.split('/')[1] as LocaleType
    if (locale.value !== urlLocale) {
      locale.value = urlLocale
    }
  } else {
    // 如果URL不包含语言前缀（或包含默认语言前缀）
    // 检查当前语言是否是默认语言
    if (locale.value !== defaultLocale) {
      // 如果当前语言不是默认语言，需要添加语言前缀
      navigateTo(`/${locale.value}${path === '/' ? '' : path}`)
    } else if (path.startsWith(`/${defaultLocale}/`) || path === `/${defaultLocale}`) {
      // 如果URL包含默认语言前缀，重定向到不带前缀的URL
      const pathWithoutLocale = path.replace(new RegExp(`^/${defaultLocale}/?`), '/')
      navigateTo(pathWithoutLocale || '/')
    }
  }
})
</script> 