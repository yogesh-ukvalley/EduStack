// const express = require('express');
// const connectDB = require('./config/db');

// const app = express();

// // Connect to MongoDB
// connectDB();

// // Middleware to parse JSON
// app.use(express.json());

// // Routes
// app.use('/api', require('./routes/contactRoute'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:8081",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:8081",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "https://edustack.ca",
  "https://www.edustack.ca",
  "http://edustack.ca",
  "http://www.edustack.ca",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow all origins in development
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      // In production, check against allowed origins
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all for now, can restrict later
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api', require('./routes/contactRoute'));
app.use('/api', require('./routes/authRoute'));
app.use('/api', require('./routes/staffRoute'));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});