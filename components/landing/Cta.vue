<script setup lang="ts">
const { t } = useI18n()
const userState = useUserState()
const supabaseUser = useSupabaseUser()
const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()

const { isUserAuthVisible } = storeToRefs(userState)
const showAuth = computed({
  get: () => isUserAuthVisible.value,
  set: (value) => {
    userState.setAuthModalVisibility(value)
  },
})

const getCurrentUrl = () => globalThis.location?.href || route.fullPath

const handleClick = async () => {
  console.log('Button clicked')
  console.log('User state:', supabaseUser.value)
  console.log('Current URL:', getCurrentUrl())
  
  if (supabaseUser.value) {
    console.log('Navigating to dashboard...')
    await navigateTo(localePath('/Dashboard'))
  } else {
    console.log('Redirecting to auth page...')
    await navigateTo(localePath('/auth'))
  }
}

// Reset auth modal visibility when component is mounted
onMounted(() => {
  showAuth.value = false
})

// Monitor auth modal visibility
watch(showAuth, (newVal) => {
  console.log('Auth modal visibility changed:', newVal)
})

// 监听用户登录状态变化，当用户登录后自动跳转到dashboard
watch(supabaseUser, (newVal) => {
  if (newVal) {
    console.log('User logged in...')
    // 只在非主页路径和非Dashboard路径时才自动导航到Dashboard
    const currentPath = router.currentRoute.value.path
    if (!currentPath.startsWith('/Dashboard') && currentPath !== '/' && !currentPath.startsWith('/ua')) {
      console.log('Navigating to dashboard...')
      navigateTo(localePath('/Dashboard'))
    }
  }
}, { immediate: true })
</script>

<template>
  <section class="mt-12 py-14">
    <div class="max-w-screen-xl mx-auto px-4 text-center md:px-8">
      <div class="mx-auto flex flex-col gap-[40px]">
        <h2 class="whitespace-break-spaces font-merriweather text-4xl lg:text-5xl font-bold lg:tracking-tight text-center">
          {{ t('landing.ctaTitle') }}
        </h2>
        <div>
          <UButton
            size="xl"
            icon="i-heroicons-rocket-launch"
            trailing
            @click="handleClick"
          >
            {{ t('common.ctaButton') }}
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>
