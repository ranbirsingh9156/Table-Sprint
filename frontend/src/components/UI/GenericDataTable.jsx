import React, { useState, useEffect } from 'react';
import axios from 'axios';



const GenericDataTable = ({ apiUrl, columns }) => {


  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        setData(response.data);      //set the fetched data
        setLoading(false);
      } catch (error) {
        setError(error);          //set the error message if any error
        setLoading(false);
      }
    };


    fetchData();
  }, [apiUrl]);


  if (loading) {
    return <div>Loading...</div>;    //Placeholder for loading
  }


  if (error) {
    return <div>Error: {error.message}</div>;  //Placeholder for error
  }
  return (

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
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Edit</span>
                        </th>
                </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
                {/* Map through data and render table rows */}
                    {data.map((item) => (
                        <tr key={item._id}>
                        {columns.map((column) => (
                            <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                {/* Render cell content based on column type */}
                                {column.render ? column.render(item[column.key], item) : item[column.key]}
                            </td>
                            ))}
                        </tr>
                        ))}
            </tbody>
        </table>
  );
};

export default GenericDataTable;