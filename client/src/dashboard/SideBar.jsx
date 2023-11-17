import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.png'
import { BiBook, BiShoppingBag } from 'react-icons/bi'
import { signOutUserFailure, signOutUserStart, signOutUserSuccess } from '../redux/User/userSlice'
import { useDispatch } from 'react-redux'

export default function Sidebar() {
    const [showDropdown, setShowDropdown] = useState(false)

    const [showLogoutModal, setShowLogoutModal] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown)
    }

    const handleHomeClick = () => {
        navigate('/')
        window.location.reload()
    }

    const handleSignOut = async () => {
        if (showLogoutModal) {
            try {
                dispatch(signOutUserStart())
                const res = await fetch('/api/auth/signout')
                const data = await res.json()
                if (data.success === false) {
                    dispatch(signOutUserFailure(data.message))
                } else {
                    dispatch(signOutUserSuccess())
                    window.location.reload()
                }
            } catch (error) {
                dispatch(signOutUserFailure(error.message))
            } finally {
                closeLogoutModal()
            }
        } else {
            openLogoutModal()
        }
    }

    const openLogoutModal = () => {
        setShowLogoutModal(true)
    }

    const closeLogoutModal = () => {
        setShowLogoutModal(false)
    }

    return (
        <div className='bg-[#FFC1C1] w-[240px] h-screen'>
            <div className='flex justify-center items-center shadow-md' style={{ height: '96px' }}>
                <img src={Logo} style={{ height: '50px', width: '50px' }} alt='Logo' />
                <span className='brand-name fs-4'>TMA LIBRARY</span>
            </div>
            <hr className='text-dark' />
            <div className='list-group mt-3'>
                <div className='hover:bg-[#CD9B9B] hover:text-white mt-3 text-slate-600 py-2 cursor-pointer' onClick={handleHomeClick}>
                    <i className='bi bi-house fs-5 me-2 px-3'></i>
                    <span className='fs-5'>Home</span>
                </div>
                <Link to='/admin' className='hover:bg-[#CD9B9B] hover:text-white mt-3 text-slate-600 py-2 hover:no-underline'>
                    <i className='bi bi-speedometer2 fs-5 me-2 px-3'></i>
                    <span className='fs-5'>Dashboard</span>
                </Link>
                <Link to='/admin/products' className='hover:bg-[#CD9B9B] hover:text-white mt-3 text-slate-600 py-2 hover:no-underline'>
                    <i className='bi bi-book fs-5 me-2 px-3'></i>
                    <span className='fs-5'>Products</span>
                </Link>
                <Link to='/admin/customers' className='hover:bg-[#CD9B9B] hover:text-white mt-3 text-slate-600 py-2 hover:no-underline'>
                    <i className='bi bi-people fs-5 me-2 px-3'></i>
                    <span className='fs-5'>Customers</span>
                </Link>
                <div className='mt-3'>
                    <div
                        className='hover:bg-[#CD9B9B] hover:text-white text-slate-600 py-2 cursor-pointer'
                        onClick={toggleDropdown}
                    >
                        <i className='bi bi-clipboard-data fs-5 me-2 px-3'></i>
                        <span className='fs-5'>Report</span>
                        <i className={`bi bi-chevron-${showDropdown ? 'up' : 'down'} ms-2`}></i>
                    </div>
                    {showDropdown && (
                        <div className='flex flex-col pl-8'>
                            <Link to='/admin/rents' className='hover:bg-[#CD9B9B] hover:text-white mt-3 text-slate-600 py-2 flex items-center hover:no-underline'>
                                <BiBook className='inline-block align-middle mr-5' size={20} />
                                <span className='fs-5'>Rent</span>
                            </Link>
                            <Link to='/admin/buys' className='hover:bg-[#CD9B9B] hover:text-white mt-3 text-slate-600 py-2 flex items-center hover:no-underline'>
                                <BiShoppingBag className='inline-block align-middle mr-5' size={20} />
                                <span className='fs-5'>Buy</span>
                            </Link>
                        </div>
                    )}
                </div>
                <div className='hover:bg-[#CD9B9B] hover:text-white mt-3 text-slate-600 py-2 hover:no-underline'>
                    <i className='bi bi-power fs-5 me-2 px-3'></i>
                    <span className='fs-5 cursor-pointer' onClick={handleSignOut}>Logout</span>
                </div>
            </div>

            {
                showLogoutModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="fixed inset-0 bg-black opacity-50"></div>
                        <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10">
                            <p className="text-red-500">Are you sure you want to sign out?</p>
                            <button onClick={handleSignOut} className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 mr-2">Yes</button>
                            <button onClick={closeLogoutModal} className="mt-4 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600">No</button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
