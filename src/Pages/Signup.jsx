import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const Signup = () => {
  const [username, setUsername] = useState(''); // State for username
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // To store any signup errors
  const navigate = useNavigate();
  const { signUp } = UserAuth(); // Access signUp function from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      await signUp(email, password , username); // Use signUp function from AuthContext
      navigate('/login'); // Redirect after successful signup
    } catch (error) {
      setError(error.message); // Set error message to display
      console.log('Error:', error); // Log the error for debugging
    }
  };

  return (
    <div className='w-full h-screen'>
      <div className='bg-black/60 fixed top-0 left-0 w-full h-screen'></div>
      <div className='fixed w-full px-4 py-24 z-50'>
        <div className='max-w-[450px] h-[600px] mx-auto bg-black/75 text-white'>
          <div className='max-w-[320px] mx-auto py-16'>
            <h1 className='text-3xl font-bold'>Sign Up</h1>
            {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
            <form onSubmit={handleSubmit} className='w-full flex flex-col py-4'>
              <input
                onChange={(e) => setUsername(e.target.value)} // Handler for username
                className='p-3 my-2 bg-gray-700 rounded'
                type='text'
                placeholder='Username'
                autoComplete='username'
                required
              />
              <input
                onChange={(e) => setEmail(e.target.value)}
                className='p-3 my-2 bg-gray-700 rounded'
                type='email'
                placeholder='Email'
                autoComplete='email'
                required
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                className='p-3 my-2 bg-gray-700 rounded'
                type='password'
                placeholder='Password'
                autoComplete='current-password'
                required
              />
              <button className='bg-red-600 py-3 my-6 rounded font-bold'>
                Sign Up
              </button>
              
              <p className='py-8'>
                <span className='text-gray-600'>
                  Already subscribed to Netflix?
                </span>{' '}
                <Link to='/login'>Sign In</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
