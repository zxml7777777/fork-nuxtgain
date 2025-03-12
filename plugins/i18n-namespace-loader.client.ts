import { defineNuxtPlugin } from '#app'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

// 导入所有语言的所有命名空间
import commonEn from '~/i18n/en/common.json'
import landingEn from '~/i18n/en/landing.json'
import authEn from '~/i18n/en/auth.json'
import dashboardEn from '~/i18n/en/dashboard.json'
import blogEn from '~/i18n/en/blog.json'
import priceTrustEn from '~/i18n/en/priceTrust.json'

import commonZh from '~/i18n/zh/common.json'
import landingZh from '~/i18n/zh/landing.json'
import authZh from '~/i18n/zh/auth.json'
import dashboardZh from '~/i18n/zh/dashboard.json'
import blogZh from '~/i18n/zh/blog.json'
import priceTrustZh from '~/i18n/zh/priceTrust.json'

import commonUa from '~/i18n/ua/common.json'
import landingUa from '~/i18n/ua/landing.json'
import authUa from '~/i18n/ua/auth.json'
import dashboardUa from '~/i18n/ua/dashboard.json'
import blogUa from '~/i18n/ua/blog.json'
import priceTrustUa from '~/i18n/ua/priceTrust.json'

// 使用更通用的类型定义，以支持复杂的翻译结构（包括嵌套对象和数组）
type TranslationData = Record<string, any>;
type NamespaceTranslations = Record<string, TranslationData>;
type LocaleTranslations = Record<string, NamespaceTranslations>;

// 定义所有语言的所有命名空间的翻译
const namespaceTranslations: LocaleTranslations = {
  en: {
    common: commonEn,
    landing: landingEn,
    auth: authEn,
    dashboard: dashboardEn,
    blog: blogEn,
    priceTrust: priceTrustEn
  },
  zh: {
    common: commonZh,
    landing: landingZh,
    auth: authZh,
    dashboard: dashboardZh,
    blog: blogZh,
    priceTrust: priceTrustZh
  },
  ua: {
    common: commonUa,
    landing: landingUa,
    auth: authUa,
    dashboard: dashboardUa,
    blog: blogUa,
    priceTrust: priceTrustUa
  }
};

// 所有可用的命名空间列表
const availableNamespaces = ['common', 'landing', 'auth', 'dashboard', 'blog', 'priceTrust'];

// 页面路径与所需命名空间的映射关系
const pageNamespaceMap: Record<string, string[]> = {
  // 所有页面都需要common命名空间
  '.*': ['common'],
  // 根页面使用landing命名空间
  '^/$': ['landing'],
  // auth目录下的页面使用auth命名空间
  '^/auth': ['auth'],
  // app目录下的页面使用dashboard命名空间
  '^/app': ['dashboard'],
  // blog目录下的页面使用blog命名空间
  '^/blog': ['blog'],
  // i18n-dashboard-test页面使用dashboard命名空间
  '^/i18n-dashboard-test': ['dashboard'],
  // i18n-test页面使用所有命名空间
  '^/i18n-test': availableNamespaces,
  // 添加价格页面的映射
  '^/pricing': ['priceTrust'],
};

// 定义i18n实例的简化类型
interface I18nInstance {
  locale: {
    value: string;
  };
  messages: {
    value: Record<string, Record<string, any>>;
  };
  mergeLocaleMessage: (locale: string, messages: Record<string, any>) => void;
  setLocaleMessage: (locale: string, messages: Record<string, any>) => void;
}

export default defineNuxtPlugin((nuxtApp) => {
  // 获取i18n实例
  const i18n = nuxtApp.$i18n as unknown as I18nInstance;
  // 使用全局状态跟踪i18n加载状态
  const i18nReady = useState('i18n-ready', () => false);
  
  if (!i18n) {
    console.error('[i18n-namespace-loader] i18n实例未找到');
    // 即使未找到i18n实例，也设置为已加载完成以避免界面卡住
    i18nReady.value = true;
    return;
  }
  
  // 加载指定语言的特定命名空间
  function loadNamespace(locale: string, namespace: string): boolean {
    if (!locale || !namespace) return false;
    
    if (!namespaceTranslations[locale] || !namespaceTranslations[locale][namespace]) {
      console.warn(`[i18n-namespace-loader] 未找到${locale}语言的${namespace}命名空间翻译`);
      return false;
    }
    
    try {
      // 尝试使用mergeLocaleMessage
      const namespaceObj: Record<string, any> = {};
      namespaceObj[namespace] = namespaceTranslations[locale][namespace];
      
      i18n.mergeLocaleMessage(locale, namespaceObj);
      console.log(`[i18n-namespace-loader] ${locale}的${namespace}命名空间加载成功`);
      return true;
    } catch (e) {
      console.error(`[i18n-namespace-loader] 加载${namespace}命名空间错误:`, e);
      
      try {
        // 尝试使用setLocaleMessage作为备选方案
        const currentMessages = { ...(i18n.messages?.value[locale] || {}) };
        currentMessages[namespace] = namespaceTranslations[locale][namespace];
        i18n.setLocaleMessage(locale, currentMessages);
        console.log(`[i18n-namespace-loader] ${locale}的${namespace}命名空间通过setLocaleMessage加载成功`);
        return true;
      } catch (e2) {
        console.error(`[i18n-namespace-loader] setLocaleMessage失败:`, e2);
        return false;
      }
    }
  }
  
  // 加载指定语言的所有命名空间
  function loadAllNamespaces(locale: string): Record<string, boolean> {
    if (!locale) return {};
    
    const results: Record<string, boolean> = {};
    
    for (const namespace of availableNamespaces) {
      results[namespace] = loadNamespace(locale, namespace);
    }
    
    const successCount = Object.values(results).filter(Boolean).length;
    console.log(`[i18n-namespace-loader] ${locale}语言的命名空间加载完成，成功: ${successCount}/${availableNamespaces.length}`);
    
    // 只有当所有命名空间都加载成功时，才认为i18n完全加载完成
    const allLoaded = successCount === availableNamespaces.length;
    if (allLoaded) {
      i18nReady.value = true;
      console.log('[i18n-namespace-loader] 所有翻译文件加载完成，i18nReady设置为true');
    }
    
    return results;
  }

  // 根据当前路由路径加载相应的命名空间
  function loadNamespacesForCurrentPath(locale: string, path: string): Record<string, boolean> {
    if (!locale || !path) return {};
    
    const results: Record<string, boolean> = {};
    const namespacesToLoad = new Set<string>();
    
    // 遍历映射关系，找出当前路径需要的所有命名空间
    for (const [pathPattern, namespaces] of Object.entries(pageNamespaceMap)) {
      const regex = new RegExp(pathPattern);
      if (regex.test(path)) {
        namespaces.forEach(ns => namespacesToLoad.add(ns));
      }
    }
    
    // 加载所有匹配的命名空间
    for (const namespace of namespacesToLoad) {
      results[namespace] = loadNamespace(locale, namespace);
    }
    
    const successCount = Object.values(results).filter(Boolean).length;
    console.log(`[i18n-namespace-loader] 路径${path}的命名空间加载完成，成功: ${successCount}/${namespacesToLoad.size}`);
    
    return results;
  }
  
  // 立即在插件加载时加载所有命名空间
  if (process.client) {
    const currentLocale = i18n?.locale?.value;
    if (currentLocale) {
      console.log(`[i18n-namespace-loader] 插件初始化时立即加载所有${currentLocale}命名空间`);
      loadAllNamespaces(currentLocale);
    } else {
      // 如果当前没有获取到locale，设置一个定时器尝试
      setTimeout(() => {
        const locale = i18n?.locale?.value;
        if (locale) {
          console.log(`[i18n-namespace-loader] 延迟加载所有${locale}命名空间`);
          loadAllNamespaces(locale);
        } else {
          // 如果仍然获取不到locale，设置i18nReady为true以避免阻塞页面
          i18nReady.value = true;
          console.warn('[i18n-namespace-loader] 无法获取locale，强制设置i18nReady=true');
        }
      }, 100);
    }
  }
  
  // 监听语言变化，自动加载对应语言的所有命名空间
  if (i18n?.locale && typeof i18n.locale === 'object' && process.client) {
    watch(() => i18n.locale.value, (newLocale) => {
      if (newLocale) {
        console.log(`[i18n-namespace-loader] 语言变更为${newLocale}，正在加载所有命名空间`);
        // 语言变更时，先将i18nReady设置为false
        i18nReady.value = false;
        loadAllNamespaces(newLocale);
      }
    });
  }

  // 监听路由变化
  if (process.client) {
    nuxtApp.hook('page:finish', () => {
      const currentLocale = i18n?.locale?.value;
      const route = useRoute();
      
      if (currentLocale && route.path) {
        console.log(`[i18n-namespace-loader] 页面导航到${route.path}，加载相应命名空间`);
        loadNamespacesForCurrentPath(currentLocale, route.path);
      }
    });
  }
  
  // 提供全局函数和状态
  return {
    provide: {
      loadNamespace,
      loadAllNamespaces,
      loadNamespacesForCurrentPath,
      // 提供一个函数用于检查i18n是否加载完成
      checkI18nReady: () => i18nReady.value
    }
  }
}); 