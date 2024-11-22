import React, { useEffect, useState } from 'react';
import { UserAuth } from '../context/AuthContext'; // Import the user context
import { Link } from 'react-router-dom';

const Account = () => {
  const [watchlist, setWatchlist] = useState([]);  // State for storing the watchlist
  const [error, setError] = useState('');  // State for handling errors
  const [loading, setLoading] = useState(false); // State for loading
  const { user } = UserAuth();  // Access user context (get current user)

  useEffect(() => {
    // Fetch watchlist data when the component mounts
    if (user?.UserID) {
      fetchWatchlist(user.UserID);
    }
  }, [user]);

  // Function to fetch the watchlist from the backend
  const fetchWatchlist = async (userId) => {
    setLoading(true);  // Set loading to true when the data is being fetched
    try {
      const response = await fetch(`http://localhost:5000/api/users/watchlist/${userId}`);
      
      // Check if the response is OK (status 200)
      if (!response.ok) {
        throw new Error('Failed to fetch watchlist');
      }

      const data = await response.json();
      setWatchlist(data);  // Update the state with the fetched data
      setError(''); // Reset any previous error
    } catch (err) {
      setError('Error fetching watchlist. Please try again later.');
    } finally {
      setLoading(false);  // Set loading to false after fetch is complete
    }
  };

  const removeFromWatchlist = async (movieId) => {
    const userId = user.UserID;  // Assuming user.UserID contains the user's ID
    console.log('Removing from watchlist, userId:', userId, 'movieId:', movieId);

    // Validate userId and movieId before making the request
    if (!userId || !movieId) {
        console.error("Invalid userId or movieId");
        return;
    }

    const url = `http://localhost:5000/api/users/watchlist/${userId}/remove/${movieId}`;
    console.log('Request URL:', url);  // Log the full URL to make sure it's correct

    try {
        // Optimistically remove the movie from the UI immediately
        setWatchlist((prevWatchlist) =>
            prevWatchlist.filter((movie) => movie.MovieID !== movieId)
        );

        // Make the request to delete the movie from the backend
        const response = await fetch(url, { method: 'DELETE' });

        // Log the response for debugging
        const responseData = await response.json();
        console.log('Response from backend:', responseData);

        
    } catch (err) {
        console.error('Error during request:', err);
        setError('Error removing movie from watchlist');
    }
};






return (
    <div className='w-full h-screen flex justify-start items-center'>
      <div className='bg-black/60 fixed top-0 left-0 w-full h-screen'></div>
      <div className='w-full px-6 py-12 z-50 flex justify-start'>
        <div className='max-w-[900px] w-full bg-black/75 text-white p-6 rounded-lg'>
          <div className='flex flex-col items-start'>
            {/* Watchlist Header */}
            <h2 className='text-4xl font-semibold mt-4 mb-4'>Watchlist</h2>
  
            {/* Watchlist Section */}
            <div className='w-full mt-4'>
              {/* Display loading spinner when data is being fetched */}
              {loading && <p className="text-blue-500">Loading your watchlist...</p>}
  
              {/* If the watchlist is empty, show a message */}
              {watchlist.length === 0 && !loading ? (
                <p>Your watchlist is empty.</p>
              ) : (
                <div className='grid grid-cols-3 gap-4'>
                  {/* Map through the watchlist and display each movie */}
                  {watchlist.map((movie) => (
                    <div key={movie.MovieID} className='bg-gray-800 p-4 rounded-lg relative'>
                      {/* Remove Button at the top-right */}
                      <button
                        onClick={() => removeFromWatchlist(movie.MovieID)}
                        className='absolute top-2 right-2 text-red-500 hover:text-red-700 text-2xl'
                      >
                        &times;
                      </button>
                      <div>
                        <h3 className='font-bold text-xl'>{movie.Title}</h3>
                        <p>{movie.Description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Account;
