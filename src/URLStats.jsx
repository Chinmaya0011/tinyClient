import React, { useState } from 'react';
import style from './urlStats.module.css';

const URLStats = () => {
  const [shortUrl, setShortUrl] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to extract the part of the URL after .com/
  const extractPath = (url) => {
    const match = url.match(/\.com\/(.+)/);
    return match ? match[1] : url;
  };

  const fetchStats = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const path = extractPath(url);
      const response = await fetch(`https://tinyserver-zejl.onrender.com/stats/${encodeURIComponent(path)}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('URL not found');
        } else {
          throw new Error('Failed to fetch data');
        }
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
    if (shortUrl.trim()) {
      fetchStats(shortUrl);
    } else {
      setError('Please enter a short URL');
    }
  };

  return (
    <div className={style.container}>
      <h1 className={style.header}>URL Statistics Dashboard</h1>
      <form onSubmit={handleSubmit} className={style.form}>
        <input
          type="text"
          value={shortUrl}
          onChange={handleInputChange}
          placeholder="Enter Short URL"
          required
          className={style.input}
        />
        <button
          type="submit"
          className={style.button}
        >
          Get Stats
        </button>
      </form>

      {loading && <p className={style.loading}>Loading...</p>}
      {error && <p className={style.error}>{error}</p>}

      {stats && (
        <div className={style.statsContainer}>
          <h2>URL Statistics</h2>
          <table className={style.table}>
            <thead>
              <tr>
                <th>Short URL</th>
                <th>Original URL</th>
                <th>No of Clicks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{stats.shortUrl}</td>
                <td><a href={stats.originalUrl} target="_blank" rel="noopener noreferrer">{stats.originalUrl}</a></td>
                <td>{stats.clickCount}</td>
              </tr>
            </tbody>
          </table>
          <h3 className={style.clickDetails}>Click Details</h3>
          {stats.clicks.length > 0 ? (
            <table className={style.table}>
              <thead>
                <tr>
                  <th>IP Address</th>
                  <th>Click Time</th>
                </tr>
              </thead>
              <tbody>
                {stats.clicks.map((click, index) => (
                  <tr key={index}>
                    <td>{click.ip}</td>
                    <td>{new Date(click.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No clicks recorded</p>
          )}
        </div>
      )}
    </div>
  );
};

export default URLStats;
