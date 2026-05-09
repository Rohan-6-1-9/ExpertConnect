import { useState, useEffect, useCallback } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useBookings } from '../hooks'
import BookingCard from '../components/bookings/BookingCard'
import { ErrorState, EmptyState, Skeleton, Toast } from '../components/ui'
import { useBookingContext } from '../context/BookingContext'
import { cn } from '../utils'

const STATUS_TABS = [
  'all',
  'pending',
  'confirmed',
  'completed',
  'cancelled',
]

export default function MyBookingsPage() {

  const location = useLocation()

  const {
    userEmail,
    saveUserInfo,
  } = useBookingContext()

  const [email, setEmail] = useState(userEmail || '')
  const [inputEmail, setInputEmail] = useState(userEmail || '')
  const [activeTab, setActiveTab] = useState('all')
  const [toast, setToast] = useState(null)

  const {
    bookings = [],
    loading,
    error,
    refetch,
  } = useBookings(email)

  useEffect(() => {
    if (location.state?.successBookingId) {

      setToast({
        message: 'Booking confirmed! 🎉',
        type: 'success',
      })

      window.history.replaceState({}, '')

    }
  }, [location.state])

  function handleEmailSubmit(e) {

    e.preventDefault()

    if (
      !inputEmail.trim() ||
      !/\S+@\S+\.\S+/.test(inputEmail)
    ) {
      return
    }

    saveUserInfo('', inputEmail)

    setEmail(inputEmail)
  }

  const handleCancelled = useCallback(() => {

    setToast({
      message: 'Booking cancelled successfully.',
      type: 'info',
    })

    refetch()

  }, [refetch])

  // SAFE FILTERING
  const safeBookings = Array.isArray(bookings)
    ? bookings
    : []

  const filtered =
    activeTab === 'all'
      ? safeBookings
      : safeBookings.filter(
          b => b?.status?.toLowerCase() === activeTab
        )

  const tabCount = (status) =>
    status === 'all'
      ? safeBookings.length
      : safeBookings.filter(
          b => b?.status?.toLowerCase() === status
        ).length

  return (
    <div className="min-h-screen bg-ink-50">

      {/* HEADER */}
      <div className="bg-ink-950 pt-20 pb-8">

        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          <p className="section-label text-gold-400 mb-2">
            Your history
          </p>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
            My Bookings
          </h1>

          <p className="text-ink-400 mt-2">
            View and manage all your expert sessions
          </p>

        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {!email ? (

          <div className="card p-8 max-w-md mx-auto text-center animate-slide-up">

            <div className="w-14 h-14 bg-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-4">

              <svg
                className="w-7 h-7 text-gold-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>

            </div>

            <h2 className="font-display text-xl font-semibold text-ink-900 mb-2">
              Enter your email
            </h2>

            <p className="text-sm text-ink-500 mb-6">
              We'll look up bookings associated with your email address.
            </p>

            <form
              onSubmit={handleEmailSubmit}
              className="space-y-3"
            >

              <input
                type="email"
                value={inputEmail}
                onChange={e => setInputEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field text-center"
                required
                autoFocus
              />

              <button
                type="submit"
                className="btn-primary w-full justify-center"
              >
                View My Bookings
              </button>

            </form>
          </div>

        ) : (

          <>
            {/* EMAIL BAR */}
            <div className="flex items-center justify-between mb-6">

              <div className="flex items-center gap-2 text-sm">

                <svg
                  className="w-4 h-4 text-ink-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>

                <span className="text-ink-500">
                  Showing bookings for
                </span>

                <span className="font-medium text-ink-800 font-mono">
                  {email}
                </span>

              </div>

              <button
                onClick={() => {
                  setEmail('')
                  setInputEmail('')
                }}
                className="text-xs text-ink-400 hover:text-ink-600 transition-colors"
              >
                Change email
              </button>

            </div>

            {/* STATUS FILTERS */}
            {!loading &&
              !error &&
              safeBookings.length > 0 && (

              <div className="flex gap-1 mb-6 overflow-x-auto pb-1">

                {STATUS_TABS.map(tab => (

                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 capitalize flex items-center gap-2',
                      activeTab === tab
                        ? 'bg-ink-900 text-white'
                        : 'text-ink-500 hover:bg-ink-100'
                    )}
                  >

                    {tab}

                    <span
                      className={cn(
                        'text-xs px-1.5 py-0.5 rounded-full font-mono',
                        activeTab === tab
                          ? 'bg-ink-700 text-ink-200'
                          : 'bg-ink-100 text-ink-500'
                      )}
                    >
                      {tabCount(tab)}
                    </span>

                  </button>

                ))}
              </div>
            )}

            {/* CONTENT */}
            {error ? (

              <ErrorState
                title="Failed to load bookings"
                message={error}
                onRetry={refetch}
              />

            ) : loading ? (

              <div className="space-y-4">

                {Array(3)
                  .fill(0)
                  .map((_, i) => (

                  <div
                    key={i}
                    className="card p-5 space-y-3"
                  >

                    <div className="flex gap-4">

                      <Skeleton className="w-12 h-12 rounded-xl" />

                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>

                    </div>

                    <Skeleton className="h-3 w-2/3" />
                  </div>

                ))}
              </div>

            ) : filtered.length === 0 ? (

              <EmptyState
                title="No bookings found"
                message="No bookings available for this filter."
                action={
                  <Link to="/" className="btn-primary">
                    Browse Experts
                  </Link>
                }
              />

            ) : (

              <div className="space-y-4 stagger">

                {filtered.map(booking => (

                  <BookingCard
                    key={booking._id || booking.id}
                    booking={booking}
                    onCancelled={handleCancelled}
                  />

                ))}
              </div>

            )}
          </>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
} 