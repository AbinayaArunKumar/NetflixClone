import React, { useState, useEffect } from 'react';
import axios from 'axios';


const MoviesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movieTitle, setMovieTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [rating, setRating] = useState('');
  const [description, setDescription] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [movies, setMovies] = useState([]);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [genres, setGenres] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedDirector, setSelectedDirector] = useState('');

  useEffect(() => {
    fetchMovies();
    fetchGenres();
    fetchDirectors();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/movies');
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/movies/genres');
      setGenres(response.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchDirectors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/movies/directors');
      setDirectors(response.data);
    } catch (error) {
      console.error('Error fetching directors:', error);
    }
  };

  const handleCreateMovie = () => {
    setEditingMovieId(null);
    setMovieTitle('');
    setReleaseDate('');
    setRating('');
    setDescription('');
    setVideoLink('');
    setSelectedGenre('');
    setSelectedDirector('');
    setIsModalOpen(true);
  };

  const handleEditMovie = (id, title, genreId, directorId, releaseDate, rating, description, videoLink) => {
    setEditingMovieId(id);
    setMovieTitle(title);
    setSelectedGenre(genreId);
    setSelectedDirector(directorId);
    setReleaseDate(new Date(releaseDate).toISOString().split('T')[0]); // Format the date
    setRating(rating);
    setDescription(description);
    setVideoLink(videoLink);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMovieTitle('');
    setReleaseDate('');
    setRating('');
    setDescription('');
    setVideoLink('');
    setSelectedGenre('');
    setSelectedDirector('');
  };

  const handleSubmit = async () => {
    const movieData = {
      title: movieTitle, // Ensure keys match backend expectations
      releaseDate: releaseDate,
      rating: rating,
      description: description,
      genreId: selectedGenre,
      directorId: selectedDirector,
      videoLink: videoLink,
    };
    try {
      if (editingMovieId) {
        await axios.put(`http://localhost:5000/api/movies/${editingMovieId}`, movieData);
      } else {
        await axios.post('http://localhost:5000/api/movies/create', movieData); // Ensure correct endpoint
      }
      fetchMovies();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving movie:', error);
    }
  };

  const handleDeleteMovie = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/movies/${id}`);
      fetchMovies();
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Manage Movies</h1>
  
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>#</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Movie Title</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Genre</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Director</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie, index) => (
            <tr key={movie.MovieID}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{index + 1}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{movie.Title}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{movie.GenreName}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{movie.DirectorName}</td>
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
                  onClick={() =>
                    handleEditMovie(
                      movie.MovieID,
                      movie.Title,
                      movie.GenreID,
                      movie.DirectorID,
                      movie.ReleaseDate,
                      movie.Rating,
                      movie.Description,
                      movie.VideoLink
                    )
                  }
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
                  onClick={() => handleDeleteMovie(movie.MovieID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
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
        onClick={handleCreateMovie}
      >
        + Create Movie
      </button>
  
      {isModalOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
            onClick={handleCloseModal}
          />
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
            <h3>{editingMovieId ? 'Edit Movie' : 'Create New Movie'}</h3>
            <input
              type="text"
              value={movieTitle}
              onChange={(e) => setMovieTitle(e.target.value)}
              placeholder="Enter movie title"
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '16px',
                backgroundColor: '#f9f9f9',
                color: '#333', // Darker font color
              }}
            />
            <input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              placeholder="Release Date"
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '16px',
                backgroundColor: '#f9f9f9',
                color: '#333', // Darker font color
              }}
            />
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="Rating (0.0 - 10.0)"
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '16px',
                backgroundColor: '#f9f9f9',
                color: '#333', // Darker font color
              }}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '16px',
                backgroundColor: '#f9f9f9',
                height: '100px',
                color: '#333', // Darker font color
              }}
            />
            <input
              type="text"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              placeholder="Video Link"
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '16px',
                backgroundColor: '#f9f9f9',
                color: '#333', // Darker font color
              }}
            />
  
            <div style={{ marginBottom: '10px' }}>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  backgroundColor: '#f9f9f9',
                  color: '#333', // Darker font color
                }}
              >
                <option value="">Select Genre</option>
                {genres.map((genre) => (
                  <option key={genre.GenreID} value={genre.GenreID}>
                    {genre.GenreName}
                  </option>
                ))}
              </select>
  
              <select
                value={selectedDirector}
                onChange={(e) => setSelectedDirector(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  backgroundColor: '#f9f9f9',
                  color: '#333', // Darker font color
                }}
              >
                <option value="">Select Director</option>
                {directors.map((director) => (
                  <option key={director.DirectorID} value={director.DirectorID}>
                    {director.DirectorName}
                  </option>
                ))}
              </select>
            </div>
  
            <div style={{ textAlign: 'center' }}>
              <button
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginRight: '10px',
                }}
                onClick={handleSubmit}
              >
                {editingMovieId ? 'Update Movie' : 'Create Movie'}
              </button>
              <button
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
  
};

export default MoviesPage;
