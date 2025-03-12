<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { safeTranslateWithFunction as safeTranslate } from '~/utils/i18n-helper'

interface Product {
  id: number;
  name: string;
  code: string;
  subtitle: string;
  price: number;
  features: string[];
  buttonText: string;
  link?: string;
  disabled?: boolean;
  discounted?: string;
}

const { t, locale } = useI18n()

// 创建安全的翻译函数
const st = (key: string, fallback?: string) => safeTranslate(t, key, {}) || fallback || key
const stm = (key: string): string[] => {
  const result = t(key)
  if (Array.isArray(result)) return result
  return []
}

// 实时商品数据
const oneTimeProducts = computed(() => [
  {
    id: 1,
    name: st('landing.freeTitle', '免费版'),
    code: 'free',
    subtitle: st('landing.freeSubtitle', '开始使用基本功能'),
    price: 0,
    features: stm('landing.freeFeatures'),
    buttonText: st('landing.freeButton', '免费开始'),
    link: '/auth',
    disabled: !props.free,
  },
  {
    id: paymentState.getBasicOneTime?.id || 2,
    name: st('landing.basicTitle', '基础版'),
    code: 'basic',
    subtitle: st('landing.basicSubtitle', '适合个人使用的基础功能'),
    price: paymentState.getBasicOneTime?.price || 9,
    discounted: st('common.pricing.basicDiscounted', '原价 $12'),
    features: stm('landing.basicFeatures'),
    buttonText: st('landing.basicButton', '购买基础版'),
    link: paymentState.getBasicOneTime?.link || '/auth',
  },
  {
    id: paymentState.getBundleOneTime?.id || 3,
    name: st('landing.bundleTitle', '专业版'),
    code: 'bundle',
    price: paymentState.getBundleOneTime?.price || 19,
    discounted: st('common.pricing.bundleDiscounted', '原价 $29'),
    subtitle: st('landing.bundleSubtitle', '适合专业人士的全部功能'),
    features: stm('landing.bundleFeatures'),
    buttonText: st('landing.bundleButton', '购买专业版'),
    link: paymentState.getBundleOneTime?.link || '/auth',
  },
] as Product[])

const subscriptionProducts = computed(() => [
  {
    id: 4,
    name: st('subscriptionProducts.proTitle', '专业版订阅'),
    code: 'professional',
    price: paymentState.getProSubscription?.price || 5,
    subtitle: st('subscriptionProducts.proSubtitle', '按月订阅所有专业功能'),
    features: stm('subscriptionProducts.proFeatures'),
    buttonText: st('subscriptionProducts.proButton', '开始订阅'),
    link: paymentState.getProSubscription?.link || '/auth',
  },
  {
    id: 5,
    name: st('subscriptionProducts.customTitle', '企业定制版'),
    code: 'custom',
    subtitle: st('subscriptionProducts.customSubtitle', '适合企业的定制化功能'),
    features: stm('subscriptionProducts.customFeatures'),
    buttonText: st('subscriptionProducts.customButton', '联系我们'),
  },
] as Product[])

// 确保tabs的label是字符串类型
const tabs = computed(() => [
  { key: 'one_time', label: String(st('landing.oneTime', '一次性购买')), default: true },
  // { key: 'subscription', label: st('tabs.subscription', '订阅') },
])

const isOneTime = ref(true)
const products = computed(() => isOneTime.value ? oneTimeProducts.value : subscriptionProducts.value)

const paymentState = usePaymentState()
const user = useSupabaseUser()

async function priceClicked(link?: string) {
  if (user.value && link) {
    try {
      const _link = paymentState.generateProductLink(link)
      await navigateTo(_link, { external: true })
    } catch (error) {
      console.error('生成链接出错:', error)
      await navigateTo('/auth')
    }
  } else {
    getStartedAnonymously()
  }
}

async function getStartedAnonymously() {
  await navigateTo('/auth')
}

// 调试用的显示翻译状态
const showTranslationDebug = ref(false)

const isLoading = ref(true)

// 模拟加载完成
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})

const props = defineProps<{
  free: boolean
}>()
</script>

<template>
  <div class="max-w-screen-lg mx-auto">
    <!-- 调试开关 -->
    <div class="text-right mb-2">
      <button 
        @click="showTranslationDebug = !showTranslationDebug" 
        class="text-sm text-gray-500 hover:text-gray-700"
      >
        {{ showTranslationDebug ? '隐藏调试' : '显示调试' }}
      </button>
    </div>
    
    <!-- 调试信息 -->
    <div v-if="showTranslationDebug" class="bg-gray-100 p-4 rounded mb-4 text-sm">
      <h3 class="font-bold mb-2">翻译调试信息</h3>
      <p>当前语言: {{ locale }}</p>
      <div class="mt-2">
        <p class="font-semibold">翻译测试:</p>
        <ul class="pl-4">
          <li>landing.freeTitle: {{ st('landing.freeTitle') }}</li>
          <li>landing.basicTitle: {{ st('landing.basicTitle') }}</li>
          <li>common.popular: {{ st('common.popular') }}</li>
          <li>landing.freeFeatures: {{ stm('landing.freeFeatures').join(', ') }}</li>
        </ul>
      </div>
    </div>
    
    <UTabs
      :items="tabs"
      class="max-w-sm mx-auto mb-8"
      @change="isOneTime = !isOneTime"
    />
    <div class="pricing-container">
      <div class="pricing-cards">
        <div v-for="(product, index) in products" :key="index" 
             class="pricing-card" 
             :class="{'pricing-card-highlighted': product.code === 'bundle'}"
             @click="priceClicked(product.link)">
          <div class="flex flex-col flex-grow">
            <h3 class="text-3xl font-semibold mb-4">
              {{ product.name }}
            </h3>
            <h4 class="text-md font-semibold text-gray-500 mb-4 subtitle">
              {{ product.subtitle }}
            </h4>
            <p class="text-5xl font-medium text-primary flex justify-center gap-[20px] items-end">
              <span v-if="product.discounted && !isLoading" class="text-neutral-4 text-xl line-through">
                {{ product.discounted }}
              </span>
              <span v-if="isLoading" class="price-placeholder price-placeholder-lg"></span>
              <span v-else>
                {{ product.code === 'custom' ? st('common.pricing.customPrice', '联系获取价格') : `${st('common.pricing.currencySymbol', '$')}${product.price}` }}
              </span>
            </p>
            <p
              :class="{ invisible: product.code === 'free' || product.code === 'custom' }"
              class="mt-2 font-medium"
            >
              {{ isOneTime ? st('landing.oneTime', '一次性购买') : st('common.pricing.perMonth', '每月') }}
            </p>
            <div
              class="text-start my-4 flex-grow"
              :class="{
                'min-h-[270px]': isOneTime,
                'min-h-[320px]': !isOneTime,
              }"
            >
              <ul>
                <li
                  v-for="(feature, index) in product.features"
                  :key="index"
                  class="my-1 flex items-center gap-1"
                >
                  <UIcon
                    name="i-solar-check-circle-bold-duotone"
                    class="h-4 w-4"
                  /> 
                  <span v-if="!isLoading">{{ feature }}</span>
                  <div v-else class="text-placeholder w-[80%] my-1"></div>
                </li>
              </ul>
            </div>
          </div>
          <div class="mt-auto">
            <UButton
              block
              size="lg"
              external
            >
              {{ product?.buttonText ? product.buttonText : st('common.pricing.subscribe', '订阅') }}
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 占位符样式已移至全局CSS */

.pricing-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.pricing-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  width: 100%;
}

.pricing-card {
  display: flex;
  flex-direction: column;
  width: 300px; /* 统一宽度 */
  min-height: 450px; /* 统一最小高度 */
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  position: relative;
}

.pricing-card-highlighted {
  border: 2px solid #00c853;
  transform: scale(1.02);
  z-index: 1;
}

/* 确保按钮位置一致 */
.pricing-card .button-container {
  margin-top: auto;
  padding-top: 20px;
}
</style>
