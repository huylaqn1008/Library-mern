import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email) {
            setMessage('Please enter your email.')
            setShowError(true)
            return
        }

        try {
            const response = await fetch('/api/auth/forgotPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (response.ok) {
                setMessage('Verification code sent successfully. Please check your email.')
                setShowSuccess(true)
                setShowError(false)
            } else {
                setMessage(data.error)
                setShowError(true)
            }
        } catch (error) {
            console.log(error)
            setMessage('Failed to send the verification code')
            setShowError(true)
        }
    }

    const closeSuccessCard = () => {
        setShowSuccess(false)
        navigate('/verifycode')
    }

    const closeErrorCard = () => {
        setShowError(false)
    }

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>Forgot password</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <input
                    type='email'
                    id='email'
                    placeholder='Enter your email...'
                    className='border p-3 rounded-lg'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button
                    type='submit'
                    className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                >
                    Send code
                </button>
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
        </div>
    )
}
