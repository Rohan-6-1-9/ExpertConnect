import { cn } from '../../utils'

// ─── Skeleton ─────────────────────────────────────────────────────────────
export function Skeleton({ className }) {
  return (
    <div className={cn('shimmer-bg rounded-lg', className)} />
  )
}

export function ExpertCardSkeleton() {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-ink-100">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  )
}

export function ExpertDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Skeleton className="h-64 rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

// ─── ErrorState ───────────────────────────────────────────────────────────
export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mb-4">
        <svg className="w-7 h-7 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h3 className="font-display text-lg text-ink-800 mb-1">{title}</h3>
      {message && <p className="text-sm text-ink-500 mb-5 max-w-sm">{message}</p>}
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary text-sm">
          Try again
        </button>
      )}
    </div>
  )
}

// ─── EmptyState ───────────────────────────────────────────────────────────
export function EmptyState({ icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="w-14 h-14 bg-ink-100 rounded-2xl flex items-center justify-center mb-4 text-ink-400">
        {icon || (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </div>
      <h3 className="font-display text-lg text-ink-800 mb-1">{title}</h3>
      {message && <p className="text-sm text-ink-500 mb-5 max-w-sm">{message}</p>}
      {action}
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────
export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default:   'bg-ink-100 text-ink-600',
    gold:      'bg-gold-100 text-gold-600',
    jade:      'bg-jade-100 text-jade-600',
    rose:      'bg-rose-100 text-rose-500',
    outline:   'border border-ink-200 text-ink-600 bg-transparent',
  }
  return (
    <span className={cn('badge', variants[variant] || variants.default, className)}>
      {children}
    </span>
  )
}

// ─── StarRating ───────────────────────────────────────────────────────────
export function StarRating({ rating = 0, count, size = 'sm' }) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1)
  const sz = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5'
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex gap-0.5">
        {stars.map(i => (
          <svg key={i} className={cn(sz, i <= rating ? 'text-gold-400' : 'text-ink-200')} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </span>
      <span className="text-xs text-ink-500 font-mono">{Number(rating).toFixed(1)}</span>
      {count != null && <span className="text-xs text-ink-400">({count})</span>}
    </span>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────
export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const delta = 1
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    pages.push(i)
  }

  const buttonBase = 'w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-150'

  return (
    <nav className="flex items-center justify-center gap-1 mt-10" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={cn(buttonBase, 'text-ink-500 hover:bg-ink-100 disabled:opacity-30 disabled:cursor-not-allowed')}
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages[0] > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className={cn(buttonBase, 'text-ink-600 hover:bg-ink-100')}>1</button>
          {pages[0] > 2 && <span className="px-1 text-ink-400">…</span>}
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={cn(
            buttonBase,
            p === page
              ? 'bg-ink-900 text-white shadow-sm'
              : 'text-ink-600 hover:bg-ink-100'
          )}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="px-1 text-ink-400">…</span>}
          <button onClick={() => onPageChange(totalPages)} className={cn(buttonBase, 'text-ink-600 hover:bg-ink-100')}>{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={cn(buttonBase, 'text-ink-500 hover:bg-ink-100 disabled:opacity-30 disabled:cursor-not-allowed')}
        aria-label="Next page"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────
export function Avatar({ src, name = '', size = 'md', className }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-12 h-12 text-sm', lg: 'w-16 h-16 text-base', xl: 'w-20 h-20 text-lg' }
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['bg-gold-200 text-gold-700', 'bg-jade-100 text-jade-600', 'bg-rose-100 text-rose-500', 'bg-ink-100 text-ink-600']
  const color = colors[(name.charCodeAt(0) || 0) % colors.length]

  return src
    ? <img src={src} alt={name} className={cn('rounded-xl object-cover', sizes[size], className)} />
    : (
      <div className={cn('rounded-xl flex items-center justify-center font-display font-semibold', sizes[size], color, className)}>
        {initials}
      </div>
    )
}

// ─── Toast ────────────────────────────────────────────────────────────────
export function Toast({ message, type = 'success', onClose }) {
  const styles = {
    success: 'bg-jade-100 border-jade-200 text-jade-700',
    error:   'bg-rose-100 border-rose-200 text-rose-600',
    info:    'bg-gold-100 border-gold-200 text-gold-700',
  }
  return (
    <div className={cn(
      'fixed bottom-5 right-5 z-[100] px-4 py-3 rounded-xl border shadow-card',
      'flex items-center gap-3 animate-slide-in-right max-w-sm',
      styles[type]
    )}>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="opacity-60 hover:opacity-100 ml-auto">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

// ─── LoadingSpinner ───────────────────────────────────────────────────────
export function LoadingSpinner({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
  return (
    <svg className={cn('animate-spin text-ink-400', sizes[size])} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
