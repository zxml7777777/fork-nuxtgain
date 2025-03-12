<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ComplexTranslation from '~/components/demo/ComplexTranslation.vue'
import { $t, safeTranslate, replaceTranslationPlaceholders } from '~/utils/i18n-helper'
import { useHead } from '#imports'

// 设置页面元数据
useHead({
  title: 'i18n解决方案演示 - NuxtGain',
  meta: [
    { name: 'description', content: '演示Nuxt应用中SSR/CSR国际化解决方案' }
  ]
})

const isClient = process.client
const mounted = ref(false)

// 在客户端挂载后标记
onMounted(() => {
  mounted.value = true
  
  // 手动触发占位符替换，用于演示
  if (isClient) {
    setTimeout(() => {
      replaceTranslationPlaceholders()
    }, 100)
  }
})
</script>

<template>
  <div class="container mx-auto p-4">
    <header class="mb-8">
      <h1 class="text-3xl font-bold mb-2">{{ $t('i18n解决方案演示') }}</h1>
      <p class="text-lg text-gray-600">
        解决Nuxt应用中服务端渲染和客户端水合的国际化问题
      </p>
    </header>

    <main>
      <section class="mb-10 bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-semibold mb-4">🚀 解决方案概述</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-bold mb-2">问题</h3>
            <ul class="list-disc ml-5 space-y-2">
              <li>服务端渲染(SSR)和客户端水合(hydration)翻译内容不一致</li>
              <li>导致DOM不匹配，触发额外渲染和页面闪烁</li>
              <li>影响性能和用户体验</li>
            </ul>
          </div>
          
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-bold mb-2">解决方案</h3>
            <ul class="list-disc ml-5 space-y-2">
              <li>服务端渲染时使用占位符 <code>[[translation.key]]</code></li>
              <li>客户端水合后替换占位符为实际翻译</li>
              <li>DOM匹配一致，避免水合错误</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section class="mb-10 bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-semibold mb-4">🔄 水合过程演示</h2>
        
        <div class="border p-4 rounded mb-4">
          <div class="flex justify-between mb-2">
            <strong>翻译键:</strong>
            <code>landing.heroTitle</code>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-yellow-50 p-3 rounded">
              <h4 class="mb-2">服务端渲染(占位符)</h4>
              <p class="border border-dashed border-yellow-500 p-2 rounded">
                {{ isClient && !mounted ? '[[landing.heroTitle]]' : '(不可见)' }}
              </p>
            </div>
            
            <div class="bg-green-50 p-3 rounded">
              <h4 class="mb-2">客户端水合后(实际翻译)</h4>
              <p class="border border-dashed border-green-500 p-2 rounded">
                {{ isClient && mounted ? $t('landing.heroTitle') : '(不可见)' }}
              </p>
            </div>
          </div>
        </div>
        
        <div class="text-sm text-gray-600 mb-4">
          <p>💡 在实际项目中，占位符在服务端渲染后会被替换为实际翻译内容，不会出现闪烁。</p>
        </div>
      </section>
      
      <section class="mb-10 bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-semibold mb-4">💻 使用方法</h2>
        
        <div class="mb-6">
          <h3 class="text-xl mb-3">1. 直接使用 $t 函数</h3>
          <div class="bg-gray-100 p-4 rounded mb-3">
            <pre v-pre><code>{{ $t('landing.heroTitle') }}</code></pre>
          </div>
          <p class="mb-2">结果: <span class="px-2 py-1 bg-blue-50 rounded">{{ $t('landing.heroTitle') }}</span></p>
        </div>
        
        <div class="mb-6">
          <h3 class="text-xl mb-3">2. 使用 safeTranslate 函数</h3>
          <div class="bg-gray-100 p-4 rounded mb-3">
            <pre v-pre><code>{{ safeTranslate('landing.heroSubtitle') }}</code></pre>
          </div>
          <p class="mb-2">结果: <span class="px-2 py-1 bg-blue-50 rounded">{{ safeTranslate('landing.heroSubtitle') }}</span></p>
        </div>
        
        <div class="mb-6">
          <h3 class="text-xl mb-3">3. 使用 SafeTranslate 组件</h3>
          <div class="bg-gray-100 p-4 rounded mb-3">
            <pre v-pre><code><SafeTranslate path="landing.heroTitle" tag="strong" /></code></pre>
          </div>
          <p class="mb-2">结果: <SafeTranslate path="landing.heroTitle" tag="strong" /></p>
        </div>
      </section>
      
      <section class="mb-10 bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-semibold mb-4">📋 示例</h2>
        <ComplexTranslation />
      </section>
    </main>
  </div>
</template>

<style scoped>
code {
  font-family: monospace;
  padding: 2px 4px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}
</style> 