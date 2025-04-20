import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const GameScreen = () => {

    const [balloons, setBalloons] = useState([])
    const [score, setScore] = useState(0)

    useEffect(()=> {
        const interval = setInterval(()=> {
            addBalloon() 
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const addBalloon = () => {
        const id = uuidv4()
        const ref = React.createRef()
        const left = Math.random()*90
        const newBalloon = {id, ref, left}

        setBalloons(prev => [...prev, newBalloon])

    setTimeout(()=> {
        if(ref.current) {
            gsap.to(ref.current, {
                y: -window.innerHeight,
                duration: 5,
                ease: 'linear',
                onComplete: () => handleMiss(id)
            })
        }
    }, 50)
    }

    const handlePop = id => {
        setBalloons(prev=>prev.filter(b=>b.id!==id))
        setScore(prev=>prev+5)
    }

    const handleMiss = id => {
        setBalloons(prev=>prev.filter(b=>b.id!==id))
        setScore(prev=>prev-1)
    }



  return (
    <div className='w-full h-screen bg-slate-950 relative overflow-hidden'>
      <h2 className='absolute top-4 left-4 text-white text-4xl font-semibold'>Score: {score}</h2>
      {
        balloons.map((balloon)=> (
            <div 
            key={balloon.id} 
            ref={balloon.ref}
            className='absolute bottom-0 h-36 w-36 bg-blue-400 rounded-full cursor-pointer'
            style={{left: `${balloon.left}%`}}
            onClick={()=>handlePop(balloon.id)}
            >
            </div>
        ))
      }
    </div>
  )
}

export default GameScreen
