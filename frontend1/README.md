# ExpertConnect — Frontend

React + Vite frontend for the Expert Booking Platform.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Routing | React Router v6 |
| HTTP | Axios (with interceptors) |
| Real-time | Socket.io-client |
| Styling | Tailwind CSS v3 |
| Date utils | date-fns |

## Project Structure

```
src/
├── api/
│   └── index.js           # Axios instance + all API calls
├── socket/
│   └── index.js           # Socket.io client + subscription helpers
├── context/
│   └── BookingContext.jsx  # Global user info context
├── hooks/
│   └── index.js           # useExperts, useExpertDetail, useExpertSlots, useBookings
├── utils/
│   └── index.js           # Formatters, debounce, constants
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── ui/
│   │   └── index.jsx      # Skeleton, ErrorState, EmptyState, Badge, StarRating,
│   │                      # Pagination, Avatar, Toast, LoadingSpinner
│   ├── experts/
│   │   ├── ExpertCard.jsx
│   │   ├── SearchAndFilter.jsx
│   │   └── SlotPicker.jsx     # Real-time slot disabling via socket
│   └── bookings/
│       └── BookingCard.jsx    # With inline cancel action
├── pages/
│   ├── ExpertsPage.jsx        # Listing + search + filter + pagination
│   ├── ExpertDetailPage.jsx   # Expert profile + slot picker
│   ├── BookingFormPage.jsx    # Booking form + summary
│   ├── MyBookingsPage.jsx     # User bookings + status tabs
│   └── NotFoundPage.jsx
├── App.jsx                    # Router + layouts
├── main.jsx
└── index.css                  # Tailwind + design tokens
```

## Pages

### 1. Experts Listing (`/`)
- Search by name/skill (debounced, 350ms)
- Filter by category (pill toggles)
- Filter by price range (min/max)
- Sort by rating, price, newest
- Pagination with smooth scroll
- Loading skeletons, error state, empty state

### 2. Expert Detail (`/experts/:id`)
- Full profile: bio, skills, education, languages
- Real-time slot picker (socket disables booked slots instantly)
- 14-day date strip
- Sticky booking card
- "Continue to Book" CTA (requires slot selection)

### 3. Booking Form (`/experts/:id/book`)
- Name, email (required), phone, notes
- Client-side validation
- Session summary sidebar
- Redirects to My Bookings on success
- Saves email to localStorage for returning users

### 4. My Bookings (`/my-bookings`)
- Email-gated (persists across sessions)
- Status tabs: All / Pending / Confirmed / Completed / Cancelled
- Inline cancel action
- Loading skeletons, error state, empty state
- Success toast on redirect from BookingForm

## Real-time Slot Disabling

The `useExpertSlots` hook combines:
1. HTTP fetch for initial slot data (`GET /api/experts/:id/slots?date=`)
2. Socket.io subscription via `subscribeToExpertSlots(expertId, callback)`

When another user books a slot, the server emits `slot_update` with `{ expertId, slotId, status: 'booked' }`.
The `SlotPicker` instantly grays out and line-throughs that slot without a page refresh.

## API Contract Expected

```
GET    /api/experts?page&limit&search&category&minPrice&maxPrice&sortBy
GET    /api/experts/:id
GET    /api/experts/:id/slots?date=YYYY-MM-DD
GET    /api/experts/categories
POST   /api/bookings          { expertId, slotId, date, name, email, phone, notes }
GET    /api/bookings?email=
GET    /api/bookings/:id
PATCH  /api/bookings/:id/cancel

Socket events:
  client → server:  join_expert_room   { expertId }
  client → server:  leave_expert_room  { expertId }
  server → client:  slot_update        { expertId, slotId, status }
```

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Backend must run at `http://localhost:5000` (proxied via Vite).
