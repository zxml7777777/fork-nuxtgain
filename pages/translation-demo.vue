<script setup lang="ts">
// Nuxt 3中使用useHead
useHead({
  title: '翻译演示',
  meta: [
    { name: 'description', content: '演示如何处理复杂JSON对象的翻译' }
  ]
})
</script>

<template>
  <div>
    <header class="bg-blue-600 text-white p-4">
      <div class="container mx-auto">
        <h1 class="text-2xl font-bold">翻译演示页面</h1>
        <p class="text-white/80">演示如何处理复杂JSON对象的翻译</p>
      </div>
    </header>
    
    <main class="container mx-auto py-8">
      <div class="mb-8">
        <nav class="mb-4">
          <NuxtLink to="/" class="text-blue-600 hover:underline">
            <Icon name="i-heroicons-home" class="mr-1" />
            返回首页
          </NuxtLink>
        </nav>
        
        <h2 class="text-3xl font-bold mb-4">复杂JSON翻译解决方案</h2>
        <p class="text-lg mb-6">
          这个页面演示了如何处理复杂的嵌套JSON对象翻译问题，通过从对象中提取静态文本并使用现有的翻译资源。
        </p>
      </div>
      
      <!-- 引入演示组件 -->
      <ComplexTranslation />
      
      <div class="mt-12 bg-gray-100 p-6 rounded-lg">
        <h3 class="text-xl font-bold mb-4">如何使用</h3>
        <p class="mb-4">在您的组件中，您可以按照以下方式使用增强的翻译函数：</p>
        
        <pre class="bg-white p-4 rounded overflow-auto text-sm">
import { translateComplex } from '~/utils/i18n-helper'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 处理普通文本
const simpleText = translateComplex(t, 'Simple text')

// 处理复杂JSON对象
const complexObject = {
  body: {
    static: 'Let AI Do the Work for You'
  }
}
const translatedText = translateComplex(t, complexObject)
        </pre>
      </div>
    </main>
  </div>
</template> 