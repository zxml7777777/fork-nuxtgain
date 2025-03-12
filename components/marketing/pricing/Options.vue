<script
  setup
  lang='ts'
>
const { t } = useI18n()

const paymentState = usePaymentState()
const { getBasicProductLink, getBundleProductLink } = storeToRefs(paymentState)

// 获取基础和套餐产品链接
const basicOneTimeLink = computed(() => paymentState.basicOneTimeLink || '') 
const bundleOneTimeLink = computed(() => paymentState.bundleOneTimeLink || '')

const { isMobile } = useDevice()

const activePrice = ref(1)
const isLoading = ref(true)

// 模拟加载完成
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})

async function goToCheckout(link: string) {
  const _link = paymentState.generateProductLink(link)
  await navigateTo(_link, { external: true })
}
</script>

<template>
  <div class="pricing-options-container">
    <div class="flex flex-col md:flex-row gap-4 lg:static z-10 bg-white">
      <section 
        class="pricing-option-item flex-1" 
        @mouseenter="activePrice = 0"
      >
        <a
          :href="getBasicProductLink"
          target="_blank"
          class="
          flex gap-3 border-2 border-brand-green rounded-lg cursor-pointer pointer-events-auto
          px-3 py-3 text-xl items-center justify-between h-[72px]
          "
        >
          <div class="flex items-center gap-4">
            <div
              class="transition-all rounded-full size-[22px] border border-brand-green"
              :class="activePrice === 0 ? 'border-[6px]' : 'border'"
            />
            <div>
              <b v-if="!isLoading" class="text-base md:text-lg text-brand-blue">{{ t('common.pricing.basicPrice') }}</b>
              <div v-else class="price-placeholder price-placeholder-sm"></div>
            </div>
          </div>

          <span v-if="!isLoading" class="text-center text-sm md:text-base plan-desc font-medium">
            {{ t('common.pricing.basicPlan') }}
          </span>
          <div v-else class="text-placeholder w-[120px]"></div>
          
          <UButton
            :variant="activePrice === 0 ? 'solid' : 'outline'"
            :size="isMobile ? 'xs' : 'lg'"
            class="transition-all capitalize"
            @click="goToCheckout(basicOneTimeLink)"
          >
            <span
              v-if="isMobile"
              class="font-bold"
            >
              {{ t('priceTrust.ctaMob') }}
            </span>

            <span
              v-else
              class="font-bold"
            >
              {{ t('priceTrust.cta') }}
            </span>
          </UButton>
        </a>
      </section>

      <section
        class="pricing-option-item flex-1"
        @mouseenter="activePrice = 1"
      >
        <a
          :href="getBundleProductLink"
          target="_blank"
          class="
          flex gap-3 border-2 border-brand-green rounded-lg cursor-pointer pointer-events-auto
          px-3 py-3 text-xl items-center justify-between relative h-[72px]
          "
        >
          <div class="flex items-center gap-4">
            <div
              class="transition-all rounded-full size-[22px] border-brand-green"
              :class="activePrice === 1 ? 'border-[6px]' : 'border'"
            />
            <div>
              <b v-if="!isLoading" class="text-base md:text-lg text-brand-blue">{{ t('common.pricing.bundlePrice') }}</b>
              <div v-else class="price-placeholder price-placeholder-sm"></div>
              <span
                v-if="!isLoading"
                class="
                discount-tag top-0 absolute bg-white shadow border border-brand-green
                text-base pl-2 text-neutral-3"
              >
                {{ t('common.pricing.discount') }}
              </span>
              <span
                v-else
                class="
                discount-tag top-0 absolute bg-white shadow border border-brand-green
                text-base pl-2 text-neutral-3"
              >
                <div class="price-placeholder price-placeholder-sm w-[40px] h-[16px]"></div>
              </span>
            </div>
          </div>

          <span v-if="!isLoading" class="text-center text-sm md:text-base plan-desc font-medium">{{ t('common.pricing.bundlePlan') }}</span>
          <div v-else class="text-placeholder w-[120px]"></div>
          
          <UButton
            :size="isMobile ? 'xs' : 'lg'"
            :variant="activePrice === 1 ? 'solid' : 'outline'"
            class="transition-all capitalize"
            @click="goToCheckout(bundleOneTimeLink)"
          >
            <span
              v-if="isMobile"
              class="font-bold"
            >
              {{ t('priceTrust.ctaMob') }}
            </span>

            <span
              v-else
              class="font-bold"
            >
              {{ t('priceTrust.cta') }}
            </span>
          </UButton>
        </a>
      </section>
    </div>
  </div>
</template>

<style
  scoped
  lang='scss'
>
/* 占位符样式 */
[class*="price"], 
[class*="plan"],
.plan-desc {
  min-height: 1.5em;
  position: relative;
}

/* 确保在加载占位符期间保持一致的布局 */
.discount-tag {
  min-width: 60px;
  min-height: 20px;
}

/* 自定义占位符动画 */
@keyframes loading-pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.pricing-options-container {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.pricing-option-item {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
}

/* 响应式样式 */
@media (max-width: 768px) {
  .pricing-option-item {
    width: 100%;
  }
}

/* 下面是原有的CSS */
.pricing-options {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin: 30px 0;
}

.pricing-option {
  flex: 0 0 300px; /* 固定宽度 */
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-height: 450px; /* 统一最小高度 */
}

.pricing-option-content {
  flex-grow: 1; /* 让内容区域填充空间 */
}

.pricing-option-footer {
  margin-top: auto; /* 将按钮推到底部 */
  padding-top: 20px;
}

/* 确保价格区域高度一致 */
.pricing-price-container {
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 确保特性列表区域最小高度一致 */
.pricing-features {
  min-height: 200px;
}
</style>
