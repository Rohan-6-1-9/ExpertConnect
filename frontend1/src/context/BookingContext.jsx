import { createContext, useContext, useState, useCallback } from 'react'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [userEmail, setUserEmail] = useState(
    () => localStorage.getItem('userEmail') || ''
  )
  const [userName, setUserName] = useState(
    () => localStorage.getItem('userName') || ''
  )

  const saveUserInfo = useCallback((name, email) => {
    setUserName(name)
    setUserEmail(email)
    localStorage.setItem('userName', name)
    localStorage.setItem('userEmail', email)
  }, [])

  return (
    <BookingContext.Provider value={{ userEmail, userName, saveUserInfo }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBookingContext() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBookingContext must be inside BookingProvider')
  return ctx
}
