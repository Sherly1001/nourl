import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { hash_router } from './utils/const'

const Router = hash_router ? HashRouter : BrowserRouter

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
