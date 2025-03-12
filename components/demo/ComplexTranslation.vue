<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { safeTranslate, $t, translateComplex, safeTranslateWithFunction } from '~/utils/i18n-helper'

const { t, locale } = useI18n()

// 示例JSON对象，模拟用户提供的数据
const complexJsonExample = ref({
  "type": 0,
  "start": 0,
  "end": 26,
  "loc": {
    "start": {
      "line": 1,
      "column": 1,
      "offset": 0
    },
    "end": {
      "line": 1,
      "column": 27,
      "offset": 26
    },
    "source": "Let AI Do the Work for You"
  },
  "body": {
    "type": 2,
    "start": 0,
    "end": 26,
    "loc": {
      "start": {
        "line": 1,
        "column": 1,
        "offset": 0
      },
      "end": {
        "line": 1,
        "column": 27,
        "offset": 26
      }
    },
    "items": [
      {
        "type": 3,
        "start": 0,
        "end": 26,
        "loc": {
          "start": {
            "line": 1,
            "column": 1,
            "offset": 0
          },
          "end": {
            "line": 1,
            "column": 27,
            "offset": 26
          }
        }
      }
    ],
    "static": "Let AI Do the Work for You"
  }
})

// 测试提取和翻译
const extractedText = ref('')
const translatedText = ref('')
const isClient = process.client

onMounted(() => {
  // 在组件挂载后执行提取和翻译
  updateTranslation()
})

// 切换语言并更新翻译
function changeLanguage(lang: string) {
  locale.value = lang
  updateTranslation()
}

// 更新提取和翻译结果
function updateTranslation() {
  const json = complexJsonExample.value
  
  // 从复杂JSON中提取静态文本
  import('~/utils/i18n-helper').then(({ extractTranslationText }) => {
    extractedText.value = extractTranslationText(json)
  })
  
  // 翻译提取的文本
  import('~/utils/i18n-helper').then(({ translateComplex }) => {
    translatedText.value = translateComplex(t, json)
  })
}
</script>

<template>
  <div class="container mx-auto p-6 bg-white shadow-md rounded-lg">
    <h2 class="text-2xl font-bold mb-6">翻译和水合演示</h2>
    
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">当前语言</h3>
      <div class="flex space-x-4">
        <button 
          v-for="lang in ['en', 'zh', 'ua']" 
          :key="lang"
          @click="changeLanguage(lang)"
          class="px-4 py-2 border rounded hover:bg-blue-50 transition"
          :class="{ 'bg-blue-100 border-blue-500': locale === lang }"
        >
          {{ lang === 'en' ? 'English' : lang === 'zh' ? '中文' : 'Українська' }}
        </button>
      </div>
    </div>
    
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">复杂JSON对象</h3>
      <pre class="bg-gray-100 p-4 rounded overflow-auto text-xs">{{ JSON.stringify(complexJsonExample, null, 2) }}</pre>
    </div>
    
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">提取的文本</h3>
      <div class="bg-gray-100 p-4 rounded">{{ extractedText }}</div>
    </div>
    
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">翻译结果</h3>
      <div class="bg-blue-100 p-4 rounded">{{ translatedText }}</div>
    </div>
    
    <!-- 新增：展示不同翻译方式 -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">服务端/客户端翻译策略对比</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-100 p-4 rounded">
          <h4 class="font-medium mb-3">传统翻译方式</h4>
          <p class="mb-2">服务端: {{ isClient ? '（不可见）' : t('landing.heroTitle') }}</p>
          <p>客户端: {{ isClient ? t('landing.heroTitle') : '（不可见）' }}</p>
          <div class="mt-3 text-sm text-gray-600">
            问题: 服务端和客户端使用不同的翻译方式，导致水合不匹配
          </div>
        </div>
        
        <div class="bg-blue-100 p-4 rounded">
          <h4 class="font-medium mb-3">安全翻译方式 (推荐)</h4>
          <p class="mb-2">服务端: {{ $t('landing.heroTitle') }}</p>
          <p>客户端: {{ $t('landing.heroTitle') }}</p>
          <div class="mt-3 text-sm text-gray-600">
            解决方案: 服务端返回占位符，客户端替换为实际翻译
          </div>
        </div>
      </div>
    </div>
    
    <!-- 新增：对比示例 -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">翻译函数示例</h3>
      <div class="bg-gray-100 p-4 rounded">
        <ul class="space-y-3">
          <li>
            <strong>$t()简写函数:</strong> 
            <span class="ml-2 px-2 py-1 bg-blue-50 rounded">{{ $t('landing.heroTitle') }}</span>
          </li>
          <li>
            <strong>safeTranslate()函数:</strong> 
            <span class="ml-2 px-2 py-1 bg-blue-50 rounded">{{ safeTranslate('landing.heroSubtitle') }}</span>
          </li>
          <li>
            <strong>动态翻译示例:</strong> 
            <span class="ml-2 px-2 py-1 bg-blue-50 rounded">{{ $t('landing.cta.' + (isClient ? 'start' : 'demo')) }}</span>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- 新增：SafeTranslate组件示例 -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">SafeTranslate组件示例</h3>
      <div class="bg-blue-100 p-4 rounded">
        <p><SafeTranslate path="landing.heroTitle" tag="strong" /></p>
        <p class="mt-2"><SafeTranslate path="landing.heroSubtitle" /></p>
      </div>
    </div>
    
    <div class="mt-8">
      <p class="text-sm text-gray-600">
        这个演示展示了如何解决服务端渲染和客户端水合时的翻译不一致问题。
        通过在服务端使用占位符，并在客户端水合后替换为实际翻译，避免了水合错误。
      </p>
    </div>
  </div>
</template> 