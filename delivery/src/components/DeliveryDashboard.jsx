import React from 'react';
import Navbar from './Navbar';

const DeliveryDashboard = ({ partners }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-8 max-w-7xl mx-auto mt-20">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Delivery Partner Dashboard
        </h2>

        <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {[
                  'ID',
                  'Name',
                  'Type',
                  'Status',
                  'Orders Today',
                  'Avg Delivery Time',
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {partners && partners.length > 0 ? (
                partners.map((partner) => (
                  <tr
                    key={partner.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {partner.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {partner.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {partner.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                          partner.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {partner.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {partner.ordersToday}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {partner.avgDeliveryTime}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-10 text-gray-500 text-lg font-medium"
                  >
                    No partners available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const samplePartners = [
    {
      id: 1,
      name: 'John Doe',
      type: 'Bike',
      status: 'Active',
      ordersToday: 10,
      avgDeliveryTime: '25 mins',
    },
    {
      id: 2,
      name: 'Jane Smith',
      type: 'Car',
      status: 'Offline',
      ordersToday: 4,
      avgDeliveryTime: '35 mins',
    },
  ];

  return <DeliveryDashboard partners={samplePartners} />;
}
