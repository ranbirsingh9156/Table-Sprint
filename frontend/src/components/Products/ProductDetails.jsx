// src/components/Products/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import productService from '../../services/productService';


const ProductDetails = () => {
  const { id } = useParams();  // Get the product ID from the URL
  const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



  useEffect(() => {    //fetch product details when id changes
    const fetchProduct = async () => {
      try {


        const fetchedProduct = await productService.getProductById(id); //fetch product using the service
        setProduct(fetchedProduct);



      } catch (error) {

                setError(error?.response?.data?.message || 'Failed to fetch Product Details.');  //set error message

            }finally{
                setLoading(false); //set loading to false when details fetched

            }


        };



        fetchProduct();



  }, [id]);  //dependency on id




    if (loading) return <p>Loading product details...</p>; //loading message
  if (error) return <p className="text-red-500">Error: {error}</p>;  //error handling


  if (!product) return <p>Product not found.</p>;  //if no product is found




  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Product Details</h2>
      <p><strong>Name:</strong> {product.name}</p>   {/*display product details */}
      {/* ... other product details ... */}
            <p><strong>Category:</strong> {product?.category?.name}</p>
            <p><strong>Subcategory:</strong> {product?.subCategory?.name}</p>

    </div>
  );
};

export default ProductDetails;
