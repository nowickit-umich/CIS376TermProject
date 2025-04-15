'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Sidebar from '@components/Sidebar';
import Navbar from '@components/Navbar';

const EVENT_CATEGORIES = ['All', 'Security', 'Performance', 'System'];
const ITEMS_PER_PAGE = 20;

export default function EventDashboard() {
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchEvents = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/dbtest', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortControllerRef.current.signal,
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }
      console.error('Error fetching events:', error);
      setError('Failed to load events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 30000); // Poll every 30 seconds

    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchEvents]);

  const filteredEvents = useMemo(() => {
    return events
      .filter(event => {
        if (category !== 'All' && event.category !== category) {
          return false;
        }
        if (search) {
          const searchLower = search.toLowerCase();
          return (
            (event.type?.toLowerCase().includes(searchLower)) ||
            (event.message?.toLowerCase().includes(searchLower)) ||
            (event.severity?.toLowerCase().includes(searchLower))
          );
        }
        return true;
      })
      .slice(0, page * ITEMS_PER_PAGE);
  }, [events, category, search, page]);

  const handleCategoryChange = useCallback((newCategory) => {
    setCategory(newCategory);
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const handleLoadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 overflow-auto">
          <h1 className="text-2xl font-bold mb-4">Event Stream</h1>

          {/* Category Filters */}
          <div className="flex space-x-4 mb-4">
            {EVENT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded ${
                  category === cat ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search events..."
            className="p-2 border rounded w-full mb-4"
            value={search}
            onChange={handleSearchChange}
          />

          {/* Event List */}
          <div className="border rounded p-4 h-96 overflow-y-auto bg-white">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : filteredEvents.length === 0 ? (
              <p className="text-gray-500 text-center">No events found</p>
            ) : (
              filteredEvents.map((event, index) => (
                <div key={`${event.id || index}-${event.timestamp}`} className="border-b py-2">
                  <p className="font-semibold">{event.type || 'Unknown'} - {event.severity || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{event.message || 'No message'}</p>
                  {event.timestamp && (
                    <p className="text-xs text-gray-400">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Load More Button */}
          {filteredEvents.length > 0 && filteredEvents.length < events.length && (
            <button
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
              onClick={handleLoadMore}
            >
              Load More
            </button>
          )}
        </main>
      </div>
    </div>
  );
}
