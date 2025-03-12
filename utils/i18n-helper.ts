/**
 * i18n辅助函数，用于确保始终显示翻译内容而不是键名
 */
import enLanding from '~/i18n/en/landing.json'
import { useNuxtApp } from '#app'

// 直接将landing.json导入，用作回退
const fallbackTranslations = enLanding

/**
 * 安全翻译函数 - 服务端返回占位符，客户端返回实际翻译
 * @param key 翻译键
 * @returns 翻译值或占位符
 */
export function safeTranslate(key: string): string | string[] {
  // 服务端返回占位符
  if (!process.client) {
    // 对于数组类型的特殊处理（如features列表）
    if (key.includes('Features')) {
      // 针对特性列表，返回空数组而不是占位符字符串
      // 这样可以避免后续的JSON解析错误
      return [];
    }
    
    // 对于价格信息使用特殊处理
    if (key.includes('common.pricing.') || key.includes('pricing.')) {
      if (key.includes('Price')) return "$...";
      if (key.includes('Plan')) return "...";
      if (key.includes('Discounted')) return "...";
      return "...";
    }
    // 简化其他占位符格式
    return `...`;
  }
  
  // 客户端返回实际翻译
  try {
    const { $i18n } = useNuxtApp()
    return $i18n.t(key)
  } catch (error) {
    console.error(`[i18n] 翻译错误，key: ${key}`, error)
    return key
  }
}

// 添加简写函数，方便在模板中使用
export function $t(key: string): string | string[] {
  return safeTranslate(key)
}

/**
 * 传统的安全翻译函数（向后兼容）
 * @param t i18n的翻译函数
 * @param key 翻译键
 * @param replacements 替换值
 * @returns 翻译后的内容或回退值
 */
export function safeTranslateWithFunction(t: any, key: string, replacements?: Record<string, any>): string | string[] {
  // 检查是否在客户端
  const isClient = process.client

  // 仅在客户端时翻译，服务端返回键名本身
  if (isClient) {
    try {
      // 客户端正常翻译
      return t(key, replacements || {})
    } catch (error) {
      console.error(`[i18n] 翻译错误, key: ${key}`, error)
      return key // 发生错误时返回键名
    }
  } else {
    // 对于数组类型的特殊处理（如features列表）
    if (key.includes('Features')) {
      // 针对特性列表，返回空数组而不是占位符字符串
      return [];
    }
    
    // 在服务端不进行翻译，返回一个友好的占位符
    // 对于价格信息使用特殊处理
    if (key.includes('common.pricing.') || key.includes('pricing.')) {
      if (key.includes('Price')) return "$...";
      if (key.includes('Plan')) return "...";
      if (key.includes('Discounted')) return "...";
      return "...";
    }
    // 其他类型的键使用更简单的占位符
    return `...`;
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
  const directResult = safeTranslateWithFunction(t, textContent)
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
      return safeTranslateWithFunction(t, `landing.${key}`);
    }
  }
  
  // 最后回退到原始文本
  return textContent
}

/**
 * 将服务端的翻译占位符替换为客户端的翻译结果
 * 
 * 此函数应在客户端 onMounted 钩子中调用
 */
export function replaceTranslationPlaceholders(): void {
  if (!process.client) return

  // 获取 i18n 实例
  const { $i18n } = useNuxtApp()
  
  // 查找所有包含占位符的文本节点
  const textNodes = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        return node.nodeValue && (
          (node.nodeValue.includes('[[') && node.nodeValue.includes(']]')) || 
          node.nodeValue === '...' || 
          node.nodeValue === '$...'
        )
          ? NodeFilter.FILTER_ACCEPT 
          : NodeFilter.FILTER_REJECT
      }
    }
  )

  const nodesToReplace: Array<{node: Text, value: string}> = []
  
  // 收集所有需要替换的节点
  let node
  while (node = textNodes.nextNode() as Text) {
    const text = node.nodeValue || ''
    
    // 对旧格式的占位符使用正则表达式匹配
    if (text.includes('[[') && text.includes(']]')) {
      const regex = /\[\[(.*?)\]\]/g
      let match
      let newText = text
      
      while ((match = regex.exec(text)) !== null) {
        const key = match[1] || ''
        try {
          // 确保key不为undefined
          if (key) {
            // 使用i18n翻译键
            const translation = $i18n.t(key)
            newText = newText.replace(match[0], translation)
          }
        } catch (error) {
          console.error(`[i18n] 替换占位符错误, key: ${key}`, error)
        }
      }
      
      if (newText !== text) {
        nodesToReplace.push({node, value: newText})
      }
    } else if (text === '...' || text === '$...') {
      // 这是新格式的占位符，但我们无法知道它对应的翻译键
      // 这里我们暂时不处理，由具体组件的客户端渲染处理
    }
  }
  
  // 批量替换节点内容
  for (const {node, value} of nodesToReplace) {
    node.nodeValue = value
  }
}

/**
 * 翻译工具组件 - 用于在模板中包装需要翻译的内容
 * 示例用法：
 * <SafeTranslate path="landing.heroTitle" />
 */
export const SafeTranslate = defineComponent({
  props: {
    path: {
      type: String,
      required: true
    },
    tag: {
      type: String,
      default: 'span'
    }
  },
  setup(props) {
    const { t } = useI18n()
    const isClient = process.client
    
    // 客户端渲染时正常翻译，服务端返回占位符
    const content = computed(() => {
      if (!isClient) {
        // 对于价格信息使用特殊处理
        if (props.path.includes('common.pricing.') || props.path.includes('pricing.')) {
          if (props.path.includes('Price')) return "$...";
          if (props.path.includes('Plan')) return "...";
          if (props.path.includes('Discounted')) return "...";
          return "...";
        }
        return `...`;
      }
      return t(props.path);
    })
    
    return { content }
  },
  render() {
    return h(this.tag, {}, this.content)
  }
}) 