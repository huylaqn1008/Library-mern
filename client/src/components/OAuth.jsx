import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/User/userSlice'
import { useNavigate } from 'react-router-dom'
import googleIcon from './../assets/google-icon.png'

export default function OAuth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider)

            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                })
            })

            const data = await res.json()
            dispatch(signInSuccess(data))
            navigate('/')
        } catch (error) {
            console.log('Could not sign in with Google', error)
        }
    }

    return (
        <button onClick={handleGoogleClick} type='button' className='bg-green-500 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            <div className='flex items-center justify-center gap-4'>
                <img style={{
                    width: '30px',
                    height: '30px',
                }} src={googleIcon} alt="Google Icon" /> Continue with Google
            </div>
        </button>
    )
}
