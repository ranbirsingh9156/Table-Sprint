import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';


const GenericDataTable = ({ data, columns, onDelete, onEdit }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page
    const [searchTerm, setSearchTerm] = useState('');

//for filtering based on searchTerm
    const filteredData = useMemo(() => {
        return data.filter(item =>
            Object.values(item).some(value =>
                value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [data, searchTerm]);




    // Calculate current data for the page
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);



    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };


    const handleRowsPerPageChange = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setCurrentPage(1); //reset to first page when rows per page changes
    };



    return (
        <div>
      {/* Search Bar */}
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} //sets the searchTerm
                className="mb-4 w-full border border-gray-400 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />


            <table className="min-w-full divide-y divide-gray-200">


                <thead className="bg-gray-50">
          <tr>
                        {columns.map((column) => (
              <th
                                key={column.key}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.header}
              </th>
                        ))}

                        {/*for edit and delete operation */}
                        {onDelete || onEdit ? <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> : null}

          </tr>
        </thead>


                <tbody className="bg-white divide-y divide-gray-200">
                    {currentRows.map((row) => (
                        <tr key={row._id}>
                            {columns.map((column) => (
                                <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                    {column.render ? column.render(row) : row[column.key]}  {/*render the cell value*/}
                                </td>
                            ))}


                            {/* Conditional rendering for action buttons */}
                {onDelete || onEdit ? (
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">


                    {onEdit ? (
                        <button onClick={() => onEdit(row)} className="text-blue-500 hover:text-blue-700">Edit</button>
                      ) : null}


                    {/* Delete Button with Confirmation */}
                    {onDelete ? (
                        <button onClick={() => onDelete(row._id)} className="text-red-500 hover:text-red-700">Delete</button>
                    ) : null}

                  </td>
                ) : null}



                        </tr>
                    ))}


                </tbody>
            </table>



            {/* Pagination Controls */}


            <div className="mt-4 flex justify-between items-center">


                <div>
                    <label htmlFor="rowsPerPage" className="mr-2">Rows per page:</label>
          <select
                        id="rowsPerPage"
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                        className="border border-gray-400 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
            {/*options to be selected */}
                        {[5, 10, 20, 50].map((option) => (
                            <option key={option} value={option}>
              {option}
            </option>
          ))}
                    </select>
                </div>



                <div>
                    <ul className="pagination flex">



                        {/* Previous Page Button */}
            <li
                            className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`} //disable if at first page
                            onClick={() => handlePageChange(currentPage - 1)}
          >
                            <button >Previous</button>
                        </li>


                        {/* Page Numbers */}
           {Array.from({ length: Math.ceil(filteredData.length / rowsPerPage) }).map((_, index) => (
                            <li
                                key={index + 1}
                                className={`pagination-item ${currentPage === index + 1 ? 'active' : ''}`} //highlight the current page
                                onClick={() => handlePageChange(index + 1)}
                            >


                                <button>{index + 1}</button>

                            </li>
                        ))}


                         {/* Next Page Button */}
           <li
                            className={`pagination-item ${currentPage === Math.ceil(filteredData.length / rowsPerPage) ? 'disabled' : ''}`}  //disable if at last page
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            <button>Next</button>
                        </li>



                    </ul>
                </div>




            </div>




        </div>
    );


};


GenericDataTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
          header: PropTypes.string.isRequired,
          render: PropTypes.func //optional render function
        })
    ).isRequired,
    onDelete: PropTypes.func, //optional function
    onEdit: PropTypes.func, //optional function


};




export default GenericDataTable;