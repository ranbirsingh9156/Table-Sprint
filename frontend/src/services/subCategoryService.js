import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:5000/api/subcategory'; // Replace with your backend API URL

// Function to get all subcategories
const getAllSubCategories = async () => {
  try {
    const res = await axios.get(API_BASE_URL);
    return res.data;
  } catch (error) {
    toast.error('Failed to get sub categories!'); //Show error message
    console.error('Error getting all subcategories:', error);

    throw error;
  }
};

const createSubCategory = async (subCategoryData) => {
  // Function to create a new subcategory

  try {
    const res = await axios.post(API_BASE_URL, subCategoryData);

    toast.success('Subcategory created successfully!'); //Show success message

    return res.data;
  } catch (error) {
    console.error('Error creating subcategory:', error);

    toast.error(
      error?.response?.data?.message || 'Failed to Create Subcategory.'
    ); //show user friendly messages
    throw error;
  }
};

const updateSubCategory = async (id, subCategoryData) => {
  // Function to update an existing subcategory

  try {
    const res = await axios.put(`${API_BASE_URL}/${id}`, subCategoryData);

    toast.success('Subcategory updated successfully!'); //Show success message
    return res.data;
  } catch (error) {
    console.error('Error updating subcategory:', error);
    toast.error(
      error?.response?.data?.message || 'Failed to Update Subcategory.'
    ); //show user friendly messages
    throw error;
  }
};

const deleteSubCategory = async (id) => {
  // Function to delete a subcategory

  try {
    await axios.delete(`${API_BASE_URL}/${id}`);

    toast.success('Subcategory deleted successfully!'); //Show success message
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    toast.error(
      error?.response?.data?.message || 'Failed to Delete Subcategory.'
    ); //show user friendly messages
    throw error;
  }
};

export default {
  getAllSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
