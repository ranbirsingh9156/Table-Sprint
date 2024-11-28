
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import subCategoryService from '../../services/subCategoryService';




// Zod schema for validation (same as AddProductForm)
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
    subCategory: z.string().min(1, 'Subcategory is required'),
  status: z.enum(['Active', 'Inactive']).default('Active'),
    imageUrl: z.string().url('Invalid image URL').nonempty('Image URL is required'),
    sequence:z.number().int().positive('Sequence must be positive')



});


const EditProductForm = ({ onClose, product, products, setProducts }) => {  // Receive product as a prop



    const [categories, setCategories] = useState([]);  //for storing categories
  const [subCategories, setSubCategories] = useState([]); //for storing subcategories
  const [selectedCategory, setSelectedCategory] = useState(product?.category?._id || '');  //for storing selected category, and setting default
  const [loadingCategories, setLoadingCategories] = useState(true); //for loading state
  const [loadingSubCategories, setLoadingSubCategories] = useState(true); //for loading state
  const [error, setError] = useState(null);  //for error state



    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({ //initialize the form
        resolver: zodResolver(productSchema),
        defaultValues: product,  // Set default values from the product prop



    });




  useEffect(() => {  //fetch categories


    const fetchCategories = async () => {
      try {
        const fetchedCategories = await categoryService.getAllCategories();


        setCategories(fetchedCategories);


      } catch (error) {
        setError(error?.response?.data?.message || 'Failed to fetch Categories.'); // Set error message


      }finally{
        setLoadingCategories(false)

      }
    };



    fetchCategories();



  }, []);



    useEffect(() => {   //fetch sub categories when selected category changes or when component mounts




        const fetchSubCategories = async () => {


            if (selectedCategory) {
        try {


          setLoadingSubCategories(true);  // Set loading to true before fetching

                    const fetchedSubCategories = await subCategoryService.getAllSubCategories();
                    // Filter subcategories based on the selected category
                    const filteredSubCategories = fetchedSubCategories.filter(
                        (subCategory) => subCategory.category._id === selectedCategory
                    );


          setSubCategories(filteredSubCategories);

          // Set the default value for the subcategory if it exists in the product


                    setValue('subCategory', product?.subCategory?._id || ''); //set default value


                } catch (error) {


          setError(error?.response?.data?.message || 'Failed to fetch Subcategories.'); // Set error message


                }finally{
          setLoadingSubCategories(false);  // Set loading to false after fetching


        }
            } else {
                setSubCategories([]); // Clear subcategories if no category is selected
                setLoadingSubCategories(false);  // Set loading to false after fetching


            }


        };




        fetchSubCategories();


    }, [selectedCategory, product?.subCategory?._id]);  //add product.subCategory as a dependency




    const onSubmit = async (data) => {
        try {
            await productService.updateProduct(product._id, data);  //call service to update product


      // Update the products in the state with the modified product


            setProducts((prevProducts) =>
        prevProducts.map((p) => (p._id === product._id ? { ...p, ...data } : p)) //update products array
      );




            onClose();  //close modal
            reset();  // Reset the form


        } catch (error) {
            console.log("Update product Error", error)


            // Errors are already handled in the service


        }


    };


  const handleCategoryChange = (e) => {   //for updating selectedCategory when category dropdown changes
    setSelectedCategory(e.target.value); // Update the selected category state


  };




  return (


    <form onSubmit={handleSubmit(onSubmit)}>  {/*same form structure as AddProductForm */}


            <div className="mb-4">   {/*name input field */}
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name:</label>
        <input {...register('name')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}  {/*error message*/}


            </div>


      <div className="mb-4">  {/*description text area */}
        <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description:</label>
        <textarea {...register('description')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"></textarea>

        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}  {/*error message*/}
      </div>


            <div className="mb-4">   {/*price input field */}
        <label htmlFor="price" className="block text-gray-700 font-bold mb-2">Price:</label>
                <input {...register('price')} type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}    {/*error message*/}


            </div>


      {/* Image URL */}
            <div className="mb-4">
        <label htmlFor="imageUrl" className="block text-gray-700 font-bold mb-2">Image URL:</label>
                <input {...register('imageUrl')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
        {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>}    {/*error message*/}



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
                        onChange={handleCategoryChange}  // Call handleCategoryChange to update selectedCategory
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select a Category</option>
            {categories.map((category) => (
                            <option key={category._id} value={category._id} selected={category._id === selectedCategory}>  {/*mark the current category as selected*/}
                {category.name}
              </option>
            ))}
                    </select>
        )}



        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}  {/*error message*/}



            </div>


            {/* Subcategory Select (Dependent on Category) */}
            <div className="mb-4">
        <label htmlFor="subCategory" className="block text-gray-700 font-bold mb-2">Subcategory:</label>
        {loadingSubCategories ? (
                    <p>Loading Subcategories...</p>
        ): error?( // Show error message if fetching failed
                    <p className='text-red-700'>{error}</p>
                ):(

                    <select {...register('subCategory')} id="subCategory" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
            <option value="">Select a Subcategory</option>
                        {subCategories.map((subCategory) => (
                            <option key={subCategory._id} value={subCategory._id} selected={subCategory._id === product?.subCategory?._id}>    {/*mark the current subcategory as selected*/}
                {subCategory.name}
                            </option>

            ))}
          </select>

        )}        
        
        {errors.subCategory && <p className="text-red-500 text-sm mt-1">{errors.subCategory.message}</p>}  {/*error message*/}

        </div>


        {/* Status */}
  <div className="mb-4">
    <label htmlFor="status" className="block text-gray-700 font-bold mb-2">Status:</label>


    <select {...register('status')} id="status" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
        <option value="Active" selected={product?.status === 'Active'}>Active</option> {/*select default option*/}
      <option value="Inactive" selected={product?.status === 'Inactive'}>Inactive</option>
    </select>


            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}  {/*error message*/}



        </div>



{/*sequence input field*/}
<div className="mb-4">
    <label htmlFor="sequence" className="block text-gray-700 font-bold mb-2">Sequence:</label>
    <input {...register('sequence')} type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
    {errors.sequence && <p className="text-red-500 text-sm mt-1">{errors.sequence.message}</p>}  {/*error message*/}



        </div>






        <div className="flex justify-end">  {/*buttons at the end */}
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"> {/*save button*/}
      Save
    </button>


    <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded">   {/*cancel button*/}
                Cancel
    </button>




        </div>

</form>


);



};


export default EditProductForm;