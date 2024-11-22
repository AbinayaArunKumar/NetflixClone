import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

// Create an AuthContext
const AuthContext = createContext();


export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Check localStorage for saved user data on initialization
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [username, setUsername] = useState(''); // State for username
  const navigate = useNavigate(); // Use useNavigate inside the component

  // Signup function
  const signUp = async (email, password, username) => {
    const response = await fetch('http://localhost:5000/api/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, username }), // Send username with signup
    });

    if (!response.ok) {
      throw new Error('Signup failed'); // Handle signup error
    }

    const data = await response.json();
    setUser(data); // Set user in state
    setUsername(data.username); // Use lowercase 'username'
    localStorage.setItem('user', JSON.stringify(data)); // Save user to localStorage
  };

  // Login function
  const logIn = async (email, password) => {
    const response = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed'); // Handle login error
    }

    const data = await response.json();
    setUser(data.user); // Set user in state
    setUsername(data.user.Username); // Use 'data.user.Username' to access username
    localStorage.setItem('user', JSON.stringify(data.user)); // Save user to localStorage
    console.log('Current User:', data.user); // Log the current user to the console
  };

  const logInAdmin = async (email, password) => {
    const response = await fetch('http://localhost:5000/api/users/login-admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json(); // Retrieve the error message from response
        throw new Error(errorData.message || 'Admin login failed'); // Use the error message from the server
    }

    const data = await response.json();
    console.log('Admin login response:', data); // Log the entire response for debugging

    // Ensure data.user contains the role and other expected properties
    if (!data.user || data.user.Role !== 'Admin') {
        throw new Error('You do not have admin privileges'); // Throw an error if not admin
    }

    setUser(data.user); // Set user in state
    setUsername(data.user.Username); // Adjust this to the correct property if necessary
    localStorage.setItem('user', JSON.stringify(data.user)); // Save user to localStorage
    console.log('Current Admin User:', data.user); // Log the current admin user to the console
  };



  // Logout function
  const logOut = () => {

    setUser(null); // Clear user from state
    setUsername(''); // Clear username
    localStorage.removeItem('user'); // Remove user from localStorage
    navigate('/');
  };

  useEffect(() => {
    // Check if user data is already in localStorage upon app load
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setUsername(userData.Username); // Set username if it exists
    }
  }, []);

  return (
    <AuthContext.Provider value={{ signUp, logIn, logInAdmin, logOut, user, username }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export function UserAuth() {
  return useContext(AuthContext);
}
