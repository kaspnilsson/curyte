import LoadingSpinner from '../components/LoadingSpinner'
import { useEffect } from 'react'
import { useUser } from '../contexts/user'

const Logout = () => {
  const { logout } = useUser()
  useEffect(() => {
    logout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <LoadingSpinner message="Bye!!! 😭" />
}

export default Logout
