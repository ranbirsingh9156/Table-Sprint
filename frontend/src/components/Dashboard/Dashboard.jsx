import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import subCategoryService from '../../services/subCategoryService';
import { PieChart, Pie, Cell, Legend } from 'recharts'; // Import Recharts components

const Dashboard = () => {
    const [productCount, setProductCount] = useState(0);  //for product count
    const [categoryCount, setCategoryCount] = useState(0); //for category count
    const [subCategoryCount, setSubCategoryCount] = useState(0); //for subcategory count
    const [loading, setLoading] = useState(true);  //for loading state
  const [error, setError] = useState(null); // For potential error messages



  const data = [  //sample data to be displayed on pie chart
    { name: 'Products', value: productCount },
    { name: 'Categories', value: categoryCount },
    { name: 'Subcategories', value: subCategoryCount },


];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28']; //colors for pie slices


  useEffect(() => {
    const fetchData = async () => { //fetches data for dashboard
      try {
        const products = await productService.getAllProducts();
        const categories = await categoryService.getAllCategories();
        const subCategories = await subCategoryService.getAllSubCategories();

        setProductCount(products.length); //set the counts
        setCategoryCount(categories.length);
        setSubCategoryCount(subCategories.length);

      } catch (error) {
        console.error('Error fetching data for dashboard:', error);
        setError(error?.response?.data?.message || 'Failed to Fetch Dashboard Data'); // Set error message if any


      } finally {
                setLoading(false); //set loading to false when data is fetched or error happens

            }
        };




        fetchData();


    }, []);



    return (



        <div>
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>


            {loading ? (  //conditional rendering for loading and error states
        <div>Loading...</div>
            ) : error ? (
                <div className="text-red-500">Error: {error}</div>  //display error message if error state is true


            ) : (


                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">    {/*display summary in a grid*/}


                    <div className="bg-white p-6 rounded-lg shadow-md">    {/*card for products*/}
            <h2 className="text-xl font-bold mb-2">Products</h2>
                        <p className="text-3xl font-bold text-blue-600">{productCount}</p>  {/*display product count*/}

                    </div>


                    <div className="bg-white p-6 rounded-lg shadow-md">    {/*card for categories*/}
                        <h2 className="text-xl font-bold mb-2">Categories</h2>
            <p className="text-3xl font-bold text-green-600">{categoryCount}</p>  {/*display category count*/}


                    </div>


                    <div className="bg-white p-6 rounded-lg shadow-md">   {/*card for subcategories*/}
            <h2 className="text-xl font-bold mb-2">Subcategories</h2>
                        <p className="text-3xl font-bold text-yellow-600">{subCategoryCount}</p> {/*display subcategory count*/}


                    </div>


                    <h2 className="text-2xl font-bold mb-4">Data Distribution</h2> {/*heading for chart*/}


                    <PieChart width={400} height={300}>
    <Pie
data={data}
        cx={200}
cy={150}
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
dataKey="value"
    >
{data.map((entry, index) => (
<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}




</Pie>
<Legend/> {/*add legends*/}

</PieChart>

                </div>
            )}


        </div>



    );
};



export default Dashboard;