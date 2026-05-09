import { useState } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { bookingsApi } from '../api'
import { Avatar, Toast } from '../components/ui'
import { formatDate, formatCurrency, cn } from '../utils'
import { useBookingContext } from '../context/BookingContext'

export default function BookingFormPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { userName, userEmail, saveUserInfo } = useBookingContext()

  const { expert, selectedDate, selectedSlot, slots = [] } = location.state || {}

  const slot = slots.find(
    s => (s._id || s.id) === (selectedSlot?._id || selectedSlot)
  )

  const [form, setForm] = useState({
    name: userName || '',
    email: userEmail || '',
    phone: '',
    notes: '',
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  function validate() {
    const e = {}

    if (!form.name.trim()) {
      e.name = 'Name is required'
    }

    if (!form.email.trim()) {
      e.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = 'Enter a valid email'
    }

    if (
      form.phone &&
      !/^\+?[\d\s\-()]{7,}$/.test(form.phone)
    ) {
      e.phone = 'Enter a valid phone number'
    }

    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const errs = validate()

    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setSubmitting(true)
    setErrors({})

    try {
      saveUserInfo(form.name, form.email)

      const payload = {
        expertId: expert?._id || expert?.id || id,
        slotId: slot?._id || slot?.id,
        clientName: form.name,
        clientEmail: form.email,
        clientPhone: form.phone,
        notes: form.notes,
      }

      const res = await bookingsApi.create(payload)

      const booking = res.data?.booking || res.data

      navigate('/my-bookings', {
        state: {
          successBookingId: booking?._id || booking?.id
        }
      })

    } catch (err) {
      setToast({
        message: err.response?.data?.message || err.message,
        type: 'error',
      })
    } finally {
      setSubmitting(false)
    }
  }

  function handleChange(field, value) {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  if (!expert || !selectedSlot) {
    return (
      <div className="min-h-screen bg-ink-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <p className="text-ink-500 mb-4">
            Booking session expired or invalid.
          </p>

          <Link to="/" className="btn-primary">
            Browse Experts
          </Link>
        </div>
      </div>
    )
  }

  const {
    name,
    profileImage,
    domain,
    sessionRate,
    currency = 'USD',
  } = expert

  return (
    <div className="min-h-screen bg-ink-50">

      {/* Header */}
      <div className="bg-ink-950 pt-20 pb-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          <Link
            to={`/experts/${expert._id || expert.id}`}
            className="inline-flex items-center gap-2 text-ink-400 hover:text-white text-sm transition-colors mb-6"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>

            Back to Profile
          </Link>

          <h1 className="font-display text-3xl font-bold text-white">
            Confirm Booking
          </h1>

          <p className="text-ink-400 mt-1">
            Fill in your details to complete the reservation
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* FORM */}
          <div className="lg:col-span-3">

            <form
              onSubmit={handleSubmit}
              className="card p-6 space-y-5 animate-slide-up"
            >

              <h2 className="font-display text-lg font-semibold text-ink-900">
                Your Information
              </h2>

              {/* NAME */}
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder="Jane Smith"
                  className={cn(
                    'input-field',
                    errors.name &&
                    'ring-2 ring-rose-400 border-transparent'
                  )}
                />

                {errors.name && (
                  <p className="text-xs text-rose-500 mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="jane@example.com"
                  className={cn(
                    'input-field',
                    errors.email &&
                    'ring-2 ring-rose-400 border-transparent'
                  )}
                />

                {errors.email && (
                  <p className="text-xs text-rose-500 mt-1">
                    {errors.email}
                  </p>
                )}

                <p className="text-xs text-ink-400 mt-1">
                  Used to access your bookings later
                </p>
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className={cn(
                    'input-field',
                    errors.phone &&
                    'ring-2 ring-rose-400 border-transparent'
                  )}
                />

                {errors.phone && (
                  <p className="text-xs text-rose-500 mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* NOTES */}
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">
                  Notes for the Expert
                </label>

                <textarea
                  value={form.notes}
                  onChange={e => handleChange('notes', e.target.value)}
                  rows={4}
                  className="input-field resize-none"
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-gold w-full py-3 text-base justify-center"
              >
                {submitting ? 'Confirming…' : 'Confirm Booking'}
              </button>
            </form>
          </div>

          {/* SUMMARY */}
          <div className="lg:col-span-2">

            <div className="card p-6 sticky top-24 space-y-5">

              <h2 className="font-display text-lg font-semibold text-ink-900">
                Booking Summary
              </h2>

              <div className="flex items-center gap-3 pb-4 border-b border-ink-100">
                <Avatar
                  src={profileImage}
                  name={name}
                  size="md"
                />

                <div>
                  <p className="font-medium text-ink-900 text-sm">
                    {name}
                  </p>

                  <p className="text-xs text-ink-500">
                    {domain}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">

                <div className="flex justify-between">
                  <span className="text-ink-500">
                    Date
                  </span>

                  <span className="font-medium text-ink-900">
                    {formatDate(selectedDate)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-ink-500">
                    Time
                  </span>

                  <span className="font-medium text-ink-900">
                    {slot?.time || '—'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-ink-500">
                    Duration
                  </span>

                  <span className="font-medium text-ink-900">
                    60 min
                  </span>
                </div>

                <div className="flex justify-between pt-3 border-t border-ink-100">
                  <span className="text-ink-700 font-medium">
                    Total
                  </span>

                  <span className="font-display font-bold text-ink-900 text-lg">
                    {formatCurrency(sessionRate, currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
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