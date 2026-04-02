// hooks/useFetch.js
import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * useFetch(fn, deps?)
 *
 * @param fn   — async function that returns data (e.g. () => artistsApi.getAll())
 * @param deps — optional dependency array; if supplied, re-fetches when deps change
 *
 * Returns { data, loading, error, refetch }
 */
export function useFetch(fn, deps = []) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // Keep a stable ref to fn so we can call it in the effect without it being
  // a dependency (avoids infinite loops when fn is an inline arrow).
  const fnRef = useRef(fn)
  fnRef.current = fn

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fnRef.current()
      setData(result)
    } catch (err) {
      setError(err.message ?? 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    execute()
  }, [execute])

  return { data, loading, error, refetch: execute }
}