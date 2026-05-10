# ExpertConnect

A full-stack real-time expert session booking platform built using React, Node.js, Express, MongoDB, and Socket.io.

Users can browse experts, check live slot availability, and book consultation sessions in real time.

---

## 🚀 Live Demo

### Frontend
[Live Frontend URL](expert-booking-system-chi.vercel.app)

### Backend API
[Live Backend API](https://expert-booking-system-w91b.onrender.com)

---

## 📌 Features

- Browse expert profiles
- Search experts by name
- Filter experts by:
  - Rating
  - Price
  - Category
- Real-time slot booking system
- Prevent double booking
- Live slot updates using Socket.io
- Booking confirmation workflow
- My Bookings page
- Booking cancellation
- Responsive modern UI
- REST API integration
- MongoDB database integration

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router
- Socket.io Client

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Socket.io
- dotenv

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 📂 Project Structure

```bash
expert-booking-system/
│
├── backend/
│   ├── server/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── socket/
│   │   ├── utils/
│   │   ├── app.js
│   │   ├── server.js
│   │   └── seed.js
│
├── frontend1/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── socket/
│   │   └── utils/
│   │
│   ├── public/
│   └── vite.config.js
│
└── README.md
