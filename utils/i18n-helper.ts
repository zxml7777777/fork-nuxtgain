/**
 * i18n辅助函数，用于确保始终显示翻译内容而不是键名
 */
import enLanding from '~/i18n/en/landing.json'

// 直接将landing.json导入，用作回退
const fallbackTranslations = enLanding

/**
 * 安全的翻译函数，确保总是返回内容而不是键名
 * @param t i18n的翻译函数
 * @param key 翻译键
 * @returns 翻译后的内容或回退值
 */
export function safeTranslate(t: Function, key: string): string {
  try {
    // 尝试使用i18n的t函数翻译
    const translation = t(key)
    
    // 如果翻译的结果和键名相同，说明可能没有找到翻译
    if (translation === key && key.startsWith('landing.')) {
      // 提取键的后半部分
      const keyPart = key.split('.')[1]
      
      // 检查回退翻译中是否有这个键
      // @ts-ignore - 忽略类型检查
      if (keyPart && fallbackTranslations[keyPart]) {
        // @ts-ignore - 忽略类型检查
        return fallbackTranslations[keyPart]
      }
    }
    
    return translation
  } catch (error) {
    console.error(`[i18n-helper] 翻译键 "${key}" 错误:`, error)
    
    // 错误情况下，尝试从回退翻译中获取
    if (key.startsWith('landing.')) {
      const keyPart = key.split('.')[1]
      
      // @ts-ignore - 忽略类型检查
      if (keyPart && fallbackTranslations[keyPart]) {
        // @ts-ignore - 忽略类型检查
        return fallbackTranslations[keyPart]
      }
    }
    
    // 最终回退到键名
    return key
  }
}

/**
 * 从复杂JSON对象中提取翻译文本
 * 如果传入的是字符串，则直接返回
 * 如果传入的是复杂对象，则尝试提取body.static字段作为翻译文本
 * 
 * @param input 输入的字符串或对象
 * @returns 提取出的文本内容
 */
export function extractTranslationText(input: any): string {
  // 如果输入是字符串，直接返回
  if (typeof input === 'string') {
    return input
  }
  
  // 如果输入是对象，尝试提取body.static字段
  if (input && typeof input === 'object') {
    // 尝试直接访问body.static
    if (input.body && input.body.static && typeof input.body.static === 'string') {
      return input.body.static
    }
    
    // 尝试解析JSON字符串
    try {
      const parsed = typeof input === 'string' ? JSON.parse(input) : input
      if (parsed.body && parsed.body.static && typeof parsed.body.static === 'string') {
        return parsed.body.static
      }
    } catch (e) {
      console.error('[i18n-helper] 解析JSON失败:', e)
    }
  }
  
  // 如果无法提取，返回原始输入的字符串表示
  return String(input)
}

/**
 * 增强的翻译函数，处理复杂JSON对象
 * 首先提取文本内容，然后用常规翻译函数处理
 * 
 * @param t i18n的翻译函数
 * @param input 输入的字符串或对象
 * @returns 翻译后的内容
 */
export function translateComplex(t: Function, input: any): string {
  // 提取文本内容
  const textContent = extractTranslationText(input)
  
  // 在landing命名空间中查找对应的翻译
  // 首先尝试直接使用提取的文本作为键
  const directResult = safeTranslate(t, textContent)
  if (directResult !== textContent) {
    return directResult
  }
  
  // 如果没有直接匹配，则在landing命名空间下查找
  // 遍历所有landing.json中的键，查找匹配的值
  const keys = Object.keys(fallbackTranslations);
  
  for (const key of keys) {
    // @ts-ignore - 忽略类型检查，因为fallbackTranslations包含不同类型的值
    const value = fallbackTranslations[key];
    
    // 只比较字符串类型的值
    if (typeof value === 'string' && value === textContent) {
      return safeTranslate(t, `landing.${key}`);
    }
  }
  
  // 最后回退到原始文本
  return textContent
} 