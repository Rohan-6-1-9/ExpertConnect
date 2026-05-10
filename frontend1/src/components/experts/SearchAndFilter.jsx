import { useEffect, useRef, useState } from 'react'
import { debounce, SORT_OPTIONS, cn } from '../../utils'
import { LoadingSpinner } from '../ui'

export default function SearchAndFilter({ filters, onChange, categories = [], loading }) {
  const [localSearch, setLocalSearch] = useState(filters.search || '')
  const debouncedRef = useRef(null)

  // Sync if external reset
  useEffect(() => {
    setLocalSearch(filters.search || '')
  }, [filters.search])

  // Debounce search
  useEffect(() => {
    debouncedRef.current = debounce((val) => {
      onChange({ search: val, page: 1 })
    }, 350)
  }, [onChange])

  function handleSearch(e) {
    const val = e.target.value
    setLocalSearch(val)
    debouncedRef.current(val)
  }

  function handleCategory(cat) {
    onChange({ category: filters.category === cat ? '' : cat, page: 1 })
  }

  function handleSort(e) {
    onChange({ sortBy: e.target.value, page: 1 })
  }

  function handlePrice(key, val) {
    onChange({ [key]: val === '' ? undefined : Number(val), page: 1 })
  }

  function clearAll() {
    setLocalSearch('')
    onChange({ search: '', category: '', sortBy: 'top-rated', minPrice: undefined, maxPrice: undefined, page: 1 })
  }

  const hasFilters = filters.search || filters.category || filters.minPrice || filters.maxPrice

  return (
    <div className="space-y-4">
      {/* Search row */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={localSearch}
            onChange={handleSearch}
            placeholder="Search experts by name…"
            className="input-field pl-10 pr-4"
          />
          {loading && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <LoadingSpinner size="sm" />
            </span>
          )}
        </div>

        {/* Sort */}
        <select
          value={filters.sortBy || 'top-rated'}
          onChange={handleSort}
          className="input-field w-auto min-w-[160px] cursor-pointer"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category pills */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150',
                  filters.category === cat
                    ? 'bg-ink-900 text-white border-ink-900'
                    : 'bg-white text-ink-600 border-ink-200 hover:border-ink-400'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Price range */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-ink-500 whitespace-nowrap">Price/hr:</span>
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={e => handlePrice('minPrice', e.target.value)}
            className="input-field w-20 text-xs px-2 py-1.5"
            min={0}
          />
          <span className="text-ink-400 text-xs">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={e => handlePrice('maxPrice', e.target.value)}
            className="input-field w-20 text-xs px-2 py-1.5"
            min={0}
          />
        </div>

        {/* Clear */}
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
