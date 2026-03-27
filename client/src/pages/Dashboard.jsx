import React, { useState, useEffect } from "react";
import Chatbot from "../component/Chatbot";
import Sidebar from "../component/Sidebar";
import WebcamDetection from "../component/WebcamDetection";
import { MdWarning, MdCheckCircle } from "react-icons/md";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function Dashboard() {
  const [stats, setStats] = useState({
    sleep_count: 0,
    duration: 0,
    total_sessions: 0,
  });

  const token = localStorage.getItem("token");

  // ✅ IMPORTANT (for hosting)
  const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000";

  // ✅ FETCH STATS FROM BACKEND
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/detection/stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Stats error:", error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, [token, API_URL]);

  // ✅ REAL GRAPH DATA (not fake anymore)
  const chartData = {
    labels: ["Now"],
    datasets: [
      {
        label: "Sleep Alerts",
        data: [stats.sleep_count],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 p-8 max-w-[1600px] mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* ✅ CAMERA + REAL DETECTION */}
            <div className="xl:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <h2 className="text-xl font-bold mb-4">Live Detection</h2>

              {/* 🔥 THIS IS YOUR REAL SYSTEM */}
              <WebcamDetection />
              
              {/* GRAPH */}
              <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                <h2 className="text-lg font-bold mb-4">Sleep Analysis</h2>
                <Line data={chartData} />
              </div>
            </div>

            {/* ✅ STATS */}
            <div className="flex flex-col gap-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                <MdCheckCircle size={30} />
                <p>Duration</p>
                <h2 className="text-xl font-bold">{stats.duration}s</h2>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                <MdWarning size={30} />
                <p>Sleep Alerts</p>
                <h2 className="text-xl font-bold">{stats.sleep_count}</h2>
              </div>
            </div>

          </div>
        </div>
      </main>

      <aside className="w-[300px] bg-white dark:bg-gray-800">
        <Chatbot />
      </aside>
    </div>
  );
}