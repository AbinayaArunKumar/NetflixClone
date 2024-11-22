import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddActorsToMovie = () => {
  const [movies, setMovies] = useState([]);  // State for movies
  const [actors, setActors] = useState([]);  // State for actors
  const [selectedMovie, setSelectedMovie] = useState('');  // State for selected movie
  const [selectedActors, setSelectedActors] = useState([]);  // State for selected actors

  useEffect(() => {
    fetchMovies();
    fetchActors();
  }, []);

  // Fetch all movies from the backend
  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/movies');
      setMovies(response.data);  // Set movies state
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  // Fetch all actors from the backend
  const fetchActors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/actors');
      setActors(response.data);  // Set actors state
    } catch (error) {
      console.error('Error fetching actors:', error);
    }
  };

  // Handle change in selected movie
  const handleMovieChange = (e) => {
    setSelectedMovie(e.target.value);
  };

  // Handle change in selected actors (checkboxes)
  const handleActorChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedActors([...selectedActors, value]);  // Add actor if checked
    } else {
      setSelectedActors(selectedActors.filter((actor) => actor !== value));  // Remove actor if unchecked
    }
  };

  // Handle submitting the form to map actors to a movie
  const handleSubmit = async () => {
    if (!selectedMovie || selectedActors.length === 0) {
      alert('Please select a movie and at least one actor!');
      return;
    }

    try {
      // Send selected movie and actors to backend
      const response = await axios.post('http://localhost:5000/api/movies/actors', {
        movieId: selectedMovie,
        actorIds: selectedActors,
      });
      
      // Show success message on successful response
      alert('Actors successfully added to movie!');
      setSelectedMovie('');  // Clear selected movie
      setSelectedActors([]);  // Clear selected actors
    } catch (error) {
      console.error('Error adding actors to movie:', error);
      alert('An error occurred while adding actors to the movie.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Add Actors to Movie</h1>

      {/* Movie selection dropdown */}
      <div style={{ margin: '20px 0' }}>
        <label style={{ fontSize: '18px', marginRight: '10px' }}>Select Movie:</label>
        <select
          value={selectedMovie}
          onChange={handleMovieChange}
          style={{
            color: '#333',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '5px',
            width: '200px',
            backgroundColor: '#fff',
          }}
        >
          <option value="" style={{ color: '#333', backgroundColor: '#fff' }}>
            --Select Movie--
          </option>
          {movies.map((movie) => (
            <option
              key={movie.MovieID}
              value={movie.MovieID}
              style={{ color: '#333', backgroundColor: '#fff' }}
            >
              {movie.Title} {/* Display movie title */}
            </option>
          ))}
        </select>
      </div>

      {/* Actor selection checkboxes */}
      <div style={{ margin: '20px 0' }}>
        <label style={{ fontSize: '18px', marginRight: '10px' }}>Select Actors:</label>
        <div>
          {actors.map((actor) => (
            <div key={actor.ActorID} style={{ marginBottom: '10px' }}>
              <input
                type="checkbox"
                value={actor.ActorID}
                onChange={handleActorChange}
                style={{ marginRight: '10px' }}
              />
              <label>{actor.ActorName}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Submit button */}
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
        Add Actors to Movie
      </button>
    </div>
  );
};

export default AddActorsToMovie;
