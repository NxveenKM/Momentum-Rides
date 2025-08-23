// server.js - FINAL CORRECTED VERSION with Full Booking Edit Logic

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
  .then(() => {
      console.log('✅ Successfully connected to MongoDB Atlas!');
      seedInitialCars();
  })
  .catch(err => console.error('❌ Connection error', err));

// --- DATABASE SCHEMAS & MODELS ---
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

const carSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    type: String,
    passengers: Number,
    luggage: Number,
    transmission: String,
    price_per_day: Number,
    image_url: String,
    stock: { type: Number, default: 1 }
});
const Car = mongoose.model('Car', carSchema);

// --- Initial Data for Cars ---
const initialCars = [
    { id: 3, name: "Ford Mustang", type: "Luxury", passengers: 2, luggage: 1, transmission: "Automatic", price_per_day: 4500, image_url: "https://www.bpmcdn.com/f/files/lacombe/import/2023-11/34476566_web1_231107-TodaysDrive-2025FordMustangGTD_1.jpg;w=960", stock: 1 }
];

async function seedInitialCars() {
    try {
        const count = await Car.countDocuments();
        if (count === 0) {
            console.log('No cars found in database. Seeding initial data...');
            await Car.insertMany(initialCars);
            console.log('Initial car data has been seeded successfully.');
        }
    } catch (error) {
        console.error('Error seeding initial car data:', error);
    }
}

const pickupLocations = [
    "Jaipur International Airport (JAI)",
    "Jaipur Junction Railway Station",
    "Sindhi Camp Bus Station",
    "Mall of Jaipur"
];


// --- API ENDPOINTS ---

// GET all cars (with availability filtering)
app.get('/api/cars', async (req, res) => {
    const { pickup, dropoff } = req.query;
    try {
        const allCars = await Car.find({}).sort({ id: 1 });
        if (!pickup || !dropoff) return res.json(allCars);
        
        const requestedPickup = new Date(pickup);
        requestedPickup.setUTCHours(0, 0, 0, 0);
        const requestedDropoff = new Date(dropoff);
        requestedDropoff.setUTCHours(0, 0, 0, 0);

        const conflictingBookings = await Booking.find({
            status: 'Approved',
            startDate: { $lte: requestedDropoff },
            endDate: { $gte: requestedPickup }
        });

        const bookingCounts = {};
        conflictingBookings.forEach(booking => {
            bookingCounts[booking.carId] = (bookingCounts[booking.carId] || 0) + 1;
        });

        const availableCars = allCars.filter(car => {
            const bookedCount = bookingCounts[car.id] || 0;
            return car.stock > bookedCount;
        });

        res.json(availableCars);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cars' });
    }
});

// GET all unique car types
app.get('/api/cars/types', async (req, res) => {
    try {
        const types = await Car.distinct('type');
        res.json(types);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching car types' });
    }
});

// GET all pickup locations
app.get('/api/locations', (req, res) => {
    res.json(pickupLocations);
});

// GET a single car by its ID
app.get('/api/cars/:id', async (req, res) => {
    try {
        const car = await Car.findOne({ id: parseInt(req.params.id) });
        if (car) res.json(car);
        else res.status(404).json({ message: 'Car not found' });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching car' });
    }
});

// POST a new car
app.post('/api/cars', async (req, res) => {
    try {
        const newCar = new Car(req.body);
        await newCar.save();
        res.status(201).json({ success: true, message: 'Car added successfully', car: newCar });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add car' });
    }
});

// PATCH (update) an existing car
app.patch('/api/cars/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCar = await Car.findOneAndUpdate({ id: id }, req.body, { new: true });
        if (!updatedCar) return res.status(404).json({ success: false, message: 'Car not found' });
        res.json({ success: true, message: 'Car updated successfully', car: updatedCar });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update car' });
    }
});

// DELETE a car
app.delete('/api/cars/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCar = await Car.findOneAndDelete({ id: id });
        if (!deletedCar) return res.status(404).json({ success: false, message: 'Car not found' });
        res.json({ success: true, message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete car' });
    }
});


// --- Booking and Login Endpoints ---

// POST a new booking
app.post('/api/bookings', async (req, res) => {
    try {
        const { carId, startDate, endDate } = req.body;

        const car = await Car.findOne({ id: carId });
        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found.' });
        }

        const conflictingBookings = await Booking.find({
            carId: carId,
            status: 'Approved',
            startDate: { $lt: new Date(endDate) },
            endDate: { $gt: new Date(startDate) }
        });

        if (conflictingBookings.length >= car.stock) {
            return res.status(409).json({
                success: false, 
                message: 'Sorry, this car is fully booked for the selected dates. Please try another date range.' 
            });
        }

        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json({ success: true, message: 'Booking confirmed successfully!' });
    } catch (error) {
        console.error('Error saving booking:', error);
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

// PATCH to update a booking's details or status (UPDATED)
app.patch('/api/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // The request body can now contain any booking field (userName, startDate, status, etc.)
        const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.json({ success: true, booking: updatedBooking });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ success: false, message: 'Failed to update booking' });
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