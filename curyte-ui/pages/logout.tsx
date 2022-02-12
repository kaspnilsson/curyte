import { useRouter } from 'next/router'
import { exploreRoute } from '../utils/routes'
import LoadingSpinner from '../components/LoadingSpinner'
import { useEffect } from 'react'
import supabase from '../supabase/client'

const Logout = () => {
  const router = useRouter()
  useEffect(() => {
    supabase.auth.signOut()
    router.push(exploreRoute)
  })
  return <LoadingSpinner message="Bye!!! 😭" />
}

export default Logout
