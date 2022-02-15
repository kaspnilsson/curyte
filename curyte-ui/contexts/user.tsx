import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react'
import { useRouter } from 'next/router'
import supabase from '../supabase/client'
import { User } from '@supabase/supabase-js'
import { Profile } from '@prisma/client'

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
  const [user, setUser] = useState<UserAndProfile | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getUserProfile = async () => {
      const sessionUser = supabase.auth.user()

      if (sessionUser) {
        setLoading(true)
        const res = await fetch(`/api/profiles/${sessionUser.id}`, {
          method: 'GET',
        })

        if (res.ok) {
          const profile = await res.json()
          setUser({
            user: sessionUser,
            profile,
          })
          setLoading(false)
        }
      }
    }

    getUserProfile()

    supabase.auth.onAuthStateChange(() => {
      getUserProfile()
    })
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  return (
    <UserAuthContext.Provider
      value={{
        userAndProfile: user,
        logout,
        loading,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  )
}

export const useUser = () => useContext(UserAuthContext)
