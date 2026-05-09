import { format, parseISO, isValid } from 'date-fns'
import clsx from 'clsx'

export { clsx }

export function cn(...args) {
  return clsx(...args)
}

export function formatDate(dateStr, fmt = 'MMM d, yyyy') {
  if (!dateStr) return '—'
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr)
    return isValid(d) ? format(d, fmt) : '—'
  } catch {
    return '—'
  }
}

export function formatCurrency(amount, currency = 'USD') {
  if (amount == null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function getInitials(name = '') {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'confirmed': return 'bg-jade-100 text-jade-600 border-jade-200'
    case 'pending':   return 'bg-gold-100 text-gold-600 border-gold-200'
    case 'cancelled': return 'bg-rose-100 text-rose-500 border-rose-200'
    case 'completed': return 'bg-ink-100 text-ink-500 border-ink-200'
    default:          return 'bg-ink-100 text-ink-400 border-ink-200'
  }
}

export function generateTimeSlots(start = 9, end = 17, interval = 60) {
  const slots = []
  for (let h = start; h < end; h++) {
    const hour = h % 12 === 0 ? 12 : h % 12
    const ampm = h < 12 ? 'AM' : 'PM'
    slots.push(`${hour}:00 ${ampm}`)
    if (interval === 30) slots.push(`${hour}:30 ${ampm}`)
  }
  return slots
}

export function truncate(str, len = 120) {
  if (!str || str.length <= len) return str
  return str.slice(0, len).trimEnd() + '…'
}

export function debounce(fn, delay = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export const SORT_OPTIONS = [
  { value: 'rating',    label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc',label: 'Price: High to Low' },
  { value: 'newest',    label: 'Newest' },
]
