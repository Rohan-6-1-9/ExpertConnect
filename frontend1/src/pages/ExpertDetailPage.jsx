import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { format, startOfToday } from 'date-fns'
import { useExpertDetail, useExpertSlots } from '../hooks'
import SlotPicker from '../components/experts/SlotPicker'
import { Avatar, StarRating, Badge, ExpertDetailSkeleton, ErrorState, Toast } from '../components/ui'
import { formatCurrency, cn } from '../utils'

export default function ExpertDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { expert, loading, error } = useExpertDetail(id)
  const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)

const [selectedDate, setSelectedDate] = useState(
  format(tomorrow, 'yyyy-MM-dd')
)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const { slots, loading: slotsLoading } = useExpertSlots(id, selectedDate)

  function handleBookNow() {
    if (!selectedSlot) return
    navigate(`/experts/${id}/book`, {
      state: { expert, selectedDate, selectedSlot, slots }
    })
  }

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <ExpertDetailSkeleton />
    </div>
  )

  if (error) return (
    <div className="pt-24">
      <ErrorState title="Expert not found" message={error} />
    </div>
  )

  if (!expert) return null

  const {
  name,
  domain,
  profileImage,
  bio,
  rating,
  reviewCount,
  sessionRate,
  currency = 'USD',
  skills = [],
  experience,
  education = [],
  languages = [],
  isAvailable,
  responseTime,
  completedSessions,
} = expert

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Header */}
      <div className="bg-ink-950 pt-20 pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-ink-400 hover:text-white text-sm transition-colors mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Experts
          </Link>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <Avatar src={profileImage} name={name} size="xl" className="ring-4 ring-ink-800" />
            <div className="flex-1">
              <div className="flex flex-wrap items-start gap-3">
                <div>
                  <h1 className="font-display text-3xl font-bold text-white">{name}</h1>
                  <p className="text-ink-300 mt-1">{domain}</p>
                </div>
                {isAvailable !== undefined && (
                  <span className={cn(
                    'mt-1 px-3 py-1 rounded-full text-xs font-medium border',
                    isAvailable
                      ? 'bg-jade-900/40 text-jade-300 border-jade-700'
                      : 'bg-rose-900/30 text-rose-300 border-rose-800'
                  )}>
                    {isAvailable ? '● Available' : '● Unavailable'}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-3">
                <StarRating rating={rating} count={reviewCount} size="lg" />
                {domain && <Badge variant="gold">{domain}</Badge>}
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
                {completedSessions != null && (
                  <span className="text-ink-400">
                    <span className="text-white font-medium">{completedSessions}</span> sessions
                  </span>
                )}
                {responseTime && (
                  <span className="text-ink-400">
                    Responds in <span className="text-white font-medium">{responseTime}</span>
                  </span>
                )}
                {experience && (
                  <span className="text-ink-400">
                    <span className="text-white font-medium">{experience}</span> experience
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <p className="text-ink-400 text-sm mb-1">Starting from</p>
              <p className="font-display text-3xl font-bold text-gold-400">
                {formatCurrency(sessionRate, currency)}
              </p>
              <p className="text-ink-400 text-sm">per hour</p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column */}
          <div className="lg:col-span-3 space-y-8">
            {/* Bio */}
            {bio && (
              <section className="card p-6 animate-slide-up">
                <h2 className="font-display text-xl font-semibold text-ink-900 mb-4">About</h2>
                <p className="text-ink-600 leading-relaxed whitespace-pre-line">{bio}</p>
              </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <section className="card p-6" style={{ animationDelay: '0.1s' }}>
                <h2 className="font-display text-xl font-semibold text-ink-900 mb-4">Skills & Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section className="card p-6">
                <h2 className="font-display text-xl font-semibold text-ink-900 mb-4">Education</h2>
                <div className="space-y-3">
                  {education.map((edu, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-ink-800 text-sm">{edu.degree || edu.title}</p>
                        <p className="text-xs text-ink-500">{edu.institution} · {edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <section className="card p-6">
                <h2 className="font-display text-xl font-semibold text-ink-900 mb-4">Languages</h2>
                <div className="flex flex-wrap gap-2">
                  {languages.map(lang => (
                    <Badge key={lang} variant="default">{lang}</Badge>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right column — Slot Picker + CTA */}
          <div className="lg:col-span-2">
            <div className="card p-6 sticky top-24">
              <h2 className="font-display text-xl font-semibold text-ink-900 mb-5">Book a Session</h2>

              <SlotPicker
                slots={slots}
                loading={slotsLoading}
                selectedDate={selectedDate}
                onDateChange={(date) => {
                  setSelectedDate(date)
                  setSelectedSlot(null)
                }}
                selectedSlot={selectedSlot}
                onSlotSelect={setSelectedSlot}
              />

              {/* Realtime indicator */}
              <div className="flex items-center gap-2 mt-4 text-xs text-ink-400">
                <span className="w-1.5 h-1.5 rounded-full bg-jade-400 animate-pulse-slow" />
                Availability updates in real-time
              </div>

              <button
                disabled={!selectedSlot}
                onClick={handleBookNow}
                className={cn(
                  'w-full mt-5 py-3 rounded-xl font-medium text-sm transition-all duration-200',
                  selectedSlot
                    ? 'bg-ink-900 text-white hover:bg-ink-700 shadow-ink'
                    : 'bg-ink-100 text-ink-400 cursor-not-allowed'
                )}
              >
                {selectedSlot ? 'Continue to Book →' : 'Select a time slot'}
              </button>

              <p className="text-center text-xs text-ink-400 mt-3">
                No charge until booking is confirmed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
