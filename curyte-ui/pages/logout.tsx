import { auth } from '../firebase/clientApp'
import { useRouter } from 'next/router'
import { lessonSearchRoute } from '../utils/routes'
import LoadingSpinner from '../components/LoadingSpinner'
import { useEffect } from 'react'

const Logout = () => {
  const router = useRouter()
  useEffect(() => {
    auth.signOut()
    router.push(lessonSearchRoute())
  })
  return <LoadingSpinner message="Bye!!! 😭" />
}

export default Logout
