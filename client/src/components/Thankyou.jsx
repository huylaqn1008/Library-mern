import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import ThankYou from '../assets/thankyou.gif'

export default function Thankyou() {
    const [countdown, setCountdown] = useState(10)
    const navigate = useNavigate()

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1)
        }, 1000)

        if (countdown === 0) {
            clearInterval(timer)
            navigate('/')
        }

        return () => {
            clearInterval(timer)
        }
    }, [countdown, navigate])

    return (
        <div className='flex flex-col items-center justify-center'>
            <img src={ThankYou} className='max-w-sm' />
            <p className='mt-4 text-center text-xl'>Thank you for your purchase</p>
            <p className='mt-2 text-center text-xl'>Return to the home page later {countdown}s</p>
        </div>
    )
}
