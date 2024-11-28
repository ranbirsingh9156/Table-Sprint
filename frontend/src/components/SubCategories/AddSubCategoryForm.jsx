import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import categoryService from '../../services/categoryService';
import subCategoryService from '../../services/subCategoryService';



const subCategorySchema = z.object({
    name: z.string().min(1, 'Subcategory name is required'), //validation for name
    category: z.string().min(1, 'Category is required'), //validation for category


});




const AddSubCategoryForm = ({ onClose, subCategories, setSubCategories }) => {
  const [categories, setCategories] = useState([]); //store categories
  const [loading, setLoading] = useState(true);
    const [error,setError]= useState(null);



    useEffect(() => {  //fetch categories when component mounts

        const fetchCategories = async () => {


            try {

                const fetchedCategories = await categoryService.getAllCategories();

                setCategories(fetchedCategories);


            } catch (error) {


                setError(error?.response?.data?.message || 'Failed to fetch Categories') // Set error message

            }finally{

                setLoading(false)
            }


        };


        fetchCategories();


    }, []);  //empty dependency array makes this effect run only once




    const { register, handleSubmit, formState: { errors }, reset } = useForm({
      resolver: zodResolver(subCategorySchema),


    });


    const onSubmit = async (data) => {
        try {
          const newSubCategory = await subCategoryService.createSubCategory(data);  //call the service to create the sub category


          setSubCategories([...subCategories, newSubCategory]); //update the subcategories state
          reset(); //reset the form
          onClose(); //close the modal


        } catch (error) {


            // Error is already handled in the service with toast
            console.log("Create subcategory error",error)
        }


      };


    return (


    <form onSubmit={handleSubmit(onSubmit)}>


            {/*sub category name input  */}
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name:</label>
        <input {...register('name')} id="name" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}


      </div>



      {/* Category Select Dropdown */}
      <div className="mb-4">
        <label htmlFor="category" className="block text-gray-700 font-bold mb-2">Category:</label>

        {loading ? ( //show loading message while fetching categories
          <p>Loading Categories....</p>
        ) : error ? ( // Show error message if fetching categories failed
            <p className='text-red-700'>{error}</p>
          ) : (
          <select {...register('category')} id="category" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">


            <option value="">Select a Category</option>  {/* Default option */}
            {categories.map((category) => (
              <option key={category._id} value={category._id}> {/*options from fetched categories */}
                {category.name}
              </option>


            ))}
          </select>
        )}

        {/*error for category*/}
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}


            </div>


            {/* Buttons */}
            <div className="flex justify-end">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                    Save
                </button>
                <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded">
          Cancel
        </button>

            </div>


        </form>


    );


};


export default AddSubCategoryForm;