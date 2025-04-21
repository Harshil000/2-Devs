import gsap from 'gsap'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import "../styles/Home.css"
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom';

const GameScreen = () => {
    const balloonColors = ["blue", "green", "blue", 'red', 'blue', 'orange', 'blue', 'neutral', 'blue', "violet"]
    const [balloons, setBalloons] = useState([])
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(60)
    const [CurrentPlayer , SetCurrentPlayer] = useState({})
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const uuid4 = queryParams.get('uuid4');

    useEffect(() => {
        const interval = setInterval(() => {
            addBalloon();
        }, 500);

        const timeout = setTimeout(() => {
            clearInterval(interval);
            console.log("Stopped spawning balloons");
        }, 60000);

        const getUser = async () => {
            const response = await fetch("http://localhost:3000/get-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uuid4: uuid4 })
            })
            const data = await response.json()
            SetCurrentPlayer(data.player)
        }

        getUser()

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) return

        const timer = setTimeout(() => {
            setTimeLeft(prev => prev - 1)
        }, 1000)
        return () => clearTimeout(timer)
    }, [timeLeft])

    const addBalloon = () => {
        const id = uuidv4()
        const ref = React.createRef()
        const left = Math.random() * 90
        const color = balloonColors[Math.floor((Math.random() * 10))]
        const newBalloon = { id, ref, left, color }

        setBalloons(prev => [...prev, newBalloon])

        const speed = Math.random() * 3 + 4
        setTimeout(() => {
            if (ref.current) {
                gsap.to(ref.current, {
                    y: -(window.innerHeight + 144),
                    duration: speed,
                    ease: 'linear',
                    onComplete: () => {
                        setBalloons(prev => prev.filter(b => b.id !== id))
                    }
                })
            }
        }, 50)
    }


    const handlePop = (id, color) => {
        if (color !== "blue") {
            setScore(prev => prev - 1)
            return
        }
        setBalloons(prev => prev.filter(b => b.id !== id))
        setScore(prev => prev + 2)
    }

    useEffect(() => {
        if (score > CurrentPlayer.highscore) {
            const changeHighScore = async () => {
                const response = await fetch("http://localhost:3000/UpdateScore", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: CurrentPlayer.email, score: score })
                })
                const data = await response.json()
                console.log(data.text())
            }
            changeHighScore();
        }
    }, [score])



    return (
        <div className='w-full h-screen bg-slate-950 relative overflow-hidden'>
            <Link to='/' className='absolute top-10 left-10 text-4xl font-semibold text-blue-500 cursor-pointer border-4 border-blue-500 px-4 py-2 rounded-lg z-10'>{"< Back"}</Link>
            <h2 className='absolute top-10 left-1/2 -translate-x-1/2 text-white text-3xl z-10'>{`Time Left: ${timeLeft}`}</h2>
            <div className='top-10 right-10 absolute text-white text-4xl font-semibold z-10'>
                <h2>Score: {score}</h2>
                <h2>HighscoreScore: {CurrentPlayer.highscore}</h2>
            </div>
            {
                timeLeft !== 0 ?
                    (balloons.map((balloon) => (
                        <div
                            key={balloon.id}
                            ref={balloon.ref}
                            className={`shadow-2xl shadow-black absolute -bottom-36 h-48 w-36 cursor-pointer`}
                            style={{ left: `${balloon.left}%`, backgroundColor: balloon.color, borderRadius: "75% 75% 70% 70%" }}
                            onClick={() => handlePop(balloon.id, balloon.color)}
                        >
                        </div>
                    )))
                    :
                    (
                        <div className='absolute top-1/2 left-1/2 -translate-1/2'>
                            <div className='text-7xl text-white font-medium'>You Scored {score} points.</div>
                            <div className='flex items-center justify-evenly mt-10'>
                                <button onClick={() => window.location.reload()} className='text-white text-3xl border-3 border-white px-3 py-2 rounded-md cursor-pointer'>Play Again</button>
                                <Link to="/" className='text-white text-3xl border-3 border-white px-3 py-2 rounded-md'>View Leaderboard</Link>
                            </div>
                        </div>
                    )
            }
        </div>
    )
}

export default GameScreen
