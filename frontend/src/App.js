import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import './index.css';
import Dashboard from './components/Dashboard/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import SubCategories from './pages/SubCategories';
import LoginPage from './pages/LoginPage'; // Import the Login page
import RegisterPage from './pages/RegisterPage'; // Import the Register page
import authService from './services/authService'; // Import the auth service
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify
import PasswordResetPage from './pages/PasswordResetPage';
import HomePage from './pages/HomePage';
import LogoutPage from './pages/LogoutPage';
import ProductDetails from './components/Products/ProductDetails'; // Import the component

// Protected Route component (requires authentication to access)

const ProtectedRoute = ({ element, ...rest }) => {
  //takes an element(the component to be rendered) and other props
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    //check for authentication status on mount and updates
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token); //check token and set auth status
    };

    checkAuth(); //initial check
  }, []);

  if (isAuthenticated === null) {
    //if null means status is being checked

    return <div>Loading...</div>; //show loading message
  }

  return isAuthenticated ? element : <Navigate to="/login" replace />; //if authenticated render element otherwise redirect to login
};

function App() {
  authService.setAuthToken(localStorage.getItem('token')); // Set token on app load

  return (
    <BrowserRouter>
      <div>
        {' '}
        {/* This div will help to avoid the warning related to findDOMNode */}
        <ToastContainer /> {/* Component to display toast notifications */}
        <Routes>
          <Route path="/login" element={<LoginPage />} /> {/*Login route*/}
          <Route path="/register" element={<RegisterPage />} />{' '}
          {/*Register route*/}
          <Route path="/password-reset" element={<PasswordResetPage />} />{' '}
          {/*Password reset route*/}
          <Route path="/logout" element={<LogoutPage />} /> {/*Logout route*/}
          <Route path="/" element={<ProtectedRoute element={<AppLayout />} />}>
            <Route path=":id" element={<ProductDetails />} />{' '}
            {/* Route for viewing product details */}
            {/*Protected route using ProtectedRoute component*/}
            <Route index element={<HomePage />} />{' '}
            {/* Home route (protected) */}
            <Route path="products" element={<Products />} />{' '}
            {/*products route (protected)*/}
            <Route path="categories" element={<Categories />} />{' '}
            {/*categories route (protected)*/}
            <Route path="subcategories" element={<SubCategories />} />{' '}
            {/*subcategories route (protected)*/}
            {/* Other protected routes */}
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
