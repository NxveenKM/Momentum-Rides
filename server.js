// server.js - The complete backend API server

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

// --- UPDATED "DATABASE" WITH NEW, WORKING IMAGE URLS ---
const cars = [
    { id: 1, name: "Kia Seltos", type: "SUV", passengers: 5, luggage: 3, transmission: "Automatic", price_per_day: 2200, image_url: "https://www.cartoq.com/wp-content/uploads/2024/12/2024-Kia-Seltos-hybrid-rendering-.jpg" },
    { id: 2, name: "Hyundai Verna", type: "Sedan", passengers: 5, luggage: 2, transmission: "Automatic", price_per_day: 1800, image_url: "https://www.carscoops.com/wp-content/uploads/2023/03/2023-b-Hyundai-Verna-Accent-3.jpg" },
    { id: 3, name: "Ford Mustang", type: "Luxury", passengers: 2, luggage: 1, transmission: "Automatic", price_per_day: 4500, image_url: "https://www.bpmcdn.com/f/files/lacombe/import/2023-11/34476566_web1_231107-TodaysDrive-2025FordMustangGTD_1.jpg;w=960" },
    { id: 4, name: "Toyota Innova", type: "Van", passengers: 7, luggage: 4, transmission: "Manual", price_per_day: 2500, image_url: "https://www.thrustzone.com/wp-content/uploads/2025/05/Hycross-EE-toyota-innova-2025-scaled.jpg" },
    { id: 5, name: "Honda City", type: "Sedan", passengers: 5, luggage: 3, transmission: "Automatic", price_per_day: 2400, image_url: "https://gaadiwaadi.com/wp-content/uploads/2024/11/2025-honda-city-1164x720.jpg" },
    { id: 6, name: "Mahindra Thar", type: "SUV", passengers: 4, luggage: 2, transmission: "Manual", price_per_day: 2800, image_url: "https://images.overdrive.in/wp-content/uploads/2024/08/mahindra-thar-roxx-left-front-three-quarter0-2024-08-51d5acbccf5c2cdcd8c1e31cb6ff58ff.jpg" }
];

// --- API ENDPOINTS ---

// GET endpoint for all cars
app.get('/api/cars', (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] Request received for all cars.`);
    res.json(cars);
});

// GET endpoint for a single car by ID
app.get('/api/cars/:id', (req, res) => {
    const carId = parseInt(req.params.id);
    console.log(`[${new Date().toLocaleTimeString()}] Request received for car ID: ${carId}`);
    const car = cars.find(c => c.id === carId);

    if (car) {
        res.json(car);
    } else {
        res.status(404).json({ message: 'Car not found' });
    }
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`Server is running for Momentum Rides Jaipur on http://localhost:${PORT}`);
});