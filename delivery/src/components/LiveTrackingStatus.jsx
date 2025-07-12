import React, { useEffect, useState } from 'react';

export default function LiveTrackingStatus() {
  const [status, setStatus] = useState('Offline');
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [watchId, setWatchId] = useState(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setStatus('Offline');
      setError('Geolocation not supported by your browser.');
      return;
    }

    const success = (pos) => {
      setPosition(pos.coords);
      setStatus('Online');
      setError(null);
    };

    const failure = (err) => {
      setPosition(null);
      setStatus('Offline');
      setError(err.message);
    };

    const id = navigator.geolocation.watchPosition(success, failure, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000,
    });

    setWatchId(id);

    return () => {
      if (id !== null) {
        navigator.geolocation.clearWatch(id);
      }
    };
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-6 border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Live GPS Tracking Status
      </h2>

      <div className="flex items-center space-x-3 mb-4">
        <div
          className={`w-4 h-4 rounded-full ${
            status === 'Online' ? 'bg-green-500' : 'bg-red-500'
          }`}
          aria-label={`Status indicator: ${status}`}
        />
        <p className="text-lg font-medium text-gray-900">
          Status: <span>{status}</span>
        </p>
      </div>

      {status === 'Online' && position && (
        <div className="text-gray-700 space-y-1">
          <p>
            <span className="font-semibold">Latitude:</span>{' '}
            {position.latitude.toFixed(5)}
          </p>
          <p>
            <span className="font-semibold">Longitude:</span>{' '}
            {position.longitude.toFixed(5)}
          </p>
          <p>
            <span className="font-semibold">Accuracy:</span> {position.accuracy} meters
          </p>
        </div>
      )}

      {error && status === 'Offline' && (
        <p className="mt-3 text-red-600 font-medium">Error: {error}</p>
      )}
    </div>
  );
}
