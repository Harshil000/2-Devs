import gsap from 'gsap'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import "../styles/Home.css"
import { Link } from 'react-router-dom'

const GameScreen = ({setHighScore}) => {
    const balloonColors = ["blue", "green","blue", 'red', 'blue', 'orange', 'blue', 'neutral', 'blue', "violet"]

    const [balloons, setBalloons] = useState([])
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(60)

    useEffect(() => {
        const interval = setInterval(() => {
            addBalloon();
        }, 500);

        const timeout = setTimeout(() => {
            clearInterval(interval);
            // setHighScore(score)
            console.log("Stopped spawning balloons");
        }, 60000); 

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    useEffect(()=> {
        if(timeLeft<=0)return

        const timer = setTimeout(()=> {
            setTimeLeft(prev=>prev-1)
        }, 1000)
        return ()=>clearTimeout(timer)
    }, [timeLeft])

    const addBalloon = () => {
        const id = uuidv4()
        const ref = React.createRef()
        const left = Math.random()*90
        const color = balloonColors[Math.floor((Math.random()*10))]
        const newBalloon = {id, ref, left, color}

        setBalloons(prev => [...prev, newBalloon])


        setTimeout(()=> {
            if(ref.current) {
                gsap.to(ref.current, {
                    y: -window.innerHeight,
                    duration: 5,
                    ease: 'linear',
                })
            }
        }, 50)
    }

    const handlePop = (id,color) => {
        if(color!=="blue"){
            setScore(prev=>prev-1) 
            return
        }
        setBalloons(prev=>prev.filter(b=>b.id!==id))
        setScore(prev=>prev+2)
    }


  return (
    <div className='w-full h-screen bg-slate-950 relative overflow-hidden'>
      <Link to='/' className='absolute top-10 left-10 text-4xl font-semibold text-blue-500 cursor-pointer border-4 border-blue-500 px-4 py-2 rounded-lg'>{"< Back"}</Link>
      <h2 className='absolute top-10 left-1/2 -translate-x-1/2 text-white text-3xl'>{`Time Left: ${timeLeft}`}</h2>
      <h2 className='absolute top-10 right-10 text-white text-4xl font-semibold'>Score: {score}</h2>
      {
        timeLeft!==0 ? 
          (balloons.map((balloon)=> (
            <div 
            key={balloon.id} 
            ref={balloon.ref}
            className={`absolute bottom-0 h-36 w-36 bg-${balloon.color}-400 rounded-full cursor-pointer`}
            style={{left: `${balloon.left}%`}}
            onClick={()=>handlePop(balloon.id, balloon.color)}
            >
            </div>
        )))
          :
          (
              <div className='absolute top-1/2 left-1/2 -translate-1/2'>
            <div className='text-7xl text-white font-medium'>You Scored {score} points.</div>
              <div className='flex items-center justify-evenly mt-10'>
                <button onClick={()=>window.location.reload()} className='text-white text-3xl border-3 border-white px-3 py-2 rounded-md'>Play Again</button>
                <Link to="/" className='text-white text-3xl border-3 border-white px-3 py-2 rounded-md'>View Leaderboard</Link> 
              </div>
              </div>
          )
      }
    </div>
  )
}

export default GameScreen
