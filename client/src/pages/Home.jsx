import React, { useState, useEffect } from 'react'
import { Moon as Balloon } from 'lucide-react';
import { Trophy, Target } from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react";
import LoadingScreen from './Loading';
import '../styles/Home.css'
import AOS from 'aos';
import "aos/dist/aos.css";
import { Link } from 'react-router-dom';

const Home = ({score}) => {

    const [CurrentPlayer, SetCurrentPlayer] = useState({})
    const [LeaderBoardList, SetLeaderBoardList] = useState([])

    useEffect(() => {
        const fetchLeaderBoard = async () => {
            let LeaderBoard = await fetch("http://localhost:3000/leaderboard")
            LeaderBoard = await LeaderBoard.json()
            SetLeaderBoardList(LeaderBoard)
        }
        fetchLeaderBoard()
        AOS.init({
            duration: 500
        });
    }, [])


    const [savedUser, setSavedUser] = useState(false)

    const saveUser = async () => {
        setSavedUser(true)
        const response = await fetch("http://localhost:3000/save-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: user.name, email: user.email })
        })
        const data = await response.json()
        if (data.status === "100") {
            // console.log("user already exists")
            SetCurrentPlayer(data.player)
        } else {
            // console.log("user saved")
            SetCurrentPlayer(data.player)
        }
    }

    const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (isAuthenticated && !savedUser) {
        saveUser()
    }

    return (
        <>
            <div className='w-full h-screen bg-slate-950 overflow-hidden'>
                <nav data-aos={"fade-down"} className='navbar'>
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <Balloon className="text-blue-400" size={32} />
                        <span className="text-blue-400 text-2xl font-bold">Balloon Pop!</span>
                    </div>
                    <div className='text-blue-400 text-xl font-bold'>
                        BOOM X BAM
                    </div>
                    {!isAuthenticated ? <div onClick={() => loginWithRedirect()} className='loginBTN'>
                        Login
                    </div> : <div className='flex flex-col space-x-2 gap-2'>
                        <span className='text-blue-400'>Hello , <span className='text-green-300'> {user.name} </span></span>
                        <span onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className='logoutBtn'>Log Out</span>
                    </div>}
                </nav>
                <div className="container mx-auto px-4 py-8 flex justify-evenly h-[60vh]">
                    <div data-aos={"fade-right"} data-aos-delay={"300"} className="bg-gray-800 rounded-lg shadow-xl p-8 mb-8 border border-gray-700 w-[48%] h-[100%]">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-blue-400">Welcome to Balloon Pop!</h1>
                                <p className="text-gray-400 mt-2">Pop the red balloons to score points!</p>
                            </div>
                            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                                <div className="flex items-center space-x-2">
                                    <Trophy className="text-blue-400" />
                                    <span className="text-xl font-bold text-blue-400">Score: {isAuthenticated ? CurrentPlayer.highscore : "-"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                            <h2 className="text-xl font-semibold text-blue-400 mb-4">How to Play</h2>
                            <ul className="space-y-3">
                                <li className="flex items-center space-x-2">
                                    <Target className="text-green-400" size={20} />
                                    <span className="text-gray-300">Click on blue balloons to earn points (+2)</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <Target className="text-red-400" size={20} />
                                    <span className="text-gray-300">Avoid other colored balloons - they deduct points! (-1)</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div data-aos={"fade-left"} data-aos-delay={"600"} className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700 w-[48%] h-[100%]">
                        <h2 className="text-2xl font-bold text-blue-400 mb-4">Leaderboard</h2>
                        <div className="space-y-4">
                            {LeaderBoardList.map((player, index) => (
                                <div
                                    key={player.uuid4}
                                    className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600"
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-lg font-semibold text-gray-400">#{index + 1}</span>
                                        <span className="text-gray-300">{player.name}</span>
                                    </div>
                                    <span className="font-bold text-blue-400">{player.highscore} pts</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div data-aos={"fade-up"} data-aos-delay={"1200"} className='w-full flex justify-center items-center h-[20vh]'>
                     <Link to='/play' className="plybtn"> Play !
                     </Link>
                 </div>
            </div>
        </>
    )
}

export default Home
