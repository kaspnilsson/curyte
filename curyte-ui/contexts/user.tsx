import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react'
import { useUser } from '@supabase/supabase-auth-helpers/react'

import { useRouter } from 'next/router'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { User } from '@supabase/supabase-js'
import { Profile } from '@prisma/client'
import { exploreRoute } from '../utils/routes'
import { useToast } from '@chakra-ui/react'

export const UserAuthContext = createContext<ContextProps>({
  userAndProfile: null,
  logout: () => {
    console.error('logout called without being logged in')
  },
  loading: false,
})

export interface ContextProps {
  userAndProfile: UserAndProfile | null
  logout: () => void
  loading: boolean
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
  const { user, isLoading, error } = useUser()
  const [loading, setLoading] = useState(isLoading)
  const toast = useToast()

  useEffect(() => {
    if (isLoading) {
      setLoading(true)
      return
    }
    if (!user) {
      setUserAndProfile(null)
      setLoading(false)
      return
    }

    if (error) {
      toast({
        status: 'error',
        title: error.name,
        description: error.message,
      })
    }

    const getUserProfile = async () => {
      setLoading(true)
      if (user) {
        const res = await fetch(`/api/profiles/${user.id}`, {
          method: 'GET',
        })

        if (res.ok) {
          const profile = await res.json()
          setUserAndProfile({
            user,
            profile,
          })
        }
      } else {
        setUserAndProfile(null)
      }
      setLoading(false)
    }

    getUserProfile()
  }, [error, isLoading, toast, user])

  const logout = async () => {
    await supabaseClient.auth.signOut()
    setUserAndProfile(null)
    router.push(exploreRoute)
  }

  return (
    <UserAuthContext.Provider
      value={{
        userAndProfile,
        logout,
        loading,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  )
}

export const useUserAndProfile = () => useContext(UserAuthContext)
