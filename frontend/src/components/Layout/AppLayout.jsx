import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';


const AppLayout = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true); //state for sidebar

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

  return (
    <div className="flex h-screen bg-gray-100">  {/*main layout container */}

        {/* Sidebar */}
        <aside className={`w-64 bg-gray-800 text-white p-4 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>  {/*sidebar styles with transition */}


            <button onClick={toggleSidebar} className="absolute top-4 right-4 text-white p-2 rounded-md focus:outline-none lg:hidden">   {/*button to toggle sidebar */}
        {/* Hamburger Icon (replace with a proper icon component) */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>


            <h2 className="text-2xl font-bold mb-4">TableSprint</h2>   {/*Heading*/}
      <ul className="space-y-2">
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `block px-4 py-2 rounded-md hover:bg-gray-700
                            ${isActive ? 'bg-gray-700' : ''}`  //highlight the active link
            }
                    >


                        Dashboard

                    </NavLink>


                </li>


                <li>
        <NavLink
            to="/products"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md hover:bg-gray-700 ${
                isActive ? 'bg-gray-700' : ''
              }`
            }
          >
            Products
          </NavLink>
                </li>


                <li>
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md hover:bg-gray-700 ${
                isActive ? 'bg-gray-700' : ''
              }`
            }
          >
            Categories
          </NavLink>
                </li>
                <li>
        <NavLink
            to="/subcategories"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md hover:bg-gray-700 ${
                isActive ? 'bg-gray-700' : ''
              }`
            }
          >
            Sub Categories
          </NavLink>
        </li>



            </ul>
        </aside>





      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet /> {/* This is where nested routes will be rendered */}
      </main>



    </div>
  );
};

export default AppLayout;