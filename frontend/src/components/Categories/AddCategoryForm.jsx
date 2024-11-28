import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import categoryService from '../../services/categoryService';


// Zod schema for validation
const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'), //name validation
});


const AddCategoryForm = ({ onClose, categories, setCategories }) => { //receive props


    const { register, handleSubmit, formState: { errors }, reset } = useForm({  //initialize form with zod resolver
        resolver: zodResolver(categorySchema),


    });


    const onSubmit = async (data) => {
      try {
        const newCategory = await categoryService.createCategory(data); // Call API to create category


          setCategories([...categories, newCategory]);   // Update the categories state
          reset();    // Reset the form
          onClose();   // Close the modal


      } catch (error) {

        // Error is already handled in the service with toast
            console.log("Create category error",error)
      }


    };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name:</label>
        <input type="text" id="name" {...register('name')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}  {/* Display error message */}

            </div>


            <div className="flex justify-end"> {/*buttons at the end*/}

                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">  {/*submit button*/}
          Save
        </button>


                <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded">  {/*cancel button*/}
          Cancel

        </button>

      </div>
        </form>
  );


};


export default AddCategoryForm;