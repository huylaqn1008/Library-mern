import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { BiShoppingBag } from 'react-icons/bi'
import { totalQuantity } from '../redux/Book/bookSlice'

export default function Header() {
    const { currentUser } = useSelector(state => state.user)

    const { cartTotalQuantity } = useSelector((state) => state.book)

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(totalQuantity())
    }, [dispatch])

    const navigate = useNavigate()

    const [searchTerm, setSearchTerm] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        const urlParams = new URLSearchParams(window.location.search)
        urlParams.set('searchTerm', searchTerm)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')

        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl)
        }
    }, [location.search])

    return (
        <header className='bg-slate-200 shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
                <Link to='/'>
                    <h1 className='font-bold text-sm sm:text-3xl flex flex-wrap'>
                        <span className='text-slate-500'>Library</span>
                        <span className='text-slate-700'>TMA</span>
                    </h1>
                </Link>
                <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
                    <input
                        type='text'
                        placeholder='Search...'
                        className='bg-transparent focus:outline-none w-24 sm:w-64'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button>
                        <FaSearch className='text-slate-600' />
                    </button>
                </form>
                <ul className='flex gap-5'>
                    <Link to='/'>
                        <li className='hidden sm:inline text-xl text-slate-700 hover:underline'>Home</li>
                    </Link>
                    <Link to='/about'>
                        <li className='hidden sm:inline text-xl text-slate-700 hover:underline'>About</li>
                    </Link>
                    <Link to='/cart' className='relative cursor-pointer mr-10'>
                        <BiShoppingBag className='text-3xl opacity-80' />
                        <div className='absolute w-4 h-4 rounded-full z-10 -bottom-1 -right-1 flex items-center justify-center text-[10px] bg-black text-white'>
                            {cartTotalQuantity}
                        </div>
                    </Link>
                    <Link to='/profile'> {
                        currentUser ? (
                            <img src={currentUser.avatar} alt='profile' className='rounded-full h-8 w-8 object-cover' />
                        ) : (
                            <li className='text-slate-700 hover:underline'>
                                Sign in
                            </li>
                        )
                    }
                    </Link>
                </ul>
            </div>
        </header>
    )
}
