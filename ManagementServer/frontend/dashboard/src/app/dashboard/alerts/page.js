'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from '@components/Sidebar';
import { FaBell, FaCheck, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unacknowledged, acknowledged
  const abortControllerRef = useRef(null);

  const fetchAlerts = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/alerts', {
        signal: abortControllerRef.current.signal
      });
      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }
      const data = await response.json();
      setAlerts(data);
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }
      setError('Failed to load alerts');
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchAlerts();

    // Set up polling with a longer interval and proper cleanup
    const interval = setInterval(fetchAlerts, 30000); // Poll every 30 seconds instead of 5

    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchAlerts]);

  const handleAcknowledge = useCallback(async (alertId) => {
    try {
      const response = await fetch('/api/alerts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alertId,
          acknowledged: true,
          acknowledged_by: 'User', // You might want to get this from your auth context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to acknowledge alert');
      }

      // Optimize state update
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert.alert_id === alertId 
            ? { 
                ...alert, 
                acknowledged: true, 
                acknowledged_at: new Date().toISOString(),
                acknowledged_by: 'User'
              }
            : alert
        )
      );
    } catch (err) {
      console.error('Error acknowledging alert:', err);
    }
  }, []);

  const getSeverityIcon = useCallback((severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'medium':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'low':
        return <FaInfoCircle className="text-blue-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  }, []);

  const filteredAlerts = useCallback(() => {
    return alerts.filter(alert => {
      if (filter === 'unacknowledged') return !alert.acknowledged;
      if (filter === 'acknowledged') return alert.acknowledged;
      return true;
    });
  }, [alerts, filter]);

  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 ml-64 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded ${
                filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('unacknowledged')}
              className={`px-4 py-2 rounded ${
                filter === 'unacknowledged' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Unacknowledged
            </button>
            <button
              onClick={() => handleFilterChange('acknowledged')}
              className={`px-4 py-2 rounded ${
                filter === 'acknowledged' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Acknowledged
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : filteredAlerts().length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-center">No alerts found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAlerts().map((alert) => (
              <div
                key={alert.alert_id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {alert.severity || 'Unknown'} Severity Alert
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {alert.description || 'No description available'}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(alert.alert_timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!alert.acknowledged && (
                    <button
                      onClick={() => handleAcknowledge(alert.alert_id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      <FaCheck />
                      <span>Acknowledge</span>
                    </button>
                  )}
                </div>
                {alert.acknowledged && (
                  <div className="mt-4 text-sm text-gray-500">
                    Acknowledged by {alert.acknowledged_by || 'System'} on{' '}
                    {new Date(alert.acknowledged_at).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 