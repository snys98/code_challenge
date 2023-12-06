import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './Login'
import Users from './Users'
import { useState } from 'react'
import AppProviders from './providers/app-providers'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AppProviders>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        {isLoggedIn ? <Users /> : <Login loggedInCallback={() => {
          setIsLoggedIn(true);
        }} />}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </AppProviders>
  )
}

export default App
