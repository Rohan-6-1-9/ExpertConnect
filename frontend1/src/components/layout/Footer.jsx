import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-ink-950 text-ink-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gold-500 rounded flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-ink-950" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="font-display text-white font-semibold">
              Expert<span className="text-gold-400">Connect</span>
            </span>
          </div>

          <p className="text-xs text-ink-500 font-mono">
            © {new Date().getFullYear()} ExpertConnect. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-xs">
            <Link to="/" className="hover:text-white transition-colors">Browse Experts</Link>
            <Link to="/my-bookings" className="hover:text-white transition-colors">My Bookings</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
