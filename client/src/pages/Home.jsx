import React, { useState } from 'react'
import { Moon as Balloon } from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react";
import '../styles/Home.css'

const Home = () => {

    const [savedUser, setSavedUser] = useState(false)

    const saveUser = async () => {
        console.log(user.name)
        setSavedUser(true)
        await fetch("http://localhost:3000/save", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name:user.name, email: user.email})
        })
    }

    const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    if (isAuthenticated && !savedUser) {
        saveUser()
    }

    return (
        <>
            <div className='w-full h-screen bg-slate-950'>
                <nav className='navbar'>
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
                        <span onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className='cursor-pointer bg-red-500 hover:bg-red-700 transition-all w-fit px-2 text-white rounded-md'>LogOut</span>
                    </div>}
                </nav>
            </div>
        </>
    )
}

export default Home