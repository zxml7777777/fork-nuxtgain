// https://nuxt.com/docs/api/configuration/nuxt-config
// 导入默认语言设置
import { defaultLocale } from './composables/useI18nSettings'

export default defineNuxtConfig({
  // Configure the app's head metadata
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        // Define favicon and app icons
        { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon/favicon-32x32.png'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon/favicon-16x16.png'
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/favicon/apple-touch-icon.png'
        },
        { rel: 'manifest', href: '/favicon/site.webmanifest' }
      ]
    }
  },

  // Set compatibility version for future Nuxt releases
  future: {
    compatibilityVersion: 4,
  },

  // Define site metadata
  site: {
    url: 'https://aitoolsite.com',
    name: 'NuxtGain',
  },

  // Configure component auto-imports
  components: {
    dirs: [
      {
        path: '~/components/global',
        global: true
      },
      {
        path: '~/components/content',
        global: true
      },
      '~/components',
    ],
  },

  // Define runtime config and environment variables
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL ?? '',
      supabaseKey: process.env.SUPABASE_KEY ?? '',
      posthogPublicKey: process.env.NUXT_PUBLIC_POSTHOG_PUBLIC_KEY ?? '',
      posthogHost: process.env.NUXT_PUBLIC_POSTHOG_HOST ?? '',
    },
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY ?? '',
    claudeApiKey: process.env.NUXT_CLAUDE_API_KEY ?? '',
    stripeSigningSecret: process.env.NUXT_STRIPE_SIGNING_SECRET ?? '',
    stripeSecret: process.env.NUXT_STRIPE_SECRET,
    brevoKey: process.env.NUXT_BREVO_KEY ?? '',
  },

  // Disable Nuxt devtools
  devtools: { enabled: false },

  // Configure Nuxt modules
  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/supabase',
    '@nuxt/ui',
    'nuxt-svgo',
    'nuxt-lodash',
    'nuxt-gtag',
    '@nuxt/content',
    ['@nuxtjs/google-fonts', {
      families: {
        'DM Sans': [300, 400, 500, 700, 900],
        'Merriweather Sans': [300, 400, 500, 700, 900],
        'Merriweather': [300, 400, 700, 900],
      },
    }],
    // '@nuxtjs/web-vitals',
    [
      '@pinia/nuxt',
      {
        autoImports: [
          'defineStore',
          'acceptHMRUpdate',
          'storeToRefs',
        ],
      },
    ],
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxtjs/sitemap',
    'nuxt-delay-hydration',
    '@nuxtjs/seo',
    'nuxt-link-checker',
    'nuxt-seo-experiments',
    'nuxt-schema-org',
    '@nuxtjs/device',
    ['nuxt-security', {
      headers: {
        contentSecurityPolicy: {
          'img-src': ["'self'", 'data:', 'placehold.co']
        }
      }
    }],
    'nuxt-simple-robots'
  ],

  // Disable OG image generation due to build size limitations
  ogImage: {
    enabled: false,
  },

  // Configure Nuxt Content module
  content: {
    markdown: {
      rehypePlugins: [
        [
          'rehype-external-links',
          {
            target: '_blank',
            rel: 'noopener noreferer'
          }
        ]
      ]
    }
  },

  // To inreasy lighthouse results
  delayHydration: {
    mode: 'init',
  },

  // Configure Google Analytics
  gtag: {
    id: process.env.GOOGLE_ANALYTICS_ID ?? '',
    enabled: true,
  },

  // Configure Supabase
  supabase: {
    serviceKey: process.env.NUXT_SUPABASE_SERVICE_KEY ?? '',
    redirect: false,
  },

  // Configure sitemap generation
  sitemap: {
    strictNuxtContentPaths: true
  },

  // Configure auto-imports
  imports: {
    dirs: [
      'stores/**/*',
      'bl/**/*',
      'types/',
      'utils/**/*',
    ],
    presets: [
      {
        from: 'consola',
        imports: ['consola'],
      },
    ],
  },

  // Configure i18n for internationalization
  i18n: {
    vueI18n: './i18n/vue-i18n.ts',
    defaultLocale: defaultLocale,
    locales: [
      {
        code: 'en',
        name: 'English',
        iso: 'en-US',
        file: 'en.ts'
      },
      {
        code: 'ua',
        name: 'Українська',
        iso: 'uk-UA',
        file: 'ua.ts'
      },
      {
        code: 'zh',
        name: '中文',
        iso: 'zh-CN',
        file: 'zh.ts'
      }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    strategy: 'prefix_except_default',
    langDir: './i18n/',
    lazy: true,
    skipSettingLocaleOnNavigate: true,
    compilation: {
      strictMessage: false,
      escapeHtml: true
    }
  },

  // Set default color mode
  colorMode: {
    preference: 'light',
  },

  // Configure Vue compiler options
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag === 'iconify-icon',
    },
  },

  // Configure Nitro server
  nitro: {
    preset: 'vercel',
    vercel: {
      functions: {
        maxDuration: 300,
      },
      config: {
        crons: [
          {
            path: '/scheduler/discount-mail',
            schedule: '0 * * * *',
          }
        ]
      },
    },
    compressPublicAssets: true,
    experimental: {
      tasks: true,
    },
    scheduledTasks: {

    },
  },

  // Define route rules for prerendering and robots
  routeRules: {
    '/': { prerender: true },
    '/ua': { prerender: true },
    '/pricing': { prerender: true },
    '/ua/pricing': { prerender: true },
    '/thank-you': { prerender: true },
    '/ua/thank-you': { prerender: true },
    '/ua/auth': { prerender: true },
    '/auth': { prerender: true },
    '/app/dashboard': { prerender: true },
    '/ua/app/dashboard': { prerender: true },
    '/ua/blog/**': { prerender: true },
    '/blog/**': { prerender: true },
    '/legal/**': { robots: false },
  },

  // Configure Vite build options
  vite: {
    optimizeDeps: {
      include: ['lodash-es'],
    },
    build: {
      rollupOptions: {
        onwarn: (warning, warn) => {
          if (warning.code === 'THIS_IS_UNDEFINED')
            return
          warn(warning)
        }
      }
    },
    esbuild: {
      tsconfigRaw: {
        compilerOptions: {
          allowImportingTsExtensions: true
        } as any
      }
    }
  },

  // Set compatibility date for Nuxt
  compatibilityDate: '2024-07-24',

  robots: {
    // Your robots configuration
  },

  image: {
    dir: 'public',
    provider: 'ipx',
    quality: 80,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    }
  },

  // 全局CSS文件
  css: [
    '~/assets/css/global.css',
  ],
})