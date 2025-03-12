# i18n 命名空间加载指南

## 概述

本项目使用了 Vue I18n 国际化框架，并实现了一个自动命名空间加载系统。这个系统能够确保所有页面所需的翻译命名空间（如 common, landing, auth, dashboard 等）在页面加载时和语言切换时自动加载。

## 可用命名空间

目前系统支持以下命名空间：

- `common` - 公共翻译，如按钮、导航等
- `landing` - 登陆页面和营销相关内容
- `auth` - 身份验证相关的内容
- `dashboard` - 仪表板和用户面板相关内容

## 命名空间加载器

命名空间加载器（`i18n-namespace-loader.client.ts`）是一个客户端插件，它会：

1. 在应用启动时自动加载当前语言的所有命名空间
2. 在语言切换时自动加载新语言的所有命名空间
3. 提供可以在组件中使用的辅助函数来手动加载命名空间

### 使用方法

在大多数情况下，你不需要手动加载命名空间，因为插件已经自动处理了。但如果你需要手动加载，可以使用以下方法：

```vue
<script setup lang="ts">
// 获取nuxtApp实例
const nuxtApp = useNuxtApp();
const { locale } = useI18n();

// 加载特定命名空间
function loadMyNamespace() {
  if (nuxtApp.$loadNamespace && locale.value) {
    // 参数1: 当前语言，参数2: 命名空间名称
    nuxtApp.$loadNamespace(locale.value, 'dashboard'); 
  }
}

// 加载所有命名空间
function loadAllMyNamespaces() {
  if (nuxtApp.$loadAllNamespaces && locale.value) {
    const results = nuxtApp.$loadAllNamespaces(locale.value);
    console.log('命名空间加载结果:', results);
  }
}
</script>
```

## 添加新的命名空间

如果你需要添加新的命名空间，请按照以下步骤操作：

1. 在各语言目录下创建新的 JSON 文件（如 `i18n/en/new-namespace.json`）
2. 更新对应语言的 `i18n/[lang].ts` 文件，导入并导出新命名空间
3. 修改 `plugins/i18n-namespace-loader.client.ts` 文件：
   - 导入新命名空间的翻译文件
   - 将新命名空间添加到 `namespaceTranslations` 对象中
   - 将新命名空间添加到 `availableNamespaces` 数组中

示例：

```typescript
// 导入新命名空间
import newNamespaceEn from '~/i18n/en/new-namespace.json'
import newNamespaceZh from '~/i18n/zh/new-namespace.json'
import newNamespaceUa from '~/i18n/ua/new-namespace.json'

// 将新命名空间添加到翻译对象中
const namespaceTranslations: LocaleTranslations = {
  en: {
    // ... 现有命名空间 ...
    'new-namespace': newNamespaceEn
  },
  zh: {
    // ... 现有命名空间 ...
    'new-namespace': newNamespaceZh
  },
  ua: {
    // ... 现有命名空间 ...
    'new-namespace': newNamespaceUa
  }
};

// 更新可用命名空间列表
const availableNamespaces = ['common', 'landing', 'auth', 'dashboard', 'new-namespace'];
```

## 测试命名空间加载

你可以使用 `/i18n-test` 页面来测试命名空间加载是否正常工作。该页面显示了：

1. 当前语言
2. 各命名空间的加载状态
3. 切换语言的按钮
4. 手动重新加载命名空间的功能

## 故障排除

如果你遇到翻译键显示而不是翻译内容（例如显示 `dashboard.pageTitle` 而不是 "dashboard"），可能是因为：

1. 命名空间未正确加载
2. 翻译键在当前语言的命名空间中不存在

可以通过以下方法排除故障：

1. 打开浏览器控制台查看是否有加载错误
2. 访问 `/i18n-test` 页面检查命名空间加载状态
3. 使用 `/i18n-test` 页面上的"重新加载所有命名空间"按钮尝试手动加载
4. 确认翻译键在对应语言的 JSON 文件中存在 