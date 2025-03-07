<script setup>
// Find the number of blogs present
// const blogCountLimit = 6
// const { data } = await useAsyncData(`content-/blog`, async () => {
//   const _posts = await queryContent('/blog').only('headline').find()
//   return Math.ceil(_posts.length / blogCountLimit)
// })

const pageTitle = 'AIToolSite - The Ultimate AI-Powered Tool Platform'
const pageDescription = 'AIToolSite is an AI-powered platform designed for professionals. Create customizable, professional documents quickly and efficiently. Secure and user-friendly, AIToolSite enhances your workflow with AI technology.'
const canonicalPath = 'https://www.aitoolsite.com/blog/'
const image = 'https://www.aitoolsite.com/summary_image.jpeg'
const socialImageAlt = 'AI-Powered Document Tools'

useHead({
  title: pageTitle,
  meta: [
    { name: 'author', content: 'MagicResumeAI Team' },
    { name: 'description', content: pageDescription },
    // OG
    { hid: 'og:title', property: 'og:title', content: pageTitle },
    { hid: 'og:url', property: 'og:url', content: canonicalPath },
    { hid: 'og:description', property: 'og:description', content: pageDescription },
    { hid: 'og:image', property: 'og:image', content: image },
    { hid: 'og:type', property: 'og:type', content: 'website' },
    { hid: 'og:image:alt', property: 'og:image:alt', content: socialImageAlt },
    // Twitter
    { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
    { hid: 'twitter:title', name: 'twitter:title', content: pageTitle },
    { hid: 'twitter:url', name: 'twitter:url', content: canonicalPath },
    { hid: 'twitter:description', name: 'twitter:description', content: pageDescription },
    { hid: 'twitter:image', name: 'twitter:image', content: image },
    { hid: 'twitter:image:alt', name: 'twitter:image:alt', content: socialImageAlt }
  ],
})
</script>

<template>
  <main class="container mx-auto px-4 flex flex-col gap-4">
    <BlogHero />
    <BlogSection
      id="main"
      class="!pt-0"
    >
      <ContentQuery
        v-slot="{ data }"
        path="/blog"
        :only="['headline', 'excerpt', 'date', 'tags', '_path', 'image', 'description']"
        :sort="{
          date: -1,
        }"
      >
        <BlogList :data="data" />
      </ContentQuery>
    </BlogSection>
  </main>
</template>

<!-- <BlogPagination
  v-if="data > 1"
  class="mt-8"
  :current-page="1"
  :total-pages="data"
  :next-page="data > 1"
  base-url="/blog/"
  page-url="/blog/page/"
/> -->
