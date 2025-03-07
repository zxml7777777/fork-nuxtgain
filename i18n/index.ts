/**
 * i18n dynamic loading system
 * This file is responsible for loading all JSON translation files for supported languages
 */

// Import translations directly
import en from './en'
import ua from './ua'
import zh from './zh'

// Create messages object
const messages = {
  en,
  ua,
  zh
}

// Export the messages object as default
export default function() {
  return messages
}