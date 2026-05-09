import { Link } from 'react-router-dom'
import { Badge, StarRating, Avatar } from '../ui'
import { formatCurrency, truncate } from '../../utils'

export default function ExpertCard({ expert }) {
 const {
  _id,
  id,
  name,
  domain,
  profileImage,
  bio,
  rating,
  reviewCount,
  sessionRate,
  currency = 'USD',
  skills = [],
  isAvailable,
} = expert

  const expertId = _id || id

  return (
    <article className="card p-5 flex flex-col gap-4 group hover:-translate-y-0.5 transition-transform duration-300">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Avatar src={profileImage} name={name} size="lg" className="flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-ink-900 text-[1.05rem] leading-tight truncate">
              {name}
            </h3>
            {isAvailable !== undefined && (
              <span className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 ${isAvailable ? 'bg-jade-400' : 'bg-rose-300'}`} title={isAvailable ? 'Available' : 'Unavailable'} />
            )}
          </div>
          <p className="text-sm text-ink-500 mt-0.5 truncate">{domain}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <StarRating rating={rating} count={reviewCount} />
          </div>
        </div>
      </div>

      {/* Category */}
      {domain && (
  <Badge variant="gold" className="self-start">{domain}</Badge>
)}

      {/* Bio */}
      {bio && (
        <p className="text-sm text-ink-500 leading-relaxed">
          {truncate(bio, 110)}
        </p>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 4).map(skill => (
            <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
          ))}
          {skills.length > 4 && (
            <Badge variant="outline" className="text-xs">+{skills.length - 4}</Badge>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 mt-auto border-t border-ink-100">
        <div>
          <span className="text-xs text-ink-400 font-mono">from</span>
          <span className="ml-1.5 font-display font-semibold text-ink-900">
            {formatCurrency(sessionRate, currency)}
          </span>
          <span className="text-xs text-ink-400 font-mono">/hr</span>
        </div>
        <Link
          to={`/experts/${expertId}`}
          className="btn-primary text-xs px-4 py-2"
        >
          View Profile
          <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  )
}
