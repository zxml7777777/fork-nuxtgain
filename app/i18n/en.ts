// 导入JSON翻译文件
import common from './en/common.json'
import landing from './en/landing.json'
import auth from './en/auth.json'
import dashboard from './en/dashboard.json'

// 添加这个导出
export const englishWords = {
  common,
  landing,
  auth,
  dashboard
}

// 保留原有的默认导出
export default {
  common,
  landing,
  auth,
  dashboard
}
