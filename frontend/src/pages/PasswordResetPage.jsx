import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import authService from '../services/authService';
import { toast } from 'react-toastify';




//zod schema for validation
const resetPasswordFormSchema = z.object({


    password: z.string().min(6, 'Password must be at least 6 characters'),   //password validation
    confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters'),   //confirm password validation


}).refine((data) => data.password === data.confirmPassword, {   //password match check
    message: "Passwords don't match",   //error message
    path: ['confirmPassword'],  //path of the error field


});



const ResetPasswordPage = () => {

    const { token } = useParams();  // Get the reset token from URL parameters
    const [resetSuccessful, setResetSuccessful] = useState(false); // State to track successful reset



    const { register, handleSubmit, formState: { errors } } = useForm({    //initialize the form
      resolver: zodResolver(resetPasswordFormSchema),   //pass the zod resolver



    });


  const onSubmit = async (data) => {
    try {

            await authService.resetPassword(token, data.password); //call the service function with token and new password
            setResetSuccessful(true); //set successful state to true after password reset
            toast.success('Password reset successful!');



    } catch (error) {

            toast.error(error?.response?.data?.message || 'Password reset failed. Please try again later.');

    }
  };



  if (resetSuccessful) {   //if reset successful then display message

        return (
      <div className="max-w-md mx-auto mt-10 text-center">
                <p className="text-green-500 text-lg font-bold">Your password has been reset successfully.</p>

            </div>
        );


    }


  return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Reset Password</h2>  {/*form heading */}


            <form onSubmit={handleSubmit(onSubmit)}>


                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-bold mb-2">New Password:</label> {/*password input */}
          <input type="password" id="password" {...register('password')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>} {/*error message */}


                </div>


        <div className="mb-4">    {/*confirm password */}
                    <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">Confirm Password:</label> {/*confirm password input */}
          <input type="password" id="confirmPassword" {...register('confirmPassword')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>} {/*error message */}


                </div>



                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">    {/*submit button */}
                    Reset Password
        </button>



            </form>
        </div>
  );
};

export default ResetPasswordPage;