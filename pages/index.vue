<script
  setup
  lang="ts"
>
const { t } = useI18n()

useHead({
  title: 'AIToolSite',
  meta: [
    { name: 'description', content: t('indexMeta.description') },
    { name: 'keywords', content: t('indexMeta.keywords') },
    { name: 'robots', content: 'index, follow' },
    { name: 'language', content: t('indexMeta.language') },
    { name: 'revisit-after', content: '7 days' },
    { name: 'author', content: 'AIToolSite' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: t('indexMeta.title') },
    { name: 'twitter:description', content: t('indexMeta.description') },
    { name: 'twitter:image', content: 'https://aitoolsite.com/summary_image.jpeg' },
    { name: 'twitter:site', content: '@CyberCowboy404' },
    { name: 'twitter:creator', content: '@CyberCowboy404' },
    { property: 'og:title', content: t('indexMeta.title') },
    { property: 'og:description', content: t('indexMeta.description') },
    { property: 'og:image', content: 'https://aitoolsite.com/summary_image.jpeg' },
    { property: 'og:url', content: 'https://aitoolsite.com/' },
    { property: 'og:site_name', content: 'AIToolSite' },
    { property: 'og:locale', content: t('indexMeta.locale') },
    { property: 'og:type', content: 'website' },
  ],
})
</script>

<template>
  <main>
    <!-- Add language switcher in a subtle position -->
    <div class="absolute top-4 right-4">
      <LanguageSwitcher />
    </div>
    
    <LandingHero />
    <LandingTestimonials />
    <LandingProblemSolution />
    <!-- <LandingLogos /> -->
    <LandingFeaturesBlock />
    <LandingPricing />
    <LandingFAQ />
    <LandingCta />
  </main>
</template>
