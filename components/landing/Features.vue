<script
  setup
  lang="ts"
>
import { useI18n } from 'vue-i18n'
import { safeTranslate } from '~/utils/i18n-helper'

const { t } = useI18n()

// 创建安全的翻译函数
const st = (key: string) => safeTranslate(key)

const features = [
  {
    title: st('landing.featureTimeSaving'),
    description: st('landing.featureTimeSavingText'),
    icon: 'mdi:clock-time-five',
  },
  {
    title: st('landing.featureSuccess'),
    description: st('landing.featureSuccessText'),
    icon: 'mdi:currency-usd',
  },
  {
    title: st('landing.featureAts'),
    description: st('landing.featureAtsText'),
    icon: 'mdi:star',
  },
  {
    title: st('landing.featureEffortless'),
    description: st('landing.featureEffortlessText'),
    icon: 'mdi:rocket-launch',
  },
  {
    title: st('landing.featureUserFriendly'),
    description: st('landing.featureUserFriendlyText'),
    icon: 'mdi:robot',
  },
  {
    title: st('landing.featureInstantPdf'),
    description: st('landing.featureInstantPdfText'),
    icon: 'mdi:file-multiple',
  },
]
</script>

<template>
  <section id="features" class="py-14">
    <div class="max-w-screen-xl mx-auto px-4 text-center md:px-8">
      <div class="max-w-2xl mx-auto">
        <h2 class="font-merriweather text-4xl lg:text-5xl font-bold lg:tracking-tight text-center">
          {{ st('landing.featuresTitle') }}
        </h2>
      </div>
      <div class="mt-12">
        <ul class="grid gap-y-8 gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
          <li
            v-for="(item, index) in features"
            :key="index"
            class="space-y-3"
          >
            <div class="w-12 h-12 mx-auto bg-neutral-3/10 text-brand-blue rounded-full flex items-center justify-center">
              <Icon
                :name="item.icon"
                class="h-6 w-6 text-brand-blue"
              />
            </div>
            <h4 class="text-lg  font-semibold">
              {{ item.title }}
            </h4>
            <p>
              {{ item.description }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
