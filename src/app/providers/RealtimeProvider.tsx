import { FC, ReactNode, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import {
  connectSocket,
  disconnectSocket,
  setSocketToken,
  subscribeToSocketEvent,
} from '@/shared/api'
import { responseReceived } from '@/features/forms/model'

interface ResponseNewPayload {
  formId: string
  responsesCount: number
  responseId: string
  createdAt: string
}

// Single place that owns the WS connection lifecycle and subscribes to
// server events, dispatching them into Redux — components never touch the
// socket directly. See docs/forms-realtime-architecture.md §7.
export const RealtimeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.token)

  useEffect(() => {
    // Token refresh happens silently every ~60min; don't tear down a live
    // socket for it — connectSocket() is a no-op if already connected, and
    // setSocketToken() ensures the *next* reconnect (network drop, etc.)
    // picks up the fresh token. Only an actual logout (token -> null) closes
    // the connection.
    setSocketToken(token)

    if (!token) {
      disconnectSocket()
      return
    }

    connectSocket(token)
  }, [token])

  useEffect(() => {
    return subscribeToSocketEvent<ResponseNewPayload>(
      'response:new',
      (payload) => {
        dispatch(
          responseReceived({
            formId: payload.formId,
            responsesCount: payload.responsesCount,
          }),
        )
      },
    )
  }, [dispatch])

  return <>{children}</>
}
