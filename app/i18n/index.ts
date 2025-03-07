/**
 * i18n dynamic loading system
 * This file is responsible for loading all JSON translation files for supported languages
 */

// Define available page modules
const availableModules = [
  'common',
  'landing',
  'auth',
  'dashboard',
  'pricing',
  'blog'
];

// Define supported languages
const supportedLocales = ['en', 'ua', 'zh'];

// Import translations directly
   // app/i18n/index.ts
   import en from './en'
   import ua from './ua'
   import zh from './zh'
   
   export const messages = {
     en,
     ua,
     zh
   };

// Helper function for loading specific module translations on demand
export async function loadTranslationModule(locale: string, module: string) {
  if (!supportedLocales.includes(locale) || !availableModules.includes(module)) {
    console.error(`Unsupported locale or module: ${locale}/${module}`);
    return {};
  }

  try {
    const moduleData = await import(`./${locale}/${module}.json`);
    return moduleData.default || moduleData;
  } catch (error) {
    console.error(`Failed to load translation module: ${locale}/${module}`, error);
    return {};
  }
}
