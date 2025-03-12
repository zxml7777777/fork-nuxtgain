<script setup lang="ts">
// import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'
// import { SpeedInsights } from '@vercel/speed-insights/nuxt'

const { t } = useI18n()
useHead({
  title: 'NuxtGain',
})

const route = useRoute()
const localePath = useLocalePath()
const getCurrentUrl = () => globalThis.location?.href || route.fullPath

const payentState = usePaymentState()
const { isPaymentModalVisible } = storeToRefs(payentState)
const upgradeModalVisible = computed({
  get: () => isPaymentModalVisible.value,
  set: (value) => {
    payentState.setPaymentModalVisibility(value)
  },
})

const userState = useUserState()
const { isUserAuthVisible } = storeToRefs(userState)
const showAuth = computed({
  get: () => isUserAuthVisible.value,
  set: (value) => {
    userState.setAuthModalVisibility(value)
  },
})

// 监听用户登录状态
const supabaseUser = useSupabaseUser()
const router = useRouter()

// 使用全局i18n加载状态
const nuxtApp = useNuxtApp()
const i18nReady = useState('i18n-ready')

watch(supabaseUser, (newVal) => {
  if (newVal) {
    console.log('User logged in, closing auth modal...')
    // 关闭认证模态框
    showAuth.value = false
    
    // 只在非主页路径和非dashboard路径时才自动导航到dashboard
    const currentPath = router.currentRoute.value.path
    if (!currentPath.startsWith('/app/dashboard') && currentPath !== '/' && !currentPath.startsWith('/ua')) {
      console.log('Navigating to dashboard...')
      navigateTo(localePath('/app/dashboard'))
    }
  }
}, { immediate: true })

// const localePath = useLocalePath()

// const capctha = ref<VueHcaptcha | null>(null)
// capctha.value?.execute()
// const captchaToken = useState('captchaToken', () => '')
// function onVerify(token: string) {
//   captchaToken.value = token
// }

onMounted(async () => {
  userState.getUserInfo()
  // Reset auth modal visibility
  showAuth.value = false
  
  // 调试i18n加载状态
  console.log('[main] 当前i18nReady状态:', i18nReady.value)
  
  // 如果i18n尚未加载完成，创建一个watcher来监听状态变化
  if (!i18nReady.value) {
    console.log('[main] i18n尚未加载完成，设置监听器')
    
    const unwatch = watch(i18nReady, (newVal) => {
      console.log('[main] i18nReady状态变更为:', newVal)
      if (newVal === true) {
        console.log('[main] i18n加载完成，移除监听器')
        // 状态变为true后取消监听
        unwatch()
      }
    })
    
    // 设置安全超时，确保不会无限期等待
    setTimeout(() => {
      if (!i18nReady.value) {
        console.warn('[main] i18n加载超时，强制设置为已加载')
        i18nReady.value = true
      }
    }, 3000) // 3秒超时
  }
})
</script>

<template>
  <div>
    <!-- 全局loading状态 -->
    <div v-if="!i18nReady" class="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <BaseLoader />
    </div>

    <NuxtLayout v-else class="bg-white font-sans">
      <NuxtPage />
    </NuxtLayout>
    
    <ContainerModal
      v-if="isPaymentModalVisible"
      v-model="upgradeModalVisible"
      :title="'Upgrade'"
      :width-class="$device.isMobile ? '!max-w-full' : '!max-w-[95%]'"
    >
      <!-- <PricingTable /> -->
      <MarketingPricingTrust />
    </ContainerModal>

    <ContainerModal
      v-model="showAuth"
      :title="t('auth.authWarn')"
      :body="t('auth.authWarnDesc')"
      width-class="sm:max-w-xl"
    >
      <AuthForm :redirect-to="getCurrentUrl()" />
    </ContainerModal>
    <!-- <SpeedInsights /> -->

    <!-- <ClientOnly>
      <VueHcaptcha ref="capctha" sitekey="c8b3273e-94f1-4f5b-9c57-4814391f38a7" @verify="onVerify" />
    </ClientOnly> -->
  </div>
</template>
