import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // To store any login errors
  const navigate = useNavigate();
  const { logIn } = UserAuth(); // Access logIn function from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state
    try {
      await logIn(email, password); // Use logIn function from AuthContext
      navigate('/'); // Redirect to home after successful login
    } catch (error) {
      setError(error.message); // Set error message if there's an error
      console.log('Login Error:', error); // Log the error for debugging
    }
  };

  return (
    <div className='w-full h-screen'>
      <div className='bg-black/60 fixed top-0 left-0 w-full h-screen'></div>
      <div className='fixed w-full px-4 py-24 z-50'>
        <div className='max-w-[450px] h-[600px] mx-auto bg-black/75 text-white'>
          <div className='max-w-[320px] mx-auto py-16'>
            <h1 className='text-3xl font-bold'>Sign In</h1>
            {error ? <p className='p-3 bg-red-400 my-2'>{error}</p> : null} {/* Display error message */}
            <form onSubmit={handleSubmit} className='w-full flex flex-col py-4'>
              <input
                onChange={(e) => setEmail(e.target.value)}
                className='p-3 my-2 bg-gray-700 rounded'
                type='email'
                placeholder='Email'
                autoComplete='email'
                required // Make this input required
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                className='p-3 my-2 bg-gray-700 rounded'
                type='password'
                placeholder='Password'
                autoComplete='current-password'
                required // Make this input required
              />
              <button className='bg-red-600 py-3 my-6 rounded font-bold'>
                Sign In
              </button>
              
              <p className='py-8'>
                <span className='text-gray-600'>New to Netflix?</span>{' '}
                <Link to='/signup'>Sign Up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
