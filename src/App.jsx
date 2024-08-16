import React from 'react'
import Header from './Header'
import UrlShortener from './UrlShortener'
import URLStats from './URLStats'
const App = () => {
  return (
    <div>
      <Header/>
      <UrlShortener/>
      <URLStats/>
    </div>
  )
}

export default App