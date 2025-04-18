'use client';

import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import Sidebar from '@components/Sidebar';

export default function EndpointsPage() {
  const [endpointName, setEndpointName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [endpoints, setEndpoints] = useState([]);
  const [isLoadingEndpoints, setIsLoadingEndpoints] = useState(true);

  useEffect(() => {
    fetchEndpoints();
  }, []);

  const fetchEndpoints = async () => {
    try {
      const response = await fetch('/api/get-endpoints');
      const data = await response.json();
      if (response.ok) {
        setEndpoints(data);
      } else {
        setError(data.error || 'Failed to fetch endpoints');
      }
    } catch (error) {
      setError('Error fetching endpoints');
    } finally {
      setIsLoadingEndpoints(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/create-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: endpointName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create endpoint');
      }

      // Create and download config file
      const blob = new Blob([data.config_content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Use the endpoint name for the filename, replacing spaces with underscores
      const safeName = endpointName.replace(/\s+/g, '_');
      a.download = `${safeName}_Endpoint.conf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Reset form and refresh endpoints list
      setEndpointName('');
      setSuccess('Endpoint created successfully!');
      fetchEndpoints();
    } catch (err) {
      setError(err.message || 'Failed to create endpoint. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (endpoint) => {
    try {
      const response = await fetch(`/api/download-config/${endpoint.endpoint_id}`);
      if (!response.ok) {
        throw new Error('Failed to download config');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = endpoint.Name.replace(/\s+/g, '_');
      a.download = `${safeName}_Endpoint.conf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setError('Error downloading configuration');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 ml-64">
        <div className="max-w-6xl mx-auto">
          {/* Add Endpoint Section */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <FaPlus className="text-blue-600 mr-2" size={24} />
              <h1 className="text-2xl font-bold text-gray-900">Add New Endpoint</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 mb-6">
                Create a configuration file for your new endpoint. This file will be used to install the endpoint on your target device.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="endpointName" className="block text-sm font-medium text-gray-700 mb-1">
                    Endpoint Name
                  </label>
                  <input
                    type="text"
                    id="endpointName"
                    value={endpointName}
                    onChange={(e) => setEndpointName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter endpoint name"
                    required
                    disabled={isLoading}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Choose a descriptive name for your endpoint (e.g., "Office Computer" or "Server Room")
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !endpointName.trim()}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Endpoint'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Endpoints List Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Your Endpoints</h2>
            {isLoadingEndpoints ? (
              <div className="text-center py-4">Loading endpoints...</div>
            ) : endpoints.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No endpoints created yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hostname</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {endpoints.map((endpoint) => (
                      <tr key={endpoint.endpoint_id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{endpoint.Name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{endpoint.hostname || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{endpoint.ip_address || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => handleDownload(endpoint)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Download Config
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 