// server.js - FINAL CORRECTED VERSION with Robust Availability Filtering

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

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
    location: { type: String, required: false },
    bookingDate: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Declined', 'Completed'],
        default: 'Pending'
    }
});
const Booking = mongoose.model('Booking', bookingSchema);

// --- Car list ---
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

// GET all cars for the fleet page (UPDATED with corrected date filtering logic)
app.get('/api/cars', async (req, res) => {
    const { pickup, dropoff } = req.query;

    if (!pickup || !dropoff) {
        return res.json(cars);
    }

    try {
        const requestedPickup = new Date(pickup);
        requestedPickup.setUTCHours(0, 0, 0, 0);

        const requestedDropoff = new Date(dropoff);
        requestedDropoff.setUTCHours(0, 0, 0, 0);

        // Find all 'Approved' bookings that conflict with the requested date range
        const conflictingBookings = await Booking.find({
            status: 'Approved',
            // === THIS IS THE CORRECTED LOGIC ===
            // An existing booking conflicts if its range overlaps with the requested range.
            // (Existing Start <= Requested End) AND (Existing End >= Requested Start)
            startDate: { $lte: requestedDropoff },
            endDate: { $gte: requestedPickup }
        });

        const unavailableCarIds = conflictingBookings.map(booking => booking.carId);
        const availableCars = cars.filter(car => !unavailableCarIds.includes(car.id));

        res.json(availableCars);

    } catch (error) {
        console.error('Error fetching available cars:', error);
        res.status(500).json({ message: 'Error filtering cars by availability' });
    }
});

// GET a single car by its ID
app.get('/api/cars/:id', (req, res) => {
    const car = cars.find(c => c.id === parseInt(req.params.id));
    if (car) res.json(car);
    else res.status(404).json({ message: 'Car not found' });
});

// POST a new booking
app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json({ success: true, message: 'Booking confirmed successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to confirm booking.' });
    }
});

// GET all bookings for the admin dashboard
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find({}).sort({ bookingDate: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch bookings.' });
    }
});

// POST to log in an admin
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const correctUsername = process.env.ADMIN_USERNAME;
    const correctPassword = process.env.ADMIN_PASSWORD;
    if (username === correctUsername && password === correctPassword) {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
});

// PATCH to update a booking's status
app.patch('/api/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedBooking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.json({ success: true, booking: updatedBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update booking status' });
    }
});

// DELETE a booking
app.delete('/api/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBooking = await Booking.findByIdAndDelete(id);
        if (!deletedBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.json({ success: true, message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete booking' });
    }
});


// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`Server is running for Momentum Rides Jaipur on http://localhost:${PORT}`);
});