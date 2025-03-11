<template>
  <div class="p-4 border rounded-lg bg-gray-50 my-8">
    <h2 class="text-xl font-bold mb-2">I18n 翻译测试</h2>
    
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="bg-white p-4 rounded shadow">
        <h3 class="font-bold mb-2">使用 t() 函数的结果：</h3>
        <ul class="space-y-1">
          <li><code>heroTitle1:</code> {{ t('landing.heroTitle1') }}</li>
          <li><code>heroTitle2:</code> {{ t('landing.heroTitle2') }}</li>
          <li><code>heroSubtitle:</code> {{ t('landing.heroSubtitle') }}</li>
        </ul>
      </div>
      
      <div class="bg-white p-4 rounded shadow">
        <h3 class="font-bold mb-2">直接访问翻译对象：</h3>
        <ul class="space-y-1">
          <li><code>landing?.heroTitle1:</code> {{ rawTranslations.landing?.heroTitle1 }}</li>
          <li><code>landing?.heroTitle2:</code> {{ rawTranslations.landing?.heroTitle2 }}</li>
          <li><code>landing?.heroSubtitle:</code> {{ rawTranslations.landing?.heroSubtitle }}</li>
        </ul>
      </div>
    </div>
    
    <div class="mt-4 bg-white p-4 rounded shadow">
      <h3 class="font-bold mb-2">原始翻译对象结构：</h3>
      <pre class="bg-gray-100 p-2 text-xs overflow-auto max-h-40">{{ messages }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale, messages } = useI18n()

// 获取当前语言的原始翻译对象
const rawTranslations = computed(() => {
  if (!messages.value || !locale.value) {
    return {}
  }
  return messages.value[locale.value] || {}
})

onMounted(() => {
  console.log('I18nTest component mounted')
  console.log('Current locale:', locale.value)
  console.log('Raw translations:', rawTranslations.value)
  console.log('t() function result for landing.heroTitle1:', t('landing.heroTitle1'))
})
</script> 