<script
  setup
  lang='ts'
>
import { useI18n } from 'vue-i18n'
import { safeTranslateWithFunction } from '~/utils/i18n-helper'

const { t } = useI18n()
const st = (key: string) => safeTranslateWithFunction(t, key)

const props = defineProps<{
  currentLink?: string
  isBlog?: boolean
}>()

// 使用翻译键
const homeText = st('common.home')
const blogText = st('common.blog')
</script>

<template>
  <div
    class="pt-8 border-typography_primary flex flex-col md:flex-row items-center md:justify-between md:text-right mb-6 md:mb-8"
  >
    <ol
      itemscope
      itemtype="https://schema.org/BreadcrumbList"
      class="flex gap-2"
    >
      <li
        itemprop="itemListElement"
        itemscope
        itemtype="https://schema.org/ListItem"
      >
        <a
          itemprop="item"
          href="/"
          class="text-blue-600 hover:underline"
        >
          <span itemprop="name">{{ homeText }}</span>
        </a>
        <meta
          itemprop="position"
          content="1"
        >
      </li>
      <span>/</span>

      <li
        itemprop="itemListElement"
        itemscope
        itemtype="https://schema.org/ListItem"
      >
        <template v-if="props.isBlog">
          <span itemprop="name">{{ blogText }}</span>
          <meta
            itemprop="position"
            content="2"
          >
        </template>
        <template v-else>
          <a
            itemscope
            itemtype="https://schema.org/WebPage"
            itemprop="item"
            itemid="/blog/"
            href="/blog/"
            class="text-blue-600 hover:underline"
          >
            <span itemprop="name">{{ blogText }}</span>
          </a>
          <meta
            itemprop="position"
            content="2"
          >
        </template>
      </li>
      <template v-if="currentLink">
        <li class="separator">
          /
        </li>
        <li
          itemprop="itemListElement"
          itemscope
          itemtype="https://schema.org/ListItem"
        >
          <span itemprop="name">{{ currentLink }}</span>
          <meta
            itemprop="position"
            content="3"
          >
        </li>
      </template>
    </ol>
  </div>
</template>

<style
  scoped
  lang='scss'
></style>
