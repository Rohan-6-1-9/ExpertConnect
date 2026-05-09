import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '../ui'
import {
  formatDate,
  formatCurrency,
  getStatusColor,
  cn
} from '../../utils'

import { bookingsApi } from '../../api'

export default function BookingCard({
  booking = {},
  onCancelled,
}) {

  const [cancelling, setCancelling] = useState(false)
  const [expanded, setExpanded] = useState(false)

  // SAFE BOOKING ACCESS
  const {
    _id,
    id,
    expert = {},
    slotDate,
    slotTime,
    status = 'pending',
    notes,
    createdAt,
  } = booking || {}

  const bookingId = _id || id

  // SAFE EXPERT ACCESS
  const {
    name = 'Expert',
    domain,
    profileImage,
    sessionRate,
    currency = 'USD',
  } = expert || {}

  const canCancel = [
    'pending',
    'confirmed',
  ].includes(status?.toLowerCase?.())

  async function handleCancel() {

    const confirmed = window.confirm(
      'Cancel this booking?'
    )

    if (!confirmed) return

    setCancelling(true)

    try {

      await bookingsApi.cancel(bookingId)

      onCancelled?.(bookingId)

    } catch (err) {

      alert(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to cancel booking'
      )

    } finally {

      setCancelling(false)

    }
  }

  return (
    <article className="card overflow-hidden">

      {/* STATUS BAR */}
      <div
        className={cn('h-1', {
          'bg-jade-300':
            status === 'confirmed',

          'bg-gold-400':
            status === 'pending',

          'bg-rose-300':
            status === 'cancelled',

          'bg-ink-200':
            status === 'completed',
        })}
      />

      <div className="p-5">

        <div className="flex items-start gap-4">

          {/* AVATAR */}
          <Avatar
            src={profileImage}
            name={name}
            size="md"
            className="flex-shrink-0"
          />

          {/* CONTENT */}
          <div className="flex-1 min-w-0">

            <div className="flex flex-wrap items-start justify-between gap-2">

              <div>

                <h3 className="font-display font-semibold text-ink-900">
                  {name}
                </h3>

                <p className="text-sm text-ink-500">
                  {domain || 'Expert Session'}
                </p>

              </div>

              <span
                className={cn(
                  'badge border',
                  getStatusColor(status)
                )}
              >
                {status}
              </span>

            </div>

            {/* META */}
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">

              {/* DATE */}
              <span className="flex items-center gap-1.5 text-ink-600">

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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>

                {slotDate
                  ? formatDate(slotDate)
                  : 'No date'}

              </span>

              {/* TIME */}
              {slotTime && (

                <span className="flex items-center gap-1.5 text-ink-600">

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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>

                  <span className="font-mono">
                    {slotTime}
                  </span>

                </span>
              )}

              {/* PRICE */}
              {sessionRate != null && (

                <span className="flex items-center gap-1.5 text-ink-600">

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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>

                  {formatCurrency(
                    sessionRate,
                    currency
                  )}

                </span>
              )}
            </div>
          </div>
        </div>

        {/* NOTES */}
        {notes && (

          <div className="mt-3">

            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-ink-400 hover:text-ink-600 flex items-center gap-1 transition-colors"
            >

              <svg
                className={cn(
                  'w-3.5 h-3.5 transition-transform',
                  expanded && 'rotate-90'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>

              {expanded
                ? 'Hide notes'
                : 'Show notes'}

            </button>

            {expanded && (

              <p className="mt-2 text-sm text-ink-600 bg-ink-50 rounded-lg p-3 border border-ink-100 leading-relaxed animate-fade-in">
                {notes}
              </p>

            )}
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-4 pt-4 border-t border-ink-100 flex flex-wrap items-center justify-between gap-3">

          <p className="text-xs text-ink-400 font-mono">

            Booked{' '}

            {createdAt
              ? formatDate(createdAt)
              : 'recently'}

          </p>

          <div className="flex gap-2">

            {(expert?._id || expert?.id) && (

              <Link
                to={`/experts/${expert._id || expert.id}`}
                className="btn-secondary text-xs px-3 py-1.5"
              >
                View Expert
              </Link>

            )}

            {canCancel && (

              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="btn-secondary text-xs px-3 py-1.5 text-rose-500 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
              >

                {cancelling
                  ? 'Cancelling…'
                  : 'Cancel'}

              </button>

            )}
          </div>
        </div>
      </div>
    </article>
  )
}