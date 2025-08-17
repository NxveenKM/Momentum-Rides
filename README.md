Momentum Rides - Full-Stack Car Rental Website
==============================================

Welcome to Momentum Rides! This is a complete, full-stack car rental web application built from the ground up. It features a clean, modern user interface, a dynamic vehicle fleet, and a fully functional booking system that saves reservations to a live cloud database.

This project was developed on a fine Sunday in Jaipur, Rajasthan, and serves as a comprehensive prototype for a real-world car rental business.

**Live Demo:**

-   **Frontend (GitHub Pages):**  `[https://nxveenkm.github.io/Momentum-Rides/]`

-   **Backend API (Render):**  `https://momentum-rides.onrender.com`

---

Features
--------

-   **Dynamic Vehicle Fleet:** Browse a filterable list of available cars fetched in real-time from the backend API.

-   **Seamless Booking Journey:** A user-friendly, multi-step process that carries user selections (dates, location) from the homepage to the final booking confirmation.

-   **Persistent Bookings:** A fully operational booking system that saves customer reservations to a permanent MongoDB Atlas cloud database.

-   **Live Deployment:** The entire application is deployed with a modern hybrid hosting approach.

-   **Functional Contact Form:** A working contact form integrated with Formspree to forward inquiries directly to your email.

-   **Comprehensive Static Pages:** Professionally designed pages for "About Us," "Services," and "Contact," complete with an embedded Google Map.

-   **Responsive Design:** A mobile-first design that ensures a great user experience on desktops, tablets, and smartphones.

---

## Technology Stack

| **Category** | **Technology**                            | **Description**                                                               |
| ------------ | ----------------------------------------- | ----------------------------------------------------------------------------- |
| Frontend     | HTML5, CSS3, JavaScript (ES6+)            | For the structure, styling, and interactivity of the user interface.          |
| Backend      | Node.js, Express.js                       | For building the robust, server-side REST API.                                |
| Database     | MongoDB Atlas, Mongoose                   | A NoSQL cloud database for storing booking data, with Mongoose as the ODM.    |
| Deployment   | GitHub Pages (Frontend), Render (Backend) | For hosting the static frontend and the dynamic backend server 24/7.          |
| Dev Tools    | `nodemon`, `dotenv`                       | For automatic server restarts and secure management of environment variables. |
---

Setup and Installation for Local Development
--------------------------------------------

To get a copy of this project running on your local machine, follow these steps.

### Prerequisites

-   **Node.js and npm:** Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/ "null").

-   **Git:** You will need Git to clone the repository.

### Installation Steps

1.  **Clone the Repository**

    ```
    git clone https://github.com/NxveenKM/Momentum-Rides.git
    cd Momentum-Rides

    ```

2.  **Install Backend Dependencies** This will install all the necessary packages for the server, like Express, Mongoose, and Nodemon.

    ```
    npm install

    ```

3.  **Set Up Environment Variables** The server needs a secret connection string to connect to your database.

    -   Create a new file in the root of the project named `.env`

    -   Inside this file, add your MongoDB Atlas connection string:

        ```
        MONGO_URI=mongodb+srv://your_username:your_password@your_cluster_url/MomentumRidesDB?retryWrites=true&w=majority

        ```

    -   Remember to replace the placeholders with your actual database credentials.

4.  **Run the Backend Server** This command uses `nodemon` to start your server, which will automatically restart when you save changes.

    ```
    npm run start:dev

    ```

    Your backend will now be running at `http://localhost:3000`. You should see a success message in the terminal confirming the database connection.

5.  **Run the Frontend** The easiest way to run the frontend is with a live server extension.

    -   If you are using Visual Studio Code, install the **"Live Server"** extension.

    -   Right-click on the `index.html` file and select "Open with Live Server".

    -   Your browser will open the website, and it will be fully connected to your local backend server.

---

Project Structure
-----------------

```
/
├── .env              # Stores secret keys (DO NOT COMMIT)
├── node_modules/     # Stores all backend dependencies
├── index.html        # Homepage
├── fleet.html        # Fleet page
├── booking.html      # Booking page
├── about.html        # About Us page
├── services.html     # Services page
├── contact.html      # Contact page
├── style.css         # Main stylesheet
├── script.js         # JS for homepage
├── fleet.js          # JS for fleet page
├── booking.js        # JS for booking page
├── server.js         # The main backend Express server file
├── package.json      # Lists project dependencies and scripts
└── README.md         # This file

```

---
