import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:5000/api/products'; // Replace with your backend API URL

const getAllProducts = async () => {
  //function to fetch all products
  try {
    const res = await axios.get(API_BASE_URL);
    return res.data;
  } catch (error) {
    console.error('Error fetching products:', error);

    toast.error(error?.response?.data?.message || 'Failed to fetch Products.'); //show user friendly messages
    throw error;
  }
};

const createProduct = async (productData) => {
  //function to create a product

  try {
    const res = await axios.post(API_BASE_URL, productData);
    toast.success('Product created successfully!'); //show success message
    return res.data; // Return created product data
  } catch (error) {
    console.error('Error creating product:', error);
    toast.error(error?.response?.data?.message || 'Failed to Create Product.'); //show user friendly messages
    throw error;
  }
};

const updateProduct = async (id, productData) => {
  //function to update product
  try {
    const res = await axios.put(`${API_BASE_URL}/${id}`, productData);
    toast.success('Product updated successfully!'); //show success message
    return res.data; //return updated data
  } catch (error) {
    console.error('Error updating product:', error);
    toast.error(error?.response?.data?.message || 'Failed to Update Product.'); //show user friendly messages
    throw error;
  }
};

const deleteProduct = async (id) => {
  //function to delete product
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
    toast.success('Product deleted successfully!'); //show success message
  } catch (error) {
    console.error('Error deleting product:', error);
    toast.error(error?.response?.data?.message || 'Failed to Delete Product.'); //show user friendly messages
    throw error;
  }
};

export default {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
