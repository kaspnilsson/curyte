import LoadingSpinner from '../components/LoadingSpinner'
import { useEffect } from 'react'
import { useUserAndProfile } from '../contexts/user'

const Logout = () => {
  const { logout } = useUserAndProfile()
  useEffect(() => {
    logout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <LoadingSpinner message="Bye!!! 😭" />
}

export default Logout
