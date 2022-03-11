import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react'
import { useRouter } from 'next/router'
import supabase from '../supabase/client'
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js'
import { Profile } from '@prisma/client'
import { exploreRoute } from '../utils/routes'

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
  const [, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
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
      } else {
        setUser(null)
        setLoading(false)
      }
    }

    getUserProfile()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true)
        setSession(session)
        await updateSupabaseCookie(event, session)
        await getUserProfile()
        setLoading(false)
      }
    )

    return () => {
      authListener?.unsubscribe()
    }
  }, [])

  const updateSupabaseCookie = async (
    event: AuthChangeEvent,
    session: Session | null
  ) =>
    await fetch('/api/auth', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify({ event, session }),
    })

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push(exploreRoute)
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
