/**
 * i18n 配置
 * 这个文件符合@intlify/unplugin-vue-i18n插件的期望格式
 */

// 导入翻译文件
import en from './en'
import ua from './ua'
import zh from './zh'

// Vue I18n插件期望有一个默认导出的函数，返回消息对象
export default function() {
  // 返回包含所有翻译的对象
  return {
    en,
    ua,
    zh
  }
} 