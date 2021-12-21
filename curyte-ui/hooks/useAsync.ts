/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, DependencyList } from 'react'

export interface UseAsyncHook<T> {
  data?: T
  loading: boolean
  error?: Error
}
const useAsync = <T>(
  fn: () => Promise<T>,
  deps: DependencyList = []
): UseAsyncHook<T> => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | undefined>()
  const [data, setRes] = useState<T | undefined>()
  useEffect(() => {
    setLoading(true)
    let cancel = false
    fn().then(
      (res) => {
        if (cancel) return
        setLoading(false)
        setRes(res)
      },
      (error) => {
        if (cancel) return
        setLoading(false)
        setError(error)
      }
    )
    return () => {
      cancel = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return { loading, error, data }
}

export default useAsync
