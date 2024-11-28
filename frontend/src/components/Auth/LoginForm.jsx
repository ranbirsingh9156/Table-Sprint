import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-toastify';
import authService from '../../services/authService'; //make sure to create this later
import { useNavigate } from 'react-router-dom';  // Import useNavigate


// Zod schema for validation
const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});


const LoginForm = () => {


    const navigate = useNavigate();   // Initialize useNavigate



    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),   //validation
    });


    const onSubmit = async (data) => {
      try {
          const response = await authService.login(data); //calls login service - we will implement this later

          // Handle successful login (e.g., store token, redirect)
          toast.success('Login successful!');  //success message using react-toastify
        localStorage.setItem('token', response.data.token); //store JWT in localstorage

        navigate('/'); // Redirect to home after login


      } catch (error) {
        toast.error('Login failed!'); //error message using react-toastify
          console.error("Login failed:", error);  //handle error
      }
    };

  return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">  {/*basic styles*/}
            <h2 className="text-2xl font-bold mb-4">Login</h2>


            {/* Email Field */}
            <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email:</label>
                <input type="email" id="email" {...register('email')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}  {/*display error message*/}


            </div>


      {/* Password Field */}
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password:</label>
        <input
          type="password"
          id="password"
          {...register('password')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>


            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Login
      </button>

    </form>
    );
};

export default LoginForm;