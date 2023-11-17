import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { BiShoppingBag } from 'react-icons/bi'
import { totalQuantity } from '../redux/Book/bookSlice'
import { FaBell } from 'react-icons/fa'

export default function Header() {
    const { currentUser } = useSelector(state => state.user)
    const { cartTotalQuantity } = useSelector((state) => state.book)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [searchTerm, setSearchTerm] = useState('')

    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const [allNotifications, setAllNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        dispatch(totalQuantity())
    }, [dispatch])

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

    useEffect(() => {
        console.log('Fetching notifications...')
        const fetchUserNotifications = async () => {
            try {
                const response = await fetch(`/api/rent/getNotifications/${currentUser.email}`)
                const data = await response.json()
                console.log('Data received:', data)
                setAllNotifications(data.notifications);
                setUnreadNotifications(data.notifications.filter((notification) => !notification.read));
            } catch (error) {
                console.error('Error fetching notifications:', error)
            }
        }

        fetchUserNotifications()
    }, [currentUser])

    const handleNotificationClick = (notification) => {
        // Mark the clicked notification as read
        const updatedUnreadNotifications = unreadNotifications.filter(
            (n) => n.date !== notification.date
        );
        setUnreadNotifications(updatedUnreadNotifications);

        // Perform any additional actions (e.g., navigate to a notification details page)
        // You can add your logic here
    };

    return (
        <header className='bg-slate-200 shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
                <Link to='/' className='hover:no-underline'>
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
                    <Link to='/cart' className='relative cursor-pointer'>
                        <BiShoppingBag className='text-3xl opacity-80' />
                        <div className='absolute w-4 h-4 rounded-full z-10 -bottom-1 -right-1 flex items-center justify-center text-[10px] bg-black text-white'>
                            {cartTotalQuantity}
                        </div>
                    </Link>
                    <div className='relative'>
                        <FaBell
                            className='text-3xl cursor-pointer'
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                setUnreadNotifications([]); // Mark all notifications as read when opening the notification panel
                            }}
                        />
                        {showNotifications && (
                            <div className='absolute right-0 mt-2 w-64 bg-white border border-gray-300 shadow-lg rounded-lg overflow-auto max-h-96 z-20'>
                                <div className='p-2'>
                                    {allNotifications.length === 0 ? (
                                        <p className='text-gray-500'>No notifications</p>
                                    ) : (
                                        allNotifications.map((notification, index) => (
                                            <div
                                                key={index}
                                                className={`mb-3 border-b border-gray-300 cursor-pointer ${unreadNotifications.includes(notification)
                                                    ? 'font-bold'
                                                    : ''
                                                    }`}
                                                onClick={() => handleNotificationClick(notification)}
                                            >
                                                <p className='text-sm text-gray-700'>
                                                    {notification.message}
                                                </p>
                                                <p className='text-xs text-gray-500'>{notification.date}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                        {unreadNotifications.length > 0 && (
                            <div className='absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>
                                {unreadNotifications.length}
                            </div>
                        )}
                    </div>
                    <Link to='/profile'> {
                        currentUser ? (
                            <img src={currentUser.avatar} alt='profile' className='rounded-full h-8 w-8 object-cover' />
                        ) : (
                            <li className='sm:inline text-xl text-slate-700 hover:underline'>
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
