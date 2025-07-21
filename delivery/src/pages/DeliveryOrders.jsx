// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaTruck, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
// import Navbar from "../components/Navbar";

// const ordersData = [
//   {
//     id: "ORD1234",
//     item: "Wireless Headphones",
//     customer: "Alice Johnson",
//     address: "123 Main St, Springfield",
//     status: "pending",
//   },
//   {
//     id: "ORD5678",
//     item: "Gaming Mouse",
//     customer: "Bob Smith",
//     address: "456 Elm St, Shelbyville",
//     status: "delivered",
//   },
//   {
//     id: "ORD9101",
//     item: "Smartphone Case",
//     customer: "Charlie Davis",
//     address: "789 Oak St, Ogdenville",
//     status: "cancelled",
//   },
 
// ];

// const statusColors = {
//   pending: "bg-yellow-100 text-yellow-800",
//   delivered: "bg-green-100 text-green-800",
//   cancelled: "bg-red-100 text-red-800",
// };

// export default function DeliveryOrders() {
//   const [orders, setOrders] = useState(ordersData);
//   const [selectedOrderId, setSelectedOrderId] = useState(null);

//   return (

//     <>
      
//       <div>
//         <Navbar/>
//       </div>
//          <div className="max-w-4xl mx-auto p-6 mt-14">
//       <h1 className="text-3xl font-bold mb-6 text-center text-black">
//         Delivery Partner Orders
//       </h1>

//       <div className="space-y-4">
//         <AnimatePresence>
//           {orders.map(({ id, item, customer, address, status }) => {
//             const isSelected = id === selectedOrderId;
//             return (
//               <motion.div
//                 key={id}
//                 layout
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//                 className={`border rounded-lg shadow-md p-4 cursor-pointer
//                   hover:shadow-xl
//                   ${isSelected ? "bg-indigo-50 border-indigo-400" : "bg-white"}
//                   flex flex-col md:flex-row md:justify-between md:items-center
//                 `}
//                 onClick={() =>
//                   setSelectedOrderId(isSelected ? null : id)
//                 }
//               >
//                 <div className="flex items-center gap-4 mb-3 md:mb-0">
//                   <FaTruck className="text-indigo-600 text-2xl" />
//                   <div>
//                     <p className="text-lg font-semibold text-gray-900">{item}</p>
//                     <p className="text-sm text-gray-600">{customer}</p>
//                     <p className="text-sm text-gray-500 italic">{address}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-4">
//                   <span
//                     className={`px-3 py-1 rounded-full text-sm font-semibold
//                     ${statusColors[status]}
//                     `}
//                   >
//                     {status.toUpperCase()}
//                   </span>

//                   {status === "delivered" && (
//                     <FaCheckCircle className="text-green-600 text-xl" />
//                   )}
//                   {status === "cancelled" && (
//                     <FaTimesCircle className="text-red-600 text-xl" />
//                   )}
//                 </div>
//               </motion.div>
//             );
//           })}
//         </AnimatePresence>

//         {selectedOrderId && (
//           <motion.div
//             layout
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//             transition={{ duration: 0.3 }}
//             className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-300 shadow-md"
//           >
//             <h2 className="text-xl font-semibold text-indigo-700 mb-2">
//               Order Details: {selectedOrderId}
//             </h2>
//             <p>
//               Here you can add more detailed info for order{" "}
//               <span className="font-medium">{selectedOrderId}</span>.
//             </p>
//             <p className="mt-2 text-gray-700">
//               For example: customer contact, estimated delivery time, special
//               instructions, etc.
//             </p>
//           </motion.div>
//         )}
//       </div>
//     </div>
//     </>

 
//   );
// }

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTruck, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Navbar from "../components/Navbar";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function DeliveryOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [trackingLogs, setTrackingLogs] = useState([]);

  // Base URL for API
  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Fetch orders from backend
    fetch(`${API_BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedOrderId) return;

    const fetchLogs = () => {
      fetch(`${API_BASE_URL}/location/${selectedOrderId}`)
        .then((res) => res.json())
        .then((data) => setTrackingLogs(data))
        .catch(console.error);
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [selectedOrderId]);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 mt-14">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          Delivery Partner Orders
        </h1>

        <div className="space-y-4">
          <AnimatePresence>
            {orders.map(({ id, item, customer, address, status }) => {
              const isSelected = id === selectedOrderId;
              return (
                <motion.div
                  key={id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`border rounded-lg shadow-md p-4 cursor-pointer
                    hover:shadow-xl
                    ${isSelected ? "bg-indigo-50 border-indigo-400" : "bg-white"}
                    flex flex-col md:flex-row md:justify-between md:items-center
                  `}
                  onClick={() => setSelectedOrderId(isSelected ? null : id)}
                >
                  <div className="flex items-center gap-4 mb-3 md:mb-0">
                    <FaTruck className="text-indigo-600 text-2xl" />
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{item}</p>
                      <p className="text-sm text-gray-600">{customer}</p>
                      <p className="text-sm text-gray-500 italic">{address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        statusColors[status]
                      }`}
                    >
                      {status.toUpperCase()}
                    </span>

                    {status === "delivered" && (
                      <FaCheckCircle className="text-green-600 text-xl" />
                    )}
                    {status === "cancelled" && (
                      <FaTimesCircle className="text-red-600 text-xl" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Live Tracking Table */}
          {selectedOrderId && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-300 shadow-md"
            >
              <h2 className="text-xl font-semibold text-indigo-700 mb-2">
                Live Tracking for Order: {selectedOrderId}
              </h2>

              {trackingLogs.length > 0 ? (
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full text-sm border">
                    <thead className="bg-indigo-100 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left">Time</th>
                        <th className="px-3 py-2 text-left">Latitude</th>
                        <th className="px-3 py-2 text-left">Longitude</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trackingLogs.map((log, i) => (
                        <tr key={i}>
                          <td className="px-3 py-1">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-3 py-1">{log.lat.toFixed(6)}</td>
                          <td className="px-3 py-1">{log.lng.toFixed(6)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600 italic">No tracking logs yet.</p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
