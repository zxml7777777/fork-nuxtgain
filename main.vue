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

watch(supabaseUser, (newVal) => {
  if (newVal) {
    console.log('User logged in, closing auth modal...')
    // 关闭认证模态框
    showAuth.value = false
    
    // 只在非主页路径和非Dashboard路径时才自动导航到Dashboard
    const currentPath = router.currentRoute.value.path
    if (!currentPath.startsWith('/Dashboard') && currentPath !== '/' && !currentPath.startsWith('/ua')) {
      console.log('Navigating to Dashboard...')
      navigateTo(localePath('/Dashboard'))
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

  // if (_session) {
  //   if (route.path.includes('/auth')) {
  //     await navigateTo(localePath('/dashboard'))
  //   }
  // } else {
  //   await navigateTo(localePath('/auth'))
  // }
  // })
})
</script>

<template>
  <div>
    <NuxtLayout class="bg-white font-sans">
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
