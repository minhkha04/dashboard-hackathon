import React from 'react'
import logo from '../../assets/logo.png'

const MainHeader = () => {
    return (
        <header className="h-[15vh]">
            <div className="flex flex-col items-center py-3">
                {/* Logo with futuristic glow */}
                <img
                    src={logo}
                    alt="logo"
                    className='h-16 w-16 drop-shadow-lg filter brightness-110'
                />

                {/* Title with futuristic styling */}
                <div className="mt-2 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl tracking-wider font-mono">
                        SEAL HACKATHON
                    </h1>
                </div>
            </div>
        </header>
    )
}

export default MainHeader
