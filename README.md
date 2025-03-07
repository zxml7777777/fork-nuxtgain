# NuxtGain 通用 AI 工具模板平台

## 项目概述

NuxtGain 是一个基于 Nuxt.js 构建的强大框架，旨在简化多个 AI 工具站点的快速创建和部署。通过将特定工具的代码与通用框架分离，NuxtGain 允许开发者使用一套核心代码库创建多个不同目的的 AI 工具网站。

## 核心目标

1. **模块化设计**: 所有组件、功能和内容均采用模块化设计，便于重用和自定义
2. **配置驱动**: 通过集中式配置文件控制站点设置，减少代码修改
3. **多语言支持**: 改进的 i18n 系统，使内容管理和更新更加简单高效
   - 详细使用指南请参考 [i18n 使用指南](./docs/i18n-guide.md)
4. **工具抽象**: 轻松集成不同类型的 AI 工具，无需大量修改核心代码

## 迁移路线图

### 第一阶段：基础模板创建

1. **移除 Magic-Resume 特定内容** ✅
   - 删除所有与简历工具相关的特定组件和功能 ✅
   - 移除硬编码的 "Magic-Resume" 和 "resume" 术语 ✅
   - 将特定于简历的数据结构转换为通用格式 ✅

2. **实现 i18n 内容系统重构** ✅
   - 在 `i18n/` 目录下创建基于页面的 JSON 文件结构 ✅
   - 每个页面对应一个 JSON 文件 (如 `landing.json`, `pricing.json`, `auth.json` 等) ✅
   - 保持 TS 文件中仅包含必要的翻译键，将实际内容放在 JSON 中 ✅
   - 创建一个自动加载所有 JSON 文件的系统 ✅

3. **建立统一配置系统** ✅
   - 创建 `config/` 目录存放所有配置文件 ✅
   - 实现 `site.config.ts` 用于站点基本信息配置 ✅
   - 实现 `theme.config.ts` 用于主题和样式配置 ✅
   - 实现 `tools.config.ts` 用于 AI 工具功能配置 ✅

### i18n 内容系统详细设计

```
app/
└── i18n/
    ├── en/
    │   ├── common.json     # 公共翻译内容
    │   ├── landing.json    # 首页内容
    │   ├── pricing.json    # 定价页内容
    │   ├── auth.json       # 验证页内容
    │   ├── dashboard.json  # 仪表盘内容
    │   └── ...
    ├── ua/
    │   ├── common.json
    │   ├── landing.json
    │   └── ...
    ├── index.ts            # 导出所有翻译内容
    └── vue-i18n.ts         # i18n 配置
```

**示例: `common.json`**
```json
{
  "save": "Save",
  "continue": "Continue",
  "remove": "Remove",
  "current": "Current",
  "startDate": "Start date",
  "endDate": "End date",
  "datePlaceholder": "MM/YYYY"
}
```

**示例: `landing.json`**
```json
{
  "heroTitle1": "Stop Struggling with your Document",
  "heroTitle2": "Let AI Do the Work for You",
  "heroSubtitle": "Create a Professional Document in Just 10 Minutes",
  "heroTrusted": "Trusted by {count} Users",
  "heroGetStarted": "Create New Document",
  "testimonials": "Testimonials"
}
```

**在 TS 文件中的使用方式:**
```typescript
// 从 en/index.ts 加载所有翻译
export const englishWords = {
  common: () => import('./en/common.json'),
  landing: () => import('./en/landing.json'),
  pricing: () => import('./en/pricing.json'),
  // ...其他页面
}
```

## 配置系统详细设计

**配置目录结构:**
```
app/
└── config/
    ├── site.config.ts      # 站点基础配置
    ├── theme.config.ts     # 主题和样式配置
    ├── tools.config.ts     # AI 工具功能配置
    └── i18n.config.ts      # 国际化配置
```

**站点配置示例:**
```typescript
export default {
  name: 'AIToolSite',         // 替代 Magic-Resume
  domain: 'aitoolsite.com',   // 替代 magic-resume.ai
  description: '使用 AI 增强您的工作流程',
  logoPath: '/logo.svg',
  contactEmail: 'support@aitoolsite.com',
  socialLinks: {
    twitter: 'https://twitter.com/aitoolsite',
    facebook: 'https://facebook.com/aitoolsite',
    // ...其他社交媒体
  }
}
```

## 实施步骤

1. **基础模板创建**
   - [x] 移除 Magic-Resume 特定内容和引用
   - [x] 建立配置目录和基础配置文件
   - [ ] 重构现有组件，移除特定工具依赖

2. **i18n 系统重构**
   - [x] 从 TS 文件中提取翻译内容到 JSON 文件
   - [x] 为每个页面创建对应的 JSON 文件
   - [x] 修改 i18n 加载逻辑，支持按需加载

3. **组件抽象化**
   - [ ] 将特定工具组件重构为通用组件
   - [ ] 实现组件配置系统
   - [ ] 创建可定制的工具模板

4. **测试与调整**
   - [x] 创建一个简单测试站点验证配置系统
   - [x] 测试多语言支持和内容切换
   - [ ] 验证组件复用和自定义能力

## 下一步开发计划

- **工具 API 抽象层**: 为不同的 AI 工具创建统一的 API 接口
- **主题系统扩展**: 增强主题系统，支持更多自定义选项
- **内容生成工具**: 开发工具自动生成 i18n 文件和博客内容
- **部署流程优化**: 创建自动化脚本简化新站点部署

通过这种模块化、配置驱动的方法，NuxtGain 将使您能够快速部署多个 AI 工具站点，只需更改配置和实现特定工具的核心功能，大大减少开发时间和资源投入。