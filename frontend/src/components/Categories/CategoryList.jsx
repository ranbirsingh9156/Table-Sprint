// src/components/Categories/CategoryList.jsx
import React from 'react';
import GenericDataTable from '../UI/GenericDataTable';

const CategoryList = ({ categories, loading, error, onDelete, onEdit }) => {
    const columns = [
      { key: '_id', header: 'ID' },
      { key: 'name', header: 'Name' },
    ];


  if (loading) return <p>Loading categories...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

    return <GenericDataTable data={categories} columns={columns} onDelete={onDelete} onEdit={onEdit} />;

};


export default CategoryList;
