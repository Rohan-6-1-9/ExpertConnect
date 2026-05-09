import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { BookingProvider } from './context/BookingContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ExpertsPage from './pages/ExpertsPage'
import ExpertDetailPage from './pages/ExpertDetailPage'
import BookingFormPage from './pages/BookingFormPage'
import MyBookingsPage from './pages/MyBookingsPage'
import NotFoundPage from './pages/NotFoundPage'

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

// Layout wrapper for pages with Navbar + Footer
function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BookingProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={
            <MainLayout>
              <ExpertsPage />
            </MainLayout>
          } />

          <Route path="/experts/:id" element={
            <MainLayout>
              <ExpertDetailPage />
            </MainLayout>
          } />

          <Route path="/experts/:id/book" element={
            <MainLayout>
              <BookingFormPage />
            </MainLayout>
          } />

          <Route path="/my-bookings" element={
            <MainLayout>
              <MyBookingsPage />
            </MainLayout>
          } />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </BookingProvider>
  )
}
