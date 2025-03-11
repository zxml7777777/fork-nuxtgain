<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { safeTranslate, translateComplex } from '~/utils/i18n-helper'

const { t, locale } = useI18n()

// 创建简单的翻译函数
const st = (key: string) => safeTranslate(t, key)

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
    <h2 class="text-2xl font-bold mb-6">复杂JSON翻译演示</h2>
    
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
    
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">正常翻译对比</h3>
      <ul class="bg-gray-100 p-4 rounded">
        <li><strong>landing.heroTitle2:</strong> {{ st('landing.heroTitle2') }}</li>
        <li><strong>直接键:</strong> {{ st('Let AI Do the Work for You') }}</li>
      </ul>
    </div>
    
    <div class="mt-8">
      <p class="text-sm text-gray-600">
        这个演示展示了如何从复杂的JSON对象中提取翻译文本，并利用现有的翻译资源进行翻译。
        在实际使用中，您可以利用 <code>translateComplex</code> 函数直接处理这种复杂对象。
      </p>
    </div>
  </div>
</template> 