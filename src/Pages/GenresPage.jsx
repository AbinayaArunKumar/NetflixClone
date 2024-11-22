import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GenresPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [genreName, setGenreName] = useState('');
  const [genres, setGenres] = useState([]);
  const [editingGenreId, setEditingGenreId] = useState(null); // State for editing

  useEffect(() => {
    fetchGenres();
  }, []);

  // Fetch genres from the backend
  const fetchGenres = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/genres');
      setGenres(response.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  // Handle creating a new genre
  const handleCreateGenre = () => {
    setEditingGenreId(null); // Reset editing state for creating new genre
    setGenreName('');
    setIsModalOpen(true);
  };

  // Handle editing an existing genre
  const handleEditGenre = (id, name) => {
    setEditingGenreId(id); // Set the editing ID
    setGenreName(name); // Pre-fill the genre name in the input field
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setGenreName('');
    setEditingGenreId(null);
  };

  // Handle submitting the form (either create or edit)
  const handleSubmit = async () => {
    if (genreName.trim() === '') {
      alert('Genre name is required!');
      return;
    }

    if (editingGenreId) {
      // Update existing genre
      try {
        await axios.put(`http://localhost:5000/api/genres/${editingGenreId}`, {
          genreName,
        });

        // Update the genre in the local state
        setGenres(
          genres.map((genre) =>
            genre.GenreID === editingGenreId
              ? { ...genre, GenreName: genreName }
              : genre
          )
        );
        handleCloseModal();
      } catch (error) {
        console.error('Error updating genre:', error);
      }
    } else {
      // Create a new genre
      try {
        const response = await axios.post('http://localhost:5000/api/genres/create', {
          genreName,
        });

        // Add the new genre to the state
        setGenres([
          ...genres,
          { GenreID: response.data.genreId, GenreName: genreName },
        ]);
        handleCloseModal();
      } catch (error) {
        console.error('Error creating genre:', error);
      }
    }
  };

  // Handle deleting a genre
  const handleDeleteGenre = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/genres/${id}`);

      // Filter out the deleted genre from the state
      setGenres(genres.filter((genre) => genre.GenreID !== id));
    } catch (error) {
      console.error('Error deleting genre:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Manage Genre</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>#</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Genre Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Operation</th>
          </tr>
        </thead>
        <tbody>
          {genres.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                No genres available.
              </td>
            </tr>
          ) : (
            genres.map((genre, index) => (
              <tr key={genre.GenreID}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{index + 1}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{genre.GenreName}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <button
                    style={{
                      backgroundColor: '#ffc107',
                      color: 'white',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginRight: '5px',
                    }}
                    onClick={() => handleEditGenre(genre.GenreID, genre.GenreName)}
                  >
                    Edit
                  </button>
                  <button
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleDeleteGenre(genre.GenreID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={handleCreateGenre}
      >
        + Create Genre
      </button>

      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            width: '300px',
          }}
        >
          <h3>{editingGenreId ? 'Edit Genre' : 'Create New Genre'}</h3>
          <input
            type="text"
            value={genreName}
            onChange={(e) => setGenreName(e.target.value)}
            placeholder="Enter genre name"
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontSize: '16px',
              color: '#333',
              backgroundColor: '#f9f9f9',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={handleSubmit}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              {editingGenreId ? 'Update' : 'Create'}
            </button>
            <button
              onClick={handleCloseModal}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenresPage;
