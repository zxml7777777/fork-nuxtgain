/**
 * i18n全局设置
 * 这个composable提供全局的i18n设置和工具函数
 */

// 定义可用的语言列表
export const locales = ['en', 'zh', 'ua'] as const
export type LocaleType = typeof locales[number]

// 默认语言（不在URL中显示）
export const defaultLocale: LocaleType = 'en'

// 语言显示名称
export const languageNames: Record<LocaleType, string> = {
  en: 'English',
  zh: '中文',
  ua: 'Українська'
}

export default function useI18nSettings() {
  const { t, locale, messages } = useI18n()
  const router = useRouter()
  const route = useRoute()

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
  }

  // 检测当前URL的语言并更新设置
  function detectAndUpdateLocale() {
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
  }

  return {
    locales,
    defaultLocale,
    languageNames,
    switchLanguage,
    detectAndUpdateLocale
  }
} 