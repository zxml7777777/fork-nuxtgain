<template>
  <div class="relative">
    <!-- Main circular button -->
    <button 
      @click="isOpen = !isOpen"
      class="w-10 h-10 rounded-full bg-white border shadow-sm hover:bg-gray-50 flex items-center justify-center"
      :aria-expanded="isOpen"
      aria-haspopup="true"
    >
      {{ languageNames[locale as keyof typeof languageNames]?.slice(0, 2) || locale }}
    </button>

    <!-- Dropdown menu -->
    <div 
      v-if="isOpen"
      class="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
      role="menu"
      @blur="isOpen = false"
    >
      <div class="py-1" role="none">
        <button
          v-for="lang in locales"
          :key="lang"
          @click="switchLanguage(lang); isOpen = false"
          class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          :class="{'bg-blue-50 text-blue-600': locale === lang}"
          role="menuitem"
        >
          {{ languageNames[lang as keyof typeof languageNames] || lang }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { navigateTo } from '#app'
import { 
  defaultLocale, 
  locales, 
  languageNames 
} from '~/composables/useI18nSettings'
import type { LocaleType } from '~/composables/useI18nSettings'

const { locale } = useI18n()
const route = useRoute()
const isOpen = ref(false)

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (e.target && !e.target.closest('.relative')) {
      isOpen.value = false
    }
  })
})

function switchLanguage(lang: LocaleType) {
  // Update i18n locale
  locale.value = lang
  
  // Get current path without locale prefix
  let pathWithoutLocale = route.path
  const localeRegex = new RegExp(`^/(${locales.join('|')})(/|$)`)
  
  if (localeRegex.test(pathWithoutLocale)) {
    pathWithoutLocale = pathWithoutLocale.replace(localeRegex, '/')
    if (pathWithoutLocale.startsWith('//')) {
      pathWithoutLocale = pathWithoutLocale.substring(1)
    }
  }
  
  if (pathWithoutLocale === '/') {
    pathWithoutLocale = ''
  }
  
  // Build new path - default language has no prefix
  const newPath = lang === defaultLocale 
    ? `${pathWithoutLocale || '/'}`
    : `/${lang}${pathWithoutLocale}`
  
  // Navigate to new path
  navigateTo(newPath)
}
</script> 