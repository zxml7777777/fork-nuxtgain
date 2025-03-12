<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">dashboard 命名空间加载测试</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">基本翻译测试</h2>
        <div class="space-y-2">
          <div>
            <span class="font-medium">pageTitle:</span> 
            <span class="ml-2">{{ t('dashboard.pageTitle') }}</span>
          </div>
          <div>
            <span class="font-medium">myDocuments:</span> 
            <span class="ml-2">{{ t('dashboard.myDocuments') }}</span>
          </div>
          <div>
            <span class="font-medium">recentActivity:</span> 
            <span class="ml-2">{{ t('dashboard.recentActivity') }}</span>
          </div>
          <div>
            <span class="font-medium">documentStats:</span> 
            <span class="ml-2">{{ t('dashboard.documentStats') }}</span>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">命名空间信息</h2>
        <div v-if="i18nState">
          <div class="mb-4">
            <span class="font-medium">当前语言:</span> 
            <span class="ml-2">{{ i18nState.locale }}</span>
          </div>
          <div class="mb-4">
            <span class="font-medium">可用命名空间:</span> 
            <span class="ml-2">{{ availableNamespaces.join(', ') || '无' }}</span>
          </div>
          <div class="mb-4">
            <span class="font-medium">dashboard命名空间是否存在:</span> 
            <span class="ml-2 font-bold" :class="hasdashboard ? 'text-green-600' : 'text-red-600'">
              {{ hasdashboard ? '是' : '否' }}
            </span>
          </div>
          <div class="mt-4">
            <UButton @click="forceLoaddashboard" color="green" :loading="loading">
              强制加载dashboard命名空间
            </UButton>
          </div>
        </div>
        <div v-else class="text-gray-500">
          加载中...
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">订阅产品测试</h2>
        <div class="space-y-2">
          <div>
            <span class="font-medium">proTitle:</span> 
            <span class="ml-2">{{ t('subscriptionProducts.proTitle') }}</span>
          </div>
          <div>
            <span class="font-medium">proSubtitle:</span> 
            <span class="ml-2">{{ t('subscriptionProducts.proSubtitle') }}</span>
          </div>
          <div>
            <span class="font-medium">customTitle:</span> 
            <span class="ml-2">{{ t('subscriptionProducts.customTitle') }}</span>
          </div>
          <div>
            <span class="font-medium">customSubtitle:</span> 
            <span class="ml-2">{{ t('subscriptionProducts.customSubtitle') }}</span>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6 col-span-1 md:col-span-2">
        <h2 class="text-xl font-semibold mb-4">网络请求跟踪</h2>
        <div class="mb-4">
          <p class="text-gray-700 mb-2">
            请打开浏览器的开发者工具，切换到网络(Network)选项卡，并刷新页面。
            然后在过滤框中输入 "dashboard.json" 来查看是否有相关请求。
          </p>
          <p class="text-gray-700">
            预期应当看到类似 "/i18n/en/dashboard.json" 的请求，且状态为 200。
          </p>
        </div>
        <div class="mt-6 space-x-4">
          <UButton @click="reloadPage" color="primary">刷新页面</UButton>
          <UButton @click="changeLocale" color="purple">
            切换语言 (当前: {{ currentLocale }})
          </UButton>
          <UButton @click="checkdashboardFile" color="orange">
            检查dashboard文件
          </UButton>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6 col-span-1 md:col-span-2">
        <h2 class="text-xl font-semibold mb-4">故障排除</h2>
        <div class="space-y-4">
          <div>
            <h3 class="font-semibold">1. 尝试直接使用翻译文件</h3>
            <div class="mt-2 p-3 bg-gray-100 rounded">
              <p>直接导入dashboard.json的内容：{{ dashboardContent }}</p>
            </div>
          </div>
          <div>
            <h3 class="font-semibold">2. 尝试调用备用翻译方法</h3>
            <div class="mt-2 p-3 bg-gray-100 rounded space-y-2">
              <p>使用 dashboardT 函数: {{ dashboardT('dashboard.pageTitle') }}</p>
              <p>使用 dashboardT 函数: {{ dashboardT('dashboard.documentStats') }}</p>
            </div>
          </div>
          <div v-if="dashboardResult" class="mt-4">
            <h3 class="font-semibold">操作结果：</h3>
            <div class="mt-2 p-3" :class="dashboardResultSuccess ? 'bg-green-100' : 'bg-red-100'">
              {{ dashboardResult }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Locale } from 'vue-i18n';
import dashboardEn from '~/i18n/en/dashboard.json';

// 增加其他语言的dashboard导入
import dashboardZh from '~/i18n/zh/dashboard.json';
import dashboardUa from '~/i18n/ua/dashboard.json';

// 导入subscriptionProducts命名空间
import subscriptionProductsEn from '~/i18n/en/subscriptionProducts.json';
import subscriptionProductsZh from '~/i18n/zh/subscriptionProducts.json';
import subscriptionProductsUa from '~/i18n/ua/subscriptionProducts.json';

// 定义所有语言的dashboard翻译
const dashboardTranslations = {
  en: dashboardEn,
  zh: dashboardZh,
  ua: dashboardUa
};

// 定义所有语言的subscriptionProducts翻译
const subscriptionProductsTranslations = {
  en: subscriptionProductsEn,
  zh: subscriptionProductsZh,
  ua: subscriptionProductsUa
};

// 定义i18n状态类型
interface I18nState {
  locale: string;
  messages: Record<string, Record<string, any>>;
}

const i18n = useI18n();
const { t, locale, setLocale } = i18n;
const currentLocale = computed<string>(() => locale.value as string);
const i18nState = ref<I18nState | null>(null);
const loading = ref(false);
const dashboardResult = ref('');
const dashboardResultSuccess = ref(false);

// 保留直接导入的dashboard内容作为备用
const dashboardContent = computed(() => {
  return dashboardEn ?? '无法加载dashboard.json';
});

// 提供备用的dashboard翻译方法
function dashboardT(key: string): string {
  if (!key.startsWith('dashboard.')) return key;
  
  const parts = key.split('.');
  if (parts.length < 2) return key;
  
  const subKey = parts[1];
  if (!subKey) return key;
  
  if (dashboardEn && typeof dashboardEn === 'object' && subKey in dashboardEn) {
    return (dashboardEn as Record<string, string>)[subKey] || key;
  }
  
  return key;
}

const availableNamespaces = computed(() => {
  if (!i18nState.value || !i18nState.value.messages || !i18nState.value.locale) {
    return [];
  }
  return Object.keys(i18nState.value.messages[i18nState.value.locale] || {});
});

const hasdashboard = computed(() => {
  return availableNamespaces.value.includes('dashboard');
});

// 获取i18n状态
function updateI18nState() {
  // 使用any类型避免类型错误
  const i18n = useNuxtApp().$i18n as any;
  if (i18n && i18n.locale?.value) {
    i18nState.value = {
      locale: i18n.locale.value,
      messages: i18n.messages?.value || {}
    };
    console.log('[dashboard-test] i18n状态:', i18nState.value);
    
    // 检查dashboard命名空间
    const locale = i18nState.value.locale;
    const messages = i18nState.value.messages;
    
    if (locale && messages[locale]) {
      const hasdashboardNS = Boolean(messages[locale].dashboard);
      console.log('[dashboard-test] dashboard命名空间存在:', hasdashboardNS);
      
      if (hasdashboardNS) {
        console.log('[dashboard-test] dashboard命名空间内容:', 
          messages[locale].dashboard);
      }
    }
  }
}

// 增加一个加载dashboard命名空间的通用函数
function loaddashboardNamespace(localeValue: string) {
  if (!localeValue) return false;
  
  try {
    const i18n = useNuxtApp().$i18n as any;
    if (!i18n) {
      console.error('[dashboard-test] i18n对象未找到');
      return false;
    }
    
    const dashboardData = dashboardTranslations[localeValue as keyof typeof dashboardTranslations];
    if (!dashboardData) {
      console.error(`[dashboard-test] 没有找到${localeValue}语言的dashboard翻译`);
      return false;
    }
    
    // 加载subscriptionProducts翻译
    const subscriptionData = subscriptionProductsTranslations[localeValue as keyof typeof subscriptionProductsTranslations];
    if (!subscriptionData) {
      console.error(`[dashboard-test] 没有找到${localeValue}语言的subscriptionProducts翻译`);
      // 即使没有subscriptionProducts也继续加载dashboard
    }
    
    try {
      console.log(`[dashboard-test] 正在为${localeValue}加载dashboard命名空间`);
      i18n.mergeLocaleMessage(localeValue, { dashboard: dashboardData });
      console.log(`[dashboard-test] ${localeValue}的dashboard命名空间加载成功`);
      
      // 尝试加载subscriptionProducts命名空间
      if (subscriptionData) {
        console.log(`[dashboard-test] 正在为${localeValue}加载subscriptionProducts命名空间`);
        i18n.mergeLocaleMessage(localeValue, { subscriptionProducts: subscriptionData });
        console.log(`[dashboard-test] ${localeValue}的subscriptionProducts命名空间加载成功`);
      }
      
      return true;
    } catch (e) {
      console.error(`[dashboard-test] mergeLocaleMessage失败:`, e);
      
      try {
        console.log(`[dashboard-test] 尝试使用setLocaleMessage添加命名空间`);
        const currentMessages = { ...(i18n.messages?.value?.[localeValue] || {}) };
        currentMessages.dashboard = dashboardData;
        
        // 添加subscriptionProducts命名空间
        if (subscriptionData) {
          currentMessages.subscriptionProducts = subscriptionData;
        }
        
        i18n.setLocaleMessage(localeValue, currentMessages);
        console.log(`[dashboard-test] ${localeValue}的命名空间通过setLocaleMessage加载成功`);
        return true;
      } catch (e2) {
        console.error(`[dashboard-test] setLocaleMessage失败:`, e2);
        return false;
      }
    }
  } catch (err) {
    console.error(`[dashboard-test] 加载命名空间错误:`, err);
    return false;
  }
}

// 修改forceLoaddashboard函数，使用通用的loaddashboardNamespace函数
async function forceLoaddashboard() {
  loading.value = true;
  dashboardResult.value = '';
  dashboardResultSuccess.value = false;
  
  try {
    const currentLocaleValue = useNuxtApp().$i18n?.locale?.value || 'en';
    const success = loaddashboardNamespace(currentLocaleValue);
    
    if (success) {
      dashboardResult.value = `成功为${currentLocaleValue}加载dashboard命名空间`;
      dashboardResultSuccess.value = true;
    } else {
      dashboardResult.value = `无法为${currentLocaleValue}加载dashboard命名空间`;
      dashboardResultSuccess.value = false;
    }
    
    // 更新状态
    updateI18nState();
  } catch (err) {
    console.error('[dashboard-test] 强制加载dashboard错误:', err);
    dashboardResult.value = `错误: ${(err as Error).message}`;
    dashboardResultSuccess.value = false;
  } finally {
    loading.value = false;
  }
}

function reloadPage() {
  window.location.reload();
}

function changeLocale() {
  // 在en, zh, ua之间循环
  const locales = ['en', 'zh', 'ua'];
  const currentLang = currentLocale.value || 'en'; // 添加默认值
  const currentIndex = locales.indexOf(currentLang);
  const nextIndex = (currentIndex + 1) % locales.length;
  const nextLocale = locales[nextIndex];
  if (nextLocale) {
    setLocale(nextLocale);
    // 语言切换后立即加载对应的dashboard命名空间
    setTimeout(() => {
      loaddashboardNamespace(nextLocale);
      updateI18nState();
    }, 100);
  }
}

// 检查dashboard.json文件
async function checkdashboardFile() {
  if (!process.client) return;
  
  try {
    dashboardResult.value = '正在检查dashboard.json文件...';
    dashboardResultSuccess.value = false;
    
    const currentLocaleValue = useNuxtApp().$i18n?.locale?.value || 'en';
    
    // 修改：尝试多个可能的路径
    const possiblePaths = [
      `/i18n/${currentLocaleValue}/dashboard.json`,         // 标准路径
      `/_nuxt/i18n/${currentLocaleValue}/dashboard.json`,   // Nuxt构建路径
      `/i18n/${currentLocaleValue}.json`,                   // 合并文件路径
    ];
    
    console.log(`[dashboard-test] 尝试加载dashboard.json，当前语言：${currentLocaleValue}`);
    
    let success = false;
    let data;
    let successPath = '';
    
    // 依次尝试所有可能的路径
    for (const url of possiblePaths) {
      try {
        console.log(`[dashboard-test] 尝试路径: ${url}`);
        const response = await fetch(url);
        
        if (response.ok) {
          data = await response.json();
          success = true;
          successPath = url;
          console.log(`[dashboard-test] 成功从路径加载: ${url}`, data);
          break;
        } else {
          console.log(`[dashboard-test] 路径 ${url} 加载失败: ${response.status}`);
        }
      } catch (pathError) {
        console.log(`[dashboard-test] 路径 ${url} 错误:`, pathError);
      }
    }
    
    if (success) {
      console.log('[dashboard-test] dashboard.json加载成功:', data);
      dashboardResult.value = `dashboard.json文件存在并成功加载(${successPath}):\n${JSON.stringify(data, null, 2).slice(0, 200)}...`;
      dashboardResultSuccess.value = true;
    } else {
      console.error('[dashboard-test] 所有尝试的路径都失败');
      
      // 尝试加载内存中的翻译数据
      const i18n = useNuxtApp().$i18n as any;
      const messages = i18n?.messages?.value;
      if (messages && messages[currentLocaleValue] && messages[currentLocaleValue].dashboard) {
        console.log('[dashboard-test] 内存中存在dashboard翻译:', messages[currentLocaleValue].dashboard);
        dashboardResult.value = `无法从外部加载dashboard.json，但内存中存在翻译数据:\n${JSON.stringify(messages[currentLocaleValue].dashboard, null, 2).slice(0, 200)}...`;
        dashboardResultSuccess.value = true;
      } else {
        dashboardResult.value = `无法加载dashboard.json文件：所有尝试路径均失败，内存中也没有数据。\n\n这可能是因为在Nuxt.js的构建过程中，JSON文件被打包到了JavaScript模块中，而不是作为独立文件提供。`;
        dashboardResultSuccess.value = false;
      }
    }
  } catch (err) {
    console.error('[dashboard-test] 检查dashboard.json文件错误:', err);
    dashboardResult.value = `检查dashboard.json文件错误: ${(err as Error).message}`;
    dashboardResultSuccess.value = false;
  }
}

// 页面加载时自动加载dashboard命名空间
onBeforeMount(() => {
  if (process.client) {
    // 等待i18n初始化完成
    setTimeout(() => {
      const currentLocaleValue = useNuxtApp().$i18n?.locale?.value || 'en';
      loaddashboardNamespace(currentLocaleValue);
      updateI18nState();
    }, 300);
  }
});

onMounted(() => {
  // 等待i18n加载完成
  setTimeout(() => {
    updateI18nState();
  }, 1000);
  
  // 监听网络请求
  if (process.client && window.performance && 'PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        // 显式转换并提供默认值
        const resourceEntry = entry as PerformanceResourceTiming;
        const url = typeof resourceEntry.name === 'string' ? resourceEntry.name : '';
        if (url.includes('dashboard.json')) {
          console.log('[dashboard-test] 检测到dashboard.json请求:', {
            url,
            duration: resourceEntry.duration,
            transferSize: resourceEntry.transferSize
          });
        }
      });
    });
    observer.observe({ entryTypes: ['resource'] });
  }
});

// 监听语言变化
watch(currentLocale, () => {
  if (currentLocale.value) {
    console.log('[dashboard-test] 语言已变更为:', currentLocale.value);
    // 等待i18n加载完成
    setTimeout(() => {
      updateI18nState();
    }, 500);
  }
});
</script> 