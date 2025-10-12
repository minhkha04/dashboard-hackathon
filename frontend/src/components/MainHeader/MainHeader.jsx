import React from 'react'
import logo_hackathon from '../../assets/logo-hackathon.png'
import logo_fpt from '../../assets/logo-fpt.png'

const MainHeader = () => {
    return (
        <header className="">
            <div className="flex flex-rol justify-center">
                {/* Logo with futuristic glow */}
                <img
                    src={logo_fpt}
                    alt="logo"
                    className='w-64 h-auto drop-shadow-lg filter brightness-110'
                />
                <img
                    src={logo_hackathon}
                    alt="logo"
                    className='w-64 h-auto drop-shadow-lg filter brightness-110'
                />
            </div>
        </header>
    )
}

export default MainHeader
