import React from 'react';
import { Link } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext'; // Import AuthContext

const Navbar = () => {
  const { user, logOut, username } = UserAuth(); // Get user, logOut, and username from context

  // Handle logout click
  const handleLogout = () => {
    logOut(); // Call the logout function from AuthContext
  };

  return (
    <div className='flex items-center justify-between p-4 z-[100] w-full absolute'>
      <Link to='/'>
        <h1 className='text-red-600 text-4xl font-bold cursor-pointer'>
          DBFLIX
        </h1>
      </Link>

      <div className='flex items-center'>
        {user ? (
          // Show welcome message, Account, and Logout buttons when user is logged in
          <>
            <span className='text-white mr-4'>Welcome, {username}!</span>
            <Link to='/account'>
              <button className='text-white pr-4'>Account</button>
            </Link>
            <button
              onClick={handleLogout}
              className='bg-red-600 px-6 py-2 rounded cursor-pointer text-white'
            >
              Logout
            </button>
          </>
        ) : (
          // Show Sign In, Sign Up, and Admin buttons when user is not logged in
          <>
            <Link to='/login'>
              <button className='text-white pr-4'>Sign In</button>
            </Link>
            <Link to='/signup'>
              <button className='bg-red-600 px-6 py-2 rounded cursor-pointer text-white'>Sign Up</button>
            </Link>
            <Link to='/admin'>
              <button className='bg-gray-600 px-4 py-2 rounded cursor-pointer text-white ml-4'>Admin</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
