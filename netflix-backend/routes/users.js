const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db'); // Ensure this points to your database connection file

// Sign-up route
router.post('/signup', async (req, res) => {
    console.log('Request body:', req.body);
    const { username, email, password } = req.body;
    try {
        // Check if the email already exists
        const [existingUser] = await pool.query('SELECT * FROM users WHERE Email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const [result] = await pool.query(
            'INSERT INTO users (Username, Email, Password, Role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, 'User'] // Default role is 'User'
        );

        res.status(201).json({ id: result.insertId, username, email });
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).json({ message: 'Error signing up user', error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [user] = await pool.query('SELECT * FROM users WHERE Email = ?', [email]);
        if (user.length > 0) {
            const isMatch = await bcrypt.compare(password, user[0].Password);
            if (isMatch) {
                const { UserID, Username, Email, Role } = user[0];
                res.status(200).json({ message: 'Login successful', user: { UserID, Username, Email, Role } });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
});

// Admin login route
router.post('/login-admin', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Retrieve the user from the database
        const [user] = await pool.query('SELECT * FROM users WHERE Email = ?', [email]);
        
        if (user.length > 0) {
            const isMatch = await bcrypt.compare(password, user[0].Password);

            // Check if credentials match and user has 'Admin' role
            if (isMatch && user[0].Role === 'Admin') {
                const { UserID, Username, Email, Role } = user[0];
                res.status(200).json({ message: 'Admin login successful', user: { UserID, Username, Email, Role } });
            } else if (isMatch) {
                res.status(403).json({ message: 'Access denied: Admins only' });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).json({ message: 'Error logging in admin', error: error.message });
    }
});

router.post('/watchlist', async (req, res) => {
    const { userId, movieTitle } = req.body;

    try {
        // Retrieve the MovieID from the database using the movie title
        const [movie] = await pool.query('SELECT MovieID FROM movies WHERE Title = ?', [movieTitle]);

        if (movie.length === 0) {
            return res.status(404).json({ message: 'Movie not found in database' });
        }

        const movieId = movie[0].MovieID;

        // Try inserting the movie into the watchlist
        await pool.query(
            'INSERT INTO watchlists (UserID, MovieID, DateAdded) VALUES (?, ?, NOW())',
            [userId, movieId]
        );

        res.status(201).json({ message: 'Movie added to watchlist successfully' });

    } catch (error) {
        // Check if the error is related to the trigger (duplicate movie entry)
        if (error.code === '45000' && error.sqlMessage.includes('Movie already exists in watchlist')) {
            return res.status(409).json({ message: 'Movie already exists in watchlist' });
        }

        // Log and return a generic error if something else goes wrong
        console.error('Error adding movie to watchlist:', error);
        res.status(500).json({ message: 'Error adding movie to watchlist', error: error.message });
    }
});



// Fetch user's watchlist
router.get('/watchlist/:userId', async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'UserId is required' });
    }

    try {
        // Query to fetch movies in the user's watchlist
        const [watchlist] = await pool.query(`
            SELECT w.MovieID, m.Title, m.ReleaseDate, m.Description
            FROM watchlists w
            JOIN movies m ON w.MovieID = m.MovieID
            WHERE w.UserID = ?
            ORDER BY w.DateAdded DESC
        `, [userId]);

        if (watchlist.length === 0) {
            return res.status(404).json({ message: 'No movies found in the watchlist for this user' });
        }

        res.status(200).json(watchlist);
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        res.status(500).json({ message: 'Error fetching watchlist', error: error.message });
    }
});

router.delete('/watchlist/:userId/remove/:movieId', async (req, res) => {
    const { userId, movieId } = req.params;

    console.log('Received request to remove movie from watchlist, userId:', userId, 'movieId:', movieId);

    try {
        // Call the function using SELECT (since it's a function, not a stored procedure)
        const [result] = await pool.query('SELECT RemoveMovieFromWatchlist(?, ?)', [userId, movieId]);

        // Log the result from the function to see the returned value
        console.log('Function result:', result);

        // The function returns 1 if successful (movie was removed), 0 otherwise
        if (result[0]['RemoveMovieFromWatchlist'] === 1) {
            res.status(200).json({ message: 'Movie removed successfully' });
        } else {
            res.status(400).json({ message: 'Movie not found in watchlist or already removed' });
        }
    } catch (error) {
        console.error('Error removing movie from watchlist:', error);
        res.status(500).json({ message: 'Error removing movie from watchlist', error: error.message });
    }
});












module.exports = router;
