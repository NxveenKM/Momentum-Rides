// server.js - UPDATED with Admin Login Endpoint

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Loads variables from .env file

const app = express();
const PORT = 3000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Successfully connected to MongoDB Atlas!'))
  .catch(err => console.error('❌ Connection error', err));

// --- DATABASE SCHEMA & MODEL ---
const bookingSchema = new mongoose.Schema({
    carId: Number,
    carName: String,
    userName: String,
    userEmail: String,
    startDate: Date,
    endDate: Date,
    totalCost: Number,
    bookingDate: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', bookingSchema);

// --- Car list (still served from here for now) ---
const cars = [
    { id: 1, name: "Kia Seltos", type: "SUV", passengers: 5, luggage: 3, transmission: "Automatic", price_per_day: 2200, image_url: "https://www.cartoq.com/wp-content/uploads/2024/12/2024-Kia-Seltos-hybrid-rendering-.jpg" },
    { id: 2, name: "Hyundai Verna", type: "Sedan", passengers: 5, luggage: 2, transmission: "Automatic", price_per_day: 1800, image_url: "https://www.carscoops.com/wp-content/uploads/2023/03/2023-b-Hyundai-Verna-Accent-3.jpg" },
    { id: 3, name: "Ford Mustang", type: "Luxury", passengers: 2, luggage: 1, transmission: "Automatic", price_per_day: 4500, image_url: "https://www.bpmcdn.com/f/files/lacombe/import/2023-11/34476566_web1_231107-TodaysDrive-2025FordMustangGTD_1.jpg;w=960" },
    { id: 4, name: "Toyota Innova", type: "Van", passengers: 7, luggage: 4, transmission: "Manual", price_per_day: 2500, image_url: "https://www.thrustzone.com/wp-content/uploads/2025/05/Hycross-EE-toyota-innova-2025-scaled.jpg" },
    { id: 5, name: "Honda City", type: "Sedan", passengers: 5, luggage: 3, transmission: "Automatic", price_per_day: 2400, image_url: "https://gaadiwaadi.com/wp-content/uploads/2024/11/2025-honda-city-1164x720.jpg" },
    { id: 6, name: "Mahindra Thar", type: "SUV", passengers: 4, luggage: 2, transmission: "Manual", price_per_day: 2800, image_url: "https://images.overdrive.in/wp-content/uploads/2024/08/mahindra-thar-roxx-left-front-three-quarter0-2024-08-51d5acbccf5c2cdcd8c1e31cb6ff58ff.jpg" },
    { id: 7, name: "Tata Nexon", type: "Compact SUV", passengers: 5, luggage: 2, transmission: "Automatic", price_per_day: 2000, image_url: "https://stimg.cardekho.com/images/carexteriorimages/930x620/Tata/Nexon/9675/1751559838445/front-left-side-47.jpg?impolicy=resize&imwidth=420" }
];

// --- API ENDPOINTS ---

// GET all cars for the fleet page
app.get('/api/cars', (req, res) => res.json(cars));

// GET a single car by its ID for the booking page
app.get('/api/cars/:id', (req, res) => {
    const car = cars.find(c => c.id === parseInt(req.params.id));
    if (car) res.json(car);
    else res.status(404).json({ message: 'Car not found' });
});

// POST a new booking from the booking page
app.post('/api/bookings', async (req, res) => {
    // ... same as before ...
});

// GET all bookings for the admin dashboard
app.get('/api/bookings', async (req, res) => {
    // ... same as before ...
});

// === NEW ADMIN LOGIN ENDPOINT ===
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Get the correct credentials from the secure .env file
    const correctUsername = process.env.ADMIN_USERNAME;
    const correctPassword = process.env.ADMIN_PASSWORD;

    // Check if the submitted credentials match
    if (username === correctUsername && password === correctPassword) {
        // If they match, send a success response
        res.json({ success: true, message: 'Login successful' });
    } else {
        // If they don't match, send a failure response
        res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
});


// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`Server is running for Momentum Rides Jaipur on http://localhost:${PORT}`);
});