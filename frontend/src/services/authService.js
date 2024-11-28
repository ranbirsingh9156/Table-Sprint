import axios from 'axios';
import { toast } from 'react-toastify';

// Set up the base URL for your backend API
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'; //default to localhost:5000

// Create an Axios instance with a base URL - for easy configuration across application
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Function to set the JWT in the Authorization header for all requests
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['x-auth-token'] = token; //set token in header for all requests
  } else {
    delete api.defaults.headers.common['x-auth-token']; //delete the token from header when not required like logout
  }
};

api.interceptors.response.use(
  (response) => response, //if successfull response return the response
  (error) => {
    console.log(error);

    const message = error.response?.data?.message || error.message;

    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !error.config._retry
    ) {
      error.config._retry = true;

      // Try refreshing the token
      return refreshToken() //calls refreshToken function
        .then((response) => {
          console.log(response);
          // Update tokens and retry original request

          setAuthToken(response.data.token);
          localStorage.setItem('token', response.data.token);

          //update original request headers with new token and retry original request
          error.config.headers['x-auth-token'] = response.data.token;
          return api(error.config);
        })
        .catch(() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        });
    }

    toast.error(message); //Show error messages using toast
    return Promise.reject(error);
  }
);

// Function to refresh the access token using the refresh token
const refreshToken = async () => {
  try {
    const response = await api.post('/auth/refresh-token', {
      refreshToken: localStorage.getItem('refreshToken'), //get the refresh token from local storage
    });
    return response;
  } catch (error) {
    return Promise.reject(error); //reject the promise
  }
};

const register = async (userData) => {
  try {
    const res = await api.post('/auth/register', userData); //make post request for register user

    if (res.data.token) {
      setAuthToken(res.data.token); //sets the token if available in data
      localStorage.setItem('token', res.data.token); //stores token in local storage for later use
    }

    return res; //return the response
  } catch (error) {
    throw error; //throw error to be handled by calling function
  }
};

const login = async (userData) => {
  try {
    const res = await api.post('/auth/login', userData);

    if (res.data.token) {
      setAuthToken(res.data.token);
      localStorage.setItem('token', res.data.token); //stores token in local storage
    }

    return res; //return response
  } catch (error) {
    throw error; //throw error to be handled by calling function
  }
};

// Function to log out the user
const logout = () => {
  setAuthToken(null);
  localStorage.removeItem('token'); //remove token from localstorage
  localStorage.removeItem('refreshToken'); //remove refresh token also
  // Perform any other necessary logout actions, e.g., redirect to login
};

const authService = {
  register,
  login,
  logout,
  setAuthToken,
};

export default authService;
