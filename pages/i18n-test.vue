<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">{{ $t('common.information') }}</h1>
    
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">{{ $t('common.language') }}: {{ currentLocaleName }}</h2>
      <div class="flex flex-wrap gap-2 mb-4">
        <button 
          v-for="lang in ['en', 'zh', 'ua']" 
          :key="lang"
          @click="switchLanguage(lang)"
          class="px-4 py-2 border rounded hover:bg-blue-50 transition"
          :class="{ 'bg-blue-100 border-blue-500': currentLocale === lang }"
        >
          {{ getLanguageName(lang) }}
        </button>
      </div>
    </div>
    
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">{{ $t('landing.heroTitle1') }}</h2>
      <p class="mb-2">{{ $t('landing.heroSubtitle') }}</p>
      <p class="mb-4">{{ $t('landing.heroTrusted', { count: 5000 }) }}</p>
      <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        {{ $t('landing.heroGetStarted') }}
      </button>
    </div>
    
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">{{ $t('dashboard.pageTitle') }}</h2>
      <p>{{ $t('dashboard.myDocuments') }}: 5</p>
      <p>{{ $t('dashboard.documentStats') }}</p>
      <ul class="list-disc pl-5 mt-2">
        <li>{{ $t('dashboard.documentCount') }}: 5</li>
        <li>{{ $t('dashboard.documentGenerated') }}: 3</li>
        <li>{{ $t('dashboard.latestDocument') }}: Document #5</li>
      </ul>
    </div>
    
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">{{ $t('auth.pleaseSignIn') }}</h2>
      <div class="border p-4 rounded max-w-md">
        <div class="mb-4">
          <label class="block mb-2">{{ $t('auth.sign_in.email_label') }}</label>
          <input type="email" :placeholder="$t('auth.sign_in.email_input_placeholder')" class="w-full border p-2 rounded">
        </div>
        <div class="mb-4">
          <label class="block mb-2">{{ $t('auth.sign_in.password_label') }}</label>
          <input type="password" :placeholder="$t('auth.sign_in.password_input_placeholder')" class="w-full border p-2 rounded">
        </div>
        <button class="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition">
          {{ $t('auth.sign_in.button_label') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { locale: currentLocale, t } = useI18n();

// 获取当前语言名称
const currentLocaleName = computed(() => {
  return getLanguageName(currentLocale.value);
});

// 获取语言名称
function getLanguageName(lang: string): string {
  const names = {
    en: 'English',
    zh: '中文',
    ua: 'Українська'
  };
  return names[lang as keyof typeof names] || lang;
}

// 切换语言
function switchLanguage(lang: string) {
  currentLocale.value = lang;
  // 保存语言偏好到 localStorage
  localStorage.setItem('preferred-locale', lang);
}

// 页面加载时，尝试从 localStorage 恢复语言设置
onMounted(() => {
  const savedLocale = localStorage.getItem('preferred-locale');
  if (savedLocale && ['en', 'zh', 'ua'].includes(savedLocale)) {
    currentLocale.value = savedLocale;
  }
});
</script> 