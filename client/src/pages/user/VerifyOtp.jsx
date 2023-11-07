import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function VerifyOtp() {
    const [otp, setOtp] = useState('')
    const [message, setMessage] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)
    const [resendDisabled, setResendDisabled] = useState(false)
    const [showResendMessage, setShowResendMessage] = useState(false)
    const [countdown, setCountdown] = useState(60)

    const navigate = useNavigate()

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const email = queryParams.get('email')

    useEffect(() => {
        if (countdown > 0 && resendDisabled) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown, resendDisabled])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch('/api/auth/verifyOtp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            })

            if (response.ok) {
                setMessage('OTP verification successful')
                setShowSuccess(true)
            } else {
                const errorData = await response.json()
                setMessage(errorData.error)
                setShowError(true)
            }
        } catch (error) {
            console.error('Error:', error)
            setMessage('An error occurred. Please try again later.')
            setShowError(true)
        }
    }

    const handleResend = async () => {
        try {
            const response = await fetch('/api/auth/forgotPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })

            if (response.ok) {
                setMessage('Verification code resend successfully. Please check your email.')
                setShowResendMessage(true)
                setResendDisabled(true)
                setCountdown(60)
            } else {
                const errorData = await response.json()
                setMessage(errorData.error)
                setShowError(true)
            }
        } catch (error) {
            console.error('Error:', error)
            setMessage('Failed to resend the verification code')
            setShowError(true)
        }
    }

    const closeSuccessCard = () => {
        setShowSuccess(false)
        navigate(`/resetpassword?email=${email}&otp=${otp}`)
    }

    const closeErrorCard = () => {
        setShowError(false)
    }

    const closeSuccesReSendCard = () => {
        setShowResendMessage(false)
    }

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>Verify OTP for {email}</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <input
                    type='text'
                    id='otp'
                    placeholder='Enter your OTP...'
                    className='border p-3 rounded-lg'
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
                <button
                    type='submit'
                    className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                >
                    Confirm
                </button>

                {resendDisabled ? (
                    countdown === 0 ? (
                        <span
                            onClick={handleResend}
                            className='text-center gap-4 cursor-pointer'
                            disabled={resendDisabled}
                        >
                            Resend OTP
                        </span>
                    ) : (
                        <p className='text-center text-slate-500 gap-4'>Resend OTP in {countdown} seconds</p>
                    )
                ) : (
                    <span
                        onClick={handleResend}
                        className='text-center gap-4 cursor-pointer'
                        disabled={resendDisabled}
                    >
                        Resend OTP
                    </span>
                )}
            </form>

            {showSuccess && (
                <div className='fixed inset-0 flex items-center justify-center z-50'>
                    <div className='fixed inset-0 bg-black opacity-50'></div>
                    <div className='w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10'>
                        <p className='text-green-500'>{message}</p>
                        <button
                            onClick={closeSuccessCard}
                            className='mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600'
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            {showError && (
                <div className='fixed inset-0 flex items-center justify-center z-50'>
                    <div className='fixed inset-0 bg-black opacity-50'></div>
                    <div className='w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10'>
                        <p className='text-red-500'>{message}</p>
                        <button
                            onClick={closeErrorCard}
                            className='mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600'
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            {showResendMessage && (
                <div className='fixed inset-0 flex items-center justify-center z-50'>
                    <div className='fixed inset-0 bg-black opacity-50'></div>
                    <div className='w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10'>
                        <p className='text-green-500'>{message}</p>
                        <button
                            onClick={closeSuccesReSendCard}
                            className='mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600'
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
