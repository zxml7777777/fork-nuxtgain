// Import JSON translation files
import common from './zh/common.json'
import landing from './zh/landing.json'
import auth from './zh/auth.json'
import dashboard from './zh/dashboard.json'

// Export messages directly
export default {
  ...common,
  ...landing,
  ...auth,
  ...dashboard
} 