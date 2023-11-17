import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { signInFailure, signInStart, signInSuccess } from '../../redux/User/userSlice'
import OAuth from './../../components/OAuth'

export default function SignIn() {
    const [formData, setFormData] = useState({})
    const { loading, error } = useSelector((state) => state.user)
    const [showError, setShowError] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.email || !formData.password) {
            dispatch(signInFailure("Please fill in email and password."))
            setShowError(true)
            return
        }

        try {
            dispatch(signInStart())
            const res = await fetch('api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            const data = await res.json()
            console.log(data)

            if (res.ok) {
                dispatch(signInSuccess(data))

                if (Number(data.role) === 0) {
                    console.log("Redirecting to /admin")
                    navigate('/admin', { replace: true })
                } else {
                    console.log("Redirecting to /")
                    navigate('/', { replace: true })
                }
            } else {
                if (data.error === 'Email not registered!') {
                    dispatch(signInFailure("Email not registered!"))
                    setShowError(true)
                    return
                }
                if (data.error === 'Invalid password!') {
                    dispatch(signInFailure("Invalid password!"))
                    setShowError(true)
                    return
                } else {
                    dispatch(signInFailure(data.error || 'An error occurred.'))
                }
            }

            dispatch(signInSuccess(data))
        } catch (error) {
            dispatch(signInFailure(error.message))
            setShowError(true)
        }
    }

    const closeErrorCard = () => {
        setShowError(false)
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>
                Sign in
            </h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input onChange={handleChange} type='email' id='email' placeholder='Enter your email...' className='border p-3 rounded-lg' />
                <div className="mb-4 flex items-center relative">
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
                        className="absolute right-0 top-0 mt-3 mr-3 cursor-pointer"
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </span>
                </div>
                <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                    {loading ? 'Loading...' : 'Sign in'}
                </button>
                <OAuth />
            </form>
            <div className='flex gap-2 mt-5 justify-between'>
                <div className='flex'>
                    <p>Don't have an account?</p>
                    <Link to={'/signup'}>
                        <span className='text-blue-700 ml-1'>Sign up</span>
                    </Link>
                </div>
                <Link to={'/forgotpassword'} >
                    <span className='text-red-500'>Forgot Password</span>
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
