<script setup lang='ts'>
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { Auth } from '@nuxtbase/auth-ui-vue'

const { t } = useI18n()

useHead({
  title: 'AIToolSite Auth',
})

const supabaseClient = useSupabaseClient()

// 不需要在此文件中处理 authLocale，因为现在使用 AuthForm 组件
// AuthForm 组件已经处理了本地化

const redirectTo = `${globalThis.location?.origin}/auth/finish`
</script>

<template>
  <div class="px-4 md:px-0">
    <AuthForm :redirect-to="redirectTo" />
  </div>
</template>

<style scoped lang='scss'></style>
