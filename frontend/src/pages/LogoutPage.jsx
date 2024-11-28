import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    authService.logout(); // Clear the token from storage and headers
    navigate('/login', { replace: true }); // Redirect to login and replace history entry
  }, [navigate]);

  return null; // No need to render anything on this page
};

export default LogoutPage;