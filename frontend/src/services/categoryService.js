import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast for notifications
//We will use the same instance of axios as in authService
const API_BASE_URL = 'http://localhost:5000/api/category'; // Replace with your backend API URL

const getAllCategories = async () => {
  try {
    const res = await axios.get(API_BASE_URL);
    return res.data;
  } catch (error) {
    toast.error('Error fetching categories'); //display error message
    console.error('Error fetching categories:', error); //log to console
    throw error;
  }
};

const createCategory = async (categoryData) => {
  try {
    const res = await axios.post(API_BASE_URL, categoryData);
    toast.success('Category created successfully!'); //display success message

    return res.data; // Return the new category data
  } catch (error) {
    console.error('Error creating category:', error);
    toast.error(error?.response?.data?.message || 'Failed to Create Category.'); //show user friendly messages
    throw error;
  }
};

const updateCategory = async (id, categoryData) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/${id}`, categoryData);
    toast.success('Category updated successfully!'); //show success message
    return res.data;
  } catch (error) {
    console.error('Error updating category:', error);
    toast.error(error?.response?.data?.message || 'Failed to Update Category.'); //show user friendly messages
    throw error;
  }
};

const deleteCategory = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
    toast.success('Category deleted successfully!'); //show success message
  } catch (error) {
    console.error('Error deleting category:', error);
    toast.error(error?.response?.data?.message || 'Failed to Delete Category.'); //show user friendly messages
    throw error;
  }
};

export default {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
