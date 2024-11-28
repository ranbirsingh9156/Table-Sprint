import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import categoryService from '../../services/categoryService';
import subCategoryService from '../../services/subCategoryService';



//zod schema for validation same as in AddSubCategoryForm
const subCategorySchema = z.object({
  name: z.string().min(1, 'Subcategory name is required'),
  category: z.string().min(1, 'Category is required'),


});


const EditSubCategoryForm = ({ onClose, subCategory, subCategories, setSubCategories }) => {
    const [categories, setCategories] = useState([]);  //for storing the categories
    const [loading, setLoading] = useState(true);   //for loading state
    const [error,setError] = useState(null);  //for error state


    useEffect(() => {      //fetch the categories when the component mounts


        const fetchCategories = async () => {


      try {
        const fetchedCategories = await categoryService.getAllCategories();
        setCategories(fetchedCategories);


      } catch (error) {

        setError(error?.response?.data?.message || 'Failed to fetch Categories'); // Set error message

      }finally {
                setLoading(false);    //set loading to false after fetching

            }
        };


        fetchCategories();


    }, []);




  const { register, handleSubmit, formState: { errors }, reset } = useForm({    //initialize form with zod resolver
    resolver: zodResolver(subCategorySchema),
    defaultValues: subCategory, //set the default values from props


  });


    const onSubmit = async (data) => {
        try {

            await subCategoryService.updateSubCategory(subCategory._id, data); //call api to update the subcategory


            // Update the subcategories in the state with the modified subcategory
            setSubCategories((prevSubCategories) =>
                prevSubCategories.map((subCat) => (subCat._id === subCategory._id ? { ...subCat, ...data } : subCat)) //map through the previous subcategories and update
            );


            onClose(); //close the modal
            reset();//reset the form


        } catch (error) {
            // Error is already handled in the service with toast
            console.log("Edit Subcategory error",error)

        }
    };


    return (
    <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">   {/*name input field */}
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name:</label>
        <input {...register('name')}  type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}  {/*error message*/}


            </div>


            {/*select category input field */}
      <div className="mb-4">
                <label htmlFor="category" className="block text-gray-700 font-bold mb-2">Category:</label>
        {loading ? (
                    <p>Loading Categories....</p>
                ) : error ? ( // Show error message if fetching categories failed
                    <p className='text-red-700'>{error}</p>
                  ) : (


                    <select {...register('category')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id} selected={subCategory.category?._id === cat._id}>  {/*select default option*/}
                {cat.name}
              </option>
            ))}


          </select>


        )}
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}  {/*error message*/}

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



export default EditSubCategoryForm;