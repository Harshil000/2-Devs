import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import './App.css'
import GameScreen from './pages/GameScreen'
import { useState } from 'react'

function App() {

    const [highScore, setHighScore] = useState(0)

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Home highScore={highScore} />,
        },
        {
            path: '/play',
            element: <GameScreen setHighScore={setHighScore} />
        }
    ])

    return (
        <>
        <RouterProvider router={router} />
        </>
    )
}

export default App
