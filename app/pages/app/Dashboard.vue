<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
useHead({ title: t('dashboard.pageTitle') })
</script>

<template>
  <div class="dashboard container mx-auto px-4">
    <section class="flex items-center justify-between border-b pb-4 border-neutral-300 text-neutral-400 font-xl">
      <p>你已经踏上了成功之路！</p>
      <p>你的项目:</p>
    </section>
  </div>
</template>

<style lang="scss">
.cv-dashboard {
  tbody tr td:first-child {
    @apply text-brand-blue;
    text-decoration: underline;

    &:hover {
      text-decoration: none;
      @apply text-gray-500;
    }
  }
}
</style>
