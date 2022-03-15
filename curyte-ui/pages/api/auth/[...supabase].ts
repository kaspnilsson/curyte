import { handleAuth } from '@supabase/supabase-auth-helpers/nextjs'
import { indexRoute } from '../../../utils/routes'

export default handleAuth({
  logout: { returnTo: indexRoute },
  cookieOptions: { lifetime: 1 * 365 * 24 * 60 * 60 }, // Keep the user logged in for a year.
})
