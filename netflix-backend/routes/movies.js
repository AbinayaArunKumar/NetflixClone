const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET route to retrieve video link by movie name
router.get('/video-link/:name', async (req, res) => {
    const movieName = req.params.name;

    try {
        const [result] = await pool.query(
            `SELECT GetVideoLink(?) AS videoLink`,
            [movieName]
        );

        if (result[0] && result[0].videoLink) {
            return res.status(200).json({ videoLink: result[0].videoLink });
        } else {
            console.warn("Video link not found for movie:", movieName);
            return res.status(404).json({ message: "Video link not found." });
        }
    } catch (error) {
        console.error("Error retrieving video link:", error);
        return res.status(500).json({ message: "Failed to retrieve video link." });
    }
});

// Route to get genres
router.get('/genres', async (req, res) => {
    try {
        const [genres] = await pool.query('SELECT * FROM Genres');
        res.json(genres);
    } catch (error) {
        console.error("Error fetching genres:", error);
        res.status(500).json({ message: "Error fetching genres" });
    }
});

// Route to get directors
router.get('/directors', async (req, res) => {
    try {
        const [directors] = await pool.query('SELECT * FROM Directors');
        res.json(directors);
    } catch (error) {
        console.error("Error fetching directors:", error);
        res.status(500).json({ message: "Error fetching directors" });
    }
});

// Get all movies with genre and director details
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                m.MovieID, m.Title, m.ReleaseDate, m.Rating, m.Description, m.VideoLink,
                m.GenreID, m.DirectorID,
                g.GenreName, d.DirectorName
            FROM Movies m
            LEFT JOIN Genres g ON m.GenreID = g.GenreID
            LEFT JOIN Directors d ON m.DirectorID = d.DirectorID
        `;
        const [movies] = await pool.query(query);
        res.json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ message: 'Error fetching movies' });
    }
});

// Add a new movie using stored procedure
router.post('/create', async (req, res) => {
    const { title, releaseDate, rating, description, genreId, directorId, videoLink } = req.body;

    if (!title || !genreId || !directorId || !videoLink) {
        return res.status(400).json({ message: 'Please fill out all required fields.' });
    }

    try {
        console.log('Creating movie with data:', req.body);
        const [result] = await pool.query(
            `CALL AddNewMovie(?, ?, ?, ?, ?, ?, ?)`,
            [title, releaseDate, rating || null, description, genreId, directorId, videoLink]
        );
        console.log('Movie created successfully:', result);
        res.status(201).json({ message: 'Movie added successfully!', movieId: result.insertId });
    } catch (error) {
        console.error('Error creating movie:', error);
        res.status(500).json({ 
            message: 'Failed to create movie.',
            error: error.message 
        });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, releaseDate, rating, description, genreId, directorId, videoLink } = req.body;

    if (!title || !genreId || !directorId || !videoLink) {
        return res.status(400).json({ message: 'Please fill out all required fields.' });
    }

    try {
        console.log('Update Movie Request:', {
            id,
            title,
            releaseDate,
            rating,
            description,
            genreId,
            directorId,
            videoLink
        });

        const [result] = await pool.query(
            `CALL UpdateMovie(?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, title, releaseDate, rating || null, description, genreId, directorId, videoLink]
        );

        console.log('Update Movie Result:', result);
        res.status(200).json({ message: 'Movie updated successfully!' });
    } catch (error) {
        console.error('Error updating movie:', error);
        res.status(500).json({ 
            message: 'Failed to update movie.',
            error: error.message 
        });
    }
});


// Delete a movie using stored procedure
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query(`CALL DeleteMovie(?)`, [id]);
        res.status(200).json({ message: 'Movie deleted successfully!' });
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).json({ message: 'Failed to delete movie.' });
    }
});

// Route to fetch all movies
router.get('/', async (req, res) => {
    try {
      // Use the connection pool to query the database
      const [movies] = await db.query('SELECT MovieID, Title, ReleaseDate FROM Movies');
  
      // Return the movie data as a JSON response
      res.json(movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
      res.status(500).json({ error: 'Error fetching movies' });
    }
  });

// Route to add actors to a movie
router.post('/actors', async (req, res) => {
    const { movieId, actorIds } = req.body;  // Destructure movieId and actorIds from request body

    // Validate input
    if (!movieId || !actorIds || actorIds.length === 0) {
        return res.status(400).json({ message: 'Please select a movie and at least one actor!' });
    }

    try {
        // Loop through the array of actorIds and insert each pair into the movies_actors table
        const values = actorIds.map((actorId) => [movieId, actorId]);

        // Use a single query to insert all actor-movie associations at once
        const query = 'INSERT INTO movies_actors (MovieID, ActorID) VALUES ?';
        await pool.query(query, [values]);

        // Return a success response
        res.status(200).json({ message: 'Actors successfully added to the movie!' });
    } catch (error) {
        console.error('Error adding actors to movie:', error);
        res.status(500).json({ message: 'An error occurred while adding actors to the movie.' });
    }
});

  
module.exports = router;