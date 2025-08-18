// server.js - UPDATED with Admin Dashboard Endpoint

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Loads variables from .env file

const app = express();
const PORT = 3000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // Needed to parse incoming JSON data from frontend

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Successfully connected to MongoDB Atlas!'))
  .catch(err => console.error('❌ Connection error', err));

// --- DATABASE SCHEMA & MODEL ---
// A Schema is the blueprint for our data
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

// A Model is the tool we use to interact with the 'bookings' collection
const Booking = mongoose.model('Booking', bookingSchema);

// --- Car list (still served from here for now) ---
const cars = [
    { id: 1, name: "Kia Seltos", type: "SUV", passengers: 5, luggage: 3, transmission: "Automatic", price_per_day: 2200, image_url: "https://images.unsplash.com/photo-1617835129019-3d1ff9283bcc?q=80&w=1974" },
    { id: 2, name: "Hyundai Verna", type: "Sedan", passengers: 5, luggage: 2, transmission: "Automatic", price_per_day: 1800, image_url: "https://images.unsplash.com/photo-1617469767050-14e523b0e1c7?q=80&w=2070" },
    { id: 3, name: "Ford Mustang", type: "Luxury", passengers: 2, luggage: 1, transmission: "Automatic", price_per_day: 4500, image_url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=2070" },
    { id: 4, name: "Toyota Innova", type: "Van", passengers: 7, luggage: 4, transmission: "Manual", price_per_day: 2500, image_url: "https://images.unsplash.com/photo-1606553942247-8271a34b39b9?q=80&w=1932" },
    { id: 5, name: "Honda City", type: "Sedan", passengers: 5, luggage: 3, transmission: "Automatic", price_per_day: 2400, image_url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070" },
    { id: 6, name: "Mahindra Thar", type: "SUV", passengers: 4, luggage: 2, transmission: "Manual", price_per_day: 2800, image_url: "https://images.unsplash.com/photo-1622393069503-b67339d9f58a?q=80&w=1964" },
    { id: 7, name: "Tata Nexon", type: "SUV", passengers: 5, luggage: 2, transmission: "Manual", price_per_day: 1900, image_url: "https://images.unsplash.com/photo-1642398454283-696142717a61?q=80&w=2070" }
];

// --- API ENDPOINTS ---
app.get('/api/cars', (req, res) => res.json(cars));

app.get('/api/cars/:id', (req, res) => {
    const car = cars.find(c => c.id === parseInt(req.params.id));
    if (car) res.json(car);
    else res.status(404).json({ message: 'Car not found' });
});

app.post('/api/bookings', async (req, res) => {
    console.log('Received booking request:', req.body);
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json({ success: true, message: 'Booking confirmed successfully!' });
    } catch (error) {
        console.error('Error saving booking:', error);
        res.status(500).json({ success: false, message: 'Failed to confirm booking.' });
    }
});

// === NEW ENDPOINT TO GET ALL BOOKINGS FOR THE ADMIN DASHBOARD ===
app.get('/api/bookings', async (req, res) => {
    try {
        // Find all documents in the 'bookings' collection
        // Sort by bookingDate in descending order (-1) to show the newest bookings first
        const bookings = await Booking.find({}).sort({ bookingDate: -1 });
        res.json(bookings);
    } catch (error)
    {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch bookings.' });
    }
});


// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`Server is running for Momentum Rides Jaipur on http://localhost:${PORT}`);
});
