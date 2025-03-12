<template>
  <div class="min-h-screen flex flex-col justify-between">
    <LayoutAppHeader />
    <!-- <div class="container mx-auto px-6 my-8 flex-1"> -->
    <NuxtPage />
    <!-- </div> -->
    <LandingFooter />
    <ContactFeedback />
  </div>
</template>

<script setup>
import { replaceTranslationPlaceholders } from '~/utils/i18n-helper'
import { onMounted } from 'vue'

onMounted(() => {
  // 在客户端水合完成后，替换翻译占位符
  replaceTranslationPlaceholders()
  
  // 添加全局CSS类，用于处理占位符样式
  document.body.classList.add('i18n-loaded')
})
</script>

<style>
/* 全局占位符样式 - 应用于所有包含占位符的组件 */
.i18n-loaded .i18n-placeholder,
.i18n-loaded :contains('...') {
  position: relative;
  background: none !important;
  color: inherit !important;
  animation: none !important;
}

/* 在水合之前隐藏占位符文本 */
:contains('...'):not(.i18n-loaded *) {
  min-width: 40px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f5f5f5 25%, #ebebeb 50%, #f5f5f5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  color: transparent;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
