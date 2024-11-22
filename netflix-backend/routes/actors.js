const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import the connection pool

// POST route for creating a new actor
router.post('/create', async (req, res) => {
  const { actorName, dateOfBirth } = req.body;

  if (!actorName || !dateOfBirth) {
    return res.status(400).json({ message: 'Actor name and Date of Birth are required' });
  }

  try {
    const [result] = await pool.execute('INSERT INTO Actors (ActorName, DateOfBirth) VALUES (?, ?)', [actorName, dateOfBirth]);
    return res.status(200).json({
      message: 'Actor created successfully',
      actorId: result.insertId,
    });
  } catch (error) {
    console.error('Error creating actor:', error);
    return res.status(500).json({ message: 'Failed to create actor' });
  }
});

// GET route to fetch all actors
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT ActorID, ActorName, DateOfBirth FROM Actors');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching actors:', err);
    res.status(500).json({ message: 'Error fetching actors' });
  }
});

// DELETE route to delete an actor by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute('DELETE FROM Actors WHERE ActorID = ?', [id]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Actor deleted successfully' });
    } else {
      res.status(404).json({ message: 'Actor not found' });
    }
  } catch (error) {
    console.error('Error deleting actor:', error);
    res.status(500).json({ message: 'Failed to delete actor' });
  }
});

// PUT route to update an actor by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { actorName, dateOfBirth } = req.body;

  try {
    const [result] = await pool.execute(
      'UPDATE Actors SET ActorName = ?, DateOfBirth = ? WHERE ActorID = ?',
      [actorName, dateOfBirth, id]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Actor updated successfully' });
    } else {
      res.status(404).json({ message: 'Actor not found' });
    }
  } catch (error) {
    console.error('Error updating actor:', error);
    res.status(500).json({ message: 'Failed to update actor' });
  }
});

module.exports = router;
