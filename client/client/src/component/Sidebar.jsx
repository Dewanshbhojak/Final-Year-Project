import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdDashboard, MdPerson, MdSettings, MdLogout } from "react-icons/md";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <MdDashboard size={22} /> },
    { name: "Profile", path: "/profile", icon: <MdPerson size={22} /> },
    { name: "Settings", path: "/settings", icon: <MdSettings size={22} /> },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
      {/* Logo Area */}
      <div className="p-6">
        <h2 className="text-2xl font-serif font-bold text-black dark:text-white text-center">
          DrowsiShield
        </h2>
        <p className="mt-1 text-center text-xs text-gray-500">
          Stay Alert, Stay Safe
        </p>
      </div>

      <div className="my-2 border-t border-gray-100 dark:border-gray-700"></div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-black text-white dark:bg-gray-700"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Logout Area */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20">
          <MdLogout size={22} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
