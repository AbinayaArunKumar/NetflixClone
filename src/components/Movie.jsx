import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';
import { UserAuth } from '../context/AuthContext';
import ReactPlayer from 'react-player';

const Movie = ({ item }) => {
    const [like, setLike] = useState(false);
    const [videoLink, setVideoLink] = useState('');
    const [isPlayerVisible, setIsPlayerVisible] = useState(false); // Controls player visibility
    const [isPlaying, setIsPlaying] = useState(false); // Controls video play state
    const [playerKey, setPlayerKey] = useState(Date.now()); // Unique key to force player reset
    const { user } = UserAuth();
    const currentUserId = user ? user.UserID : null;

    useEffect(() => {
        if (currentUserId) {
            const checkWatchlist = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/users/watchlist/${currentUserId}`);
                    const movieInWatchlist = response.data.find(movie => movie.MovieID === item.MovieID);
                    setLike(!!movieInWatchlist);
                } catch (error) {
                    console.error("Error checking watchlist:", error);
                }
            };
            checkWatchlist();
        }
    }, [currentUserId, item.MovieID]);

    const handleThumbnailClick = async () => {
        const encodedTitle = encodeURIComponent(item.title);

        try {
            const response = await axios.get(`http://localhost:5000/api/movies/video-link/${encodedTitle}`);
            if (response.data.videoLink) {
                setVideoLink(response.data.videoLink); // Set video link
                setIsPlayerVisible(true); // Show the player
                setIsPlaying(true); // Start video playback
                setPlayerKey(Date.now()); // Change the key to reset the player
            } else {
                alert("Video link not found.");
            }
        } catch (error) {
            console.error("Error fetching video link:", error);
            alert("Failed to retrieve video link.");
        }
    };

    const toggleLike = async (e) => {
        e.stopPropagation();

        if (!currentUserId) {
            alert('You must be logged in to add to watchlist!');
            return;
        }

        if (like) {
            alert('This movie is already in your watchlist!');
            return;
        }

        setLike(true);

        const watchlistData = {
            userId: currentUserId,
            movieTitle: item.title,
        };

        try {
            const response = await axios.post(
                'http://localhost:5000/api/users/watchlist',
                watchlistData
            );
            alert(response.data.message);
        } catch (error) {
            console.error('Error adding movie to watchlist:', error);
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('Failed to add movie to watchlist.');
            }
        }
    };

    const closePlayer = () => {
        setIsPlaying(false); // Stop video playback immediately
        setTimeout(() => {
            setIsPlayerVisible(false); // Hide player after stopping playback
            setVideoLink(''); // Reset video link to ensure it doesn't stay in state
            setPlayerKey(Date.now()); // Change key to reset the player completely
        }, 100); // Small delay to ensure playback stops before hiding
    };

    return (
        <div 
            className='w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block cursor-pointer relative p-2' 
            onClick={handleThumbnailClick}
        >
            <img
                className='w-full h-auto block'
                src={`https://image.tmdb.org/t/p/w500/${item?.backdrop_path}`}
                alt={item?.title} 
            />
            <div className='absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100 text-white'>
                <p className='white-space-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center'>
                    {item?.title}
                </p>
                <p onClick={toggleLike} className='absolute top-4 left-4'>
                    {like ? (
                        <FaHeart className='text-red-500' />
                    ) : (
                        <FaRegHeart className='text-gray-300' />
                    )}
                </p>
            </div>

            {/* Conditionally render the player */}
            {isPlayerVisible && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/80 flex justify-center items-center z-50">
                    <ReactPlayer 
                        key={playerKey}  // This forces the ReactPlayer to reset every time it is shown
                        url={videoLink}  // Set video URL
                        playing={isPlaying}  // Control video playback state
                        controls={true} 
                        width="80%"  // Player takes up 80% of the width
                        height="80%" // Player takes up 80% of the height
                    />
                    {/* Close Button */}
                    <button 
                        className="absolute top-4 right-4 text-white text-2xl bg-black p-2 rounded-full" 
                        onClick={closePlayer}
                    >
                        X
                    </button>
                </div>
            )}
        </div>
    );
};

export default Movie;
