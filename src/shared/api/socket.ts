import { io, Socket } from 'socket.io-client'
import { API_CONFIG } from './api.constants'

// API_CONFIG.BASE_URL is e.g. http://localhost:3001/api — the socket
// connects to the same origin, on the /realtime namespace, not under /api.
const SOCKET_ORIGIN = API_CONFIG.BASE_URL.replace(/\/api\/?$/, '')

let socket: Socket | null = null
let currentToken: string | null = null

const getSocket = (): Socket => {
  if (!socket) {
    // `auth` as a callback (not a plain object) is invoked by socket.io-client
    // on every connection attempt, so a reconnect always sends the latest
    // access token instead of the one captured at construction time.
    socket = io(`${SOCKET_ORIGIN}/realtime`, {
      autoConnect: false,
      auth: (cb) => cb({ token: currentToken }),
    })
  }
  return socket
}

export const setSocketToken = (token: string | null): void => {
  currentToken = token
}

export const connectSocket = (token: string): void => {
  currentToken = token
  const instance = getSocket()
  if (!instance.connected) {
    instance.connect()
  }
}

export const disconnectSocket = (): void => {
  socket?.disconnect()
}

export const subscribeToSocketEvent = <T = unknown>(
  event: string,
  handler: (payload: T) => void,
): (() => void) => {
  const instance = getSocket()
  instance.on(event, handler)
  return () => {
    instance.off(event, handler)
  }
}
