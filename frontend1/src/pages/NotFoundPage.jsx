import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center">
      <div className="text-center animate-slide-up">
        <p className="font-mono text-7xl font-bold text-ink-800 mb-2">404</p>
        <h1 className="font-display text-3xl text-white mb-3">Page not found</h1>
        <p className="text-ink-400 mb-8">The page you're looking for doesn't exist or has moved.</p>
        <Link to="/" className="btn-gold">
          ← Back to Experts
        </Link>
      </div>
    </div>
  )
}
