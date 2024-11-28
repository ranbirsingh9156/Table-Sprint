import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-toastify';
import authService from '../../services/authService'; //make sure to create this later
import { useNavigate } from 'react-router-dom';


const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters'),
  }).refine((data) => data.password === data.confirmPassword, {  //check if password and confirm password are equal
    message: "Passwords don't match",
    path: ['confirmPassword'], //path of error
  });



const RegisterForm = () => {

  const navigate = useNavigate(); //for navigation


    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({
      resolver: zodResolver(registerSchema), //configure zod resolver with the schema
    });


    const onSubmit = async (data) => {
        try {
            //call register service and handle success
          await authService.register(data);

          toast.success('Registration successful! You can now log in.');  //show success message
            navigate('/login');   //redirect to login page

        } catch (error) {
          toast.error('Registration failed!');    //show error message
          console.error('Registration failed:', error);
        }
      };



  return (

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">


            <h2 className="text-2xl font-bold mb-4">Register</h2>


            {/* Email Field */}
      <div className="mb-4"> {/*Email field */}
        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email:</label>
        <input type="email" id="email" {...register('email')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}


            </div>


            <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password:</label>
                <input type="password" id="password" {...register('password')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}  {/*display error message*/}


            </div>


            <div className="mb-4">
        <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          {...register('confirmPassword')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>





            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Register</button>

        </form>


  );
};


export default RegisterForm;