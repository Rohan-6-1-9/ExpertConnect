import { io } from 'socket.io-client'

let socket = null

/**
 * Returns the singleton socket connection.
 * Connects lazily on first call.
 */
export function getSocket() {
  if (!socket) {
    socket = io('/', {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id)
    })
    socket.on('disconnect', (reason) => {
      console.warn('[Socket] Disconnected:', reason)
    })
    socket.on('connect_error', (err) => {
      console.error('[Socket] Error:', err.message)
    })
  }
  return socket
}

/**
 * Subscribe to real-time slot updates for an expert.
 * Emits 'join_expert_room' and listens for 'slot_update'.
 *
 * @param {string} expertId
 * @param {(payload: { slotId: string, status: 'booked'|'available' }) => void} callback
 * @returns {() => void} cleanup function
 */
export function subscribeToExpertSlots(expertId, callback) {
  const s = getSocket()
  const room = `expert_${expertId}`

  s.emit('join_expert_room', { expertId })

  s.on('slot_update', (payload) => {
    if (payload.expertId === expertId) {
      callback(payload)
    }
  })

  // Return cleanup
  return () => {
    s.emit('leave_expert_room', { expertId })
    s.off('slot_update', callback)
  }
}

/**
 * Subscribe to booking confirmation events.
 * @param {string} bookingId
 * @param {(payload: object) => void} callback
 * @returns {() => void} cleanup
 */
export function subscribeToBookingStatus(bookingId, callback) {
  const s = getSocket()
  s.on(`booking_${bookingId}`, callback)
  return () => s.off(`booking_${bookingId}`, callback)
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
