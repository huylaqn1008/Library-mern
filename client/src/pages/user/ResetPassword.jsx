import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState('')
    const [message, setMessage] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate()

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const email = queryParams.get('email')
    const otp = queryParams.get('otp')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!newPassword) {
            setMessage('Please fill out all required fields.')
            setShowError(true)
            return
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}$/
        if (!passwordRegex.test(newPassword)) {
            setMessage(
                'Password must have at least 9 characters, including at least one lowercase letter, one uppercase letter, one digit, and one special character.'
            )
            setShowError(true)
            return
        }

        try {
            const response = await fetch('/api/auth/resetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp, newPassword }),
            })

            if (response.ok) {
                setMessage('Reset password successful')
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

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const closeSuccessCard = () => {
        setShowSuccess(false)
        navigate('/signin')
    }

    const closeErrorCard = () => {
        setShowError(false)
    }

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>Reset password for {email}</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className="mb-4 flex items-center relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        placeholder='Enter your password...'
                        className='border p-3 rounded-lg'
                        style={{ width: '100%' }}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <span
                        onClick={toggleShowPassword}
                        className="absolute right-0 top-0 mt-3 mr-3 cursor-pointer"
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </span>
                </div>
                <button
                    type='submit'
                    className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                >
                    Reset Password
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
