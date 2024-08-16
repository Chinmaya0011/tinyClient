// src/components/URLStats.js
import React, { useState, useEffect } from 'react';

const URLStats = () => {
  const [shortUrl, setShortUrl] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://tinyserver-zejl.onrender.com/stats/${url}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setShortUrl(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (shortUrl) {
      fetchStats(shortUrl);
    }
  };

  return (
    <div>
      <h1>URL Statistics Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={shortUrl}
          onChange={handleInputChange}
          placeholder="Enter Short URL"
          required
        />
        <button type="submit">Get Stats</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {stats && (
        <div>
          <h2>URL Statistics</h2>
          <p><strong>Short URL:</strong> {stats.shortUrl}</p>
          <p><strong>Original URL:</strong> {stats.originalUrl}</p>
          <p><strong>Click Count:</strong> {stats.clickCount}</p>
          <h3>Click Details</h3>
          {stats.clicks.length > 0 ? (
            <ul>
              {stats.clicks.map((click, index) => (
                <li key={index}>
                  <p><strong>IP Address:</strong> {click.ip}</p>
                  <p><strong>Timestamp:</strong> {new Date(click.timestamp).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No clicks recorded</p>
          )}
        </div>
      )}
    </div>
  );
};

export default URLStats;
