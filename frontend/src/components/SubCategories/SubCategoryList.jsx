// src/components/SubCategories/SubCategoryList.jsx
import React from 'react';
import GenericDataTable from '../UI/GenericDataTable';


const SubCategoryList = ({ subCategories, loading, error, onDelete, onEdit }) => {


    const columns = [
        { key: '_id', header: 'ID' },
        { key: 'name', header: 'Name' },
        { key: 'category.name', header: 'Category' },  // Access nested property

    ];


    if (loading) return <p>Loading subcategories...</p>;  //loading state
  if (error) return <p className="text-red-500">Error: {error}</p>;  //error message

    return <GenericDataTable data={subCategories} columns={columns} onDelete={onDelete} onEdit={onEdit} />;

};


export default SubCategoryList;
