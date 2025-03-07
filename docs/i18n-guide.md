# NuxtGain 多语言系统使用指南

## 概述

NuxtGain 的多语言系统基于 i18n 模块，采用基于页面的 JSON 文件结构，使内容管理和更新更加简单高效。本文档将介绍如何使用和扩展多语言支持。

## 目录结构

```
app/
└── i18n/
    ├── en/                   # 英文翻译目录
    │   ├── common.json       # 公共翻译内容
    │   ├── landing.json      # 首页内容
    │   ├── pricing.json      # 定价页内容
    │   ├── auth.json         # 验证页内容
    │   ├── dashboard.json    # 仪表盘内容
    │   └── ...
    ├── zh/                   # 中文翻译目录
    │   ├── common.json
    │   ├── landing.json
    │   └── ...
    ├── ua/                   # 乌克兰语翻译目录
    │   ├── common.json
    │   ├── landing.json
    │   └── ...
    ├── index.ts              # 导出所有翻译内容
    └── vue-i18n.ts           # i18n 配置
```

## 基本使用

### 翻译键的使用

在 Vue 组件中使用翻译内容：

```vue
<template>
  <div>
    <h1>{{ $t('common.information') }}</h1>
    <p>{{ $t('landing.heroSubtitle') }}</p>
    
    <!-- 带参数的翻译 -->
    <p>{{ $t('landing.heroTrusted', { count: 5000 }) }}</p>
  </div>
</template>

<script setup>
const { t } = useI18n();

// 在 JavaScript 中使用
const title = t('common.information');
</script>
```

### 切换语言

```vue
<template>
  <div>
    <button @click="changeLocale('en')">English</button>
    <button @click="changeLocale('zh')">中文</button>
    <button @click="changeLocale('ua')">Українська</button>
  </div>
</template>

<script setup>
const { locale, setLocale } = useI18n();

function changeLocale(localeCode) {
  setLocale(localeCode);
}
</script>
```

## 添加新翻译内容

1. 在对应语言目录下的 JSON 文件中添加新的翻译键值对
2. 确保所有支持的语言都添加了相同的键

例如，在 `en/common.json`、`zh/common.json` 和 `ua/common.json` 中添加：

```json
{
  "newKey": "New content in English"
}
```

```json
{
  "newKey": "中文的新内容"
}
```

```json
{
  "newKey": "Новий вміст українською"
}
```

## 添加新页面翻译文件

1. 创建新的 JSON 文件，如 `en/new-page.json`
2. 在 `i18n/index.ts` 中的 `availableModules` 数组中添加新模块名称
3. 在每个语言的导出对象中添加新模块的导入

```typescript
// 修改 availableModules 数组
const availableModules = [
  'common',
  'landing',
  'auth',
  'dashboard',
  'pricing',
  'blog',
  'new-page' // 添加新模块
];

// 在每个语言的导出对象中添加
export const englishMessages = {
  // 现有模块
  'new-page': () => import('./en/new-page.json'), // 添加新模块
};
```

## 添加新语言支持

1. 创建新语言目录，如 `i18n/fr/`
2. 添加所有必需的翻译文件 (common.json, landing.json 等)
3. 在 `supportedLocales` 数组中添加新语言
4. 在 `messages` 导出对象中添加新语言
5. 在 `config/i18n.config.ts` 中添加新语言配置

```typescript
// 在 i18n/index.ts 中
const supportedLocales = ['en', 'ua', 'zh', 'fr']; // 添加新语言

// 创建新语言的导出对象
export const frenchMessages = {
  common: () => import('./fr/common.json'),
  landing: () => import('./fr/landing.json'),
  // 其他模块
};

// 在 messages 导出对象中添加
export const messages = {
  en: englishMessages,
  ua: ukrainianMessages,
  zh: chineseMessages,
  fr: frenchMessages // 添加新语言
};

// 在 config/i18n.config.ts 中
export default {
  // 现有配置
  availableLocales: ['en', 'ua', 'zh', 'fr'], // 添加新语言
  locales: [
    // 现有语言
    {
      code: 'fr',
      name: 'Français',
      iso: 'fr-FR',
      file: 'fr'
    }
  ],
};
```

## 按需加载翻译

`loadTranslationModule` 函数可以按需加载特定的翻译模块，适用于大型应用优化：

```typescript
import { loadTranslationModule } from '~/i18n';

// 异步加载特定模块的翻译
const dashboardTranslations = await loadTranslationModule('en', 'dashboard');
```

## 最佳实践

1. **保持一致的键结构**：在所有语言文件中使用相同的键结构
2. **使用嵌套对象**：对复杂内容使用嵌套对象结构，提高可维护性
3. **模块化组织**：按照页面或功能模块组织翻译文件
4. **使用参数**：对于包含动态内容的文本，使用参数化翻译
5. **保持简洁**：避免在翻译文件中包含大段文本，考虑将其拆分为多个键
6. **定期维护**：定期检查并更新所有语言的翻译内容

## 调试提示

如果遇到翻译不显示的问题：

1. 检查键名是否正确，包括大小写和命名空间
2. 确认翻译文件是否正确导入
3. 验证当前语言设置是否正确
4. 检查控制台错误信息，寻找加载失败的提示

可以使用以下代码调试当前语言和可用翻译：

```typescript
const { locale, locales, messages } = useI18n();
console.log('Current locale:', locale.value);
console.log('Available locales:', locales.value);
console.log('Available messages:', messages.value);
``` 