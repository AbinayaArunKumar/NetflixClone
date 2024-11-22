import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './Pages/home';
import { AuthContextProvider, UserAuth } from './context/AuthContext';
import Login from './Pages/login';
import Signup from './Pages/Signup';
import Account from './Pages/Account';
import LoginAdmin from './Pages/LoginAdmin';
import AdminDashboard from './Pages/AdminDashboard'; 
import MoviesPage from './Pages/MoviesPage';
import GenresPage from './Pages/GenresPage';
import ActorsPage from './Pages/ActorsPage';
import AddActors from './Pages/AddActors';
function App() {
  return (
    <AuthContextProvider>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/account' element={<Account />} />
        <Route path='/admin' element={<LoginAdmin />} />

        {/* Protected route for Admin Dashboard with nested routes */}
        <Route 
          path='/admin/dashboard' 
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } 
        >
          {/* Nesting MoviesPage route under AdminDashboard */}
          <Route path="movies" element={<MoviesPage />} />
          <Route path="genres" element={<GenresPage />} />
          <Route path="actors" element={<ActorsPage />} />
          <Route path="add-actors" element={<AddActors />} />
          
          {/* You can add more nested routes here as needed */}
        </Route>
      </Routes>
    </AuthContextProvider>
  );
}

// Component to handle admin route protection
const ProtectedAdminRoute = ({ children }) => {
  const { user } = UserAuth(); // Access user context here
  console.log('Current user:', user); // Debug log to check user information

  if (!user || user.Role !== 'Admin') {
    return <Navigate to='/admin' />; // Redirect to admin login if not an admin
  }

  return children; // Render children if the user is an admin
}

export default App;
