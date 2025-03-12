<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { safeTranslateWithFunction } from '~/utils/i18n-helper'
// 用于调试：直接导入翻译文件
import blogTranslationsEn from '~/i18n/en/blog.json'
import blogTranslationsZh from '~/i18n/zh/blog.json'
import blogTranslationsUa from '~/i18n/ua/blog.json'

const { t, locale } = useI18n()
const i18n = useNuxtApp().$i18n

// 使用项目统一的安全翻译方法
const st = (key: string) => safeTranslateWithFunction(t, key)

// 调试信息
console.log('[DEBUG] Blog translations loaded:', {
  en: blogTranslationsEn, 
  zh: blogTranslationsZh,
  ua: blogTranslationsUa,
  currentLocale: locale.value,
  usingKey: 'blog.heroTitle',
  translated: t('blog.heroTitle'),
  // 检查i18n messages结构
  i18nMessages: process.client ? i18n.messages.value : 'server-side'
})

// 直接使用翻译对象
type BlogTranslations = {
  heroTitle: string;
  heroDescription: string;
}

const currentTranslations: Record<string, BlogTranslations> = {
  en: blogTranslationsEn as BlogTranslations,
  zh: blogTranslationsZh as BlogTranslations,
  ua: blogTranslationsUa as BlogTranslations
}

// 根据当前语言选择正确的翻译对象
const getBlogTranslation = (key: keyof BlogTranslations): string => {
  const currentLang = locale.value
  return currentTranslations[currentLang]?.[key] || key
}

// 直接使用安全翻译方法获取内容
const heroTitle = st('blog.heroTitle')
const heroDescription = st('blog.heroDescription')
</script>

<template>
  <BlogSection
    id="blog"
    class="text-typography_primary flex-col gap-3"
  >
    <BlogBreadcrumbs is-blog />

    <h1 class="font-bold text-lg md:text-xl text-center md:text-left">
      {{ heroTitle }}
    </h1>
    <p class="mb-3 md:w-8/12 md:text-lg md:leading-lg text-center md:text-left">
      {{ heroDescription }}
    </p>
    <div
      class="border-t-2 mt-8 border-typography_primary flex flex-col md:flex-row items-center md:justify-between md:text-right"
    />
  </BlogSection>
</template>
