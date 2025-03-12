<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">{{ t('common.information') }}</h1>
    
    <div class="mb-6 p-4 bg-blue-50 rounded-lg">
      <p class="mb-2"><strong>当前语言:</strong> {{ currentLocaleName }}</p>
      <div class="space-x-2">
        <button @click="switchLanguage('en')" 
                class="px-3 py-1 border rounded-md" 
                :class="{'bg-blue-500 text-white': currentLocale === 'en'}">
          English
        </button>
        <button @click="switchLanguage('zh')" 
                class="px-3 py-1 border rounded-md"
                :class="{'bg-blue-500 text-white': currentLocale === 'zh'}">
          中文
        </button>
        <button @click="switchLanguage('ua')" 
                class="px-3 py-1 border rounded-md"
                :class="{'bg-blue-500 text-white': currentLocale === 'ua'}">
          Українська
        </button>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="border rounded-lg p-4 bg-white shadow-sm">
        <h2 class="text-xl font-semibold mb-4">{{ t('common.welcome') }}</h2>
        <p class="mb-2">{{ t('common.login') }}</p>
        <p class="mb-2">{{ t('common.signup') }}</p>
        <p class="mb-2">{{ t('common.logout') }}</p>
      </div>
      
      <div class="border rounded-lg p-4 bg-white shadow-sm">
        <h2 class="text-xl font-semibold mb-4">{{ t('landing.heroTitle1') }}</h2>
        <p class="mb-2">{{ t('landing.heroSubtitle') }}</p>
        <p class="mb-2">{{ t('landing.heroGetStarted') }}</p>
      </div>
      
      <div class="border rounded-lg p-4 bg-white shadow-sm">
        <h2 class="text-xl font-semibold mb-4">{{ t('dashboard.pageTitle') }}</h2>
        <p class="mb-2">{{ t('dashboard.myDocuments') }}</p>
        <p class="mb-2">{{ t('dashboard.recentActivity') }}</p>
        <p class="mb-2">{{ t('dashboard.createNew') }}</p>
      </div>
      
      <div class="border rounded-lg p-4 bg-white shadow-sm">
        <h2 class="text-xl font-semibold mb-4">特别关注的仪表盘项</h2>
        <div class="mb-2">
          <span class="font-medium">键名:</span> dashboard.documentStats<br>
          <span class="font-medium">翻译:</span> {{ t('dashboard.documentStats') }}
        </div>
        <div class="mb-2">
          <span class="font-medium">键名:</span> dashboard.documentCount<br>
          <span class="font-medium">翻译:</span> {{ t('dashboard.documentCount') }}
        </div>
        <div class="mb-2">
          <span class="font-medium">键名:</span> dashboard.documentGenerated<br>
          <span class="font-medium">翻译:</span> {{ t('dashboard.documentGenerated') }}
        </div>
        <div class="mb-2">
          <span class="font-medium">键名:</span> dashboard.latestDocument<br>
          <span class="font-medium">翻译:</span> {{ t('dashboard.latestDocument') }}
        </div>
      </div>
      
      <div class="border rounded-lg p-4 bg-white shadow-sm col-span-1 md:col-span-2">
        <h2 class="text-xl font-semibold mb-4">命名空间加载测试</h2>
        <div class="mb-4">
          <h3 class="font-medium mb-2">当前加载状态:</h3>
          <div class="grid grid-cols-2 gap-2">
            <div v-for="namespace in ['common', 'landing', 'auth', 'dashboard']" :key="namespace"
                 class="p-2 rounded"
                 :class="isNamespaceLoaded(namespace) ? 'bg-green-100' : 'bg-red-100'">
              <span class="font-medium">{{ namespace }}:</span>
              <span class="ml-2">{{ isNamespaceLoaded(namespace) ? '已加载' : '未加载' }}</span>
            </div>
          </div>
        </div>
        <div class="flex space-x-2">
          <button 
            @click="reloadAllNamespaces" 
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
            重新加载所有命名空间
          </button>
          <button 
            @click="checkNamespaces" 
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            检查命名空间状态
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t, locale: currentLocale } = useI18n();
const nuxtApp = useNuxtApp();
const loadedNamespaces = ref<Record<string, boolean>>({});

// 获取当前语言名称
const currentLocaleName = computed(() => {
  return getLanguageName(currentLocale.value);
});

// 获取语言名称
function getLanguageName(lang: string): string {
  const names: Record<string, string> = {
    en: 'English',
    zh: '中文',
    ua: 'Українська'
  };
  return names[lang] || lang;
}

// 检查命名空间是否已加载
function isNamespaceLoaded(namespace: string): boolean {
  return Boolean(loadedNamespaces.value[namespace]);
}

// 重新加载所有命名空间
function reloadAllNamespaces() {
  const locale = currentLocale.value;
  if (!locale) {
    console.error('[i18n-test] 当前语言未设置');
    return;
  }
  
  try {
    console.log(`[i18n-test] 正在重新加载所有命名空间，当前语言: ${locale}`);
    
    if (typeof nuxtApp.$loadAllNamespaces === 'function') {
      const result = nuxtApp.$loadAllNamespaces(locale);
      if (result) {
        loadedNamespaces.value = result;
      }
    } else {
      console.error('[i18n-test] $loadAllNamespaces 不是一个函数');
      // 尝试手动加载命名空间
      checkNamespaces();
    }
  } catch (error) {
    console.error('[i18n-test] 加载命名空间时出错:', error);
  }
}

// 检查命名空间状态
function checkNamespaces() {
  try {
    // 获取i18n实例并检查命名空间
    const i18n = useNuxtApp().$i18n as any;
    if (!i18n) {
      console.error('[i18n-test] i18n实例未找到');
      return;
    }
    
    const locale = currentLocale.value;
    const messages = i18n.messages?.value;
    
    if (messages && locale && messages[locale]) {
      const namespaces = Object.keys(messages[locale]);
      console.log(`[i18n-test] 当前加载的命名空间:`, namespaces);
      
      // 更新加载状态
      loadedNamespaces.value = {};
      for (const namespace of ['common', 'landing', 'auth', 'dashboard']) {
        loadedNamespaces.value[namespace] = namespaces.includes(namespace);
      }
    } else {
      console.error('[i18n-test] 无法获取当前语言的消息');
    }
  } catch (error) {
    console.error('[i18n-test] 检查命名空间时出错:', error);
  }
}

// 切换语言
function switchLanguage(lang: string) {
  currentLocale.value = lang;
  // 保存语言偏好到 localStorage
  localStorage.setItem('preferred-locale', lang);
  
  // 切换语言后稍等一会再检查命名空间，让插件有时间加载
  setTimeout(() => {
    checkNamespaces();
  }, 500);
}

// 页面加载时，尝试从 localStorage 恢复语言设置
onMounted(() => {
  const savedLocale = localStorage.getItem('preferred-locale');
  if (savedLocale && ['en', 'zh', 'ua'].includes(savedLocale)) {
    currentLocale.value = savedLocale;
  }
  
  // 等待一会儿检查命名空间状态
  setTimeout(() => {
    checkNamespaces();
  }, 1000);
});

// 监听语言变化
watch(currentLocale, () => {
  console.log(`[i18n-test] 语言已更改为: ${currentLocale.value}`);
});
</script> 