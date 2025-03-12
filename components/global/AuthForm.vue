<script setup lang='ts'>
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { Auth } from '@nuxtbase/auth-ui-vue'

const props = defineProps<{
  redirectTo?: string
}>()
const { t, locale } = useI18n()
const nuxtApp = useNuxtApp()

// 获取i18n加载状态
const i18nReady = useState('i18n-ready', () => false)

const supabaseClient = useSupabaseClient()

const authLocale = {} as any

// 定义auth key类型
type AuthKeys = 'sign_up' | 'sign_in' | 'magic_link' | 'forgotten_password' | 'update_password' | 'verify_otp'

// 使用预定义的键，而不是依赖导入的englishWords
const authKeys: AuthKeys[] = [
  'sign_up', 
  'sign_in', 
  'magic_link', 
  'forgotten_password', 
  'update_password', 
  'verify_otp'
]

// 遍历预定义的键，使用i18n的t函数获取对应的翻译
authKeys.forEach((key) => {
  authLocale[key] = {}
  // 获取对应键的所有子键
  const subKeys = ['email_label', 'password_label', 'email_input_placeholder', 'password_input_placeholder', 
                   'button_label', 'loading_button_label', 'social_provider_text', 'link_text', 'confirmation_text',
                   'phone_input_label', 'phone_input_placeholder', 'token_input_label', 'token_input_placeholder',
                   'email_input_label', 'or_continue_with', 'or_sign_in_with']
  
  // 只为存在的翻译创建条目
  subKeys.forEach(subKey => {
    const translationKey = `auth.${key}.${subKey}`
    const translation = t(translationKey)
    // 只添加非空翻译
    if (translation && translation !== translationKey) {
      authLocale[key][subKey] = translation
    }
  })
})

const redirectTo = computed(() => props.redirectTo || `${globalThis.location?.origin}/auth/finish`)

// 定义视图类型
type ViewType = 'sign_in' | 'sign_up' | 'magic_link' | 'forgotten_password' | 'update_password' | 'verify_otp'
// 使用自定义类型
const authView = ref<ViewType>('magic_link')

// 确保应用了全局通用的翻译
const globalTranslations = {
  or_continue_with: t('auth.common.or_continue_with', 'Or continue with'),
  or_sign_in_with: t('auth.common.or_sign_in_with', 'Or sign in with')
}

// 监控语言变化，更新翻译
watch(locale, () => {
  // 重新生成authLocale
  authKeys.forEach((key) => {
    authLocale[key] = {}
    // 获取对应键的所有子键
    const subKeys = ['email_label', 'password_label', 'email_input_placeholder', 'password_input_placeholder', 
                     'button_label', 'loading_button_label', 'social_provider_text', 'link_text', 'confirmation_text',
                     'phone_input_label', 'phone_input_placeholder', 'token_input_label', 'token_input_placeholder',
                     'email_input_label', 'or_continue_with', 'or_sign_in_with']
    
    // 只为存在的翻译创建条目
    subKeys.forEach(subKey => {
      const translationKey = `auth.${key}.${subKey}`
      const translation = t(translationKey)
      // 只添加非空翻译
      if (translation && translation !== translationKey) {
        authLocale[key][subKey] = translation
      }
    })
  })
})

// 在客户端手动检查i18n加载状态
if (process.client) {
  // 如果插件提供了检查函数，使用它
  if (nuxtApp.$checkI18nReady && typeof nuxtApp.$checkI18nReady === 'function' && !i18nReady.value) {
    const ready = nuxtApp.$checkI18nReady()
    if (ready) {
      i18nReady.value = true
    } else {
      // 如果尚未加载完成，设置延迟函数进行检查
      setTimeout(() => {
        if (nuxtApp.$checkI18nReady && typeof nuxtApp.$checkI18nReady === 'function') {
          i18nReady.value = nuxtApp.$checkI18nReady()
        }
      }, 500)
    }
  } else if (!i18nReady.value) {
    // 如果没有提供检查函数，设置一个合理的默认延迟
    setTimeout(() => {
      i18nReady.value = true
    }, 1000)
  }
}
</script>

<template>
  <div class="mt-6 relative lg:mx-auto w-full md:max-w-[500px] bg-white rounded-2xl">
    <div class="items-center justify-center">
      <!-- 显示占位符内容，直到 i18n 加载完成 -->
      <div v-if="!i18nReady" class="p-4 rounded-lg border bg-white">
        <!-- 社交登录按钮占位符 -->
        <div class="flex flex-col gap-3 mb-4">
          <div class="skeleton-loading h-10 w-full rounded-md"></div>
          <div class="skeleton-loading h-10 w-full rounded-md"></div>
        </div>
        
        <!-- 分隔符占位符 -->
        <div class="relative my-4 flex items-center justify-center">
          <div class="skeleton-loading h-[1px] w-full"></div>
          <div class="skeleton-loading absolute px-4 bg-white h-6 w-16 rounded-md"></div>
        </div>
        
        <!-- 表单字段占位符 -->
        <div class="flex flex-col gap-4">
          <div class="skeleton-loading h-9 w-full rounded-md"></div>
          <div v-if="authView === 'sign_in'" class="skeleton-loading h-9 w-full rounded-md"></div>
          <div class="skeleton-loading h-10 w-full rounded-md"></div>
        </div>
        
        <!-- 切换模式链接占位符 -->
        <div class="mt-3 flex justify-center">
          <div class="skeleton-loading h-5 w-32 rounded-md"></div>
        </div>
      </div>
      
      <!-- 实际内容 - 在i18n加载完成后显示 -->
      <Auth
        v-if="i18nReady"
        v-model:view="authView"
        :providers="[
          'google',
          'github',
        ]"
        :supabase-client="supabaseClient"
        :appearance="{
          theme: ThemeSupa,
        }"
        :redirect-to="redirectTo"
        :localization="{
          variables: { ...authLocale, ...globalTranslations },
        }"
      />
    </div>
  </div>
</template>

<style>
.auth-placeholder-box {
  @apply h-10 bg-gray-100 rounded-md flex items-center justify-center;
}
.auth-placeholder-text {
  @apply h-5 bg-gray-200 rounded;
}
</style>
