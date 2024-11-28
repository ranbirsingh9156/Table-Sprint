import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import authService from '../services/authService';  // Assuming you have this service
import { toast } from 'react-toastify';


const resetPasswordSchema = z.object({ //zod schema for validation
  email: z.string().email('Invalid email format').min(1, 'Email is required'),

});



const PasswordResetPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({  //initialize form with zod validation
        resolver: zodResolver(resetPasswordSchema),

    });



    const onSubmit = async (data) => {
      try {

            await authService.requestPasswordReset(data.email); //call api to request password reset email
            toast.success('Password reset email sent!'); //show success message



      } catch (error) {
            console.log("Password Reset Error:", error)

        toast.error(error?.response?.data?.message || 'Failed to request password reset. Please check your email.');

      }
    };



  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">  {/*basic styles */}
            <h2 className="text-2xl font-bold mb-4">Request Password Reset</h2>  {/*heading */}




            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email:</label>  {/*email input */}
          <input type="email" id="email" {...register('email')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>} {/*error message */}


                </div>


        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Send Reset Link
        </button>


            </form>

        </div>
  );


};


export default PasswordResetPage;