// src/components/Products/ProductList.jsx
import React from 'react';
import GenericDataTable from '../UI/GenericDataTable';  // Import the table
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ProductList = ({ products, loading, error, onDelete, onEdit }) => {  // Receive props
    const navigate = useNavigate();



    const columns = [
        { key: '_id', header: 'ID' },
        { key: 'name', header: 'Name' },
        { key: 'category.name', header: 'Category' },  // Correct key access
        { key: 'subCategory.name', header: 'Subcategory' }, // Correct key access
        { key: 'price', header: 'Price' },
        { key: 'description', header: 'Description' },
        { key: 'status', header: 'Status' },
        { key: 'imageUrl', header: 'Image', render: (product) => <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover" /> }, // Correct key access
        { key: 'sequence', header: 'Sequence' },
    ];

    const handleViewDetails = (product) => {  // Define this handler for the new column
        navigate(`/products/${product._id}`);
    }


    if (loading) return <p>Loading products...</p>;  //handle the loading state
  if (error) return <p className="text-red-500">Error: {error}</p>;  //handle errors gracefully
    return <GenericDataTable data={products} columns={columns} onDelete={onDelete} onEdit={onEdit} onViewDetails={handleViewDetails} />;  //render datatable
};

export default ProductList;
