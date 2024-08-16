import React, { useState } from 'react';
import style from "./urlShortner.module.css";

function UrlShortener() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [userName, setUserName] = useState('');
  const [linkType, setLinkType] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error message
    setCopySuccess(''); // Clear copy success message

    try {
      const response = await fetch('https://tinyserver-zejl.onrender.com/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl, userName, linkType }),
      });

      if (!response.ok) {
        throw new Error('Failed to shorten the URL');
      }

      const data = await response.json();
      setShortUrl(data.shortUrl);
      setOriginalUrl(''); // Clear the input field
      setUserName(''); // Clear the userName field
      setLinkType(''); // Clear the linkType field
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      setCopySuccess('URL copied to clipboard!');
    }, () => {
      setCopySuccess('Failed to copy URL.');
    });
  };

  return (
    <div className={style.container}>
   
      <form onSubmit={handleSubmit} className={style.form}>
        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          className={style.input}
        />
        <input
          type="text"
          placeholder="Enter type of link (e.g., Personal, Work)"
          value={linkType}
          onChange={(e) => setLinkType(e.target.value)}
          required
          className={style.input}
        />
        <input
          type="url"
          placeholder="Enter original URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          required
          className={style.input}
        />
        <button type="submit" className={style.button}>Shorten URL</button>
      </form>

      {error && <p className={style.error}>{error}</p>}

      {shortUrl && (
        <div className={style.shortUrl}>
          <h2>Shortened URL:</h2>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
          <button onClick={handleCopy} className={style.copyButton}>
            <span>Copy</span>
          </button>
          {copySuccess && <p className={style.copySuccess}>{copySuccess}</p>}
        </div>
      )}
    </div>
  );
}

export default UrlShortener;
