import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function SignUp() {
    const [formData, setFormData] = useState({})
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showError, setShowError] = useState(false)
    const [formValid, setFormValid] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        validateForm();
    }, [formData]);

    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData({
            ...formData,
            [id]: value,
        })
    }

    const isPasswordValid = (password) => {
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&()-_^+/#~])[A-Za-z\d@$!%*?&()-_^+/#~]{9,}$/
        return passwordPattern.test(password)
    }

    const validateForm = () => {
        if (formData.username && formData.email && formData.password) {
            setFormValid(true)
        } else {
            setFormValid(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        validateForm()

        if (!formValid) {
            setError('Please fill out all required fields.')
            setShowError(true)
            return
        }

        try {
            setLoading(true)

            if (!isPasswordValid(formData.password)) {
                setLoading(false)
                setError(
                    'Password must have more than 9 characters, capital letters, numbers and special characters.'
                )
                setShowError(true)
                return
            }

            const res = await fetch('api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            const data = await res.json()

            if (data.success === false) {
                setLoading(false)
                setError(data.message)
                setShowError(true)
                return
            }

            setLoading(false)
            setError(null)
            navigate('/signin')
        } catch (error) {
            setLoading(false)
            setError(error.message)
            setShowError(true)
        }
    }

    const closeErrorCard = () => {
        setShowError(false)
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>Sign up</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input
                    onChange={handleChange}
                    type='text'
                    id='username'
                    placeholder='Enter your full name...'
                    className='border p-3 rounded-lg'
                />
                <input
                    onChange={handleChange}
                    type='email'
                    id='email'
                    placeholder='Enter your email...'
                    className='border p-3 rounded-lg'
                />
                <div className="mb-4 flex items-center">
                    <input
                        onChange={handleChange}
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        placeholder='Enter your password...'
                        className='border p-3 rounded-lg'
                        style={{ width: '100%' }}
                    />
                    <span
                        onClick={toggleShowPassword}
                        className="absolute flex cursor-pointer"
                        style={{ right: '38%' }}
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </span>
                </div>
                <button
                    disabled={loading}
                    className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                >
                    {loading ? 'Loading...' : 'Sign up'}
                </button>
            </form>
            <div className='flex gap-2 mt-5'>
                <p>Have an account?</p>
                <Link to={'/signin'}>
                    <span className='text-blue-700'>Sign in</span>
                </Link>
            </div>

            {showError && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10">
                        <p className='text-red-500'>{error}</p>
                        <button onClick={closeErrorCard} className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">Close</button>
                    </div>
                </div>
            )}
        </div>
    )
}