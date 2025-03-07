<script
  setup
  lang="ts"
>
const features = [
  {
    title: 'Save Time and Effort',
    description:
      'Our AI-powered document builder creates professional documents tailored to your needs in just 5 minutes.',
    icon: 'mdi:clock-time-five',
  },
  {
    title: 'Flexible Pricing',
    description:
      'No subscription nonsense! Pay only for the documents you need. For professionals, we offer a convenient subscription plan tailored to your needs.',
    icon: 'mdi:currency-usd',
  },
  {
    title: 'Impress Top Companies',
    description:
      'Our AI-enhanced documents are designed to catch the attention of top companies and help you stand out from the competition.',
    icon: 'mdi:star',
  },
  {
    title: 'Faster Results',
    description:
      'With polished, professional documents, you\'ll achieve your goals much faster.',
    icon: 'mdi:rocket-launch',
  },
  {
    title: 'Expert Results',
    description:
      'Our AI acts as your personal professional writer, delivering expert results at a fraction of the cost.',
    icon: 'mdi:robot',
  },
  {
    title: 'Unlimited Documents',
    description:
      'Create as many customized documents as you need for your various projects.',
    icon: 'mdi:file-multiple',
  },
]
</script>

<template>
  <section id="features" class="py-14">
    <div class="max-w-screen-xl mx-auto px-4 text-center md:px-8">
      <div class="max-w-2xl mx-auto">
        <h2 class="font-merriweather text-4xl lg:text-5xl font-bold lg:tracking-tight text-center">
          Why Choose AIToolSite?
        </h2>
      </div>
      <div class="mt-12">
        <ul class="grid gap-y-8 gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
          <li
            v-for="(item, index) in features"
            :key="index"
            class="space-y-3"
          >
            <div class="w-12 h-12 mx-auto bg-neutral-3/10 text-brand-blue rounded-full flex items-center justify-center">
              <Icon
                :name="item.icon"
                class="h-6 w-6 text-brand-blue"
              />
            </div>
            <h4 class="text-lg  font-semibold">
              {{ item.title }}
            </h4>
            <p>
              {{ item.description }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
