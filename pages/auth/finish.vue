<script setup lang='ts'>
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

useHead({
  title: 'AIToolSite Finish Auth',
})

onMounted(async () => {
  // 获取重定向URL，如果没有则默认到dashboard
  const redirectTo = route.query.redirect as string
  const targetPath = redirectTo || '/app/dashboard'
  
  // 确保只重定向到内部路径
  const normalizedPath = targetPath.startsWith('/') ? targetPath : '/app/dashboard'
  
  await navigateTo(localePath(normalizedPath))
})
</script>

<template>
  <div class="flex items-center justify-center text-center flex-col gap-5">
    <p>
      {{ t('common.finishAuth') }}
    </p>

    <BaseLoader />
  </div>
</template>
