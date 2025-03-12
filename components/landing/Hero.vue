<script setup lang="ts">
import { NuxtImg } from '#components';
import { useI18n } from 'vue-i18n'
import { safeTranslate } from '~/utils/i18n-helper'

const { t, locale } = useI18n()

// 创建安全的翻译函数
const st = (key: string) => safeTranslate(key)
</script>

<template>
  <section class="py-20 bg-gradient-to-b from-blue-50 via-transparent to-transparent">
    <!-- Text Block -->
    <div class="text-center flex flex-col items-center justify-center">
      <h1
        class="font-merriweather lg:!leading-tight text-3xl md:text-5xl lg:text-6xl font-bold lg:tracking-tight text-neutral-5"
      >
        {{ st('landing.heroTitle1') }} <br>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#44acff] to-[#91ccf5]">
          {{ st('landing.heroTitle2') }}
        </span>
      </h1>
      <p class="text-lg md:text-xl lg:text-2xl mt-4 text-slate-600 text-center font-medium">
        {{ st('landing.heroSubtitle') }}
      </p>
      <div class="mt-6 mx-auto flex flex-col justify-center gap-3">
        <div>
          <UButton
            class="flex w-full items-center justify-center text-center"
            size="xl"
            icon="i-heroicons-rocket-launch"
            trailing
          >
            <span>
              {{ st('landing.heroGetStarted') }}
            </span>
          </UButton>
        </div>
        <span class="underline text-xs text-slate-600 cursor-pointer hover:text-slate-800 hover:no-underline">
          {{ st('landing.heroGetStartedSubtitle') }}
        </span>
      </div>
      <MarketingRating
        class="self-center my-7"
        :rating="5"
        :text="st('landing.heroTrusted')"
      />
    </div>

    <div class="w-full lg:w-9/12 mx-auto mt-5">
      <NuxtImg  
        v-if="locale === 'en'"
        src="/logo.png"
        alt="MagicResume UI"
        class="rounded-lg border border-slate-200 shadow-xl w-full"
      />

      <NuxtImg
        v-else
        src="/logo.png"
        alt="MagicResume інтерфейс"
        class="rounded-lg border border-slate-200 shadow-xl w-full"
      />
    </div>
  </section>
</template>
