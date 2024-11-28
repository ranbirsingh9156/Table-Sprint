import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import categoryService from '../../services/categoryService';


const categorySchema = z.object({    //same schema as add category form
  name: z.string().min(1, 'Category name is required'),

});


const EditCategoryForm = ({ onClose, category, categories, setCategories }) => {

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(categorySchema), //use zod resolver
        defaultValues: category,  // Set default values from the category prop


    });


  const onSubmit = async (data) => {
    try {


        await categoryService.updateCategory(category._id, data); //call api to update category

      // Update the categories in the state with the modified category
      setCategories((prevCategories) =>
        prevCategories.map((cat) => (cat._id === category._id ? { ...cat, ...data } : cat))
      );
            onClose(); //close the modal
      reset(); //reset form

    } catch (error) {
      // Error is already handled in the service with toast
            console.log("Edit category error",error)
    }
  };

  return (
        <form onSubmit={handleSubmit(onSubmit)}>


            <div className="mb-4">  {/*name input field */}
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name:</label>
        <input type="text" id="name" {...register('name')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}


            </div>


            <div className="flex justify-end">   {/*buttons at the end */}


                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">    {/*save button */}
                    Save
        </button>


                <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded">       {/*cancel button */}
                    Cancel
        </button>

      </div>

    </form>
  );


};




export default EditCategoryForm;