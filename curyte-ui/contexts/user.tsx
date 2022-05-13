import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react'
import { useUser } from '@supabase/supabase-auth-helpers/react'

import { useRouter } from 'next/router'
import { User } from '@supabase/supabase-js'
import { Profile } from '@prisma/client'
import { exploreRoute, loginRoute } from '../utils/routes'
import { useToast } from '@chakra-ui/react'
import { createProfile, logoutServerside, getProfile } from '../lib/apiHelpers'

export const UserAuthContext = createContext<ContextProps>({
  userAndProfile: null,
  loading: false,
})

export interface ContextProps {
  userAndProfile: UserAndProfile | null
  logout?: () => void
  loading: boolean
  error?: Error
}

export interface UserAndProfile {
  user: User | null
  profile: Profile | null
}

export const UserAuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const [userAndProfile, setUserAndProfile] = useState<UserAndProfile | null>(
    null
  )
  const { user, isLoading: loadingUser, error } = useUser()
  const [loadingData, setLoadingData] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (loadingUser) return
    if (!user) {
      setUserAndProfile(null)
      setLoadingData(false)
      return
    }

    const getUserProfile = async () => {
      let profile = null
      try {
        profile = await getProfile(user.id)
      } catch (e: unknown) {
        // Just create the profile i guess
        try {
          profile = await createProfile({
            uid: user.id,
            displayName:
              user.user_metadata.full_name ||
              user.user_metadata.name ||
              undefined,
            photoUrl: user.user_metadata.avatar_url || undefined,
          })
        } catch (e: unknown) {
          // User is logged out serverside but not clientside
          router.push(loginRoute())
        }
      } finally {
        setUserAndProfile({
          user,
          profile,
        })
      }
    }

    if (user) {
      setLoadingData(true)
      getUserProfile()
      setLoadingData(false)
    }
  }, [error, loadingUser, router, toast, user])

  const logout = async () => {
    await logoutServerside()
    setUserAndProfile(null)
    router.push(exploreRoute)
  }

  return (
    <UserAuthContext.Provider
      value={{
        userAndProfile,
        logout,
        loading: loadingData || loadingUser,
        error,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  )
}

export const useUserAndProfile = () => {
  const context = useContext(UserAuthContext)
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserAuthContextProvider.`)
  }
  return context
}
