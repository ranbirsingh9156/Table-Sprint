import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import productService from '../services/productService';  // Import the product service
import GenericDataTable from '../components/UI/GenericDataTable';
import AddProductForm from '../components/Products/AddProductForm';
import EditProductForm from '../components/Products/EditProductForm';
import Modal from '../components/UI/Modal';




const Products = () => {
    const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
    const [error,setError] = useState(null);
    const [showModal, setShowModal] = useState(false); //for add product modal
  const [showEditModal, setShowEditModal] = useState(false); //for edit product modal
  const [editProduct, setEditProduct] = useState(null); //for the product to be edited


  useEffect(() => {
        const fetchProducts = async () => {
      try {

        const data = await productService.getAllProducts(); // Fetch products from the API
                setProducts(data);


            } catch (error) {
                setError(error?.response?.data?.message || 'Failed to fetch Products'); // Set error message
                toast.error(error?.response?.data?.message || 'Failed to fetch Products.'); //show error message

            }finally{
        setLoading(false);


            }
        };


        fetchProducts();



    }, []);


    const handleDelete = async (id) => {

        try {
            await productService.deleteProduct(id); //call api to delete
            setProducts(products.filter((product) => product._id !== id)); //update state to remove deleted item

        } catch (error) {
            console.log("Delete Error",error)
            setError(error); // Set the error message to state

        }


    };



  const handleEdit = (product) => {  //function to handle edit button click
    setEditProduct(product);  //set the product to be edited
    setShowEditModal(true); //show the edit modal


  };


    const columns = [

        { key: '_id', header: 'ID' },
        { key: 'name', header: 'Name' },
        {
            key: 'category',
            header: 'Category',
      render: (product) => product.category?.name || 'N/A',  //render category name, handles cases where category might be missing
        },
        {
      key: 'subCategory',
      header: 'Subcategory',
            render: (product) => product.subCategory?.name || 'N/A',   //render subcategory name
    },
        { key: 'price', header: 'Price' },
        { key: 'description', header: 'Description' },
        { key: 'status', header: 'Status' },
    {key:'imageUrl', header:'Image', render:(product)=><img src={product.imageUrl} alt={product.name} className='w-16 h-16 object-cover'/>},
        {key:'sequence',header:'Sequence'}



    ];




  return (


        <div>
      <h2 className="text-2xl font-bold mb-4">Products</h2>


      {/* Add Product Button */}
            <button onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
        Add Product
      </button>


            {/* Add Product Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Product">
                <AddProductForm onClose={() => setShowModal(false)} setProducts={setProducts} products={products}/>  {/*pass necessary props*/}
            </Modal>





            {/* Edit Product Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Product">
        <EditProductForm
                    onClose={() => setShowEditModal(false)}
          product={editProduct}  // Pass the product to be edited
                    setProducts={setProducts}
                    products={products}



        />

      </Modal>



        {loading ? (    //show loading message while fetching
                <p>Loading products...</p>
            ) : error ? (    // Show error message if fetching failed
                <p className='text-red-700'>{error}</p>
              ) : (
                <GenericDataTable data={products} columns={columns} onDelete={handleDelete} onEdit={handleEdit} /> //render the data table
      )}

    </div>
  );



};




export default Products;