import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import './App.css'
import GameScreen from './pages/GameScreen'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
        path: '/play',
        element: <GameScreen />
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
