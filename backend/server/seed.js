require("dotenv").config();
const mongoose = require("mongoose");
const Expert = require("./models/Expert");
const Booking = require("./models/Booking");
const connectDB = require("./config/db");

// ── Helper: generate slots for the next N days ──
const generateSlots = (daysAhead = 7, times = ["09:00", "11:00", "14:00", "16:00"]) => {
  const slots = [];
  for (let d = 1; d <= daysAhead; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD

    times.forEach((time) => {
      slots.push({ date: dateStr, time, isBooked: false });
    });
  }
  return slots;
};

const expertsData = [
  {
    name: "Dr. Priya Sharma",
    email: "priya.sharma@experts.com",
    domain: "Machine Learning",
    bio: "PhD in AI from IIT Bombay. 10+ years in ML research and production systems at Google and startups.",
    profileImage: "https://ui-avatars.com/api/?name=Priya+Sharma&background=6366f1&color=fff",
    rating: 4.9,
    sessionRate: 120,
    availableSlots: generateSlots(7, ["09:00", "11:00", "15:00"]),
  },
  {
    name: "Arjun Mehta",
    email: "arjun.mehta@experts.com",
    domain: "Full Stack Development",
    bio: "Senior Engineer at Microsoft. Expert in React, Node.js, and cloud architecture with 8 years of experience.",
    profileImage: "https://ui-avatars.com/api/?name=Arjun+Mehta&background=10b981&color=fff",
    rating: 4.7,
    sessionRate: 90,
    availableSlots: generateSlots(7, ["10:00", "14:00", "16:00"]),
  },
  {
    name: "Sarah Chen",
    email: "sarah.chen@experts.com",
    domain: "Product Management",
    bio: "Ex-PM at Meta and Stripe. Helped launch 3 products used by millions. Specialises in 0-to-1 and growth.",
    profileImage: "https://ui-avatars.com/api/?name=Sarah+Chen&background=f59e0b&color=fff",
    rating: 4.8,
    sessionRate: 150,
    availableSlots: generateSlots(7, ["09:00", "13:00", "17:00"]),
  },
  {
    name: "Mohammed Al-Rashid",
    email: "m.alrashid@experts.com",
    domain: "Cybersecurity",
    bio: "Certified CISSP and CEH. Former security analyst at IBM. Expert in penetration testing and cloud security.",
    profileImage: "https://ui-avatars.com/api/?name=Mohammed+Al-Rashid&background=ef4444&color=fff",
    rating: 4.6,
    sessionRate: 110,
    availableSlots: generateSlots(7, ["11:00", "14:00", "16:00"]),
  },
  {
    name: "Lena Hoffmann",
    email: "lena.hoffmann@experts.com",
    domain: "UI/UX Design",
    bio: "Lead designer at Figma. Created design systems for Fortune 500 companies. Obsessed with user empathy.",
    profileImage: "https://ui-avatars.com/api/?name=Lena+Hoffmann&background=8b5cf6&color=fff",
    rating: 4.9,
    sessionRate: 100,
    availableSlots: generateSlots(7, ["10:00", "12:00", "15:00"]),
  },
  {
  name: "Emily Rodriguez",
  email: "emily.rodriguez@experts.com",
  domain: "Data Science",
  bio: "Senior Data Scientist at Netflix with expertise in recommendation systems and predictive analytics.",
  profileImage: "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=0ea5e9&color=fff",
  rating: 4.8,
  sessionRate: 130,
  availableSlots: generateSlots(7, ["09:00", "12:00", "15:00"]),
},
{
  name: "David Kim",
  email: "david.kim@experts.com",
  domain: "DevOps Engineering",
  bio: "AWS Certified DevOps architect helping startups scale infrastructure efficiently.",
  profileImage: "https://ui-avatars.com/api/?name=David+Kim&background=14b8a6&color=fff",
  rating: 4.7,
  sessionRate: 115,
  availableSlots: generateSlots(7, ["10:00", "13:00", "17:00"]),
},
{
  name: "Sophia Martinez",
  email: "sophia.martinez@experts.com",
  domain: "Digital Marketing",
  bio: "Growth marketer with 9 years experience in SEO, paid ads, and social media strategy.",
  profileImage: "https://ui-avatars.com/api/?name=Sophia+Martinez&background=f97316&color=fff",
  rating: 4.9,
  sessionRate: 95,
  availableSlots: generateSlots(7, ["11:00", "14:00", "16:00"]),
},
{
  name: "James Anderson",
  email: "james.anderson@experts.com",
  domain: "Blockchain",
  bio: "Blockchain consultant specialising in smart contracts, Ethereum, and Web3 systems.",
  profileImage: "https://ui-avatars.com/api/?name=James+Anderson&background=6366f1&color=fff",
  rating: 4.6,
  sessionRate: 140,
  availableSlots: generateSlots(7, ["09:00", "13:00", "18:00"]),
},
{
  name: "Olivia Brown",
  email: "olivia.brown@experts.com",
  domain: "Career Coaching",
  bio: "Former HR lead at Amazon helping professionals crack interviews and career transitions.",
  profileImage: "https://ui-avatars.com/api/?name=Olivia+Brown&background=ec4899&color=fff",
  rating: 4.9,
  sessionRate: 85,
  availableSlots: generateSlots(7, ["08:00", "12:00", "15:00"]),
},
{
  name: "Daniel Lee",
  email: "daniel.lee@experts.com",
  domain: "Mobile App Development",
  bio: "React Native and Flutter expert with 20+ successful apps launched globally.",
  profileImage: "https://ui-avatars.com/api/?name=Daniel+Lee&background=22c55e&color=fff",
  rating: 4.8,
  sessionRate: 125,
  availableSlots: generateSlots(7, ["10:00", "14:00", "19:00"]),
},
{
  name: "Ava Wilson",
  email: "ava.wilson@experts.com",
  domain: "UI/UX Design",
  bio: "Product designer focused on mobile-first experiences and modern design systems.",
  profileImage: "https://ui-avatars.com/api/?name=Ava+Wilson&background=a855f7&color=fff",
  rating: 4.7,
  sessionRate: 105,
  availableSlots: generateSlots(7, ["09:00", "11:00", "16:00"]),
},
{
  name: "Michael Johnson",
  email: "michael.johnson@experts.com",
  domain: "Cloud Computing",
  bio: "Google Cloud architect with expertise in scalable distributed systems.",
  profileImage: "https://ui-avatars.com/api/?name=Michael+Johnson&background=3b82f6&color=fff",
  rating: 4.8,
  sessionRate: 145,
  availableSlots: generateSlots(7, ["08:00", "13:00", "17:00"]),
},
{
  name: "Isabella Thomas",
  email: "isabella.thomas@experts.com",
  domain: "Business Strategy",
  bio: "Management consultant helping startups with product strategy and market positioning.",
  profileImage: "https://ui-avatars.com/api/?name=Isabella+Thomas&background=e11d48&color=fff",
  rating: 4.9,
  sessionRate: 150,
  availableSlots: generateSlots(7, ["10:00", "12:00", "18:00"]),
},
{
  name: "Ethan Walker",
  email: "ethan.walker@experts.com",
  domain: "Cybersecurity",
  bio: "Ethical hacker and security researcher specialising in penetration testing.",
  profileImage: "https://ui-avatars.com/api/?name=Ethan+Walker&background=0f172a&color=fff",
  rating: 4.7,
  sessionRate: 135,
  availableSlots: generateSlots(7, ["11:00", "15:00", "19:00"]),
},
];

const seed = async () => {
  try {
    await connectDB();

    console.log("🌱 Seeding database...\n");

    // ── Clear existing data ──
    await Booking.deleteMany({});
    await Expert.deleteMany({});
    console.log("🗑️  Cleared existing experts and bookings");

    // ── Insert experts ──
    const experts = await Expert.insertMany(expertsData);
    console.log(`✅ Inserted ${experts.length} experts`);

    // ── Seed 2 sample bookings using real slot IDs ──
    const expert0 = experts[0];
    const expert1 = experts[1];

    const slot0 = expert0.availableSlots[0]; // first slot of expert 0
    const slot1 = expert1.availableSlots[0]; // first slot of expert 1

    // Mark slots as booked
    slot0.isBooked = true;
    slot1.isBooked = true;
    await expert0.save();
    await expert1.save();

    const sampleBookings = [
      {
        expert: expert0._id,
        slotId: slot0._id,
        slotDate: slot0.date,
        slotTime: slot0.time,
        clientName: "Rahul Gupta",
        clientEmail: "rahul.gupta@example.com",
        clientPhone: "+91-9876543210",
        notes: "Want to discuss career transition into ML",
        status: "confirmed",
      },
      {
        expert: expert1._id,
        slotId: slot1._id,
        slotDate: slot1.date,
        slotTime: slot1.time,
        clientName: "Ananya Singh",
        clientEmail: "ananya.singh@example.com",
        notes: "Need help reviewing my portfolio project",
        status: "pending",
      },
    ];

    await Booking.insertMany(sampleBookings);
    console.log(`✅ Inserted ${sampleBookings.length} sample bookings`);

    console.log("\n🎉 Database seeded successfully!");
    console.log("─────────────────────────────────────");
    console.log("Expert IDs:");
    experts.forEach((e) => console.log(`  ${e.name} → ${e._id}`));
    console.log("─────────────────────────────────────\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();