import React from 'react'

export default function ForgotPassword() {
    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>
                Forgot password
            </h1>
            <form className='flex flex-col gap-4'>
                <input type='email' id='email' placeholder='Enter your email...' className='border p-3 rounded-lg' />
                <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                    Send code
                </button>
            </form>
        </div>
    )
}
