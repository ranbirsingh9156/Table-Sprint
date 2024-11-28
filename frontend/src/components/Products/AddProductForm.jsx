import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import subCategoryService from '../../services/subCategoryService';
import { toast } from 'react-toastify'; // Import toast here



const productSchema = z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().positive('Price must be positive'),  // Price must be a positive number
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().min(1, 'Sub Category is required'),
    status: z.enum(['Active', 'Inactive']).default('Active'), //default value of status
    imageUrl: z.string().url('Invalid image URL').nonempty('Image URL is required'),
    sequence:z.number().int().positive('Sequence must be positive')
});



const AddProductForm = ({ onClose, products, setProducts }) => {


    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); //for dependent dropdown
    const [loadingCategories,setLoadingCategories] = useState(true)
    const [loadingSubCategories,setLoadingSubCategories] = useState(true)
  const [error, setError] = useState(null);



    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({   //initialize the form
      resolver: zodResolver(productSchema),


    });





  useEffect(() => {  //fetch categories when the component mounts


    const fetchCategories = async () => {
        try {
            const fetchedCategories = await categoryService.getAllCategories();


            setCategories(fetchedCategories);


        } catch (error) {


      setError(error?.response?.data?.message || 'Failed to fetch Categories'); // Set error message

        }finally{
            setLoadingCategories(false)

        }

    };


    fetchCategories();

  }, []);



  useEffect(() => {  //fetch sub categories when a category is selected or when component mounts


        const fetchSubCategories = async () => {


            if (selectedCategory) {
                try {
                    setLoadingSubCategories(true)

                    const fetchedSubCategories = await subCategoryService.getAllSubCategories();


                    // Filter subcategories based on the selected category
            const filteredSubCategories = fetchedSubCategories.filter(
              (subCategory) => subCategory.category?._id === selectedCategory
            );


                    setSubCategories(filteredSubCategories);
          setValue('subCategory', ''); // Reset the selected subcategory when the category changes



                } catch (error) {


                    setError(error?.response?.data?.message || 'Failed to fetch Subcategories.'); // Set error message


                }finally { setLoadingSubCategories(false);}
      }else{
        setSubCategories([])   // Clear subcategories if no category is selected
                setLoadingSubCategories(false)

      }
    };


        fetchSubCategories();  //call immediately


  }, [selectedCategory]);  //dependency for selected category,so when it changes effect will run again








    const onSubmit = async (data) => {  //handle form submission



        try {
            const newProduct = await productService.createProduct(data); //call API to create product
            setProducts([...products, newProduct]); // Update the products list in the state
            toast.success("Product added successfully")
            reset(); // Reset the form
            onClose(); // Close the modal


        } catch (error) {
            // Errors are already handled in the service
            console.log("Create product Error: ", error);



        }



    };



    const handleCategoryChange = (e) => {     //handle category change for dependent dropdown
        setSelectedCategory(e.target.value);  //set selected category


    };




    return (


        <form onSubmit={handleSubmit(onSubmit)}>


      {/*name*/}
            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name:</label>
                <input {...register('name')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}   {/*error message*/}


            </div>


{/*description*/}
            <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description:</label>
        <textarea {...register('description')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"></textarea>
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}  {/*error message*/}


            </div>


{/*price*/}
      <div className="mb-4">
                <label htmlFor="price" className="block text-gray-700 font-bold mb-2">Price:</label>
                <input {...register('price')} type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}  {/*error message*/}

            </div>
{/*image url*/}
      <div className="mb-4">
        <label htmlFor="imageUrl" className="block text-gray-700 font-bold mb-2">Image URL:</label>
                <input
          {...register('imageUrl')}
          type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />


        {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>}


            </div>


      {/* Category Select */}
      <div className="mb-4">
        <label htmlFor="category" className="block text-gray-700 font-bold mb-2">Category:</label>
                {loadingCategories ? (
                    <p>Loading Categories...</p>
                ) : error ? (
                    <p className='text-red-700'>{error}</p>
                ) : (
                    <select
            {...register('category')}

                        id="category"
                        onChange={handleCategoryChange}  //call handleCategoryChange to update selectedCategory state
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
            <option value="">Select a Category</option>
                        {categories.map((category) => (


              <option key={category._id} value={category._id}>
                                {category.name}
                            </option>

                        ))}




          </select>
        )}
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
      </div>


            {/* Subcategory Select (Dependent on Category) */}
            <div className="mb-4">
                <label htmlFor="subCategory" className="block text-gray-700 font-bold mb-2">Subcategory:</label>


        {loadingSubCategories ? (  //show loading state
                    <p>Loading Subcategories...</p>
        ): error ? (    // Show error message if fetching failed

                    <p className='text-red-700'>{error}</p>

                ) : (
          <select {...register('subCategory')} id="subCategory" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">


            <option value="">Select a Subcategory</option>  {/* Default option */}
            {subCategories.map((subCategory) => (


              <option key={subCategory._id} value={subCategory._id}>
                                {subCategory.name}
              </option>


            ))}


          </select>


        )}


        {errors.subCategory && <p className="text-red-500 text-sm mt-1">{errors.subCategory.message}</p>}



            </div>


      {/* Status */}
      <div className="mb-4">
        <label htmlFor="status" className="block text-gray-700 font-bold mb-2">Status:</label>
        <select {...register('status')} id="status" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
          <option value="Active">Active</option>  {/* Default option */}
          <option value="Inactive">Inactive</option>


        </select>
        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}  {/*error message*/}
            </div>


{/*sequence number input field*/}
            <div className="mb-4">
        <label htmlFor="sequence" className="block text-gray-700 font-bold mb-2">Sequence:</label>
                <input {...register('sequence')} type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
                {errors.sequence && <p className="text-red-500 text-sm mt-1">{errors.sequence.message}</p>}  {/*error message*/}



            </div>


            <div className="flex justify-end">  {/*buttons at the end*/}
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">  {/*save button*/}
          Save
        </button>
                <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded">   {/*cancel button*/}
          Cancel
        </button>


            </div>

        </form>


    );


};



export default AddProductForm;