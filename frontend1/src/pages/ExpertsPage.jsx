import { useState, useCallback } from 'react'
import { useExperts, useCategories } from '../hooks'
import ExpertCard from '../components/experts/ExpertCard'
import SearchAndFilter from '../components/experts/SearchAndFilter'
import { ExpertCardSkeleton, ErrorState, EmptyState, Pagination } from '../components/ui'
import { Link } from 'react-router-dom'

const INITIAL_FILTERS = {
  search: '',
  category: '',
  sortBy: 'rating',
  minPrice: undefined,
  maxPrice: undefined,
  page: 1,
  limit: 9,
}

export default function ExpertsPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const { experts, pagination, loading, error, refetch } = useExperts(filters)
  const { categories } = useCategories()

  const handleFilterChange = useCallback((updates) => {
    setFilters(prev => ({ ...prev, ...updates }))
  }, [])

  const handlePageChange = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Hero banner */}
      <div className="bg-ink-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <div className="max-w-2xl">
            <p className="section-label text-gold-400 mb-3">World-class expertise, on demand</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight mb-4">
              Find Your Perfect<br />
              <span className="text-gold-400 italic">Expert</span>
            </h1>
            <p className="text-ink-300 text-lg leading-relaxed">
              Book 1-on-1 sessions with verified professionals across design, development, business, and more.
            </p>

            <div className="flex items-center gap-6 mt-8">
              {[
                { num: '500+', label: 'Experts' },
                { num: '10k+', label: 'Sessions' },
                { num: '4.9★', label: 'Avg Rating' },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div className="font-display text-2xl font-bold text-gold-400">{num}</div>
                  <div className="text-xs text-ink-400 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky search bar */}
      <div className="bg-white border-b border-ink-100 shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <SearchAndFilter
            filters={filters}
            onChange={handleFilterChange}
            categories={categories}
            loading={loading}
          />
        </div>
      </div>

      {/* Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-ink-500">
            {loading ? (
              <span className="shimmer-bg h-4 w-32 rounded inline-block" />
            ) : (
              <>
                <span className="font-medium text-ink-900">{pagination.total}</span>
                {' '}expert{pagination.total !== 1 ? 's' : ''} found
                {filters.category && <> in <span className="text-gold-600">{filters.category}</span></>}
              </>
            )}
          </p>
          <p className="text-xs text-ink-400 font-mono">
            Page {pagination.page} of {pagination.totalPages}
          </p>
        </div>

        {/* Grid */}
        {error ? (
          <ErrorState
            title="Failed to load experts"
            message={error}
            onRetry={refetch}
          />
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
            {Array(9).fill(0).map((_, i) => <ExpertCardSkeleton key={i} />)}
          </div>
        ) : experts.length === 0 ? (
          <EmptyState
            title="No experts found"
            message="Try adjusting your search or filters to find what you're looking for."
            action={
              <button
                onClick={() => setFilters(INITIAL_FILTERS)}
                className="btn-primary"
              >
                Reset filters
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
            {experts.map(expert => (
              <ExpertCard key={expert._id || expert.id} expert={expert} />
            ))}
          </div>
        )}

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  )
}
