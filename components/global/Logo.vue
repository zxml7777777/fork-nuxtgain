<script setup lang='ts'>
const supabaseUser = useSupabaseUser()
</script>

<template>
  <div>
    <NuxtLinkLocale to="/">
      <SvgoNuxtGainLogo
        filled
        class="!w-[150px] !h-[50px]"
      />
    </NuxtLinkLocale>
  </div>
</template>

<style scoped lang='scss'>

</style>
