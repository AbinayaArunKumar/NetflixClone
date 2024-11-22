const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const moviesRoute = require('./routes/movies');
const genresRouter = require('./routes/genres');
const actorsRouter = require('./routes/actors');

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend's URL if different
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization']  // Allow specific headers
}));
app.use(bodyParser.json());

// Define a root route
app.get('/', (req, res) => {
  res.send('Welcome to the API!'); // Respond with a welcome message or any other information
});

// Your existing routes for signup and login should be defined here
app.use('/api/users', require('./routes/users')); // Adjust the path as necessary
app.use('/api/movies', moviesRoute);
app.use('/api/genres', genresRouter);
app.use('/api/actors', actorsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
