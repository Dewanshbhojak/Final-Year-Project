import React, { useEffect, useState } from "react";
import Sidebar from "../component/Sidebar";
import { MdEmail, MdPersonOutline, MdSecurity } from "react-icons/md";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Attempt to parse user from token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        setUser(JSON.parse(jsonPayload));
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 text-black">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="mb-8 text-3xl font-serif text-black font-bold">
            My Profile
          </h1>

          <div className="rounded-2xl border bg-white shadow-sm p-8 transition-all hover:shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-8 border-b border-gray-100">
              <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-gray-800 to-black text-white flex shrink-0 items-center justify-center text-4xl shadow-lg border-4 border-gray-50">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500">
                  {user?.name || "Premium User"}
                </h2>
                <p className="text-gray-500 font-medium">{user?.email || "user@example.com"}</p>
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600 ring-1 ring-inset ring-green-600/20">
                  Active Account
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 transition hover:bg-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <MdPersonOutline size={24} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Full Name</p>
                    <p className="font-semibold">{user?.name || "Not specified"}</p>
                  </div>
                </div>
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">Edit</button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 transition hover:bg-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <MdEmail size={24} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email Address</p>
                    <p className="font-semibold">{user?.email || "Not specified"}</p>
                  </div>
                </div>
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">Edit</button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 transition hover:bg-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <MdSecurity size={24} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Security</p>
                    <p className="font-semibold">Password & Authentication</p>
                  </div>
                </div>
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">Manage</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
