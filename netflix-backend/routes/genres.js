const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import the connection pool

// POST route for creating a new genre
router.post('/create', async (req, res) => {
  const { genreName } = req.body;

  if (!genreName) {
    return res.status(400).json({ message: 'Genre name is required' });
  }

  try {
    const [result] = await pool.execute('INSERT INTO Genres (GenreName) VALUES (?)', [genreName]);
    return res.status(200).json({
      message: 'Genre created successfully',
      genreId: result.insertId,
    });
  } catch (error) {
    console.error('Error creating genre:', error);
    return res.status(500).json({ message: 'Failed to create genre' });
  }
});

// GET route to fetch all genres
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT GenreID, GenreName FROM Genres');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching genres:', err);
    res.status(500).json({ message: 'Error fetching genres' });
  }
});

// DELETE route to delete a genre by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute('DELETE FROM Genres WHERE GenreID = ?', [id]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Genre deleted successfully' });
    } else {
      res.status(404).json({ message: 'Genre not found' });
    }
  } catch (error) {
    console.error('Error deleting genre:', error);
    res.status(500).json({ message: 'Failed to delete genre' });
  }
});

// PUT route to update a genre by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { genreName } = req.body;

  try {
    const [result] = await pool.execute(
      'UPDATE Genres SET GenreName = ? WHERE GenreID = ?',
      [genreName, id]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Genre updated successfully' });
    } else {
      res.status(404).json({ message: 'Genre not found' });
    }
  } catch (error) {
    console.error('Error updating genre:', error);
    res.status(500).json({ message: 'Failed to update genre' });
  }
});


module.exports = router;