<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const props = defineProps<{
  count?: string
  textKey: string
  textParams?: Record<string, unknown>
  textColor?: string
}>()
</script>

<template>
  <span class="flex">
    <span class="flex items-center">
      <span class="font-bold">{{ count ?? 1 }}</span>
      <Icon
        name="mdi:thunder-outline"
        class="text-lg"
      />
    </span>
    <span class="ml-[4px]" :class="textColor">{{ t(textKey, textParams || {}) }}</span>
  </span>
</template>
