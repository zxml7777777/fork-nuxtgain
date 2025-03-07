<script setup lang='ts'>
const { t } = useI18n()
const localePath = useLocalePath()

useHead({
  title: 'AIToolSite Finish Auth',
})

onMounted(async () => {
  await navigateTo(localePath('/dashboard/'))
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
