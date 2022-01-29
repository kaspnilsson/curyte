import { auth } from '../firebase/clientApp'
import { useRouter } from 'next/router'
import { exploreRoute } from '../utils/routes'
import LoadingSpinner from '../components/LoadingSpinner'
import { useEffect } from 'react'

const Logout = () => {
  const router = useRouter()
  useEffect(() => {
    auth.signOut()
    router.push(exploreRoute)
  })
  return <LoadingSpinner message="Bye!!! 😭" />
}

export default Logout
