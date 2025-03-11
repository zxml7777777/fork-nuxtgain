<template>
  <div class="container mx-auto p-6 bg-gray-100 rounded-lg">
    <h2 class="text-xl font-bold mb-4">I18n Debug Information</h2>
    
    <div class="mb-4 p-4 bg-white rounded shadow">
      <h3 class="font-semibold mb-2">Current Configuration:</h3>
      <p>Current Locale: {{ locale }}</p>
      <p>Available Locales: {{ locales.join(', ') }}</p>
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
          @click="setLocale(lang)"
          class="px-3 py-1 border rounded"
          :class="{'bg-blue-500 text-white': locale === lang}"
        >
          {{ lang }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale, messages } = useI18n()
// 定义可用的语言列表
const locales = ['en', 'zh', 'ua']

function setLocale(lang: string) {
  locale.value = lang
  console.log('Changed locale to:', lang)
  console.log('Messages structure:', messages.value)
}

onMounted(() => {
  console.log('Current locale:', locale.value)
  console.log('Available locales:', locales)
  console.log('Messages structure:', messages.value)
})
</script> 