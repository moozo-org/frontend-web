import { useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router'

import ErrorPage from '../pages/public/Error'

const EventLayout = () => {
  const { event } = useParams()
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid'>('loading')

  useEffect(() => {
    let cancelled = false

    const checkEvent = async () => {
      try {
        // TODO: replace with real API and axios
        const res = await fetch(`https://api.moozo.app/events/${event}`)
        if (!res.ok) throw new Error('Event not found')
        if (!cancelled) setStatus(res.ok ? 'valid' : 'invalid')
      } catch {
        if (!cancelled) setStatus('invalid')
      }
    }
    checkEvent()
    return () => {
      cancelled = true
    }
  }, [event])

  if (status === 'loading') return null
  if (status === 'invalid') return <ErrorPage />

  return <Outlet context={{ event }} />
}

export default EventLayout
