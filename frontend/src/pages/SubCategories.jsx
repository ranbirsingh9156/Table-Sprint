import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import subCategoryService from '../services/subCategoryService';
import GenericDataTable from '../components/UI/GenericDataTable';
import AddSubCategoryForm from '../components/SubCategories/AddSubCategoryForm';
import EditSubCategoryForm from '../components/SubCategories/EditSubCategoryForm';
import Modal from '../components/UI/Modal';
import SubCategoryList from '../components/SubCategories/SubCategoryList';  // Import



const SubCategories = () => {
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); //for the add modal
  const [showEditModal, setShowEditModal] = useState(false); //for the edit modal
  const [editSubCategory, setEditSubCategory] = useState(null); //for the subcategory to be edited



    useEffect(() => {     //fetch subcategories when the component mounts


        const fetchSubCategories = async () => {


      try {
        const data = await subCategoryService.getAllSubCategories(); //fetch all subcategories

        setSubCategories(data);



      } catch (error) {

                setError(error?.response?.data?.message || 'Failed to fetch Subcategories.'); // Set error message
                toast.error(error?.response?.data?.message || 'Failed to fetch Subcategories.'); //show error message


      }finally{

                setLoading(false); //set loading to false

            }

        };


        fetchSubCategories();



    }, []);



  const handleDelete = async (id) => {  //delete subcategory by id
    try {


            await subCategoryService.deleteSubCategory(id);
            // Update state after successful delete
      setSubCategories(subCategories.filter((subCategory) => subCategory._id !== id));



    } catch (error) {

      console.error('Error deleting subcategory:', error);
            setError(error); // Set the error message to state



    }


  };



  const handleEdit = (subCategory) => { //function to handle the edit operation when edit button is clicked
    setEditSubCategory(subCategory); //set the subcategory to be edited
    setShowEditModal(true);  //open the edit modal



  };



    const columns = [  //define the columns for the table
        { key: '_id', header: 'ID' },
        { key: 'name', header: 'Name' },
        { key: 'category.name', header: 'Category Name' }, // Access nested category name


    ];




    return (
        <div>


            <h2 className="text-2xl font-bold mb-4">Subcategories</h2>


            <button onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">  {/*button to open add modal*/}
                Add SubCategory


            </button>



            {/* Add SubCategory Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add SubCategory">
        <AddSubCategoryForm
          onClose={() => setShowModal(false)}
                    subCategories={subCategories}
          setSubCategories={setSubCategories}

        />


            </Modal>



      {/* Edit SubCategory Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit SubCategory">
                <EditSubCategoryForm
                    onClose={() => setShowEditModal(false)}
          subCategory={editSubCategory} //pass the subcategory to be edited
                    subCategories={subCategories}
                    setSubCategories={setSubCategories}


                />



            </Modal>


            {/*conditional rendering for loading and error states */}
      {loading ? (
        <p>Loading subcategories...</p>
            ) : error ? (  //show error message if error state is true
                <p className='text-red-700'>{error}</p>


            ):(


                <GenericDataTable data={subCategories} columns={columns} onDelete={handleDelete} onEdit={handleEdit} />
                /*render the data table */


            )}
            <SubCategoryList subCategories={subCategories} loading={loading} error={error} onDelete={handleDelete} onEdit={handleEdit} />




        </div>



    );



};

export default SubCategories;