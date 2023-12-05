import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppApolloProvider from './proxies'
import Login from './Login'

function App() {

  return (
    <AppApolloProvider>
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
        <Login></Login>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </AppApolloProvider>
  )
}

export default App
