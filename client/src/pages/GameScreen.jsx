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
            const response = await fetch("https://two-devs.onrender.com/get-user", {
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
                    y: -(window.innerHeight + 192),
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
                const response = await fetch("https://two-devs.onrender.com/UpdateScore", {
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

            <div className={`hidden shadow-2xl shadow-black absolute -bottom-48 bg-green-400 h-2 w-2`}></div>
            <div className={`hidden shadow-2xl shadow-black absolute -bottom-48 bg-blue-400 h-2 w-2`}></div>
            <div className={`hidden shadow-2xl shadow-black absolute -bottom-48 bg-violet-400 h-2 w-2`}></div>
            <div className={`hidden shadow-2xl shadow-black absolute -bottom-48 bg-red-400 h-2 w-2`}></div>
            <div className={`hidden shadow-2xl shadow-black absolute -bottom-48 bg-orange-400 h-2 w-2`}></div>
            <div className={`hidden shadow-2xl shadow-black absolute -bottom-48 bg-neutral-400 h-2 w-2`}></div>

            <Link to='/' className='absolute md:top-10 top-5 left-5 md:left-10 text-md md:text-xl font-semibold text-blue-500 cursor-pointer border-4 border-blue-500 px-2 py-1 md:px-4 md:py-2 rounded-lg z-10'>{"< Back"}</Link>
            <h2 className='absolute md:top-10 top-7 left-33 md:left-1/2 md:-translate-1/2 text-white text-lg md:text-3xl z-10'>{`Time Left: ${timeLeft}`}</h2>
            <div className='md:top-10 top-5 md:right-10 right-5 absolute text-white text-md md:text-4xl font-semibold z-10'>
                <h2>Score: {score}</h2>
                <h2>Highscore: {CurrentPlayer.highscore}</h2>
            </div>
            {
                timeLeft !== 0 ?
                    (balloons.map((balloon) => (
                        <div
                            key={balloon.id}
                            ref={balloon.ref}
                            className={`shadow-2xl shadow-black absolute -bottom-48 bg-${balloon.color}-400 h-24 w-15 md:w-36 md:h-48 cursor-pointer`}
                            style={{ left: `${balloon.left}%`, borderRadius: "75% 75% 70% 70%" }}
                            onClick={() => handlePop(balloon.id, balloon.color)}
                        >
                        </div>
                    )))
                    :
                    (
                        <div className='absolute top-1/2 left-1/2 -translate-1/2'>
                            <div className='text-4xl md:text-7xl text-white font-medium'>You Scored {score} points.</div>
                            <div className='flex md:flex-row flex-col md:gap-0 gap-5 items-center justify-evenly mt-10'>
                                <button onClick={() => window.location.reload()} className='text-white text-xl md:text-3xl border-3 border-white px-3 py-2 rounded-md cursor-pointer'>Play Again</button>
                                <Link to="/" className='text-white text-xl md:text-3xl border-3 border-white px-3 py-2 rounded-md'>View Leaderboard</Link>
                            </div>
                        </div>
                    )
            }
        </div>
    )
}

export default GameScreen
