<template>
  <component 
    :is="tag" 
    :class="className"
    v-html="typeof translatedContent === 'string' ? translatedContent : ''" 
  ></component>
</template>

<script>
import { computed } from 'vue'
import { safeTranslate } from '~/utils/i18n-helper'

export default {
  name: 'SafeTranslate',
  props: {
    path: {
      type: String,
      required: true
    },
    tag: {
      type: String,
      default: 'span'
    },
    className: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const translatedContent = computed(() => {
      const content = safeTranslate(props.path)
      // 确保返回的是字符串类型，如果是数组则不使用
      return content
    })

    return {
      translatedContent
    }
  }
}
</script> 