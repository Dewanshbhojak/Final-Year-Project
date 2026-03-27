import React, { useState, useEffect } from "react";
import Sidebar from "../component/Sidebar";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);
  const [cameraAutoStart, setCameraAutoStart] = useState(false);

  return (
    <div className={`flex h-screen bg-gray-50 text-black dark:bg-gray-900 dark:text-white transition-colors duration-300`}>
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="mb-8 text-3xl font-serif font-bold">
            Settings
          </h1>

          <div className={`rounded-2xl border bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow-sm p-8 transition-all hover:shadow-md`}>
            
            <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-100">Preferences</h2>
            
            <div className="space-y-6">
              {/* Notifications Toggle */}
              <div className="flex items-center justify-between group">
                <div>
                  <p className="font-semibold text-lg">Push Notifications</p>
                  <p className={`text-sm text-gray-500 dark:text-gray-400`}>Receive alerts when drowsiness is detected</p>
                </div>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${notifications ? 'bg-black' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between group">
                <div>
                  <p className="font-semibold text-lg">Dark Mode</p>
                  <p className={`text-sm text-gray-500 dark:text-gray-400`}>Adjust the appearance of the application</p>
                </div>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${darkMode ? 'bg-black' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Camera Auto Start */}
              <div className="flex items-center justify-between group">
                <div>
                  <p className="font-semibold text-lg">Camera Auto-Start</p>
                  <p className={`text-sm text-gray-500 dark:text-gray-400`}>Automatically start camera on dashboard load</p>
                </div>
                <button 
                  onClick={() => setCameraAutoStart(!cameraAutoStart)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${cameraAutoStart ? 'bg-black' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${cameraAutoStart ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
              <div className={`p-5 rounded-xl border bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-500/20`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-red-600">Delete Account</p>
                    <p className={`text-sm mt-1 text-red-500/80 dark:text-red-400/80`}>Permanently remove your data from our servers. This action cannot be undone.</p>
                  </div>
                  <button className="px-5 py-2.5 shrink-0 bg-red-600 text-white rounded-xl font-medium shadow-sm hover:bg-red-700 hover:shadow transition">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
