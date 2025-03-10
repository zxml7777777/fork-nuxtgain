// Import JSON translation files
import common from './ua/common.json'
import landing from './ua/landing.json'
import auth from './ua/auth.json'
import dashboard from './ua/dashboard.json'

// Export messages directly
export default {
  ...common,
  ...landing,
  ...auth,
  ...dashboard
}
