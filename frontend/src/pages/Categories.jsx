import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import categoryService from '../services/categoryService';
import GenericDataTable from '../components/UI/GenericDataTable';
import AddCategoryForm from '../components/Categories/AddCategoryForm';  //make sure to implement this
import EditCategoryForm from '../components/Categories/EditCategoryForm'; //make sure to implement this
import Modal from '../components/UI/Modal';
import CategoryList from '../components/Categories/CategoryList';  // Import





const Categories = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true); //for loading state
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); //for edit modal
    const [editCategory, setEditCategory] = useState(null); //for the category to be edited
    const [error,setError] = useState(null);



    useEffect(() => {
        const fetchCategories = async () => {
          try {
                const data = await categoryService.getAllCategories();
                setCategories(data);
            } catch (error) {
                setError(error?.response?.data?.message || 'Failed to fetch Categories.');  // Set error message
                toast.error(error?.response?.data?.message || 'Failed to fetch Categories.'); //show error message

            } finally{
                setLoading(false); //set loading to false after fetching
            }

        };


        fetchCategories();


    }, []);  //empty dependency means run only once after the component mounts




    const handleDelete = async (id) => {
        try {

            await categoryService.deleteCategory(id);


            setCategories(categories.filter((category) => category._id !== id)); //update state after delete


        } catch (error) {
            console.log("Delete Error",error)
          setError(error); // Set the error message to state

        }


    };




  const handleEdit = (category) => {
    setEditCategory(category);  // Set the category to be edited
    setShowEditModal(true);     // Open the edit modal
  };



    const columns = [
      { key: '_id', header: 'ID' },
        { key: 'name', header: 'Name' },
    ];


    return (


    <div>
            <h2 className="text-2xl font-bold mb-4">Categories</h2>


            {/* Add Category Button */}
            <button onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"> {/*button to open modal*/}
                Add Category
            </button>



            {/* Add Category Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Category">  {/*modal for creating category*/}

                <AddCategoryForm onClose={() => setShowModal(false)} categories={categories} setCategories={setCategories}/>


            </Modal>


            {/* Edit Category Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Category">
                <EditCategoryForm onClose={() => setShowEditModal(false)} category={editCategory} categories={categories} setCategories={setCategories}/>

            </Modal>
            {loading ? (  //conditional rendering while loading
        <p>Loading categories...</p>
            ): error ? ( //show error message
                <p className='text-red-700'>{error}</p>

            ):(

                <GenericDataTable data={categories} columns={columns} onDelete={handleDelete} onEdit={handleEdit} />
            )
        }
        <CategoryList categories={categories} loading={loading} error={error} onDelete={handleDelete} onEdit={handleEdit} />

        </div>


    );


};


export default Categories;