// Import JSON translation files
import common from './en/common.json'
import landing from './en/landing.json'
import auth from './en/auth.json'
import dashboard from './en/dashboard.json'

// Export messages directly
export default {
  ...common,
  ...landing,
  ...auth,
  ...dashboard
}
