<script
  setup
  lang='tsx'
>
interface FaqItem {
  answer: string
  question: string
}

interface ReviewItem {
  userInfo: string
  img: string
  name: string
  rating: 1 | 2 | 3 | 4 | 5
  text: string
  title: string
}

const { t, tm } = useI18n()

// Replace data.usersCount with userCount in the template
const userCount = ref<number>(0)

const faqs = computed(() => {
  try {
    const rawFaqData = tm('pricingFaq')
    // Ensure we have an array and it matches our type
    const faqData = Array.isArray(rawFaqData) ? rawFaqData : []
    
    return faqData.filter((item): item is FaqItem => {
      return item && 
        typeof item === 'object' && 
        'answer' in item && 
        'question' in item &&
        typeof item.answer === 'string' &&
        typeof item.question === 'string'
    }).map(i => ({ a: i.answer, q: i.question }))
  } catch (error) {
    console.error('Error processing FAQ data:', error)
    return []
  }
})

const reviews = computed(() => {
  try {
    const rawReviewData = tm('reviews')
    // Ensure we have an array and it matches our type
    const reviewData = Array.isArray(rawReviewData) ? rawReviewData : []
    
    return reviewData.filter((item): item is ReviewItem => {
      return item && 
        typeof item === 'object' &&
        'userInfo' in item &&
        'img' in item &&
        'name' in item &&
        'rating' in item &&
        'text' in item &&
        'title' in item &&
        typeof item.userInfo === 'string' &&
        typeof item.img === 'string' &&
        typeof item.name === 'string' &&
        typeof item.rating === 'number' &&
        item.rating >= 1 &&
        item.rating <= 5 &&
        typeof item.text === 'string' &&
        typeof item.title === 'string'
    }).map(i => ({
      description: i.userInfo,
      image: i.img,
      name: i.name,
      rating: i.rating as 1 | 2 | 3 | 4 | 5,
      text: i.text,
      title: i.title,
    }))
  } catch (error) {
    console.error('Error processing review data:', error)
    return []
  }
})
</script>

<template>
  <section class="pricing-new border rounded-xl py-4">
    <h1 class="border-b-2 pt-2 !pb-5 text-center text-2xl md:text-3xl lg:text-4xl font-bold">
      {{ t('priceTrust.title') }}
    </h1>
    <div class="px-4 relative flex flex-col lg:flex-row">
      <div class="md:pr-4 order-2 lg:order-1 w-full lg:w-1/2 py-4 flex flex-col gap-6 lg:border-r-2">
        <div>
          <b>{{ t('priceTrust.lifetime.sub') }}</b>
          <span>{{ t('priceTrust.lifetime.text') }}</span>
        </div>

        <div>
          <b>{{ t('priceTrust.oneTime.sub') }}</b>
          <span>{{ t('priceTrust.oneTime.text') }}</span>
        </div>

        <div>
          <b>{{ t('priceTrust.missOut.sub') }}</b>
          <span>{{ t('priceTrust.missOut.text') }}</span>
        </div>

        <div>
          <b>
            {{ t('priceTrust.guarantee.sub') }}
          </b>
          <span>{{ t('priceTrust.guarantee.text') }}</span>
        </div>

        <BaseCollapse
          :faqs="faqs"
          :ui="{
            title: '!text-base !pb-2',
            icon: '!size-[20px]',
          }"
        />
      </div>

      <div class="md:pl-4 order-1 lg:order-2 w-full lg:w-1/2 py-4 flex flex-col gap-5">
        <MarketingRating
          :rating="5"
          half
          :text="t('priceTrust.trusted', { count: userCount })"
          class="clients-stats self-center"
        />

        <MarketingPricingOptions class="hidden md:flex" />

        <MarketingReviews :reviews="reviews" />
      </div>
    </div>
    <footer class="m-4 !mt-4 !mb-0 py-2 items-center border-t-2 flex justify-between flex-wrap">
      <div class="logos">
        <h3 class="text-xl font-medium">
          {{ t('priceTrust.companies') }}
        </h3>
        <div class="flex items-center gap-[25px]">
          <div class="flex items-center gap-[15px] lg:gap-[35px] flex-wrap">
            <Icon
              name="logos:google"
              class="size-[65px]"
            />
            <SvgoPgbrand class="!w-auto !h-[25px]" />
            <SvgoNestleBrand class="!w-auto !h-[40px]" />
            <Icon
              name="mdi:apple"
              class="size-[45px] text-[#555555]"
            />
            <Icon
              name="logos:meta"
              class="!w-[100px] !h-[60px]"
            />
            <Icon
              name="logos:airbnb"
              class="!w-[100px] !h-[60px]"
            />
            <Icon
              name="logos:zoom"
              class="!w-[100px] !h-[60px]"
            />
            <Icon
              name="logos:microsoft-icon"
              class="!w-[50px] !h-[40px]"
            />
          </div>
        </div>
      </div>

      <div class="built-with-stipe">
        <div class="flex gap-[7px] items-center">
          <Icon name="mdi:lock" />
          <span>{{ t('priceTrust.safe') }}</span>
          <Icon
            name="fa:cc-stripe"
            class="text-[45px]"
          />
        </div>
      </div>
    </footer>
    <div class="sticky bottom-0 py-[5px] bg-white z-10">
      <MarketingPricingOptions class="block md:hidden" />
    </div>
  </section>
</template>

<style
  lang='scss'
>
.discount-tag {
  position: absolute;
  top: 0px;
  left: -22px;
  background: #fff;
  border-radius: 5px;
  font-size: 12px;
  padding: 0px 6px;
  transform: rotate(-25deg);
}

@media (min-width: 1024px) and (max-width: 1273px) {
  .pricing-new .clients-stats {
    .star-icon {
      font-size: 22px;
    }
  }

  .plan-desc {
    font-size: 13px;
  }
}
</style>
