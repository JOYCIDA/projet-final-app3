import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// ReactDOM.createRoot : point d'entrée de React
// Il "monte" l'application dans le div#root de index.html
// StrictMode : active des vérifications supplémentaires en développement
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)